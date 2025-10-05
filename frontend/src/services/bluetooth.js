class BluetoothService {
  constructor() {
    this.device = null;
    this.server = null;
    this.services = new Map();
    this.characteristics = new Map();
    this.isConnected = false;
    this.listeners = new Set();
  }

  // Request device and connect
  async connect() {
    try {
      // Define the services we're interested in
      const serviceUuids = [
        'heart_rate',           // Heart Rate Service
        'device_information',   // Device Information Service
        0x180D,                 // Heart Rate Service UUID
        0x180F,                 // Battery Service UUID
        0x1810,                 // Blood Pressure Service UUID
        0x1813,                 // Glucose Service UUID
      ];

      // Request Bluetooth device
      this.device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: serviceUuids },
          { namePrefix: 'Fitbit' },
          { namePrefix: 'Garmin' },
          { namePrefix: 'Apple' },
          { namePrefix: 'Samsung' }
        ],
        optionalServices: serviceUuids
      });

      this.device.addEventListener('gattserverdisconnected', this.onDisconnected.bind(this));

      // Connect to GATT server
      this.server = await this.device.gatt.connect();

      // Get primary services
      await this.discoverServices();

      this.isConnected = true;
      this.notifyListeners('connected', { device: this.device });

      return { success: true, device: this.device };

    } catch (error) {
      console.error('Bluetooth connection failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Disconnect from device
  async disconnect() {
    if (this.device && this.device.gatt.connected) {
      this.device.gatt.disconnect();
    }
    this.isConnected = false;
    this.device = null;
    this.server = null;
    this.services.clear();
    this.characteristics.clear();
    this.notifyListeners('disconnected');
  }

  // Discover available services and characteristics
  async discoverServices() {
    try {
      const services = await this.server.getPrimaryServices();

      for (const service of services) {
        this.services.set(service.uuid, service);

        const characteristics = await service.getCharacteristics();
        for (const characteristic of characteristics) {
          this.characteristics.set(characteristic.uuid, characteristic);

          // Start notifications for relevant characteristics
          if (this.shouldStartNotifications(characteristic)) {
            await this.startNotifications(characteristic);
          }
        }
      }
    } catch (error) {
      console.error('Service discovery failed:', error);
    }
  }

  // Check if we should start notifications for a characteristic
  shouldStartNotifications(characteristic) {
    const notifyUuids = [
      0x2A37, // Heart Rate Measurement
      0x2A39, // Heart Rate Control Point
      0x2A9C, // Body Sensor Location
      0x2A53, // RCS Feature
      0x2A54, // RCS Status
    ];
    return notifyUuids.includes(characteristic.uuid);
  }

  // Start notifications for a characteristic
  async startNotifications(characteristic) {
    try {
      await characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', this.onCharacteristicValueChanged.bind(this));
      console.log(`Started notifications for ${characteristic.uuid}`);
    } catch (error) {
      console.error(`Failed to start notifications for ${characteristic.uuid}:`, error);
    }
  }

  // Handle characteristic value changes
  onCharacteristicValueChanged(event) {
    const characteristic = event.target;
    const value = event.target.value;
    const data = this.parseCharacteristicData(characteristic.uuid, value);

    if (data) {
      this.notifyListeners('data', data);
    }
  }

  // Parse characteristic data based on UUID
  parseCharacteristicData(uuid, value) {
    const buffer = value.buffer;
    const dataView = new DataView(buffer);

    switch (uuid) {
      case 0x2A37: // Heart Rate Measurement
        return this.parseHeartRateMeasurement(dataView);

      case 0x2A39: // Heart Rate Control Point
        return { type: 'heart_rate_control', value: dataView.getUint8(0) };

      case 0x2A9C: // Body Sensor Location
        return { type: 'body_sensor_location', location: dataView.getUint8(0) };

      default:
        return { type: 'unknown', uuid, value: Array.from(new Uint8Array(buffer)) };
    }
  }

  // Parse heart rate measurement data
  parseHeartRateMeasurement(dataView) {
    let index = 0;
    const flags = dataView.getUint8(index++);
    const rate16Bits = flags & 0x1;
    const contactDetected = flags & 0x2;
    const contactSupported = flags & 0x4;
    const energyExpended = flags & 0x8;
    const rrInterval = flags & 0x10;

    let heartRate;
    if (rate16Bits) {
      heartRate = dataView.getUint16(index, true);
      index += 2;
    } else {
      heartRate = dataView.getUint8(index++);
    }

    let energy;
    if (energyExpended) {
      energy = dataView.getUint16(index, true);
      index += 2;
    }

    let rrIntervals = [];
    if (rrInterval) {
      while (index < dataView.byteLength) {
        rrIntervals.push(dataView.getUint16(index, true));
        index += 2;
      }
    }

    return {
      type: 'heart_rate',
      heartRate,
      contactDetected,
      contactSupported,
      energyExpended,
      rrIntervals,
      timestamp: new Date()
    };
  }

  // Handle disconnection
  onDisconnected() {
    this.isConnected = false;
    this.device = null;
    this.server = null;
    this.services.clear();
    this.characteristics.clear();
    this.notifyListeners('disconnected');
  }

  // Add event listener
  addEventListener(callback) {
    this.listeners.add(callback);
  }

  // Remove event listener
  removeEventListener(callback) {
    this.listeners.delete(callback);
  }

  // Notify all listeners
  notifyListeners(event, data) {
    this.listeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Error in Bluetooth event listener:', error);
      }
    });
  }

  // Get device information
  async getDeviceInfo() {
    try {
      const deviceInfoService = this.services.get(0x180A); // Device Information Service
      if (!deviceInfoService) return null;

      const characteristics = await deviceInfoService.getCharacteristics();

      const info = {};
      for (const char of characteristics) {
        const value = await char.readValue();
        const decoder = new TextDecoder('utf-8');
        info[char.uuid] = decoder.decode(value);
      }

      return info;
    } catch (error) {
      console.error('Failed to get device info:', error);
      return null;
    }
  }

  // Get battery level
  async getBatteryLevel() {
    try {
      const batteryService = this.services.get(0x180F); // Battery Service
      if (!batteryService) return null;

      const batteryLevelChar = await batteryService.getCharacteristic(0x2A19); // Battery Level
      const value = await batteryLevelChar.readValue();

      return value.getUint8(0);
    } catch (error) {
      console.error('Failed to get battery level:', error);
      return null;
    }
  }
}

// Create singleton instance
const bluetoothService = new BluetoothService();

export default bluetoothService;
