import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">🍳</span>
          <h1 className="logo-text">AI Recipe Chef</h1>
        </div>
        
        <nav className="nav">
          <ul className="nav-list">
            <li className="nav-item">
              <a href="#" className="nav-link active">Home</a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">Saved Recipes</a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">About</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;