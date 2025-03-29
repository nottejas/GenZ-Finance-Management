const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const User = require('../models/User');

// Get all lessons
router.get('/', async (req, res) => {
  try {
    const lessons = await Lesson.find();
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get lesson by ID
router.get('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get lessons by category
router.get('/category/:category', async (req, res) => {
  try {
    const lessons = await Lesson.find({ category: req.params.category });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get completed lessons for a user
router.get('/user/:userId/completed', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('completedLessons');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.completedLessons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create lesson
router.post('/', async (req, res) => {
  const lesson = new Lesson({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    difficulty: req.body.difficulty,
    points: req.body.points,
    content: req.body.content,
    resources: req.body.resources,
    quiz: req.body.quiz
  });

  try {
    const newLesson = await lesson.save();
    res.status(201).json(newLesson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Complete a lesson
router.post('/:id/complete', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Add lesson to user's completed lessons
    await User.findByIdAndUpdate(
      req.body.userId,
      { 
        $addToSet: { completedLessons: lesson._id },
        $inc: { 
          points: lesson.points,
          'stats.lessonsCompleted': 1
        }
      }
    );
    
    res.json({ 
      message: 'Lesson completed successfully',
      pointsEarned: lesson.points
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit quiz answers
router.post('/:id/quiz', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Calculate score
    const userAnswers = req.body.answers;
    let correctAnswers = 0;
    
    lesson.quiz.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const score = (correctAnswers / lesson.quiz.questions.length) * 100;
    const passed = score >= lesson.quiz.passingScore;
    
    // If passed, mark lesson as completed
    if (passed) {
      await User.findByIdAndUpdate(
        req.body.userId,
        { 
          $addToSet: { completedLessons: lesson._id },
          $inc: { 
            points: lesson.points,
            'stats.lessonsCompleted': 1
          }
        }
      );
    }
    
    res.json({ 
      score,
      passed,
      correctAnswers,
      totalQuestions: lesson.quiz.questions.length,
      pointsEarned: passed ? lesson.points : 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 