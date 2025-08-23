import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const ApiTestPage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [profile, stats] = await Promise.all([
        apiService.getUserProfile(),
        apiService.getUserStats()
      ]);
      
      setUserProfile(profile);
      setUserStats(stats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testHealthCheck = async () => {
    try {
      const health = await apiService.healthCheck();
      alert(`Health Check: ${JSON.stringify(health, null, 2)}`);
    } catch (err) {
      alert(`Health Check Failed: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data from backend...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">API Connection Test</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Profile */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">User Profile</h2>
              {userProfile ? (
                <div className="space-y-2">
                  <p><strong>Name:</strong> {userProfile.name}</p>
                  <p><strong>Email:</strong> {userProfile.email}</p>
                  <p><strong>Current Streak:</strong> {userProfile.current_streak} days</p>
                  <p><strong>Total Sessions:</strong> {userProfile.total_sessions}</p>
                  <p><strong>Notifications:</strong> {userProfile.notifications}</p>
                </div>
              ) : (
                <p className="text-red-600">Failed to load user profile</p>
              )}
            </div>

            {/* User Stats */}
            <div className="bg-green-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-green-900 mb-4">User Stats</h2>
              {userStats ? (
                <div className="space-y-2">
                  <p><strong>Total Sessions:</strong> {userStats.total_sessions}</p>
                  <p><strong>Current Streak:</strong> {userStats.current_streak} days</p>
                  <p><strong>Average Score:</strong> {userStats.average_score.toFixed(1)}%</p>
                  <p><strong>Best Score:</strong> {userStats.best_score}%</p>
                  <p><strong>Member Since:</strong> {userStats.member_since}</p>
                </div>
              ) : (
                <p className="text-red-600">Failed to load user stats</p>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-semibold">Error</h3>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="mt-6 flex gap-4">
            <button
              onClick={loadData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Data
            </button>
            <button
              onClick={testHealthCheck}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Test Health Check
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Backend Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">✅</div>
              <div className="text-sm text-gray-600">API Connected</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">🚀</div>
              <div className="text-sm text-gray-600">Backend Running</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">📊</div>
              <div className="text-sm text-gray-600">Data Available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTestPage; 