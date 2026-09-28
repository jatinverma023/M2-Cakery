import { getProductWhatsAppUrl } from '../utils/whatsapp'

export default function ProductCard({ product, onSelectProduct }) {
  return (
    <article className="product-card" id={`product-${product.id}`}>
      <div className="product-image-wrap">
        <img
          src={product.image}
          alt={product.alt}
          width="600"
          height="480"
        />
        {product.tag && (
          <span className="product-tag-badge">{product.tag}</span>
        )}
      </div>

      <div className="product-body">
        <span className="product-category">{product.categoryLabel}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.shortDesc}</p>

        <div className="product-footer-row">
          <span className="product-price-label">{product.priceLabel}</span>

          <div className="product-actions-group">
            <button
              type="button"
              className="btn-text-link"
              onClick={() => onSelectProduct(product)}
              aria-label={`View details for ${product.name}`}
            >
              <span>View Details</span>
              <span aria-hidden="true">→</span>
            </button>

            <a
              className="btn-whatsapp-icon"
              href={getProductWhatsAppUrl(product)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Enquire about ${product.name} on WhatsApp`}
              title="Enquire on WhatsApp"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}
