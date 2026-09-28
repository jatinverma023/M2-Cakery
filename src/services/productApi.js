/**
 * M² Cakery — Public Product API Service & Normalization Layer
 * Connects the customer-facing storefront to GET /api/products with resilient fallback.
 */

import cakePlaceholder from '../assets/cakes/cake-placeholder.svg';
import { CATEGORY_LABELS } from '../data/cakes';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Format product price according to pricing mode and Indian Rupee currency standard.
 *
 * Rules:
 * - 'fixed'         -> ₹1,500
 * - 'starting_from' -> From ₹1,500
 * - 'enquire'       -> Enquire for pricing
 * - Never returns ₹0, NaN, undefined, or null.
 *
 * @param {number|null} price
 * @param {string} pricingType
 * @returns {string}
 */
export function formatPrice(price, pricingType = 'enquire') {
  if (pricingType === 'enquire') {
    return 'Enquire for pricing';
  }

  const numPrice = Number(price);
  if (price === null || price === undefined || isNaN(numPrice) || numPrice <= 0) {
    return 'Enquire for pricing';
  }

  try {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(numPrice);

    if (pricingType === 'starting_from') {
      return `From ${formatted}`;
    }

    return formatted;
  } catch (_) {
    return pricingType === 'starting_from' ? `From ₹${numPrice}` : `₹${numPrice}`;
  }
}

/**
 * Select the primary image URL from an array of image objects.
 * Respects isPrimary flag and falls back to first image or placeholder.
 *
 * @param {Array<{url: string, isPrimary?: boolean}>} images
 * @param {string} fallback
 * @returns {string}
 */
export function getPrimaryImageUrl(images, fallback = cakePlaceholder) {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return fallback;
  }

  const primary = images.find((img) => img && img.isPrimary && img.url);
  if (primary && primary.url) return primary.url;

  const firstValid = images.find((img) => img && img.url);
  if (firstValid && firstValid.url) return firstValid.url;

  return fallback;
}

/**
 * Normalize an individual product from either MongoDB API or static data source.
 * Produces a unified UI model for CakePortfolio, CakeCard, Collection, and Modals.
 *
 * @param {object} product
 * @returns {object|null}
 */
export function normalizeProduct(product) {
  if (!product || typeof product !== 'object') return null;

  const id = product._id || product.id || `m2-${Math.random().toString(36).slice(2, 9)}`;
  const title = (product.title || product.name || 'Handcrafted Confection').trim();
  const rawCat = (product.category || 'celebration').toLowerCase().trim();
  const categoryLabel = CATEGORY_LABELS[rawCat] || product.categoryLabel || rawCat;

  // Extract images
  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : product.image
      ? [{ url: product.image, isPrimary: true }]
      : [];

  const primaryImage = getPrimaryImageUrl(images, product.image || cakePlaceholder);

  const pricingType = product.pricingType || (product.price ? 'fixed' : 'enquire');
  const price = product.price !== undefined ? product.price : null;
  const priceFormatted = formatPrice(price, pricingType);

  const description = (product.description || product.shortDesc || product.fullDesc || '').trim();

  return {
    id,
    _id: product._id,
    title,
    name: title,
    category: rawCat,
    categoryLabel,
    image: primaryImage,
    images: images.length > 0 ? images : [{ url: primaryImage, isPrimary: true }],
    alt: product.alt || `${title} handcrafted by M² Cakery`,
    tag: product.tag || (product.featured ? 'Featured Design' : ''),
    description,
    shortDesc: (product.shortDesc || description).trim(),
    fullDesc: (product.fullDesc || description).trim(),
    pricingType,
    price,
    priceFormatted,
    priceLabel: priceFormatted,
    featured: Boolean(product.featured),
    published: product.published !== false,
    archived: Boolean(product.archived),
    sortOrder: Number(product.sortOrder) || 0,
    leadTime: product.leadTime || 'Order in advance',
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    flavourNotes: product.flavourNotes || '',
    occasions: product.occasions || '',
    raw: product,
  };
}

/**
 * Normalize an array of products, filtering out nulls.
 *
 * @param {Array<object>} products
 * @returns {Array<object>}
 */
export function normalizeProducts(products) {
  if (!Array.isArray(products)) return [];
  return products
    .map(normalizeProduct)
    .filter((p) => p !== null && p.published && !p.archived);
}

/**
 * Fetch published, non-archived products from the public API.
 * Includes abort timeout for fast fallback if server is unreachable.
 *
 * @param {object} [params]
 * @param {string} [params.category]
 * @param {boolean} [params.featured]
 * @param {number} [params.limit=50]
 * @returns {Promise<{success: boolean, data: Array<object>, pagination: object}>}
 */
export async function fetchPublishedProducts(params = {}) {
  const query = new URLSearchParams();
  if (params.category && params.category !== 'all') {
    query.set('category', params.category);
  }
  if (params.featured !== undefined) {
    query.set('featured', String(params.featured));
  }
  query.set('limit', String(params.limit || 50));

  const queryString = query.toString();
  const url = `${API_BASE_URL}/products${queryString ? `?${queryString}` : ''}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API responded with HTTP status ${response.status}`);
    }

    const result = await response.json();
    if (!result.success || !Array.isArray(result.data)) {
      throw new Error(result.message || 'Invalid API response format');
    }

    // Defensive client-side check for published and non-archived
    const activeProducts = result.data.filter(
      (item) => item.published !== false && !item.archived
    );

    return {
      success: true,
      data: normalizeProducts(activeProducts),
      pagination: result.pagination || { total: activeProducts.length },
    };
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Fetch a single published product by ID.
 *
 * @param {string} id
 * @returns {Promise<object|null>}
 */
export async function fetchPublishedProductById(id) {
  const url = `${API_BASE_URL}/products/${id}`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Product not found or unavailable (status ${response.status})`);
  }

  const result = await response.json();
  if (!result.success || !result.data) {
    throw new Error(result.message || 'Failed to retrieve product');
  }

  return normalizeProduct(result.data);
}

export default {
  formatPrice,
  getPrimaryImageUrl,
  normalizeProduct,
  normalizeProducts,
  fetchPublishedProducts,
  fetchPublishedProductById,
};
