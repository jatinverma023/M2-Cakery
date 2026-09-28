import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import ProductTable from '../components/ProductTable';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';
import productApi from '../api/productApi';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Archive dialog state
  const [productToArchive, setProductToArchive] = useState(null);
  const [archiving, setArchiving] = useState(false);

  const { addToast } = useToast();

  const fetchDashboardData = useCallback(async () => {
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
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Statistics calculation from genuine API data
  const totalCount = products.length;
  const publishedCount = products.filter((p) => p.published && !p.archived).length;
  const draftsCount = products.filter((p) => !p.published && !p.archived).length;
  const featuredCount = products.filter((p) => p.featured && !p.archived).length;
  const archivedCount = products.filter((p) => p.archived).length;

  const recentProducts = [...products]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 6);

  const handleConfirmArchive = async () => {
    if (!productToArchive) return;
    setArchiving(true);
    try {
      await productApi.archiveProduct(productToArchive._id);
      addToast(`"${productToArchive.title}" was archived successfully.`, 'success');
      setProductToArchive(null);
      fetchDashboardData();
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
      fetchDashboardData();
    } catch (err) {
      addToast(err.message || 'Failed to restore product', 'error');
    }
  };

  if (loading) {
    return (
      <div className="admin-page-loading">
        <div className="admin-spinner" />
        <p className="admin-loading-text">Loading dashboard metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page-error">
        <div className="admin-error-card">
          <span className="admin-error-icon" aria-hidden="true">
            ⚠
          </span>
          <h3>Dashboard Error</h3>
          <p>{error}</p>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={fetchDashboardData}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <span className="admin-page-tag">OVERVIEW</span>
          <h1 className="admin-page-title">Portfolio Dashboard</h1>
          <p className="admin-page-subtitle">
            Catalog statistics, publication status, and quick management actions.
          </p>
        </div>

        <div className="admin-page-actions">
          <Link to="/admin/products/new" className="admin-btn admin-btn-primary">
            <span>+ Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Real Statistics Metrics */}
      <div className="admin-stats-grid">
        <StatCard
          label="Total Catalog Items"
          value={totalCount}
          icon="📦"
          subtext="Cakes & desserts in database"
          variant="default"
        />
        <StatCard
          label="Published Online"
          value={publishedCount}
          icon="🌐"
          subtext="Active on customer website"
          variant="success"
        />
        <StatCard
          label="Draft Designs"
          value={draftsCount}
          icon="📝"
          subtext="Unpublished work-in-progress"
          variant="warning"
        />
        <StatCard
          label="Featured Showcases"
          value={featuredCount}
          icon="★"
          subtext="Highlighted editorial designs"
          variant="featured"
        />
        <StatCard
          label="Archived Records"
          value={archivedCount}
          icon="📁"
          subtext="Hidden from public catalog"
          variant="muted"
        />
      </div>

      {/* Quick Actions Panel */}
      <div className="admin-quick-actions-card">
        <h2 className="admin-card-title">Quick Actions</h2>
        <div className="admin-quick-btn-group">
          <Link to="/admin/products/new" className="admin-btn admin-btn-secondary">
            <span>🎂 Add New Cake / Dessert</span>
          </Link>
          <Link to="/admin/products" className="admin-btn admin-btn-secondary">
            <span>🔍 Manage & Filter Catalog</span>
          </Link>
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn admin-btn-ghost"
          >
            <span>🌐 Preview Customer Website ↗</span>
          </Link>
        </div>
      </div>

      {/* Recent Catalog Items */}
      <section className="admin-recent-section">
        <div className="admin-section-header-wrap">
          <div>
            <h2 className="admin-card-title">Recent Catalog Updates</h2>
            <p className="admin-section-subtitle">
              Recently added or modified cake designs and confections.
            </p>
          </div>
          <Link to="/admin/products" className="admin-link-btn">
            View All Products ({totalCount}) →
          </Link>
        </div>

        {recentProducts.length > 0 ? (
          <ProductTable
            products={recentProducts}
            onArchive={(product) => setProductToArchive(product)}
            onRestore={handleRestore}
          />
        ) : (
          <div className="admin-card admin-empty-card">
            <p>No products exist in the catalog yet.</p>
            <Link to="/admin/products/new" className="admin-btn admin-btn-primary admin-mt-2">
              Create Your First Cake
            </Link>
          </div>
        )}
      </section>

      {/* Confirmation Dialog for Archive Action */}
      <ConfirmDialog
        isOpen={Boolean(productToArchive)}
        title="Archive Product?"
        message={`Are you sure you want to archive "${productToArchive?.title}"? This will hide it from the customer website while keeping all data intact.`}
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
