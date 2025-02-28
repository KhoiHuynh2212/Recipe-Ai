
import React from 'react';

function Navbar() {
  return (
    <nav style={{ backgroundColor: '#3b82f6', color: 'white', padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>AI Recipe Cooking App 🍳</div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <a href="#" style={{ color: 'white' }}>Home</a>
          <a href="#" style={{ color: 'white' }}>Recipes</a>
          <a href="#" style={{ color: 'white' }}>My Profile</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;