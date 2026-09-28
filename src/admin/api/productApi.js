import api from './client';

export const productApi = {
  /**
   * Fetch products with query parameters.
   */
  getProducts: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    const queryString = query.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    return api.get(endpoint);
  },

  /**
   * Fetch a single product by its MongoDB ObjectId.
   */
  getProduct: async (id) => {
    return api.get(`/products/${id}`);
  },

  /**
   * Create a new product.
   */
  createProduct: async (productData) => {
    return api.post('/products', productData);
  },

  /**
   * Update an existing product.
   */
  updateProduct: async (id, productData) => {
    return api.put(`/products/${id}`, productData);
  },

  /**
   * Soft-delete / archive a product.
   */
  archiveProduct: async (id) => {
    return api.delete(`/products/${id}`);
  },

  /**
   * Restore an archived product.
   */
  restoreProduct: async (id) => {
    return api.put(`/products/${id}`, { archived: false });
  },

  /**
   * Upload an image file buffer to Cloudinary through the backend upload endpoint.
   * @param {File} file
   * @param {boolean} isPrimary
   */
  uploadImage: async (file, isPrimary = false) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('isPrimary', isPrimary);
    return api.post('/products/upload-image', formData);
  },
};

export default productApi;
