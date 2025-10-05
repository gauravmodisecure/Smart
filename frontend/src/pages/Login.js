import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Heart, Activity, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400 to-blue-600 rounded-full opacity-10 animate-pulse-custom"></div>
      </div>

      <div className="max-w-md w-full space-y-8 p-8 relative z-10">
        <div className="text-center animate-fade-in">
          <div className="flex justify-center items-center space-x-2 mb-6">
            <div className="relative">
              <Heart className="h-12 w-12 text-red-500 animate-heartbeat" />
              <div className="absolute inset-0 h-12 w-12 text-red-400 animate-pulse-custom"></div>
            </div>
            <div className="relative">
              <Activity className="h-12 w-12 text-blue-500 animate-bounce" style={{animationDelay: '0.5s'}} />
            </div>
            <div className="relative">
              <Zap className="h-12 w-12 text-yellow-500 animate-pulse-custom" style={{animationDelay: '1s'}} />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gradient title-glow mb-2">
            Health Dashboard
          </h2>
          <p className="text-gray-600 text-lg animate-slide-in">
            Sign in to monitor your health journey
          </p>
        </div>

        <div className="card p-8 animate-fade-in" style={{animationDelay: '0.3s'}}>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-400"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="group">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-400"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 px-4 text-lg font-medium hover-lift"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="loading-dots mr-2">Signing in</span>
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-300 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-3 gap-4 mt-8 animate-fade-in" style={{animationDelay: '0.6s'}}>
          <div className="text-center p-4 glass rounded-lg hover-lift">
            <Heart className="h-8 w-8 text-red-500 mx-auto mb-2 animate-heartbeat" />
            <p className="text-sm font-medium text-gray-700">Heart Rate</p>
            <p className="text-xs text-gray-500">Real-time monitoring</p>
          </div>
          <div className="text-center p-4 glass rounded-lg hover-lift">
            <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2 animate-bounce" />
            <p className="text-sm font-medium text-gray-700">Activity</p>
            <p className="text-xs text-gray-500">Step tracking</p>
          </div>
          <div className="text-center p-4 glass rounded-lg hover-lift">
            <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2 animate-pulse-custom" />
            <p className="text-sm font-medium text-gray-700">Insights</p>
            <p className="text-xs text-gray-500">Smart analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
