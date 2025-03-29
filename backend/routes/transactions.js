const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// Get all transactions for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.params.userId });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get transaction by ID
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

// Create transaction
router.post('/', async (req, res) => {
  const transaction = new Transaction({
    user: req.body.userId,
    amount: req.body.amount,
    type: req.body.type,
    category: req.body.category,
    description: req.body.description,
    date: req.body.date || new Date()
  });

  try {
    const newTransaction = await transaction.save();
    
    // Update user's transaction list
    await User.findByIdAndUpdate(
      req.body.userId,
      { $push: { transactions: newTransaction._id } }
    );
    
    // Update user's stats if it's a saving
    if (req.body.type === 'saving') {
      await User.findByIdAndUpdate(
        req.body.userId,
        { $inc: { 'stats.totalSaved': req.body.amount } }
      );
    }
    
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update transaction
router.patch('/:id', async (req, res) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    await Transaction.findByIdAndDelete(req.params.id);
    
    // Remove from user's transaction list
    await User.findByIdAndUpdate(
      transaction.user,
      { $pull: { transactions: req.params.id } }
    );
    
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 