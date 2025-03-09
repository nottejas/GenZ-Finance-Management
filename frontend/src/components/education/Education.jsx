import React, { useState } from 'react';

const Education = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: '📚' },
    { id: 'basics', name: 'Basics', icon: '🎓' },
    { id: 'investing', name: 'Investing', icon: '📈' },
    { id: 'saving', name: 'Saving', icon: '💰' },
    { id: 'credit', name: 'Credit', icon: '💳' }
  ];

  const lessons = [
    {
      id: 1,
      title: "Budgeting Basics",
      description: "Learn how to create and stick to a budget",
      duration: "5 mins",
      category: "basics",
      difficulty: "Beginner",
      points: 100,
      thumbnail: "💵",
      completed: true
    },
    {
      id: 2,
      title: "Investing 101",
      description: "Understanding stocks, bonds, and mutual funds",
      duration: "8 mins",
      category: "investing",
      difficulty: "Intermediate",
      points: 150,
      thumbnail: "📊",
      completed: false
    },
    {
      id: 3,
      title: "Credit Score Mastery",
      description: "How to build and maintain good credit",
      duration: "6 mins",
      category: "credit",
      difficulty: "Beginner",
      points: 120,
      thumbnail: "📈",
      completed: false
    }
  ];

  const shortFormContent = [
    {
      id: 1,
      title: "Save Money on Coffee ☕",
      creator: "FinanceGuru",
      likes: "2.5k",
      duration: "60s",
      thumbnail: "☕"
    },
    {
      id: 2,
      title: "Investing Made Simple 📈",
      creator: "StockWhiz",
      likes: "3.8k",
      duration: "45s",
      thumbnail: "💹"
    },
    {
      id: 3,
      title: "5 Money Mistakes to Avoid 🚫",
      creator: "MoneyMaster",
      likes: "4.2k",
      duration: "30s",
      thumbnail: "⚠️"
    }
  ];

  const dailyTips = [
    {
      id: 1,
      tip: "Set up automatic transfers to your savings account on payday",
      category: "saving",
      icon: "💡"
    },
    {
      id: 2,
      tip: "Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings",
      category: "basics",
      icon: "📊"
    },
    {
      id: 3,
      tip: "Check your credit score monthly - it's free!",
      category: "credit",
      icon: "✨"
    }
  ];

  const filteredLessons = selectedCategory === 'all' 
    ? lessons 
    : lessons.filter(lesson => lesson.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Education 📚</h1>
          <p className="text-gray-600">Learn smart money management through bite-sized content</p>
        </div>
        <div className="bg-purple-50 px-4 py-2 rounded-lg">
          <p className="text-sm text-gray-600">Learning Points</p>
          <p className="text-xl font-bold text-purple-600">🎓 750</p>
        </div>
      </div>

      {/* Categories */}
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap ${
              selectedCategory === category.id
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 hover:bg-purple-50'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lessons Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Interactive Lessons</h2>
            <div className="grid gap-4">
              {filteredLessons.map(lesson => (
                <div key={lesson.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-200 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="text-4xl">{lesson.thumbnail}</div>
                      <div>
                        <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{lesson.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-500">⏱️ {lesson.duration}</span>
                          <span className="text-sm text-gray-500">🎯 {lesson.difficulty}</span>
                          <span className="text-sm text-purple-600">⭐ {lesson.points} pts</span>
                        </div>
                      </div>
                    </div>
                    <button
                      className={`px-4 py-2 rounded-lg ${
                        lesson.completed
                          ? 'bg-green-100 text-green-600'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      {lesson.completed ? 'Completed ✓' : 'Start Learning'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Short-Form Content */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Trending Finance Tips</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {shortFormContent.map(content => (
                <div key={content.id} className="border border-gray-200 rounded-lg overflow-hidden hover:border-purple-200 transition-colors">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100 flex items-center justify-center">
                    <span className="text-4xl">{content.thumbnail}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900">{content.title}</h3>
                    <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                      <span>{content.creator}</span>
                      <div className="flex items-center space-x-2">
                        <span>❤️ {content.likes}</span>
                        <span>⏱️ {content.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Daily Tips */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Daily Money Tips</h2>
            <div className="space-y-4">
              {dailyTips.map(tip => (
                <div key={tip.id} className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{tip.icon}</span>
                    <p className="text-gray-700">{tip.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Stats */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Progress</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Lessons Completed</span>
                  <span className="text-purple-600 font-medium">1/3</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '33%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Points Earned</span>
                  <span className="text-purple-600 font-medium">750/1000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education; 