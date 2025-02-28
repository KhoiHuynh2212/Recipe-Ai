// src/components/RecipeList.js
import React from 'react';
import RecipeCard from './RecipeCard';

function RecipeList() {
  // Sample data - in a real app, this would come from an API
  const recipes = [
    {
      id: 1,
      title: 'Vegetable Pasta',
      time: 30,
      diet: 'Vegetarian',
      ingredients: ['pasta', 'tomatoes', 'spinach', 'garlic']
    },
    {
      id: 2,
      title: 'Chicken Curry',
      time: 45,
      diet: 'High Protein',
      ingredients: ['chicken', 'curry paste', 'coconut milk', 'rice']
    },
    {
      id: 3,
      title: 'Berry Smoothie',
      time: 10,
      diet: 'Vegan',
      ingredients: ['berries', 'banana', 'almond milk', 'protein powder']
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 0' }}>
      <h2 style={{ 
        fontSize: '1.5rem', 
        fontWeight: 'bold',
        marginBottom: '24px'
      }}>Recommended Recipes</h2>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        {recipes.map(recipe => (
          <RecipeCard 
            key={recipe.id}
            title={recipe.title}
            time={recipe.time}
            diet={recipe.diet}
            ingredients={recipe.ingredients}
          />
        ))}
      </div>
    </div>
  );
}

export default RecipeList;