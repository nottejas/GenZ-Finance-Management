import React, { useState } from 'react';
import TransactionForm from './transactions/TransactionForm';
import TransactionList from './transactions/TransactionList';
import { useTransactions } from '../context/TransactionContext';

const Home = () => {
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const { financialStats } = useTransactions();
  
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
    <div className="max-w-6xl mx-auto p-6 bg-black text-white">
      <div className="text-gray-400 text-sm mb-6">{currentTime}</div>
      
      <h1 className="text-4xl font-bold mb-8 flex items-center gap-2">Welcome Back! 👋</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800 transition-all hover:shadow-xl">
          <h2 className="text-xl font-bold text-orange-500 mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            <button 
              className="bg-orange-500 text-white py-3 px-5 rounded-md font-bold w-full transition-colors hover:bg-orange-600"
              onClick={openTransactionForm}
            >
              Add New Transaction
            </button>
            <button 
              className="bg-gray-800 text-white py-3 px-5 rounded-md border border-gray-700 w-full transition-colors hover:bg-gray-700"
              onClick={toggleTransactionsList}
            >
              {showTransactions ? 'Hide Transactions' : 'View Recent Activity'}
            </button>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800 transition-all hover:shadow-xl">
          <h2 className="text-xl font-bold text-orange-500 mb-4">Today's Overview</h2>
          <div className="text-4xl font-bold mt-4 mb-1">₹{financialStats.totalBalance.toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Available Balance</div>
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