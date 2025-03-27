// src/components/ChatUI/ChatUI.js - Modified with RestrictedMealSettings
import React from 'react';
import './ChatUI.css';
import MessageList from './MessageList';
import InputArea from './InputArea';
import WelcomeMessage from './WelcomeMessage';
import RestrictedMealSettings from './RestrictedMealSettings'; // Import the new component
import './RestrictedMealSettings.css'; // Import styles
import { useChat } from '../../contexts/ChatContext';

const ChatUI = () => {
  const { messages, isTyping, sendMessage, clearChat } = useChat();
  
  // Handler for messages from the restricted meal settings
  const handleSettingsMessage = (message) => {
    // Send a bot message to acknowledge the settings change
    const botMessage = {
      id: Date.now().toString(),
      sender: 'bot',
      text: message,
      timestamp: Date.now()
    };
    
    // Add this message to the chat
    // Note: You may need to adjust this based on how your ChatContext is implemented
    // If sendMessage doesn't support adding bot messages directly, you might need to
    // modify your ChatContext to add this functionality
    if (typeof sendMessage === 'function') {
      // If sendMessage can handle bot messages (ideal case)
      sendMessage(message, false, true); // Assuming the third parameter indicates a bot message
    } else {
      // Alternative: you could add a function to your ChatContext to handle this
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
            
            {/* Add the RestrictedMealSettings component */}
            <RestrictedMealSettings onSendMessage={handleSettingsMessage} />
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