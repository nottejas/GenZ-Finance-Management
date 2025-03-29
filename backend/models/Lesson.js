const mongoose = require('mongoose');

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
    required: true,
    enum: ['saving', 'investing', 'budgeting', 'financial_literacy', 'taxes', 'credit']
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
    type: Number, // in minutes
    required: true
  },
  content: {
    type: String,
    required: true
  },
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['article', 'video', 'podcast', 'tool']
    }
  }],
  quiz: {
    questions: [{
      question: {
        type: String,
        required: true
      },
      options: [String],
      correctAnswer: {
        type: Number, // Index of the correct option
        required: true
      },
      explanation: String
    }],
    passingScore: {
      type: Number,
      required: true,
      default: 70
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
lessonSchema.index({ category: 1, order: 1 });
lessonSchema.index({ 'completions.userId': 1 });

module.exports = mongoose.model('Lesson', lessonSchema); 