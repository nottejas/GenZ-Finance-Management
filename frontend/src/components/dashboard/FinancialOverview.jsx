import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown, FaPiggyBank, FaWallet, FaChartPie, FaMoneyBillWave, FaEllipsisH } from 'react-icons/fa';
import { useTransactions } from '../../context/TransactionContext';

const FinancialOverview = () => {
  const { financialStats, transactions } = useTransactions();
  const [expenseBreakdown, setExpenseBreakdown] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

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

  return (
    <div className="max-w-6xl mx-auto p-6 bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Financial Overview</h1>
      
      {/* Main Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg transition-all hover:shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-gray-400 text-sm mb-1">Total Balance</h3>
              <div className="text-2xl font-bold">₹{financialStats.totalBalance.toLocaleString()}</div>
            </div>
            <div className="bg-orange-500 bg-opacity-10 w-10 h-10 rounded-full flex items-center justify-center">
              <FaWallet className="text-orange-500 text-lg" />
            </div>
          </div>
          <div className="text-gray-400 text-sm">
            All accounts combined
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg transition-all hover:shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-gray-400 text-sm mb-1">Monthly Income</h3>
              <div className="text-2xl font-bold">₹{financialStats.monthlyIncome.toLocaleString()}</div>
            </div>
            <div className="bg-orange-500 bg-opacity-10 w-10 h-10 rounded-full flex items-center justify-center">
              <FaArrowUp className="text-orange-500 text-lg" />
            </div>
          </div>
          <div className="text-gray-400 text-sm">
            Net income this month
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg transition-all hover:shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-gray-400 text-sm mb-1">Monthly Expenses</h3>
              <div className="text-2xl font-bold">₹{financialStats.monthlyExpenses.toLocaleString()}</div>
            </div>
            <div className="bg-orange-500 bg-opacity-10 w-10 h-10 rounded-full flex items-center justify-center">
              <FaArrowDown className="text-orange-500 text-lg" />
            </div>
          </div>
          <div className="text-gray-400 text-sm">
            Total spent this month
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg transition-all hover:shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-gray-400 text-sm mb-1">Monthly Savings</h3>
              <div className="text-2xl font-bold">₹{financialStats.monthlySavings.toLocaleString()}</div>
            </div>
            <div className="bg-orange-500 bg-opacity-10 w-10 h-10 rounded-full flex items-center justify-center">
              <FaPiggyBank className="text-orange-500 text-lg" />
            </div>
          </div>
          <div className="text-gray-400 text-sm">
            {financialStats.monthlyIncome > 0 
              ? `${Math.round((financialStats.monthlySavings / financialStats.monthlyIncome) * 100)}% of your income` 
              : 'No income recorded'}
          </div>
        </div>
      </div>
      
      {/* Savings Progress */}
      <div className="mb-8">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 text-sm">Savings Goal Progress</h3>
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
          
          <div className="flex justify-between text-sm text-gray-400">
            <span>₹0</span>
            <span>Goal: ₹{(financialStats.monthlyIncome * 0.3).toLocaleString()}</span>
          </div>
          
          <div className="mt-4 text-white">
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
          
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
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
                      <span className="text-gray-400 text-sm">({item.percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                No expense data available for this month
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Transactions */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
          
          <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-lg">
            {recentTransactions.length > 0 ? (
              <>
                <div className="divide-y divide-gray-800">
                  {recentTransactions.map((transaction, index) => (
                    <div key={index} className="p-4 flex justify-between items-center hover:bg-gray-800 transition-colors">
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-gray-400 text-sm">
                          {formatDate(transaction.date)} • {transaction.category}
                        </div>
                      </div>
                      <div className={transaction.type === 'income' ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>
                        {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full py-3 px-4 bg-gray-900 text-white border-t border-gray-800 hover:bg-gray-800 transition-colors">
                  View All Transactions
                </button>
              </>
            ) : (
              <div className="text-center text-gray-400 py-8">
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