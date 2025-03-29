const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['saving', 'investing', 'budgeting', 'financial_literacy']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  points: {
    type: Number,
    required: true
  },
  duration: {
    type: Number, // in days
    required: true
  },
  steps: [{
    description: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  }],
  tips: [String],
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['article', 'video', 'podcast', 'tool']
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
challengeSchema.index({ isActive: 1 });
challengeSchema.index({ 'participants.userId': 1 });

module.exports = mongoose.model('Challenge', challengeSchema); 