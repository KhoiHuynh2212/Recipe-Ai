// Backend server with Express.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Basic endpoint for server status
app.get('/api/status', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Recipe service endpoints
const recipeRoutes = require('./routes/recipeRoutes');
app.use('/api/recipes', recipeRoutes);

// User service endpoints
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// AI service endpoints for recipe recommendations
const aiRoutes = require('./routes/aiRoutes');
app.use('/api/ai', aiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;