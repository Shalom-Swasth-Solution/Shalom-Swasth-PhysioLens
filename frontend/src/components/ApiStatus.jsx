import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const ApiStatus = () => {
  const [status, setStatus] = useState('checking');
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkApiConnection();
  }, []);

  const checkApiConnection = async () => {
    try {
      // Test health endpoint
      const health = await apiService.healthCheck();
      console.log('Health check:', health);
      
      // Test user profile endpoint
      const profile = await apiService.getUserProfile();
      console.log('User profile:', profile);
      
      setStatus('connected');
      setUserProfile(profile);
      setError(null);
    } catch (err) {
      console.error('API connection failed:', err);
      setStatus('error');
      setError(err.message);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return '✅ Connected to Backend';
      case 'error':
        return '❌ Backend Connection Failed';
      default:
        return '⏳ Checking Connection...';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`px-4 py-2 rounded-lg shadow-lg ${getStatusColor()}`}>
        <div className="font-semibold">{getStatusText()}</div>
        {status === 'connected' && userProfile && (
          <div className="text-sm mt-1">
            User: {userProfile.name}
          </div>
        )}
        {status === 'error' && error && (
          <div className="text-sm mt-1">
            Error: {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiStatus; 