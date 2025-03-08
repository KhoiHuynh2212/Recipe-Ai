import React from 'react';

const FeedbackButtons = ({ messageId, feedback, onFeedback }) => {
  return (
    <div className="feedback-buttons">
      <button 
        className={`feedback-btn positive ${feedback === 'positive' ? 'selected' : ''}`}
        onClick={() => onFeedback(messageId, true)}
        title="This response was helpful"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M7 11V17M17 7V12C17 12 17 13 16 13H9.5C8.5 13 8.5 14 8.5 14V19C8.5 20 9.5 21 10.5 21C11.5 21 11.5 21 12.5 21H13.5M7 7C7 5.89543 7.89543 5 9 5H11.5L17 11V17C17 18.1046 16.1046 19 15 19H9C7.89543 19 7 18.1046 7 17V7Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>
      
      <button 
        className={`feedback-btn negative ${feedback === 'negative' ? 'selected' : ''}`}
        onClick={() => onFeedback(messageId, false)}
        title="This response was not helpful"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M7 13V7M17 17V12C17 12 17 11 16 11H9.5C8.5 11 8.5 10 8.5 10V5C8.5 4 9.5 3 10.5 3C11.5 3 11.5 3 12.5 3H13.5M7 17C7 18.1046 7.89543 19 9 19H11.5L17 13V7C17 5.89543 16.1046 5 15 5H9C7.89543 5 7 5.89543 7 7V17Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default FeedbackButtons;