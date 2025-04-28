// src/components/ChatUI/IngredientManagement.js
import React, { useState, useEffect } from 'react';
import './IngredientManagement.css';

// Simple inline sanitization functions
const sanitizeHtml = (text) => {
  if (!text) return '';
  
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const sanitizeForJavaScript = (text) => {
  if (!text) return '';
  
  try {
    // Using JSON.stringify helps escape characters for JS context
    return JSON.stringify(text).slice(1, -1);
  } catch (e) {
    console.error('Error sanitizing for JavaScript:', e);
    // Fallback to basic sanitization
    return String(text)
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/'/g, "\\'")
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r');
  }
};

const IngredientManagement = ({ onSendMessage }) => {
  const [showPanel, setShowPanel] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [expiration, setExpiration] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name');

  // Common ingredient types for quick selection
  const commonTypes = [
    'Vegetable', 'Fruit', 'Protein', 'Dairy', 
    'Grain', 'Spice', 'Condiment', 'Baking'
  ];

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
      return;
    }

    try {
      // Sanitize inputs
      const sanitizedName = sanitizeHtml(name.trim());
      const sanitizedType = sanitizeHtml(type.trim() || 'Other');
      
      // Get current ingredients from storage
      const storedIngredients = localStorage.getItem('pantryIngredients');
      const ingredientsData = storedIngredients ? JSON.parse(storedIngredients) : {};
      
      // Add or update ingredient
      ingredientsData[sanitizedName] = {
        type: sanitizedType,
        expiration: expiration || '',
        quantity: 1,
        addedDate: new Date().toISOString().split('T')[0]
      };
      
      // Save updated ingredients
      saveIngredientsToStorage(ingredientsData);
      
      // Prepare sanitized message
      const message = `Added "${sanitizedName}" to your pantry${sanitizedType !== 'Other' ? ` as ${sanitizedType}` : ''}${expiration ? ` with expiration date ${expiration}` : ''}.`;
      
      // Notify the chat about the new ingredient with sanitized values
      onSendMessage(message);
      
      // Reset form
      setName('');
      setType('');
      setExpiration('');
      
      // Refresh ingredients list
      loadIngredientsFromStorage();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Add ingredient removal functionality
  const removeIngredient = (ingredientName) => {
    try {
      // Sanitize input
      const sanitizedName = sanitizeHtml(ingredientName);
      
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
        onSendMessage(`Removed "${sanitizedName}" from your pantry.`);
        
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
      if (ingredients.length === 0) return;

      // Confirm before clearing
      if (window.confirm('Are you sure you want to clear all ingredients from your pantry?')) {
        // Clear storage
        localStorage.removeItem('pantryIngredients');
        
        // Clear state
        setIngredients([]);
        
        // Notify the chat
        onSendMessage('Cleared all ingredients from your pantry.');
      }
    } catch (error) {
      console.error('Error clearing ingredients:', error);
    }
  };

  // Handle search input with sanitization
  const handleSearchChange = (e) => {
    // Sanitize the search term
    const sanitizedSearch = sanitizeHtml(e.target.value);
    setSearchTerm(sanitizedSearch);
  };

  // Filter ingredients based on search term
  const filteredIngredients = ingredients.filter(([name, details]) => {
    return name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           (details.type && details.type.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  // Sort ingredients based on selected option
  const sortedIngredients = [...filteredIngredients].sort((a, b) => {
    switch (sortOption) {
      case 'name':
        return a[0].localeCompare(b[0]);
      case 'type':
        return (a[1].type || '').localeCompare(b[1].type || '');
      case 'expiration':
        // Sort by expiration date (items without dates go last)
        if (!a[1].expiration && !b[1].expiration) return 0;
        if (!a[1].expiration) return 1;
        if (!b[1].expiration) return -1;
        return new Date(a[1].expiration) - new Date(b[1].expiration);
      case 'newest':
        return new Date(b[1].addedDate || 0) - new Date(a[1].addedDate || 0);
      default:
        return 0;
    }
  });

  // Get count of ingredients near expiration (within 3 days)
  const getExpiringCount = () => {
    if (ingredients.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);
    
    return ingredients.filter(([_, details]) => {
      if (!details.expiration) return false;
      const expirationDate = new Date(details.expiration);
      return expirationDate >= today && expirationDate <= threeDaysFromNow;
    }).length;
  };

  // Check if an ingredient is expired or close to expiring
  const getExpirationStatus = (expirationDate) => {
    if (!expirationDate) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(expirationDate);
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);
    
    if (expDate < today) return 'expired';
    if (expDate <= threeDaysFromNow) return 'expiring-soon';
    return null;
  };

  // Get icon for ingredient type
  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'vegetable': return '🥦';
      case 'fruit': return '🍎';
      case 'protein': return '🍗';
      case 'dairy': return '🥛';
      case 'grain': return '🌾';
      case 'spice': return '🌶️';
      case 'condiment': return '🧂';
      case 'baking': return '🍞';
      default: return '🍽️';
    }
  };

  return (
    <div className="ingredient-management">
      <div className="pantry-header">
        <div className="pantry-title">
          <h3>My Pantry</h3>
          {!showPanel && ingredients.length > 0 && (
            <div className="pantry-counts">
              <span className="total-count">{ingredients.length}</span>
              {getExpiringCount() > 0 && (
                <span className="expiring-count" title="Items expiring soon">
                  {getExpiringCount()}
                </span>
              )}
            </div>
          )}
        </div>
        <button 
          className="toggle-pantry-btn"
          onClick={() => setShowPanel(!showPanel)}
        >
          {showPanel ? 'Hide Pantry' : 'Show Pantry'}
        </button>
      </div>
      
      {showPanel && (
        <div className="pantry-panel">
          <form onSubmit={handleSubmit} className="add-ingredient-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ingredient-name">Ingredient</label>
                <input 
                  id="ingredient-name"
                  type="text" 
                  placeholder="Add new ingredient..." 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required
                  maxLength={50} // Limit input length for security
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="ingredient-type">Type</label>
                <div className="type-input-container">
                  <input 
                    id="ingredient-type"
                    type="text" 
                    placeholder="Type (optional)" 
                    value={type} 
                    onChange={(e) => setType(e.target.value)} 
                    list="common-types"
                    maxLength={30} // Limit input length for security
                  />
                  <datalist id="common-types">
                    {commonTypes.map(type => (
                      <option key={type} value={type} />
                    ))}
                  </datalist>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="ingredient-expiration">Expiration</label>
                <input 
                  id="ingredient-expiration"
                  type="date" 
                  value={expiration} 
                  onChange={(e) => setExpiration(e.target.value)} 
                />
              </div>
              
              <button 
                type="submit" 
                className="add-ingredient-btn"
                disabled={!name.trim()}
              >
                Add
              </button>
            </div>
          </form>
          
          <div className="ingredients-container">
            <div className="ingredient-controls">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search ingredients..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                {searchTerm && (
                  <button 
                    className="clear-search-btn" 
                    onClick={() => setSearchTerm('')}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
              
              <div className="sort-container">
                <label htmlFor="sort-select">Sort by:</label>
                <select 
                  id="sort-select"
                  value={sortOption} 
                  onChange={(e) => setSortOption(e.target.value)}
                  className="sort-select"
                >
                  <option value="name">Name</option>
                  <option value="type">Type</option>
                  <option value="expiration">Expiration</option>
                  <option value="newest">Recently Added</option>
                </select>
              </div>
            </div>
            
            {ingredients.length > 0 ? (
              <>
                <div className="ingredients-list">
                  {sortedIngredients.map(([name, details]) => {
                    const expirationStatus = getExpirationStatus(details.expiration);
                    // Sanitize data for display
                    const sanitizedName = sanitizeHtml(name);
                    const sanitizedType = sanitizeHtml(details.type || '');
                    
                    return (
                      <div 
                        key={name} 
                        className={`ingredient-card ${expirationStatus ? expirationStatus : ''}`}
                      >
                        <div className="ingredient-icon">
                          {getTypeIcon(details.type)}
                        </div>
                        <div className="ingredient-info">
                          <h4 className="ingredient-name">{sanitizedName}</h4>
                          <div className="ingredient-meta">
                            {details.type && (
                              <span className="ingredient-type">{sanitizedType}</span>
                            )}
                            {details.expiration && (
                              <span className={`ingredient-expiration ${expirationStatus ? expirationStatus : ''}`}>
                                {expirationStatus === 'expired' ? 'Expired: ' : 
                                 expirationStatus === 'expiring-soon' ? 'Expires: ' : 
                                 'Exp: '}
                                {new Date(details.expiration).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <button 
                          className="remove-ingredient-btn"
                          onClick={() => removeIngredient(name)}
                          aria-label={`Remove ${sanitizedName}`}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
                
                <div className="ingredients-actions">
                  <button 
                    className="clear-all-btn"
                    onClick={clearAllIngredients}
                  >
                    Clear All Ingredients
                  </button>
                  
                  <button 
                    className="suggest-recipes-btn"
                    onClick={() => onSendMessage("Can you suggest recipes using ingredients from my pantry?")}
                  >
                    Suggest Recipes
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-pantry">
                <div className="empty-icon">🥄</div>
                <p>Your pantry is empty. Add ingredients above to keep track of what you have at home.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientManagement;