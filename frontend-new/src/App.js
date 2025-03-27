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
    } else if (path.includes('saved')) {
      setCurrentPage('saved');
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
      } else if (newPath.includes('saved')) {
        setCurrentPage('saved');
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
    else if (page === 'saved') path = '/saved';
    else if (page === 'about') path = '/about';
    
    window.history.pushState({}, '', path);
  };

  return (
    <NotificationProvider>
      <div className="app">
        <ChatProvider>
          <Header onNavigate={navigate} currentPage={currentPage} />
          <main className="main-content">
            {currentPage === 'home' && <ChatUI />}
            {currentPage === 'meal-planner' && <MealPlanner onGoBack={() => navigate('home')} />}
            {/* Add other page components as needed */}
            {currentPage === 'saved' && <div>Saved Recipes Page</div>}
            {currentPage === 'about' && <div>About Page</div>}
          </main>
          <Footer />
        </ChatProvider>
      </div>
    </NotificationProvider>
  );
}

export default App;