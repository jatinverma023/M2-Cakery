import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { useToast } from '../components/Toast';
import productApi from '../api/productApi';

export default function NewProduct() {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleCreate = async (payload) => {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      await productApi.createProduct(payload);
      addToast(`"${payload.title}" created successfully!`, 'success');
      navigate('/admin/products');
    } catch (err) {
      setErrorMessage(
        err.message || 'Failed to create product. Please verify all required fields.'
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-editor-page">
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumbs">
            <Link to="/admin/products" className="admin-breadcrumb-link">
              Products
            </Link>
            <span className="admin-breadcrumb-sep">/</span>
            <span className="admin-breadcrumb-current">New Product</span>
          </div>
          <h1 className="admin-page-title">Add New Product</h1>
          <p className="admin-page-subtitle">
            Create a celebration cake portfolio entry or artisanal confection.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="admin-alert admin-alert-danger" role="alert">
          <span className="admin-alert-icon" aria-hidden="true">
            ⚠
          </span>
          <span>{errorMessage}</span>
        </div>
      )}

      <ProductForm
        onSubmit={handleCreate}
        onCancel={() => navigate('/admin/products')}
        isSubmitting={submitting}
        submitLabel="Create Product"
      />
    </div>
  );
}
