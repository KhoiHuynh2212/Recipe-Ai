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
      <h1 className="welcome-title">How can I help you today ?</h1>
  
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