const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  clerkId: {
    type: String,
    unique: true,
    sparse: true // Allows null values for non-Clerk authentication
  },
  password: {
    type: String,
    required: function() {
      return !this.clerkId; // Only required if not using Clerk
    }
  },
  profileImage: {
    type: String,
    default: 'default-profile.png' 
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  financialProfile: {
    incomeAmount: {
      type: Number,
      default: 0
    },
    incomeFrequency: {
      type: String,
      enum: ['weekly', 'biweekly', 'monthly', 'annually'],
      default: 'monthly'
    },
    savingsGoal: {
      type: Number,
      default: 0
    },
    expenseCategories: [{
      name: String,
      limit: Number,
      color: String
    }]
  },
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    },
    savingReminders: {
      type: Boolean,
      default: true
    },
    budgetAlerts: {
      type: Boolean,
      default: true
    }
  },
  preferences: {
    currency: {
      type: String,
      default: 'INR'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  stats: {
    totalSaved: {
      type: Number,
      default: 0
    },
    challengesCompleted: {
      type: Number,
      default: 0
    },
    lessonsCompleted: {
      type: Number,
      default: 0
    },
    savingsStreak: {
      type: Number,
      default: 0
    },
    points: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ clerkId: 1 });

module.exports = mongoose.model('User', userSchema); 