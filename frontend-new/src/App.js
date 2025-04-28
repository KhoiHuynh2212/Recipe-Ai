// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header/Header';
import ChatUI from './components/ChatUI/ChatUI';
import Footer from './components/Footer/Footer';
import MealPlanner from './components/MealPlanner/MealPlanner';
import { ChatProvider } from './contexts/ChatContext';
import { NotificationProvider } from './contexts/NotificationContext';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Check the URL path on mount and when it changes
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('meal-planner')) {
      setCurrentPage('meal-planner');
    } else if (path.includes('about')) {
      setCurrentPage('about');
    } else {
      setCurrentPage('home');
    }

    // Listen for popstate events (browser back/forward buttons)
    const handlePopState = () => {
      const newPath = window.location.pathname;
      if (newPath.includes('meal-planner')) {
        setCurrentPage('meal-planner');
      } else if (newPath.includes('about')) {
        setCurrentPage('about');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation handling function to be passed to Header
  const navigate = (page) => {
    setCurrentPage(page);
    let path = '/';
    if (page === 'meal-planner') path = '/meal-planner';
    else if (page === 'about') path = '/about';
    
    window.history.pushState({}, '', path);
  };

  return (
    <NotificationProvider>
      <div className="app">
        <ChatProvider>
          <Header onNavigate={navigate} currentPage={currentPage} />
          <main className="main-content">
            {currentPage === 'home' && <ChatUI onShowMealPlanner={() => navigate('meal-planner')} />}
            {currentPage === 'meal-planner' && <MealPlanner onGoBack={() => navigate('home')} />}
            {currentPage === 'about' && (
              <div className="about-container">
                <h2>About AI Recipe Chef</h2>
                <p>
                  AI Recipe Chef is an intelligent cooking assistant that helps you discover 
                  delicious recipes based on your preferences, dietary restrictions, and 
                  available ingredients.
                </p>
                <p>
                  Our application uses advanced AI to provide personalized recipe suggestions, 
                  answer cooking questions, and help you plan meals.
                </p>
                <h3>Features</h3>
                <ul>
                  <li>Personalized recipe recommendations</li>
                  <li>Dietary restriction and allergen management</li>
                  <li>Pantry tracking to use what you have</li>
                  <li>Smart meal planning</li>
                  <li>Nutritional guidance and meal customization</li>
                </ul>
                <p>
                  AI Recipe Chef is constantly learning and improving to better serve your 
                  culinary needs!
                </p>
              </div>
            )}
          </main>
          <Footer />
        </ChatProvider>
      </div>
    </NotificationProvider>
  );
}

export default App;