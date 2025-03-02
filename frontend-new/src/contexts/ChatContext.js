import React, { createContext, useState, useContext, useEffect } from 'react';
import { getRecipeResponse } from '../services/chatbotService';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      text: "👋 Hi there! I'm ChefBot, your AI recipe assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      isWelcome: true,
      suggestions: [
        "What can I cook with chicken and pasta?",
        "Find me a quick vegetarian dinner",
        "Suggest a healthy breakfast",
        "How do I make chocolate chip cookies?"
      ]
    };
    
    setMessages([welcomeMessage]);
  }, []);

  // Save messages to local storage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  // Load message history on initial load
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      setChatHistory(JSON.parse(savedMessages));
    }
  }, []);

  const sendMessage = async (text, isQuickReply = false) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date(),
      isQuickReply
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Get bot response
      const response = await getRecipeResponse(text);
      
      // Add bot response
      const botMessage = {
        id: Date.now() + 1,
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        recipes: response.recipes || [],
        suggestions: response.suggestions || []
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 700); // Slight delay for realism
      
    } catch (error) {
      console.error('Error getting response:', error);
      // Error message if API fails
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting to my recipe database. Please try again later!",
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }, 700);
    }
  };

  const clearChat = () => {
    // Keep only the welcome message
    const welcomeMessage = messages.find(msg => msg.isWelcome) || {
      id: Date.now(),
      text: "👋 Hi there! I'm ChefBot, your AI recipe assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      isWelcome: true,
      suggestions: [
        "What can I cook with chicken and pasta?",
        "Find me a quick vegetarian dinner",
        "Suggest a healthy breakfast",
        "How do I make chocolate chip cookies?"
      ]
    };
    
    setMessages([welcomeMessage]);
  };

  const submitFeedback = (messageId, isPositive) => {
    setMessages(prev => 
      prev.map(message => 
        message.id === messageId 
          ? { ...message, feedback: isPositive ? 'positive' : 'negative' } 
          : message
      )
    );
    
    // In a real app, you'd send this feedback to your API
    console.log(`Feedback for message ${messageId}: ${isPositive ? 'positive' : 'negative'}`);
  };

  return (
    <ChatContext.Provider 
      value={{ 
        messages, 
        isTyping, 
        chatHistory,
        sendMessage, 
        clearChat, 
        submitFeedback 
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};