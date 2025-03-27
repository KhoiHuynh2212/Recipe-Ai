import React, { useState } from 'react';
import './ChatUI.css';
import MessageList from './MessageList';
import InputArea from './InputArea';
import WelcomeMessage from './WelcomeMessage';
import RestrictedMealSettings from './RestrictedMealSettings';
import './RestrictedMealSettings.css';
import { useChat } from '../../contexts/ChatContext';

const ChatUI = ({ onShowMealPlanner }) => {
  const { messages, isTyping, sendMessage, clearChat } = useChat();
  
  // New state for dietary restrictions
  const [dietRestriction, setDietRestriction] = useState('');

  // Handle the dietary restriction selection
  const handleDietChange = (event) => {
    setDietRestriction(event.target.value);

    // Send a bot message based on the selected restriction
    const message = `The selected meal is: ${event.target.value}`;
    sendMessage(message, false, true);  // Assuming `sendMessage` sends the message to the bot
  };

  // Handler for messages from the restricted meal settings
  const handleSettingsMessage = (message) => {
    // Send a bot message to acknowledge the settings change
    if (typeof sendMessage === 'function') {
      sendMessage(message, false, true);  // Assuming the third parameter indicates a bot message
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
            <WelcomeMessage 
              onSuggestionClick={(suggestion) => sendMessage(suggestion, true)} 
              onMealPlannerClick={onShowMealPlanner}
            />
            
            <RestrictedMealSettings onSendMessage={handleSettingsMessage} />
            
            {/* Dietary Restriction Dropdown */}
            <div className="diet-restriction-container">
              <label htmlFor="diet-restriction">Select Dietary Restriction:</label>
              <select
                id="diet-restriction"
                value={dietRestriction}
                onChange={handleDietChange}
                className="diet-restriction-dropdown"
              >
                <option value="">None</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
              </select>
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
