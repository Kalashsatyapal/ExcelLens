const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const authMiddleware = (roles = []) => {
  // Normalize roles to array
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or malformed token' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;

      // Role-based access control
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: `Access denied for role: ${decoded.role}` });
      }

      next();
    } catch (err) {
      console.error('JWT verification failed:', err.message); // Optional: remove in production
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};

module.exports = authMiddleware;
