const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const User = require('../models/User');

// Get all challenges
router.get('/', async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get challenge by ID
router.get('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    res.json(challenge);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get active challenges for a user
router.get('/user/:userId/active', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('activeChallenges');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.activeChallenges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get completed challenges for a user
router.get('/user/:userId/completed', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('completedChallenges');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.completedChallenges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create challenge
router.post('/', async (req, res) => {
  const challenge = new Challenge({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    difficulty: req.body.difficulty,
    points: req.body.points,
    duration: req.body.duration,
    steps: req.body.steps
  });

  try {
    const newChallenge = await challenge.save();
    res.status(201).json(newChallenge);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Join a challenge
router.post('/:id/join', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    // Add challenge to user's active challenges
    await User.findByIdAndUpdate(
      req.body.userId,
      { $addToSet: { activeChallenges: challenge._id } }
    );
    
    res.json({ message: 'Challenge joined successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Complete a challenge
router.post('/:id/complete', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Move challenge from active to completed
    await User.findByIdAndUpdate(
      req.body.userId,
      { 
        $pull: { activeChallenges: challenge._id },
        $addToSet: { completedChallenges: challenge._id },
        $inc: { 
          points: challenge.points,
          'stats.challengesCompleted': 1
        }
      }
    );
    
    res.json({ 
      message: 'Challenge completed successfully',
      pointsEarned: challenge.points
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 