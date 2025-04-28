// src/components/Header/Header.js
import React, { useState } from 'react';
import './Header.css';

const Header = ({ onNavigate, currentPage }) => {
  const [users, setUsers] = useState({});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [mode, setMode] = useState('login'); // or 'register'
  const [message, setMessage] = useState('');

  const handleLogin = () => {
    if (users[username] && users[username] === password) {
      setLoggedInUser(username);
      setMessage('');
    } else {
      setMessage('Invalid login!');
    }
  };

  const handleRegister = () => {
    if (users[username]) {
      setMessage('Username taken.');
    } else {
      setUsers(prev => ({ ...prev, [username]: password }));
      setMessage('Registered!');
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setUsername('');
    setPassword('');
    setMessage('');
  };

  const handleSubmit = () => {
    if (mode === 'login') handleLogin();
    else handleRegister();
  };

  // XSS prevention for user inputs
  const sanitizeInput = (text) => {
    if (!text) return '';
    
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .trim();
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo" onClick={() => onNavigate('home')}>
          <span className="logo-icon">🍳</span>
          <h1 className="logo-text">AI Recipe Chef</h1>
        </div>

        <nav className="nav">
          <ul className="nav-list">
            {/* Only include home, meal-planner, and about (removed saved) */}
            {['home', 'meal-planner', 'about'].map((page) => (
              <li key={page} className="nav-item">
                <a 
                  href={`/${page === 'home' ? '' : page}`} 
                  className={`nav-link ${currentPage === page ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(page);
                  }}
                >
                  {page.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="login-box">
          {loggedInUser ? (
            <>
              <span className="welcome">👋 Welcome, {sanitizeInput(loggedInUser)}</span>
              <button className="logout-button" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(sanitizeInput(e.target.value))}
                className="login-input"
                maxLength={20}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="login-input"
                maxLength={20}
              />
              <button className="login-button" onClick={handleSubmit}>
                {mode === 'login' ? 'Login' : 'Register'}
              </button>
              <button
                className="toggle-button"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              >
                {mode === 'login' ? 'Register' : 'Login'}
              </button>
              {message && <p className="login-message">{message}</p>}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;