import React, { useState } from 'react';

const FinancialOverview = ({ userData }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Format number to Indian currency format
  const formatToINR = (number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(number);
  };

  // Example data - in real app, this would come from your backend
  const financialData = {
    currentBalance: 250075,
    monthlyIncome: 400000,
    monthlySavings: 80000,
    spendingCategories: [
      { name: 'Food & Dining', amount: 60000, trend: 'up', emoji: '🍔' },
      { name: 'Shopping', amount: 45000, trend: 'down', emoji: '🛍️' },
      { name: 'Entertainment', amount: 20000, trend: 'stable', emoji: '🎮' },
      { name: 'Transport', amount: 15000, trend: 'up', emoji: '🚗' },
    ],
    subscriptions: [
      { name: 'Netflix', amount: 1499, dueDate: '2024-03-20' },
      { name: 'Spotify', amount: 999, dueDate: '2024-03-15' },
    ],
    bnplPayments: [
      { item: 'iPhone 15', totalAmount: 99900, remainingAmount: 74925, nextPayment: '2024-03-25' },
    ],
  };

  const aiInsights = [
    "🎯 You're on track to meet your savings goal this month!",
    "💡 Tip: Your food spending is 15% higher than last month",
    "🎮 Challenge: Try the 'No Takeout Week' to save extra",
  ];

  return (
    <div className="space-y-6 dark:bg-gray-900">
      {/* Balance Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Current Balance</h3>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {formatToINR(financialData.currentBalance)}
          </span>
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Available Balance</span>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">Monthly Income</p>
            <p className="text-xl font-semibold text-purple-700 dark:text-purple-400">
              {formatToINR(financialData.monthlyIncome)}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">Monthly Savings</p>
            <p className="text-xl font-semibold text-green-700 dark:text-green-400">
              {formatToINR(financialData.monthlySavings)}
            </p>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">AI Insights</h3>
        <div className="space-y-3">
          {aiInsights.map((insight, index) => (
            <div key={index} className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-gray-700 dark:text-gray-200">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Spending Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Spending Categories</h3>
        <div className="space-y-4">
          {financialData.spendingCategories.map((category) => (
            <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{category.emoji}</span>
                <span className="font-medium dark:text-white">{category.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold dark:text-white">{formatToINR(category.amount)}</span>
                <span className={`text-sm ${
                  category.trend === 'up' ? 'text-red-500' : 
                  category.trend === 'down' ? 'text-green-500' : 
                  'text-gray-500'
                }`}>
                  {category.trend === 'up' ? '↑' : category.trend === 'down' ? '↓' : '→'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BNPL & Subscriptions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Upcoming Payments</h3>
        
        {/* BNPL */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Buy Now, Pay Later</h4>
          {financialData.bnplPayments.map((payment) => (
            <div key={payment.item} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium dark:text-white">{payment.item}</span>
                <span className="text-purple-600 dark:text-purple-400 font-semibold">
                  {formatToINR(payment.remainingAmount)}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Next payment on {new Date(payment.nextPayment).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {/* Subscriptions */}
        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Subscriptions</h4>
          <div className="space-y-2">
            {financialData.subscriptions.map((sub) => (
              <div key={sub.name} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex justify-between items-center">
                <span className="dark:text-white">{sub.name}</span>
                <div className="text-right">
                  <p className="font-semibold dark:text-white">{formatToINR(sub.amount)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Due {new Date(sub.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;