const express = require('express');
const multer = require('multer');
const router = express.Router();

const productController = require('../controllers/productController');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const {
  validateObjectId,
  validateProductInput,
  validateProductUpdate,
} = require('../middleware/validation');
const {
  validateImageFile,
  uploadImageBuffer,
} = require('../services/cloudinaryService');

// Multer memory storage configuration (buffers file in memory for direct Cloudinary streaming)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ==========================================
// PUBLIC ROUTES
// ==========================================

// GET /api/products — Query list of published, non-archived products
router.get('/', optionalAuth, productController.getProducts);

// GET /api/products/:id — Retrieve single product details
router.get('/:id', optionalAuth, validateObjectId('id'), productController.getProductById);

// ==========================================
// ADMIN PROTECTED ROUTES
// ==========================================

// POST /api/products/upload-image — Upload single image buffer to Cloudinary (Admin Only)
router.post(
  '/upload-image',
  requireAuth,
  upload.single('image'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file uploaded. Form field name must be "image".',
        });
      }

      validateImageFile(req.file);

      const result = await uploadImageBuffer(req.file.buffer, {
        isPrimary: req.body.isPrimary === 'true' || req.body.isPrimary === true,
      });

      return res.status(200).json({
        success: true,
        message: 'Image uploaded to Cloudinary successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/products — Create new product record (Admin Only)
router.post('/', requireAuth, validateProductInput, productController.createProduct);

// PUT /api/products/:id — Update existing product (Admin Only)
router.put(
  '/:id',
  requireAuth,
  validateObjectId('id'),
  validateProductUpdate,
  productController.updateProduct
);

// DELETE /api/products/:id — Soft-delete / archive product (Admin Only)
router.delete(
  '/:id',
  requireAuth,
  validateObjectId('id'),
  productController.archiveProduct
);

module.exports = router;
