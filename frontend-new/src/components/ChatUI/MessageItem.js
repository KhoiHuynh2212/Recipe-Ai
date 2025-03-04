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
  
  const renderRecipeCards = () => {
    if (!message.recipes || message.recipes.length === 0) return null;
    
    return (
      <div className="recipe-cards">
        {message.recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <img 
              src={recipe.image} 
              alt={recipe.title} 
              className="recipe-image" 
            />
            <div className="recipe-details">
              <div className="recipe-header">
                <h3 className="recipe-title">{recipe.title}</h3>
                <SaveButton recipe={recipe} /> {/* Add the SaveButton here */}
              </div>
              <div className="recipe-info">
                <span>⏱️ {recipe.time}</span>
                <span>👥 Serves {recipe.servings}</span>
              </div>
              
              {expanded && (
                <>
                  <div className="recipe-ingredients">
                    <h4>Ingredients</h4>
                    <ul>
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
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
        ))}
      </div>
    );
  };
  
  return (
    <div className={`message-item ${message.sender}`}>
      <div 
        className="message-avatar"
        style={{ 
          backgroundColor: message.sender === 'bot' ? '#c41ef5' : '#10ece8' 
        }}
      >
        {message.sender === 'bot' ? '🤖' : '👤'}
      </div>
      
      <div className="message-bubble">
        <div className="message-content">
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
        
        {message.sender === 'bot' && !message.isWelcome && (
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