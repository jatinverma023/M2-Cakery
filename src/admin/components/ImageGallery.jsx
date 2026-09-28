export default function ImageGallery({ images = [], onSetPrimary, onRemove }) {
  if (!images || images.length === 0) return null;

  return (
    <div className="admin-gallery-grid">
      {images.map((img, index) => {
        const isPrimary = Boolean(img.isPrimary || index === 0);

        return (
          <div
            key={img.publicId || img.url || index}
            className={`admin-gallery-item ${isPrimary ? 'is-primary' : ''}`}
          >
            <div className="admin-gallery-thumb-wrap">
              <img
                src={img.url}
                alt={`Product asset ${index + 1}`}
                className="admin-gallery-img"
                loading="lazy"
              />
              {isPrimary && (
                <span className="admin-primary-badge">Primary Cover</span>
              )}
            </div>

            <div className="admin-gallery-actions">
              {!isPrimary && (
                <button
                  type="button"
                  className="admin-gallery-btn admin-btn-set-primary"
                  onClick={() => onSetPrimary(index)}
                  title="Make this the primary showcase image"
                >
                  Set as Main
                </button>
              )}

              <button
                type="button"
                className="admin-gallery-btn admin-btn-remove-img"
                onClick={() => onRemove(index)}
                title="Remove image from product"
              >
                Remove
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
