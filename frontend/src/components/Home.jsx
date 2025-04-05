import React, { useState } from 'react';
import TransactionForm from './transactions/TransactionForm';
import TransactionList from './transactions/TransactionList';
import { useTransactions } from '../context/TransactionContext';
import { useSettings } from '../context/SettingsContext';
import { FaEyeSlash, FaLock, FaMoneyBillWave } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const { financialStats, monthlyDeposit } = useTransactions();
  const { settings } = useSettings();
  const navigate = useNavigate();
  
  // Get the current theme mode and privacy settings
  const isDarkMode = settings?.profile?.darkMode ?? true;
  const showBalances = settings?.privacySettings?.showBalances ?? true;
  const showActivity = settings?.privacySettings?.showActivity ?? true;
  
  // Styling based on theme
  const cardStyle = isDarkMode 
    ? "bg-gray-900 border border-gray-800 border-orange-500 border-l-4 rounded-xl p-6 shadow-lg transition-all hover:shadow-xl" 
    : "bg-white border border-gray-200 border-orange-500 border-l-4 rounded-xl p-6 shadow-sm transition-all hover:shadow-md";
    
  const textPrimaryColor = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondaryColor = isDarkMode ? "text-gray-400" : "text-gray-600";
  
  // In a real app, this would come from authentication
  const userId = "65b7c2e8a51e2b0dc48d11a8"; // Example user ID
  
  const currentTime = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const openTransactionForm = () => {
    setIsTransactionFormOpen(true);
  };

  const closeTransactionForm = () => {
    setIsTransactionFormOpen(false);
  };
  
  const navigateToOverview = () => {
    navigate('/overview');
  };

  const toggleTransactionsList = () => {
    if (!showActivity) {
      // Show a message that activity is hidden due to privacy settings
      return;
    }
    setShowTransactions(!showTransactions);
  };

  // Function to render balance based on privacy settings
  const renderBalance = () => {
    if (showBalances) {
      return (
        <>
          <div className={`text-4xl font-bold mt-4 mb-1 ${textPrimaryColor}`}>₹{financialStats.totalBalance.toLocaleString()}</div>
          <div className={textSecondaryColor}>Available Balance</div>
          
          {monthlyDeposit > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className={`text-sm ${textSecondaryColor}`}>Monthly Deposit</div>
              <div className={`text-xl font-medium ${textPrimaryColor}`}>₹{monthlyDeposit.toLocaleString()}</div>
            </div>
          )}
        </>
      );
    } else {
      return (
        <div className="text-center py-4">
          <FaEyeSlash className={`text-4xl ${textSecondaryColor} mx-auto mb-2`} />
          <div className={textSecondaryColor}>Balance hidden</div>
          <button 
            className="mt-2 text-orange-500 text-sm underline"
            onClick={() => window.location.href = '/settings'} // In a real app, use React Router
          >
            Change in Privacy Settings
          </button>
        </div>
      );
    }
  };

  return (
    <div className={`max-w-6xl mx-auto p-6 ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-black'}`}>
      <div className={`${textSecondaryColor} text-sm mb-6`}>{currentTime}</div>
      
      <h1 className={`text-4xl font-bold mb-8 flex items-center gap-2 ${textPrimaryColor}`}>Welcome Back! 👋</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className={cardStyle}>
          <h2 className="text-xl font-bold text-orange-500 mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            <button 
              className="bg-orange-500 text-white py-3 px-5 rounded-md font-bold w-full transition-colors hover:bg-orange-600"
              onClick={openTransactionForm}
            >
              Add New Transaction
            </button>
            
            <button 
              className={`py-3 px-5 rounded-md font-bold w-full transition-colors ${
                monthlyDeposit > 0 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
              onClick={navigateToOverview}
            >
              <div className="flex items-center justify-center">
                <FaMoneyBillWave className="mr-2" />
                {monthlyDeposit > 0 ? 'Update Monthly Deposit' : 'Set Monthly Deposit'}
              </div>
            </button>
            
            <button 
              className={`${!showActivity ? 'opacity-50 cursor-not-allowed' : ''} ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-gray-100 border-gray-300 hover:bg-gray-200'} py-3 px-5 rounded-md border w-full transition-colors ${textPrimaryColor}`}
              onClick={() => {
                if (showActivity) {
                  toggleTransactionsList();
                } else {
                  window.location.href = '/settings'; // In a real app, use React Router
                }
              }}
            >
              {!showActivity ? (
                <span className="flex items-center justify-center">
                  <FaLock className="mr-2" /> Activity Hidden
                </span>
              ) : (
                showTransactions ? 'Hide Transactions' : 'View Recent Activity'
              )}
            </button>
          </div>
        </div>
        
        <div className={cardStyle}>
          <h2 className="text-xl font-bold text-orange-500 mb-4">Today's Overview</h2>
          {renderBalance()}
        </div>
      </div>
      
      {showTransactions && showActivity && (
        <div className="mt-8">
          <TransactionList userId={userId} />
        </div>
      )}
      
      <TransactionForm 
        isOpen={isTransactionFormOpen} 
        onClose={closeTransactionForm} 
        userId={userId}
      />
    </div>
  );
};

export default Home; 