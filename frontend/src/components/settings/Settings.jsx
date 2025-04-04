import React, { useState, useEffect } from 'react';
import { 
  FaUser, FaBell, FaShieldAlt, FaCreditCard, FaExchangeAlt, 
  FaCheck, FaToggleOn, FaToggleOff, FaDownload, FaQuestionCircle,
  FaSave, FaSignOutAlt, FaTrash, FaCog, FaSpinner
} from 'react-icons/fa';
import { useSettings } from '../../context/SettingsContext';
import { useClerk } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';
import PrivacyCenter from './PrivacyCenter';
import AccountCenter from './AccountCenter';

const Settings = () => {
  const { settings, loading, error, saveSettings, toggleSetting } = useSettings();
  const { signOut } = useClerk();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
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
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPrivacyCenter, setShowPrivacyCenter] = useState(false);
  const [showAccountCenter, setShowAccountCenter] = useState(false);
  const [accountCenterTab, setAccountCenterTab] = useState('security');
  
  // Get the current theme mode
  const isDarkMode = formData.profile.darkMode;
  
  // Card styling based on theme
  const cardStyle = isDarkMode 
    ? "bg-gray-900 border border-gray-800 border-l-orange-500 border-l-4 rounded-xl p-6" 
    : "bg-white border border-gray-200 border-l-orange-500 border-l-4 rounded-xl p-6 shadow-sm";
  
  const inputStyle = isDarkMode
    ? "w-full p-3 bg-gray-800 border border-gray-700 text-white rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
    : "w-full p-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500";
  
  const textPrimaryColor = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondaryColor = isDarkMode ? "text-gray-400" : "text-gray-600";
  const borderColor = isDarkMode ? "border-gray-800" : "border-gray-200";
  const buttonBgColor = isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200";

  // Initialize form data from settings when loaded
  useEffect(() => {
    if (!loading && settings) {
      setFormData({
        profile: settings.profile || formData.profile,
        notifications: settings.notifications || formData.notifications,
        privacySettings: settings.privacySettings || formData.privacySettings,
        financialSettings: settings.financialSettings || formData.financialSettings
      });
    }
  }, [loading, settings]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const section = activeTab === 'profile' ? 'profile' : 
                    activeTab === 'notifications' ? 'notifications' :
                    activeTab === 'privacy' ? 'privacySettings' :
                    activeTab === 'financial' ? 'financialSettings' : 'profile';
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parentProp, childProp] = name.split('.');
      setFormData({
        ...formData,
        [parentProp]: {
          ...formData[parentProp],
          [childProp]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      // Handle direct properties
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [name]: type === 'checkbox' ? checked : value
        }
      });
    }
  };

  const handleToggleChange = async (section, setting) => {
    const newValue = !formData[section][setting];
    
    // Update local state immediately for responsive UI
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [setting]: newValue
      }
    });
    
    // Save the setting immediately
    try {
      const updatedSettings = {
        ...settings,
        [section]: {
          ...settings[section],
          [setting]: newValue
        }
      };
      
      await saveSettings(updatedSettings);
      
      // Show success toast with specific message based on setting
      let successMessage;
      if (section === 'privacySettings') {
        if (setting === 'showBalances') {
          successMessage = newValue ? 'Account balances visible' : 'Account balances hidden';
        } else if (setting === 'showActivity') {
          successMessage = newValue ? 'Activity visible' : 'Activity hidden';
        } else if (setting === 'shareData') {
          successMessage = newValue ? 'Anonymous data sharing enabled' : 'Anonymous data sharing disabled';
        }
      } else {
        successMessage = `Setting updated successfully`;
      }
      
      toast.success(successMessage);
    } catch (err) {
      console.error(`Error saving setting (${section}.${setting}):`, err);
      toast.error('Failed to save setting');
      
      // Revert the local state if saving failed
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [setting]: !newValue
        }
      });
    }
  };

  const handleToggleDarkMode = async () => {
    const newDarkModeValue = !formData.profile.darkMode;
    
    setFormData({
      ...formData,
      profile: {
        ...formData.profile,
        darkMode: newDarkModeValue
      }
    });
    
    // Save the dark mode setting immediately
    try {
      const updatedSettings = {
        ...settings,
        profile: {
          ...settings.profile,
          darkMode: newDarkModeValue
        }
      };
      
      await saveSettings(updatedSettings);
      toast.success(newDarkModeValue ? 'Dark mode enabled' : 'Light mode enabled');
    } catch (err) {
      console.error('Error saving dark mode setting:', err);
      toast.error('Failed to save theme preference');
    }
  };
  
  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      setSaveSuccess(false);
      
      const result = await saveSettings(formData);
      
      if (result.success) {
        setSaveSuccess(true);
        toast.success('Settings saved successfully');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.error('An error occurred while saving settings');
    } finally {
      setIsSaving(false);
      
      // Reset success message after a few seconds
      if (saveSuccess) {
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    }
  };
  
  const handleSignOut = () => {
    signOut();
  };

  const openAccountCenter = (tab) => {
    setAccountCenterTab(tab);
    setShowAccountCenter(true);
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className={cardStyle}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-bold ${textPrimaryColor}`}>Personal Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="mb-5">
            <label className={`block ${textSecondaryColor} text-sm mb-2`}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.profile.name}
              onChange={handleInputChange}
              className={inputStyle}
            />
          </div>
          
          <div className="mb-5">
            <label className={`block ${textSecondaryColor} text-sm mb-2`}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.profile.email}
              onChange={handleInputChange}
              className={inputStyle}
            />
          </div>
          
          <div className="mb-5">
            <label className={`block ${textSecondaryColor} text-sm mb-2`}>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.profile.phone}
              onChange={handleInputChange}
              className={inputStyle}
            />
          </div>
        </div>
      </div>
      
      <div className={cardStyle}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-bold ${textPrimaryColor}`}>Preferences</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="mb-5">
            <label className={`block ${textSecondaryColor} text-sm mb-2`}>Currency</label>
            <select
              name="currency"
              value={formData.profile.currency}
              onChange={handleInputChange}
              className={inputStyle}
            >
              <option value="INR">Indian Rupee (₹)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
              <option value="GBP">British Pound (£)</option>
            </select>
          </div>
          
          <div className="mb-5">
            <label className={`block ${textSecondaryColor} text-sm mb-2`}>Language</label>
            <select
              name="language"
              value={formData.profile.language}
              onChange={handleInputChange}
              className={inputStyle}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Tamil">Tamil</option>
              <option value="Telugu">Telugu</option>
              <option value="Bengali">Bengali</option>
            </select>
          </div>
        </div>
        
        <div className={`border-t ${borderColor} pt-4 mt-4`}>
          <div className="flex justify-between items-center py-3">
            <div>
              <div className="flex items-center">
                <span className={textPrimaryColor}>Dark Mode</span>
              </div>
              <div className={`${textSecondaryColor} text-sm mt-1`}>
                Change the theme of the application
              </div>
            </div>
            <div 
              className="flex items-center cursor-pointer" 
              onClick={handleToggleDarkMode}
            >
              {formData.profile.darkMode ? (
                <FaToggleOn className="text-orange-500 text-2xl" />
              ) : (
                <FaToggleOff className="text-gray-500 text-2xl" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className={cardStyle}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-xl font-bold ${textPrimaryColor}`}>Notification Preferences</h3>
      </div>
      
      <div className="space-y-1">
        <div className={`flex justify-between items-center py-3 border-b ${borderColor}`}>
          <div>
            <div className="flex items-center">
              <span className={textPrimaryColor}>Email Notifications</span>
            </div>
            <div className={`${textSecondaryColor} text-sm mt-1`}>
              Receive important updates via email
            </div>
          </div>
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => handleToggleChange('notifications', 'email')}
          >
            {formData.notifications.email ? (
              <FaToggleOn className="text-orange-500 text-2xl" />
            ) : (
              <FaToggleOff className="text-gray-500 text-2xl" />
            )}
          </div>
        </div>
        
        <div className={`flex justify-between items-center py-3 border-b ${borderColor}`}>
          <div>
            <div className="flex items-center">
              <span className={textPrimaryColor}>Push Notifications</span>
            </div>
            <div className={`${textSecondaryColor} text-sm mt-1`}>
              Receive real-time updates on your device
            </div>
          </div>
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => handleToggleChange('notifications', 'push')}
          >
            {formData.notifications.push ? (
              <FaToggleOn className="text-orange-500 text-2xl" />
            ) : (
              <FaToggleOff className="text-gray-500 text-2xl" />
            )}
          </div>
        </div>
        
        <div className={`flex justify-between items-center py-3 border-b ${borderColor}`}>
          <div>
            <div className="flex items-center">
              <span className={textPrimaryColor}>SMS Notifications</span>
            </div>
            <div className={`${textSecondaryColor} text-sm mt-1`}>
              Receive important alerts via SMS
            </div>
          </div>
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => handleToggleChange('notifications', 'sms')}
          >
            {formData.notifications.sms ? (
              <FaToggleOn className="text-orange-500 text-2xl" />
            ) : (
              <FaToggleOff className="text-gray-500 text-2xl" />
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center py-3">
          <div>
            <div className="flex items-center">
              <span className={textPrimaryColor}>Marketing Emails</span>
            </div>
            <div className={`${textSecondaryColor} text-sm mt-1`}>
              Receive tips, offers, and updates about new features
            </div>
          </div>
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => handleToggleChange('notifications', 'marketingEmails')}
          >
            {formData.notifications.marketingEmails ? (
              <FaToggleOn className="text-orange-500 text-2xl" />
            ) : (
              <FaToggleOff className="text-gray-500 text-2xl" />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className={cardStyle}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-bold ${textPrimaryColor}`}>Privacy Settings</h3>
        </div>
        
        <div className="space-y-1">
          <div className={`flex justify-between items-center py-3 border-b ${borderColor}`}>
            <div>
              <div className="flex items-center">
                <span className={textPrimaryColor}>Show Account Balances</span>
              </div>
              <div className={`${textSecondaryColor} text-sm mt-1`}>
                Display your financial information on the dashboard
              </div>
            </div>
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => handleToggleChange('privacySettings', 'showBalances')}
            >
              {formData.privacySettings.showBalances ? (
                <FaToggleOn className="text-orange-500 text-2xl" />
              ) : (
                <FaToggleOff className="text-gray-500 text-2xl" />
              )}
            </div>
          </div>
          
          <div className={`flex justify-between items-center py-3 border-b ${borderColor}`}>
            <div>
              <div className="flex items-center">
                <span className={textPrimaryColor}>Show Activity</span>
              </div>
              <div className={`${textSecondaryColor} text-sm mt-1`}>
                Show your recent transactions and activity
              </div>
            </div>
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => handleToggleChange('privacySettings', 'showActivity')}
            >
              {formData.privacySettings.showActivity ? (
                <FaToggleOn className="text-orange-500 text-2xl" />
              ) : (
                <FaToggleOff className="text-gray-500 text-2xl" />
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center py-3">
            <div>
              <div className="flex items-center">
                <span className={textPrimaryColor}>Share Anonymous Data</span>
              </div>
              <div className={`${textSecondaryColor} text-sm mt-1`}>
                Allow us to use anonymized data to improve our services
              </div>
            </div>
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => handleToggleChange('privacySettings', 'shareData')}
            >
              {formData.privacySettings.shareData ? (
                <FaToggleOn className="text-orange-500 text-2xl" />
              ) : (
                <FaToggleOff className="text-gray-500 text-2xl" />
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className={cardStyle}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-bold ${textPrimaryColor}`}>Data & Privacy</h3>
          <button 
            className="text-orange-500 text-sm underline"
            onClick={() => setShowPrivacyCenter(true)}
          >
            Open Privacy Center
          </button>
        </div>
        
        <div className="space-y-4">
          <button 
            className={`w-full p-3 flex items-center justify-between ${buttonBgColor} transition-colors rounded-md ${textPrimaryColor}`}
            onClick={() => setShowPrivacyCenter(true)}
          >
            <span>Download My Data</span>
            <FaDownload />
          </button>
          
          <button 
            className={`w-full p-3 flex items-center justify-between ${buttonBgColor} transition-colors rounded-md ${textPrimaryColor}`}
            onClick={() => setShowPrivacyCenter(true)}
          >
            <span>Privacy Policy</span>
            <FaShieldAlt />
          </button>
          
          <button 
            className="w-full p-3 flex items-center justify-between bg-red-900 hover:bg-red-800 transition-colors rounded-md text-white opacity-80"
            onClick={() => setShowPrivacyCenter(true)}
          >
            <span>Delete My Account</span>
            <FaTrash />
          </button>
        </div>
      </div>
      
      {showPrivacyCenter && (
        <PrivacyCenter onClose={() => setShowPrivacyCenter(false)} />
      )}
    </div>
  );
  
  const renderFinancialSettings = () => (
    <div className="space-y-6">
      <div className={cardStyle}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-bold ${textPrimaryColor}`}>Financial Goals</h3>
        </div>
        
        <div className="mb-5">
          <label className={`block ${textSecondaryColor} text-sm mb-2`}>Monthly Savings Goal (₹)</label>
          <input
            type="number"
            name="savingsGoal"
            value={formData.financialSettings.savingsGoal}
            onChange={(e) => setFormData({
              ...formData,
              financialSettings: {
                ...formData.financialSettings,
                savingsGoal: parseInt(e.target.value) || 0
              }
            })}
            className={inputStyle}
          />
        </div>
        
        <div className="space-y-1 mt-6">
          <div className={`flex justify-between items-center py-3 border-b ${borderColor}`}>
            <div>
              <div className="flex items-center">
                <span className={textPrimaryColor}>Budget Reminders</span>
              </div>
              <div className={`${textSecondaryColor} text-sm mt-1`}>
                Get notifications when nearing budget limits
              </div>
            </div>
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => handleToggleChange('financialSettings', 'budgetReminders')}
            >
              {formData.financialSettings.budgetReminders ? (
                <FaToggleOn className="text-orange-500 text-2xl" />
              ) : (
                <FaToggleOff className="text-gray-500 text-2xl" />
              )}
            </div>
          </div>
          
          <div className={`flex justify-between items-center py-3 border-b ${borderColor}`}>
            <div>
              <div className="flex items-center">
                <span className={textPrimaryColor}>Auto-Categorization</span>
              </div>
              <div className={`${textSecondaryColor} text-sm mt-1`}>
                Automatically categorize your transactions
              </div>
            </div>
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => handleToggleChange('financialSettings', 'autoCategorization')}
            >
              {formData.financialSettings.autoCategorization ? (
                <FaToggleOn className="text-orange-500 text-2xl" />
              ) : (
                <FaToggleOff className="text-gray-500 text-2xl" />
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center py-3">
            <div>
              <div className="flex items-center">
                <span className={textPrimaryColor}>Round-Up Savings</span>
              </div>
              <div className={`${textSecondaryColor} text-sm mt-1`}>
                Round up transactions to nearest ₹10 and save the difference
              </div>
            </div>
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => handleToggleChange('financialSettings', 'roundUpSavings')}
            >
              {formData.financialSettings.roundUpSavings ? (
                <FaToggleOn className="text-orange-500 text-2xl" />
              ) : (
                <FaToggleOff className="text-gray-500 text-2xl" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div className={cardStyle}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-bold ${textPrimaryColor}`}>Account Management</h3>
          <button 
            className="text-orange-500 text-sm underline"
            onClick={() => openAccountCenter('security')}
          >
            Open Account Center
          </button>
        </div>
        
        <div className="space-y-4">
          <button 
            className={`w-full p-3 flex items-center justify-between ${buttonBgColor} transition-colors rounded-md ${textPrimaryColor}`}
            onClick={() => openAccountCenter('security')}
          >
            <span>Change Password</span>
            <FaShieldAlt />
          </button>
          
          <button 
            className={`w-full p-3 flex items-center justify-between ${buttonBgColor} transition-colors rounded-md ${textPrimaryColor}`}
            onClick={() => openAccountCenter('security')}
          >
            <span>Two-Factor Authentication</span>
            <FaShieldAlt />
          </button>
          
          <button 
            className={`w-full p-3 flex items-center justify-between ${buttonBgColor} transition-colors rounded-md ${textPrimaryColor}`}
            onClick={() => openAccountCenter('connections')}
          >
            <span>Connected Accounts</span>
            <FaExchangeAlt />
          </button>
          
          <button 
            className={`w-full p-3 flex items-center justify-between ${buttonBgColor} transition-colors rounded-md ${textPrimaryColor}`}
            onClick={() => openAccountCenter('payment')}
          >
            <span>Payment Methods</span>
            <FaCreditCard />
          </button>
        </div>
      </div>
      
      <div className={cardStyle}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-bold ${textPrimaryColor}`}>Support & Help</h3>
        </div>
        
        <div className="space-y-4">
          <button className={`w-full p-3 flex items-center justify-between ${buttonBgColor} transition-colors rounded-md ${textPrimaryColor}`}>
            <span>Help Center</span>
            <FaQuestionCircle />
          </button>
          
          <button className={`w-full p-3 flex items-center justify-between ${buttonBgColor} transition-colors rounded-md ${textPrimaryColor}`}>
            <span>Contact Support</span>
            <FaQuestionCircle />
          </button>
          
          <button 
            onClick={handleSignOut}
            className="w-full p-3 flex items-center justify-between bg-red-800 hover:bg-red-700 transition-colors rounded-md text-white"
          >
            <span>Sign Out</span>
            <FaSignOutAlt />
          </button>
        </div>
      </div>
      
      {showAccountCenter && (
        <AccountCenter 
          onClose={() => setShowAccountCenter(false)} 
          initialTab={accountCenterTab}
        />
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'financial':
        return renderFinancialSettings();
      case 'account':
        return renderAccountSettings();
      default:
        return renderProfileSettings();
    }
  };

  // Tabs configuration
  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
    { id: 'privacy', label: 'Privacy', icon: <FaShieldAlt /> },
    { id: 'financial', label: 'Financial', icon: <FaCreditCard /> },
    { id: 'account', label: 'Account', icon: <FaCog /> }
  ];

  // Render loading state
  if (loading) {
    return (
      <div className={`max-w-6xl mx-auto p-6 ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-black'} min-h-screen flex items-center justify-center`}>
        <div className="text-center">
          <FaSpinner className="animate-spin text-orange-500 text-4xl mx-auto mb-4" />
          <p className={textSecondaryColor}>Loading your settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-6xl mx-auto p-6 ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-black'} min-h-screen`}>
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${textPrimaryColor} mb-2`}>Settings</h1>
        <p className={textSecondaryColor}>Manage your account preferences and settings</p>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-900/30 border border-red-800 text-red-200 p-4 rounded-md">
          {error}
        </div>
      )}
      
      <div className={`flex overflow-x-auto border-b ${borderColor} mb-8 pb-1`}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 flex items-center border-b-2 transition-all ${
              activeTab === tab.id 
                ? 'text-orange-500 border-orange-500' 
                : `${textSecondaryColor} border-transparent hover:${textPrimaryColor}`
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      
      {renderTabContent()}
      
      <div className="mt-8 flex justify-end">
        <button 
          onClick={handleSaveChanges}
          disabled={isSaving}
          className={`bg-orange-500 text-white py-3 px-6 rounded-md flex items-center gap-2 hover:bg-orange-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed ${saveSuccess ? 'bg-green-600 hover:bg-green-700' : ''}`}
        >
          {isSaving ? (
            <>
              <FaSpinner className="animate-spin" /> Saving...
            </>
          ) : saveSuccess ? (
            <>
              <FaCheck /> Saved!
            </>
          ) : (
            <>
              <FaSave /> Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Settings;
