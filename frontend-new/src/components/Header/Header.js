// src/components/Header/Header.js
import React, { useState } from 'react';
import './Header.css';

const Header = ({ onNavigate, currentPage }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo" onClick={() => onNavigate('home')}>
          <span className="logo-icon">🍳</span>
          <h1 className="logo-text">AI Recipe Chef</h1>
        </div>

        <nav className="nav">
          <ul className="nav-list">
            <li className="nav-item">
              <a 
                href="/" 
                className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('home');
                }}
              >
                Home
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="/meal-planner" 
                className={`nav-link ${currentPage === 'meal-planner' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('meal-planner');
                }}
              >
                Meal Planner
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="/saved" 
                className={`nav-link ${currentPage === 'saved' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('saved');
                }}
              >
                Saved Recipes
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="/about" 
                className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('about');
                }}
              >
                About
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
