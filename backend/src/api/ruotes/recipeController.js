// Recipe controller
const Recipe = require('../models/Recipe');

// Get all recipes
exports.getAllRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const recipes = await Recipe.find()
      .skip(skip)
      .limit(limit);
    
    const total = await Recipe.countDocuments();
    
    res.status(200).json({
      success: true,
      count: recipes.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: recipes
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Get recipe by ID
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        error: 'Recipe not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: recipe
    });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Create new recipe
exports.createRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.create(req.body);
    
    res.status(201).json({
      success: true,
      data: recipe
    });
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Update recipe
exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        error: 'Recipe not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: recipe
    });
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Delete recipe
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        error: 'Recipe not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Search recipes by ingredients
exports.searchByIngredients = async (req, res) => {
  try {
    const ingredients = req.query.ingredients.split(',');
    
    // Find recipes that contain any of the specified ingredients
    const recipes = await Recipe.find({
      'ingredients.name': { $in: ingredients }
    });
    
    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    console.error('Error searching recipes by ingredients:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Filter recipes by dietary restrictions
exports.filterByDiet = async (req, res) => {
  try {
    const { restrictions } = req.query;
    const dietaryRestrictions = restrictions.split(',');
    
    // Find recipes that match the dietary restrictions
    const recipes = await Recipe.find({
      dietaryRestrictions: { $all: dietaryRestrictions }
    });
    
    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    console.error('Error filtering recipes by diet:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};