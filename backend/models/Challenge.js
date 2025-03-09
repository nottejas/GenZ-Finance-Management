import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Saving', 'Budgeting', 'Investment', 'Education'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  duration: {
    type: Number, // in days
    required: true
  },
  requirements: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  isActive: {
    type: Boolean,
    default: true
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    progress: {
      type: Number,
      default: 0
    },
    startDate: Date,
    endDate: Date,
    completed: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

// Add indexes for better query performance
challengeSchema.index({ isActive: 1 });
challengeSchema.index({ 'participants.userId': 1 });

export default mongoose.model('Challenge', challengeSchema); 