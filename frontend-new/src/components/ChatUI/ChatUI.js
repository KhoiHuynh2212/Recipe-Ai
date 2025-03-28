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

const ChatUI = ({ onShowMealPlanner }) => {
  const { messages, isTyping, sendMessage, clearChat } = useChat();
  
  // State for UI elements
  const [dietRestriction, setDietRestriction] = useState('');
  const [nutritionRecommendations, setNutritionRecommendations] = useState(null);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'nutrition'
  
  // Handle the dietary restriction selection
  const handleDietChange = (event) => {
    setDietRestriction(event.target.value);

    // Send a bot message based on the selected restriction
    const message = `The selected meal is: ${event.target.value}`;
    sendMessage(message, false, true);
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
    
    // Send a summary message to the chat
    const summaryMessage = `Based on your information, I've calculated your nutritional needs:
    • Daily calories: ${recommendations.dailyCalories} calories
    • Protein: ${recommendations.macros.protein.grams}g (${recommendations.macros.protein.percentage}%)
    • Carbs: ${recommendations.macros.carbs.grams}g (${recommendations.macros.carbs.percentage}%)
    • Fat: ${recommendations.macros.fat.grams}g (${recommendations.macros.fat.percentage}%)
    
    Your BMI is ${recommendations.bmi.value} (${recommendations.bmi.category}).
    
    Would you like me to suggest recipes based on these nutritional needs?`;
    
    sendMessage(summaryMessage, false, true);
  };
  
  // Modified sendMessage handler to check for recipe allergens
  const handleSendMessage = (message, isQuickReply = false) => {
    // First, send the user message normally
    sendMessage(message, isQuickReply);
    
    // Switch to chat tab if on nutrition tab
    if (activeTab !== 'chat') {
      setActiveTab('chat');
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
                  onSuggestionClick={(suggestion) => sendMessage(suggestion, true)} 
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
        <InputArea onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatUI;