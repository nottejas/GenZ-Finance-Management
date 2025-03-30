const jwt = require('jsonwebtoken');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// Middleware to authenticate using JWT tokens for local testing
const jwtAuth = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // In a real app, you would verify this token with JWT
    // For our mock implementation, we'll just decode it
    // In production, you would use jwt.verify with a secret key
    const decoded = jwt.decode(token);
    
    if (!decoded || !decoded.sub) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    
    // Set user info in request object
    req.auth = {
      userId: decoded.sub,
      sessionId: decoded.sid || null
    };
    
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Choose the appropriate auth middleware based on environment
const requireAuth = process.env.NODE_ENV === 'production' 
  ? ClerkExpressRequireAuth()  // Use Clerk in production
  : jwtAuth;                   // Use JWT auth in development

module.exports = { requireAuth }; 