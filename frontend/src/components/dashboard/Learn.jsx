import React, { useState } from 'react';
import { 
  FaGraduationCap, FaBookOpen, FaStar, FaChartLine, 
  FaPiggyBank, FaCreditCard, FaPlayCircle, FaLock,
  FaCheck, FaCheckCircle, FaArrowRight
} from 'react-icons/fa';

const Learn = () => {
  const [activeCategory, setActiveCategory] = useState('Basics');
  const [learningPoints, setLearningPoints] = useState(750);

  // Categories
  const categories = [
    { id: 'Basics', label: 'Basics', icon: '📚' },
    { id: 'Investing', label: 'Investing', icon: '📈' },
    { id: 'Saving', label: 'Saving', icon: '💰' },
    { id: 'Credit', label: 'Credit', icon: '💳' },
  ];

  // Learning modules data
  const modules = [
    {
      id: 1,
      title: 'Introduction to Personal Finance',
      description: 'Learn the basics of managing your money effectively.',
      category: 'Basics',
      icon: <FaBookOpen />,
      duration: '15 mins',
      points: 50,
      completed: true,
    },
    {
      id: 2,
      title: 'Budgeting Fundamentals',
      description: 'Create and maintain a budget that works for you.',
      category: 'Basics',
      icon: <FaChartLine />,
      duration: '25 mins',
      points: 75,
      completed: true,
    },
    {
      id: 3,
      title: 'Understanding Credit Scores',
      description: 'Learn what affects your credit score and how to improve it.',
      category: 'Credit',
      icon: <FaCreditCard />,
      duration: '20 mins',
      points: 60,
      completed: false,
      progress: 50,
    },
    {
      id: 4,
      title: 'Investment Basics',
      description: 'Understand different investment options and strategies.',
      category: 'Investing',
      icon: <FaChartLine />,
      duration: '30 mins',
      points: 100,
      completed: false,
    },
    {
      id: 5,
      title: 'Emergency Fund Basics',
      description: 'Learn why and how to build your emergency savings.',
      category: 'Saving',
      icon: <FaPiggyBank />,
      duration: '15 mins',
      points: 50,
      completed: true,
    },
    {
      id: 6,
      title: 'Stock Market Fundamentals',
      description: 'Understand how stocks work and basic investment concepts.',
      category: 'Investing',
      icon: <FaChartLine />,
      duration: '45 mins',
      points: 120,
      completed: false,
    },
    {
      id: 7,
      title: 'Saving for Major Purchases',
      description: 'Strategies for saving for big expenses like a home or car.',
      category: 'Saving',
      icon: <FaPiggyBank />,
      duration: '25 mins',
      points: 75,
      completed: false,
    },
    {
      id: 8,
      title: 'Credit Cards 101',
      description: 'How to use credit cards responsibly and avoid debt.',
      category: 'Credit',
      icon: <FaCreditCard />,
      duration: '20 mins',
      points: 60,
      completed: false,
    },
  ];

  // Filter modules based on active category
  const filteredModules = modules.filter(module => module.category === activeCategory);

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Financial Education</h1>
          <p className="text-gray-400">Expand your financial knowledge and skills</p>
        </div>
        <div className="bg-gray-900 px-4 py-2 rounded-xl border border-gray-800 flex items-center">
          <FaStar className="text-yellow-500 mr-2" />
          <span className="font-bold">{learningPoints}</span>
          <span className="text-gray-400 ml-1">learning points</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              activeCategory === category.id
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <span className="text-xl">{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Featured Course */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Featured Course</h2>
        <div className="bg-gradient-to-r from-orange-600/30 to-orange-800/30 rounded-xl p-6 border border-orange-900/50">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex-1">
              <div className="text-orange-500 mb-2 flex items-center">
                <FaGraduationCap className="mr-2" />
                <span>FEATURED COURSE</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Financial Freedom Masterclass</h3>
              <p className="text-gray-300 mb-4">
                A comprehensive guide to achieving financial independence through smart planning and investing.
              </p>
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-4">
                  <FaPlayCircle className="text-gray-400 mr-1" />
                  <span className="text-gray-400 text-sm">8 Modules</span>
                </div>
                <div className="flex items-center mr-4">
                  <FaClock className="text-gray-400 mr-1" />
                  <span className="text-gray-400 text-sm">3 Hours</span>
                </div>
                <div className="flex items-center">
                  <FaStar className="text-yellow-500 mr-1" />
                  <span className="text-gray-400 text-sm">300 Points</span>
                </div>
              </div>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors flex items-center">
                Start Learning <FaArrowRight className="ml-2" />
              </button>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6 flex items-center justify-center">
              <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center">
                <FaGraduationCap className="text-4xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Learning Modules */}
      <div>
        <h2 className="text-2xl font-bold mb-4">{activeCategory} Modules</h2>
        {filteredModules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map(module => (
              <div 
                key={module.id} 
                className="bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-all duration-300 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                      {module.icon}
                    </div>
                    <div className="flex items-center text-sm">
                      <FaPlayCircle className="text-gray-400 mr-1" />
                      <span className="text-gray-400">{module.duration}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{module.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-500 mr-1" />
                      <span className="text-sm">{module.points} Points</span>
                    </div>
                    
                    {module.completed ? (
                      <div className="flex items-center text-green-500">
                        <FaCheckCircle className="mr-1" />
                        <span>Completed</span>
                      </div>
                    ) : module.progress ? (
                      <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md text-sm transition-colors">
                        Continue ({module.progress}%)
                      </button>
                    ) : (
                      <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md text-sm transition-colors">
                        Start Learning
                      </button>
                    )}
                  </div>
                </div>
                
                {module.completed && (
                  <div className="bg-green-500/10 px-5 py-2 border-t border-green-900/30">
                    <div className="flex items-center text-green-500 text-sm">
                      <FaCheck className="mr-2" />
                      <span>You've completed this module</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-10 bg-gray-900 rounded-xl border border-gray-800">
            <p className="text-gray-400 text-lg mb-4">No modules found for this category</p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors">
              Explore Other Categories
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Learn; 