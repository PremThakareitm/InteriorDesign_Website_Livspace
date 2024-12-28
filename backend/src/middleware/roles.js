// Middleware to check user roles
export const roles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    next();
  };
};

// Helper functions to check specific roles
export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

export const isDesigner = (req, res, next) => {
  if (!req.user || req.user.role !== 'designer') {
    return res.status(403).json({ error: 'Designer access required' });
  }
  next();
};

export const isUser = (req, res, next) => {
  if (!req.user || req.user.role !== 'user') {
    return res.status(403).json({ error: 'User access required' });
  }
  next();
};
