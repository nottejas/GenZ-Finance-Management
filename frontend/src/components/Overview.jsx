import React, { useState, useEffect } from 'react';
import { FaChartLine, FaExchangeAlt, FaCalendarAlt } from 'react-icons/fa';
import FinancialOverview from './dashboard/FinancialOverview';
import { fetchFinancialNews, fetchExchangeRates } from '../services/externalApis';

const Overview = () => {
  const [newsData, setNewsData] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock user data - in a real app this would come from your backend
  const userData = {
    name: "Tejas",
    balance: 25000,
    savedThisMonth: 5000
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch data from external APIs
        const [news, rates] = await Promise.all([
          fetchFinancialNews(),
          fetchExchangeRates()
        ]);
        
        setNewsData(news);
        setExchangeRates(rates);
        setError(null);
      } catch (err) {
        console.error("Error loading external data:", err);
        setError("Failed to fetch external financial data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Financial Overview</h1>
      
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
          <p className="mt-2 dark:text-white">Loading financial data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Financial Overview (2/3 width on large screens) */}
          <div className="lg:col-span-2">
            <FinancialOverview userData={userData} />
          </div>
          
          {/* Sidebar with News and Forex (1/3 width) */}
          <div className="space-y-6">
            {/* Exchange Rates Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <FaExchangeAlt className="text-purple-600 dark:text-purple-400 mr-2" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Exchange Rates</h3>
              </div>
              
              <div className="space-y-2">
                {Object.entries(exchangeRates).map(([currency, rate]) => (
                  <div key={currency} className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">1 INR to {currency}</span>
                    <span className="font-medium dark:text-white">{rate}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                <FaCalendarAlt className="inline mr-1" />
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
            
            {/* Financial News Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <FaChartLine className="text-purple-600 dark:text-purple-400 mr-2" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Financial News</h3>
              </div>
              
              <div className="space-y-4">
                {newsData.map(news => (
                  <div key={news.id} className="pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <h4 className="font-medium text-gray-900 dark:text-white">{news.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{news.description}</p>
                    <div className="flex justify-between items-center mt-2 text-xs">
                      <span className="text-purple-600 dark:text-purple-400">{news.source}</span>
                      <span className="text-gray-500 dark:text-gray-400">{news.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <a href="#" className="block text-center text-purple-600 dark:text-purple-400 mt-4 hover:underline">
                View All Financial News
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview; 