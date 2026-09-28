import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ProductTable from '../components/ProductTable';
import ProductFilters from '../components/ProductFilters';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';
import productApi from '../api/productApi';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedFeatured, setSelectedFeatured] = useState('all');

  // Archive dialog state
  const [productToArchive, setProductToArchive] = useState(null);
  const [archiving, setArchiving] = useState(false);

  const { addToast } = useToast();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productApi.getProducts({
        published: 'all',
        archived: 'all',
        limit: 50,
      });
      setProducts(response?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Combined client-side filtering and search
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // 1. Search filter (title, category, description)
      if (searchTerm.trim()) {
        const query = searchTerm.trim().toLowerCase();
        const matchesTitle = prod.title?.toLowerCase().includes(query);
        const matchesCategory = prod.category?.toLowerCase().includes(query);
        const matchesDesc = prod.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCategory && !matchesDesc) {
          return false;
        }
      }

      // 2. Category filter
      if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
        return false;
      }

      // 3. Status filter
      if (selectedStatus === 'published' && (!prod.published || prod.archived)) {
        return false;
      }
      if (selectedStatus === 'draft' && (prod.published || prod.archived)) {
        return false;
      }
      if (selectedStatus === 'archived' && !prod.archived) {
        return false;
      }

      // 4. Featured filter
      if (selectedFeatured === 'featured' && !prod.featured) {
        return false;
      }
      if (selectedFeatured === 'not_featured' && prod.featured) {
        return false;
      }

      return true;
    });
  }, [products, searchTerm, selectedCategory, selectedStatus, selectedFeatured]);

  const hasActiveFilters =
    Boolean(searchTerm.trim()) ||
    selectedCategory !== 'all' ||
    selectedStatus !== 'all' ||
    selectedFeatured !== 'all';

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedFeatured('all');
  };

  const handleConfirmArchive = async () => {
    if (!productToArchive) return;
    setArchiving(true);
    try {
      await productApi.archiveProduct(productToArchive._id);
      addToast(`"${productToArchive.title}" was archived successfully.`, 'success');
      setProductToArchive(null);
      fetchProducts();
    } catch (err) {
      addToast(err.message || 'Failed to archive product', 'error');
    } finally {
      setArchiving(false);
    }
  };

  const handleRestore = async (product) => {
    try {
      await productApi.restoreProduct(product._id);
      addToast(`"${product.title}" restored successfully.`, 'success');
      fetchProducts();
    } catch (err) {
      addToast(err.message || 'Failed to restore product', 'error');
    }
  };

  return (
    <div className="admin-products-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <span className="admin-page-tag">CATALOG MANAGEMENT</span>
          <h1 className="admin-page-title">Products &amp; Cake Portfolio</h1>
          <p className="admin-page-subtitle">
            Create, update, archive, and manage visual cake designs and celebration confections.
          </p>
        </div>

        <div className="admin-page-actions">
          <Link to="/admin/products/new" className="admin-btn admin-btn-primary">
            <span>+ Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Filters & Search Component */}
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedFeatured={selectedFeatured}
        onFeaturedChange={setSelectedFeatured}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Products Result Section */}
      <div className="admin-products-list-wrap">
        <div className="admin-results-bar">
          <span className="admin-results-count">
            Showing <strong>{filteredProducts.length}</strong> of{' '}
            <strong>{products.length}</strong> items
          </span>
          {hasActiveFilters && (
            <span className="admin-filter-indicator">Filtered view active</span>
          )}
        </div>

        {loading ? (
          <div className="admin-page-loading">
            <div className="admin-spinner" />
            <p className="admin-loading-text">Loading catalog items...</p>
          </div>
        ) : error ? (
          <div className="admin-page-error">
            <div className="admin-error-card">
              <span className="admin-error-icon" aria-hidden="true">
                ⚠
              </span>
              <h3>Failed to Load Products</h3>
              <p>{error}</p>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={fetchProducts}
              >
                Try Again
              </button>
            </div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <ProductTable
            products={filteredProducts}
            onArchive={(product) => setProductToArchive(product)}
            onRestore={handleRestore}
          />
        ) : hasActiveFilters ? (
          <EmptyState
            icon="🔍"
            title="No products match your filters"
            description="Try loosening your search terms or clearing category and status filters."
            actionText="Clear Filters"
            onAction={handleClearFilters}
          />
        ) : (
          <EmptyState
            icon="🎂"
            title="No products created yet"
            description="Start building the M² Cakery catalog by creating your first celebration cake design."
            actionText="Create First Product"
            onAction={() => (window.location.href = '/admin/products/new')}
          />
        )}
      </div>

      {/* Confirmation Dialog for Archival */}
      <ConfirmDialog
        isOpen={Boolean(productToArchive)}
        title="Archive Product?"
        message={`Are you sure you want to archive "${productToArchive?.title}"? It will be immediately removed from the customer catalog, but can be restored anytime.`}
        confirmText="Archive Product"
        cancelText="Cancel"
        isDestructive
        isLoading={archiving}
        onConfirm={handleConfirmArchive}
        onCancel={() => setProductToArchive(null)}
      />
    </div>
  );
}
