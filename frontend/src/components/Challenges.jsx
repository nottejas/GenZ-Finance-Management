import React, { useState, useEffect } from 'react';
import { FaLock, FaUnlock, FaTrophy, FaChartLine, FaMoneyBillWave, FaRegClock, FaQuestionCircle, FaGraduationCap } from 'react-icons/fa';

const Challenges = () => {
  const [activeCategory, setActiveCategory] = useState('saving');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);

  const challengeCategories = [
    { id: 'saving', label: 'Saving', icon: <FaMoneyBillWave /> },
    { id: 'budgeting', label: 'Budgeting', icon: <FaChartLine /> },
    { id: 'investing', label: 'Investing', icon: <FaTrophy /> }
  ];

  const allChallenges = {
    saving: [
      {
        id: 1,
        title: "No-Spend Week",
        description: "Save money by avoiding unnecessary purchases for a week",
        difficulty: "Beginner",
        reward: "₹500 savings badge",
        duration: "7 days",
        unlocked: true,
        hasQuiz: true
      },
      {
        id: 2,
        title: "30-Day Savings Sprint",
        description: "Save 10% of your income for 30 days straight",
        difficulty: "Intermediate",
        reward: "₹2,000 savings badge",
        duration: "30 days",
        unlocked: true,
        hasQuiz: true
      },
      {
        id: 3,
        title: "Spare Change Challenge",
        description: "Round up all purchases and save the difference",
        difficulty: "Beginner",
        reward: "₹1,000 savings badge",
        duration: "21 days",
        unlocked: true,
        hasQuiz: false
      },
      {
        id: 4,
        title: "Emergency Fund Builder",
        description: "Build a ₹10,000 emergency fund within 3 months",
        difficulty: "Advanced",
        reward: "Emergency Ready badge + ₹500 bonus",
        duration: "90 days",
        unlocked: false,
        hasQuiz: true
      }
    ],
    budgeting: [
      {
        id: 5,
        title: "Budget Master",
        description: "Stick to your budget for 30 days straight",
        difficulty: "Intermediate",
        reward: "Budget Master badge",
        duration: "30 days",
        unlocked: true,
        hasQuiz: true
      },
      {
        id: 6,
        title: "Expense Tracker Pro",
        description: "Log every expense for 14 days without missing any",
        difficulty: "Beginner",
        reward: "Tracking Expert badge",
        duration: "14 days",
        unlocked: true,
        hasQuiz: false
      },
      {
        id: 7,
        title: "Zero-Based Budget",
        description: "Create and follow a zero-based budget for a month",
        difficulty: "Advanced",
        reward: "Financial Planner badge",
        duration: "30 days",
        unlocked: true,
        hasQuiz: true
      },
      {
        id: 8,
        title: "Category Spending Master",
        description: "Keep all spending categories under budget for 2 months",
        difficulty: "Expert",
        reward: "Budget Guru badge + ₹1,000 bonus",
        duration: "60 days",
        unlocked: false,
        hasQuiz: true
      }
    ],
    investing: [
      {
        id: 9,
        title: "Investment Explorer",
        description: "Learn about and make your first investment",
        difficulty: "Beginner",
        reward: "First Investment badge",
        duration: "14 days",
        unlocked: true,
        hasQuiz: true
      },
      {
        id: 10,
        title: "Diversification Master",
        description: "Create a portfolio with at least 3 different asset classes",
        difficulty: "Intermediate",
        reward: "Diversifier badge",
        duration: "30 days",
        unlocked: true,
        hasQuiz: false
      },
      {
        id: 11,
        title: "SIP Starter",
        description: "Set up and maintain a monthly SIP for 3 months",
        difficulty: "Beginner",
        reward: "Consistent Investor badge",
        duration: "90 days",
        unlocked: true,
        hasQuiz: true
      },
      {
        id: 12,
        title: "Investment Research Pro",
        description: "Research and analyze 5 stocks or mutual funds",
        difficulty: "Advanced",
        reward: "Research Analyst badge + ₹500 bonus",
        duration: "21 days",
        unlocked: false,
        hasQuiz: true
      }
    ]
  };

  const challenges = allChallenges[activeCategory];

  // Fetch quiz questions from a finance trivia API
  const fetchQuizQuestions = async (challengeId) => {
    setLoadingQuiz(true);
    
    try {
      // In a real implementation, you would use an external API like:
      // const API_KEY = import.meta.env.VITE_QUIZ_API_KEY;
      // const response = await fetch(`https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&category=finance&limit=5`);
      
      // For now, use mock data based on the challenge
      const mockQuestions = getMockQuizQuestions(challengeId);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setQuizQuestions(mockQuestions);
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
    } finally {
      setLoadingQuiz(false);
    }
  };

  const startChallenge = (challenge) => {
    setSelectedChallenge(challenge);
    
    if (challenge.hasQuiz) {
      fetchQuizQuestions(challenge.id);
      setShowQuiz(true);
    } else {
      // Just start the challenge without a quiz
      alert(`Challenge "${challenge.title}" started! Track your progress in the app.`);
    }
  };

  // Mock quiz questions based on challenge ID
  const getMockQuizQuestions = (challengeId) => {
    const quizSets = {
      // Saving challenges
      1: [
        {
          id: 101,
          question: "What is the 50/30/20 rule in budgeting?",
          options: [
            "50% needs, 30% wants, 20% savings",
            "50% savings, 30% needs, 20% wants",
            "50% wants, 30% savings, 20% needs",
            "50% investments, 30% needs, 20% wants"
          ],
          correct: 0
        },
        {
          id: 102,
          question: "Which of these is NOT a common savings challenge?",
          options: [
            "52-week savings challenge",
            "No-spend weekend",
            "Luxury vacation challenge",
            "Envelope budgeting"
          ],
          correct: 2
        },
        {
          id: 103,
          question: "What's a good first step when starting a no-spend challenge?",
          options: [
            "Cancel all subscriptions immediately",
            "Define what 'no-spend' means for you and identify exceptions",
            "Transfer all money to a locked savings account",
            "Delete all shopping apps"
          ],
          correct: 1
        }
      ],
      // Investing challenges
      9: [
        {
          id: 901,
          question: "What is SIP in investing?",
          options: [
            "Systematic Investment Plan",
            "Special Interest Payment",
            "Share Investment Profit",
            "Stock Indexing Program"
          ],
          correct: 0
        },
        {
          id: 902,
          question: "What is the main advantage of equity investments over fixed deposits?",
          options: [
            "They are risk-free",
            "They typically offer higher returns over the long term",
            "They provide guaranteed returns",
            "They are always more liquid"
          ],
          correct: 1
        },
        {
          id: 903,
          question: "What is diversification in investing?",
          options: [
            "Buying only high-risk stocks",
            "Investing all money in one industry",
            "Spreading investments across different asset classes to reduce risk",
            "Investing only in government bonds"
          ],
          correct: 2
        }
      ],
      // Default questions for other challenges
      default: [
        {
          id: 1,
          question: "What is a good emergency fund amount?",
          options: [
            "1 week of expenses",
            "1 month of expenses",
            "3-6 months of expenses",
            "1 year of expenses"
          ],
          correct: 2
        },
        {
          id: 2,
          question: "What does 'compound interest' mean?",
          options: [
            "Interest only applied to the principal amount",
            "Interest earned on both principal and accumulated interest",
            "Interest that gets taxed multiple times",
            "Interest paid only at maturity"
          ],
          correct: 1
        },
        {
          id: 3,
          question: "Which of these is generally considered the riskiest investment?",
          options: [
            "Government bonds",
            "Blue-chip stocks",
            "Cryptocurrency",
            "Fixed deposits"
          ],
          correct: 2
        }
      ]
    };
    
    return quizSets[challengeId] || quizSets.default;
  };

  const renderQuiz = () => {
    if (!selectedChallenge) return null;
    
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-blue dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {selectedChallenge.title} - Knowledge Check
            </h3>
            <button 
              onClick={() => setShowQuiz(false)} 
              className="text-gray-500 hover:text-gray-700 dark:text-red-800 dark:hover:text-white"
            >
              ✕
            </button>
          </div>
          
          {loadingQuiz ? (
            <div className="flex justify-center py-10">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {quizQuestions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <p className="text-gray-800 dark:text-white font-medium mb-3">
                    {index + 1}. {question.question}
                  </p>
                  <div className="space-y-2">
                    {question.options.map((option, optIdx) => (
                      <div key={optIdx} className="flex items-center">
                        <input 
                          type="radio" 
                          id={`q${question.id}_o${optIdx}`}
                          name={`question_${question.id}`}
                          className="mr-2"
                        />
                        <label 
                          htmlFor={`q${question.id}_o${optIdx}`}
                          className="text-gray-700 dark:text-gray-300"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowQuiz(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowQuiz(false);
                    alert(`Challenge "${selectedChallenge.title}" started! Track your progress in the app.`);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Submit & Start Challenge
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Financial Challenges</h1>
      
      {/* Challenge Categories */}
      <div className="flex flex-wrap justify-center mb-8">
        {challengeCategories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center px-6 py-3 rounded-full mx-2 mb-2 ${
              activeCategory === category.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>
      
      {/* Challenge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map(challenge => (
          <div 
            key={challenge.id} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{challenge.title}</h3>
                {challenge.unlocked ? (
                  <span className="text-green-500"><FaUnlock /></span>
                ) : (
                  <span className="text-gray-400 dark:text-gray-500"><FaLock /></span>
                )}
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">{challenge.description}</p>
              
              <div className="flex flex-wrap text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="w-1/2 mb-2">
                  <span className="font-medium">Difficulty:</span> {challenge.difficulty}
                </div>
                <div className="w-1/2 mb-2">
                  <span className="font-medium">Duration:</span> {challenge.duration}
                </div>
                <div className="w-full">
                  <span className="font-medium">Reward:</span> {challenge.reward}
                </div>
              </div>
              
              {challenge.hasQuiz && (
                <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 mb-4">
                  <FaGraduationCap className="mr-1" />
                  <span>Includes Knowledge Quiz</span>
                </div>
              )}
              
              <button 
                className={`w-full py-2 px-4 rounded-md ${
                  challenge.unlocked 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
                disabled={!challenge.unlocked}
                onClick={() => challenge.unlocked && startChallenge(challenge)}
              >
                {challenge.unlocked ? 'Start Challenge' : 'Unlock Challenge'}
              </button>
            </div>
            
            {/* Progress indicator for ongoing challenges (future feature) */}
            {false && (
              <div className="bg-gray-100 dark:bg-gray-700 px-5 py-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300 flex items-center">
                    <FaRegClock className="mr-1" /> 5 days left
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">65% Complete</span>
                </div>
                <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2.5 mt-2">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Quiz Modal */}
      {showQuiz && renderQuiz()}
    </div>
  );
};

export default Challenges; 