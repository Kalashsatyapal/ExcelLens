const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = process.env;

// Optional: define role hierarchy if needed
const roleHierarchy = {
  superadmin: 3,
  admin: 2,
  user: 1,
};

const authMiddleware = (requiredRoles = []) => {
  // Normalize roles to array
  if (typeof requiredRoles === 'string') {
    requiredRoles = [requiredRoles];
  }

  return async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or malformed token' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      // Optional: attach full user object (excluding password)
      const user = await User.findById(decoded.userId).select('+password');
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user;

      // Role-based access control
      if (requiredRoles.length > 0) {
        const userRole = user.role;

        // Option 1: strict match
        // if (!requiredRoles.includes(userRole)) {
        //   return res.status(403).json({ message: `Access denied for role: ${userRole}` });
        // }

        // Option 2: hierarchical match
        const requiredLevel = Math.min(...requiredRoles.map(r => roleHierarchy[r] || 0));
        const userLevel = roleHierarchy[userRole] || 0;

        if (userLevel < requiredLevel) {
          console.warn(`Unauthorized access attempt by ${userRole} on ${req.originalUrl}`);
          return res.status(403).json({ message: `Insufficient role level: ${userRole}` });
        }
      }

      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      console.error('JWT verification failed:', err.message);
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};

module.exports = authMiddleware;
