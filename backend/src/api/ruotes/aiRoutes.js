// Recipe service routes
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Import recipe controller (to be implemented)
const recipeController = require('../controllers/recipeController');

// Get all recipes
router.get('/', recipeController.getAllRecipes);

// Get recipe by ID
router.get('/:id', recipeController.getRecipeById);

// Create new recipe
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Recipe title is required'),
    body('ingredients').isArray().withMessage('Ingredients must be an array'),
    body('instructions').notEmpty().withMessage('Instructions are required'),
    body('time').notEmpty().withMessage('Cooking time is required'),
    body('servings').isInt({ min: 1 }).withMessage('Servings must be at least 1')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  recipeController.createRecipe
);

// Update recipe
router.put('/:id', recipeController.updateRecipe);

// Delete recipe
router.delete('/:id', recipeController.deleteRecipe);

// Search recipes by ingredients
router.get('/search/ingredients', recipeController.searchByIngredients);

// Filter recipes by dietary restrictions
router.get('/filter/diet', recipeController.filterByDiet);

module.exports = router;