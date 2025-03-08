/**
 * Collection of helper utility functions for the AI Recipe Chatbot
 */

/**
 * Format a timestamp into a readable time string
 * @param {Date|string|number} timestamp - The timestamp to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted time string
 */
export const formatTimestamp = (timestamp, options = {}) => {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    
    const defaultOptions = { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    };
    
    const formatOptions = { ...defaultOptions, ...options };
    
    return date.toLocaleTimeString([], formatOptions);
  };
  
  /**
   * Truncate text to a specified length with ellipsis
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length before truncating
   * @returns {string} Truncated text
   */
  export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return `${text.substring(0, maxLength).trim()}...`;
  };
  
  /**
   * Generate a random ID for chat messages
   * @returns {string} Random ID
   */
  export const generateMessageId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  };
  
  /**
   * Debounce a function call
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  export const debounce = (func, wait = 300) => {
    let timeout;
    
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  /**
   * Parse ingredients from a comma-separated string
   * @param {string} ingredientsString - Comma separated ingredients
   * @returns {Array} Array of ingredient strings
   */
  export const parseIngredients = (ingredientsString) => {
    if (!ingredientsString) return [];
    
    return ingredientsString
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };
  
  /**
   * Get a readable time estimate from minutes
   * @param {number} minutes - Cooking time in minutes
   * @returns {string} Formatted time string
   */
  export const formatCookingTime = (minutes) => {
    if (!minutes || minutes <= 0) return 'Unknown time';
    
    if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? '' : 's'}`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} hour${hours === 1 ? '' : 's'}`;
    }
    
    return `${hours} hour${hours === 1 ? '' : 's'} ${remainingMinutes} minute${remainingMinutes === 1 ? '' : 's'}`;
  };
  
  /**
   * Check if an object is empty
   * @param {Object} obj - Object to check
   * @returns {boolean} True if object is empty
   */
  export const isEmptyObject = (obj) => {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
  };
  
  /**
   * Store data in localStorage with expiration
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @param {number} expirationHours - Hours until expiration
   */
  export const setWithExpiry = (key, value, expirationHours = 24) => {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + (expirationHours * 60 * 60 * 1000)
    };
    localStorage.setItem(key, JSON.stringify(item));
  };
  
  /**
   * Get data from localStorage and check expiration
   * @param {string} key - Storage key
   * @returns {any|null} Stored value or null if expired/not found
   */
  export const getWithExpiry = (key) => {
    const itemStr = localStorage.getItem(key);
    
    if (!itemStr) return null;
    
    const item = JSON.parse(itemStr);
    const now = new Date();
    
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.value;
  };