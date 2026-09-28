import { Link } from 'react-router-dom';

const CATEGORY_NAMES = {
  birthday: 'Birthday',
  wedding: 'Wedding',
  anniversary: 'Anniversary',
  celebration: 'Celebration',
  custom: 'Custom & Theme',
  desserts: 'Desserts',
};

export default function ProductCard({ product, onArchive, onRestore }) {
  const primaryImg = product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const categoryLabel = CATEGORY_NAMES[product.category] || product.category;

  const renderPricing = () => {
    if (product.pricingType === 'enquire') {
      return <span className="admin-price-enquire">Enquire</span>;
    }
    if (product.pricingType === 'starting_from') {
      return (
        <span className="admin-price-val">
          From ₹{product.price ? product.price.toLocaleString('en-IN') : '0'}
        </span>
      );
    }
    return (
      <span className="admin-price-val">
        ₹{product.price ? product.price.toLocaleString('en-IN') : '0'}
      </span>
    );
  };

  return (
    <article className="admin-product-card">
      <div className="admin-pcard-header">
        <div className="admin-pcard-thumb-wrap">
          {primaryImg?.url ? (
            <img
              src={primaryImg.url}
              alt={product.title}
              className="admin-pcard-thumb"
              loading="lazy"
            />
          ) : (
            <div className="admin-pcard-no-img" aria-hidden="true">
              🎂
            </div>
          )}
        </div>

        <div className="admin-pcard-info">
          <span className="admin-pcard-category">{categoryLabel}</span>
          <h4 className="admin-pcard-title">{product.title}</h4>
          <div className="admin-pcard-pricing">{renderPricing()}</div>
        </div>
      </div>

      <div className="admin-pcard-badges">
        {product.archived ? (
          <span className="admin-badge admin-badge-archived">Archived</span>
        ) : product.published ? (
          <span className="admin-badge admin-badge-published">Published</span>
        ) : (
          <span className="admin-badge admin-badge-draft">Draft</span>
        )}

        {product.featured && (
          <span className="admin-badge admin-badge-featured">★ Featured</span>
        )}

        {product.images?.length > 1 && (
          <span className="admin-badge admin-badge-photos">
            {product.images.length} photos
          </span>
        )}
      </div>

      <div className="admin-pcard-actions">
        <Link
          to={`/admin/products/${product._id}/edit`}
          className="admin-btn admin-btn-secondary admin-pcard-btn"
        >
          Edit
        </Link>

        {product.archived ? (
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-pcard-btn admin-btn-restore"
            onClick={() => onRestore(product)}
          >
            Restore
          </button>
        ) : (
          <button
            type="button"
            className="admin-btn admin-btn-ghost admin-pcard-btn admin-btn-archive"
            onClick={() => onArchive(product)}
          >
            Archive
          </button>
        )}
      </div>
    </article>
  );
}
