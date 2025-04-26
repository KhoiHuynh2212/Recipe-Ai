// src/components/ChatUI/InputArea.js
import React, { useState, useEffect, useRef } from 'react';

const InputArea = ({ onSendMessage, disabled = false }) => {
  const [inputValue, setInputValue] = useState('');
  const [previewWarning, setPreviewWarning] = useState(null);
  const inputRef = useRef(null);
  
  // Check user input against dietary restrictions and allergens on every keystroke
  useEffect(() => {
    if (inputValue.trim()) {
      // Check for restrictions immediately, even on single words
      checkForRestrictions(inputValue);
    } else {
      setPreviewWarning(null);
    }
  }, [inputValue]);
  
  const checkForRestrictions = (text) => {
    // Load dietary restrictions and allergens from localStorage
    let dietaryRestrictions = [];
    let allergens = [];
    
    try {
      const savedRestrictions = localStorage.getItem('dietaryRestrictions');
      if (savedRestrictions) {
        dietaryRestrictions = JSON.parse(savedRestrictions);
      }
      
      const savedAllergens = localStorage.getItem('allergens');
      if (savedAllergens) {
        allergens = JSON.parse(savedAllergens);
      }
    } catch (error) {
      console.error('Error loading restrictions:', error);
      return;
    }
    
    // If no restrictions or allergens, return early
    if (dietaryRestrictions.length === 0 && allergens.length === 0) {
      setPreviewWarning(null);
      return;
    }
    
    // Lowercase the text for case-insensitive comparison
    const lowercaseText = text.toLowerCase();
    
    // Check for allergens first (higher priority)
    const foundAllergens = allergens.filter(allergen => {
      // Use word boundary to ensure we're matching whole words or parts of words
      const regex = new RegExp(`\\b${allergen.toLowerCase()}\\b`, 'i');
      return regex.test(lowercaseText);
    });
    
    if (foundAllergens.length > 0) {
      setPreviewWarning({
        type: 'allergen',
        restrictions: foundAllergens,
        message: `Your message contains ${foundAllergens.length > 1 ? 'allergens' : 'an allergen'}: ${foundAllergens.join(', ')}`
      });
      return; // If allergens found, no need to check dietary restrictions
    }
    
    // Check for dietary restrictions
    const foundRestrictions = dietaryRestrictions.filter(restriction => {
      // For diet types, check for specific ingredients that would violate the diet
      switch (restriction.toLowerCase()) {
        case 'vegetarian':
          return /\b(meat|beef|chicken|pork|lamb|turkey|duck|bacon|sausage)\b/i.test(lowercaseText);
        case 'vegan':
          return /\b(meat|beef|chicken|pork|lamb|turkey|duck|bacon|sausage|egg|milk|cheese|butter|cream|yogurt|honey)\b/i.test(lowercaseText);
        case 'gluten-free':
          return /\b(wheat|barley|rye|flour|bread|pasta|noodles|cereal|cracker)\b/i.test(lowercaseText);
        case 'dairy-free':
          return /\b(milk|cheese|butter|cream|yogurt|ice cream)\b/i.test(lowercaseText);
        case 'nut-free':
          return /\b(nut|almond|walnut|pecan|cashew|pistachio|hazelnut)\b/i.test(lowercaseText);
        case 'keto':
          return /\b(sugar|pasta|rice|potato|bread|cereal|corn|bean)\b/i.test(lowercaseText);
        case 'paleo':
          return /\b(grain|wheat|oat|rice|corn|bean|legume|peanut|dairy|sugar)\b/i.test(lowercaseText);
        case 'low-carb':
          return /\b(sugar|pasta|rice|potato|bread|cereal)\b/i.test(lowercaseText);
        default:
          return false;
      }
    });
    
    if (foundRestrictions.length > 0) {
      setPreviewWarning({
        type: 'dietary',
        restrictions: foundRestrictions,
        message: `Your message mentions items that conflict with your dietary preferences: ${foundRestrictions.join(', ')}`
      });
    } else {
      setPreviewWarning(null);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue);
      setInputValue('');
      setPreviewWarning(null);
      
      // Focus back on input after sending
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };
  
  return (
    <div className="input-area-container">
      {previewWarning && (
        <div className={`input-warning ${previewWarning.type === 'allergen' ? 'allergen-warning' : 'dietary-warning'}`}>
          <span className="warning-icon">⚠️</span>
          <span className="warning-text">
            {previewWarning.message}
          </span>
        </div>
      )}
      
      <form className="input-area" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className={`message-input ${previewWarning ? 'has-warning' : ''} ${previewWarning?.type === 'allergen' ? 'allergen-warning' : ''} ${disabled ? 'disabled' : ''}`}
          placeholder={disabled ? "Cooldown active... Please wait" : "Ask for recipe suggestions..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={disabled}
        />
        
        <button 
          type="submit" 
          className="send-button" 
          disabled={!inputValue.trim() || disabled}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M22 2L11 13" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M22 2L15 22L11 13L2 9L22 2Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default InputArea;