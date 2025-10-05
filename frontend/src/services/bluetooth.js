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
      console.log('Requesting any Bluetooth device...');

      // Check if Web Bluetooth API is supported
      if (!navigator.bluetooth) {
        throw new Error('Web Bluetooth API is not supported in this browser. Please use a Chromium-based browser (Chrome, Edge, Opera).');
      }

      // Request any Bluetooth LE device for prototype purposes
      this.device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: []  // Empty to explore all services dynamically
      });

      console.log(`Connected to device: ${this.device.name || this.device.id}`);

      this.device.addEventListener('gattserverdisconnected', this.onDisconnected.bind(this));

      // Connect to GATT server
      this.server = await this.device.gatt.connect();

      // Get all primary services and explore them dynamically
      await this.discoverAllServices();

      this.isConnected = true;
      this.notifyListeners('connected', { device: this.device });

      return { success: true, device: this.device };

    } catch (error) {
      console.error('Bluetooth connection failed:', error);

      // Provide user-friendly error messages
      let userMessage = error.message;
      if (error.code === 8 || error.message.includes('NotFoundError')) {
        userMessage = 'No Bluetooth devices found. Please ensure your device is nearby, powered on, and in pairing mode.';
      } else if (error.code === 2 || error.message.includes('NotAllowedError')) {
        userMessage = 'Permission denied. Please allow access to Bluetooth devices when prompted.';
      } else if (error.message.includes('NotSupportedError')) {
        userMessage = 'Bluetooth is not supported on this device or browser.';
      } else if (error.message.includes('NetworkError')) {
        userMessage = 'Connection failed. Please ensure your device is not already connected to another device.';
      }

      return { success: false, error: userMessage };
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

  // Discover all available services and characteristics dynamically
  async discoverAllServices() {
    try {
      console.log('Discovering all available services...');

      if (!this.server) {
        throw new Error('No GATT server available. Please reconnect the device.');
      }

      const services = await this.server.getPrimaryServices();

      if (services.length === 0) {
        console.warn('No services found on this device.');
        return;
      }

      for (const service of services) {
        console.log(`Service: ${service.uuid}`);
        this.services.set(service.uuid, service);

        // Get all characteristics for this service
        await this.discoverCharacteristicsForService(service);
      }
    } catch (error) {
      console.error('Service discovery failed:', error);
      throw new Error(`Failed to discover services: ${error.message}`);
    }
  }

  // Discover characteristics for a specific service
  async discoverCharacteristicsForService(service) {
    try {
      const characteristics = await service.getCharacteristics();
      console.log(`  Found ${characteristics.length} characteristics`);

      for (const characteristic of characteristics) {
        console.log(`  Characteristic: ${characteristic.uuid}`);
        this.characteristics.set(characteristic.uuid, characteristic);

        // Try to read the characteristic value if readable
        await this.tryReadCharacteristic(characteristic);

        // Try to subscribe to notifications if available
        await this.tryStartNotifications(characteristic);
      }
    } catch (error) {
      console.warn(`  Cannot discover characteristics for service ${service.uuid}:`, error);
    }
  }

  // Try to read a characteristic value
  async tryReadCharacteristic(characteristic) {
    try {
      if (characteristic.properties.read) {
        const value = await characteristic.readValue();
        console.log(`  Read value:`, new Uint8Array(value.buffer));

        // Parse the data based on characteristic UUID or store raw data
        const parsedData = this.parseCharacteristicData(characteristic.uuid, value);
        if (parsedData) {
          this.notifyListeners('data', parsedData);
        }
      }
    } catch (error) {
      console.warn(`  Cannot read characteristic ${characteristic.uuid}:`, error);
    }
  }

  // Try to start notifications for a characteristic
  async tryStartNotifications(characteristic) {
    try {
      if (characteristic.properties.notify) {
        await characteristic.startNotifications();
        characteristic.addEventListener('characteristicvaluechanged', this.onCharacteristicValueChanged.bind(this));
        console.log(`  Started notifications for ${characteristic.uuid}`);
      }
    } catch (error) {
      console.warn(`  Cannot start notifications for ${characteristic.uuid}:`, error);
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

    console.log(`Notification from ${characteristic.uuid}:`, new Uint8Array(value.buffer));

    // Parse the data based on characteristic UUID or store raw data
    const data = this.parseCharacteristicData(characteristic.uuid, value);

    if (data) {
      this.notifyListeners('data', data);
    }
  }

  // Parse characteristic data based on UUID
  parseCharacteristicData(uuid, value) {
    const buffer = value.buffer;
    const dataView = new DataView(buffer);

    // Handle known characteristic UUIDs
    switch (uuid) {
      case 0x2A37: // Heart Rate Measurement
        return this.parseHeartRateMeasurement(dataView);

      case 0x2A39: // Heart Rate Control Point
        return { type: 'heart_rate_control', value: dataView.getUint8(0) };

      case 0x2A9C: // Body Sensor Location
        return { type: 'body_sensor_location', location: dataView.getUint8(0) };

      case 0x2A19: // Battery Level
        return { type: 'battery_level', level: dataView.getUint8(0) };

      case 0x2A25: // Serial Number String
      case 0x2A29: // Manufacturer Name String
      case 0x2A24: // Model Number String
        // String characteristics
        const decoder = new TextDecoder('utf-8');
        return { type: 'device_info', uuid, value: decoder.decode(value) };

      default:
        // Unknown characteristic - store raw data
        return {
          type: 'unknown',
          uuid,
          value: Array.from(new Uint8Array(buffer)),
          timestamp: new Date()
        };
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
        if (char.properties.read) {
          const value = await char.readValue();
          const decoder = new TextDecoder('utf-8');
          info[char.uuid] = decoder.decode(value);
        }
      }

      // Also try to get battery level if available
      const batteryLevel = await this.getBatteryLevel();
      if (batteryLevel !== null) {
        info.batteryLevel = batteryLevel;
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
      if (batteryLevelChar && batteryLevelChar.properties.read) {
        const value = await batteryLevelChar.readValue();
        return value.getUint8(0);
      }

      return null;
    } catch (error) {
      console.error('Failed to get battery level:', error);
      return null;
    }
  }
}

// Create singleton instance
const bluetoothService = new BluetoothService();

export default bluetoothService;
