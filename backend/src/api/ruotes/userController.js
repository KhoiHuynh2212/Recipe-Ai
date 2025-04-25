// User controller
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '1h';

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }
    
    // Create new user
    user = new User({
      name,
      email,
      password
    });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    // Save user to database
    await user.save();
    
    // Create and send JWT token
    const payload = {
      user: {
        id: user.id
      }
    };
    
    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          success: true,
          token
        });
      }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Create and send JWT token
    const payload = {
      user: {
        id: user.id
      }
    };
    
    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          success: true,
          token
        });
      }
    );
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Middleware to authenticate token
exports.authenticateToken = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');
  
  // Check if no token
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No token, authorization denied'
    });
  }
  
  // Verify token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Token is not valid'
    });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Build profile object
    const profileFields = {};
    if (name) profileFields.name = name;
    if (email) profileFields.email = email;
    
    // Update user profile
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Get user's saved recipes
exports.getSavedRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('savedRecipes')
      .select('savedRecipes');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      count: user.savedRecipes.length,
      data: user.savedRecipes
    });
  } catch (error) {
    console.error('Error getting saved recipes:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Save a recipe to user's collection
exports.saveRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    
    // Add recipe to user's saved recipes if not already saved
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Check if recipe is already saved
    if (user.savedRecipes.includes(recipeId)) {
      return res.status(400).json({
        success: false,
        error: 'Recipe already saved'
      });
    }
    
    // Add recipe to saved recipes
    user.savedRecipes.push(recipeId);
    
    // Save user to database
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Recipe saved successfully'
    });
  } catch (error) {
    console.error('Error saving recipe:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Remove a recipe from user's collection
exports.removeRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    
    // Remove recipe from user's saved recipes
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Check if recipe is saved
    if (!user.savedRecipes.includes(recipeId)) {
      return res.status(400).json({
        success: false,
        error: 'Recipe not saved'
      });
    }
    
    // Remove recipe from saved recipes
    user.savedRecipes = user.savedRecipes.filter(
      recipe => recipe.toString() !== recipeId
    );
    
    // Save user to database
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Recipe removed successfully'
    });
  } catch (error) {
    console.error('Error removing recipe:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Update user's dietary preferences
exports.updatePreferences = async (req, res) => {
  try {
    const { dietaryRestrictions, allergens, preferences } = req.body;
    
    // Build preferences object
    const preferencesFields = {};
    if (dietaryRestrictions) preferencesFields.dietaryRestrictions = dietaryRestrictions;
    if (allergens) preferencesFields.allergens = allergens;
    if (preferences) preferencesFields.preferences = preferences;
    
    // Update user preferences
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: preferencesFields },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};