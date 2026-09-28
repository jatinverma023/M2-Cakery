import { useState, useEffect, useCallback } from 'react';
import { fetchPublishedProducts, normalizeProducts } from '../services/productApi';
import { CAKES } from '../data/cakes';

/**
 * Custom React Hook to load published products from the M² Cakery API
 * with automatic, resilient fallback to the curated static portfolio.
 *
 * @param {object} [options]
 * @param {string} [options.category]
 * @param {boolean} [options.featured]
 * @param {number} [options.limit=50]
 * @returns {{
 *   products: Array<object>,
 *   loading: boolean,
 *   error: Error|null,
 *   isFallback: boolean,
 *   refresh: () => Promise<void>
 * }}
 */
export function useProducts(options = {}) {
  const { category, featured, limit } = options;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchPublishedProducts({ category, featured, limit });
      if (response && Array.isArray(response.data)) {
        setProducts(response.data);
        setIsFallback(false);
      }
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          '[M² Cakery Storefront] Live API unavailable:',
          err.message,
          '— Displaying curated fallback portfolio.'
        );
      }
      setError(err);
      setIsFallback(true);

      // Gracefully fall back to normalized static catalog
      let fallbackData = normalizeProducts(CAKES);
      if (category && category !== 'all') {
        fallbackData = fallbackData.filter((c) => c.category === category);
      }
      if (featured !== undefined) {
        fallbackData = fallbackData.filter((c) => Boolean(c.featured) === Boolean(featured));
      }
      setProducts(fallbackData);
    } finally {
      setLoading(false);
    }
  }, [category, featured, limit]);

  useEffect(() => {
    let isMounted = true;

    loadProducts().catch(() => {
      // Caught in loadProducts
    });

    return () => {
      isMounted = false;
    };
  }, [loadProducts]);

  return {
    products,
    loading,
    error,
    isFallback,
    refresh: loadProducts,
  };
}

export default useProducts;
