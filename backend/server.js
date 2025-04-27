// server.js - Main entry point for the API
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const authMiddleware = require('./authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Initialize Gemini AI
// We'll use axios for direct API calls to Gemini 2.0 Flash
const axios = require('axios');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Fixed: Use environment variable correctly
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Recipe Schema
const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: [String],
  instructions: { type: String, required: true },
  generatedAt: { type: Date, default: Date.now },
  tags: [String],
  userId: { type: String, default: 'anonymous' }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

// User preferences schema
const userPreferenceSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  dietaryRestrictions: [String],
  allergens: [String],
  pantryItems: [{ 
    name: String, 
    type: String, 
    expiration: Date
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const UserPreference = mongoose.model('UserPreference', userPreferenceSchema);

// Login route - new endpoint for authentication
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // In a real application, you would validate credentials against database
    // This is a simplified example for demonstration
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      // Create a JWT token
      const token = jwt.sign(
        { userId: 'admin', username: username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      return res.json({ 
        success: true, 
        token,
        message: 'Authentication successful'
      });
    }
    
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials'
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication failed'
    });
  }
});

// Routes with authentication

// Generate a recipe with Gemini AI - Protected route
app.post('/api/recipes/generate', authMiddleware, async (req, res) => {
  try {
    // Access user information if available
    const userId = req.user ? req.user.userId : 'anonymous';
    
    const { prompt, dietaryRestrictions = [], allergens = [], pantryItems = [] } = req.body;
    
    // Format the prompt for Gemini
    let enhancedPrompt = `Generate a recipe based on: ${prompt}.\n`;
    
    if (dietaryRestrictions.length > 0) {
      enhancedPrompt += `Dietary restrictions: ${dietaryRestrictions.join(', ')}.\n`;
    }
    
    if (allergens.length > 0) {
      enhancedPrompt += `Allergens to avoid: ${allergens.join(', ')}.\n`;
    }
    
    if (pantryItems.length > 0) {
      enhancedPrompt += `Try to use these ingredients if possible: ${pantryItems.map(item => item.name).join(', ')}.\n`;
    }
    
    enhancedPrompt += `Format the response as JSON with title, ingredients (array), instructions (string), and tags (array).`;
    
    // Call Gemini 2.0 Flash API directly using axios
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: enhancedPrompt }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Extract text from response
    const text = response.data.candidates[0].content.parts[0].text;
    
    // Parse the JSON from the response
    const recipeJson = extractJsonFromText(text);
    
    // Add the user ID to the recipe
    recipeJson.userId = userId;
    
    // Save to database
    const recipe = new Recipe(recipeJson);
    await recipe.save();
    
    res.json({ success: true, recipe });
  } catch (error) {
    console.error('Error generating recipe:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper function to extract JSON from text
function extractJsonFromText(text) {
  try {
    // Try to parse if the entire text is JSON
    return JSON.parse(text);
  } catch (e) {
    // If text contains JSON with other content, try to extract it
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e2) {
        // If all fails, structure manually
        const titleMatch = text.match(/title["']?\s*:["']?\s*(.*?)["',]/i);
        const ingredientsMatch = text.match(/ingredients["']?\s*:\s*\[([\s\S]*?)\]/i);
        const instructionsMatch = text.match(/instructions["']?\s*:["']?\s*(.*?)["',]/i);
        const tagsMatch = text.match(/tags["']?\s*:\s*\[([\s\S]*?)\]/i);
        
        return {
          title: titleMatch ? titleMatch[1].trim() : 'Unknown Recipe',
          ingredients: ingredientsMatch ? parseArrayText(ingredientsMatch[1]) : [],
          instructions: instructionsMatch ? instructionsMatch[1].trim() : 'No instructions provided',
          tags: tagsMatch ? parseArrayText(tagsMatch[1]) : []
        };
      }
    }
    
    // Return a default structure
    return {
      title: 'Generated Recipe',
      ingredients: ['Ingredient information could not be parsed'],
      instructions: text,
      tags: ['uncategorized']
    };
  }
}

// Helper to parse array text
function parseArrayText(text) {
  return text
    .split(',')
    .map(item => item.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean);
}

// Save user preferences - Protected route
app.post('/api/user/preferences', authMiddleware, async (req, res) => {
  try {
    // Get user ID from token or body
    const userId = req.user ? req.user.userId : req.body.userId;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    const { dietaryRestrictions, allergens, pantryItems } = req.body;
    
    // Upsert the user preferences
    const result = await UserPreference.findOneAndUpdate(
      { userId },
      { 
        userId,
        dietaryRestrictions,
        allergens,
        pantryItems,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );
    
    res.json({ success: true, preferences: result });
  } catch (error) {
    console.error('Error saving user preferences:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user preferences - Protected route
app.get('/api/user/preferences/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify that the authenticated user is requesting their own preferences
    // or is an admin
    if (req.user && req.user.userId !== userId && req.user.userId !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Cannot access preferences for other users'
      });
    }
    
    const preferences = await UserPreference.findOne({ userId });
    
    if (!preferences) {
      return res.status(404).json({ 
        success: false, 
        message: 'User preferences not found',
        preferences: {
          dietaryRestrictions: [],
          allergens: [],
          pantryItems: []
        }
      });
    }
    
    res.json({ success: true, preferences });
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get saved recipes - Protected route
app.get('/api/recipes', authMiddleware, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // If user is authenticated via JWT, get their recipes
    let userId = req.query.userId;
    
    // If querying by user ID, ensure the current user is authorized to see those recipes
    if (userId && req.user && req.user.userId !== userId && req.user.userId !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Cannot access recipes for other users'
      });
    }
    
    // If no specific user ID requested, use the authenticated user's ID
    if (!userId && req.user) {
      userId = req.user.userId;
    }
    
    // Build query
    let query = {};
    if (userId) {
      query.userId = userId;
    }
    
    const recipes = await Recipe.find(query)
      .sort({ generatedAt: -1 })
      .limit(parseInt(limit));
    
    res.json({ success: true, recipes });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Save a recipe - Protected route
app.post('/api/recipes', authMiddleware, async (req, res) => {
  try {
    // Get the user ID from the authentication token if available
    const userId = req.user ? req.user.userId : req.body.userId || 'anonymous';
    
    const { title, ingredients, instructions, tags } = req.body;
    
    if (!title || !instructions || !ingredients) {
      return res.status(400).json({
        success: false,
        message: 'Title, ingredients, and instructions are required'
      });
    }
    
    const recipe = new Recipe({
      title,
      ingredients,
      instructions,
      tags: tags || [],
      userId
    });
    
    await recipe.save();
    
    res.json({ success: true, recipe });
  } catch (error) {
    console.error('Error saving recipe:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoint - Public
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});