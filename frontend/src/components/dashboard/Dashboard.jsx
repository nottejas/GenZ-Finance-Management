import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Example data - in real app, this would come from your backend
  const quickStats = {
    dailySpending: 45.50,
    monthlyGoal: 2000,
    currentProgress: 1200,
    activeStreaks: 3,
  };

  const activeQuests = [
    {
      id: 1,
      title: "No-Spend Weekend",
      reward: "500 points",
      progress: 60,
      endDate: "2024-03-10",
    },
    {
      id: 2,
      title: "Save $100 this week",
      reward: "1000 points",
      progress: 75,
      endDate: "2024-03-15",
    }
  ];

  const recentTransactions = [
    {
      id: 1,
      merchant: "Starbucks",
      amount: -4.50,
      category: "Food",
      date: "2024-03-06",
      emoji: "☕",
    },
    {
      id: 2,
      merchant: "Amazon",
      amount: -29.99,
      category: "Shopping",
      date: "2024-03-05",
      emoji: "🛍️",
    },
    {
      id: 3,
      merchant: "Salary Deposit",
      amount: 2000.00,
      category: "Income",
      date: "2024-03-01",
      emoji: "💰",
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back! 👋</h1>
          <p className="text-gray-600">Here's what's happening with your money</p>
        </div>
        <Link
          to="/challenges"
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Start New Challenge
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-sm text-gray-600">Today's Spending</p>
          <p className="text-2xl font-bold text-purple-600">${quickStats.dailySpending}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-sm text-gray-600">Monthly Goal</p>
          <div className="mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span>${quickStats.currentProgress}</span>
              <span>${quickStats.monthlyGoal}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${(quickStats.currentProgress / quickStats.monthlyGoal) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-sm text-gray-600">Active Streaks</p>
          <p className="text-2xl font-bold text-purple-600">🔥 {quickStats.activeStreaks}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-sm text-gray-600">Rewards Available</p>
          <p className="text-2xl font-bold text-purple-600">⭐ 2,500</p>
        </div>
      </div>

      {/* Active Quests */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Quests</h2>
        <div className="space-y-4">
          {activeQuests.map((quest) => (
            <div key={quest.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">{quest.title}</h3>
                  <p className="text-sm text-purple-600">Reward: {quest.reward}</p>
                </div>
                <span className="text-sm text-gray-500">
                  Ends {new Date(quest.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${quest.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{quest.progress}% Complete</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h2>
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{transaction.emoji}</span>
                <div>
                  <p className="font-medium text-gray-900">{transaction.merchant}</p>
                  <p className="text-sm text-gray-500">{transaction.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Link
          to="/overview"
          className="block text-center text-purple-600 hover:text-purple-700 mt-4 text-sm font-medium"
        >
          View All Transactions →
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
