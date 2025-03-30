const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  profile: {
    name: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    currency: {
      type: String,
      default: 'INR'
    },
    language: {
      type: String,
      default: 'English'
    },
    darkMode: {
      type: Boolean,
      default: true
    }
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
    sms: {
      type: Boolean,
      default: false
    },
    marketingEmails: {
      type: Boolean,
      default: false
    }
  },
  privacySettings: {
    showBalances: {
      type: Boolean,
      default: true
    },
    showActivity: {
      type: Boolean,
      default: true
    },
    shareData: {
      type: Boolean,
      default: false
    }
  },
  financialSettings: {
    savingsGoal: {
      type: Number,
      default: 50000
    },
    budgetReminders: {
      type: Boolean,
      default: true
    },
    autoCategorization: {
      type: Boolean,
      default: true
    },
    roundUpSavings: {
      type: Boolean,
      default: false
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema); 