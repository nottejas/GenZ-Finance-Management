import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { settingsAPI } from '../services/api';
import { toast } from 'react-hot-toast';

// Create context
const SettingsContext = createContext();

// Default settings
const defaultSettings = {
  profile: {
    name: '',
    email: '',
    phone: '',
    currency: 'INR',
    language: 'English',
    darkMode: true,
  },
  notifications: {
    email: true,
    push: true,
    sms: false,
    marketingEmails: false
  },
  privacySettings: {
    showBalances: true,
    showActivity: true,
    shareData: false
  },
  financialSettings: {
    savingsGoal: 50000,
    budgetReminders: true,
    autoCategorization: true,
    roundUpSavings: false
  }
};

// Provider component
export const SettingsProvider = ({ children }) => {
  const { userId, user, isSignedIn } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize settings with user data when available
  useEffect(() => {
    if (isSignedIn && user) {
      const defaultWithUserInfo = {
        ...defaultSettings,
        profile: {
          ...defaultSettings.profile,
          name: user.fullName || '',
          email: user.primaryEmailAddress?.emailAddress || '',
          phone: user.primaryPhoneNumber?.phoneNumber || '',
        }
      };
      
      if (!settings) {
        setSettings(defaultWithUserInfo);
      }
    }
  }, [isSignedIn, user]);

  // Fetch settings when the user ID is available
  useEffect(() => {
    if (userId) {
      fetchSettings();
    } else {
      setLoading(false);
    }
  }, [userId]);

  // Function to fetch user settings
  const fetchSettings = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await settingsAPI.getSettings(userId);
      
      if (data) {
        setSettings(data);
      } else {
        // If no settings exist yet, use defaults with user info
        if (user) {
          const defaultWithUserInfo = {
            ...defaultSettings,
            profile: {
              ...defaultSettings.profile,
              name: user.fullName || '',
              email: user.primaryEmailAddress?.emailAddress || '',
              phone: user.primaryPhoneNumber?.phoneNumber || '',
            }
          };
          setSettings(defaultWithUserInfo);
        } else {
          setSettings(defaultSettings);
        }
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      
      // If settings don't exist yet (404), use defaults without showing error
      if (err.response && err.response.status === 404) {
        if (user) {
          const defaultWithUserInfo = {
            ...defaultSettings,
            profile: {
              ...defaultSettings.profile,
              name: user.fullName || '',
              email: user.primaryEmailAddress?.emailAddress || '',
              phone: user.primaryPhoneNumber?.phoneNumber || '',
            }
          };
          setSettings(defaultWithUserInfo);
        } else {
          setSettings(defaultSettings);
        }
      } else {
        setError('Failed to load settings. Please try again later.');
        toast.error('Failed to load settings');
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to save settings
  const saveSettings = async (newSettings) => {
    if (!userId) return { success: false };

    try {
      setLoading(true);
      setError(null);

      const updatedSettings = await settingsAPI.updateSettings(userId, newSettings);
      
      setSettings(updatedSettings);
      return { success: true, data: updatedSettings };
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings. Please try again later.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle a specific setting
  const toggleSetting = async (section, setting) => {
    if (!settings || !userId) return { success: false };

    try {
      // Create a new settings object with the toggled value
      const updatedSettings = {
        ...settings,
        [section]: {
          ...settings[section],
          [setting]: !settings[section][setting]
        }
      };

      // Save the updated settings
      const result = await saveSettings(updatedSettings);
      return result;
    } catch (err) {
      console.error('Error toggling setting:', err);
      setError('Failed to update setting. Please try again later.');
      return { success: false, error: err.message };
    }
  };

  // Function to update a specific section
  const updateSection = async (section, sectionData) => {
    if (!settings || !userId) return { success: false };

    try {
      // Create a new settings object with the updated section
      const updatedSettings = {
        ...settings,
        [section]: {
          ...settings[section],
          ...sectionData
        }
      };

      // Save the updated settings
      const result = await saveSettings(updatedSettings);
      return result;
    } catch (err) {
      console.error('Error updating settings section:', err);
      setError('Failed to update settings. Please try again later.');
      return { success: false, error: err.message };
    }
  };

  // Value object to be provided to consumers
  const value = {
    settings,
    loading,
    error,
    saveSettings,
    toggleSetting,
    updateSection,
    refreshSettings: fetchSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook for using the settings context
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsContext; 