// src/components/RecipeCard.js
import React from 'react';

function RecipeCard({ title, time, diet, ingredients }) {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '8px', 
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    }}>
      <div style={{ padding: '16px' }}>
        <h3 style={{ 
          fontSize: '1.125rem', 
          fontWeight: 'bold',
          marginBottom: '8px'
        }}>{title}</h3>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          fontSize: '0.875rem',
          color: '#4b5563',
          marginBottom: '8px'
        }}>
          <span style={{ marginRight: '8px' }}>⏱️ {time} mins</span>
          <span style={{ 
            backgroundColor: '#dcfce7', 
            color: '#166534',
            padding: '2px 8px',
            borderRadius: '9999px',
            fontSize: '0.75rem'
          }}>
            {diet}
          </span>
        </div>
        
        <p style={{ 
          color: '#4b5563', 
          fontSize: '0.875rem',
          marginBottom: '16px'
        }}>
          Main ingredients: {ingredients.join(', ')}
        </p>
        
        <button style={{ 
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          width: '100%',
          border: 'none',
          cursor: 'pointer'
        }}>
          View Recipe
        </button>
      </div>
    </div>
  );
}

export default RecipeCard;