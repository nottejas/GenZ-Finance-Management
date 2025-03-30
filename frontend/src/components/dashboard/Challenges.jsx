import React, { useState } from 'react';
import { 
  FaTrophy, FaMedal, FaRegCalendarAlt, FaLock, FaCheck, 
  FaClock, FaArrowRight, FaStar, FaCoins, FaChartLine
} from 'react-icons/fa';

const Challenges = () => {
  const [activeTab, setActiveTab] = useState('active');
  
  // Sample user data
  const userData = {
    level: 5,
    points: 1250,
    streak: 14,
    challengesCompleted: 12,
    rank: 'Bronze',
  };
  
  // Sample challenges data
  const challenges = [
    {
      id: 1,
      title: "Save ₹5,000 This Month",
      description: "Reach your savings goal by the end of the month.",
      reward: 150,
      progress: 65,
      deadline: "May 31, 2023",
      category: "Saving",
      status: "active",
    },
    {
      id: 2,
      title: "No Spend Weekend",
      description: "Avoid non-essential spending this weekend.",
      reward: 50,
      progress: 0,
      deadline: "May 7, 2023",
      category: "Budgeting",
      status: "active",
    },
    {
      id: 3,
      title: "Track All Expenses",
      description: "Log all your expenses for 7 consecutive days.",
      reward: 75,
      progress: 100,
      deadline: "April 27, 2023",
      category: "Tracking",
      status: "completed",
    },
    {
      id: 4,
      title: "Setup Emergency Fund",
      description: "Start an emergency fund with at least ₹10,000.",
      reward: 200,
      progress: 100,
      deadline: "April 15, 2023",
      category: "Saving",
      status: "completed",
    },
    {
      id: 5,
      title: "Invest in Index Fund",
      description: "Make your first index fund investment.",
      reward: 300,
      progress: 0,
      deadline: "June 15, 2023",
      category: "Investing",
      status: "upcoming",
    },
    {
      id: 6,
      title: "Create a Budget Plan",
      description: "Define a budget for all spending categories.",
      reward: 100,
      progress: 0,
      deadline: "June 10, 2023",
      category: "Budgeting",
      status: "upcoming",
    },
  ];
  
  const filteredChallenges = challenges.filter(challenge => challenge.status === activeTab);
  
  return (
    <div className="bg-black text-white min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Money Challenges</h1>
        <p className="text-gray-400">Complete challenges to improve your financial habits and earn rewards</p>
      </div>
      
      {/* User Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-gray-400 text-sm">Current Level</h2>
              <div className="text-xl font-bold text-white mt-1 flex items-center">
                <FaStar className="text-yellow-500 mr-2" />
                Level {userData.level}
              </div>
            </div>
            <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full">
              {userData.level}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-gray-400 text-sm">Total Points</h2>
              <div className="text-xl font-bold text-white mt-1 flex items-center">
                <FaCoins className="text-yellow-500 mr-2" />
                {userData.points} Points
              </div>
            </div>
            <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 rounded-full">
              <FaCoins />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-gray-400 text-sm">Current Streak</h2>
              <div className="text-xl font-bold text-white mt-1 flex items-center">
                <FaChartLine className="text-green-500 mr-2" />
                {userData.streak} Days
              </div>
            </div>
            <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600 rounded-full">
              <FaChartLine />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-gray-400 text-sm">Your Rank</h2>
              <div className="text-xl font-bold text-white mt-1 flex items-center">
                <FaMedal className="text-yellow-600 mr-2" />
                {userData.rank}
              </div>
            </div>
            <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-full">
              <FaMedal />
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs Section */}
      <div className="flex border-b border-gray-800 mb-6">
        <button 
          onClick={() => setActiveTab('active')}
          className={`px-6 py-3 flex items-center ${
            activeTab === 'active' 
              ? 'text-orange-500 border-b-2 border-orange-500' 
              : 'text-gray-400 border-transparent'
          }`}
        >
          <FaClock className="mr-2" />
          Active Challenges
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          className={`px-6 py-3 flex items-center ${
            activeTab === 'completed' 
              ? 'text-orange-500 border-b-2 border-orange-500' 
              : 'text-gray-400 border-transparent'
          }`}
        >
          <FaCheck className="mr-2" />
          Completed
        </button>
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`px-6 py-3 flex items-center ${
            activeTab === 'upcoming' 
              ? 'text-orange-500 border-b-2 border-orange-500' 
              : 'text-gray-400 border-transparent'
          }`}
        >
          <FaLock className="mr-2" />
          Upcoming
        </button>
      </div>
      
      {/* Challenges Cards */}
      {filteredChallenges.length === 0 ? (
        <div className="text-center p-10 bg-gray-900 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-lg mb-4">No {activeTab} challenges found</p>
          <button className="bg-orange-500 text-white py-2 px-4 rounded-md inline-flex items-center">
            Discover Challenges <FaArrowRight className="ml-2" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map(challenge => (
            <div key={challenge.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-gray-800 rounded-full text-xs font-medium text-gray-300">
                  {challenge.category}
                </span>
                <div className="flex items-center text-yellow-500">
                  <FaCoins className="mr-1" />
                  <span>{challenge.reward} Points</span>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-2 text-white">{challenge.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{challenge.description}</p>
              
              {challenge.status === 'active' && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">{challenge.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-orange-400 to-orange-600 h-2.5 rounded-full" 
                      style={{ width: `${challenge.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <div className="flex items-center text-gray-400 text-sm">
                  <FaRegCalendarAlt className="mr-2" />
                  {challenge.deadline}
                </div>
                
                {challenge.status === 'active' && (
                  <button className="text-orange-500 hover:text-orange-400 font-medium">
                    View Details
                  </button>
                )}
                
                {challenge.status === 'completed' && (
                  <span className="flex items-center text-green-500">
                    <FaCheck className="mr-1" /> Completed
                  </span>
                )}
                
                {challenge.status === 'upcoming' && (
                  <button className="px-3 py-1 bg-gray-800 text-white rounded-md text-sm">
                    Remind Me
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Achievement Section (Only show for completed tab) */}
      {activeTab === 'completed' && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FaTrophy className="text-yellow-500 mr-2" /> Your Achievements
          </h2>
          
          <div className="bg-gradient-to-br from-orange-500/30 to-yellow-600/30 p-6 rounded-xl border border-orange-900/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Consistency Master</h3>
                <p className="text-gray-300">You've completed {userData.challengesCompleted} financial challenges!</p>
                <div className="mt-4">
                  <button className="bg-black/30 hover:bg-black/50 transition-colors text-white py-2 px-4 rounded-md inline-flex items-center text-sm">
                    Share Achievement <FaArrowRight className="ml-2" />
                  </button>
                </div>
              </div>
              
              <div className="w-24 h-24 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full">
                <FaTrophy className="text-white text-4xl" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Challenges; 