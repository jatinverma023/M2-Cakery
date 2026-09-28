const mongoose = require('mongoose');

/**
 * Image sub-schema for product visual assets.
 * Compatible with Cloudinary image management (url + publicId + isPrimary).
 */
const productImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    publicId: {
      type: String,
      default: '',
      trim: true,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

/**
 * Product Schema — Foundation for M² Cakery Celebration Portfolio & Confections.
 *
 * Designed to support:
 * - Celebration cake categories (birthday, wedding, anniversary, celebration, custom)
 * - Confections & dessert treats (desserts)
 * - Flexible pricing structures (fixed, starting_from, enquire)
 * - Cloudinary image asset references
 * - Soft archiving for safe record retention
 */
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['birthday', 'wedding', 'anniversary', 'celebration', 'custom', 'desserts'],
        message: '{VALUE} is not a valid category',
      },
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    pricingType: {
      type: String,
      required: [true, 'Pricing type is required'],
      enum: {
        values: ['fixed', 'starting_from', 'enquire'],
        message: '{VALUE} is not a valid pricing type',
      },
      default: 'enquire',
    },
    price: {
      type: Number,
      default: null,
      min: [0, 'Price must be a positive number or zero'],
      validate: {
        validator: function (val) {
          // If pricingType is 'fixed' or 'starting_from', price must be a valid number >= 0
          if (this.pricingType === 'fixed' || this.pricingType === 'starting_from') {
            return typeof val === 'number' && val >= 0;
          }
          // If pricingType is 'enquire', price should be null or 0
          return true;
        },
        message: 'A valid non-negative price is required when pricing type is fixed or starting_from',
      },
    },
    images: {
      type: [productImageSchema],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: true,
    },
    archived: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for portfolio queries, category filtering, archiving, and sorting
productSchema.index({ category: 1, published: 1, archived: 1, sortOrder: 1 });
productSchema.index({ featured: 1, published: 1, archived: 1 });
productSchema.index({ archived: 1, createdAt: -1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
