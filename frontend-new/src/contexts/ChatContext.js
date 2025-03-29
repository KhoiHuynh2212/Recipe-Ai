// src/contexts/ChatContext.js - Enhanced with allergen detection
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Assuming you have uuid installed

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'bot',
          text: 'Welcome to Recipe Assistant! How can I help you today?',
          timestamp: Date.now(),
          isWelcome: true
        }
      ]);
    }
  }, [messages.length]);
  
  // Function to check message against restricted ingredients and allergens
  const checkForRestrictions = (message) => {
    // Load dietary restrictions and allergens from localStorage
    let dietaryRestrictions = [];
    let allergens = [];
    
    try {
      const savedRestrictions = localStorage.getItem('dietaryRestrictions');
      if (savedRestrictions) {
        dietaryRestrictions = JSON.parse(savedRestrictions);
      }
      
      const savedAllergens = localStorage.getItem('allergens');
      if (savedAllergens) {
        allergens = JSON.parse(savedAllergens);
      }
    } catch (error) {
      console.error('Error loading restrictions:', error);
      return { hasRestrictions: false, hasAllergens: false, restrictions: [], allergens: [] };
    }
    
    // If no restrictions or allergens, return early
    if (dietaryRestrictions.length === 0 && allergens.length === 0) {
      return { hasRestrictions: false, hasAllergens: false, restrictions: [], allergens: [] };
    }
    
    const lowercaseMessage = message.toLowerCase();
    
    // Check for allergens first (higher priority)
    const foundAllergens = allergens.filter(allergen => {
      const regex = new RegExp(`\\b${allergen.toLowerCase()}\\b`, 'i');
      return regex.test(lowercaseMessage);
    });
    
    // Check message for dietary restrictions
    const foundRestrictions = dietaryRestrictions.filter(restriction => {
      // For diet types, check for specific ingredients that would violate the diet
      switch (restriction.toLowerCase()) {
        case 'vegetarian':
          return /\b(meat|beef|chicken|pork|lamb|turkey|duck|bacon|sausage)\b/i.test(message);
        case 'vegan':
          return /\b(meat|beef|chicken|pork|lamb|turkey|duck|bacon|sausage|egg|milk|cheese|butter|cream|yogurt|honey)\b/i.test(message);
        case 'gluten-free':
          return /\b(wheat|barley|rye|flour|bread|pasta|noodles|cereal|cracker)\b/i.test(message);
        case 'dairy-free':
          return /\b(milk|cheese|butter|cream|yogurt|ice cream)\b/i.test(message);
        case 'nut-free':
          return /\b(nut|almond|walnut|pecan|cashew|pistachio|hazelnut)\b/i.test(message);
        case 'keto':
          return /\b(sugar|pasta|rice|potato|bread|cereal|corn|bean)\b/i.test(message);
        case 'paleo':
          return /\b(grain|wheat|oat|rice|corn|bean|legume|peanut|dairy|sugar)\b/i.test(message);
        case 'low-carb':
          return /\b(sugar|pasta|rice|potato|bread|cereal)\b/i.test(message);
        default:
          return false;
      }
    });
    
    return {
      hasRestrictions: foundRestrictions.length > 0,
      hasAllergens: foundAllergens.length > 0,
      restrictions: foundRestrictions,
      allergens: foundAllergens
    };
  };
  
  const sendMessage = (text, isQuickReply = false, isBot = false) => {
    // Add user message
    if (!isBot) {
      const userMessage = {
        id: uuidv4(),
        sender: 'user',
        text,
        timestamp: Date.now(),
        isQuickReply
      };
      
      setMessages(prevMessages => [...prevMessages, userMessage]);
      
      // Check if the user's message contains restricted items
      const { hasRestrictions, hasAllergens, restrictions, allergens } = checkForRestrictions(text);
      
      if (hasAllergens) {
        // Create an allergen warning message (higher priority)
        const warningText = `⚠️ ALLERGEN ALERT: Your message mentions allergens you've identified: ${allergens.join(', ')}. 
        I'll avoid suggesting recipes with these ingredients.`;
        
        const warningMessage = {
          id: uuidv4(),
          sender: 'bot',
          text: warningText,
          timestamp: Date.now() + 100, // Slightly after user message
          isWarning: true,
          isAllergenWarning: true
        };
        
        // Add the warning message
        setMessages(prevMessages => [...prevMessages, warningMessage]);
      } else if (hasRestrictions) {
        // Create a dietary restriction warning message
        const warningText = `⚠️ Note: Your message mentions items that don't align with your dietary preferences: ${restrictions.join(', ')}. 
        I'll suggest alternatives that better fit your diet.`;
        
        const warningMessage = {
          id: uuidv4(),
          sender: 'bot',
          text: warningText,
          timestamp: Date.now() + 100, // Slightly after user message
          isWarning: true
        };
        
        // Add the warning message
        setMessages(prevMessages => [...prevMessages, warningMessage]);
      }
      
      // Simulate bot typing
      setIsTyping(true);
      
      // Simulate response delay
      setTimeout(() => {
        generateBotResponse(text);
      }, 1500);
    } else {
      // Directly add bot message
      const botMessage = {
        id: uuidv4(),
        sender: 'bot',
        text,
        timestamp: Date.now()
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
    }
  };
  
  const generateBotResponse = (userMessage) => {
    // Mock bot response generating logic
    let botResponse;
    let suggestions = [];
    
    // Check if the AI response might contain restricted ingredients
    const { hasRestrictions, hasAllergens, restrictions, allergens } = checkForRestrictions(userMessage);
    
    // Handle different types of user queries
    if (userMessage.toLowerCase().includes('recipe') || 
        userMessage.toLowerCase().includes('cook') ||
        userMessage.toLowerCase().includes('make') ||
        userMessage.toLowerCase().includes('food') ||
        userMessage.toLowerCase().includes('meal') ||
        userMessage.toLowerCase().includes('dinner') ||
        userMessage.toLowerCase().includes('lunch') ||
        userMessage.toLowerCase().includes('breakfast')) {
      
      if (hasAllergens) {
        botResponse = `I noticed you mentioned ${allergens.join(', ')}, which you've identified as allergens. 
        I'll make sure to suggest recipes that don't include these ingredients. Would you like me to recommend some safe alternatives?`;
        
        suggestions = [
          "Show me allergen-free recipes",
          "What can I substitute for these ingredients?",
          "Tell me about common hidden sources of these allergens"
        ];
      } else if (hasRestrictions) {
        botResponse = `I see you mentioned ${restrictions.join(', ')}, which don't align with your dietary preferences.
        Let me suggest some recipes that better match your diet.`;
        
        suggestions = [
          "Show me compliant recipes",
          "What are good substitutes?",
          "Tell me more about this diet"
        ];
      } else {
        botResponse = "Here are some recipe suggestions based on your request. Would you like more details on any of these?";
        
        // Add mock recipe data
        const mockRecipes = [
          {
            id: uuidv4(),
            title: "Pasta Primavera",
            image: "https://via.placeholder.com/300x200?text=Pasta+Primavera",
            time: "30 mins",
            servings: 4,
            ingredients: [
              "8 oz pasta",
              "1 cup broccoli florets",
              "1 red bell pepper, sliced",
              "1 yellow squash, sliced",
              "2 tbsp olive oil",
              "2 cloves garlic, minced",
              "1/4 cup grated Parmesan cheese"
            ],
            instructions: "1. Cook pasta according to package directions. 2. Sauté vegetables in olive oil. 3. Add garlic and cook until fragrant. 4. Combine pasta and vegetables. 5. Top with Parmesan cheese."
          }
        ];
        
        // Add suggestions
        suggestions = [
          "How do I make the sauce creamier?",
          "What sides go well with this?",
          "Can I prep this ahead of time?"
        ];
        
        // Create bot response with recipes
        botResponse = {
          id: uuidv4(),
          sender: 'bot',
          text: "Here are some recipes you might enjoy:",
          timestamp: Date.now(),
          recipes: mockRecipes,
          suggestions
        };
      }
    } else if (userMessage.toLowerCase().includes('thanks') || 
               userMessage.toLowerCase().includes('thank you')) {
      botResponse = "You're welcome! Let me know if you need any more recipe ideas or cooking tips.";
    } else {
      botResponse = "I can help you find recipes and answer cooking questions. What kind of recipes are you looking for today?";
      suggestions = [
        "Quick dinner ideas",
        "Healthy breakfast recipes",
        "Desserts without sugar"
      ];
    }
    
    // Add bot response
    if (typeof botResponse === 'string') {
      const botMessage = {
        id: uuidv4(),
        sender: 'bot',
        text: botResponse,
        timestamp: Date.now(),
        suggestions
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } else {
      // If botResponse is already a message object
      setMessages(prevMessages => [...prevMessages, botResponse]);
    }
    
    setIsTyping(false);
  };
  
  const submitFeedback = (messageId, isPositive) => {
    setMessages(prevMessages =>
      prevMessages.map(message =>
        message.id === messageId
          ? { ...message, feedback: isPositive ? 'positive' : 'negative' }
          : message
      )
    );
    
    // In a real app, you would send this feedback to your backend
    console.log(`Feedback submitted for message ${messageId}: ${isPositive ? 'positive' : 'negative'}`);
  };
  
  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: 'Welcome to Recipe Assistant! How can I help you today?',
        timestamp: Date.now(),
        isWelcome: true
      }
    ]);
  };
  
  const contextValue = {
    messages,
    isTyping,
    sendMessage,
    submitFeedback,
    clearChat,
    checkForRestrictions // Expose this function to other components if needed
  };
  
  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;