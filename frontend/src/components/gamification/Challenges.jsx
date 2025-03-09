import React, { useState } from 'react';

const Challenges = () => {
  const [activeTab, setActiveTab] = useState('active');

  // Example data - in real app, this would come from your backend
  const challenges = {
    active: [
      {
        id: 1,
        title: "No-Spend Weekend",
        description: "Avoid any non-essential spending this weekend",
        reward: "500 points",
        progress: 60,
        endDate: "2024-03-10",
        type: "Saving",
        participants: 234
      },
      {
        id: 2,
        title: "Save $100 this week",
        description: "Put aside $100 from your income",
        reward: "1000 points",
        progress: 75,
        endDate: "2024-03-15",
        type: "Saving",
        participants: 456
      }
    ],
    available: [
      {
        id: 3,
        title: "Subscription Detox",
        description: "Cancel or pause one subscription service",
        reward: "750 points",
        duration: "7 days",
        type: "Saving",
        difficulty: "Medium",
        participants: 189
      },
      {
        id: 4,
        title: "Budget Master",
        description: "Stay within budget for all categories",
        reward: "1500 points",
        duration: "30 days",
        type: "Budgeting",
        difficulty: "Hard",
        participants: 567
      }
    ]
  };

  const leaderboard = [
    { rank: 1, username: "SaveMaster99", points: 12500, avatar: "👑" },
    { rank: 2, username: "MoneyWise", points: 10200, avatar: "🌟" },
    { rank: 3, username: "FrugalPro", points: 9800, avatar: "🏆" },
    { rank: 4, username: "BudgetKing", points: 8900, avatar: "💫" },
    { rank: 5, username: "SaveQueen", points: 8500, avatar: "⭐" }
  ];

  const rewards = [
    {
      id: 1,
      name: "Premium Features",
      cost: "5000 points",
      description: "Unlock advanced analytics and insights",
      icon: "⚡"
    },
    {
      id: 2,
      name: "$10 Gift Card",
      cost: "10000 points",
      description: "Redeem for a popular store",
      icon: "🎁"
    },
    {
      id: 3,
      name: "Custom Theme",
      cost: "3000 points",
      description: "Personalize your dashboard colors",
      icon: "🎨"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Money Challenges 🎮</h1>
          <p className="text-gray-600">Complete challenges to earn rewards and improve your finances</p>
        </div>
        <div className="bg-purple-50 px-4 py-2 rounded-lg">
          <p className="text-sm text-gray-600">Your Points</p>
          <p className="text-xl font-bold text-purple-600">⭐ 2,500</p>
        </div>
      </div>

      {/* Challenge Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('active')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'active'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Active Challenges
            </button>
            <button
              onClick={() => setActiveTab('available')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'available'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Available Challenges
            </button>
          </nav>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges[activeTab].map((challenge) => (
              <div key={challenge.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-200 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{challenge.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{challenge.description}</p>
                  </div>
                  <span className="text-purple-600 font-medium">{challenge.reward}</span>
                </div>
                
                {activeTab === 'active' ? (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ width: `${challenge.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                      <span className="text-gray-500">{challenge.progress}% Complete</span>
                      <span className="text-gray-500">Ends {new Date(challenge.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <p>Duration: {challenge.duration}</p>
                      <p>Difficulty: {challenge.difficulty}</p>
                    </div>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                      Start Challenge
                    </button>
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm text-gray-500">👥 {challenge.participants} participants</span>
                  <span className="text-sm text-gray-500">{challenge.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard and Rewards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Savers 🏆</h2>
          <div className="space-y-4">
            {leaderboard.map((user) => (
              <div key={user.rank} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{user.avatar}</span>
                  <div>
                    <p className="font-medium text-gray-900">{user.username}</p>
                    <p className="text-sm text-gray-500">Rank #{user.rank}</p>
                  </div>
                </div>
                <p className="font-semibold text-purple-600">{user.points} pts</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Rewards Shop 🎁</h2>
          <div className="space-y-4">
            {rewards.map((reward) => (
              <div key={reward.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-200 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{reward.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{reward.name}</p>
                    <p className="text-sm text-gray-500">{reward.description}</p>
                  </div>
                </div>
                <button className="bg-purple-100 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors">
                  {reward.cost}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenges; 