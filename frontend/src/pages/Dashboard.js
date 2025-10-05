import React, { useState, useEffect } from 'react';
import { useBluetooth } from '../hooks/useBluetooth';
import {
  Heart,
  Activity,
  Droplets,
  Moon,
  Smartphone,
  Wifi,
  WifiOff,
  TrendingUp
} from 'lucide-react';
import HeartRateChart from '../components/charts/HeartRateChart';
import StepsChart from '../components/charts/StepsChart';
import Spo2Chart from '../components/charts/Spo2Chart';
import SleepChart from '../components/charts/SleepChart';

const Dashboard = () => {
  const { isConnected, healthData, deviceInfo, disconnect } = useBluetooth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200 rounded-full opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-10 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <header className="glass backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center animate-slide-in">
              <div className="relative mr-4">
                <Heart className="h-10 w-10 text-red-500 animate-heartbeat" />
                <div className="absolute inset-0 h-10 w-10 text-red-400 animate-pulse-custom opacity-50"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient title-glow">
                  Health Dashboard
                </h1>
                <p className="text-sm text-gray-600">{formatDate(currentTime)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 animate-fade-in">
              {/* Connection Status */}
              <div className="flex items-center space-x-2 px-3 py-2 glass rounded-full">
                <div className={`status-indicator ${isConnected ? 'status-connected' : 'status-disconnected'}`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
                {isConnected ? (
                  <Wifi className="h-4 w-4 text-green-600" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-600" />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 animate-slide-in">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gradient mb-6">Navigation</h2>
              <nav className="space-y-3">
                {[
                  { id: 'overview', label: 'Overview', icon: Activity, color: 'blue' },
                  { id: 'heart', label: 'Heart Rate', icon: Heart, color: 'red' },
                  { id: 'steps', label: 'Steps', icon: Activity, color: 'green' },
                  { id: 'oxygen', label: 'SpO₂', icon: Droplets, color: 'purple' },
                  { id: 'sleep', label: 'Sleep', icon: Moon, color: 'indigo' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 hover-lift ${
                      activeTab === tab.id
                        ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 text-white shadow-lg`
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'animate-bounce' : ''}`} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => window.location.href = '/connect'}
                  className="btn-primary w-full py-3 px-4 flex items-center justify-center space-x-2 hover-lift"
                >
                  <Smartphone className="h-5 w-5" />
                  <span>{isConnected ? 'Reconnect Device' : 'Connect Device'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && <OverviewTab healthData={healthData} deviceInfo={deviceInfo} />}
            {activeTab === 'heart' && <HeartRateTab healthData={healthData} />}
            {activeTab === 'steps' && <StepsTab healthData={healthData} />}
            {activeTab === 'oxygen' && <OxygenTab healthData={healthData} />}
            {activeTab === 'sleep' && <SleepTab healthData={healthData} />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ healthData, deviceInfo }) => (
  <div className="space-y-8 animate-fade-in">
    <div className="card p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gradient">Today's Overview</h2>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{new Date().toLocaleTimeString()}</p>
          <p className="text-sm text-gray-500">Last updated</p>
        </div>
      </div>

      {/* Current Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Heart Rate"
          value={healthData.heart_rate?.heartRate || '--'}
          unit="BPM"
          icon={Heart}
          color="red"
          trend={healthData.heart_rate ? 'stable' : null}
          animate={true}
        />
        <MetricCard
          title="Steps"
          value="8,234"
          unit="steps"
          icon={Activity}
          color="blue"
          trend="up"
          animate={true}
        />
        <MetricCard
          title="SpO₂"
          value={healthData.oxygen?.percentage || '--'}
          unit="%"
          icon={Droplets}
          color="green"
          trend={healthData.oxygen ? 'stable' : null}
          animate={true}
        />
        <MetricCard
          title="Sleep"
          value="7.5"
          unit="hrs"
          icon={Moon}
          color="purple"
          trend="up"
          animate={true}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="chart-container animate-fade-in">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Heart className="h-5 w-5 text-red-500 mr-2" />
            Heart Rate Trend
          </h3>
          <HeartRateChart data={[healthData.heart_rate].filter(Boolean)} />
        </div>
        <div className="chart-container animate-fade-in" style={{animationDelay: '0.2s'}}>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="h-5 w-5 text-blue-500 mr-2" />
            Steps Progress
          </h3>
          <StepsChart data={[]} />
        </div>
      </div>
    </div>
  </div>
);

// Enhanced Metric Card Component
const MetricCard = ({ title, value, unit, icon: Icon, color, trend, animate = false }) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500 animate-bounce" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180 animate-bounce" />;
      default: return null;
    }
  };

  const getColorClasses = () => {
    const baseClasses = "relative overflow-hidden transition-all duration-300";
    switch (color) {
      case 'red': return `${baseClasses} bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:from-red-100 hover:to-red-200`;
      case 'blue': return `${baseClasses} bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200`;
      case 'green': return `${baseClasses} bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-200`;
      case 'purple': return `${baseClasses} bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-200`;
      default: return `${baseClasses} bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:from-gray-100 hover:to-gray-200`;
    }
  };

  return (
    <div className={`card p-6 ${getColorClasses()} ${animate ? 'hover-lift' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-full bg-${color}-100 mr-4`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold">
              {value} <span className="text-lg font-normal text-gray-500">{unit}</span>
            </p>
          </div>
        </div>
        {getTrendIcon()}
      </div>
      {animate && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      )}
    </div>
  );
};

// Tab Components
const HeartRateTab = ({ healthData }) => (
  <div className="card p-8 animate-fade-in">
    <h2 className="text-3xl font-bold text-gradient mb-6">Heart Rate Monitor</h2>
    <div className="chart-container">
      <HeartRateChart data={[healthData.heart_rate].filter(Boolean)} />
    </div>
  </div>
);

const StepsTab = ({ healthData }) => (
  <div className="card p-8 animate-fade-in">
    <h2 className="text-3xl font-bold text-gradient mb-6">Step Counter</h2>
    <div className="chart-container">
      <StepsChart data={[]} />
    </div>
  </div>
);

const OxygenTab = ({ healthData }) => (
  <div className="card p-8 animate-fade-in">
    <h2 className="text-3xl font-bold text-gradient mb-6">Blood Oxygen</h2>
    <div className="chart-container">
      <Spo2Chart data={[healthData.oxygen].filter(Boolean)} />
    </div>
  </div>
);

const SleepTab = ({ healthData }) => (
  <div className="card p-8 animate-fade-in">
    <h2 className="text-3xl font-bold text-gradient mb-6">Sleep Tracking</h2>
    <div className="chart-container">
      <SleepChart data={[]} />
    </div>
  </div>
);

export default Dashboard;
