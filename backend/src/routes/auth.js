const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { validateLoginInput } = require('../middleware/validation');
const { requireAuth } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', validateLoginInput, authController.login);

// GET /api/auth/me (Protected)
router.get('/me', requireAuth, authController.getMe);

module.exports = router;
