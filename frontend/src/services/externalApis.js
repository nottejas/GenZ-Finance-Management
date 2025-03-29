/**
 * External API service for financial news and exchange rates
 * API keys are stored in .env files and should not be committed to version control
 */

/**
 * Fetch financial news from NewsAPI
 * @returns {Promise<Array>} Array of news articles
 */
export const fetchFinancialNews = async () => {
  try {
    const API_KEY = import.meta.env.VITE_NEWSAPI_KEY;
    
    // If API key is not set, return mock data
    if (!API_KEY) {
      console.warn('NewsAPI key not found, using mock data');
      return getMockNewsData();
    }
    
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`News API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.articles.map((article, index) => ({
      id: index,
      title: article.title,
      description: article.description,
      source: article.source.name,
      url: article.url,
      date: new Date(article.publishedAt).toISOString().split('T')[0]
    })).slice(0, 5); // Limit to 5 articles
  } catch (error) {
    console.error('Error fetching news:', error);
    return getMockNewsData();
  }
};

/**
 * Fetch currency exchange rates from ExchangeRate-API
 * @returns {Promise<Object>} Exchange rates with INR as base
 */
export const fetchExchangeRates = async () => {
  try {
    const API_KEY = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;
    
    // If API key is not set, return mock data
    if (!API_KEY) {
      console.warn('Exchange Rate API key not found, using mock data');
      return getMockExchangeRates();
    }
    
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/INR?api_key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Exchange Rate API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract only the currencies we want to display
    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD'];
    const filteredRates = {};
    
    currencies.forEach(currency => {
      if (data.rates[currency]) {
        filteredRates[currency] = data.rates[currency];
      }
    });
    
    return filteredRates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return getMockExchangeRates();
  }
};

/**
 * Get mock financial news data when API is not available
 * @returns {Array} Mock news data
 */
const getMockNewsData = () => [
  {
    id: 1,
    title: "RBI Announces New Digital Banking Guidelines",
    description: "The Reserve Bank of India has announced new guidelines for digital banking that will impact how fintech companies operate in the country...",
    source: "Economic Times",
    url: "#",
    date: "2024-03-28"
  },
  {
    id: 2,
    title: "Budget 2024: What's in it for Gen Z?",
    description: "The latest budget focuses on youth employment, financial literacy, and digital initiatives aimed at the younger generation...",
    source: "Financial Express",
    url: "#",
    date: "2024-03-25"
  },
  {
    id: 3,
    title: "Stocks to Watch: Tech Giants Report Strong Earnings",
    description: "Major tech companies have reported better than expected Q1 earnings, potentially signaling a broader market recovery...",
    source: "Business Standard",
    url: "#",
    date: "2024-03-27"
  },
  {
    id: 4,
    title: "New UPI Features Coming in April",
    description: "National Payments Corporation of India announces new UPI features including higher transaction limits for certain categories...",
    source: "LiveMint",
    url: "#",
    date: "2024-03-26"
  },
  {
    id: 5,
    title: "SIP Investments Hit All-Time High",
    description: "Systematic Investment Plans (SIPs) in mutual funds have reached an all-time high as more young investors enter the market...",
    source: "Money Control",
    url: "#",
    date: "2024-03-24"
  }
];

/**
 * Get mock exchange rates when API is not available
 * @returns {Object} Mock exchange rates
 */
const getMockExchangeRates = () => ({
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
  JPY: 1.82,
  AUD: 0.018
}); 