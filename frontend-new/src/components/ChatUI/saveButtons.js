import React, { useState } from 'react';
import { useNotification } from '../contexts/NotificationContext';

const SaveButton = ({ recipe }) => {
  const [isSaving, setIsSaving] = useState(false);
  const { showSuccess } = useNotification();
  
  const handleSave = () => {
    setIsSaving(true);
    
    // Save to localStorage
    setTimeout(() => {
      const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
      const isAlreadySaved = savedRecipes.some(saved => saved.id === recipe.id);
      
      if (!isAlreadySaved) {
        savedRecipes.push(recipe);
        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
        showSuccess('Recipe saved successfully!');
      } else {
        showSuccess('Recipe already in your saved collection');
      }
      
      setIsSaving(false);
    }, 300);
  };
  
  return (
    <button 
      onClick={handleSave}
      disabled={isSaving}
      className="save-recipe-btn"
      style={{
        background: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '5px 10px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px'
      }}
    >
      {isSaving ? 'Saving...' : 'Save Recipe'}
    </button>
  );
};

export default SaveButton;