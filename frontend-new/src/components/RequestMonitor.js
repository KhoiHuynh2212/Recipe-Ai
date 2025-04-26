// src/components/ChatUI/RequestMonitor.js
import React from 'react';

const RequestMonitor = ({ requestCount, maxRequests }) => {
  // Generate array of request indicators
  const requestDots = Array(maxRequests).fill().map((_, index) => {
    let status = 'inactive';
    
    if (index < requestCount) {
      status = 'active';
    }
    
    // Show warning if close to limit
    if (index < requestCount && index >= maxRequests - 2) {
      status = 'warning';
    }
    
    return (
      <div 
        key={index} 
        className={`request-dot ${status}`}
        title={`Request ${index + 1} of ${maxRequests}`}
      ></div>
    );
  });
  
  return (
    <div className="request-monitor">
      <div className="request-count">
        {requestDots}
      </div>
      <span>
        {maxRequests - requestCount} {maxRequests - requestCount === 1 ? 'request' : 'requests'} remaining before cooldown
      </span>
    </div>
  );
};

export default RequestMonitor;