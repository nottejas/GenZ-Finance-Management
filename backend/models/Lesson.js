import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
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
    enum: ['basics', 'investing', 'saving', 'credit'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  thumbnail: String,
  order: Number,
  isPublished: {
    type: Boolean,
    default: false
  },
  completions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    quiz: {
      score: Number,
      attempts: Number
    }
  }],
  quiz: [{
    question: String,
    options: [String],
    correctAnswer: Number,
    explanation: String
  }]
}, {
  timestamps: true
});

// Add indexes for better query performance
lessonSchema.index({ category: 1, order: 1 });
lessonSchema.index({ 'completions.userId': 1 });

export default mongoose.model('Lesson', lessonSchema); 