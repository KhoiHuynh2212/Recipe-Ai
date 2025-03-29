import React, { useState, useEffect } from 'react';

const WelcomeMessage = ({ onSuggestionClick }) => {
  const [hasPantryItems, setHasPantryItems] = useState(false);
  
  useEffect(() => {
    // Check if there are any pantry items
    const storedIngredients = localStorage.getItem('pantryIngredients');
    if (storedIngredients) {
      const ingredientsData = JSON.parse(storedIngredients);
      setHasPantryItems(Object.keys(ingredientsData).length > 0);
    }
  }, []);
  
  // Base suggestions
  const baseSuggestions = [
    "What can I cook with chicken and pasta?",
    "Find me a quick vegetarian dinner",
    "Suggest a healthy breakfast",
    "How do I make chocolate chip cookies?"
  ];
  
  // Add a pantry-specific suggestion if pantry has items
  const suggestions = hasPantryItems 
    ? [...baseSuggestions.slice(0, 3), "What can I make with ingredients in my pantry?"] 
    : baseSuggestions;
  
  return (
    <div className="welcome-container">
      <h1 className="welcome-title">How can I help you today?</h1>
  
      <div className="welcome-suggestions">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="welcome-suggestion-btn"
            onClick={() => onSuggestionClick(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeMessage;