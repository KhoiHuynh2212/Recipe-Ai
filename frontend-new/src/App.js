import React from 'react';
import Navbar from './components/Navbar';
import RecipeList from './components/RecipeList';

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <Navbar />
      <main style={{ padding: '32px' }}>
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', marginBottom: '32px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '16px' }}>Find Recipes with AI</h1>
          <p style={{ marginBottom: '16px' }}>Enter ingredients you have or your dietary preferences, and our AI will suggest personalized recipes.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="Enter ingredients (e.g., chicken, rice, tomatoes)" 
              style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
            />
            <button style={{ backgroundColor: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
              Find Recipes
            </button>
          </div>
        </div>
        
        <RecipeList />
      </main>
    </div>
  );
}

export default App;