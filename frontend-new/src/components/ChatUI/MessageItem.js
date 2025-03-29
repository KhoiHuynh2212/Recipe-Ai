import React, { useState } from 'react';
import SuggestedReplies from './SuggestedReplies';
import FeedbackButtons from './FeedbackButtons';
import { useChat } from '../../contexts/ChatContext';
import SaveButton from './SaveButton';

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const MessageItem = ({ message }) => {
  const [expanded, setExpanded] = useState(false);
  const { sendMessage, submitFeedback } = useChat();
  
  const handleQuickReplyClick = (reply) => {
    sendMessage(reply, true);
  };
  
  // Check if the message is a warning
  const isWarning = message.isWarning || message.text.includes('⚠️ Warning');
  
  const renderRecipeCards = () => {
    if (!message.recipes || message.recipes.length === 0) return null;
    
    // Check if any recipes contain restricted ingredients
    const checkRecipeForRestrictions = (recipe) => {
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
        return { hasRestrictions: false, restrictions: [] };
      }
      
      if (dietaryRestrictions.length === 0 && allergens.length === 0) {
        return { hasRestrictions: false, restrictions: [] };
      }
      
      // Ingredients as a single string for easier searching
      const ingredientsText = recipe.ingredients.join(' ').toLowerCase();
      
      // Check for dietary restrictions
      const foundRestrictions = dietaryRestrictions.filter(restriction => {
        switch (restriction.toLowerCase()) {
          case 'vegetarian':
            return /\b(meat|beef|chicken|pork|lamb|turkey|duck|bacon|sausage)\b/i.test(ingredientsText);
          case 'vegan':
            return /\b(meat|beef|chicken|pork|lamb|turkey|duck|bacon|sausage|egg|milk|cheese|butter|cream|yogurt|honey)\b/i.test(ingredientsText);
          case 'gluten-free':
            return /\b(wheat|barley|rye|flour|bread|pasta|noodles|cereal|cracker)\b/i.test(ingredientsText);
          case 'dairy-free':
            return /\b(milk|cheese|butter|cream|yogurt|ice cream)\b/i.test(ingredientsText);
          case 'nut-free':
            return /\b(nut|almond|walnut|pecan|cashew|pistachio|hazelnut)\b/i.test(ingredientsText);
          case 'keto':
            return /\b(sugar|pasta|rice|potato|bread|cereal|corn|bean)\b/i.test(ingredientsText);
          case 'paleo':
            return /\b(grain|wheat|oat|rice|corn|bean|legume|peanut|dairy|sugar)\b/i.test(ingredientsText);
          case 'low-carb':
            return /\b(sugar|pasta|rice|potato|bread|cereal)\b/i.test(ingredientsText);
          default:
            return false;
        }
      });
      
      // Check for allergens
      const foundAllergens = allergens.filter(allergen => {
        const regex = new RegExp(`\\b${allergen.toLowerCase()}\\b`, 'i');
        return regex.test(ingredientsText);
      });
      
      // Combine results
      const allRestrictions = [...foundRestrictions, ...foundAllergens];
      
      return {
        hasRestrictions: allRestrictions.length > 0,
        restrictions: allRestrictions
      };
    };
    
    return (
      <div className="recipe-cards">
        {message.recipes.map((recipe) => {
          const { hasRestrictions, restrictions } = checkRecipeForRestrictions(recipe);
          
          return (
            <div key={recipe.id} className={`recipe-card ${hasRestrictions ? 'has-warning' : ''}`}>
              <img 
                src={recipe.image} 
                alt={recipe.title} 
                className="recipe-image" 
              />
              <div className="recipe-details">
                <div className="recipe-header">
                  <h3 className="recipe-title">
                    {recipe.title}
                    {hasRestrictions && <span className="warning-badge">⚠️</span>}
                  </h3>
                  <SaveButton recipe={recipe} />
                </div>
                <div className="recipe-info">
                  <span>⏱️ {recipe.time}</span>
                  <span>👥 Serves {recipe.servings}</span>
                </div>
                
                {hasRestrictions && (
                  <div className="recipe-warning">
                    <span className="recipe-warning-icon">⚠️</span>
                    <span>
                      This recipe contains ingredients that conflict with your dietary preferences: 
                      <strong> {restrictions.join(', ')}</strong>
                    </span>
                  </div>
                )}
                
                {expanded && (
                  <>
                    <div className="recipe-ingredients">
                      <h4>Ingredients</h4>
                      <ul>
                        {recipe.ingredients.map((ingredient, index) => {
                          // Check if this specific ingredient is restricted
                          const isRestricted = restrictions?.some(r => 
                            ingredient.toLowerCase().includes(r.toLowerCase())
                          );
                          
                          return (
                            <li 
                              key={index} 
                              className={isRestricted ? 'restricted-ingredient' : ''}
                            >
                              {ingredient}
                              {isRestricted && <span className="warning-badge">⚠️</span>}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    
                    <div className="recipe-instructions">
                      <h4>Instructions</h4>
                      <p>{recipe.instructions}</p>
                    </div>
                  </>
                )}
                
                <button 
                  className="expand-btn" 
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? 'Show Less' : 'Show More'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className={`message-item ${message.sender} ${isWarning ? 'warning' : ''}`}>
      <div 
        className="message-avatar"
        style={{ 
          backgroundColor: message.sender === 'bot' ? '#c41ef5' : '#10ece8' 
        }}
      >
        {message.sender === 'bot' ? (isWarning ? '⚠️' : '🤖') : '👤'}
      </div>
      
      <div className="message-bubble">
        <div className={`message-content ${isWarning ? 'warning-message' : ''}`}>
          <div className="message-text">{message.text}</div>
          <div className="message-time">{formatTime(message.timestamp)}</div>
        </div>
        
        {renderRecipeCards()}
        
        {message.sender === 'bot' && message.suggestions && (
          <SuggestedReplies 
            suggestions={message.suggestions} 
            onSuggestionClick={handleQuickReplyClick} 
          />
        )}
        
        {message.sender === 'bot' && !message.isWelcome && !isWarning && (
          <FeedbackButtons 
            messageId={message.id} 
            feedback={message.feedback}
            onFeedback={submitFeedback} 
          />
        )}
      </div>
    </div>
  );
};

export default MessageItem;