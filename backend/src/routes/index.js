const express = require('express');
const router = express.Router();

const healthRoutes = require('./health');
const authRoutes = require('./auth');
const productRoutes = require('./products');

/**
 * Primary API Router.
 * Centralizes all routes under the /api prefix.
 */

// Health check -> /api/health
router.use('/health', healthRoutes);

// Admin authentication -> /api/auth
router.use('/auth', authRoutes);

// Products catalog & administration -> /api/products
router.use('/products', productRoutes);

module.exports = router;
