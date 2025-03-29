/**
 * Market Data Service
 * 
 * This service fetches stock market data from Alpha Vantage API
 * API key should be stored in .env file as VITE_ALPHA_VANTAGE_API_KEY
 */

/**
 * Get stock quote for a given symbol
 * @param {string} symbol - Stock symbol (e.g. RELIANCE.BSE)
 * @returns {Promise<Object>} Stock quote data
 */
export const getStockQuote = async (symbol) => {
  try {
    const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
    
    // Return mock data if API key is not available
    if (!API_KEY) {
      console.warn('Alpha Vantage API key not found, using mock data');
      return getMockStockQuote(symbol);
    }
    
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Alpha Vantage API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if we got valid data
    if (data['Error Message'] || !data['Global Quote'] || Object.keys(data['Global Quote']).length === 0) {
      console.warn('Invalid stock data received, using mock data');
      return getMockStockQuote(symbol);
    }
    
    const quote = data['Global Quote'];
    
    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: quote['10. change percent'].replace('%', ''),
      volume: parseInt(quote['06. volume']),
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    return getMockStockQuote(symbol);
  }
};

/**
 * Get daily stock price data for charts
 * @param {string} symbol - Stock symbol
 * @param {string} interval - Time interval (e.g., '1d', '5d', '1m', '3m')
 * @returns {Promise<Array>} Array of price data points
 */
export const getStockPriceHistory = async (symbol, interval = '1m') => {
  try {
    const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
    
    // Return mock data if API key is not available
    if (!API_KEY) {
      console.warn('Alpha Vantage API key not found, using mock data');
      return getMockPriceHistory(interval);
    }
    
    // Map interval to Alpha Vantage function and outputsize
    let function_name = 'TIME_SERIES_DAILY';
    let outputsize = 'compact'; // compact returns latest 100 data points
    
    if (interval === '1d') {
      function_name = 'TIME_SERIES_INTRADAY';
      outputsize = 'full';
    } else if (interval === '1w' || interval === '5d') {
      function_name = 'TIME_SERIES_DAILY';
      outputsize = 'compact';
    } else if (interval === '1m' || interval === '3m') {
      function_name = 'TIME_SERIES_DAILY';
      outputsize = 'full';
    } else if (interval === '1y' || interval === '5y') {
      function_name = 'TIME_SERIES_WEEKLY';
      outputsize = 'full';
    }
    
    const response = await fetch(
      `https://www.alphavantage.co/query?function=${function_name}&symbol=${symbol}&outputsize=${outputsize}&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Alpha Vantage API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if we got valid data
    if (data['Error Message'] || !data['Time Series (Daily)']) {
      console.warn('Invalid price history data received, using mock data');
      return getMockPriceHistory(interval);
    }
    
    const timeSeries = data['Time Series (Daily)'];
    const priceData = Object.entries(timeSeries).map(([date, values]) => ({
      date,
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume'])
    }));
    
    // Sort by date in ascending order
    return priceData.sort((a, b) => new Date(a.date) - new Date(b.date));
  } catch (error) {
    console.error('Error fetching price history:', error);
    return getMockPriceHistory(interval);
  }
};

// Mock data functions

/**
 * Get mock stock quote when API is not available
 * @param {string} symbol - Stock symbol
 * @returns {Object} Mock stock quote
 */
const getMockStockQuote = (symbol) => {
  const mockQuotes = {
    'RELIANCE.BSE': {
      symbol: 'RELIANCE.BSE',
      price: 2891.70,
      change: 14.85,
      changePercent: '0.52',
      volume: 892410,
      lastUpdated: new Date().toISOString()
    },
    'TCS.BSE': {
      symbol: 'TCS.BSE',
      price: 3712.45,
      change: -18.60,
      changePercent: '-0.50',
      volume: 542175,
      lastUpdated: new Date().toISOString()
    },
    'HDFCBANK.BSE': {
      symbol: 'HDFCBANK.BSE',
      price: 1587.30,
      change: 5.75,
      changePercent: '0.36',
      volume: 1245780,
      lastUpdated: new Date().toISOString()
    },
    'default': {
      symbol: symbol || 'UNKNOWN',
      price: 1250.00,
      change: 7.50,
      changePercent: '0.60',
      volume: 750000,
      lastUpdated: new Date().toISOString()
    }
  };
  
  return mockQuotes[symbol] || mockQuotes.default;
};

/**
 * Get mock price history data when API is not available
 * @param {string} interval - Time interval
 * @returns {Array} Mock price history data
 */
const getMockPriceHistory = (interval) => {
  const today = new Date();
  const priceData = [];
  
  // Number of data points to generate based on interval
  let days = 30;
  if (interval === '1d') days = 1;
  else if (interval === '5d' || interval === '1w') days = 7;
  else if (interval === '1m') days = 30;
  else if (interval === '3m') days = 90;
  else if (interval === '1y') days = 365;
  else if (interval === '5y') days = 1825;
  
  // Generate mock data points
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const basePrice = 1000 + Math.random() * 200;
    const volatility = 0.02; // 2% volatility
    
    const open = basePrice * (1 + (Math.random() - 0.5) * volatility);
    const close = open * (1 + (Math.random() - 0.5) * volatility);
    const high = Math.max(open, close) * (1 + Math.random() * volatility);
    const low = Math.min(open, close) * (1 - Math.random() * volatility);
    const volume = Math.floor(500000 + Math.random() * 1000000);
    
    priceData.push({
      date: date.toISOString().split('T')[0],
      open,
      high,
      low,
      close,
      volume
    });
  }
  
  return priceData;
}; 