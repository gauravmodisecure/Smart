// Mock data generator for testing without physical Bluetooth devices
class MockDataGenerator {
  constructor() {
    this.isRunning = false;
    this.intervals = [];
    this.callbacks = new Set();
  }

  // Start generating mock health data
  start() {
    if (this.isRunning) return;

    this.isRunning = true;

    // Generate heart rate data every 3 seconds
    const heartRateInterval = setInterval(() => {
      const heartRate = this.generateHeartRate();
      this.notifyListeners('heart_rate', heartRate);
    }, 3000);

    // Generate step data every 10 seconds
    const stepsInterval = setInterval(() => {
      const steps = this.generateSteps();
      this.notifyListeners('steps', steps);
    }, 10000);

    // Generate SpO2 data every 15 seconds
    const spo2Interval = setInterval(() => {
      const spo2 = this.generateSpO2();
      this.notifyListeners('spo2', spo2);
    }, 15000);

    // Generate battery data every 30 seconds
    const batteryInterval = setInterval(() => {
      const battery = this.generateBatteryLevel();
      this.notifyListeners('battery', battery);
    }, 30000);

    this.intervals.push(heartRateInterval, stepsInterval, spo2Interval, batteryInterval);

    console.log('Mock data generator started');
  }

  // Stop generating mock data
  stop() {
    if (!this.isRunning) return;

    this.isRunning = false;
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];

    console.log('Mock data generator stopped');
  }

  // Generate realistic heart rate data
  generateHeartRate() {
    const baseRate = 72;
    const time = Date.now() / 1000;
    const variation = Math.sin(time * 0.01) * 15 + Math.random() * 10;
    const heartRate = Math.round(baseRate + variation);

    return {
      type: 'heart_rate',
      heartRate: Math.max(50, Math.min(180, heartRate)),
      contactDetected: Math.random() > 0.1,
      contactSupported: true,
      energyExpended: Math.random() > 0.5 ? Math.floor(Math.random() * 100) : undefined,
      rrIntervals: [],
      timestamp: new Date()
    };
  }

  // Generate step count data
  generateSteps() {
    const baseSteps = 100;
    const randomIncrease = Math.floor(Math.random() * 50);

    return {
      type: 'steps',
      count: baseSteps + randomIncrease,
      distance: Math.random() * 0.5, // km
      calories: Math.floor(Math.random() * 50),
      timestamp: new Date()
    };
  }

  // Generate SpO2 data
  generateSpO2() {
    const baseSpO2 = 98;
    const variation = Math.sin(Date.now() / 10000) * 2 + Math.random() * 1;
    const spo2 = Math.round((baseSpO2 + variation) * 10) / 10;

    return {
      type: 'spo2',
      percentage: Math.max(90, Math.min(100, spo2)),
      confidence: Math.floor(Math.random() * 30) + 70,
      timestamp: new Date()
    };
  }

  // Generate battery level data
  generateBatteryLevel() {
    return {
      type: 'battery',
      level: Math.floor(Math.random() * 40) + 60, // 60-100%
      charging: Math.random() > 0.8,
      timestamp: new Date()
    };
  }

  // Add event listener
  addEventListener(callback) {
    this.callbacks.add(callback);
  }

  // Remove event listener
  removeEventListener(callback) {
    this.callbacks.delete(callback);
  }

  // Notify all listeners
  notifyListeners(eventType, data) {
    this.callbacks.forEach(callback => {
      try {
        callback(eventType, data);
      } catch (error) {
        console.error('Error in mock data event listener:', error);
      }
    });
  }

  // Generate historical data for charts
  generateHistoricalData(type, days = 7) {
    const data = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);

      switch (type) {
        case 'heart_rate':
          data.push({
            date: date.toISOString().split('T')[0],
            value: Math.floor(Math.random() * 30) + 65, // 65-95 BPM average
            timestamp: date
          });
          break;

        case 'steps':
          data.push({
            date: date.toISOString().split('T')[0],
            value: Math.floor(Math.random() * 8000) + 4000, // 4000-12000 steps
            timestamp: date
          });
          break;

        case 'spo2':
          data.push({
            date: date.toISOString().split('T')[0],
            value: Math.floor(Math.random() * 5) + 95, // 95-100%
            timestamp: date
          });
          break;

        case 'sleep':
          data.push({
            date: date.toISOString().split('T')[0],
            deep: Math.random() * 2 + 1, // 1-3 hours
            light: Math.random() * 3 + 2, // 2-5 hours
            rem: Math.random() * 1.5 + 0.5, // 0.5-2 hours
            timestamp: date
          });
          break;

        default:
          break;
      }
    }

    return data;
  }
}

// Create singleton instance
const mockDataGenerator = new MockDataGenerator();

export default mockDataGenerator;
