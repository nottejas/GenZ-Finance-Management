const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { requireAuth } = require('../middleware/auth');

// Get all transactions for a user
router.get('/user/:userId', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Make sure user can only access their own transactions
    if (req.auth.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized access to transactions' });
    }
    
    // Get query parameters
    const { type, category, startDate, endDate, search, page = 1, limit = 20, sort = 'date', order = 'desc' } = req.query;
    
    // Build filter object
    const filter = { userId };
    
    if (type) {
      filter.type = type;
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }
    
    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: 'i' } },
        { merchant: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Find transactions with filters, sorting and pagination
    const transactions = await Transaction.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Transaction.countDocuments(filter);
    
    res.json({
      transactions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a specific transaction
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    // Make sure user can only access their own transactions
    if (transaction.userId !== req.auth.userId) {
      return res.status(403).json({ message: 'Unauthorized access to transaction' });
    }
    
    res.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new transaction
router.post('/', requireAuth, async (req, res) => {
  try {
    const { 
      amount, type, category, description, date, merchant, 
      tags, recurring, recurringDetails 
    } = req.body;
    
    // Create new transaction
    const newTransaction = new Transaction({
      userId: req.auth.userId,
      amount,
      type,
      category,
      description,
      date: new Date(date),
      merchant,
      tags,
      recurring,
      recurringDetails
    });
    
    await newTransaction.save();
    
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a transaction
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    // Make sure user can only update their own transactions
    if (transaction.userId !== req.auth.userId) {
      return res.status(403).json({ message: 'Unauthorized access to transaction' });
    }
    
    // Extract fields to update
    const {
      amount, type, category, description, date, merchant,
      tags, recurring, recurringDetails
    } = req.body;
    
    // Update transaction
    transaction.amount = amount;
    transaction.type = type;
    transaction.category = category;
    transaction.description = description;
    transaction.date = new Date(date);
    transaction.merchant = merchant;
    transaction.tags = tags;
    transaction.recurring = recurring;
    transaction.recurringDetails = recurringDetails;
    
    await transaction.save();
    
    res.json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a transaction
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    // Make sure user can only delete their own transactions
    if (transaction.userId !== req.auth.userId) {
      return res.status(403).json({ message: 'Unauthorized access to transaction' });
    }
    
    await transaction.remove();
    
    res.json({ success: true, message: 'Transaction deleted' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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