import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    default: 0
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      spending: { type: Boolean, default: true },
      challenges: { type: Boolean, default: true },
      tips: { type: Boolean, default: true }
    },
    display: {
      theme: { type: String, default: 'light' },
      currency: { type: String, default: 'USD' },
      language: { type: String, default: 'English' }
    },
    privacy: {
      shareStats: { type: Boolean, default: true },
      showInLeaderboard: { type: Boolean, default: true },
      publicProfile: { type: Boolean, default: false }
    }
  },
  stats: {
    lessonsCompleted: { type: Number, default: 0 },
    challengesCompleted: { type: Number, default: 0 },
    totalSaved: { type: Number, default: 0 },
    streakDays: { type: Number, default: 0 }
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  activeChallenges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge'
  }],
  completedChallenges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge'
  }],
  completedLessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }]
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema); 