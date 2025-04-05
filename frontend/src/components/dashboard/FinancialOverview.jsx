import React, { useState, useEffect } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { useSettings } from '../../context/SettingsContext';
import { FaMoneyBillWave, FaChartPie, FaTimes, FaSpinner } from 'react-icons/fa';

const FinancialOverview = () => {
  const { 
    financialStats, 
    transactions,
    remainingBalance,
    monthlyDeposit,
    depositDate,
    setMonthlyDepositAmount,
    updateMonthlyDeposit,
    deleteMonthlyDeposit
  } = useTransactions();
  const { settings } = useSettings();
  const [expenseBreakdown, setExpenseBreakdown] = useState([]);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [isSettingDeposit, setIsSettingDeposit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Get the current theme
  const isDarkMode = settings?.profile?.darkMode ?? true;
  
  // Calculate expense breakdown when transactions change
  useEffect(() => {
    if (transactions.length > 0) {
      calculateExpenseBreakdown(transactions);
    }
  }, [transactions]);

  const calculateExpenseBreakdown = (transactionData) => {
    // Filter for expenses only
    const expenses = transactionData.filter(t => t.type === 'expense');
    
    // Group by category and sum amounts
    const categoryMap = {};
    expenses.forEach(expense => {
      const category = expense.category || 'Other';
      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }
      categoryMap[category] += expense.amount;
    });
    
    // Convert to array for charting
    const breakdownArray = Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / financialStats.monthlyExpenses) * 100
    }));
    
    // Sort by amount (highest first)
    breakdownArray.sort((a, b) => b.amount - a.amount);
    
    setExpenseBreakdown(breakdownArray);
  };
  
  const handleSetDeposit = async (e) => {
    e.preventDefault();
    
    if (!depositAmount || isNaN(Number(depositAmount)) || Number(depositAmount) <= 0) {
      alert("Please enter a valid deposit amount");
      return;
    }
    
    setIsSettingDeposit(true);
    
    try {
      if (monthlyDeposit > 0) {
        await updateMonthlyDeposit(Number(depositAmount));
        alert("Monthly deposit updated successfully");
      } else {
        await setMonthlyDepositAmount(Number(depositAmount));
        alert("Monthly deposit set successfully");
      }
      
      setShowDepositForm(false);
    } catch (error) {
      console.error("Error setting deposit:", error);
      alert("Failed to set monthly deposit");
    } finally {
      setIsSettingDeposit(false);
    }
  };

  const handleDeleteDeposit = async () => {
    setIsDeleting(true);
    
    try {
      await deleteMonthlyDeposit();
      alert("Monthly deposit deleted successfully");
      setShowDepositForm(false);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting deposit:", error);
      alert("Failed to delete monthly deposit");
    } finally {
      setIsDeleting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate percentage of monthly deposit remaining
  const getDepositRemainingPercentage = () => {
    if (!monthlyDeposit || monthlyDeposit <= 0) return 0;
    return (remainingBalance / monthlyDeposit) * 100;
  };
  
  // Determine color based on percentage
  const getDepositStatusColor = () => {
    const percentage = getDepositRemainingPercentage();
    if (percentage <= 10) return "bg-red-500";
    if (percentage <= 25) return "bg-orange-500";
    if (percentage <= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Financial Overview
        </h1>
        
        <button
          onClick={() => setShowDepositForm(true)}
          className={`py-2 px-4 ${monthlyDeposit > 0 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-orange-500 hover:bg-orange-600'} text-white rounded-md flex items-center`}
        >
          <FaMoneyBillWave className="mr-2" />
          {monthlyDeposit > 0 ? 'Update Deposit' : 'Set Monthly Deposit'}
        </button>
      </div>
      
      {/* Monthly Deposit Card */}
      {monthlyDeposit > 0 && (
        <div className={`mb-6 p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Monthly Deposit</h2>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Track your spending against your monthly budget
              </p>
            </div>
            <div className="text-2xl font-bold">₹{monthlyDeposit.toLocaleString()}</div>
          </div>
          
          <div className="mb-2">
            <div className="flex justify-between mb-1">
              <span>Remaining Balance</span>
              <span>₹{remainingBalance.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  remainingBalance < monthlyDeposit * 0.1 
                    ? 'bg-red-500' 
                    : remainingBalance < monthlyDeposit * 0.25 
                    ? 'bg-orange-500' 
                    : remainingBalance < monthlyDeposit * 0.5 
                    ? 'bg-yellow-500' 
                    : 'bg-green-500'
                }`}
                style={{ width: `${getDepositRemainingPercentage()}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                {Math.round(getDepositRemainingPercentage())}% remaining
              </span>
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Set on {formatDate(depositDate)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Financial Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Income Card */}
        <div className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1`}>Monthly Income</h3>
              <div className="text-2xl font-bold">₹{financialStats.monthlyIncome.toLocaleString()}</div>
            </div>
            <div className="bg-orange-500 bg-opacity-10 w-10 h-10 rounded-full flex items-center justify-center">
              <FaMoneyBillWave className="text-orange-500" />
            </div>
          </div>
          
          <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            vs Last Month: 
            <span className={financialStats.incomeChange >= 0 ? 'text-green-500 ml-1' : 'text-red-500 ml-1'}>
              {financialStats.incomeChange >= 0 ? '+' : ''}{financialStats.incomeChange}%
            </span>
          </div>
        </div>
        
        {/* Expenses Card */}
        <div className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1`}>Monthly Expenses</h3>
              <div className="text-2xl font-bold">₹{financialStats.monthlyExpenses.toLocaleString()}</div>
            </div>
            <div className="bg-orange-500 bg-opacity-10 w-10 h-10 rounded-full flex items-center justify-center">
              <FaChartPie className="text-orange-500" />
            </div>
          </div>
          
          <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            vs Last Month: 
            <span className={financialStats.expenseChange <= 0 ? 'text-green-500 ml-1' : 'text-red-500 ml-1'}>
              {financialStats.expenseChange >= 0 ? '+' : ''}{financialStats.expenseChange}%
            </span>
          </div>
        </div>
        
        {/* Savings Card */}
        <div className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1`}>Monthly Savings</h3>
              <div className="text-2xl font-bold">₹{financialStats.monthlySavings.toLocaleString()}</div>
            </div>
            <div className="bg-orange-500 bg-opacity-10 w-10 h-10 rounded-full flex items-center justify-center">
              <FaMoneyBillWave className="text-orange-500" />
            </div>
          </div>
          
          <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            vs Last Month: 
            <span className={financialStats.savingsChange >= 0 ? 'text-green-500 ml-1' : 'text-red-500 ml-1'}>
              {financialStats.savingsChange >= 0 ? '+' : ''}{financialStats.savingsChange}%
            </span>
          </div>
        </div>
      </div>
      
      {/* Expense Breakdown */}
      <div className={`p-6 rounded-xl ${
        isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
      }`}>
        <h2 className="text-xl font-semibold mb-4">Expense Breakdown</h2>
        
        {expenseBreakdown.length > 0 ? (
          <div className="space-y-4">
            {expenseBreakdown.slice(0, 5).map((category, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span>{category.category}</span>
                  <span>₹{category.amount.toLocaleString()} ({category.percentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            No expense data available. Add some transactions to see your spending breakdown.
          </div>
        )}
      </div>
      
      {/* Monthly Deposit Form Modal */}
      {showDepositForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-xl w-full max-w-md ${
            isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {monthlyDeposit > 0 ? 'Update Monthly Deposit' : 'Set Monthly Deposit'}
              </h2>
              <button 
                className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}
                onClick={() => setShowDepositForm(false)}
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSetDeposit}>
              <div className="mb-4">
                <label className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Deposit Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>₹</span>
                  </div>
                  <input 
                    type="number"
                    value={depositAmount}
                    onChange={e => setDepositAmount(e.target.value)}
                    placeholder="0.00"
                    className={`w-full pl-8 pr-3 py-2 rounded-md border ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-between">
                {monthlyDeposit > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                )}
                
                <div className="ml-auto">
                  <button
                    type="button"
                    onClick={() => setShowDepositForm(false)}
                    className={`mr-2 px-4 py-2 ${
                      isDarkMode 
                        ? 'bg-gray-700 text-white hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    } rounded-md`}
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isSettingDeposit}
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 flex items-center"
                  >
                    {isSettingDeposit && <FaSpinner className="animate-spin mr-2" />}
                    {isSettingDeposit ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </form>
            
            {/* Delete Confirmation */}
            {showDeleteConfirm && (
              <div className="mt-4 p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-md">
                <p className="text-red-500 mb-3">Are you sure you want to delete your monthly deposit?</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className={`mr-2 px-3 py-1 ${
                      isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                    } rounded`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteDeposit}
                    disabled={isDeleting}
                    className="px-3 py-1 bg-red-600 text-white rounded flex items-center"
                  >
                    {isDeleting && <FaSpinner className="animate-spin mr-1" />}
                    {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialOverview;