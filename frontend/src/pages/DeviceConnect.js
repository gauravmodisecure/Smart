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
  CheckCircle,
  Database,
  Eye,
  EyeOff,
  Loader2,
  Wifi,
  WifiOff
} from 'lucide-react';
import toast from 'react-hot-toast';

const DeviceConnect = () => {
  const { user } = useAuth();
  const { device, isConnected, healthData, deviceInfo, error, connect, disconnect } = useBluetooth();
  const [connecting, setConnecting] = useState(false);
  const [showRawData, setShowRawData] = useState(false);
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

  const getStatusIcon = () => {
    if (connecting) return <Loader2 className="h-6 w-6 animate-spin text-blue-600" />;
    if (isConnected) return <Wifi className="h-6 w-6 text-green-600" />;
    return <WifiOff className="h-6 w-6 text-gray-400" />;
  };

  const getStatusText = () => {
    if (connecting) return 'Connecting...';
    if (isConnected) return 'Connected';
    return 'Disconnected';
  };

  const getStatusColor = () => {
    if (connecting) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (isConnected) return 'text-green-600 bg-green-50 border-green-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Smartwatch Bluetooth Connection
          </h1>
          <p className="text-gray-600 text-lg">
            Connect to any Bluetooth LE device and explore its data
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Connection Panel */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <Smartphone className="h-10 w-10 text-gray-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Device Connection</h2>
                <p className="text-gray-600 mb-6">
                  Connect to any Bluetooth LE device to start receiving data
                </p>
              </div>

              {/* Status Indicator */}
              <div className={`inline-flex items-center px-4 py-2 rounded-lg border-2 mb-6 ${getStatusColor()}`}>
                {getStatusIcon()}
                <span className="ml-2 font-medium">{getStatusText()}</span>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <p className="text-red-800">{error}</p>
                  </div>
                </div>
              )}

              {/* Connect Button */}
              {!isConnected ? (
                <button
                  onClick={handleConnect}
                  disabled={connecting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center text-lg"
                >
                  {connecting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Bluetooth className="h-5 w-5 mr-2" />
                      Connect Watch
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleDisconnect}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center text-lg"
                >
                  Disconnect
                </button>
              )}

              {/* Device Info */}
              {isConnected && device && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-800">Successfully Connected!</span>
                  </div>
                  <div className="text-sm text-green-700 text-center">
                    <p><strong>Device:</strong> {device.name || 'Unknown Device'}</p>
                    <p><strong>ID:</strong> {device.id}</p>
                  </div>
                </div>
              )}

              {/* Supported Devices Info */}
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Compatible Devices:</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• All Bluetooth LE devices</p>
                  <p>• Smartwatches & Fitness trackers</p>
                  <p>• Health monitoring devices</p>
                  <p>• IoT sensors & wearables</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Display Panel */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Device Data</h2>
              {isConnected && (
                <button
                  onClick={() => setShowRawData(!showRawData)}
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {showRawData ? <EyeOff className="h-5 w-5 mr-2" /> : <Eye className="h-5 w-5 mr-2" />}
                  {showRawData ? 'Hide' : 'Show'} Raw Data
                </button>
              )}
            </div>

            {!isConnected ? (
              <div className="text-center py-12">
                <Database className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Connect your device to see data</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Structured Data Display */}
                {deviceInfo && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Info className="h-5 w-5 mr-2" />
                      Device Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <span className="ml-2 font-medium">{device?.name || 'Unknown'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Battery:</span>
                        <span className="ml-2 font-medium">{deviceInfo.batteryLevel || 'N/A'}%</span>
                      </div>
                      {deviceInfo[0x2A29] && (
                        <div>
                          <span className="text-gray-600">Manufacturer:</span>
                          <span className="ml-2 font-medium">{deviceInfo[0x2A29]}</span>
                        </div>
                      )}
                      {deviceInfo[0x2A24] && (
                        <div>
                          <span className="text-gray-600">Model:</span>
                          <span className="ml-2 font-medium">{deviceInfo[0x2A24]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Health Data Display */}
                {healthData.heart_rate && (
                  <div className="bg-red-50 rounded-lg p-4">
                    <h3 className="font-medium text-red-900 mb-3 flex items-center">
                      <Heart className="h-5 w-5 mr-2" />
                      Heart Rate
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-red-600">
                        {healthData.heart_rate.heartRate} BPM
                      </span>
                      {healthData.heart_rate.contactDetected && (
                        <span className="text-green-600 text-sm flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                          Contact detected
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Raw Data Display */}
                {showRawData && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Database className="h-5 w-5 mr-2" />
                      Raw Data Stream
                    </h3>
                    <div className="max-h-48 overflow-y-auto bg-gray-900 text-green-400 p-3 rounded text-xs font-mono">
                      {Object.keys(healthData).length === 0 ? (
                        <p className="text-gray-500">No data received yet...</p>
                      ) : (
                        Object.entries(healthData).map(([key, data]) => (
                          <div key={key} className="mb-2 pb-2 border-b border-gray-700 last:border-b-0">
                            <div className="font-medium text-blue-400 capitalize mb-1">
                              {data.type === 'unknown' ? `Char: ${data.uuid?.slice(-8)}` : data.type.replace('_', ' ')}
                            </div>
                            <div className="text-gray-300">
                              {data.type === 'heart_rate' ? (
                                <>HR: {data.heartRate} BPM {data.contactDetected ? '✓' : ''}</>
                              ) : data.type === 'battery_level' ? (
                                <>Battery: {data.level}%</>
                              ) : data.type === 'device_info' ? (
                                <>{data.value}</>
                              ) : data.type === 'unknown' ? (
                                <>[{data.value?.slice(0, 8).join(', ') || '...'}{data.value?.length > 8 ? '...' : ''}]</>
                              ) : (
                                <>{JSON.stringify(data).slice(0, 50)}...</>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Connection Status */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                    <span className="text-green-800 font-medium">
                      Real-time data streaming active
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            How to Connect
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2">Enable Bluetooth</h4>
              <p className="text-gray-600 text-sm">Turn on Bluetooth on your device</p>
            </div>
            <div className="text-center p-4">
              <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2">Select Device</h4>
              <p className="text-gray-600 text-sm">Click "Connect Watch" and choose your device</p>
            </div>
            <div className="text-center p-4">
              <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2">Grant Access</h4>
              <p className="text-gray-600 text-sm">Allow Bluetooth permissions when prompted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceConnect;
