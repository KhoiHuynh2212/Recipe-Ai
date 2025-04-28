/**
 * Utility functions for sanitizing user input to prevent XSS attacks
 */

/**
 * Sanitizes text for safe HTML output
 * @param {string} text - The input text to sanitize
 * @return {string} Sanitized text safe for HTML insertion
 */
export const sanitizeHtml = (text) => {
    if (!text) return '';
    
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };
  
  /**
   * Sanitizes text for safe JavaScript usage (e.g., in JSON)
   * @param {string} text - The input text to sanitize
   * @return {string} Sanitized text safe for JavaScript contexts
   */
  export const sanitizeForJavaScript = (text) => {
    if (!text) return '';
    
    try {
      // Using JSON.stringify helps escape characters for JS context
      return JSON.stringify(text).slice(1, -1);
    } catch (e) {
      console.error('Error sanitizing for JavaScript:', e);
      // Fallback to basic sanitization
      return String(text)
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/'/g, "\\'")
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t')
        .replace(/\f/g, '\\f')
        .replace(/\v/g, '\\v');
    }
  };
  
  /**
   * Sanitizes text for URL parameters
   * @param {string} text - The input text to sanitize
   * @return {string} URL-encoded text
   */
  export const sanitizeForUrl = (text) => {
    if (!text) return '';
    
    try {
      return encodeURIComponent(text);
    } catch (e) {
      console.error('Error sanitizing for URL:', e);
      return '';
    }
  };
  
  /**
   * Sanitizes an array of text items for HTML output
   * @param {Array<string>} items - Array of text items to sanitize
   * @return {Array<string>} Array of sanitized text items
   */
  export const sanitizeArrayForHtml = (items) => {
    if (!Array.isArray(items)) return [];
    
    return items.map(item => sanitizeHtml(item));
  };
  
  /**
   * Validates and sanitizes user input for recipe search queries
   * @param {string} query - The user input query to validate and sanitize
   * @return {string} Sanitized query or empty string if invalid
   */
  export const sanitizeSearchQuery = (query) => {
    if (!query) return '';
    
    // Remove any potentially dangerous characters
    const sanitized = String(query)
      .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[^\w\s,.?!]/g, ' ') // Replace special chars with spaces
      .trim();
      
    // Limit query length for safety
    return sanitized.substring(0, 200);
  };
  
  /**
   * Processes recipe data with appropriate encoding for each context
   * @param {string} recipeName - Recipe name to sanitize
   * @param {Array<string>} ingredients - List of ingredients to sanitize
   * @return {Object} Object with sanitized data for different contexts
   */
  export const processRecipeData = (recipeName, ingredients = []) => {
    return {
      htmlSafe: sanitizeHtml(recipeName),
      jsSafe: sanitizeForJavaScript(recipeName),
      urlSafe: sanitizeForUrl(recipeName),
      htmlSafeIngredients: sanitizeArrayForHtml(ingredients)
    };
  };