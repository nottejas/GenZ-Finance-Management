const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { requireAuth } = require('../middleware/auth');

// Get user settings
router.get('/:userId', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Make sure user can only access their own settings
    if (req.auth.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized access to settings' });
    }
    
    // Find settings for the user
    const settings = await Settings.findOne({ userId });
    
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create or update settings
router.put('/:userId', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Make sure user can only modify their own settings
    if (req.auth.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized access to settings' });
    }
    
    const settingsData = req.body;
    
    // Find and update settings, or create if they don't exist
    const settings = await Settings.findOneAndUpdate(
      { userId },
      { ...settingsData, userId },
      { new: true, upsert: true }
    );
    
    res.json(settings);
  } catch (error) {
    console.error('Error saving settings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a specific settings section
router.patch('/:userId/:section', requireAuth, async (req, res) => {
  try {
    const { userId, section } = req.params;
    
    // Make sure user can only modify their own settings
    if (req.auth.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized access to settings' });
    }
    
    const sectionData = req.body;
    
    // Validate that section is valid
    const validSections = ['profile', 'notifications', 'privacySettings', 'financialSettings'];
    if (!validSections.includes(section)) {
      return res.status(400).json({ message: 'Invalid settings section' });
    }
    
    // Build update object with section
    const updateData = {
      [`${section}`]: sectionData
    };
    
    // Find and update settings, or create if they don't exist
    const settings = await Settings.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true }
    );
    
    res.json(settings);
  } catch (error) {
    console.error('Error updating settings section:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 