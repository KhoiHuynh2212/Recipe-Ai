const jwt = require('jsonwebtoken');

/**
 * Authentication middleware for securing API endpoints
 * Supports both JWT token and API key authentication methods
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    
    // If no auth header is present
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    // Check if it's a JWT token (Bearer token)
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      
      try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user information to the request object
        req.user = decoded;
        return next();
      } catch (err) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid or expired token'
        });
      }
    } 
    // Check if it's an API key
    else if (authHeader.startsWith('ApiKey ')) {
      const apiKey = authHeader.substring(7); // Remove 'ApiKey ' prefix
      
      // Validate API key
      if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid API key'
        });
      }
      
      // For API key auth, we don't have user info, but we can set a flag
      req.isApiAuthenticated = true;
      return next();
    }
    // Invalid auth header format
    else {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid authentication format'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication error'
    });
  }
};

module.exports = authMiddleware;