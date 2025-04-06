import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaTrophy, FaCheck, FaBookmark, FaRegBookmark, FaPlay } from 'react-icons/fa';
import { useEducation } from '../../context/EducationContext';
import { useSettings } from '../../context/SettingsContext';
import ShortFormContent from './ShortFormContent';

const Education = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [showShortForm, setShowShortForm] = useState(false);
  const { settings } = useSettings();
  const { 
    userPoints, 
    completeLesson, 
    toggleSaveLesson, 
    isLessonCompleted, 
    isLessonSaved,
    getCompletedLessonsCount
  } = useEducation();
  
  // Get the current theme mode
  const isDarkMode = settings?.profile?.darkMode ?? true;

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
      content: [
        {
          type: "heading",
          text: "Why Budgeting Matters"
        },
        {
          type: "paragraph",
          text: "A budget is a plan that helps you track your income and expenses. It's the foundation of financial wellness and helps you make informed decisions about your money."
        },
        {
          type: "tip",
          text: "Think of budgeting as a way to give every rupee a purpose rather than a restriction on spending."
        },
        {
          type: "heading",
          text: "The 50/30/20 Rule"
        },
        {
          type: "paragraph",
          text: "The 50/30/20 rule is a simple budgeting method that allocates your after-tax income to three categories:"
        },
        {
          type: "list",
          items: [
            "50% to needs (housing, food, utilities, etc.)",
            "30% to wants (entertainment, dining out, etc.)",
            "20% to savings and debt repayment"
          ]
        },
        {
          type: "image",
          src: "budget-chart.jpg",
          alt: "Budget allocation pie chart",
          placeholder: "📊"
        },
        {
          type: "heading",
          text: "Creating Your First Budget"
        },
        {
          type: "paragraph",
          text: "Follow these steps to create an effective budget:"
        },
        {
          type: "list",
          items: [
            "Calculate your monthly income",
            "List all your monthly expenses",
            "Categorize your expenses as needs, wants, and savings",
            "Set spending limits for each category",
            "Track your spending throughout the month",
            "Review and adjust your budget regularly"
          ]
        },
        {
          type: "quiz",
          question: "What percentage should go to needs in the 50/30/20 rule?",
          options: ["30%", "50%", "20%", "40%"],
          correctIndex: 1
        }
      ]
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
      content: [
        {
          type: "heading",
          text: "What is Investing?"
        },
        {
          type: "paragraph",
          text: "Investing means putting money into assets with the expectation of generating returns over time. Unlike saving, investing involves risk but offers potential for higher returns."
        },
        {
          type: "heading",
          text: "Types of Investments"
        },
        {
          type: "list",
          items: [
            "Stocks: Ownership shares in a company",
            "Bonds: Loans to companies or governments",
            "Mutual Funds: Professionally managed investment pools",
            "ETFs: Exchange-traded funds that trade like stocks",
            "Real Estate: Property investments"
          ]
        },
        {
          type: "tip",
          text: "Start investing early! Time in the market beats timing the market."
        },
        {
          type: "heading",
          text: "Risk and Return"
        },
        {
          type: "paragraph",
          text: "Higher potential returns generally come with higher risks. Your investment strategy should align with your risk tolerance, financial goals, and time horizon."
        },
        {
          type: "image",
          src: "risk-return.jpg",
          alt: "Risk vs Return graph",
          placeholder: "📈"
        },
        {
          type: "heading",
          text: "Getting Started"
        },
        {
          type: "paragraph",
          text: "Here's how to begin your investment journey:"
        },
        {
          type: "list",
          items: [
            "Set clear financial goals",
            "Build an emergency fund first",
            "Understand your risk tolerance",
            "Research investment options",
            "Start with small amounts",
            "Diversify your investments",
            "Regularly review your portfolio"
          ]
        },
        {
          type: "quiz",
          question: "Which typically has higher risk and potential return?",
          options: ["Government bonds", "Savings account", "Stocks", "Fixed deposits"],
          correctIndex: 2
        }
      ]
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
      content: [
        {
          type: "heading",
          text: "Understanding Credit Scores"
        },
        {
          type: "paragraph",
          text: "A credit score is a number that represents your creditworthiness. In India, credit scores typically range from 300 to 900, with higher scores indicating better creditworthiness."
        },
        {
          type: "heading",
          text: "Factors Affecting Your Credit Score"
        },
        {
          type: "list",
          items: [
            "Payment history (35%): Whether you've paid past credit accounts on time",
            "Credit utilization (30%): The amount of credit you're using compared to your credit limit",
            "Credit history length (15%): How long you've been using credit",
            "Credit mix (10%): The types of credit accounts you have",
            "New credit (10%): How often you apply for new credit"
          ]
        },
        {
          type: "tip",
          text: "Aim to keep your credit utilization below 30% of your total credit limit."
        },
        {
          type: "heading",
          text: "Ways to Improve Your Credit Score"
        },
        {
          type: "paragraph",
          text: "Here are some strategies to boost your credit score:"
        },
        {
          type: "list",
          items: [
            "Pay all bills on time",
            "Reduce outstanding debt",
            "Keep old credit accounts open",
            "Limit applications for new credit",
            "Regularly check your credit report for errors",
            "Maintain a mix of credit types",
            "Keep credit card balances low"
          ]
        },
        {
          type: "heading",
          text: "Monitoring Your Credit"
        },
        {
          type: "paragraph",
          text: "You're entitled to one free credit report per year from each credit bureau. Regular monitoring helps detect errors and prevent identity theft."
        },
        {
          type: "quiz",
          question: "What is a good credit score range in India?",
          options: ["300-500", "500-650", "650-750", "750-900"],
          correctIndex: 3
        }
      ]
    }
  ];

  const shortFormContent = [
    {
      id: 1,
      title: "Save Money on Coffee ☕",
      creator: "FinanceGuru",
      likes: "2.5k",
      duration: "60s",
      thumbnail: "☕",
      description: "Small daily savings add up to big yearly results!"
    },
    {
      id: 2,
      title: "Investing Made Simple 📈",
      creator: "StockWhiz",
      likes: "3.8k",
      duration: "45s",
      thumbnail: "💹",
      description: "Start with index funds for easy diversification"
    },
    {
      id: 3,
      title: "5 Money Mistakes to Avoid 🚫",
      creator: "MoneyMaster",
      likes: "4.2k",
      duration: "30s",
      thumbnail: "⚠️",
      description: "Don't fall into these common financial traps!"
    },
    {
      id: 4,
      title: "Save on Electricity Bills 💡",
      creator: "EcoSaver",
      likes: "1.8k",
      duration: "50s",
      thumbnail: "💡",
      description: "Simple habits to cut your monthly bills in half"
    },
    {
      id: 5,
      title: "Emergency Fund Basics 🚨",
      creator: "FinanceGuru",
      likes: "3.1k",
      duration: "55s",
      thumbnail: "🚨",
      description: "How to build your financial safety net quickly"
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

  const handleStartLearning = (lesson) => {
    setSelectedLesson(lesson);
    setAnsweredQuestions({});
  };

  const handleCompleteLessons = (lessonId) => {
    // Find the lesson to get its points
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      completeLesson(lessonId, lesson.points);
    }
    setSelectedLesson(null);
  };

  const handleBackToLessons = () => {
    setSelectedLesson(null);
  };

  const handleSaveLesson = (lessonId) => {
    toggleSaveLesson(lessonId);
  };

  const handleOpenShortForm = () => {
    setShowShortForm(true);
  };

  const handleCloseShortForm = () => {
    setShowShortForm(false);
  };

  const handleAnswerQuestion = (questionIndex, answerIndex, correctIndex) => {
    setAnsweredQuestions(prev => ({
      ...prev,
      [questionIndex]: {
        answered: true,
        isCorrect: answerIndex === correctIndex
      }
    }));
  };

  // Get theme-specific class names
  const getThemeClasses = () => {
    return {
      bgColor: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
      textColor: isDarkMode ? 'text-white' : 'text-gray-900',
      secondaryTextColor: isDarkMode ? 'text-gray-400' : 'text-gray-600',
      cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
      cardBorder: isDarkMode ? 'border-gray-700' : 'border-gray-200'
    };
  };

  const themeClasses = getThemeClasses();

  // If a lesson is selected, render the lesson content instead of the main education page
  if (selectedLesson) {
    return (
      <div className={`max-w-4xl mx-auto space-y-6 ${themeClasses.bgColor} ${themeClasses.textColor} p-6`}>
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleBackToLessons}
            className="p-2 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{selectedLesson.title}</h1>
            <p className={themeClasses.secondaryTextColor}>{selectedLesson.description}</p>
          </div>
        </div>

        {/* Lesson info bar */}
        <div className={`flex items-center justify-between ${themeClasses.cardBg} p-4 rounded-lg shadow-sm`}>
          <div className="flex items-center space-x-4">
            <span className={`text-sm ${themeClasses.secondaryTextColor}`}>⏱️ {selectedLesson.duration}</span>
            <span className={`text-sm ${themeClasses.secondaryTextColor}`}>🎯 {selectedLesson.difficulty}</span>
            <span className="text-sm text-purple-600">⭐ {selectedLesson.points} pts</span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => handleSaveLesson(selectedLesson.id)}
              className="flex items-center text-gray-700 hover:text-purple-700 p-2"
            >
              {isLessonSaved(selectedLesson.id) ? (
                <><FaBookmark className="mr-1" /> Saved</>
              ) : (
                <><FaRegBookmark className="mr-1" /> Save</>
              )}
            </button>
          </div>
        </div>

        {/* Lesson content */}
        <div className={`${themeClasses.cardBg} p-6 rounded-lg shadow-sm space-y-6`}>
          {selectedLesson.content.map((block, index) => {
            switch (block.type) {
              case "heading":
                return <h2 key={index} className="text-xl font-bold mt-8 mb-4">{block.text}</h2>;
              
              case "paragraph":
                return <p key={index} className={`${themeClasses.secondaryTextColor} mb-4 leading-relaxed`}>{block.text}</p>;
              
              case "list":
                return (
                  <ul key={index} className={`list-disc pl-6 space-y-2 ${themeClasses.secondaryTextColor} mb-4`}>
                    {block.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                );
              
              case "tip":
                return (
                  <div key={index} className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                    <p className="text-blue-700"><strong>Pro Tip:</strong> {block.text}</p>
                  </div>
                );
              
              case "image":
                return (
                  <div key={index} className="my-6 bg-gray-100 p-8 rounded-lg flex items-center justify-center">
                    {/* In a real app, use actual images instead of placeholders */}
                    <div className="text-6xl">{block.placeholder}</div>
                  </div>
                );
              
              case "quiz":
                return (
                  <div key={index} className="bg-purple-50 p-6 rounded-lg my-8">
                    <h3 className="text-lg font-semibold text-purple-800 mb-4">Quick Quiz</h3>
                    <p className="text-gray-800 mb-4">{block.question}</p>
                    <div className="space-y-2">
                      {block.options.map((option, i) => {
                        const isAnswered = answeredQuestions[index]?.answered;
                        const isCorrect = i === block.correctIndex;
                        const wasSelected = answeredQuestions[index]?.answered && 
                                          (i === block.correctIndex || 
                                          (answeredQuestions[index]?.selectedIndex === i));
                                          
                        let buttonClass = "w-full text-left p-3 rounded-lg transition ";
                        
                        if (isAnswered) {
                          if (isCorrect) {
                            buttonClass += "bg-green-100 text-green-800";
                          } else if (wasSelected) {
                            buttonClass += "bg-red-100 text-red-800";
                          } else {
                            buttonClass += "bg-gray-100 text-gray-800";
                          }
                        } else {
                          buttonClass += "bg-white hover:bg-gray-100 text-gray-800";
                        }
                        
                        return (
                          <button 
                            key={i}
                            onClick={() => !isAnswered && handleAnswerQuestion(index, i, block.correctIndex)}
                            className={buttonClass}
                            disabled={isAnswered}
                          >
                            {option} {isAnswered && isCorrect && <FaCheck className="inline ml-2" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              
              default:
                return null;
            }
          })}
        </div>

        {/* Completion button */}
        <div className="flex justify-center pt-6 pb-12">
          <button 
            onClick={() => handleCompleteLessons(selectedLesson.id)} 
            className={`flex items-center ${
              isLessonCompleted(selectedLesson.id) 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-purple-600 hover:bg-purple-700"
            } text-white px-6 py-3 rounded-lg font-medium transition`}
          >
            <FaTrophy className="mr-2" /> 
            {isLessonCompleted(selectedLesson.id) ? "Already Completed" : "Mark as Completed"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${themeClasses.bgColor} ${themeClasses.textColor} p-6`}>
      {/* Short Form Content Modal */}
      {showShortForm && (
        <ShortFormContent 
          content={shortFormContent} 
          onClose={handleCloseShortForm} 
        />
      )}
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Financial Education 📚</h1>
          <p className={themeClasses.secondaryTextColor}>Learn smart money management through bite-sized content</p>
        </div>
        <div className="bg-purple-50 px-4 py-2 rounded-lg">
          <p className="text-sm text-gray-600">Learning Points</p>
          <p className="text-xl font-bold text-purple-600">🎓 {userPoints}</p>
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
                : `${themeClasses.cardBg} ${themeClasses.secondaryTextColor} hover:bg-purple-50 hover:text-purple-900`
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
          <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm border ${themeClasses.cardBorder}`}>
            <h2 className="text-xl font-semibold mb-4">Interactive Lessons</h2>
            <div className="grid gap-4">
              {filteredLessons.map(lesson => (
                <div key={lesson.id} className={`border ${themeClasses.cardBorder} rounded-lg p-4 hover:border-purple-200 transition-colors`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="text-4xl">{lesson.thumbnail}</div>
                      <div>
                        <h3 className="font-medium">{lesson.title}</h3>
                        <p className={`text-sm ${themeClasses.secondaryTextColor} mt-1`}>{lesson.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`text-sm ${themeClasses.secondaryTextColor}`}>⏱️ {lesson.duration}</span>
                          <span className={`text-sm ${themeClasses.secondaryTextColor}`}>🎯 {lesson.difficulty}</span>
                          <span className="text-sm text-purple-600">⭐ {lesson.points} pts</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleStartLearning(lesson)}
                      className={`px-4 py-2 rounded-lg ${
                        isLessonCompleted(lesson.id)
                          ? 'bg-green-100 text-green-600'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      {isLessonCompleted(lesson.id) ? 'Completed ✓' : 'Start Learning'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Short-Form Content */}
          <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm border ${themeClasses.cardBorder}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Trending Finance Tips</h2>
              <button 
                onClick={handleOpenShortForm}
                className="text-purple-600 text-sm font-medium"
              >
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {shortFormContent.slice(0, 3).map(content => (
                <div 
                  key={content.id} 
                  onClick={handleOpenShortForm}
                  className={`border ${themeClasses.cardBorder} rounded-lg overflow-hidden hover:border-purple-200 transition-colors cursor-pointer`}
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100 flex items-center justify-center relative">
                    <span className="text-4xl">{content.thumbnail}</span>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="bg-black bg-opacity-50 w-12 h-12 rounded-full flex items-center justify-center">
                        <FaPlay className="text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{content.title}</h3>
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
          <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm border ${themeClasses.cardBorder}`}>
            <h2 className="text-xl font-semibold mb-4">Daily Money Tips</h2>
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
          <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm border ${themeClasses.cardBorder}`}>
            <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className={themeClasses.secondaryTextColor}>Lessons Completed</span>
                  <span className="text-purple-600 font-medium">{getCompletedLessonsCount()}/{lessons.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${(getCompletedLessonsCount() / lessons.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className={themeClasses.secondaryTextColor}>Points Earned</span>
                  <span className="text-purple-600 font-medium">{userPoints}/370</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${(userPoints / 370) * 100}%` }}
                  ></div>
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