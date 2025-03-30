import React, { useState, useEffect } from 'react';
import { FaSort, FaEdit, FaPlus, FaSearch, FaFilter, FaArrowUp, FaArrowDown, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useTransactions } from '../../context/TransactionContext';
import TransactionForm from './TransactionForm';

const TransactionList = () => {
  const { transactions, loading, fetchTransactions } = useTransactions();
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

  useEffect(() => {
    fetchTransactions();
  }, [filters, sort, pagination.page, pagination.limit]);

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

  return (
    <div className="max-w-6xl mx-auto p-6 bg-black text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transaction History</h1>
        <button 
          onClick={openAddForm}
          className="bg-orange-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-orange-600 transition-colors"
        >
          <FaPlus className="mr-2" /> Add Transaction
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-500" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search transactions..."
              className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:w-auto w-full bg-gray-800 text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-gray-700 transition-colors"
          >
            <FaFilter className="mr-2" /> {showFilters ? 'Hide' : 'Show'} Filters
          </button>
        </div>

        {showFilters && (
          <div className="bg-gray-900 p-4 rounded-md border border-gray-800 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-gray-400 block mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Type</label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                >
                  <option value="">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Category</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                >
                  <option value="">All Categories</option>
                  {categoryOptions.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Min Amount</label>
                <input
                  type="number"
                  name="minAmount"
                  value={filters.minAmount}
                  onChange={handleFilterChange}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Max Amount</label>
                <input
                  type="number"
                  name="maxAmount"
                  value={filters.maxAmount}
                  onChange={handleFilterChange}
                  placeholder="999999"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
        {loading ? (
          <div className="text-center py-10">
            <div className="loader"></div>
            <p className="mt-4 text-gray-400">Loading transactions...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400">No transactions found.</p>
            <button
              onClick={openAddForm}
              className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-md inline-flex items-center hover:bg-orange-600 transition-colors"
            >
              <FaPlus className="mr-2" /> Add Your First Transaction
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800 text-gray-400 text-left">
                    <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('date')}>
                      <div className="flex items-center">
                        Date
                        {sort.field === 'date' && (
                          <FaSort className="ml-1 text-orange-500" />
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('description')}>
                      <div className="flex items-center">
                        Description
                        {sort.field === 'description' && (
                          <FaSort className="ml-1 text-orange-500" />
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('amount')}>
                      <div className="flex items-center justify-end">
                        Amount
                        {sort.field === 'amount' && (
                          <FaSort className="ml-1 text-orange-500" />
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-800 transition-colors">
                      <td className="px-4 py-3 text-gray-300">{formatDate(transaction.date)}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{transaction.description}</div>
                        {transaction.merchant && (
                          <div className="text-sm text-gray-400">{transaction.merchant}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-300">{transaction.category}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === 'income' 
                            ? 'bg-green-900 text-green-300' 
                            : 'bg-red-900 text-red-300'
                        }`}>
                          {transaction.type === 'income' ? (
                            <FaArrowUp className="mr-1" />
                          ) : (
                            <FaArrowDown className="mr-1" />
                          )}
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-right font-bold ${
                        transaction.type === 'income' 
                          ? 'text-green-500' 
                          : 'text-red-500'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => openEditForm(transaction)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <FaEdit size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center px-4 py-3 border-t border-gray-800 bg-gray-900">
              <div className="text-sm text-gray-400">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} transactions
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`px-3 py-1 rounded ${
                    pagination.page === 1
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  <FaChevronLeft />
                </button>
                {[...Array(pagination.pages).keys()].map((page) => {
                  // Show first page, last page, and pages around current page
                  const pageNumber = page + 1;
                  const isCurrentPage = pageNumber === pagination.page;
                  const isFirstPage = pageNumber === 1;
                  const isLastPage = pageNumber === pagination.pages;
                  const isNearCurrentPage = Math.abs(pageNumber - pagination.page) <= 1;
                  
                  if (isFirstPage || isLastPage || isNearCurrentPage) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-3 py-1 rounded ${
                          isCurrentPage
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-800 text-white hover:bg-gray-700'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    (pageNumber === 2 && pagination.page > 3) ||
                    (pageNumber === pagination.pages - 1 && pagination.page < pagination.pages - 2)
                  ) {
                    return <span key={pageNumber} className="px-1">...</span>;
                  } else {
                    return null;
                  }
                })}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className={`px-3 py-1 rounded ${
                    pagination.page === pagination.pages
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Transaction Form Modal */}
      {isFormOpen && (
        <TransactionForm
          initialTransaction={currentTransaction}
          onClose={closeForm}
          isEditing={!!currentTransaction}
        />
      )}
    </div>
  );
};

export default TransactionList; 