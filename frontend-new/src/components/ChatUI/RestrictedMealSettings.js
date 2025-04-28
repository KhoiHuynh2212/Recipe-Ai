// src/components/ChatUI/RestrictedMealSettings.js
import React, { useState, useEffect } from 'react';
import './RestrictedMealSettings.css';

// Simple inline sanitization function
const sanitizeHtml = (text) => {
  if (!text) return '';
  
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const RestrictedMealSettings = ({ onSendMessage }) => {
  // State variables
  const [currentRestriction, setCurrentRestriction] = useState('');
  const [savedRestrictions, setSavedRestrictions] = useState([]);
  const [currentAllergen, setCurrentAllergen] = useState('');
  const [savedAllergens, setSavedAllergens] = useState([]);
  
  // Available restriction options
  const restrictionOptions = [
    { value: '', label: 'Select Restriction' },
    { value: 'Dairy-Free', label: 'Dairy-Free' },
    { value: 'Gluten-Free', label: 'Gluten-Free' },
    { value: 'Vegetarian', label: 'Vegetarian' },
    { value: 'Vegan', label: 'Vegan' },
    { value: 'Nut-Free', label: 'Nut-Free' },
    { value: 'Keto', label: 'Keto' },
    { value: 'Paleo', label: 'Paleo' },
    { value: 'Low-Carb', label: 'Low-Carb' }
  ];
  
  // Common allergens list
  const allergenOptions = [
    { value: '', label: 'Select Allergen' },
    { value: 'Dairy', label: 'Dairy' },
    { value: 'Eggs', label: 'Eggs' },
    { value: 'Fish', label: 'Fish' },
    { value: 'Shellfish', label: 'Shellfish' },
    { value: 'Tree Nuts', label: 'Tree Nuts' },
    { value: 'Peanuts', label: 'Peanuts' },
    { value: 'Wheat', label: 'Wheat' },
    { value: 'Soy', label: 'Soy' },
    { value: 'Sesame', label: 'Sesame' }
  ];
  
  // Load saved restrictions and allergens from localStorage on component mount
  useEffect(() => {
    const savedDietPreferences = localStorage.getItem('dietaryRestrictions');
    if (savedDietPreferences) {
      try {
        const parsedPreferences = JSON.parse(savedDietPreferences);
        setSavedRestrictions(parsedPreferences);
      } catch (error) {
        console.error('Error parsing saved dietary restrictions:', error);
      }
    }
    
    const savedAllergensList = localStorage.getItem('allergens');
    if (savedAllergensList) {
      try {
        const parsedAllergens = JSON.parse(savedAllergensList);
        setSavedAllergens(parsedAllergens);
      } catch (error) {
        console.error('Error parsing saved allergens:', error);
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
  
  // Save allergens to localStorage when they change
  useEffect(() => {
    if (savedAllergens.length > 0) {
      localStorage.setItem('allergens', JSON.stringify(savedAllergens));
    } else {
      localStorage.removeItem('allergens');
    }
  }, [savedAllergens]);
  
  const handleRestrictionChange = (e) => {
    // Sanitize the selected value
    const sanitizedValue = sanitizeHtml(e.target.value);
    setCurrentRestriction(sanitizedValue);
  };
  
  const handleAllergenChange = (e) => {
    // Sanitize the selected value
    const sanitizedValue = sanitizeHtml(e.target.value);
    setCurrentAllergen(sanitizedValue);
  };
  
  const addRestriction = () => {
    if (!currentRestriction) return;
    
    // Validate that the selection is from our approved list
    const isValidOption = restrictionOptions.some(option => 
      option.value === currentRestriction
    );
    
    if (!isValidOption) {
      console.error('Invalid restriction selected');
      setCurrentRestriction('');
      return;
    }
    
    // Don't add duplicate restrictions
    if (!savedRestrictions.includes(currentRestriction)) {
      const newRestrictions = [...savedRestrictions, currentRestriction];
      setSavedRestrictions(newRestrictions);
      
      // Sanitize message text
      const message = `Added "${sanitizeHtml(currentRestriction)}" to your dietary restrictions. I'll make sure future recipes comply with this restriction.`;
      
      // Notify the user
      onSendMessage(message);
      setCurrentRestriction('');
    }
  };
  
  const addAllergen = () => {
    if (!currentAllergen) return;
    
    // Validate that the selection is from our approved list
    const isValidOption = allergenOptions.some(option => 
      option.value === currentAllergen
    );
    
    if (!isValidOption) {
      console.error('Invalid allergen selected');
      setCurrentAllergen('');
      return;
    }
    
    // Don't add duplicate allergens
    if (!savedAllergens.includes(currentAllergen)) {
      const newAllergens = [...savedAllergens, currentAllergen];
      setSavedAllergens(newAllergens);
      
      // Sanitize message text
      const message = `Added "${sanitizeHtml(currentAllergen)}" to your allergens. I'll warn you if recipes contain this ingredient.`;
      
      // Notify the user
      onSendMessage(message);
      setCurrentAllergen('');
    }
  };
  
  const removeRestriction = (restriction) => {
    // Sanitize to prevent XSS in case restriction data is compromised
    const sanitizedRestriction = sanitizeHtml(restriction);
    
    const newRestrictions = savedRestrictions.filter(r => r !== restriction);
    setSavedRestrictions(newRestrictions);
    
    // Notify the user with sanitized message
    onSendMessage(`Removed "${sanitizedRestriction}" from your dietary restrictions.`);
  };
  
  const removeAllergen = (allergen) => {
    // Sanitize to prevent XSS in case allergen data is compromised
    const sanitizedAllergen = sanitizeHtml(allergen);
    
    const newAllergens = savedAllergens.filter(a => a !== allergen);
    setSavedAllergens(newAllergens);
    
    // Notify the user with sanitized message
    onSendMessage(`Removed "${sanitizedAllergen}" from your allergens.`);
  };

  return (
    <div className="dietary-preferences">
      <div className="dietary-header">
      </div>

      <div className="preferences-grid">
        {/* Dietary Restrictions Panel */}
        <div className="preferences-panel restrictions-panel">
          <h4>Dietary Restrictions</h4>
          
          <div className="add-preference">
            <div className="selection-row">
              <select 
                value={currentRestriction} 
                onChange={handleRestrictionChange}
                className="preference-select"
              >
                {restrictionOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <button 
                onClick={addRestriction}
                disabled={!currentRestriction}
                className="add-btn"
              >
                Add
              </button>
            </div>
          </div>
          
          <div className="preferences-list">
            {savedRestrictions.length > 0 ? (
              <div className="tags-container">
                {savedRestrictions.map(restriction => (
                  <div key={restriction} className="preference-tag restriction-tag">
                    {/* Use sanitized text for display */}
                    <span>{sanitizeHtml(restriction)}</span>
                    <button 
                      onClick={() => removeRestriction(restriction)}
                      className="remove-tag"
                      aria-label={`Remove ${sanitizeHtml(restriction)}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-preferences">No dietary restrictions set</p>
            )}
          </div>
        </div>
        
        {/* Allergens Panel */}
        <div className="preferences-panel allergens-panel">
          <h4>Allergens</h4>
          
          <div className="add-preference">
            <div className="selection-row">
              <select 
                value={currentAllergen} 
                onChange={handleAllergenChange}
                className="preference-select"
              >
                {allergenOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <button 
                onClick={addAllergen}
                disabled={!currentAllergen}
                className="add-btn allergen-add"
              >
                Add
              </button>
            </div>
          </div>
          
          <div className="preferences-list">
            {savedAllergens.length > 0 ? (
              <div className="tags-container">
                {savedAllergens.map(allergen => (
                  <div key={allergen} className="preference-tag allergen-tag">
                    {/* Use sanitized text for display */}
                    <span>{sanitizeHtml(allergen)}</span>
                    <button 
                      onClick={() => removeAllergen(allergen)}
                      className="remove-tag"
                      aria-label={`Remove ${sanitizeHtml(allergen)}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-preferences">No allergens set</p>
            )}
          </div>
        </div>
      </div>
      
      {(savedRestrictions.length > 0 || savedAllergens.length > 0) && (
        <div className="preferences-summary">
          <div className="info-icon">ℹ️</div>
          <p>
            {savedRestrictions.length > 0 && savedAllergens.length > 0 ? (
              `Your dietary restrictions and allergens will be considered when suggesting recipes. You'll be warned about recipes containing allergens.`
            ) : savedRestrictions.length > 0 ? (
              `Your dietary restrictions will be considered when suggesting recipes.`
            ) : (
              `You'll be warned about recipes containing your allergens.`
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default RestrictedMealSettings;