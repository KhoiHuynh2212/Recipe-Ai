import React, { useState, useEffect } from 'react';

const InputArea = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const [usesPantry, setUsesPantry] = useState(false);
  const [pantryIngredients, setPantryIngredients] = useState([]);
  
  // Load pantry ingredients when component mounts
  useEffect(() => {
    loadPantryIngredients();
    
    // Listen for localStorage changes from other components
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const handleStorageChange = (e) => {
    if (e.key === 'pantryIngredients') {
      loadPantryIngredients();
    }
  };
  
  const loadPantryIngredients = () => {
    try {
      const storedIngredients = localStorage.getItem('pantryIngredients');
      if (storedIngredients) {
        const ingredientsData = JSON.parse(storedIngredients);
        setPantryIngredients(Object.keys(ingredientsData));
      } else {
        setPantryIngredients([]);
        // If pantry is empty, disable pantry mode
        if (usesPantry) {
          setUsesPantry(false);
        }
      }
    } catch (error) {
      console.error('Error loading pantry ingredients:', error);
      setPantryIngredients([]);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (inputValue.trim()) {
      // If pantry mode is enabled and we have ingredients, append them to the message
      if (usesPantry && pantryIngredients.length > 0) {
        const ingredientsList = pantryIngredients.join(', ');
        const pantryMessage = `${inputValue.trim()} (Using these ingredients from my pantry: ${ingredientsList})`;
        onSendMessage(pantryMessage);
      } else {
        onSendMessage(inputValue);
      }
      setInputValue('');
    }
  };
  
  // Toggle between using pantry ingredients or not
  const toggleUsePantry = () => {
    // Only allow toggle if there are ingredients
    if (pantryIngredients.length > 0) {
      setUsesPantry(!usesPantry);
    } else {
      // If no ingredients, show message
      alert('You have no ingredients in your pantry. Add some in the My Pantry section first.');
    }
  };
  
  return (
    <div>
      {pantryIngredients.length > 0 && (
        <div className="pantry-toggle">
          <label className="pantry-toggle-label">
            <input
              type="checkbox"
              checked={usesPantry}
              onChange={toggleUsePantry}
            />
            Use my pantry ingredients
          </label>
        </div>
      )}
      
      <form className="input-area" onSubmit={handleSubmit}>
        <input
          type="text"
          className={`message-input ${usesPantry ? 'pantry-mode' : ''}`}
          placeholder={usesPantry ? "Ask for recipes using your pantry ingredients..." : "Ask for recipe suggestions..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        
        <button type="submit" className="send-button" disabled={!inputValue.trim()}>
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