import React from 'react';

const SuggestedReplies = ({ suggestions, onSuggestionClick }) => {
  if (!suggestions || suggestions.length === 0) return null;
  
  return (
    <div className="suggested-replies">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          className="suggested-reply"
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default SuggestedReplies;