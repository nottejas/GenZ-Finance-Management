import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaTrash, FaPlus, FaInfoCircle, FaMinus, FaExchangeAlt, FaCalendarAlt, FaTags, FaCheck, FaReceipt, FaExclamationTriangle, FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { useTransactions } from '../../context/TransactionContext';
import { useSettings } from '../../context/SettingsContext';
import { toast } from 'react-hot-toast';

const TransactionForm = ({ 
  isOpen, 
  onClose, 
  userId, 
  initialData = null,
  currentMode = 'add',
  onTransactionAdded = null,
  onTransactionUpdated = null,
  onTransactionDeleted = null
}) => {
  const { 
    addTransaction, 
    updateTransaction, 
    deleteTransaction, 
    monthlyDeposit, 
    remainingBalance 
  } = useTransactions();
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    merchant: '',
    tags: [],
    isRecurring: false,
    recurringDetails: {
      frequency: 'monthly',
      endDate: '',
      nextOccurrence: ''
    }
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [showRecurringOptions, setShowRecurringOptions] = useState(false);
  const [previewBalance, setPreviewBalance] = useState(null);
  const [balanceImpact, setBalanceImpact] = useState({
    show: false,
    percentage: 0,
    critical: false,
    warning: false
  });
  
  // Get the current theme
  const isDarkMode = settings?.profile?.darkMode ?? true;
  
  // Styled based on the current theme
  const infoBoxStyle = isDarkMode
    ? "bg-blue-900/30 border border-blue-800 text-blue-200 p-4 rounded-md mb-5"
    : "bg-blue-100 border border-blue-300 text-blue-800 p-4 rounded-md mb-5";
  
  const warningBoxStyle = isDarkMode
    ? "bg-yellow-900/30 border border-yellow-800 text-yellow-200 p-4 rounded-md mb-5"
    : "bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded-md mb-5";

  // Category options
  const categoryOptions = {
    expense: [
      'Food & Dining',
      'Shopping',
      'Transportation',
      'Entertainment',
      'Utilities',
      'Housing',
      'Healthcare',
      'Education',
      'Personal Care',
      'Travel',
      'Gifts & Donations',
      'Investments',
      'Debt Payments',
      'Subscriptions',
      'Other'
    ],
    income: [
      'Salary',
      'Freelance',
      'Investments',
      'Gifts',
      'Refunds',
      'Allowance',
      'Side Hustle',
      'Other'
    ],
    transfer: [
      'Account Transfer',
      'Investment Transfer',
      'Debt Payment',
      'Other'
    ],
    saving: [
      'Emergency Fund',
      'Vacation',
      'Home Purchase',
      'Education',
      'Retirement',
      'Vehicle',
      'Other'
    ]
  };

  useEffect(() => {
    if (initialData) {
      // Format date properly
      const formattedDate = initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '';
      
      // Convert tags if they exist
      const formattedTags = initialData.tags || [];
      
      setFormData({
        ...initialData,
        date: formattedDate,
        tags: formattedTags,
        recurringDetails: initialData.recurringDetails || {
          frequency: 'monthly',
          endDate: '',
          nextOccurrence: ''
        }
      });
      
      setShowRecurringOptions(initialData.isRecurring || false);
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setFormData({
      amount: '',
      type: 'expense',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      merchant: '',
      tags: [],
      isRecurring: false,
      recurringDetails: {
        frequency: 'monthly',
        endDate: '',
        nextOccurrence: ''
      }
    });
    setErrors({});
    setTagInput('');
    setShowRecurringOptions(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'type') {
      setFormData({
        ...formData,
        type: value,
        category: '' // Reset category when type changes
      });
    } else if (name === 'isRecurring') {
      setFormData({
        ...formData,
        [name]: checked
      });
      setShowRecurringOptions(checked);
    } else if (name.startsWith('recurringDetails.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        recurringDetails: {
          ...formData.recurringDetails,
          [field]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() === '') return;
    
    if (!formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
    }
    
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    
    if (formData.isRecurring) {
      if (!formData.recurringDetails.frequency) {
        newErrors['recurringDetails.frequency'] = 'Please select a frequency';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const dataToSubmit = {
        ...formData,
        userId: userId,
        amount: Number(formData.amount),
      };
      
      if (currentMode === 'add') {
        const newTransaction = await addTransaction(dataToSubmit);
        if (onTransactionAdded) {
          onTransactionAdded(newTransaction);
        }
      } else {
        const updatedTransaction = await updateTransaction(formData._id, dataToSubmit);
        if (onTransactionUpdated) {
          onTransactionUpdated(updatedTransaction);
        }
      }
      
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error saving transaction:', error);
      setErrors({
        submit: error.response?.data?.message || 'Failed to save transaction. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!formData._id && !formData.id) return;
    
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const transactionId = formData._id || formData.id;
      await deleteTransaction(transactionId);
      if (onTransactionDeleted) {
        onTransactionDeleted(transactionId);
      }
      resetForm();
      onClose();
      toast.success('Transaction deleted successfully');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      setErrors({
        submit: error.response?.data?.message || 'Failed to delete transaction. Please try again.'
      });
      toast.error('Failed to delete transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preview impact on remaining balance when amount or type changes
  useEffect(() => {
    if (monthlyDeposit > 0 && formData.type === 'expense' && formData.amount) {
      const amount = parseFloat(formData.amount);
      if (!isNaN(amount)) {
        let updatedBalance = remainingBalance;
        
        // For editing, add back the original amount first if it's an expense
        if (currentMode === 'edit' && initialData && initialData.type === 'expense') {
          updatedBalance += parseFloat(initialData.amount);
        }
        
        // Subtract the new amount
        updatedBalance -= amount;
        
        setPreviewBalance(updatedBalance);
        
        // Calculate impact percentage
        const impactPercentage = (amount / monthlyDeposit) * 100;
        const remainingPercentage = (updatedBalance / monthlyDeposit) * 100;
        
        setBalanceImpact({
          show: true,
          percentage: impactPercentage,
          remainingPercentage: remainingPercentage,
          critical: remainingPercentage <= 10,
          warning: remainingPercentage > 10 && remainingPercentage <= 25
        });
      } else {
        setPreviewBalance(null);
        setBalanceImpact({ show: false, percentage: 0, critical: false, warning: false });
      }
    } else {
      setPreviewBalance(null);
      setBalanceImpact({ show: false, percentage: 0, critical: false, warning: false });
    }
  }, [formData.amount, formData.type, initialData, monthlyDeposit, remainingBalance, currentMode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto`}>
        <div className={`flex justify-between items-center p-5 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {currentMode === 'add' ? 'Add New Transaction' : 'Edit Transaction'}
          </h2>
          <button 
            onClick={onClose} 
            className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} bg-transparent border-0 text-xl`}
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="p-6">
          {/* Monthly Deposit Info */}
          {monthlyDeposit > 0 && formData.type === 'expense' && currentMode === 'add' && (
            <div className={infoBoxStyle}>
              <div className="flex items-start">
                <FaInfoCircle className="mr-2 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium mb-1">Monthly Deposit: ₹{monthlyDeposit.toLocaleString()}</p>
                  <p className="text-sm">
                    This expense will be deducted from your monthly deposit.
                    Current remaining balance: ₹{remainingBalance.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Warning if remaining balance is low */}
          {monthlyDeposit > 0 && formData.type === 'expense' && currentMode === 'add' && 
           remainingBalance < monthlyDeposit * 0.3 && (
            <div className={warningBoxStyle}>
              <div className="flex items-start">
                <FaInfoCircle className="mr-2 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium mb-1">Low Balance Warning</p>
                  <p className="text-sm">
                    Your remaining balance is getting low. You have only 
                    {remainingBalance < monthlyDeposit * 0.1 
                      ? ' critically low ' 
                      : ' low '} 
                    funds left for this month.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Amount */}
            <div className="mb-5">
              <label className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2`}>Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                <input
                  type="number"
                  name="amount"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  className={`w-full p-3 pl-8 ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  } border rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500`}
                  placeholder="Enter amount"
                />
                {previewBalance !== null && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm">
                    {formData.type === 'expense' ? (
                      <FaArrowDown className={`${
                        balanceImpact.critical ? 'text-red-500' : 
                        balanceImpact.warning ? 'text-orange-500' : 'text-blue-500'
                      }`} />
                    ) : formData.type === 'income' ? (
                      <FaArrowUp className="text-green-500" />
                    ) : null}
                  </span>
                )}
              </div>
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
            </div>
            
            {/* Transaction Type */}
            <div className="mb-5">
              <label className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2`}>Transaction Type</label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  type="button"
                  className={`p-3 rounded-md ${
                    formData.type === 'expense' 
                      ? 'bg-red-500 text-white' 
                      : isDarkMode 
                        ? 'bg-gray-800 text-gray-300 border-gray-700' 
                        : 'bg-gray-100 text-gray-700 border-gray-300'
                  } border`}
                  onClick={() => handleChange({ target: { name: 'type', value: 'expense' } })}
                >
                  Expense
                </button>
                <button
                  type="button"
                  className={`p-3 rounded-md ${
                    formData.type === 'income' 
                      ? 'bg-green-500 text-white' 
                      : isDarkMode 
                        ? 'bg-gray-800 text-gray-300 border-gray-700' 
                        : 'bg-gray-100 text-gray-700 border-gray-300'
                  } border`}
                  onClick={() => handleChange({ target: { name: 'type', value: 'income' } })}
                >
                  Income
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className={`p-3 rounded-md ${
                    formData.type === 'transfer' 
                      ? 'bg-blue-500 text-white' 
                      : isDarkMode 
                        ? 'bg-gray-800 text-gray-300 border-gray-700' 
                        : 'bg-gray-100 text-gray-700 border-gray-300'
                  } border`}
                  onClick={() => handleChange({ target: { name: 'type', value: 'transfer' } })}
                >
                  Transfer
                </button>
                <button
                  type="button"
                  className={`p-3 rounded-md ${
                    formData.type === 'saving' 
                      ? 'bg-orange-500 text-white' 
                      : isDarkMode 
                        ? 'bg-gray-800 text-gray-300 border-gray-700' 
                        : 'bg-gray-100 text-gray-700 border-gray-300'
                  } border`}
                  onClick={() => handleChange({ target: { name: 'type', value: 'saving' } })}
                >
                  Saving
                </button>
              </div>
            </div>
            
            {/* Category */}
            <div className="mb-5">
              <label className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2`}>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full p-3 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                } rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500 appearance-none`}
              >
                <option value="">Select a category</option>
                {categoryOptions[formData.type].map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
            
            {/* Description */}
            <div className="mb-5">
              <label className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2`}>Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full p-3 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                } rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500`}
                placeholder="Enter description"
              />
            </div>
            
            {/* Date */}
            <div className="mb-5">
              <label className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2`}>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full p-3 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                } rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500`}
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>
            
            {/* Merchant */}
            <div className="mb-5">
              <label className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2`}>Merchant/Payee</label>
              <input
                type="text"
                name="merchant"
                value={formData.merchant}
                onChange={handleChange}
                className={`w-full p-3 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                } rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500`}
                placeholder="Enter merchant or payee"
              />
            </div>
            
            {/* Tags */}
            <div className="mb-5">
              <label className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2`}>Tags</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <div key={index} className={`${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-100 border border-gray-300'} text-white rounded-full px-3 py-1 text-sm flex items-center gap-1`}>
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTag(tag)}
                      className="flex items-center text-xs"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className={`flex-1 p-3 ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  } rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500`}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className={`${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'} px-4 rounded-md`}
                >
                  <FaPlus />
                </button>
              </div>
            </div>
            
            {/* Recurring */}
            <div className="mb-5">
              <label className={`flex items-center cursor-pointer ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <input
                  type="checkbox"
                  name="isRecurring"
                  checked={formData.isRecurring}
                  onChange={handleChange}
                  className="mr-2 accent-orange-500"
                />
                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>This is a recurring transaction</span>
              </label>
            </div>
            
            {/* Recurring Options */}
            {showRecurringOptions && (
              <div className="mb-5 p-4 bg-gray-800 rounded-md border border-gray-700">
                <h3 className="font-medium text-white mb-3">Recurring Details</h3>
                
                <div className="mb-3">
                  <label className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2`}>Frequency</label>
                  <select
                    name="recurringDetails.frequency"
                    value={formData.recurringDetails.frequency}
                    onChange={handleChange}
                    className={`w-full p-3 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    } rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500`}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                  {errors['recurringDetails.frequency'] && (
                    <p className="text-red-500 text-sm mt-1">{errors['recurringDetails.frequency']}</p>
                  )}
                </div>
                
                <div className="mb-3">
                  <label className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2`}>End Date (Optional)</label>
                  <input
                    type="date"
                    name="recurringDetails.endDate"
                    value={formData.recurringDetails.endDate}
                    onChange={handleChange}
                    className={`w-full p-3 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    } rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500`}
                  />
                </div>
              </div>
            )}
            
            {/* Deposit Status Bar */}
            {monthlyDeposit > 0 && formData.type === 'expense' && (
              <div className={`p-4 border-b border-gray-800 ${previewBalance < 0 ? 'bg-red-900/30' : 'bg-gray-800/30'}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <p className="font-medium mb-1">Monthly Deposit: ₹{monthlyDeposit.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">
                      Currently remaining: ₹{remainingBalance.toLocaleString()} 
                      ({((remainingBalance / monthlyDeposit) * 100).toFixed(1)}%)
                    </p>
                  </div>
                  
                  {balanceImpact.show && (
                    <div className={`text-right ${balanceImpact.critical ? 'text-red-400' : balanceImpact.warning ? 'text-orange-400' : 'text-blue-400'}`}>
                      {previewBalance !== null && (
                        <>
                          <p className="font-medium">
                            After transaction: ₹{previewBalance.toLocaleString()}
                            {previewBalance < 0 && ' (Overdraft)'}
                          </p>
                          <p className="text-sm">
                            {formData.amount && `Impact: ${balanceImpact.percentage.toFixed(1)}% of deposit`}
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Warning for low balance */}
                {previewBalance !== null && balanceImpact.show && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          balanceImpact.critical ? 'bg-red-500' : 
                          balanceImpact.warning ? 'bg-orange-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.max(0, Math.min(100, balanceImpact.remainingPercentage))}%` }}
                      />
                    </div>
                    
                    {balanceImpact.critical && (
                      <p className="flex items-center gap-2 text-red-400 text-sm mt-2">
                        <FaExclamationTriangle /> This transaction will leave you with critically low funds
                      </p>
                    )}
                    
                    {balanceImpact.warning && (
                      <p className="flex items-center gap-2 text-orange-400 text-sm mt-2">
                        <FaExclamationTriangle /> This transaction will significantly reduce your available funds
                      </p>
                    )}
                    
                    {previewBalance < 0 && (
                      <p className="flex items-center gap-2 text-red-400 text-sm mt-2 font-bold">
                        <FaExclamationTriangle /> Warning: This transaction exceeds your remaining deposit
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Error Message */}
            {errors.submit && (
              <div className="mb-5 p-3 bg-red-500 bg-opacity-10 border border-red-500 text-red-500 rounded-md">
                {errors.submit}
              </div>
            )}
            
            {/* Buttons */}
            <div className="mt-6 flex justify-between">
              {currentMode === 'edit' && (
                <button 
                  type="button"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className={`${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white py-3 px-5 rounded-md flex items-center gap-2 disabled:opacity-50`}
                >
                  <FaTrash /> Delete
                </button>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${isDarkMode ? 'bg-orange-500 hover:bg-orange-600' : 'bg-orange-500 hover:bg-orange-600'} text-white py-3 px-5 rounded-md flex items-center gap-2 disabled:opacity-50 ${currentMode === 'edit' ? '' : 'ml-auto'}`}
              >
                <FaSave /> {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm; 