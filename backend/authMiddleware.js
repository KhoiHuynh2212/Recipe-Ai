// backend/authMiddleware.js
function authMiddleware(req, res, next) {
    const token = req.headers['authorization'];
  
    if (!token || token !== process.env.AUTH_TOKEN) {
      return res.status(401).json({ success: false, message: 'Unauthorized access' });
    }
  
    next();
  }
  
  module.exports = authMiddleware;

  