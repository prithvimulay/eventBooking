const requireRole = (requiredRole) => {
  return (req, res, next) => {
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];

    if (!userId || !userRole) {
      return res.status(401).json({ error: 'Unauthorized: Missing X-User-Id or X-User-Role headers' });
    }

    if (userRole !== requiredRole) {
      return res.status(403).json({ error: `Forbidden: Endpoint requires ${requiredRole} role.` });
    }

    req.user = { id: userId, role: userRole };
    next();
  };
};

module.exports = requireRole;