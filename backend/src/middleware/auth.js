const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware.
 * Verifies JWT bearer token from the Authorization header and attaches admin identity to req.admin.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required: No bearer token provided',
    });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error('[Auth Error] JWT_SECRET is not configured in environment variables');
    return res.status(500).json({
      success: false,
      message: 'Authentication service configuration error',
    });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.admin = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || 'admin',
    };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Authentication token has expired. Please log in again.',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token',
    });
  }
}

/**
 * Optional Authentication Middleware.
 * If token is present and valid, attaches admin to req.admin.
 * Does not reject requests if token is missing.
 * Useful for public endpoints where admin can see unpublished items.
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) return next();

  try {
    const decoded = jwt.verify(token, secret);
    req.admin = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || 'admin',
    };
  } catch (_) {
    // Silently continue as unauthenticated for optional auth
  }
  next();
}

module.exports = {
  requireAuth,
  optionalAuth,
};
