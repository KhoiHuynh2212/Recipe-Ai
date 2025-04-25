// Chat Context for managing chat state and interactions
import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { aiService } from '../services/apiService';

// Create context
const ChatContext = createContext();

// Custom hook to use the chat context
export const useChat = () => useContext(ChatContext);

// Chat provider component
export const ChatProvider = ({ children }) => {
  // State for messages
  const [messages, setMessages] = useState(() => {
    // Try to load messages from localStorage
    const savedMessages = localStorage.getItem('chatMessages');
    const welcomeMessage = {
      id: uuidv4(),
      text: "Hi there! I'm your Recipe Assistant. Ask me for recipe ideas, cooking tips, or tell me what ingredients you have and I'll help you create something delicious!",
      sender: 'bot',
      suggestions: [
        "What can I make with chicken and pasta?",
        "Find me a quick vegetarian dinner",
        "Suggest a healthy breakfast",
        "How do I make chocolate chip cookies?"
      ],
      isWelcome: true,
      timestamp: new Date().toISOString()
    };
    
    return savedMessages ? JSON.parse(savedMessages) : [welcomeMessage];
  });
  
  // State for typing indicator
  const [isTyping, setIsTyping] = useState(false);
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);
  
  // Add a new message to the chat
  const addMessage = (message, isUser = true) => {
    const newMessage = {
      id: uuidv4(),
      text: message,
      sender: isUser ? 'user' : 'bot',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    return newMessage;
  };
  
  // Send message to AI and get response
  const sendMessage = async (message, isQuickReply = false, isSystemMessage = false) => {
    if (!message.trim() && !isSystemMessage) return;
    
    // Don't add system messages to the UI if they're flagged as system messages
    if (!isSystemMessage) {
      addMessage(message, true);
    }
    
    // If it's a quick reply or system message, don't show typing indicator
    if (!isQuickReply && !isSystemMessage) {
      setIsTyping(true);
      
      try {
        // Create chat history for context
        const chatHistory = messages
          .filter(msg => !msg.isWelcome)
          .map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          }));
        
        // Call AI service
        const response = await aiService.chatWithAssistant(message, chatHistory);
        
        // Process response
        const botResponse = response.message;
        
        // Check if response contains recipe data
        let recipes = [];
        let suggestions = [];
        
        // Try to extract recipe data from AI response
        try {
          // Look for recipe markers in the response
          if (botResponse.includes('RECIPE_START') && botResponse.includes('RECIPE_END')) {
            const recipeMatches = botResponse.match(/RECIPE_START([\s\S]*?)RECIPE_END/g);
            
            if (recipeMatches && recipeMatches.length > 0) {
              recipeMatches.forEach(match => {
                const recipeJson = match
                  .replace('RECIPE_START', '')
                  .replace('RECIPE_END', '')
                  .trim();
                
                try {
                  const recipe = JSON.parse(recipeJson);
                  recipes.push({
                    id: uuidv4(),
                    ...recipe
                  });
                } catch (err) {
                  console.error('Error parsing recipe JSON:', err);
                }
              });
            }
          }
          
          // Look for suggested replies
          if (botResponse.includes('SUGGESTIONS_START') && botResponse.includes('SUGGESTIONS_END')) {
            const suggestionsMatch = botResponse.match(/SUGGESTIONS_START([\s\S]*?)SUGGESTIONS_END/);
            
            if (suggestionsMatch && suggestionsMatch.length > 1) {
              const suggestionsJson = suggestionsMatch[1].trim();
              
              try {
                suggestions = JSON.parse(suggestionsJson);
              } catch (err) {
                console.error('Error parsing suggestions JSON:', err);
              }
            }
          }
        } catch (error) {
          console.error('Error processing AI response:', error);
        }
        
        // Clean up response text by removing special markers
        let cleanResponse = botResponse
          .replace(/RECIPE_START[\s\S]*?RECIPE_END/g, '')
          .replace(/SUGGESTIONS_START[\s\S]*?SUGGESTIONS_END/g, '')
          .trim();
        
        // If we have recipes but the response is now empty, add a default message
        if (recipes.length > 0 && !cleanResponse) {
          cleanResponse = recipes.length === 1
            ? "Here's a recipe you might like:"
            : "Here are some recipes you might like:";
        }
        
        // Add bot message
        const botMessage = {
          id: uuidv4(),
          text: cleanResponse,
          sender: 'bot',
          timestamp: new Date().toISOString()
        };
        
        // Add recipes and suggestions if available
        if (recipes.length > 0) {
          botMessage.recipes = recipes;
        }
        
        if (suggestions.length > 0) {
          botMessage.suggestions = suggestions;
        }
        
        setMessages(prevMessages => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('Error getting AI response:', error);
        
        // Add error message
        const errorMessage = {
          id: uuidv4(),
          text: "I'm sorry, but I'm having trouble connecting to my recipe database right now. Please try again in a moment.",
          sender: 'bot',
          timestamp: new Date().toISOString(),
          isError: true
        };
        
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    } else if (isSystemMessage) {
      // Add system message directly as a bot message
      const systemMessage = {
        id: uuidv4(),
        text: message,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isSystemMessage: true
      };
      
      setMessages(prevMessages => [...prevMessages, systemMessage]);
    }
  };
  
  // Submit feedback for a message
  const submitFeedback = (messageId, isPositive) => {
    setMessages(prevMessages => 
      prevMessages.map(message => 
        message.id === messageId 
          ? { ...message, feedback: isPositive ? 'positive' : 'negative' } 
          : message
      )
    );
    
    // In a real app, you would also send this feedback to the server
    // For now, just log it
    console.log(`Feedback for message ${messageId}: ${isPositive ? 'positive' : 'negative'}`);
  };
  
  // Clear chat history
  const clearChat = () => {
    const welcomeMessage = {
      id: uuidv4(),
      text: "Hi there! I'm your Recipe Assistant. Ask me for recipe ideas, cooking tips, or tell me what ingredients you have and I'll help you create something delicious!",
      sender: 'bot',
      suggestions: [
        "What can I make with chicken and pasta?",
        "Find me a quick vegetarian dinner",
        "Suggest a healthy breakfast",
        "How do I make chocolate chip cookies?"
      ],
      isWelcome: true,
      timestamp: new Date().toISOString()
    };
    
    setMessages([welcomeMessage]);
  };
  
  return (
    <ChatContext.Provider
      value={{
        messages,
        isTyping,
        sendMessage,
        clearChat,
        submitFeedback
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};