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
  const [warnThresholds, setWarnThresholds] = useState({
    critical: 10, // at 10% remaining
    warning: 25,  // at 25% remaining
    notice: 50    // at 50% remaining
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

  // Fetch monthly deposit info
  const fetchMonthlyDeposit = async () => {
    try {
      const depositInfo = JSON.parse(localStorage.getItem(`deposit-${userId}`) || 'null');
      
      if (depositInfo) {
        setMonthlyDeposit(depositInfo.amount);
        setDepositDate(depositInfo.date);
        
        // Use stored remaining balance if available, otherwise calculate it
        if (depositInfo.remainingBalance !== undefined) {
          setRemainingBalance(depositInfo.remainingBalance);
        } else {
          // Calculate remaining balance based on expenses since deposit date
          const expensesSinceDeposit = calculateExpensesSinceDeposit(
            transactions, 
            new Date(depositInfo.date)
          );
          
          const calculatedBalance = depositInfo.amount - expensesSinceDeposit;
          setRemainingBalance(calculatedBalance);
          
          // Store the calculated balance for future use
          updateStoredRemainingBalance(calculatedBalance);
        }
      }
    } catch (error) {
      console.error('Error fetching monthly deposit:', error);
    }
  };

  // Update the stored remaining balance
  const updateStoredRemainingBalance = (balance) => {
    try {
      const depositInfo = JSON.parse(localStorage.getItem(`deposit-${userId}`) || '{}');
      
      if (Object.keys(depositInfo).length > 0) {
        localStorage.setItem(`deposit-${userId}`, JSON.stringify({
          ...depositInfo,
          remainingBalance: balance
        }));
      }
    } catch (error) {
      console.error('Error updating stored remaining balance:', error);
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
        date: currentDate.toISOString(),
        remainingBalance: Number(amount),
        createdAt: currentDate.toISOString()
      };
      
      // In a real app, this would be saved to the backend
      // For now, we'll use localStorage
      localStorage.setItem(`deposit-${userId}`, JSON.stringify(depositInfo));
      
      // Save deposit history
      saveDepositHistory(depositInfo);
      
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
  
  // Save deposit to history
  const saveDepositHistory = (depositInfo) => {
    try {
      const history = JSON.parse(localStorage.getItem(`deposit-history-${userId}`) || '[]');
      history.push(depositInfo);
      localStorage.setItem(`deposit-history-${userId}`, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving deposit history:', error);
    }
  };
  
  // Get deposit history
  const getDepositHistory = () => {
    try {
      return JSON.parse(localStorage.getItem(`deposit-history-${userId}`) || '[]');
    } catch (error) {
      console.error('Error getting deposit history:', error);
      return [];
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
      
      // Calculate new remaining balance
      const newRemainingBalance = Number(amount) - expensesSinceDeposit;
      
      // Update deposit info
      const depositInfo = {
        amount: Number(amount),
        date: existingDate, // Keep the original date
        remainingBalance: newRemainingBalance,
        updatedAt: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem(`deposit-${userId}`, JSON.stringify(depositInfo));
      
      // Save to history
      saveDepositHistory({
        ...depositInfo,
        type: 'update',
        previousAmount: monthlyDeposit
      });
      
      // Update state
      setMonthlyDeposit(amount);
      setRemainingBalance(newRemainingBalance);
      
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
      // Save to history before deleting
      const existingDepositInfo = JSON.parse(localStorage.getItem(`deposit-${userId}`) || '{}');
      if (Object.keys(existingDepositInfo).length > 0) {
        saveDepositHistory({
          ...existingDepositInfo,
          type: 'delete',
          deletedAt: new Date().toISOString()
        });
      }
      
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
      const calculatedRemainingBalance = monthlyDeposit - expensesSinceDeposit;
      setRemainingBalance(calculatedRemainingBalance);
      
      // Update stored remaining balance
      updateStoredRemainingBalance(calculatedRemainingBalance);
    }
  };

  // Show appropriate warning based on remaining percentage
  const showBalanceWarning = (balance) => {
    if (!monthlyDeposit) return;
    
    const remainingPercentage = (balance / monthlyDeposit) * 100;
    
    if (remainingPercentage <= warnThresholds.critical) {
      toast.error(`Critical: Only ${remainingPercentage.toFixed(1)}% of your deposit remains! (₹${balance.toLocaleString()})`, {
        duration: 6000,
        icon: '⚠️'
      });
    } else if (remainingPercentage <= warnThresholds.warning) {
      toast.error(`Warning: Only ${remainingPercentage.toFixed(1)}% of your deposit remains! (₹${balance.toLocaleString()})`, {
        duration: 5000,
        icon: '⚠️'
      });
    } else if (remainingPercentage <= warnThresholds.notice) {
      toast.error(`Notice: ${remainingPercentage.toFixed(1)}% of your deposit remains (₹${balance.toLocaleString()})`, {
        duration: 4000,
        icon: '📊'
      });
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
        
        // Update stored remaining balance
        updateStoredRemainingBalance(newRemainingBalance);
        
        // Show warning based on remaining balance percentage
        showBalanceWarning(newRemainingBalance);
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
      
      // Update remaining balance when transaction type or amount changes
      if (monthlyDeposit > 0 && originalTransaction) {
        let balanceAdjustment = 0;
        
        // Handle transaction type changes (e.g., income -> expense)
        if (originalTransaction.type !== updatedTransaction.type) {
          if (originalTransaction.type === 'expense' && updatedTransaction.type !== 'expense') {
            // An expense was changed to non-expense, add back the original amount
            balanceAdjustment += originalTransaction.amount;
          } else if (originalTransaction.type !== 'expense' && updatedTransaction.type === 'expense') {
            // A non-expense was changed to expense, subtract the new amount
            balanceAdjustment -= updatedTransaction.amount;
          }
        } 
        // Handle amount changes for expenses
        else if (updatedTransaction.type === 'expense') {
          // Expense amount was changed, adjust by the difference
          balanceAdjustment += originalTransaction.amount - updatedTransaction.amount;
        }
        
        if (balanceAdjustment !== 0) {
          const newRemainingBalance = remainingBalance + balanceAdjustment;
          setRemainingBalance(newRemainingBalance);
          
          // Update stored remaining balance
          updateStoredRemainingBalance(newRemainingBalance);
          
          // Show warning if balance is getting low
          showBalanceWarning(newRemainingBalance);
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
        const newRemainingBalance = remainingBalance + transactionToDelete.amount;
        setRemainingBalance(newRemainingBalance);
        
        // Update stored remaining balance
        updateStoredRemainingBalance(newRemainingBalance);
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
    deleteMonthlyDeposit,
    getDepositHistory,
    warnThresholds,
    setWarnThresholds
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}; 