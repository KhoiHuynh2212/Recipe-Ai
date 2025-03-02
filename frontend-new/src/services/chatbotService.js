// Mock responses for the AI Recipe Chatbot
// In a real application, this would be replaced with API calls to your backend

const sampleRecipes = {
    chicken: [
      {
        id: 1,
        title: "Lemon Garlic Chicken Pasta",
        ingredients: ["chicken breast", "pasta", "lemon", "garlic", "olive oil", "parmesan cheese", "parsley"],
        instructions: "1. Cook pasta according to package. 2. Sauté chicken with garlic. 3. Add lemon juice and cooked pasta. 4. Toss with parmesan and parsley.",
        time: "25 minutes",
        servings: 4,
        image: "https://via.placeholder.com/150"
      },
      {
        id: 2,
        title: "Honey Mustard Chicken",
        ingredients: ["chicken thighs", "honey", "dijon mustard", "soy sauce", "garlic", "olive oil"],
        instructions: "1. Mix honey, mustard, soy sauce, and garlic. 2. Marinate chicken for 30 minutes. 3. Bake at 375°F for 30-35 minutes.",
        time: "45 minutes",
        servings: 4,
        image: "https://via.placeholder.com/150"
      }
    ],
    vegetarian: [
      {
        id: 3,
        title: "Creamy Mushroom Risotto",
        ingredients: ["arborio rice", "mushrooms", "onion", "garlic", "vegetable broth", "white wine", "parmesan cheese", "butter"],
        instructions: "1. Sauté mushrooms, onion, and garlic. 2. Add rice and wine. 3. Gradually add broth while stirring. 4. Finish with butter and parmesan.",
        time: "40 minutes",
        servings: 4,
        image: "https://via.placeholder.com/150"
      },
      {
        id: 4,
        title: "Mediterranean Quinoa Bowl",
        ingredients: ["quinoa", "cucumber", "cherry tomatoes", "red onion", "feta cheese", "olives", "olive oil", "lemon juice"],
        instructions: "1. Cook quinoa according to package. 2. Chop vegetables. 3. Mix everything in a bowl. 4. Dress with olive oil and lemon juice.",
        time: "20 minutes",
        servings: 2,
        image: "https://via.placeholder.com/150"
      }
    ],
    dessert: [
      {
        id: 5,
        title: "Chocolate Chip Cookies",
        ingredients: ["butter", "sugar", "brown sugar", "eggs", "vanilla extract", "flour", "baking soda", "salt", "chocolate chips"],
        instructions: "1. Cream butter and sugars. 2. Add eggs and vanilla. 3. Mix in dry ingredients. 4. Fold in chocolate chips. 5. Bake at 350°F for 10-12 minutes.",
        time: "30 minutes",
        servings: 24,
        image: "https://via.placeholder.com/150"
      }
    ],
    breakfast: [
      {
        id: 6,
        title: "Avocado Toast with Poached Eggs",
        ingredients: ["bread", "avocado", "eggs", "salt", "pepper", "red pepper flakes", "lemon juice"],
        instructions: "1. Toast bread. 2. Mash avocado with lemon juice and spread on toast. 3. Poach eggs for 3 minutes. 4. Top toast with eggs and seasonings.",
        time: "15 minutes",
        servings: 2,
        image: "https://via.placeholder.com/150"
      }
    ]
  };
  
  // Helper function to determine which recipes to return based on user input
  const getMatchingRecipes = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('chicken')) {
      return sampleRecipes.chicken;
    } else if (lowerText.includes('vegetarian') || lowerText.includes('veggie')) {
      return sampleRecipes.vegetarian;
    } else if (lowerText.includes('dessert') || lowerText.includes('cookie') || lowerText.includes('chocolate')) {
      return sampleRecipes.dessert;
    } else if (lowerText.includes('breakfast')) {
      return sampleRecipes.breakfast;
    } else {
      // Return a random category if no match
      const categories = Object.keys(sampleRecipes);
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      return sampleRecipes[randomCategory];
    }
  };
  
  // Generate a response based on user input
  export const getRecipeResponse = async (userMessage) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lowerMessage = userMessage.toLowerCase();
    
    // Generate appropriate response based on user query
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return {
        text: "Hello! I'm your recipe assistant. What would you like to cook today?",
        suggestions: ["Show me quick dinner ideas", "What can I cook with vegetables?"]
      };
    } else if (lowerMessage.includes('thank')) {
      return {
        text: "You're welcome! Let me know if you need any more recipe ideas.",
        suggestions: ["I need another recipe", "How do I cook pasta?"]
      };
    } else if (lowerMessage.includes('help')) {
      return {
        text: "I can help you find recipes based on ingredients, dietary preferences, or meal types. Just tell me what you're looking for!",
        suggestions: ["Recipes with chicken", "Quick vegetarian meals", "Dessert ideas"]
      };
    } else {
      // Get matching recipes
      const recipes = getMatchingRecipes(userMessage);
      
      // Generate response text based on the recipes
      let responseText = "";
      if (recipes.length > 0) {
        responseText = `Here are some recipes that might interest you! Would you like me to explain any of these in more detail?`;
      } else {
        responseText = "I couldn't find any recipes matching your request. Try asking for something specific like 'chicken recipes' or 'vegetarian meals'.";
      }
      
      // Generate follow-up suggestions
      const suggestions = [
        "Show me more recipes like these",
        "What ingredients do I need?",
        "Are there vegetarian alternatives?",
        "I want something quicker to prepare"
      ];
      
      return {
        text: responseText,
        recipes: recipes,
        suggestions: suggestions
      };
    }
  };