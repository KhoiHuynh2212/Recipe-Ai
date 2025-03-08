import React from 'react';
import './ChatUI.css';
import MessageList from './MessageList';
import InputArea from './InputArea';
import WelcomeMessage from './WelcomeMessage';
import { useChat } from '../../contexts/ChatContext';

const ChatUI = () => {
  const { messages, isTyping, sendMessage, clearChat } = useChat();
  
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
          <WelcomeMessage onSuggestionClick={(suggestion) => sendMessage(suggestion, true)} />
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