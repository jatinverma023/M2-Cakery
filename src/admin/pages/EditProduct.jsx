import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { useToast } from '../components/Toast';
import productApi from '../api/productApi';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await productApi.getProduct(id);
      setProduct(response?.data);
    } catch (err) {
      setErrorMessage(err.message || 'Product not found');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleUpdate = async (payload) => {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      await productApi.updateProduct(id, payload);
      addToast(`"${payload.title}" updated successfully!`, 'success');
      navigate('/admin/products');
    } catch (err) {
      setErrorMessage(
        err.message || 'Failed to update product. Please verify all required fields.'
      );
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page-loading">
        <div className="admin-spinner" />
        <p className="admin-loading-text">Loading product details...</p>
      </div>
    );
  }

  if (errorMessage && !product) {
    return (
      <div className="admin-page-error">
        <div className="admin-error-card">
          <span className="admin-error-icon" aria-hidden="true">
            ⚠
          </span>
          <h3>Product Not Found</h3>
          <p>{errorMessage}</p>
          <Link to="/admin/products" className="admin-btn admin-btn-primary">
            Return to Products Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-editor-page">
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumbs">
            <Link to="/admin/products" className="admin-breadcrumb-link">
              Products
            </Link>
            <span className="admin-breadcrumb-sep">/</span>
            <span className="admin-breadcrumb-current">Edit: {product?.title}</span>
          </div>
          <h1 className="admin-page-title">Edit Product</h1>
          <p className="admin-page-subtitle">
            Update title, celebration category, pricing, photography, and publication visibility.
          </p>
        </div>

        {product?.archived && (
          <span className="admin-badge admin-badge-archived" style={{ fontSize: '0.85rem' }}>
            Archived Item
          </span>
        )}
      </div>

      {errorMessage && (
        <div className="admin-alert admin-alert-danger" role="alert">
          <span className="admin-alert-icon" aria-hidden="true">
            ⚠
          </span>
          <span>{errorMessage}</span>
        </div>
      )}

      {product && (
        <ProductForm
          initialValues={product}
          onSubmit={handleUpdate}
          onCancel={() => navigate('/admin/products')}
          isSubmitting={submitting}
          submitLabel="Save Changes"
        />
      )}
    </div>
  );
}
