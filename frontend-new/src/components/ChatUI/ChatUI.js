// src/components/ChatUI/ChatUI.js
import React, { useState, useEffect } from 'react';
import './ChatUI.css';
import MessageList from './MessageList';
import InputArea from './InputArea';
import WelcomeMessage from './WelcomeMessage';
import RestrictedMealSettings from './RestrictedMealSettings';
import IngredientManagement from './IngredientManagement';
import WeightBasedDietFilter from './WeightBasedDietFilter';
import './RestrictedMealSettings.css';
import './WeightBasedDietFilter.css';
import { useChat } from '../../contexts/ChatContext';

// Helper function to format seconds into minutes and seconds
const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

// Temporary placeholder for cooldown functionality
const useTempRequestThrottler = () => {
  const [requestCount, setRequestCount] = useState(0);
  const [isInCooldown, setIsInCooldown] = useState(false);
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState(0);
  
  // Check for existing cooldown state in localStorage on initialization
  useEffect(() => {
    const storedCooldown = localStorage.getItem('requestCooldown');
    if (storedCooldown) {
      try {
        const { endTime } = JSON.parse(storedCooldown);
        const now = Date.now();
        
        // If the stored cooldown is still active
        if (now < endTime) {
          setIsInCooldown(true);
          setCooldownTimeLeft(Math.ceil((endTime - now) / 1000)); // Convert to seconds
        } else {
          // Clear expired cooldown
          localStorage.removeItem('requestCooldown');
        }
      } catch (error) {
        console.error('Error parsing cooldown data:', error);
        localStorage.removeItem('requestCooldown');
      }
    }
    
    // Load stored request count
    const storedCount = localStorage.getItem('requestCount');
    if (storedCount) {
      try {
        setRequestCount(parseInt(storedCount, 10));
      } catch (error) {
        console.error('Error parsing request count:', error);
        localStorage.removeItem('requestCount');
      }
    }
  }, []);
  
  // Handle active cooldown countdown
  useEffect(() => {
    let timer;
    
    if (isInCooldown && cooldownTimeLeft > 0) {
      timer = setInterval(() => {
        setCooldownTimeLeft(prevTime => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            clearInterval(timer);
            setIsInCooldown(false);
            setRequestCount(0);
            localStorage.removeItem('requestCooldown');
            localStorage.setItem('requestCount', '0');
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isInCooldown, cooldownTimeLeft]);
  
  const trackRequest = () => {
    // If already in cooldown, don't count
    if (isInCooldown) return false;
    
    const newCount = requestCount + 1;
    setRequestCount(newCount);
    localStorage.setItem('requestCount', newCount.toString());
    
    // Check if we've hit the limit (10 requests)
    if (newCount >= 10) {
      // Start cooldown (5 minutes = 300 seconds)
      const startTime = Date.now();
      const endTime = startTime + (5 * 60 * 1000); // 5 minutes in milliseconds
      
      setIsInCooldown(true);
      setCooldownTimeLeft(300); // 300 seconds = 5 minutes
      setRequestCount(0);
      localStorage.setItem('requestCount', '0');
      localStorage.setItem('requestCooldown', JSON.stringify({ startTime, endTime }));
      
      return false;
    }
    
    return true;
  };
  
  return {
    requestCount,
    isInCooldown,
    cooldownTimeLeftSeconds: cooldownTimeLeft,
    canMakeRequest: !isInCooldown,
    trackRequest
  };
};

const ChatUI = ({ onShowMealPlanner }) => {
  const { messages, isTyping, sendMessage, clearChat } = useChat();
  
  // State for UI elements
  const [dietRestriction, setDietRestriction] = useState('');
  const [nutritionRecommendations, setNutritionRecommendations] = useState(null);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'nutrition'
  
  // Initialize temporary request throttler
  const {
    isInCooldown,
    cooldownTimeLeftSeconds,
    canMakeRequest,
    trackRequest,
    requestCount
  } = useTempRequestThrottler();
  
  // Handle the dietary restriction selection
  const handleDietChange = (event) => {
    setDietRestriction(event.target.value);

    // Only send message if not in cooldown
    if (canMakeRequest && trackRequest()) {
      const message = `The selected meal is: ${event.target.value}`;
      sendMessage(message, false, true);
    }
  };

  // Handler for messages from settings components
  const handleSettingsMessage = (message) => {
    // Send a bot message to acknowledge the settings change
    if (typeof sendMessage === 'function') {
      sendMessage(message, false, true);
    } else {
      console.log('Bot message:', message);
    }
  };
  
  // Handle nutrition recommendations
  const handleNutritionRecommendations = (recommendations) => {
    setNutritionRecommendations(recommendations);
    
    // Check cooldown before sending summary message
    if (canMakeRequest && trackRequest()) {
      // Send a summary message to the chat
      const summaryMessage = `Based on your information, I've calculated your nutritional needs:
      • Daily calories: ${recommendations.dailyCalories} calories
      • Protein: ${recommendations.macros.protein.grams}g (${recommendations.macros.protein.percentage}%)
      • Carbs: ${recommendations.macros.carbs.grams}g (${recommendations.macros.carbs.percentage}%)
      • Fat: ${recommendations.macros.fat.grams}g (${recommendations.macros.fat.percentage}%)
      
      Your BMI is ${recommendations.bmi.value} (${recommendations.bmi.category}).
      
      Would you like me to suggest recipes based on these nutritional needs?`;
      
      sendMessage(summaryMessage, false, true);
    }
  };
  
  // Modified sendMessage handler to check for recipe allergens and cooldown timer
  const handleSendMessage = (message, isQuickReply = false) => {
    // Check if we can make a request
    if (canMakeRequest) {
      // Track this request and check if we can proceed
      if (trackRequest()) {
        // First, send the user message normally
        sendMessage(message, isQuickReply);
        
        // Switch to chat tab if on nutrition tab
        if (activeTab !== 'chat') {
          setActiveTab('chat');
        }
      } else {
        // Show a temporary notification in the chat area if cooldown just started
        const cooldownMessage = `You've reached the request limit of 10 messages. Please wait ${formatTime(cooldownTimeLeftSeconds)} before sending another message.`;
        sendMessage(cooldownMessage, false, true);
      }
    } else {
      // Show a temporary notification about the cooldown
      const cooldownMessage = `Please wait ${formatTime(cooldownTimeLeftSeconds)} before sending another message.`;
      sendMessage(cooldownMessage, false, true);
    }
  };
  
  return (
    <div className="chat-ui">
      <div className="chat-ui-header">
        <h2>Recipe Assistant</h2>
        <div className="chat-header-actions">
          <div className="tab-buttons">
            <button 
              className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              Chat
            </button>
            <button 
              className={`tab-btn ${activeTab === 'nutrition' ? 'active' : ''}`}
              onClick={() => setActiveTab('nutrition')}
            >
              Nutrition
            </button>
          </div>
          <button className="clear-chat-btn" onClick={clearChat}>
            New Chat
          </button>
        </div>
      </div>
      
      <div className="chat-ui-body">
        {activeTab === 'chat' ? (
          // Chat tab content
          <>
            {messages.length === 1 && messages[0].isWelcome && (
              <>
                <WelcomeMessage 
                  onSuggestionClick={(suggestion) => {
                    // Check cooldown before processing suggestion
                    if (canMakeRequest && trackRequest()) {
                      sendMessage(suggestion, true);
                    }
                  }} 
                  onMealPlannerClick={onShowMealPlanner}
                />
                
                {/* Simplified meal selector */}
                <div className="diet-restriction-container">
                  <label htmlFor="diet-restriction">Select What Meal You Want:</label>
                  <select
                    id="diet-restriction"
                    value={dietRestriction}
                    onChange={handleDietChange}
                    className="diet-restriction-dropdown"
                    disabled={isInCooldown}
                  >
                    <option value="">None</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                  </select>
                </div>
                
                {/* Info card about nutrition tab */}
                <div className="nutrition-info-card">
                  <div className="info-icon">ℹ️</div>
                  <div className="info-content">
                    <h4>Get Personalized Recipe Recommendations</h4>
                    <p>Switch to the Nutrition tab to enter your body measurements and receive personalized ingredient recommendations based on your health goals.</p>
                    <button 
                      className="switch-tab-btn"
                      onClick={() => setActiveTab('nutrition')}
                    >
                      Go to Nutrition Planner
                    </button>
                  </div>
                </div>

                <div className="pantry-quick-access">
                  <h4>My Pantry <span className="badge">New</span></h4>
                  <p>Keep track of ingredients you have at home</p>
                  <IngredientManagement onSendMessage={handleSettingsMessage} />
                </div>
              </>
            )}
            
            <MessageList messages={messages} isTyping={isTyping} />
          </>
        ) : (
          // Nutrition tab content
          <>
            <div className="nutrition-tab-container">
              <h3 className="tab-title">Personalized Nutrition Planner</h3>
              <p className="tab-description">
                Enter your body measurements and goals to receive personalized nutrition recommendations and ingredient suggestions.
              </p>
              
              {/* Weight-Based Diet Filter Component */}
              <WeightBasedDietFilter onRecommendationsChange={handleNutritionRecommendations} />
              
              {/* Restricted meal settings for allergens */}
              <div className="allergen-section">
                <h3 className="section-title">Dietary Restrictions & Allergens</h3>
                <p className="section-description">
                  Let us know about any allergies or dietary restrictions so we can make appropriate recipe suggestions.
                </p>
                <RestrictedMealSettings onSendMessage={handleSettingsMessage} />
              </div>
              
              {/* Ingredient Management */}
              <div className="pantry-section">
                <h3 className="section-title">My Pantry</h3>
                <p className="section-description">
                  Keep track of ingredients you already have at home. We'll suggest recipes that make use of what's in your pantry.
                </p>
                <IngredientManagement onSendMessage={handleSettingsMessage} />
              </div>
              
              {/* Option to return to chat */}
              <div className="return-to-chat">
                <button 
                  className="return-chat-btn"
                  onClick={() => setActiveTab('chat')}
                >
                  Return to Chat
                </button>
                <p>Return to the chat to get recipe recommendations based on your nutrition plan.</p>
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="chat-ui-footer">
        {/* Request count indicator */}
        {!isInCooldown && requestCount > 0 && (
          <div className="request-count-indicator">
            <span>Requests: {requestCount}/10</span>
          </div>
        )}
        
        {/* Cooldown indicator with progress bar */}
        {isInCooldown && (
          <div className="input-warning cooldown-warning">
            <span className="warning-icon">⏳</span>
            <div className="cooldown-info">
              <span className="warning-text">
                Cooldown active: {formatTime(cooldownTimeLeftSeconds)} remaining
              </span>
              <div className="cooldown-progress">
                <div 
                  className="cooldown-bar"
                  style={{ 
                    width: `${Math.min(100, (300 - cooldownTimeLeftSeconds) / 300 * 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}
        
        <InputArea 
          onSendMessage={handleSendMessage} 
          disabled={isInCooldown}
        />
      </div>
    </div>
  );
};

export default ChatUI;