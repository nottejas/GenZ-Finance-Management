const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const User = require('../models/User');

// Get all lessons
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, sort = 'createdAt', order = 'desc' } = req.query;
    
    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    
    // Determine sort order
    const sortOptions = {};
    sortOptions[sort] = order === 'asc' ? 1 : -1;
    
    const lessons = await Lesson.find(filter).sort(sortOptions);
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
    const { category } = req.params;
    const lessons = await Lesson.find({ category }).sort({ difficulty: 1 });
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

// Create a new lesson
router.post('/', async (req, res) => {
  const lesson = new Lesson({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    difficulty: req.body.difficulty,
    points: req.body.points,
    duration: req.body.duration,
    content: req.body.content,
    resources: req.body.resources || [],
    quiz: req.body.quiz || {
      questions: [],
      passingScore: 70
    }
  });
  
  try {
    const newLesson = await lesson.save();
    res.status(201).json(newLesson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a lesson
router.put('/:id', async (req, res) => {
  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedLesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    res.json(updatedLesson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a lesson
router.delete('/:id', async (req, res) => {
  try {
    const deletedLesson = await Lesson.findByIdAndDelete(req.params.id);
    
    if (!deletedLesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    res.json({ message: 'Lesson deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get lessons by difficulty
router.get('/difficulty/:difficulty', async (req, res) => {
  try {
    const { difficulty } = req.params;
    const lessons = await Lesson.find({ difficulty }).sort({ createdAt: -1 });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit quiz answers and get results
router.post('/:id/quiz-submit', async (req, res) => {
  try {
    const lessonId = req.params.id;
    const { userId, answers } = req.body;
    
    if (!userId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Invalid submission data' });
    }
    
    const lesson = await Lesson.findById(lessonId);
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Calculate score
    let correctAnswers = 0;
    const results = [];
    
    lesson.quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correctAnswers++;
      }
      
      results.push({
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      });
    });
    
    const totalQuestions = lesson.quiz.questions.length;
    const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    const passed = score >= lesson.quiz.passingScore;
    
    // TODO: Update user's completed lessons and award points if passed
    
    res.json({
      score,
      passed,
      correctAnswers,
      totalQuestions,
      results
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 