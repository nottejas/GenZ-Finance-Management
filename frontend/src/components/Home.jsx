import React, { useState } from 'react';
import TransactionForm from './transactions/TransactionForm';
import TransactionList from './transactions/TransactionList';
import { useTransactions } from '../context/TransactionContext';
import { useSettings } from '../context/SettingsContext';

const Home = () => {
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const { financialStats } = useTransactions();
  const { settings } = useSettings();
  
  // Get the current theme mode
  const isDarkMode = settings?.profile?.darkMode ?? true;
  
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

  const toggleTransactionsList = () => {
    setShowTransactions(!showTransactions);
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
              className={`${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-gray-100 border-gray-300 hover:bg-gray-200'} py-3 px-5 rounded-md border w-full transition-colors ${textPrimaryColor}`}
              onClick={toggleTransactionsList}
            >
              {showTransactions ? 'Hide Transactions' : 'View Recent Activity'}
            </button>
          </div>
        </div>
        
        <div className={cardStyle}>
          <h2 className="text-xl font-bold text-orange-500 mb-4">Today's Overview</h2>
          <div className={`text-4xl font-bold mt-4 mb-1 ${textPrimaryColor}`}>₹{financialStats.totalBalance.toLocaleString()}</div>
          <div className={textSecondaryColor}>Available Balance</div>
        </div>
      </div>
      
      {showTransactions && (
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