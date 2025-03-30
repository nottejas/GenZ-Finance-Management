import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  async (config) => {
    // Get token from Clerk if available
    try {
      const token = localStorage.getItem('clerk-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error setting auth token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Settings API
export const settingsAPI = {
  getSettings: async (userId) => {
    const response = await api.get(`/settings/${userId}`);
    return response.data;
  },
  
  updateSettings: async (userId, settingsData) => {
    const response = await api.put(`/settings/${userId}`, settingsData);
    return response.data;
  },
  
  updateSettingsSection: async (userId, section, sectionData) => {
    const response = await api.patch(`/settings/${userId}/${section}`, sectionData);
    return response.data;
  }
};

// Transactions API
export const transactionsAPI = {
  getAllTransactions: async (userId, params = {}) => {
    const response = await api.get(`/transactions/user/${userId}`, { params });
    return response.data;
  },
  
  getTransaction: async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },
  
  createTransaction: async (transactionData) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  },
  
  updateTransaction: async (id, transactionData) => {
    const response = await api.put(`/transactions/${id}`, transactionData);
    return response.data;
  },
  
  deleteTransaction: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  }
};

// Helper function to store Clerk token
export const storeClerkToken = async (token) => {
  localStorage.setItem('clerk-token', token);
};

// Helper function to remove Clerk token
export const removeClerkToken = () => {
  localStorage.removeItem('clerk-token');
};

export default api; 