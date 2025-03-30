import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

// User-specific storage in localStorage
const getStorageKey = (userId) => `genz-finance-settings-${userId}`
const getTransactionsKey = (userId) => `genz-finance-transactions-${userId}`

// Default settings
const defaultSettings = {
  profile: {
    name: 'Dev User',
    email: 'dev@example.com',
    phone: '+91 9876543210',
    currency: 'INR',
    language: 'English',
    darkMode: true,
  },
  notifications: {
    email: true,
    push: true,
    sms: false,
    marketingEmails: false
  },
  privacySettings: {
    showBalances: true,
    showActivity: true,
    shareData: false
  },
  financialSettings: {
    savingsGoal: 50000,
    budgetReminders: true,
    autoCategorization: true,
    roundUpSavings: false
  }
}

// Sample test users
const testUsers = [
  {
    userId: 'user_2UkD0k5T9adDGy9PlaRlr7jMLcQ',
    profile: {
      name: 'Rahul Sharma',
      email: 'rahul.s@example.com', 
      phone: '+91 9876543210',
      currency: 'INR',
      language: 'English',
      darkMode: true
    },
    notifications: {
      email: true,
      push: false, 
      sms: true,
      marketingEmails: false
    },
    privacySettings: {
      showBalances: true, 
      showActivity: true,
      shareData: true
    },
    financialSettings: {
      savingsGoal: 75000,
      budgetReminders: true,
      autoCategorization: true,
      roundUpSavings: true
    }
  },
  {
    userId: 'user_2V8DkE9Y5r5rT6mXcLm4f2tW3qP', 
    profile: {
      name: 'Priya Patel',
      email: 'priya.p@example.com',
      phone: '+91 8765432109',
      currency: 'INR',
      language: 'Hindi',
      darkMode: false
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketingEmails: true
    },
    privacySettings: {
      showBalances: false,
      showActivity: true,
      shareData: false
    },
    financialSettings: {
      savingsGoal: 25000,
      budgetReminders: false,
      autoCategorization: true,
      roundUpSavings: false
    }
  }
]

// Sample transactions
const sampleTransactions = [
  {
    id: '1',
    amount: 2500,
    type: 'expense',
    category: 'Food',
    description: 'Dinner with friends',
    date: '2023-06-10',
    merchant: 'Restaurant XYZ',
    tags: ['dining', 'friends'],
    recurring: false
  },
  {
    id: '2',
    amount: 50000,
    type: 'income',
    category: 'Salary',
    description: 'Monthly salary',
    date: '2023-06-01',
    merchant: 'ABC Corp',
    tags: ['work'],
    recurring: true,
    recurringDetails: {
      frequency: 'monthly',
      endDate: '2023-12-31'
    }
  },
  {
    id: '3',
    amount: 800,
    type: 'expense',
    category: 'Entertainment',
    description: 'Movie tickets',
    date: '2023-06-15',
    merchant: 'PVR Cinemas',
    tags: ['entertainment', 'weekend'],
    recurring: false
  }
]

