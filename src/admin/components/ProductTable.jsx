import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const CATEGORY_NAMES = {
  birthday: 'Birthday',
  wedding: 'Wedding',
  anniversary: 'Anniversary',
  celebration: 'Celebration',
  custom: 'Custom & Theme',
  desserts: 'Desserts',
};

export default function ProductTable({ products = [], onArchive, onRestore }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="admin-product-view-container">
      {/* 1. Mobile Cards View (< 768px) */}
      <div className="admin-mobile-cards-list">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onArchive={onArchive}
            onRestore={onRestore}
          />
        ))}
      </div>

      {/* 2. Desktop Table View (>= 768px) */}
      <div className="admin-table-card">
        <table className="admin-table" aria-label="Products and cake catalog">
          <thead>
            <tr>
              <th scope="col" style={{ width: '80px' }}>
                Photo
              </th>
              <th scope="col">Title</th>
              <th scope="col">Category</th>
              <th scope="col">Pricing</th>
              <th scope="col">Status</th>
              <th scope="col">Featured</th>
              <th scope="col">Updated</th>
              <th scope="col" style={{ textAlign: 'right' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const primaryImg =
                product.images?.find((img) => img.isPrimary) || product.images?.[0];
              const categoryLabel = CATEGORY_NAMES[product.category] || product.category;

              const renderPrice = () => {
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

              const formatDate = (dateStr) => {
                if (!dateStr) return '—';
                const d = new Date(dateStr);
                return d.toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });
              };

              return (
                <tr key={product._id}>
                  {/* Photo Thumbnail */}
                  <td>
                    <div className="admin-tbl-thumb-wrap">
                      {primaryImg?.url ? (
                        <img
                          src={primaryImg.url}
                          alt={product.title}
                          className="admin-tbl-thumb"
                          loading="lazy"
                        />
                      ) : (
                        <div className="admin-tbl-no-img" aria-hidden="true">
                          🎂
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Title */}
                  <td>
                    <div className="admin-tbl-title-cell">
                      <Link
                        to={`/admin/products/${product._id}/edit`}
                        className="admin-tbl-title-link"
                      >
                        {product.title}
                      </Link>
                      {product.images?.length > 1 && (
                        <span className="admin-tbl-photo-count">
                          {product.images.length} photos
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Category */}
                  <td>
                    <span className="admin-tbl-category-badge">{categoryLabel}</span>
                  </td>

                  {/* Pricing */}
                  <td>{renderPrice()}</td>

                  {/* Status */}
                  <td>
                    {product.archived ? (
                      <span className="admin-badge admin-badge-archived">Archived</span>
                    ) : product.published ? (
                      <span className="admin-badge admin-badge-published">Published</span>
                    ) : (
                      <span className="admin-badge admin-badge-draft">Draft</span>
                    )}
                  </td>

                  {/* Featured */}
                  <td>
                    {product.featured ? (
                      <span className="admin-badge admin-badge-featured">★ Yes</span>
                    ) : (
                      <span className="admin-tbl-muted">—</span>
                    )}
                  </td>

                  {/* Updated Date */}
                  <td>
                    <span className="admin-tbl-date">
                      {formatDate(product.updatedAt || product.createdAt)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right' }}>
                    <div className="admin-tbl-actions">
                      <Link
                        to={`/admin/products/${product._id}/edit`}
                        className="admin-btn admin-btn-sm admin-btn-secondary"
                        title="Edit product details"
                      >
                        Edit
                      </Link>

                      {product.archived ? (
                        <button
                          type="button"
                          className="admin-btn admin-btn-sm admin-btn-secondary admin-btn-restore"
                          onClick={() => onRestore(product)}
                          title="Restore product to catalog"
                        >
                          Restore
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="admin-btn admin-btn-sm admin-btn-ghost admin-btn-archive"
                          onClick={() => onArchive(product)}
                          title="Archive product (removes from customer view)"
                        >
                          Archive
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
