// AI Controller
const Recipe = require('../models/Recipe');
const axios = require('axios');

// Configuration for AI service
const AI_API_URL = process.env.AI_API_URL || 'https://api.openai.com/v1/completions';
const AI_API_KEY = process.env.AI_API_KEY;

// Helper function to call AI API
async function callAIApi(prompt) {
  try {
    // For testing purposes, you can use OpenAI API or any other AI API
    const response = await axios.post(
      AI_API_URL,
      {
        model: 'gpt-3.5-turbo-instruct',
        prompt,
        max_tokens: 500,
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_API_KEY}`
        }
      }
    );
    
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error calling AI API:', error);
    throw new Error('Failed to get AI recommendation');
  }
}

// Get recipe recommendations based on ingredients
exports.getRecommendations = async (req, res) => {
  try {
    const { ingredients } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid array of ingredients'
      });
    }
    
    // Check if we should use the AI API or search the database
    if (ingredients.length <= 3) {
      // For simple ingredient lists, search the database
      const recipes = await Recipe.find({
        'ingredients.name': { $in: ingredients }
      }).limit(5);
      
      if (recipes.length > 0) {
        return res.status(200).json({
          success: true,
          source: 'database',
          count: recipes.length,
          data: recipes
        });
      }
    }
    
    // For more complex requests or if no recipes found in database, use AI
    const ingredientsList = ingredients.join(', ');
    const prompt = `Suggest 3 recipes that can be made with these ingredients: ${ingredientsList}. For each recipe, provide a title, list of ingredients, cooking time, servings, and brief instructions. Format the response as a JSON array.`;
    
    const aiResponse = await callAIApi(prompt);
    
    // Parse the AI response
    let aiRecipes;
    try {
      aiRecipes = JSON.parse(aiResponse);
    } catch (error) {
      // If AI response is not valid JSON, use a basic format
      aiRecipes = [{
        title: 'AI Recommendation',
        content: aiResponse,
        ingredients: ingredients.map(name => ({ name, quantity: 'As needed' })),
        time: '30 minutes',
        servings: 4
      }];
    }
    
    res.status(200).json({
      success: true,
      source: 'ai',
      count: aiRecipes.length,
      data: aiRecipes
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Get recipe recommendations based on user preferences and dietary restrictions
exports.getRecommendationsByPreferences = async (req, res) => {
  try {
    const { preferences, restrictions, goal } = req.body;
    
    // Create a detailed prompt for the AI
    let prompt = 'Suggest 3 recipes that';
    
    if (restrictions && restrictions.length > 0) {
      prompt += ` are suitable for ${restrictions.join(', ')} diets`;
    }
    
    if (preferences && preferences.length > 0) {
      if (restrictions && restrictions.length > 0) {
        prompt += ' and';
      }
      prompt += ` include ${preferences.join(', ')}`;
    }
    
    if (goal) {
      prompt += ` and are good for ${goal}`;
    }
    
    prompt += '. For each recipe, provide a title, list of ingredients, cooking time, servings, and brief instructions. Format the response as a JSON array.';
    
    const aiResponse = await callAIApi(prompt);
    
    // Parse the AI response
    let aiRecipes;
    try {
      aiRecipes = JSON.parse(aiResponse);
    } catch (error) {
      // If AI response is not valid JSON, use a basic format
      aiRecipes = [{
        title: 'AI Recommendation',
        content: aiResponse,
        dietaryRestrictions: restrictions || [],
        time: '30 minutes',
        servings: 4
      }];
    }
    
    res.status(200).json({
      success: true,
      source: 'ai',
      count: aiRecipes.length,
      data: aiRecipes
    });
  } catch (error) {
    console.error('Error getting preference-based recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Generate a recipe based on provided ingredients
exports.generateRecipe = async (req, res) => {
  try {
    const { ingredients, preferences, restrictions } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid array of ingredients'
      });
    }
    
    const ingredientsList = ingredients.join(', ');
    let prompt = `Create a recipe using these ingredients: ${ingredientsList}`;
    
    if (restrictions && restrictions.length > 0) {
      prompt += ` that is suitable for ${restrictions.join(', ')} diets`;
    }
    
    if (preferences && preferences.length > 0) {
      prompt += ` and considers these preferences: ${preferences.join(', ')}`;
    }
    
    prompt += '. Provide a title, list of ingredients with quantities, cooking time, servings, and detailed instructions. Format the response as JSON.';
    
    const aiResponse = await callAIApi(prompt);
    
    // Parse the AI response
    let recipe;
    try {
      recipe = JSON.parse(aiResponse);
    } catch (error) {
      // If AI response is not valid JSON, use a basic format
      recipe = {
        title: 'Custom Recipe',
        content: aiResponse,
        ingredients: ingredients.map(name => ({ name, quantity: 'As needed' })),
        dietaryRestrictions: restrictions || [],
        time: '30 minutes',
        servings: 4
      };
    }
    
    res.status(200).json({
      success: true,
      data: recipe
    });
  } catch (error) {
    console.error('Error generating recipe:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Chat with the recipe assistant
exports.chatWithAssistant = async (req, res) => {
  try {
    const { message, chatHistory } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a message'
      });
    }
    
    // Create a context from chat history
    let context = '';
    if (chatHistory && chatHistory.length > 0) {
      context = 'Previous conversation:\n';
      chatHistory.forEach(chat => {
        context += `${chat.role === 'user' ? 'User' : 'Assistant'}: ${chat.content}\n`;
      });
      context += '\n';
    }
    
    const prompt = `${context}User: ${message}\n\nYou are a helpful cooking assistant. Provide a helpful, friendly response to the user's message about cooking, recipes, or food. If they ask for a recipe, include ingredients and instructions.`;
    
    const aiResponse = await callAIApi(prompt);
    
    res.status(200).json({
      success: true,
      message: aiResponse,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error chatting with assistant:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Get nutritional analysis for a recipe
exports.analyzeNutrition = async (req, res) => {
  try {
    const { ingredients, servings } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid array of ingredients'
      });
    }
    
    const ingredientsList = ingredients.map(ing => 
      typeof ing === 'string' ? ing : `${ing.quantity || ''} ${ing.name}`
    ).join(', ');
    
    const prompt = `Analyze the nutritional content of a recipe with these ingredients: ${ingredientsList}, for ${servings || 4} servings. Provide a breakdown of calories, protein, carbs, fat, fiber, and main vitamins and minerals. Format the response as JSON.`;
    
    const aiResponse = await callAIApi(prompt);
    
    // Parse the AI response
    let nutrition;
    try {
      nutrition = JSON.parse(aiResponse);
    } catch (error) {
      // If AI response is not valid JSON, use a basic format
      nutrition = {
        calories: 'Estimated from ingredients',
        protein: 'Estimated from ingredients',
        carbs: 'Estimated from ingredients',
        fat: 'Estimated from ingredients',
        details: aiResponse
      };
    }
    
    res.status(200).json({
      success: true,
      data: nutrition
    });
  } catch (error) {
    console.error('Error analyzing nutrition:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};