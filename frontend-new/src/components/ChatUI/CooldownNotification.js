// src/components/ChatUI/CooldownNotification.js
// Grabiel

import React from 'react';
import './CooldownNotification.css';

const CooldownNotification = ({ isActive, timeLeftSeconds, maxRequests }) => {
  if (!isActive) return null;
  
  return (
    <div className="cooldown-notification">
      <div className="cooldown-content">
        <div className="cooldown-icon">⏳</div>
        <div className="cooldown-message">
          <h4>Taking a short break</h4>
          <p>
            You've reached the limit of {maxRequests} consecutive requests. 
            Please wait {timeLeftSeconds} seconds before making another request.
          </p>
          <div className="cooldown-progress">
            <div 
              className="cooldown-bar"
              style={{ 
                width: `${Math.min(100, (30 - timeLeftSeconds) / 30 * 100)}%` 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CooldownNotification;