import { useState } from 'react';
import ImageUploader from './ImageUploader';
import ImageGallery from './ImageGallery';

const CATEGORIES = [
  { value: 'birthday', label: 'Birthday Cakes' },
  { value: 'wedding', label: 'Wedding Cakes' },
  { value: 'anniversary', label: 'Anniversary Cakes' },
  { value: 'celebration', label: 'Celebration Cakes' },
  { value: 'custom', label: 'Custom & Theme Cakes' },
  { value: 'desserts', label: 'Desserts & Sweet Treats' },
];

const PRICING_TYPES = [
  { value: 'enquire', label: 'Enquire for Pricing (No fixed price)' },
  { value: 'starting_from', label: 'Starting From (e.g. Starting from ₹1,200)' },
  { value: 'fixed', label: 'Fixed Price (e.g. ₹850)' },
];

export default function ProductForm({
  initialValues = {},
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = 'Save Product',
}) {
  const [title, setTitle] = useState(initialValues.title || '');
  const [category, setCategory] = useState(initialValues.category || 'birthday');
  const [description, setDescription] = useState(initialValues.description || '');
  const [pricingType, setPricingType] = useState(initialValues.pricingType || 'enquire');
  const [price, setPrice] = useState(
    initialValues.price !== undefined && initialValues.price !== null ? initialValues.price : ''
  );
  const [images, setImages] = useState(initialValues.images || []);
  const [featured, setFeatured] = useState(Boolean(initialValues.featured));
  const [published, setPublished] = useState(
    initialValues.published !== undefined ? Boolean(initialValues.published) : true
  );
  const [sortOrder, setSortOrder] = useState(initialValues.sortOrder || 0);

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!title.trim()) {
      errs.title = 'Product title is required';
    } else if (title.trim().length > 150) {
      errs.title = 'Title cannot exceed 150 characters';
    }

    if (!category) {
      errs.category = 'Please select a celebration category';
    }

    if (pricingType === 'fixed' || pricingType === 'starting_from') {
      const numPrice = Number(price);
      if (price === '' || isNaN(numPrice) || numPrice < 0) {
        errs.price = 'Please enter a valid price (greater than or equal to 0)';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleImagesUploaded = (newImages) => {
    setImages((prev) => {
      const combined = [...prev, ...newImages];
      // Ensure at least one image is marked primary
      const hasPrimary = combined.some((img) => img.isPrimary);
      if (!hasPrimary && combined.length > 0) {
        combined[0].isPrimary = true;
      }
      return combined;
    });
  };

  const handleSetPrimaryImage = (index) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      // If we removed the primary image, make the first remaining primary
      const hasPrimary = updated.some((img) => img.isPrimary);
      if (!hasPrimary && updated.length > 0) {
        updated[0].isPrimary = true;
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    const payload = {
      title: title.trim(),
      category,
      description: description.trim(),
      pricingType,
      price: pricingType === 'enquire' ? null : Number(price),
      images,
      featured,
      published,
      sortOrder: Number(sortOrder) || 0,
    };

    onSubmit(payload);
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit} noValidate>
      {/* 1. Basic Information */}
      <section className="admin-form-section">
        <h3 className="admin-form-section-title">Product Details</h3>

        <div className="admin-form-group">
          <label htmlFor="prod-title" className="admin-label">
            Product Title <span className="admin-required">*</span>
          </label>
          <input
            id="prod-title"
            type="text"
            className={`admin-input ${errors.title ? 'is-invalid' : ''}`}
            placeholder="e.g. Bespoke Floral Celebration Cake"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={150}
            required
          />
          {errors.title && <span className="admin-field-error">{errors.title}</span>}
          <span className="admin-char-count">{title.length} / 150</span>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label htmlFor="prod-category" className="admin-label">
              Category <span className="admin-required">*</span>
            </label>
            <select
              id="prod-category"
              className="admin-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label htmlFor="prod-sort" className="admin-label">
              Display Sort Order
            </label>
            <input
              id="prod-sort"
              type="number"
              className="admin-input"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              placeholder="0 (Lower numbers appear first)"
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label htmlFor="prod-desc" className="admin-label">
            Description
          </label>
          <textarea
            id="prod-desc"
            className="admin-textarea"
            rows={4}
            placeholder="Describe the occasion, tiers, decorative highlights, or custom options..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
          />
          <span className="admin-char-count">{description.length} / 2000</span>
        </div>
      </section>

      {/* 2. Pricing Configuration */}
      <section className="admin-form-section">
        <h3 className="admin-form-section-title">Pricing & Quotation</h3>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label htmlFor="prod-pricing-type" className="admin-label">
              Pricing Structure
            </label>
            <select
              id="prod-pricing-type"
              className="admin-select"
              value={pricingType}
              onChange={(e) => {
                const val = e.target.value;
                setPricingType(val);
                if (val === 'enquire') {
                  setPrice('');
                }
              }}
            >
              {PRICING_TYPES.map((pt) => (
                <option key={pt.value} value={pt.value}>
                  {pt.label}
                </option>
              ))}
            </select>
          </div>

          {pricingType !== 'enquire' && (
            <div className="admin-form-group">
              <label htmlFor="prod-price" className="admin-label">
                {pricingType === 'starting_from' ? 'Starting Price (₹)' : 'Price (₹)'}{' '}
                <span className="admin-required">*</span>
              </label>
              <div className="admin-input-prefix-wrap">
                <span className="admin-input-prefix">₹</span>
                <input
                  id="prod-price"
                  type="number"
                  min="0"
                  step="10"
                  className={`admin-input admin-input-prefixed ${errors.price ? 'is-invalid' : ''}`}
                  placeholder="1200"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              {errors.price && <span className="admin-field-error">{errors.price}</span>}
            </div>
          )}
        </div>
      </section>

      {/* 3. Photos & Visual Showcase */}
      <section className="admin-form-section">
        <div className="admin-section-header-wrap">
          <div>
            <h3 className="admin-form-section-title">Cake Photographs</h3>
            <p className="admin-section-subtitle">
              Upload high-resolution photography directly to Cloudinary. Designate a cover photo for portfolio cards.
            </p>
          </div>
          <span className="admin-badge-count">
            {images.length} {images.length === 1 ? 'photo' : 'photos'}
          </span>
        </div>

        <ImageUploader
          onImagesUploaded={handleImagesUploaded}
          currentImageCount={images.length}
        />

        <ImageGallery
          images={images}
          onSetPrimary={handleSetPrimaryImage}
          onRemove={handleRemoveImage}
        />
      </section>

      {/* 4. Publication & Visibility Settings */}
      <section className="admin-form-section">
        <h3 className="admin-form-section-title">Visibility & Status</h3>

        <div className="admin-toggles-grid">
          <label className="admin-toggle-card" htmlFor="prod-published">
            <input
              id="prod-published"
              type="checkbox"
              className="admin-checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            <div className="admin-toggle-info">
              <span className="admin-toggle-title">Publish to Website</span>
              <span className="admin-toggle-desc">
                When active, this cake is visible to customers in the portfolio.
              </span>
            </div>
          </label>

          <label className="admin-toggle-card" htmlFor="prod-featured">
            <input
              id="prod-featured"
              type="checkbox"
              className="admin-checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            <div className="admin-toggle-info">
              <span className="admin-toggle-title">Featured Showcase</span>
              <span className="admin-toggle-desc">
                Highlight this design near the top with an editorial badge.
              </span>
            </div>
          </label>
        </div>
      </section>

      {/* Form Action Controls */}
      <div className="admin-form-actions">
        <button
          type="button"
          className="admin-btn admin-btn-secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="admin-btn admin-btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
