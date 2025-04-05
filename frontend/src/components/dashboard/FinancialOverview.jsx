import React, { useState, useEffect } from 'react';
import { 
  FaArrowUp, 
  FaArrowDown, 
  FaPiggyBank, 
  FaWallet, 
  FaChartPie, 
  FaMoneyBillWave, 
  FaEllipsisH,
  FaPlus,
  FaSpinner,
  FaTimes
} from 'react-icons/fa';
import { useTransactions } from '../../context/TransactionContext';
import { useSettings } from '../../context/SettingsContext';
import { toast } from 'react-hot-toast';

const FinancialOverview = () => {
  const { 
    financialStats, 
    transactions, 
    monthlyDeposit, 
    remainingBalance, 
    depositDate,
    setMonthlyDepositAmount,
    updateMonthlyDeposit,
    deleteMonthlyDeposit
  } = useTransactions();
  const { settings } = useSettings();
  const [expenseBreakdown, setExpenseBreakdown] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Get the current theme
  const isDarkMode = settings?.profile?.darkMode ?? true;

  useEffect(() => {
    // Populate form with current deposit amount when opened
    if (showDepositForm && monthlyDeposit > 0) {
      setDepositAmount(monthlyDeposit.toString());
    }
  }, [showDepositForm, monthlyDeposit]);

  useEffect(() => {
    // Update recent transactions
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    ).slice(0, 5);
    
    setRecentTransactions(sortedTransactions);
    
    // Calculate expense breakdown
    calculateExpenseBreakdown(transactions);
  }, [transactions]);

  const calculateExpenseBreakdown = (transactionData) => {
    // Get current month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Get current month expenses
    const currentMonthExpenses = transactionData.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transaction.type === 'expense' && 
             transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
    
    // Group by category
    const categoryGroups = {};
    let totalExpenses = 0;
    
    currentMonthExpenses.forEach(transaction => {
      if (!categoryGroups[transaction.category]) {
        categoryGroups[transaction.category] = 0;
      }
      categoryGroups[transaction.category] += transaction.amount;
      totalExpenses += transaction.amount;
    });
    
    // Generate color palette
    const colors = ['#FF6B00', '#FF8533', '#FFA366', '#FFBB80', '#FFAD73', '#FFD1AA'];
    
    // Convert to array format
    const breakdown = Object.keys(categoryGroups).map((category, index) => {
      const amount = categoryGroups[category];
      const percentage = totalExpenses ? (amount / totalExpenses) * 100 : 0;
      
      return {
        category,
        amount,
        percentage,
        color: colors[index % colors.length]
      };
    }).sort((a, b) => b.amount - a.amount);
    
    setExpenseBreakdown(breakdown);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Handle deposit form submission
  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    
    if (!depositAmount || isNaN(depositAmount) || Number(depositAmount) <= 0) {
      toast.error('Please enter a valid deposit amount');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // If updating existing deposit
      if (monthlyDeposit > 0) {
        await updateMonthlyDeposit(Number(depositAmount));
        toast.success(`Monthly deposit updated to ₹${Number(depositAmount).toLocaleString()}`);
      } else {
        // New deposit
        await setMonthlyDepositAmount(Number(depositAmount));
        toast.success(`Monthly deposit of ₹${Number(depositAmount).toLocaleString()} set successfully`);
      }
      
      setDepositAmount('');
      setShowDepositForm(false);
    } catch (error) {
      console.error('Error setting/updating deposit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle delete deposit
  const handleDeleteDeposit = async () => {
    setIsDeleting(true);
    
    try {
      await deleteMonthlyDeposit();
      setShowDeleteConfirm(false);
      setShowDepositForm(false);
      toast.success('Monthly deposit deleted successfully');
    } catch (error) {
      console.error('Error deleting deposit:', error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Get percentage of deposit remaining
  const getDepositRemainingPercentage = () => {
    if (!monthlyDeposit) return 0;
    return (remainingBalance / monthlyDeposit) * 100;
  };
  
  // Format deposit date
  const formatDepositDate = () => {
    if (!depositDate) return '';
    
    const date = new Date(depositDate);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div className={`max-w-6xl mx-auto p-6 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Financial Overview</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowDepositForm(true)}
            className={`py-2 px-4 ${monthlyDeposit > 0 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-orange-500 hover:bg-orange-600'} text-white rounded-md flex items-center`}
          >
            <FaMoneyBillWave className="mr-2" /> 
            {monthlyDeposit > 0 ? 'Update Deposit' : 'Set Monthly Deposit'}
          </button>
          <button
            onClick={() => window.location.href = '/transactions'}
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md flex items-center"
          >
            <FaPlus className="mr-2" /> Add Transaction
          </button>
        </div>
      </div>
      
      {/* Monthly Deposit Card */}
      <div className="mb-8">
        {monthlyDeposit > 0 ? (
          <div className={`rounded-xl p-6 border shadow-lg transition-all ${
            isDarkMode 
              ? 'bg-gray-900 border-gray-800' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1`}>Monthly Deposit</h3>
                <div className="text-2xl font-bold">₹{monthlyDeposit.toLocaleString()}</div>
              </div>
              <div className="bg-orange-500 bg-opacity-10 w-10 h-10 rounded-full flex items-center justify-center">
                <FaMoneyBillWave className="text-orange-500 text-lg" />
              </div>
            </div>
            
            <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-3`}>
              Deposit made on {formatDepositDate()}
            </div>
            
            <div className="mb-2 flex justify-between items-center">
              <span className="text-sm font-medium">Remaining Balance</span>
              <span className={`font-medium ${
                remainingBalance < monthlyDeposit * 0.2 
                  ? 'text-red-500' 
                  : remainingBalance < monthlyDeposit * 0.5 
                    ? 'text-yellow-500' 
                    : 'text-green-500'
              }`}>
                ₹{remainingBalance.toLocaleString()}
              </span>
            </div>
            
            <div className="h-2 bg-gray-800 rounded-full mb-2">
              <div 
                className={`h-full rounded-full ${
                  remainingBalance < monthlyDeposit * 0.2 
                    ? 'bg-red-500' 
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
              <button 
                onClick={() => setShowDepositForm(true)}
                className="text-orange-500 hover:text-orange-600"
              >
                Update Deposit
              </button>
            </div>
          </div>
        ) : (
          <div className={`rounded-xl p-6 border shadow-lg transition-all ${
            isDarkMode 
              ? 'bg-gray-900 border-gray-800' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1`}>Monthly Deposit</h3>
                <div className="text-xl font-medium">No deposit set for this month</div>
              </div>
              <div className="bg-orange-500 bg-opacity-10 w-10 h-10 rounded-full flex items-center justify-center">
                <FaMoneyBillWave className="text-orange-500 text-lg" />
              </div>
            </div>
            
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4`}>
              Set your monthly deposit to track your spending against your budget.
            </p>
            
            <button
              onClick={() => setShowDepositForm(true)}
              className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md flex items-center justify-center"
            >
              <FaPlus className="mr-2" /> Set Monthly Deposit
            </button>
          </div>
        )}
        
        {/* Deposit Form Modal */}
        {showDepositForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
            <div className={`w-full max-w-md rounded-xl p-6 ${
              isDarkMode ? 'bg-gray-900' : 'bg-white'
            }`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {monthlyDeposit > 0 ? 'Update Monthly Deposit' : 'Set Monthly Deposit'}
                </h3>
                <button 
                  onClick={() => {
                    setShowDepositForm(false);
                    setShowDeleteConfirm(false);
                    setDepositAmount('');
                  }}
                  className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <FaTimes />
                </button>
              </div>
              
              {showDeleteConfirm ? (
                <div>
                  <p className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Are you sure you want to delete your monthly deposit? This will reset your budget for the month.
                  </p>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className={`px-4 py-2 rounded-md ${
                        isDarkMode 
                          ? 'bg-gray-800 text-white hover:bg-gray-700' 
                          : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                      }`}
                      disabled={isDeleting}
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleDeleteDeposit}
                      disabled={isDeleting}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-70 flex items-center"
                    >
                      {isDeleting ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Deleting...
                        </>
                      ) : (
                        'Yes, Delete'
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleDepositSubmit}>
                  <div className="mb-4">
                    <label className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2`}>
                      Deposit Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
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
                    <p className={`mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {monthlyDeposit > 0 
                        ? 'Update your budget for the current month. All expenses will continue to be deducted from this amount.'
                        : 'This will be your budget for the current month. All expenses will be deducted from this amount.'}
                    </p>
                  </div>
                  
                  <div className="flex justify-between">
                    {monthlyDeposit > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Delete Deposit
                      </button>
                    )}
                    
                    <div className="flex space-x-3 ml-auto">
                      <button
                        type="button"
                        onClick={() => setShowDepositForm(false)}
                        className={`px-4 py-2 rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-800 text-white hover:bg-gray-700' 
                            : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                        }`}
                      >
                        Cancel
                      </button>
                      
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-70 flex items-center"
                      >
                        {isSubmitting ? (
                          <>
                            <FaSpinner className="animate-spin mr-2" />
                            {monthlyDeposit > 0 ? 'Updating...' : 'Setting...'}
                          </>
                        ) : (
                          monthlyDeposit > 0 ? 'Update Deposit' : 'Set Deposit'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Main Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`rounded-xl p-6 border shadow-lg transition-all hover:shadow-xl ${
          isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1`}>Total Balance</h3>
              <div className="text-2xl font-bold">₹{financialStats.totalBalance.toLocaleString()}</div>
            </div>
            <div className="bg-orange-500 bg-opacity-10 w-10 h-10 rounded-full flex items-center justify-center">
              <FaWallet className="text-orange-500 text-lg" />
            </div>
          </div>
          <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            {monthlyDeposit > 0 ? 'Remaining from deposit' : 'All accounts combined'}
          </div>
        </div>
        
        <div className={`rounded-xl p-6 border shadow-lg transition-all hover:shadow-xl ${
          isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1`}>Monthly Income</h3>
              <div className="text-2xl font-bold">₹{financialStats.monthlyIncome.toLocaleString()}</div>
            </div>
            <div className="bg-orange-500 bg-opacity-10 w-10 h-10 rounded-full flex items-center justify-center">
              <FaArrowUp className="text-orange-500 text-lg" />
            </div>
          </div>
          <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            Net income this month
          </div>
        </div>
        
        <div className={`rounded-xl p-6 border shadow-lg transition-all hover:shadow-xl ${
          isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1`}>Monthly Expenses</h3>
              <div className="text-2xl font-bold">₹{financialStats.monthlyExpenses.toLocaleString()}</div>
            </div>
            <div className="bg-orange-500 bg-opacity-10 w-10 h-10 rounded-full flex items-center justify-center">
              <FaArrowDown className="text-orange-500 text-lg" />
            </div>
          </div>
          <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            Total spent this month
          </div>
        </div>
        
        <div className={`rounded-xl p-6 border shadow-lg transition-all hover:shadow-xl ${
          isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1`}>Monthly Savings</h3>
              <div className="text-2xl font-bold">₹{financialStats.monthlySavings.toLocaleString()}</div>
            </div>
            <div className="bg-orange-500 bg-opacity-10 w-10 h-10 rounded-full flex items-center justify-center">
              <FaPiggyBank className="text-orange-500 text-lg" />
            </div>
          </div>
          <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            {financialStats.monthlyIncome > 0 
              ? `${Math.round((financialStats.monthlySavings / financialStats.monthlyIncome) * 100)}% of your income` 
              : 'No income recorded'}
          </div>
        </div>
      </div>
      
      {/* Savings Progress */}
      <div className="mb-8">
        <div className={`rounded-xl p-6 border shadow-lg ${
          isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Savings Goal Progress</h3>
            <div className="bg-orange-500 bg-opacity-10 px-3 py-1 rounded-full text-sm text-orange-500">
              {financialStats.monthlySavings > 0 
                ? `${Math.round((financialStats.monthlySavings / financialStats.monthlyIncome) * 100)}%` 
                : '0%'}
            </div>
          </div>
          
          <div className="h-2 bg-gray-800 rounded-full mb-2">
            <div 
              className="h-full bg-orange-500 rounded-full" 
              style={{ 
                width: `${financialStats.monthlySavings > 0 ? 
                  Math.min((financialStats.monthlySavings / financialStats.monthlyIncome) * 100, 100) : 0}%` 
              }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>₹0</span>
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Goal: ₹{(financialStats.monthlyIncome * 0.3).toLocaleString()}
            </span>
          </div>
          
          <div className="mt-4">
            {financialStats.monthlySavings > 0 
              ? (financialStats.monthlySavings >= financialStats.monthlyIncome * 0.3
                ? "You've reached your savings goal this month! 🎉"
                : "You're on track to meet your monthly savings goal of 30% of your income.")
              : 'Set a savings goal to track your progress.'}
          </div>
        </div>
      </div>
      
      {/* Expense Breakdown and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Expense Breakdown</h2>
          
          <div className={`rounded-xl p-6 border shadow-lg ${
            isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            {expenseBreakdown.length > 0 ? (
              <div className="flex flex-col gap-3">
                {expenseBreakdown.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span>{item.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>₹{item.amount.toLocaleString()}</span>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        ({item.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No expense data available for this month
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Transactions */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
          
          <div className={`rounded-xl overflow-hidden border shadow-lg ${
            isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            {recentTransactions.length > 0 ? (
              <>
                <div className={`divide-y ${isDarkMode ? 'divide-gray-800' : 'divide-gray-200'}`}>
                  {recentTransactions.map((transaction, index) => (
                    <div key={index} className={`p-4 flex justify-between items-center ${
                      isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                    } transition-colors`}>
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {formatDate(transaction.date)} • {transaction.category}
                        </div>
                      </div>
                      <div className={transaction.type === 'income' ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>
                        {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                <button className={`w-full py-3 px-4 border-t ${
                  isDarkMode 
                    ? 'bg-gray-900 text-white border-gray-800 hover:bg-gray-800' 
                    : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
                } transition-colors`}>
                  View All Transactions
                </button>
              </>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No recent transactions
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;