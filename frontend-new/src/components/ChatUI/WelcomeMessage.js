import React from 'react';

const WelcomeMessage = ({ onSuggestionClick }) => {
  const suggestions = [
    "What can I cook with chicken and pasta?",
    "Find me a quick vegetarian dinner",
    "Suggest a healthy breakfast",
    "How do I make chocolate chip cookies?"
  ];
  
  return (
    <div className="welcome-container">
      <h1 className="welcome-title">AI Recipe Chef</h1>
      <p className="welcome-subtitle">
        Your personal AI assistant for delicious meal ideas and cooking instructions
      </p>
      
      <div className="welcome-info">
        <p>Ask me anything about recipes, ingredients, or cooking techniques!</p>
        <p>I can help you find recipes based on:</p>
        <ul>
          <li>Ingredients you have available</li>
          <li>Dietary restrictions or preferences</li>
          <li>Time constraints</li>
          <li>Meal types (breakfast, lunch, dinner, snack)</li>
        </ul>
      </div>
      
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