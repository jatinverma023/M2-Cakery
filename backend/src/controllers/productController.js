const Product = require('../models/Product');
const { deleteMultipleImages } = require('../services/cloudinaryService');

/**
 * GET /api/products
 * Public listing of published products with filtering, pagination, and sorting.
 */
async function getProducts(req, res, next) {
  try {
    const { category, featured, published, archived, page = 1, limit = 20, sort } = req.query;

    const isAdmin = Boolean(req.admin);
    const filter = {};

    // 1. Archival filter: Public users can never view archived products
    if (isAdmin && (archived === 'true' || archived === 'all')) {
      if (archived === 'true') filter.archived = true;
    } else {
      filter.archived = false;
    }

    // 2. Publication filter: Public users only view published products
    if (isAdmin && published !== undefined) {
      if (published === 'true') filter.published = true;
      else if (published === 'false') filter.published = false;
      // if 'all', don't set published filter
    } else {
      filter.published = true;
    }

    // 3. Category filter
    if (category && typeof category === 'string') {
      filter.category = category.trim().toLowerCase();
    }

    // 4. Featured filter
    if (featured !== undefined) {
      filter.featured = featured === 'true' || featured === true;
    }

    // 5. Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    // 6. Sorting
    let sortOption = { sortOrder: 1, createdAt: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'price_asc') sortOption = { price: 1, createdAt: -1 };
    else if (sort === 'price_desc') sortOption = { price: -1, createdAt: -1 };

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    const pages = Math.ceil(total / limitNum) || 1;

    return res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/products/:id
 * Retrieve a single product by ID.
 * Public users can only view published, non-archived products.
 */
async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const isAdmin = Boolean(req.admin);

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Restrict access to archived or draft products for non-admin requests
    if (!isAdmin && (product.archived || !product.published)) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/products
 * Create a new product. (Admin Only)
 */
async function createProduct(req, res, next) {
  try {
    const {
      title,
      category,
      description = '',
      pricingType = 'enquire',
      price = null,
      images = [],
      featured = false,
      published = true,
      sortOrder = 0,
    } = req.body;

    const normalizedPrice = pricingType === 'enquire' ? null : price;

    const product = await Product.create({
      title: title.trim(),
      category: category.trim().toLowerCase(),
      description: typeof description === 'string' ? description.trim() : '',
      pricingType,
      price: normalizedPrice,
      images,
      featured: Boolean(featured),
      published: Boolean(published),
      archived: false,
      sortOrder: Number(sortOrder) || 0,
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/products/:id
 * Update an existing product. (Admin Only)
 */
async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const {
      title,
      category,
      description,
      pricingType,
      price,
      images,
      featured,
      published,
      archived,
      sortOrder,
    } = req.body;

    if (title !== undefined) product.title = title.trim();
    if (category !== undefined) product.category = category.trim().toLowerCase();
    if (description !== undefined) product.description = description.trim();
    if (pricingType !== undefined) {
      product.pricingType = pricingType;
      if (pricingType === 'enquire') product.price = null;
    }
    if (price !== undefined && product.pricingType !== 'enquire') {
      product.price = price;
    }

    // If new images array is supplied, detect removed Cloudinary publicIds
    if (images !== undefined && Array.isArray(images)) {
      const oldPublicIds = (product.images || []).map((img) => img.publicId).filter(Boolean);
      const newPublicIds = images.map((img) => img.publicId).filter(Boolean);
      const removedPublicIds = oldPublicIds.filter((pId) => !newPublicIds.includes(pId));

      // Asynchronously trigger Cloudinary deletion for removed images without blocking response
      if (removedPublicIds.length > 0) {
        deleteMultipleImages(removedPublicIds).catch((err) => {
          console.error('[Cloudinary Cleanup Warning]:', err.message);
        });
      }

      product.images = images;
    }

    if (featured !== undefined) product.featured = Boolean(featured);
    if (published !== undefined) product.published = Boolean(published);
    if (archived !== undefined) product.archived = Boolean(archived);
    if (sortOrder !== undefined) product.sortOrder = Number(sortOrder) || 0;

    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/products/:id
 * Soft delete (archive) a product rather than permanently destroying records. (Admin Only)
 */
async function archiveProduct(req, res, next) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Soft delete / archive
    product.archived = true;
    product.published = false;
    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product archived successfully',
      data: {
        id: product._id,
        archived: true,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  archiveProduct,
};
