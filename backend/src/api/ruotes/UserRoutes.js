// User service routes
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Import user controller (to be implemented)
const userController = require('../controllers/userController');

// User registration
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').notEmpty().withMessage('Name is required')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  userController.register
);

// User login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  userController.login
);

// Get user profile
router.get('/profile', userController.authenticateToken, userController.getProfile);

// Update user profile
router.put('/profile', userController.authenticateToken, userController.updateProfile);

// Get user's saved recipes
router.get('/recipes', userController.authenticateToken, userController.getSavedRecipes);

// Save a recipe to user's collection
router.post('/recipes/:recipeId', userController.authenticateToken, userController.saveRecipe);

// Remove a recipe from user's collection
router.delete('/recipes/:recipeId', userController.authenticateToken, userController.removeRecipe);

// Update user's dietary preferences
router.put('/preferences', userController.authenticateToken, userController.updatePreferences);

module.exports = router;