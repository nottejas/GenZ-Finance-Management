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
  const [monthlyDeposit, setMonthlyDeposit] = useState(0);
  const [depositDate, setDepositDate] = useState(null);
  const [remainingBalance, setRemainingBalance] = useState(0);
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

  // Load transactions and deposit info from API when userId changes
  useEffect(() => {
    if (userId) {
      fetchTransactions();
      fetchMonthlyDeposit();
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

  // Fetch monthly deposit information
  const fetchMonthlyDeposit = async () => {
    if (!userId) return;
    
    try {
      // In a real app, this would be a separate API endpoint
      // For now, we'll simulate it using localStorage
      const depositInfo = JSON.parse(localStorage.getItem(`deposit-${userId}`) || '{}');
      
      if (depositInfo.amount) {
        setMonthlyDeposit(depositInfo.amount);
        setDepositDate(depositInfo.date);
        
        // Calculate remaining balance based on expenses since deposit date
        const expensesSinceDeposit = calculateExpensesSinceDeposit(
          transactions, 
          new Date(depositInfo.date)
        );
        
        setRemainingBalance(depositInfo.amount - expensesSinceDeposit);
      }
    } catch (error) {
      console.error('Error fetching monthly deposit:', error);
    }
  };

  // Calculate expenses since deposit date
  const calculateExpensesSinceDeposit = (transactionData, depositDate) => {
    if (!depositDate) return 0;
    
    return transactionData
      .filter(t => {
        const transactionDate = new Date(t.date);
        return t.type === 'expense' && transactionDate >= depositDate;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Set monthly deposit
  const setMonthlyDepositAmount = async (amount) => {
    if (!userId) {
      toast.error('You must be logged in to set a monthly deposit');
      throw new Error('User not authenticated');
    }
    
    try {
      const currentDate = new Date();
      const depositInfo = {
        amount: Number(amount),
        date: currentDate.toISOString()
      };
      
      // In a real app, this would be saved to the backend
      // For now, we'll use localStorage
      localStorage.setItem(`deposit-${userId}`, JSON.stringify(depositInfo));
      
      setMonthlyDeposit(amount);
      setDepositDate(currentDate.toISOString());
      setRemainingBalance(amount);
      
      // Add deposit as an income transaction
      await addTransaction({
        description: 'Monthly Deposit',
        amount: Number(amount),
        date: currentDate.toISOString(),
        type: 'income',
        category: 'Deposit'
      });
      
      toast.success('Monthly deposit set successfully');
      return depositInfo;
    } catch (error) {
      console.error('Error setting monthly deposit:', error);
      toast.error('Failed to set monthly deposit');
      throw error;
    }
  };
  
  // Update monthly deposit
  const updateMonthlyDeposit = async (amount) => {
    if (!userId) {
      toast.error('You must be logged in to update a monthly deposit');
      throw new Error('User not authenticated');
    }
    
    if (!depositDate) {
      // If no deposit exists, create a new one
      return setMonthlyDepositAmount(amount);
    }
    
    try {
      // Get the existing deposit date
      const existingDepositInfo = JSON.parse(localStorage.getItem(`deposit-${userId}`) || '{}');
      const existingDate = existingDepositInfo.date || new Date().toISOString();
      
      // Calculate expenses since the deposit date
      const expensesSinceDeposit = calculateExpensesSinceDeposit(
        transactions, 
        new Date(existingDate)
      );
      
      // Update deposit info
      const depositInfo = {
        amount: Number(amount),
        date: existingDate // Keep the original date
      };
      
      // Save to localStorage
      localStorage.setItem(`deposit-${userId}`, JSON.stringify(depositInfo));
      
      // Update state
      setMonthlyDeposit(amount);
      setRemainingBalance(amount - expensesSinceDeposit);
      
      // Add an adjustment transaction
      const adjustmentAmount = amount - monthlyDeposit;
      if (adjustmentAmount !== 0) {
        await addTransaction({
          description: 'Deposit Adjustment',
          amount: Math.abs(Number(adjustmentAmount)),
          date: new Date().toISOString(),
          type: adjustmentAmount > 0 ? 'income' : 'expense',
          category: 'Deposit Adjustment'
        });
      }
      
      toast.success('Monthly deposit updated successfully');
      return depositInfo;
    } catch (error) {
      console.error('Error updating monthly deposit:', error);
      toast.error('Failed to update monthly deposit');
      throw error;
    }
  };
  
  // Delete monthly deposit
  const deleteMonthlyDeposit = async () => {
    if (!userId) {
      toast.error('You must be logged in to delete a monthly deposit');
      throw new Error('User not authenticated');
    }
    
    try {
      // Remove from localStorage
      localStorage.removeItem(`deposit-${userId}`);
      
      // Reset state
      setMonthlyDeposit(0);
      setDepositDate(null);
      setRemainingBalance(0);
      
      toast.success('Monthly deposit deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting monthly deposit:', error);
      toast.error('Failed to delete monthly deposit');
      throw error;
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
      
    // Calculate total balance (total deposit minus expenses)
    const totalBalance = monthlyDeposit > 0 ? 
      monthlyDeposit - calculateExpensesSinceDeposit(transactionData, new Date(depositDate)) : 
      income - expenses;
    
    setFinancialStats({
      totalBalance,
      monthlyIncome: income,
      monthlyExpenses: expenses,
      monthlySavings: income - expenses
    });
    
    // Update remaining balance if we have a monthly deposit
    if (monthlyDeposit > 0 && depositDate) {
      const expensesSinceDeposit = calculateExpensesSinceDeposit(
        transactionData, 
        new Date(depositDate)
      );
      setRemainingBalance(monthlyDeposit - expensesSinceDeposit);
    }
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
      
      // Update remaining balance for expense transactions
      if (newTransaction.type === 'expense' && monthlyDeposit > 0) {
        const newRemainingBalance = remainingBalance - newTransaction.amount;
        setRemainingBalance(newRemainingBalance);
        
        // Show warning if balance is getting low
        if (newRemainingBalance < monthlyDeposit * 0.2) {
          toast.error(`Warning: You have only ₹${newRemainingBalance.toLocaleString()} left from your monthly deposit!`);
        }
      }
      
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
    
    // Find the original transaction to compare amounts
    const originalTransaction = transactions.find(t => t.id === id);
    
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
      const updatedTransactions = transactions.map(t => t.id === id ? updatedTransaction : t);
      calculateFinancialStats(updatedTransactions);
      
      // Update remaining balance for expense transactions if amount changed
      if (
        monthlyDeposit > 0 && 
        originalTransaction && 
        updatedTransaction.type === 'expense'
      ) {
        // Calculate the difference in amount
        const amountDifference = originalTransaction.amount - updatedTransaction.amount;
        const newRemainingBalance = remainingBalance + amountDifference;
        setRemainingBalance(newRemainingBalance);
        
        // Show warning if balance is getting low
        if (newRemainingBalance < monthlyDeposit * 0.2) {
          toast.error(`Warning: You have only ₹${newRemainingBalance.toLocaleString()} left from your monthly deposit!`);
        }
      }
      
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
    
    // Find the transaction to be deleted
    const transactionToDelete = transactions.find(t => t.id === id);
    
    try {
      await transactionsAPI.deleteTransaction(id);
      
      // Update local state by removing the deleted transaction
      setTransactions(prevTransactions => 
        prevTransactions.filter(t => t.id !== id)
      );
      
      // Recalculate financial stats
      calculateFinancialStats(transactions.filter(t => t.id !== id));
      
      // Update remaining balance if deleting an expense
      if (
        monthlyDeposit > 0 && 
        transactionToDelete && 
        transactionToDelete.type === 'expense'
      ) {
        setRemainingBalance(remainingBalance + transactionToDelete.amount);
      }
      
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
    deleteTransaction,
    monthlyDeposit,
    depositDate,
    remainingBalance,
    setMonthlyDepositAmount,
    updateMonthlyDeposit,
    deleteMonthlyDeposit
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}; 