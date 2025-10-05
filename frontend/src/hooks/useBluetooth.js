import { useState, useEffect, useCallback } from 'react';
import bluetoothService from '../services/bluetooth';

export const useBluetooth = () => {
  const [device, setDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [healthData, setHealthData] = useState({});
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [error, setError] = useState(null);

  // Handle Bluetooth events
  const handleBluetoothEvent = useCallback((event, data) => {
    switch (event) {
      case 'connected':
        setDevice(data.device);
        setIsConnected(true);
        setError(null);
        // Get device info after connection
        bluetoothService.getDeviceInfo().then(info => {
          setDeviceInfo(info);
        });
        break;

      case 'disconnected':
        setDevice(null);
        setIsConnected(false);
        setDeviceInfo(null);
        setHealthData({});
        break;

      case 'data':
        setHealthData(prev => ({
          ...prev,
          [data.type]: data,
          timestamp: new Date()
        }));
        break;

      default:
        break;
    }
  }, []);

  useEffect(() => {
    bluetoothService.addEventListener(handleBluetoothEvent);

    return () => {
      bluetoothService.removeEventListener(handleBluetoothEvent);
    };
  }, [handleBluetoothEvent]);

  const connect = async () => {
    setError(null);
    const result = await bluetoothService.connect();

    if (!result.success) {
      setError(result.error);
    }

    return result;
  };

  const disconnect = async () => {
    await bluetoothService.disconnect();
  };

  return {
    device,
    isConnected,
    healthData,
    deviceInfo,
    error,
    connect,
    disconnect,
    batteryLevel: deviceInfo ? deviceInfo.batteryLevel : null
  };
};
