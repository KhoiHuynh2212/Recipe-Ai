// Chatbot Service for AI integration
import { aiService } from './apiService';

// Sample recipe database for offline development/testing
const sampleRecipes = [
  {
    id: '1',
    title: 'Garlic Butter Pasta',
    ingredients: [
      { name: 'spaghetti', quantity: '8 oz' },
      { name: 'butter', quantity: '4 tbsp' },
      { name: 'garlic', quantity: '4 cloves, minced' },
      { name: 'parmesan cheese', quantity: '1/4 cup, grated' },
      { name: 'parsley', quantity: '2 tbsp, chopped' },
      { name: 'salt', quantity: 'to taste' },
      { name: 'black pepper', quantity: 'to taste' }
    ],
    instructions: 'Cook pasta according to package directions. In a large skillet, melt butter over medium heat. Add garlic and sauté until fragrant, about 1 minute. Drain pasta and add to the skillet. Toss to coat with the garlic butter. Add parmesan cheese and parsley. Season with salt and pepper. Serve immediately.',
    time: '15 minutes',
    servings: 2,
    image: 'https://via.placeholder.com/300x200?text=Garlic+Butter+Pasta'
  },
  {
    id: '2',
    title: 'Vegetable Stir Fry',
    ingredients: [
      { name: 'broccoli', quantity: '1 cup, florets' },
      { name: 'carrot', quantity: '1, sliced' },
      { name: 'bell pepper', quantity: '1, sliced' },
      { name: 'snow peas', quantity: '1 cup' },
      { name: 'tofu', quantity: '8 oz, cubed' },
      { name: 'vegetable oil', quantity: '2 tbsp' },
      { name: 'soy sauce', quantity: '3 tbsp' },
      { name: 'garlic', quantity: '2 cloves, minced' },
      { name: 'ginger', quantity: '1 tsp, grated' },
      { name: 'rice', quantity: '2 cups, cooked' }
    ],
    instructions: 'Heat oil in a wok or large skillet over high heat. Add garlic and ginger, stir for 30 seconds. Add vegetables and stir fry for 3-4 minutes until tender-crisp. Add tofu and soy sauce, cook for 2 more minutes. Serve over rice.',
    time: '20 minutes',
    servings: 2,
    image: 'https://via.placeholder.com/300x200?text=Vegetable+Stir+Fry',
    dietaryRestrictions: ['Vegetarian', 'Vegan', 'Dairy-Free']
  },
  {
    id: '3',
    title: 'Banana Oatmeal Smoothie',
    ingredients: [
      { name: 'banana', quantity: '1, frozen' },
      { name: 'rolled oats', quantity: '1/2 cup' },
      { name: 'milk', quantity: '1 cup' },
      { name: 'honey', quantity: '1 tbsp' },
      { name: 'cinnamon', quantity: '1/4 tsp' },
      { name: 'ice cubes', quantity: '4-5' }
    ],
    instructions: 'Add all ingredients to a blender. Blend until smooth. Pour into a glass and enjoy immediately.',
    time: '5 minutes',
    servings: 1,
    image: 'https://via.placeholder.com/300x200?text=Banana+Oatmeal+Smoothie',
    dietaryRestrictions: ['Vegetarian']
  }
];

// Chat patterns for matching user intents
const chatPatterns = [
  {
    pattern: /\b(make|cook|recipe|recipes|prepare|create)\b/i,
    type: 'recipe_request'
  },
  {
    pattern: /\b(ingredient|ingredients|have|pantry)\b/i,
    type: 'ingredient_based'
  },
  {
    pattern: /\b(vegetarian|vegan|gluten.free|dairy.free|nut.free|keto|paleo|low.carb)\b/i,
    type: 'dietary_restriction'
  },
  {
    pattern: /\b(breakfast|lunch|dinner|dessert|snack|appetizer)\b/i,
    type: 'meal_type'
  }
];

// Local processing function for offline development/testing
const processMessageLocally = (message) => {
  // Check if it's an ingredient-based query
  if (/what can (i|we) (make|cook) with/i.test(message)) {
    // Extract ingredients
    const ingredients = message
      .replace(/what can (i|we) (make|cook) with/i, '')
      .split(/(?:,| and )/)
      .map(ingredient => ingredient.trim().toLowerCase())
      .filter(ingredient => ingredient.length > 0);
    
    if (ingredients.length > 0) {
      // Find recipes that match any of the ingredients
      const matchedRecipes = sampleRecipes.filter(recipe =>
        recipe.ingredients.some(ri => 
          ingredients.some(ingredient => 
            ri.name.toLowerCase().includes(ingredient)
          )
        )
      );
      
      if (matchedRecipes.length > 0) {
        return {
          text: `Here are some recipes you can make with ${ingredients.join(', ')}:`,
          recipes: matchedRecipes
        };
      } else {
        return {
          text: `I couldn't find any recipes with ${ingredients.join(', ')} in my local database. In a real implementation, I would call the AI service here.`,
          suggestions: [
            "What can I make with chicken and pasta?",
            "Find me a vegetarian dinner",
            "Suggest a quick breakfast"
          ]
        };
      }
    }
  }
  
  // Check for dietary restrictions
  const dietaryMatch = message.match(/\b(vegetarian|vegan|gluten.free|dairy.free|nut.free|keto|paleo|low.carb)\b/i);
  if (dietaryMatch) {
    const restriction = dietaryMatch[0].toLowerCase();
    
    // Find recipes that match the restriction
    const matchedRecipes = sampleRecipes.filter(recipe =>
      recipe.dietaryRestrictions && 
      recipe.dietaryRestrictions.some(r => 
        r.toLowerCase() === restriction
      )
    );
    
    if (matchedRecipes.length > 0) {
      return {
        text: `Here are some ${restriction} recipes:`,
        recipes: matchedRecipes
      };
    } else {
      return {
        text: `I couldn't find any ${restriction} recipes in my local database. In a real implementation, I would call the AI service here.`,
        suggestions: [
          `Show me easy ${restriction} recipes`,
          `${restriction} breakfast ideas`,
          "What other dietary options do you support?"
        ]
      };
    }
  }
  
  // Default response
  return {
    text: "I'm not sure how to help with that. You can ask me for recipe suggestions or tell me what ingredients you have, and I'll try to help you find something delicious to make!",
    suggestions: [
      "What can I make with chicken and pasta?",
      "Find me a vegetarian dinner",
      "Suggest a healthy breakfast",
      "How do I make chocolate chip cookies?"
    ]
  };
};

// Main function to process user messages
const processMessage = async (message, chatHistory = []) => {
  try {
    // Check if we're in development mode without API
    const isOfflineMode = !process.env.REACT_APP_API_URL;
    
    if (isOfflineMode) {
      // Process message locally
      return processMessageLocally(message);
    }
    
    // Process message using AI service
    const response = await aiService.chatWithAssistant(message, chatHistory);
    
    // Parse AI response
    let result = {
      text: response.message,
      timestamp: response.timestamp
    };
    
    // Check if response contains recipe data
    if (response.data && response.data.recipes) {
      result.recipes = response.data.recipes;
    }
    
    // Check if response contains suggestions
    if (response.data && response.data.suggestions) {
      result.suggestions = response.data.suggestions;
    }
    
    return result;
  } catch (error) {
    console.error('Error processing message:', error);
    return {
      text: "I'm sorry, but I'm having trouble processing your request right now. Please try again in a moment.",
      isError: true
    };
  }
};

export default {
  processMessage
};