const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// Get all transactions for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { 
      startDate, 
      endDate, 
      type, 
      category, 
      minAmount, 
      maxAmount,
      sort = 'date',
      order = 'desc',
      limit = 50,
      page = 1
    } = req.query;
    
    // Build filter object
    const filter = { userId };
    
    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    
    // Transaction type filter
    if (type) filter.type = type;
    
    // Category filter
    if (category) filter.category = category;
    
    // Amount range filter
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = Number(minAmount);
      if (maxAmount) filter.amount.$lte = Number(maxAmount);
    }
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Determine sort order
    const sortOptions = {};
    sortOptions[sort] = order === 'asc' ? 1 : -1;
    
    // Execute query with pagination and sorting
    const transactions = await Transaction.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));
    
    // Get total count for pagination info
    const total = await Transaction.countDocuments(filter);
    
    res.json({
      transactions,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific transaction
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new transaction
router.post('/', async (req, res) => {
  const transaction = new Transaction({
    userId: req.body.userId,
    amount: req.body.amount,
    type: req.body.type,
    category: req.body.category,
    description: req.body.description,
    date: req.body.date || new Date(),
    merchant: req.body.merchant,
    tags: req.body.tags,
    isRecurring: req.body.isRecurring || false,
    recurringDetails: req.body.recurringDetails,
    attachment: req.body.attachment,
    location: req.body.location
  });
  
  try {
    const newTransaction = await transaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a transaction
router.put('/:id', async (req, res) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.json(updatedTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a transaction
router.delete('/:id', async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
    
    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get monthly summary for a user
router.get('/summary/monthly/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { year, month } = req.query;
    
    if (!year || !month) {
      return res.status(400).json({ message: 'Year and month are required query parameters' });
    }
    
    const summary = await Transaction.getMonthlySummary(userId, Number(year), Number(month));
    
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get category breakdown for a user
router.get('/summary/categories/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { year, month } = req.query;
    
    if (!year || !month) {
      return res.status(400).json({ message: 'Year and month are required query parameters' });
    }
    
    const breakdown = await Transaction.getCategoryBreakdown(userId, Number(year), Number(month));
    
    res.json(breakdown);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 