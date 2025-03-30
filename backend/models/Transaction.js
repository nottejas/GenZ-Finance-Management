const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecurringDetailsSchema = new Schema({
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'],
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  dayOfMonth: Number,
  dayOfWeek: Number,
  interval: Number
}, { _id: false });

const TransactionSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense', 'transfer'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  },
  merchant: {
    type: String,
    trim: true
  },
  tags: [String],
  recurring: {
    type: Boolean,
    default: false
  },
  recurringDetails: RecurringDetailsSchema,
  attachment: {
    url: String,
    filename: String,
    mimeType: String
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create indexes for common queries
TransactionSchema.index({ userId: 1, date: -1 });
TransactionSchema.index({ userId: 1, type: 1 });
TransactionSchema.index({ userId: 1, category: 1 });
TransactionSchema.index({ userId: 1, date: -1, type: 1 });

// Static methods
TransactionSchema.statics.getMonthlySummary = async function(userId, year, month) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  return this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);
};

TransactionSchema.statics.getCategoryBreakdown = async function(userId, year, month) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  return this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate },
        type: 'expense'
      }
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { total: -1 }
    }
  ]);
};

module.exports = mongoose.model('Transaction', TransactionSchema); 