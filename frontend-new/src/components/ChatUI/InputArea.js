import React, { useState } from 'react';

const InputArea = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };
  
  return (
    <form className="input-area" onSubmit={handleSubmit}>
      <input
        type="text"
        className="message-input"
        placeholder="Ask for recipe suggestions..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      
      <button type="submit" className="send-button" disabled={!inputValue.trim()}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M22 2L11 13" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M22 2L15 22L11 13L2 9L22 2Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
};

export default InputArea;