export const setupMockAPI = () => {
  const mock = new MockAdapter(axios)
  
  // === SETTINGS API ===
  
  // Get settings for a user
  mock.onGet(/\/api\/settings\/.*/).reply((config) => {
    try {
      // Extract user ID from URL
      const userId = config.url.split('/').pop()
      
      // Check if token is present
      const authHeader = config.headers.Authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return [401, { error: 'Unauthorized' }]
      }
      
      // Get settings from localStorage or use default
      const storageKey = getStorageKey(userId)
      const storedSettings = localStorage.getItem(storageKey)
      
      if (storedSettings) {
        return [200, JSON.parse(storedSettings)]
      } else {
        // No settings found, return 404
        return [404, { error: 'Settings not found' }]
      }
    } catch (error) {
      console.error('Mock API error (GET settings):', error)
      return [500, { error: 'Server error' }]
    }
  })
  
  // Create or update settings
  mock.onPut(/\/api\/settings\/.*/).reply((config) => {
    try {
      // Extract user ID from URL
      const userId = config.url.split('/').pop()
      
      // Check if token is present
      const authHeader = config.headers.Authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return [401, { error: 'Unauthorized' }]
      }
      
      // Parse the request body
      const requestBody = JSON.parse(config.data)
      
      // Create a storage key based on user ID
      const storageKey = getStorageKey(userId)
      
      // Save to localStorage
      localStorage.setItem(storageKey, JSON.stringify({
        ...requestBody,
        userId,
        updatedAt: new Date().toISOString()
      }))
      
      // Return the saved settings
      return [200, JSON.parse(localStorage.getItem(storageKey))]
    } catch (error) {
      console.error('Mock API error (PUT settings):', error)
      return [500, { error: 'Server error' }]
    }
  })
  
  // Update specific settings section
  mock.onPatch(/\/api\/settings\/.*\/.*/).reply((config) => {
    try {
      // Extract user ID and section from URL
      const urlParts = config.url.split('/')
      const userId = urlParts[urlParts.length - 2]
      const section = urlParts[urlParts.length - 1]
      
      // Check if token is present
      const authHeader = config.headers.Authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return [401, { error: 'Unauthorized' }]
      }
      
      // Get existing settings
      const storageKey = getStorageKey(userId)
      const storedSettings = localStorage.getItem(storageKey)
      
      if (!storedSettings) {
        return [404, { error: 'Settings not found' }]
      }
      
      // Parse existing settings and request body
      const settings = JSON.parse(storedSettings)
      const sectionData = JSON.parse(config.data)
      
      // Update the specific section
      settings[section] = {
        ...settings[section],
        ...sectionData
      }
      
      // Update timestamp
      settings.updatedAt = new Date().toISOString()
      
      // Save updated settings
      localStorage.setItem(storageKey, JSON.stringify(settings))
      
      // Return the updated settings
      return [200, settings]
    } catch (error) {
      console.error('Mock API error (PATCH settings):', error)
      return [500, { error: 'Server error' }]
    }
  })

  // === TRANSACTIONS API ===
  
  // Get all transactions for a user
  mock.onGet(/\/api\/transactions\/user\/.*/).reply((config) => {
    try {
      // Extract user ID from URL
      const userId = config.url.split('/').pop()
      
      // Check if token is present
      const authHeader = config.headers.Authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return [401, { error: 'Unauthorized' }]
      }
      
      // Get transactions from localStorage
      const storageKey = getTransactionsKey(userId)
      const storedTransactions = localStorage.getItem(storageKey)
      
      if (storedTransactions) {
        const transactions = JSON.parse(storedTransactions)
        
        // Handle query parameters (filters)
        const { type, category, startDate, endDate, search } = config.params || {}
        
        let filteredTransactions = [...transactions]
        
        if (type) {
          filteredTransactions = filteredTransactions.filter(tx => tx.type === type)
        }
        
        if (category) {
          filteredTransactions = filteredTransactions.filter(tx => tx.category === category)
        }
        
        if (startDate) {
          filteredTransactions = filteredTransactions.filter(tx => new Date(tx.date) >= new Date(startDate))
        }
        
        if (endDate) {
          filteredTransactions = filteredTransactions.filter(tx => new Date(tx.date) <= new Date(endDate))
        }
        
        if (search) {
          const searchLower = search.toLowerCase()
          filteredTransactions = filteredTransactions.filter(tx => 
            tx.description.toLowerCase().includes(searchLower) || 
            tx.merchant.toLowerCase().includes(searchLower) ||
            (tx.tags && tx.tags.some(tag => tag.toLowerCase().includes(searchLower)))
          )
        }
        
        return [200, { transactions: filteredTransactions }]
      } else {
        // No transactions found, return empty array
        return [200, { transactions: [] }]
      }
    } catch (error) {
      console.error('Mock API error (GET transactions):', error)
      return [500, { error: 'Server error' }]
    }
  })
  
  // Get a specific transaction
  mock.onGet(/\/api\/transactions\/\w+$/).reply((config) => {
    try {
      // Extract transaction ID from URL
      const transactionId = config.url.split('/').pop()
      
      // Check if token is present
      const authHeader = config.headers.Authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return [401, { error: 'Unauthorized' }]
      }
      
      // Get user ID from token
      const token = authHeader.split(' ')[1]
      const decoded = JSON.parse(atob(token.split('.')[1]))
      const userId = decoded.sub
      
      // Get transactions from localStorage
      const storageKey = getTransactionsKey(userId)
      const storedTransactions = localStorage.getItem(storageKey)
      
      if (storedTransactions) {
        const transactions = JSON.parse(storedTransactions)
        const transaction = transactions.find(t => t.id === transactionId)
        
        if (transaction) {
          return [200, transaction]
        } else {
          return [404, { error: 'Transaction not found' }]
        }
      } else {
        return [404, { error: 'Transaction not found' }]
      }
    } catch (error) {
      console.error('Mock API error (GET transaction):', error)
      return [500, { error: 'Server error' }]
    }
  })
  
  // Create a new transaction
  mock.onPost('/api/transactions').reply((config) => {
    try {
      // Check if token is present
      const authHeader = config.headers.Authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return [401, { error: 'Unauthorized' }]
      }
      
      // Get user ID from token
      const token = authHeader.split(' ')[1]
      const decoded = JSON.parse(atob(token.split('.')[1]))
      const userId = decoded.sub
      
      // Parse the transaction data
      const transactionData = JSON.parse(config.data)
      
      // Generate a unique ID
      const newId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Get existing transactions from localStorage
      const storageKey = getTransactionsKey(userId)
      let transactions = []
      const storedTransactions = localStorage.getItem(storageKey)
      
      if (storedTransactions) {
        transactions = JSON.parse(storedTransactions)
      }
      
      // Add the new transaction
      const newTransaction = {
        ...transactionData,
        id: newId,
        userId,
        createdAt: new Date().toISOString()
      }
      
      transactions.push(newTransaction)
      
      // Save to localStorage
      localStorage.setItem(storageKey, JSON.stringify(transactions))
      
      return [201, newTransaction]
    } catch (error) {
      console.error('Mock API error (POST transaction):', error)
      return [500, { error: 'Server error' }]
    }
  })
  
  // Update a transaction
  mock.onPut(/\/api\/transactions\/\w+$/).reply((config) => {
    try {
      // Extract transaction ID from URL
      const transactionId = config.url.split('/').pop()
      
      // Check if token is present
      const authHeader = config.headers.Authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return [401, { error: 'Unauthorized' }]
      }
      
      // Get user ID from token
      const token = authHeader.split(' ')[1]
      const decoded = JSON.parse(atob(token.split('.')[1]))
      const userId = decoded.sub
      
      // Parse the updated transaction data
      const updatedData = JSON.parse(config.data)
      
      // Get transactions from localStorage
      const storageKey = getTransactionsKey(userId)
      const storedTransactions = localStorage.getItem(storageKey)
      
      if (!storedTransactions) {
        return [404, { error: 'Transaction not found' }]
      }
      
      const transactions = JSON.parse(storedTransactions)
      const index = transactions.findIndex(t => t.id === transactionId)
      
      if (index === -1) {
        return [404, { error: 'Transaction not found' }]
      }
      
      // Update the transaction
      const updatedTransaction = {
        ...transactions[index],
        ...updatedData,
        updatedAt: new Date().toISOString()
      }
      
      transactions[index] = updatedTransaction
      
      // Save to localStorage
      localStorage.setItem(storageKey, JSON.stringify(transactions))
      
      return [200, updatedTransaction]
    } catch (error) {
      console.error('Mock API error (PUT transaction):', error)
      return [500, { error: 'Server error' }]
    }
  })
  
  // Delete a transaction
  mock.onDelete(/\/api\/transactions\/\w+$/).reply((config) => {
    try {
      // Extract transaction ID from URL
      const transactionId = config.url.split('/').pop()
      
      // Check if token is present
      const authHeader = config.headers.Authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return [401, { error: 'Unauthorized' }]
      }
      
      // Get user ID from token
      const token = authHeader.split(' ')[1]
      const decoded = JSON.parse(atob(token.split('.')[1]))
      const userId = decoded.sub
      
      // Get transactions from localStorage
      const storageKey = getTransactionsKey(userId)
      const storedTransactions = localStorage.getItem(storageKey)
      
      if (!storedTransactions) {
        return [404, { error: 'Transaction not found' }]
      }
      
      const transactions = JSON.parse(storedTransactions)
      const index = transactions.findIndex(t => t.id === transactionId)
      
      if (index === -1) {
        return [404, { error: 'Transaction not found' }]
      }
      
      // Remove the transaction
      transactions.splice(index, 1)
      
      // Save to localStorage
      localStorage.setItem(storageKey, JSON.stringify(transactions))
      
      return [200, { success: true, message: 'Transaction deleted' }]
    } catch (error) {
      console.error('Mock API error (DELETE transaction):', error)
      return [500, { error: 'Server error' }]
    }
  })

  // Initialize test user settings
  testUsers.forEach(user => {
    const settingsKey = getStorageKey(user.userId)
    if (!localStorage.getItem(settingsKey)) {
      localStorage.setItem(settingsKey, JSON.stringify({
        ...user,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }))
    }
    
    // Initialize transactions for test users
    const transactionsKey = getTransactionsKey(user.userId)
    if (!localStorage.getItem(transactionsKey)) {
      // Assign random sample transactions to users
      const userTransactions = sampleTransactions.map(tx => ({
        ...tx,
        userId: user.userId,
        id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString()
      }))
      
      localStorage.setItem(transactionsKey, JSON.stringify(userTransactions))
    }
  })
  
  // Initialize with some default settings for the demo user
  const demoUserId = 'demo_user_123'
  const settingsKey = getStorageKey(demoUserId)
  if (!localStorage.getItem(settingsKey)) {
    localStorage.setItem(settingsKey, JSON.stringify({
      ...defaultSettings,
      userId: demoUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))
  }
  
  // Initialize demo transactions
  const demoTransactionsKey = getTransactionsKey(demoUserId)
  if (!localStorage.getItem(demoTransactionsKey)) {
    const demoTransactions = sampleTransactions.map(tx => ({
      ...tx,
      userId: demoUserId,
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    }))
    
    localStorage.setItem(demoTransactionsKey, JSON.stringify(demoTransactions))
  }
  
  console.log('Mock API setup complete')
} 