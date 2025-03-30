import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaTrash, FaPlus } from 'react-icons/fa';
import { useTransactions } from '../../context/TransactionContext';

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
  const { addTransaction, updateTransaction, deleteTransaction } = useTransactions();
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
    if (!formData._id || currentMode !== 'edit') return;
    
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await deleteTransaction(formData._id);
      if (onTransactionDeleted) {
        onTransactionDeleted(formData._id);
      }
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      setErrors({
        submit: error.response?.data?.message || 'Failed to delete transaction. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">
            {currentMode === 'add' ? 'Add New Transaction' : 'Edit Transaction'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white bg-transparent border-0 text-xl"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Amount */}
            <div className="mb-5">
              <label className="block text-gray-400 text-sm mb-2">Amount</label>
              <input
                type="number"
                name="amount"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 text-white rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                placeholder="Enter amount"
              />
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
            </div>
            
            {/* Transaction Type */}
            <div className="mb-5">
              <label className="block text-gray-400 text-sm mb-2">Transaction Type</label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  type="button"
                  className={`p-3 rounded-md ${formData.type === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-300 border border-gray-700'}`}
                  onClick={() => handleChange({ target: { name: 'type', value: 'expense' } })}
                >
                  Expense
                </button>
                <button
                  type="button"
                  className={`p-3 rounded-md ${formData.type === 'income' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-300 border border-gray-700'}`}
                  onClick={() => handleChange({ target: { name: 'type', value: 'income' } })}
                >
                  Income
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className={`p-3 rounded-md ${formData.type === 'transfer' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300 border border-gray-700'}`}
                  onClick={() => handleChange({ target: { name: 'type', value: 'transfer' } })}
                >
                  Transfer
                </button>
                <button
                  type="button"
                  className={`p-3 rounded-md ${formData.type === 'saving' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-300 border border-gray-700'}`}
                  onClick={() => handleChange({ target: { name: 'type', value: 'saving' } })}
                >
                  Saving
                </button>
              </div>
            </div>
            
            {/* Category */}
            <div className="mb-5">
              <label className="block text-gray-400 text-sm mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 text-white rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500 appearance-none"
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
              <label className="block text-gray-400 text-sm mb-2">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 text-white rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                placeholder="Enter description"
              />
            </div>
            
            {/* Date */}
            <div className="mb-5">
              <label className="block text-gray-400 text-sm mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 text-white rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>
            
            {/* Merchant */}
            <div className="mb-5">
              <label className="block text-gray-400 text-sm mb-2">Merchant/Payee</label>
              <input
                type="text"
                name="merchant"
                value={formData.merchant}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 text-white rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                placeholder="Enter merchant or payee"
              />
            </div>
            
            {/* Tags */}
            <div className="mb-5">
              <label className="block text-gray-400 text-sm mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="bg-orange-500 bg-opacity-10 text-orange-500 border border-orange-500 rounded-full px-3 py-1 text-sm flex items-center gap-1">
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
                  className="flex-1 p-3 bg-gray-800 border border-gray-700 text-white rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-orange-500 text-white px-4 rounded-md"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
            
            {/* Recurring */}
            <div className="mb-5">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isRecurring"
                  checked={formData.isRecurring}
                  onChange={handleChange}
                  className="mr-2 accent-orange-500"
                />
                <span className="text-white">This is a recurring transaction</span>
              </label>
            </div>
            
            {/* Recurring Options */}
            {showRecurringOptions && (
              <div className="mb-5 p-4 bg-gray-800 rounded-md border border-gray-700">
                <h3 className="font-medium text-white mb-3">Recurring Details</h3>
                
                <div className="mb-3">
                  <label className="block text-gray-400 text-sm mb-2">Frequency</label>
                  <select
                    name="recurringDetails.frequency"
                    value={formData.recurringDetails.frequency}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
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
                  <label className="block text-gray-400 text-sm mb-2">End Date (Optional)</label>
                  <input
                    type="date"
                    name="recurringDetails.endDate"
                    value={formData.recurringDetails.endDate}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>
            )}
            
            {/* Error Message */}
            {errors.submit && (
              <div className="mb-5 p-3 bg-red-500 bg-opacity-10 border border-red-500 text-red-500 rounded-md">
                {errors.submit}
              </div>
            )}
            
            {/* Buttons */}
            <div className="flex justify-between mt-6">
              {currentMode === 'edit' && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="bg-red-500 text-white py-3 px-5 rounded-md flex items-center gap-2 disabled:opacity-50"
                >
                  <FaTrash /> Delete
                </button>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-orange-500 text-white py-3 px-5 rounded-md flex items-center gap-2 disabled:opacity-50 ${currentMode === 'edit' ? '' : 'ml-auto'}`}
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