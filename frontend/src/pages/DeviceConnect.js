import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBluetooth } from '../hooks/useBluetooth';
import { useAuth } from '../hooks/useAuth';
import {
  Smartphone,
  Bluetooth,
  BluetoothConnected,
  BluetoothOff,
  Heart,
  Activity,
  Battery,
  Info,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const DeviceConnect = () => {
  const { user } = useAuth();
  const { device, isConnected, healthData, deviceInfo, error, connect, disconnect } = useBluetooth();
  const [connecting, setConnecting] = useState(false);
  const navigate = useNavigate();

  const handleConnect = async () => {
    setConnecting(true);
    const result = await connect();

    if (result.success) {
      toast.success('Successfully connected to your smartwatch!');
      // Redirect to dashboard after successful connection
      setTimeout(() => navigate('/dashboard'), 2000);
    } else {
      toast.error(`Connection failed: ${result.error}`);
    }

    setConnecting(false);
  };

  const handleDisconnect = async () => {
    await disconnect();
    toast.info('Disconnected from smartwatch');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-200 rounded-full opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-20 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gradient title-glow mb-4">
            Connect Your Smartwatch
          </h1>
          <p className="text-gray-600 text-lg animate-slide-in">
            Connect your Bluetooth-enabled smartwatch to start monitoring your health data
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Connection Panel */}
          <div className="card p-8 animate-fade-in">
            <div className="flex items-center mb-6">
              <div className="relative mr-4">
                <Smartphone className="h-10 w-10 text-blue-600 animate-bounce" />
              </div>
              <h2 className="text-2xl font-bold text-gradient">Device Connection</h2>
            </div>

            {!isConnected ? (
              <div className="text-center">
                <div className="relative mb-6">
                  <BluetoothOff className="h-20 w-20 text-gray-400 mx-auto animate-pulse-custom" />
                  <div className="absolute inset-0 h-20 w-20 text-gray-300 animate-spin opacity-20"></div>
                </div>
                <p className="text-gray-600 mb-8 text-lg animate-slide-in">
                  Your smartwatch is not connected. Click the button below to start the pairing process.
                </p>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 animate-fade-in">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-2 animate-bounce" />
                      <p className="text-red-800">{error}</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleConnect}
                  disabled={connecting}
                  className="btn-primary px-8 py-4 text-lg font-medium hover-lift animate-fade-in"
                >
                  {connecting ? (
                    <span className="flex items-center">
                      <span className="loading-dots mr-2">Connecting</span>
                      <Bluetooth className="h-5 w-5 animate-spin ml-2" />
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Bluetooth className="h-5 w-5 mr-2" />
                      Connect Smartwatch
                    </span>
                  )}
                </button>

                <div className="mt-8 text-sm text-gray-500 animate-fade-in" style={{animationDelay: '0.3s'}}>
                  <p className="mb-4 font-medium">Supported devices:</p>
                  <div className="grid grid-cols-2 gap-2 text-left">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      <span>Fitbit devices</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>Garmin watches</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                      <span>Apple Watch</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      <span>Samsung Galaxy Watch</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center animate-fade-in">
                <div className="relative mb-6">
                  <BluetoothConnected className="h-20 w-20 text-green-600 mx-auto animate-heartbeat" />
                  <div className="absolute inset-0 h-20 w-20 bg-green-400 rounded-full animate-pulse opacity-20"></div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 animate-bounce">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-3 animate-spin" />
                    <p className="text-green-800 font-semibold text-lg">Successfully connected!</p>
                  </div>
                </div>

                <div className="card p-6 mb-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
                  <h3 className="font-bold mb-4 flex items-center">
                    <Info className="h-5 w-5 text-blue-600 mr-2" />
                    Device Information
                  </h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex justify-between">
                      <span><strong>Name:</strong></span>
                      <span>{device?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span><strong>ID:</strong></span>
                      <span className="font-mono">{device?.id || 'N/A'}</span>
                    </div>
                    {deviceInfo && (
                      <>
                        <div className="flex justify-between">
                          <span><strong>Manufacturer:</strong></span>
                          <span>{deviceInfo[0x2A29] || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span><strong>Model:</strong></span>
                          <span>{deviceInfo[0x2A24] || 'N/A'}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleDisconnect}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium hover-lift transition-all duration-300"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>

          {/* Health Data Preview */}
          <div className="card p-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center mb-6">
              <div className="relative mr-4">
                <Activity className="h-10 w-10 text-green-600 animate-pulse-custom" />
              </div>
              <h2 className="text-2xl font-bold text-gradient">Live Health Data</h2>
            </div>

            {isConnected ? (
              <div className="space-y-6">
                {/* Heart Rate */}
                {healthData.heart_rate && (
                  <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-6 hover-lift">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="relative mr-4">
                          <Heart className="h-6 w-6 text-red-600 animate-heartbeat" />
                          <div className="absolute inset-0 h-6 w-6 text-red-400 animate-pulse-custom opacity-50"></div>
                        </div>
                        <span className="font-medium text-lg">Heart Rate</span>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-bold text-red-600">
                          {healthData.heart_rate.heartRate} BPM
                        </span>
                        {healthData.heart_rate.contactDetected && (
                          <p className="text-sm text-red-600 mt-1 flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                            Contact detected
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Battery Level */}
                {deviceInfo && (
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 hover-lift">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Battery className="h-6 w-6 text-blue-600 mr-4 animate-bounce" />
                        <span className="font-medium text-lg">Battery</span>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">
                        {deviceInfo.batteryLevel || 'N/A'}%
                      </span>
                    </div>
                  </div>
                )}

                {/* Connection Status */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6 animate-pulse-custom">
                  <div className="flex items-center">
                    <div className="status-indicator status-connected mr-3"></div>
                    <span className="text-green-800 font-medium">
                      Real-time data streaming active
                    </span>
                  </div>
                </div>

                {!healthData.heart_rate && !deviceInfo?.batteryLevel && (
                  <div className="text-center text-gray-500 py-12 animate-fade-in">
                    <div className="relative mb-6">
                      <Activity className="h-16 w-16 mx-auto opacity-50 animate-bounce" />
                    </div>
                    <p className="text-lg mb-2">Waiting for health data...</p>
                    <p className="text-sm">Start exercising or check your watch settings</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12 animate-fade-in">
                <div className="relative mb-6">
                  <Activity className="h-16 w-16 mx-auto opacity-50 animate-pulse-custom" />
                </div>
                <p className="text-lg">Connect your device to see live health data</p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 card p-8 animate-fade-in" style={{animationDelay: '0.4s'}}>
          <h3 className="text-2xl font-bold text-gradient mb-6 text-center">
            How to Connect Your Smartwatch
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 glass rounded-lg hover-lift">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">1</span>
              </div>
              <h4 className="font-bold text-lg mb-2">Enable Bluetooth</h4>
              <p className="text-gray-600">Make sure Bluetooth is enabled on your device</p>
            </div>
            <div className="text-center p-6 glass rounded-lg hover-lift">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-green-600 font-bold text-xl">2</span>
              </div>
              <h4 className="font-bold text-lg mb-2">Pair Device</h4>
              <p className="text-gray-600">Click "Connect Smartwatch" and select your device</p>
            </div>
            <div className="text-center p-6 glass rounded-lg hover-lift">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-purple-600 font-bold text-xl">3</span>
              </div>
              <h4 className="font-bold text-lg mb-2">Grant Permissions</h4>
              <p className="text-gray-600">Allow access to health data when prompted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceConnect;
