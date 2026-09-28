const mongoose = require('mongoose');

const VALID_CATEGORIES = ['birthday', 'wedding', 'anniversary', 'celebration', 'custom', 'desserts'];
const VALID_PRICING_TYPES = ['fixed', 'starting_from', 'enquire'];

/**
 * Validate MongoDB ObjectId in request parameters.
 * @param {string} [paramName='id']
 */
function validateObjectId(paramName = 'id') {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid identifier format: '${id}'`,
      });
    }
    next();
  };
}

/**
 * Validate login request body.
 */
function validateLoginInput(req, res, next) {
  const { email, password } = req.body || {};

  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Email address is required',
    });
  }

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email format',
    });
  }

  if (!password || typeof password !== 'string' || !password.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Password is required',
    });
  }

  next();
}

/**
 * Validate product creation request body.
 */
function validateProductInput(req, res, next) {
  const { title, category, pricingType, price, images } = req.body || {};

  // 1. Title validation
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Product title is required and cannot be empty',
    });
  }
  if (title.trim().length > 150) {
    return res.status(400).json({
      success: false,
      message: 'Product title cannot exceed 150 characters',
    });
  }

  // 2. Category validation
  if (!category || typeof category !== 'string' || !VALID_CATEGORIES.includes(category.trim().toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: `Invalid category '${category}'. Allowed categories: ${VALID_CATEGORIES.join(', ')}`,
    });
  }

  // 3. Pricing type & Price validation
  const pType = pricingType || 'enquire';
  if (!VALID_PRICING_TYPES.includes(pType)) {
    return res.status(400).json({
      success: false,
      message: `Invalid pricing type '${pType}'. Allowed: ${VALID_PRICING_TYPES.join(', ')}`,
    });
  }

  if (pType === 'fixed' || pType === 'starting_from') {
    if (price === undefined || price === null || typeof price !== 'number' || price < 0 || isNaN(price)) {
      return res.status(400).json({
        success: false,
        message: `A valid non-negative price is required when pricing type is '${pType}'`,
      });
    }
  } else if (pType === 'enquire') {
    // If enquire, normalize price to null
    req.body.price = null;
  }

  // 4. Images validation (if provided)
  if (images !== undefined) {
    if (!Array.isArray(images)) {
      return res.status(400).json({
        success: false,
        message: 'Images must be an array of image objects',
      });
    }

    for (const img of images) {
      if (!img || typeof img.url !== 'string' || !img.url.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Each image must have a valid url property',
        });
      }
    }
  }

  next();
}

/**
 * Validate product update request body (allows partial updates).
 */
function validateProductUpdate(req, res, next) {
  const { title, category, pricingType, price, images } = req.body || {};

  if (title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Product title cannot be empty',
      });
    }
    if (title.trim().length > 150) {
      return res.status(400).json({
        success: false,
        message: 'Product title cannot exceed 150 characters',
      });
    }
  }

  if (category !== undefined) {
    if (typeof category !== 'string' || !VALID_CATEGORIES.includes(category.trim().toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid category '${category}'. Allowed: ${VALID_CATEGORIES.join(', ')}`,
      });
    }
  }

  if (pricingType !== undefined) {
    if (!VALID_PRICING_TYPES.includes(pricingType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid pricing type '${pricingType}'. Allowed: ${VALID_PRICING_TYPES.join(', ')}`,
      });
    }

    if (pricingType === 'fixed' || pricingType === 'starting_from') {
      if (price !== undefined && (typeof price !== 'number' || price < 0 || isNaN(price))) {
        return res.status(400).json({
          success: false,
          message: `Price must be a valid non-negative number for '${pricingType}'`,
        });
      }
    } else if (pricingType === 'enquire') {
      req.body.price = null;
    }
  }

  if (images !== undefined) {
    if (!Array.isArray(images)) {
      return res.status(400).json({
        success: false,
        message: 'Images must be an array of image objects',
      });
    }
  }

  next();
}

module.exports = {
  validateObjectId,
  validateLoginInput,
  validateProductInput,
  validateProductUpdate,
  VALID_CATEGORIES,
  VALID_PRICING_TYPES,
};
