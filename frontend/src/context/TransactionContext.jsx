import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { transactionsAPI } from '../services/api';
import { toast } from 'react-hot-toast';

// Create the context
export const TransactionContext = createContext();

// Custom hook to use the transaction context
export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  const { userId, getToken, isSignedIn } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [financialStats, setFinancialStats] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlySavings: 0
  });

  // Store token for API requests
  useEffect(() => {
    const storeTokenForApi = async () => {
      if (isSignedIn) {
        try {
          const token = await getToken();
          localStorage.setItem('clerk-token', token);
        } catch (err) {
          console.error('Failed to get Clerk token:', err);
        }
      }
    };
    
    storeTokenForApi();
  }, [isSignedIn, getToken]);

  // Load transactions from API when userId changes
  useEffect(() => {
    if (userId) {
      fetchTransactions();
    }
  }, [userId]);

  // Load transactions from API
  const fetchTransactions = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const data = await transactionsAPI.getAllTransactions(userId);
      setTransactions(data.transactions || []);
      calculateFinancialStats(data.transactions || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to fetch transactions. Please try again.');
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  // Calculate financial statistics from transactions
  const calculateFinancialStats = (transactionData) => {
    // Get current month transactions
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const currentMonthTransactions = transactionData.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
    
    // Calculate monthly income
    const income = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate monthly expenses
    const expenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    // Calculate total balance (this would normally come from account data)
    // For simplicity, we'll use: previous balance + income - expenses
    const previousBalanceAmount = 8000; // This would be fetched from an accounts API in a real app
    const totalBalance = previousBalanceAmount + income - expenses;
    
    setFinancialStats({
      totalBalance,
      monthlyIncome: income,
      monthlyExpenses: expenses,
      monthlySavings: income - expenses
    });
  };

  // Add a new transaction
  const addTransaction = async (transactionData) => {
    if (!userId) {
      toast.error('You must be logged in to add a transaction');
      throw new Error('User not authenticated');
    }
    
    try {
      const newTransaction = await transactionsAPI.createTransaction({
        ...transactionData,
        userId
      });
      
      // Update local state with the new transaction
      setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
      
      // Recalculate financial stats
      calculateFinancialStats([...transactions, newTransaction]);
      
      toast.success('Transaction added successfully');
      return newTransaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
      throw error;
    }
  };

  // Update a transaction
  const updateTransaction = async (id, transactionData) => {
    if (!userId) {
      toast.error('You must be logged in to update a transaction');
      throw new Error('User not authenticated');
    }
    
    try {
      const updatedTransaction = await transactionsAPI.updateTransaction(id, {
        ...transactionData,
        userId
      });
      
      // Update local state with the updated transaction
      setTransactions(prevTransactions => 
        prevTransactions.map(t => t.id === id ? updatedTransaction : t)
      );
      
      // Recalculate financial stats
      calculateFinancialStats(transactions.map(t => t.id === id ? updatedTransaction : t));
      
      toast.success('Transaction updated successfully');
      return updatedTransaction;
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Failed to update transaction');
      throw error;
    }
  };

  // Delete a transaction
  const deleteTransaction = async (id) => {
    if (!userId) {
      toast.error('You must be logged in to delete a transaction');
      throw new Error('User not authenticated');
    }
    
    try {
      await transactionsAPI.deleteTransaction(id);
      
      // Update local state by removing the deleted transaction
      setTransactions(prevTransactions => 
        prevTransactions.filter(t => t.id !== id)
      );
      
      // Recalculate financial stats
      calculateFinancialStats(transactions.filter(t => t.id !== id));
      
      toast.success('Transaction deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
      throw error;
    }
  };

  // Provide the context value
  const value = {
    transactions,
    loading,
    error,
    financialStats,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}; 