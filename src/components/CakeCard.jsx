import { CATEGORY_LABELS } from '../data/cakes'

export default function CakeCard({ cake, onSelectCake, isPriority = false, className = '' }) {
  const categoryName = CATEGORY_LABELS[cake.category] || cake.category

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelectCake(cake)
    }
  }

  return (
    <article
      className={`cake-portfolio-card ${cake.featured ? 'is-featured' : ''} ${className}`.trim()}
      onClick={() => onSelectCake(cake)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View ${cake.title} details`}
    >
      <div className="cake-card-image-wrap">
        <img
          src={cake.image}
          alt={cake.title}
          width="600"
          height="520"
          loading={isPriority ? 'eager' : 'lazy'}
          decoding="async"
          className="cake-card-img"
        />
        {cake.featured && (
          <span className="cake-featured-badge">Featured Design</span>
        )}
        <div className="cake-card-overlay" aria-hidden="true">
          <span className="cake-view-btn">
            <span>View Design</span>
            <span className="cake-view-arrow">→</span>
          </span>
        </div>
      </div>

      <div className="cake-card-info">
        <div className="cake-card-meta-row">
          <span className="cake-card-category">{categoryName}</span>
          {cake.priceFormatted && (
            <span className="cake-card-price">{cake.priceFormatted}</span>
          )}
        </div>
        <h3 className="cake-card-title">{cake.title}</h3>
        {cake.description && (
          <p className="cake-card-desc">{cake.description}</p>
        )}
      </div>
    </article>
  )
}
