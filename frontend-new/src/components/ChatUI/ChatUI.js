// src/components/ChatUI/ChatUI.js
import React, { useState, useEffect } from 'react';
import './ChatUI.css';
import MessageList from './MessageList';
import InputArea from './InputArea';
import WelcomeMessage from './WelcomeMessage';
import RestrictedMealSettings from './RestrictedMealSettings';
import IngredientManagement from './IngredientManagement';
import './RestrictedMealSettings.css';
import './IngredientManagement.css';
import { useChat } from '../../contexts/ChatContext';

const ChatUI = () => {
  const { messages, isTyping, sendMessage, clearChat } = useChat();
  const [pantryIngredients, setPantryIngredients] = useState([]);
  
  // Load pantry ingredients when component mounts
  useEffect(() => {
    loadPantryIngredients();
  }, []);
  
  // Load pantry ingredients from localStorage
  const loadPantryIngredients = () => {
    try {
      const storedIngredients = localStorage.getItem('pantryIngredients');
      if (storedIngredients) {
        const ingredientsData = JSON.parse(storedIngredients);
        // Convert object to array of names for easier use
        const ingredientNames = Object.keys(ingredientsData);
        setPantryIngredients(ingredientNames);
      }
    } catch (error) {
      console.error('Error loading pantry ingredients:', error);
    }
  };
  
  // Handler for messages from the settings components
  const handleSettingsMessage = (message) => {
    // When a settings message is received, reload pantry ingredients
    loadPantryIngredients();
    
    // Send a bot message to acknowledge the settings change
    if (typeof sendMessage === 'function') {
      // If sendMessage can handle bot messages
      sendMessage(message, false, true);
    } else {
      console.log('Bot message:', message);
    }
  };
  
  return (
    <div className="chat-ui">
      <div className="chat-ui-header">
        <h2>Recipe Assistant</h2>
        <button className="clear-chat-btn" onClick={clearChat}>
          New Chat
        </button>
      </div>
      
      <div className="chat-ui-body">
        {messages.length === 1 && messages[0].isWelcome && (
          <>
            <WelcomeMessage onSuggestionClick={(suggestion) => sendMessage(suggestion, true)} />
            
            {/* Settings buttons container */}
            <div className="settings-buttons-container">
              <RestrictedMealSettings onSendMessage={handleSettingsMessage} />
              <IngredientManagement onSendMessage={handleSettingsMessage} />
            </div>
          </>
        )}
        
        <MessageList messages={messages} isTyping={isTyping} />
      </div>
      
      <div className="chat-ui-footer">
        <InputArea onSendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default ChatUI;