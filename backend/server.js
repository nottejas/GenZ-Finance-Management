const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Import routes
const userRoutes = require('./routes/users');
const transactionRoutes = require('./routes/transactions');
const challengeRoutes = require('./routes/challenges');
const lessonRoutes = require('./routes/lessons');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/lessons', lessonRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to GenZ Finance API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 