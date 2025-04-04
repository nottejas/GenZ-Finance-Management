import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaTimes, 
  FaSort,
  FaEdit,
  FaArrowUp, 
  FaArrowDown, 
  FaPlus, 
  FaEllipsisH, 
  FaPencilAlt, 
  FaTrash,
  FaLock,
  FaMoneyBillWave,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner
} from 'react-icons/fa';
import { useTransactions } from '../../context/TransactionContext';
import { useSettings } from '../../context/SettingsContext';
import TransactionForm from './TransactionForm';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const TransactionList = () => {
  const { transactions, loading, fetchTransactions, monthlyDeposit, deleteTransaction } = useTransactions();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: '',
    category: '',
    minAmount: '',
    maxAmount: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState({ field: 'date', order: 'desc' });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Get privacy settings
  const showActivity = settings?.privacySettings?.showActivity ?? true;
  
  // Get the current theme mode
  const isDarkMode = settings?.profile?.darkMode ?? true;
  
  // Styling based on theme
  const cardStyle = isDarkMode 
    ? "bg-gray-900 border border-gray-800 border-orange-500 border-l-4 rounded-md p-4" 
    : "bg-white border border-gray-200 border-orange-500 border-l-4 rounded-md p-4 shadow-sm";
    
  const inputStyle = isDarkMode
    ? "bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
    : "bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900";
    
  const buttonStyle = isDarkMode
    ? "bg-gray-800 text-white hover:bg-gray-700"
    : "bg-gray-200 text-gray-800 hover:bg-gray-300";
    
  const textPrimaryColor = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondaryColor = isDarkMode ? "text-gray-400" : "text-gray-600";
  const borderColor = isDarkMode ? "border-gray-800" : "border-gray-200";
  const tableBgColor = isDarkMode ? "bg-gray-900" : "bg-white";
  const tableHeaderBgColor = isDarkMode ? "bg-gray-800" : "bg-gray-100";
  const tableRowHoverBgColor = isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50";
  const tableRowHoverColor = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200";

  useEffect(() => {
    // Only fetch if activity viewing is allowed
    if (showActivity) {
      fetchTransactions();
    } else {
      // Redirect to settings if activity viewing is not allowed
      // In a real app, use React Router for navigation
      setTimeout(() => {
        window.location.href = '/settings';
      }, 2000);
    }
  }, [filters, sort, pagination.page, pagination.limit, showActivity]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      type: '',
      category: '',
      minAmount: '',
      maxAmount: ''
    });
    setSearchTerm('');
  };

  const handleSort = (field) => {
    setSort(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const openAddForm = () => {
    setCurrentTransaction(null);
    setIsFormOpen(true);
  };

  const openEditForm = (transaction) => {
    setCurrentTransaction(transaction);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setCurrentTransaction(null);
    fetchTransactions();
  };

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (transaction.description && transaction.description.toLowerCase().includes(searchLower)) ||
      (transaction.merchant && transaction.merchant.toLowerCase().includes(searchLower)) ||
      (transaction.category && transaction.category.toLowerCase().includes(searchLower)) ||
      (transaction.amount && transaction.amount.toString().includes(searchLower))
    );
  });

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // Get category options for filter
  const categoryOptions = [
    'Housing', 'Transportation', 'Food', 'Utilities', 
    'Insurance', 'Medical', 'Savings', 'Personal', 
    'Entertainment', 'Education', 'Clothing', 'Gifts',
    'Salary', 'Freelance', 'Business', 'Dividends', 
    'Investments', 'Refunds', 'Other'
  ];

  // New method to handle delete confirmation
  const openDeleteConfirm = (transaction) => {
    setTransactionToDelete(transaction);
    setShowDeleteConfirm(true);
  };

  // Handle transaction deletion
  const handleDeleteTransaction = async () => {
    if (!transactionToDelete) return;
    
    setIsDeleting(true);
    
    try {
      await deleteTransaction(transactionToDelete.id);
      setShowDeleteConfirm(false);
      setTransactionToDelete(null);
      toast.success('Transaction deleted successfully');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    } finally {
      setIsDeleting(false);
    }
  };

  // If activity viewing is disabled, show a message
  if (!showActivity) {
    return (
      <div className={`max-w-6xl mx-auto p-12 text-center ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className={cardStyle}>
          <FaLock className={`text-5xl ${textSecondaryColor} mx-auto mb-4`} />
          <h2 className={`text-2xl font-bold mb-4 ${textPrimaryColor}`}>Transaction History Hidden</h2>
          <p className={`${textSecondaryColor} mb-6`}>
            Your transaction history is currently hidden due to your privacy settings.
          </p>
          <button
            className="bg-orange-500 text-white px-6 py-3 rounded-md font-medium hover:bg-orange-600 transition-colors"
            onClick={() => window.location.href = '/settings'}
          >
            Adjust Privacy Settings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-6xl mx-auto ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className={`text-3xl font-bold ${textPrimaryColor} mb-4 sm:mb-0`}>Transaction History</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate('/overview')}
            className={`px-4 py-2 ${monthlyDeposit > 0 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-orange-500 hover:bg-orange-600'} text-white rounded-md flex items-center`}
          >
            <FaMoneyBillWave className="mr-2" /> 
            {monthlyDeposit > 0 ? 'Update Deposit' : 'Set Monthly Deposit'}
          </button>
          <button 
            onClick={openAddForm}
            className="bg-orange-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-orange-600 transition-colors"
          >
            <FaPlus className="mr-2" /> Add Transaction
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className={textSecondaryColor} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search transactions..."
              className={`w-full pl-10 pr-3 py-2 ${inputStyle}`}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`sm:w-auto w-full ${buttonStyle} px-4 py-2 rounded-md flex items-center justify-center transition-colors`}
          >
            <FaFilter className="mr-2" /> {showFilters ? 'Hide' : 'Show'} Filters
          </button>
        </div>

        {showFilters && (
          <div className={cardStyle}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className={`${textSecondaryColor} block mb-1`}>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className={`w-full px-3 py-2 ${inputStyle}`}
                />
              </div>
              <div>
                <label className={`${textSecondaryColor} block mb-1`}>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className={`w-full px-3 py-2 ${inputStyle}`}
                />
              </div>
              <div>
                <label className={`${textSecondaryColor} block mb-1`}>Type</label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className={`w-full px-3 py-2 ${inputStyle}`}
                >
                  <option value="">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className={`${textSecondaryColor} block mb-1`}>Category</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className={`w-full px-3 py-2 ${inputStyle}`}
                >
                  <option value="">All Categories</option>
                  {categoryOptions.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`${textSecondaryColor} block mb-1`}>Min Amount</label>
                <input
                  type="number"
                  name="minAmount"
                  value={filters.minAmount}
                  onChange={handleFilterChange}
                  placeholder="0"
                  className={`w-full px-3 py-2 ${inputStyle}`}
                />
              </div>
              <div>
                <label className={`${textSecondaryColor} block mb-1`}>Max Amount</label>
                <input
                  type="number"
                  name="maxAmount"
                  value={filters.maxAmount}
                  onChange={handleFilterChange}
                  placeholder="100000"
                  className={`w-full px-3 py-2 ${inputStyle}`}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className={`flex items-center ${buttonStyle} px-4 py-2 rounded-md transition-colors`}
              >
                <FaTimes className="mr-2" /> Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Table */}
      <div className={`overflow-x-auto border ${borderColor} rounded-md mb-6`}>
        <table className={`min-w-full divide-y divide-gray-700 ${tableBgColor}`}>
          <thead className={tableHeaderBgColor}>
            <tr>
              <th 
                className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryColor} uppercase tracking-wider cursor-pointer`}
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center">
                  Date
                  {sort.field === 'date' && (
                    sort.order === 'asc' ? 
                    <FaArrowUp className="ml-1" /> : 
                    <FaArrowDown className="ml-1" />
                  )}
                </div>
              </th>
              <th 
                className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryColor} uppercase tracking-wider cursor-pointer`}
                onClick={() => handleSort('description')}
              >
                <div className="flex items-center">
                  Description
                  {sort.field === 'description' && (
                    sort.order === 'asc' ? 
                    <FaArrowUp className="ml-1" /> : 
                    <FaArrowDown className="ml-1" />
                  )}
                </div>
              </th>
              <th 
                className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryColor} uppercase tracking-wider cursor-pointer`}
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center">
                  Category
                  {sort.field === 'category' && (
                    sort.order === 'asc' ? 
                    <FaArrowUp className="ml-1" /> : 
                    <FaArrowDown className="ml-1" />
                  )}
                </div>
              </th>
              <th 
                className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryColor} uppercase tracking-wider cursor-pointer`}
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center">
                  Amount
                  {sort.field === 'amount' && (
                    sort.order === 'asc' ? 
                    <FaArrowUp className="ml-1" /> : 
                    <FaArrowDown className="ml-1" />
                  )}
                </div>
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryColor} uppercase tracking-wider`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${borderColor}`}>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="5" className={`px-6 py-4 text-center ${textSecondaryColor}`}>
                  No transactions found. Add some transactions to get started!
                </td>
              </tr>
            ) : (
              filteredTransactions.map(transaction => (
                <tr key={transaction.id} className={tableRowHoverColor}>
                  <td className={`px-6 py-4 whitespace-nowrap ${textPrimaryColor}`}>
                    {formatDate(transaction.date)}
                  </td>
                  <td className={`px-6 py-4 ${textPrimaryColor}`}>
                    {transaction.description}
                    {transaction.merchant && <div className={`text-sm ${textSecondaryColor}`}>{transaction.merchant}</div>}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${textPrimaryColor}`}>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.category}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    transaction.type === 'income' 
                      ? 'text-green-500' 
                      : 'text-red-500'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => openEditForm(transaction)}
                        className="text-orange-500 hover:text-orange-600"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => openDeleteConfirm(transaction)}
                        className="text-red-500 hover:text-red-600"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className={textSecondaryColor}>
          Showing {filteredTransactions.length} transactions
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className={`${buttonStyle} px-3 py-1 rounded-md flex items-center disabled:opacity-50`}
          >
            <FaChevronLeft className="mr-1" /> Prev
          </button>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
            className={`${buttonStyle} px-3 py-1 rounded-md flex items-center disabled:opacity-50`}
          >
            Next <FaChevronRight className="ml-1" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
          <div className={`w-full max-w-md rounded-xl p-6 ${
            isDarkMode ? 'bg-gray-900' : 'bg-white'
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${textPrimaryColor}`}>Confirm Deletion</h3>
            
            <p className={`mb-6 ${textSecondaryColor}`}>
              Are you sure you want to delete this transaction?
              {transactionToDelete && (
                <span className="block mt-2 font-medium">
                  {transactionToDelete.description} - 
                  {transactionToDelete.type === 'income' ? '+' : '-'}
                  ₹{transactionToDelete.amount.toLocaleString()}
                </span>
              )}
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={`px-4 py-2 rounded-md ${
                  isDarkMode 
                    ? 'bg-gray-800 text-white hover:bg-gray-700' 
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
                disabled={isDeleting}
              >
                Cancel
              </button>
              
              <button
                onClick={handleDeleteTransaction}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-70 flex items-center"
              >
                {isDeleting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash className="mr-2" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Form Modal */}
      <TransactionForm 
        isOpen={isFormOpen} 
        onClose={closeForm} 
        transaction={currentTransaction}
      />
    </div>
  );
};

export default TransactionList; 