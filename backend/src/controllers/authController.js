const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Handle Administrator Login.
 * Validates credentials and returns JWT bearer token on success.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Locate administrator record
    const admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin) {
      // Use generic error message to prevent account enumeration
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // 2. Verify password hash using bcrypt
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // 3. Ensure JWT secret is configured
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('[Auth Error] JWT_SECRET is not configured in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Authentication service configuration error',
      });
    }

    // 4. Generate JWT
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
      secret,
      { expiresIn }
    );

    // 5. Respond with token and safe admin profile
    return res.status(200).json({
      success: true,
      data: {
        token,
        admin: {
          id: admin._id,
          email: admin.email,
          role: admin.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get Current Authenticated Administrator Profile.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getMe(req, res) {
  return res.status(200).json({
    success: true,
    data: {
      admin: req.admin,
    },
  });
}

module.exports = {
  login,
  getMe,
};
