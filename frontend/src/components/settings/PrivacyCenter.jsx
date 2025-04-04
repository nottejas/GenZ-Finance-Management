import React, { useState } from 'react';
import { FaShieldAlt, FaDownload, FaTrash, FaKey, FaUserSecret, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { useSettings } from '../../context/SettingsContext';
import { toast } from 'react-hot-toast';

const PrivacyCenter = ({ onClose }) => {
  const { settings, saveSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('overview');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  
  // Get current theme
  const isDarkMode = settings?.profile?.darkMode ?? true;
  
  // Styling based on theme
  const cardStyle = isDarkMode 
    ? "bg-gray-900 border border-gray-800 border-orange-500 border-l-4 rounded-xl p-6 shadow-lg" 
    : "bg-white border border-gray-200 border-orange-500 border-l-4 rounded-xl p-6 shadow-sm";
    
  const textPrimaryColor = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondaryColor = isDarkMode ? "text-gray-400" : "text-gray-600";
  const borderColor = isDarkMode ? "border-gray-800" : "border-gray-200";
  const bgColor = isDarkMode ? "bg-black" : "bg-gray-50";
  const buttonStyle = isDarkMode 
    ? "bg-gray-800 hover:bg-gray-700 text-white"
    : "bg-gray-200 hover:bg-gray-300 text-gray-900";
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaShieldAlt /> },
    { id: 'data', label: 'Your Data', icon: <FaDownload /> },
    { id: 'deletion', label: 'Account Deletion', icon: <FaTrash /> },
  ];
  
  // Handle data export
  const handleDataExport = () => {
    toast.success('Your data export is being prepared. You will receive a download link via email.');
    // In a real app, this would call an API to generate user data export
  };
  
  // Handle account deletion request
  const handleDeleteRequest = () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm account deletion');
      return;
    }
    
    setIsDeleting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Account deletion requested. You will receive a confirmation email.');
      setIsDeleting(false);
      onClose();
    }, 2000);
  };
  
  // Render the content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h3 className={`text-xl font-bold ${textPrimaryColor} mb-4`}>Privacy Overview</h3>
            
            <div className={`p-4 rounded-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <div className="flex items-center mb-3">
                <FaCheck className="text-green-500 mr-2" />
                <span className={textPrimaryColor}>Your data is encrypted</span>
              </div>
              <div className={`${textSecondaryColor} text-sm ml-6`}>
                All your financial data is encrypted using industry-standard encryption
              </div>
            </div>
            
            <div className={`p-4 rounded-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <div className="flex items-center mb-3">
                <FaUserSecret className="text-green-500 mr-2" />
                <span className={textPrimaryColor}>Privacy Controls Active</span>
              </div>
              <div className={`${textSecondaryColor} text-sm ml-6`}>
                You have control over what information is visible in your account
              </div>
            </div>
            
            <div className={`p-4 rounded-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} ${settings?.privacySettings?.shareData ? 'border-l-4 border-amber-500' : ''}`}>
              <div className="flex items-center mb-3">
                {settings?.privacySettings?.shareData ? (
                  <FaExclamationTriangle className="text-amber-500 mr-2" />
                ) : (
                  <FaCheck className="text-green-500 mr-2" />
                )}
                <span className={textPrimaryColor}>Data Sharing</span>
              </div>
              <div className={`${textSecondaryColor} text-sm ml-6`}>
                {settings?.privacySettings?.shareData 
                  ? 'You are currently sharing anonymized data to help improve our services' 
                  : 'You have opted out of sharing anonymized data'}
              </div>
            </div>
            
            <p className={textSecondaryColor}>
              We take your privacy seriously. Your data is never sold to third parties and you have full control over your information.
            </p>
          </div>
        );
        
      case 'data':
        return (
          <div className="space-y-6">
            <h3 className={`text-xl font-bold ${textPrimaryColor} mb-4`}>Your Data</h3>
            
            <p className={textSecondaryColor}>
              You can download a copy of all your data at any time. This includes:
            </p>
            
            <ul className={`list-disc pl-5 ${textSecondaryColor}`}>
              <li>Transaction history</li>
              <li>Account information</li>
              <li>Budget and savings goals</li>
              <li>App settings and preferences</li>
            </ul>
            
            <div className="mt-6">
              <button
                className={`w-full p-3 flex items-center justify-center bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors`}
                onClick={handleDataExport}
              >
                <FaDownload className="mr-2" /> Export Your Data
              </button>
            </div>
            
            <p className={`text-sm ${textSecondaryColor} mt-4`}>
              Data export will be prepared and sent to your registered email address within 24 hours.
            </p>
          </div>
        );
        
      case 'deletion':
        return (
          <div className="space-y-6">
            <h3 className={`text-xl font-bold text-red-500 mb-4`}>Account Deletion</h3>
            
            <div className={`p-4 rounded-md bg-red-900 bg-opacity-20 border border-red-800`}>
              <div className="flex items-start">
                <FaExclamationTriangle className="text-red-500 mr-2 mt-1" />
                <div>
                  <span className={`font-bold ${textPrimaryColor}`}>Warning: This action cannot be undone</span>
                  <p className={textSecondaryColor}>
                    Deleting your account will permanently remove all your data, including transaction history, 
                    saved settings, and personal information.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 mt-4">
              <p className={textSecondaryColor}>
                To confirm account deletion, please type "DELETE" in the field below:
              </p>
              
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className={`w-full p-3 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500`}
              />
              
              <button
                className={`w-full p-3 flex items-center justify-center bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors ${deleteConfirmText !== 'DELETE' ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleDeleteRequest}
                disabled={deleteConfirmText !== 'DELETE' || isDeleting}
              >
                {isDeleting ? (
                  <>Processing<span className="animate-pulse">...</span></>
                ) : (
                  <><FaTrash className="mr-2" /> Permanently Delete Account</>
                )}
              </button>
            </div>
            
            <p className={`text-sm ${textSecondaryColor} mt-4`}>
              After deletion is confirmed, you will receive a confirmation email and all your data will be permanently removed within 30 days.
            </p>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDarkMode ? 'bg-black bg-opacity-80' : 'bg-gray-200 bg-opacity-75'}`}>
      <div className={`w-full max-w-3xl ${bgColor} rounded-xl shadow-2xl overflow-hidden`}>
        <div className={`flex border-b ${borderColor}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex-1 py-4 px-4 flex items-center justify-center gap-2 ${
                activeTab === tab.id 
                  ? `${textPrimaryColor} border-b-2 border-orange-500` 
                  : textSecondaryColor
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="p-6">
          {renderContent()}
        </div>
        
        <div className={`p-4 border-t ${borderColor} flex justify-end`}>
          <button
            className={`px-6 py-2 rounded-md ${buttonStyle}`}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyCenter; 