import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';

const Settings = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('preferences');

  // Example preferences - in a real app, these would be stored in the backend
  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      push: true,
      spending: true,
      challenges: true,
      tips: true
    },
    display: {
      theme: 'light',
      currency: 'USD',
      language: 'English'
    },
    privacy: {
      shareStats: true,
      showInLeaderboard: true,
      publicProfile: false
    }
  });

  const handleNotificationChange = (key) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handlePrivacyChange = (key) => {
    setPreferences(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: !prev.privacy[key]
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings ⚙️</h1>
        <p className="text-gray-600">Manage your account preferences and settings</p>
      </div>

      {/* Settings Navigation */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('preferences')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'preferences'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Preferences
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'account'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Account
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'privacy'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Privacy
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              {/* Notifications */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
                <div className="space-y-4">
                  {Object.entries(preferences.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-gray-700 capitalize">{key} notifications</span>
                      <button
                        onClick={() => handleNotificationChange(key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          value ? 'bg-purple-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Display Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Display</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Theme
                      </label>
                      <select
                        className="w-full rounded-lg border border-gray-200 p-2.5"
                        value={preferences.display.theme}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          display: { ...prev.display, theme: e.target.value }
                        }))}
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Currency
                      </label>
                      <select
                        className="w-full rounded-lg border border-gray-200 p-2.5"
                        value={preferences.display.currency}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          display: { ...prev.display, currency: e.target.value }
                        }))}
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <img
                  src={user?.imageUrl}
                  alt="Profile"
                  className="h-16 w-16 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{user?.fullName}</h3>
                  <p className="text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
              </div>

              <div className="space-y-4">
                <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  Edit Profile
                </button>
                <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  Change Password
                </button>
                <button className="w-full bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
                <div className="space-y-4">
                  {Object.entries(preferences.privacy).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <span className="block text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {key === 'shareStats' && 'Share your financial progress with friends'}
                          {key === 'showInLeaderboard' && 'Appear in challenge leaderboards'}
                          {key === 'publicProfile' && 'Make your profile visible to other users'}
                        </span>
                      </div>
                      <button
                        onClick={() => handlePrivacyChange(key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          value ? 'bg-purple-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Data & Security</h3>
                <div className="space-y-4">
                  <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                    Export My Data
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                    Security Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings; 