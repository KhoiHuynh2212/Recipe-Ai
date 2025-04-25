// API Service for connecting to the backend
import axios from 'axios';

// API base URL - points to the backend server
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercept requests to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Recipe API services
const recipeService = {
  // Get all recipes with pagination
  getRecipes: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/recipes?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }
  },
  
  // Get recipe by ID
  getRecipeById: async (id) => {
    try {
      const response = await api.get(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching recipe with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Search recipes by ingredients
  searchByIngredients: async (ingredients) => {
    try {
      const ingredientsStr = Array.isArray(ingredients) 
        ? ingredients.join(',') 
        : ingredients;
      
      const response = await api.get(`/recipes/search/ingredients?ingredients=${ingredientsStr}`);
      return response.data;
    } catch (error) {
      console.error('Error searching recipes by ingredients:', error);
      throw error;
    }
  },
  
  // Filter recipes by dietary restrictions
  filterByDiet: async (restrictions) => {
    try {
      const restrictionsStr = Array.isArray(restrictions) 
        ? restrictions.join(',') 
        : restrictions;
      
      const response = await api.get(`/recipes/filter/diet?restrictions=${restrictionsStr}`);
      return response.data;
    } catch (error) {
      console.error('Error filtering recipes by diet:', error);
      throw error;
    }
  },
  
  // Create a new recipe
  createRecipe: async (recipeData) => {
    try {
      const response = await api.post('/recipes', recipeData);
      return response.data;
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw error;
    }
  }
};

// AI API services
const aiService = {
  // Get recipe recommendations based on ingredients
  getRecommendations: async (ingredients) => {
    try {
      const response = await api.post('/ai/recommend', { ingredients });
      return response.data;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  },
  
  // Get recipe recommendations based on user preferences
  getRecommendationsByPreferences: async (preferences, restrictions, goal) => {
    try {
      const response = await api.post('/ai/recommend/preferences', {
        preferences,
        restrictions,
        goal
      });
      return response.data;
    } catch (error) {
      console.error('Error getting recommendations by preferences:', error);
      throw error;
    }
  },
  
  // Generate a recipe based on provided ingredients
  generateRecipe: async (ingredients, preferences, restrictions) => {
    try {
      const response = await api.post('/ai/generate', {
        ingredients,
        preferences,
        restrictions
      });
      return response.data;
    } catch (error) {
      console.error('Error generating recipe:', error);
      throw error;
    }
  },
  
  // Chat with the recipe assistant
  chatWithAssistant: async (message, chatHistory) => {
    try {
      const response = await api.post('/ai/chat', {
        message,
        chatHistory
      });
      return response.data;
    } catch (error) {
      console.error('Error chatting with assistant:', error);
      throw error;
    }
  },
  
  // Get nutritional analysis for a recipe
  analyzeNutrition: async (ingredients, servings) => {
    try {
      const response = await api.post('/ai/nutrition', {
        ingredients,
        servings
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing nutrition:', error);
      throw error;
    }
  }
};

// User API services
const userService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/users/register', userData);
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },
  
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/users/login', { email, password });
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  },
  
  // Logout user
  logout: () => {
    localStorage.removeItem('token');
  },
  
  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },
  
  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
  
  // Get user's saved recipes
  getSavedRecipes: async () => {
    try {
      const response = await api.get('/users/recipes');
      return response.data;
    } catch (error) {
      console.error('Error getting saved recipes:', error);
      throw error;
    }
  },
  
  // Save a recipe to user's collection
  saveRecipe: async (recipeId) => {
    try {
      const response = await api.post(`/users/recipes/${recipeId}`);
      return response.data;
    } catch (error) {
      console.error('Error saving recipe:', error);
      throw error;
    }
  },
  
  // Remove a recipe from user's collection
  removeRecipe: async (recipeId) => {
    try {
      const response = await api.delete(`/users/recipes/${recipeId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing recipe:', error);
      throw error;
    }
  },
  
  // Update user's dietary preferences
  updatePreferences: async (preferences) => {
    try {
      const response = await api.put('/users/preferences', preferences);
      return response.data;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  }
};

export { recipeService, aiService, userService };