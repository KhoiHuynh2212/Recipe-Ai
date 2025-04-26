// server.js - Main entry point for the API
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

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
const GEMINI_API_KEY = process.env.AIzaSyA06ohx0b611CVGP_F9MikAzN3rehHIIrU;
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

// Routes

// Generate a recipe with Gemini AI
app.post('/api/recipes/generate', async (req, res) => {
  try {
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

// Save user preferences
app.post('/api/user/preferences', async (req, res) => {
  try {
    const { userId, dietaryRestrictions, allergens, pantryItems } = req.body;
    
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

// Get user preferences
app.get('/api/user/preferences/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
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

// Get saved recipes
app.get('/api/recipes', async (req, res) => {
  try {
    const { userId, limit = 10 } = req.query;
    
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

// Save a recipe
app.post('/api/recipes', async (req, res) => {
  try {
    const { title, ingredients, instructions, tags, userId } = req.body;
    
    const recipe = new Recipe({
      title,
      ingredients,
      instructions,
      tags,
      userId
    });
    
    await recipe.save();
    
    res.json({ success: true, recipe });
  } catch (error) {
    console.error('Error saving recipe:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});