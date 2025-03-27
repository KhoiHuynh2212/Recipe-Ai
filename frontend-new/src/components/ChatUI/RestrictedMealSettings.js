// src/components/ChatUI/RestrictedMealSettings.js - Button section update
import React, { useState, useEffect } from 'react';

const RestrictedMealSettings = ({ onSendMessage }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [currentRestriction, setCurrentRestriction] = useState('');
  const [savedRestrictions, setSavedRestrictions] = useState([]);
  
  // Available restriction options
  const restrictionOptions = [
    'None',
    'Dairy-Free',
    'Gluten-Free',
    'Vegetarian',
    'Vegan',
    'Nut-Free',
    'Keto',
    'Paleo',
    'Low-Carb'
  ];
  
  // Load saved restrictions from localStorage on component mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('dietaryRestrictions');
    if (savedPreferences) {
      try {
        const parsedPreferences = JSON.parse(savedPreferences);
        setSavedRestrictions(parsedPreferences);
        
        // Set current restriction to the first one if it exists
        if (parsedPreferences.length > 0) {
          setCurrentRestriction(parsedPreferences[0]);
        }
      } catch (error) {
        console.error('Error parsing saved dietary restrictions:', error);
      }
    }
  }, []);
  
  // Save restrictions to localStorage when they change
  useEffect(() => {
    if (savedRestrictions.length > 0) {
      localStorage.setItem('dietaryRestrictions', JSON.stringify(savedRestrictions));
    } else {
      localStorage.removeItem('dietaryRestrictions');
    }
  }, [savedRestrictions]);
  
  const handleRestrictionChange = (e) => {
    setCurrentRestriction(e.target.value);
  };
  
  const addRestriction = () => {
    if (!currentRestriction || currentRestriction === 'None') {
      return;
    }
    
    // Don't add duplicate restrictions
    if (!savedRestrictions.includes(currentRestriction)) {
      setSavedRestrictions([...savedRestrictions, currentRestriction]);
      
      // Notify the user
      onSendMessage(`Added "${currentRestriction}" to your dietary restrictions. I'll make sure future recipes comply with this restriction.`);
    }
  };
  
  const removeRestriction = (restriction) => {
    setSavedRestrictions(savedRestrictions.filter(r => r !== restriction));
    
    // Notify the user
    onSendMessage(`Removed "${restriction}" from your dietary restrictions.`);
  };
  
  const clearAllRestrictions = () => {
    setSavedRestrictions([]);
    setCurrentRestriction('');
    onSendMessage('Cleared all your dietary restrictions.');
  };
  
  return (
    <div className="restricted-meal-settings">
      {/* Updated button styling */}
      <button 
        className="settings-toggle-btn"
        onClick={() => setShowSettings(!showSettings)}
      >
        Dietary Preferences
        {savedRestrictions.length > 0 && !showSettings && (
          <span className="restriction-badge">{savedRestrictions.length}</span>
        )}
      </button>
      
      {showSettings && (
        <div className="settings-panel">
          <h4>Your Dietary Preferences</h4>
          <p>The assistant will adapt recipes to match your dietary needs.</p>
          
          <div className="current-restrictions">
            {savedRestrictions.length > 0 ? (
              <>
                <h5>Your Current Restrictions:</h5>
                <ul className="restrictions-list">
                  {savedRestrictions.map(restriction => (
                    <li key={restriction} className="restriction-item">
                      <span>{restriction}</span>
                      <button 
                        className="remove-btn"
                        onClick={() => removeRestriction(restriction)}
                        title="Remove restriction"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
                <button 
                  className="clear-all-btn"
                  onClick={clearAllRestrictions}
                >
                  Clear All
                </button>
              </>
            ) : (
              <p className="no-restrictions">No dietary restrictions set. Add some below.</p>
            )}
          </div>
          
          <div className="add-restriction">
            <h5>Add a Restriction:</h5>
            <div className="restriction-controls">
              <select 
                value={currentRestriction} 
                onChange={handleRestrictionChange}
                className="restriction-select"
              >
                <option value="">Select Restriction</option>
                {restrictionOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              
              <button 
                className="add-btn"
                onClick={addRestriction}
                disabled={!currentRestriction || currentRestriction === 'None'}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestrictedMealSettings;