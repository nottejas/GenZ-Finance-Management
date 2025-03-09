import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  merchant: {
    type: String,
    required: true
  },
  description: String,
  date: {
    type: Date,
    default: Date.now
  },
  tags: [String],
  isSubscription: {
    type: Boolean,
    default: false
  },
  isBNPL: {
    type: Boolean,
    default: false
  },
  bnplDetails: {
    totalAmount: Number,
    remainingAmount: Number,
    installments: Number,
    nextPaymentDate: Date
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, category: 1 });

export default mongoose.model('Transaction', transactionSchema); 