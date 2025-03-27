// src/components/ChatUI/IngredientManagement.js
import React, { useState, useEffect } from 'react';

const IngredientManagement = ({ onSendMessage }) => {
  const [showPanel, setShowPanel] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [expiration, setExpiration] = useState('');
  const [ingredients, setIngredients] = useState([]);

  // Load ingredients from localStorage when component mounts or panel is opened
  useEffect(() => {
    if (showPanel) {
      loadIngredientsFromStorage();
    }
  }, [showPanel]);

  const loadIngredientsFromStorage = () => {
    try {
      const storedIngredients = localStorage.getItem('pantryIngredients');
      if (storedIngredients) {
        const ingredientsData = JSON.parse(storedIngredients);
        setIngredients(Object.entries(ingredientsData));
      } else {
        setIngredients([]);
      }
    } catch (error) {
      console.error('Error loading ingredients from storage:', error);
      setIngredients([]);
    }
  };

  const saveIngredientsToStorage = (ingredientsData) => {
    localStorage.setItem('pantryIngredients', JSON.stringify(ingredientsData));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter an ingredient name');
      return;
    }

    try {
      // Get current ingredients from storage
      const storedIngredients = localStorage.getItem('pantryIngredients');
      const ingredientsData = storedIngredients ? JSON.parse(storedIngredients) : {};
      
      // Add or update ingredient
      ingredientsData[name] = {
        type: type || '',
        expiration: expiration || '',
        quantity: 1,
        addedDate: new Date().toISOString().split('T')[0]
      };
      
      // Save updated ingredients
      saveIngredientsToStorage(ingredientsData);
      
      // Notify the chat about the new ingredient
      onSendMessage(`Added "${name}" to your pantry${type ? ` as ${type}` : ''}${expiration ? ` with expiration date ${expiration}` : ''}.`);
      
      // Reset form
      setName('');
      setType('');
      setExpiration('');
      
      // Refresh ingredients list
      loadIngredientsFromStorage();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add ingredient.');
    }
  };

  // Add ingredient removal functionality
  const removeIngredient = (ingredientName) => {
    try {
      // Get current ingredients from storage
      const storedIngredients = localStorage.getItem('pantryIngredients');
      if (!storedIngredients) return;
      
      const ingredientsData = JSON.parse(storedIngredients);
      
      // Remove the ingredient
      if (ingredientsData[ingredientName]) {
        delete ingredientsData[ingredientName];
        
        // Save updated ingredients
        saveIngredientsToStorage(ingredientsData);
        
        // Notify the chat
        onSendMessage(`Removed "${ingredientName}" from your pantry.`);
        
        // Refresh ingredients list
        loadIngredientsFromStorage();
      }
    } catch (error) {
      console.error('Error removing ingredient:', error);
    }
  };
  
  // Clear all ingredients
  const clearAllIngredients = () => {
    try {
      // Clear storage
      localStorage.removeItem('pantryIngredients');
      
      // Clear state
      setIngredients([]);
      
      // Notify the chat
      onSendMessage('Cleared all ingredients from your pantry.');
    } catch (error) {
      console.error('Error clearing ingredients:', error);
    }
  };

  return (
    <div className="ingredient-management">
      <button 
        className="settings-toggle-btn"
        onClick={() => setShowPanel(!showPanel)}
      >
        {showPanel ? 'Hide My Pantry' : 'My Pantry'}
        {ingredients.length > 0 && !showPanel && (
          <span className="restriction-badge">{ingredients.length}</span>
        )}
      </button>
      
      {showPanel && (
        <div className="settings-panel">
          <h4>Your Pantry</h4>
          <p>Keep track of ingredients you have at home. The assistant can suggest recipes based on what's in your pantry.</p>
          
          <form onSubmit={handleSubmit} className="add-ingredient-form">
            <div className="ingredient-form-row">
              <input 
                type="text" 
                placeholder="Ingredient Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="ingredient-input"
              />
              <input 
                type="text" 
                placeholder="Type (e.g., Fruit, Vegetable)" 
                value={type} 
                onChange={(e) => setType(e.target.value)} 
                className="ingredient-input"
              />
              <input 
                type="date" 
                value={expiration} 
                onChange={(e) => setExpiration(e.target.value)} 
                className="ingredient-input date-input"
              />
              <button 
                type="submit" 
                className="add-btn"
                disabled={!name.trim()}
              >
                Add
              </button>
            </div>
          </form>
          
          <div className="ingredients-list">
            <h5>Your Ingredients:</h5>
            {ingredients.length > 0 ? (
              <>
                <table className="ingredients-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Expiration</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredients.map(([name, details]) => (
                      <tr key={name}>
                        <td>{name}</td>
                        <td>{details.type || '-'}</td>
                        <td>{details.expiration || '-'}</td>
                        <td>
                          <button 
                            className="remove-btn"
                            onClick={() => removeIngredient(name)}
                            title="Remove ingredient"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <button 
                  className="clear-all-btn"
                  onClick={clearAllIngredients}
                >
                  Clear All
                </button>
              </>
            ) : (
              <p className="no-ingredients">No ingredients in your pantry yet. Add some above.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientManagement;