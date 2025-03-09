import React, { useState } from 'react';

const FinancialOverview = ({ userData }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Example data - in real app, this would come from your backend
  const financialData = {
    currentBalance: 2500.75,
    monthlyIncome: 4000,
    monthlySavings: 800,
    spendingCategories: [
      { name: 'Food & Dining', amount: 600, trend: 'up', emoji: '🍔' },
      { name: 'Shopping', amount: 450, trend: 'down', emoji: '🛍️' },
      { name: 'Entertainment', amount: 200, trend: 'stable', emoji: '🎮' },
      { name: 'Transport', amount: 150, trend: 'up', emoji: '🚗' },
    ],
    subscriptions: [
      { name: 'Netflix', amount: 14.99, dueDate: '2024-03-20' },
      { name: 'Spotify', amount: 9.99, dueDate: '2024-03-15' },
    ],
    bnplPayments: [
      { item: 'iPhone 15', totalAmount: 999, remainingAmount: 749.25, nextPayment: '2024-03-25' },
    ],
  };

  const aiInsights = [
    "🎯 You're on track to meet your savings goal this month!",
    "💡 Tip: Your food spending is 15% higher than last month",
    "🎮 Challenge: Try the 'No Takeout Week' to save extra",
  ];

  return (
    <div className="space-y-6">
      {/* Balance Overview */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Balance</h3>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-purple-600">${financialData.currentBalance.toFixed(2)}</span>
          <span className="ml-2 text-sm text-gray-500">Available Balance</span>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Monthly Income</p>
            <p className="text-xl font-semibold text-purple-700">${financialData.monthlyIncome}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Monthly Savings</p>
            <p className="text-xl font-semibold text-green-700">${financialData.monthlySavings}</p>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Insights</h3>
        <div className="space-y-3">
          {aiInsights.map((insight, index) => (
            <div key={index} className="p-3 bg-purple-50 rounded-lg">
              <p className="text-gray-700">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Spending Categories */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Spending Categories</h3>
        <div className="space-y-4">
          {financialData.spendingCategories.map((category) => (
            <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{category.emoji}</span>
                <span className="font-medium">{category.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">${category.amount}</span>
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
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Payments</h3>
        
        {/* BNPL */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">Buy Now, Pay Later</h4>
          {financialData.bnplPayments.map((payment) => (
            <div key={payment.item} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">{payment.item}</span>
                <span className="text-purple-600 font-semibold">${payment.remainingAmount}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Next payment on {new Date(payment.nextPayment).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {/* Subscriptions */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Subscriptions</h4>
          <div className="space-y-2">
            {financialData.subscriptions.map((sub) => (
              <div key={sub.name} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                <span>{sub.name}</span>
                <div className="text-right">
                  <p className="font-semibold">${sub.amount}</p>
                  <p className="text-sm text-gray-500">Due {new Date(sub.dueDate).toLocaleDateString()}</p>
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