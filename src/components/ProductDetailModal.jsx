import { useEffect, useRef } from 'react'
import { getProductWhatsAppUrl } from '../utils/whatsapp'

export default function ProductDetailModal({ product, onClose }) {
  const closeButtonRef = useRef(null)

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Lock body scroll and focus close button on open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden'
      if (closeButtonRef.current) {
        closeButtonRef.current.focus()
      }
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [product])

  if (!product) return null

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
      onClick={onClose}
    >
      <div
        className="modal-dialog-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          ref={closeButtonRef}
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close product details"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="modal-inner-grid">
          {/* Modal Left: Product Image */}
          <div className="modal-image-col">
            <div className="modal-image-frame">
              <img
                src={product.image}
                alt={product.alt}
                width="700"
                height="600"
              />
              {product.tag && (
                <span className="modal-tag-pill">{product.tag}</span>
              )}
            </div>
          </div>

          {/* Modal Right: Details & WhatsApp Action */}
          <div className="modal-details-col">
            <span className="modal-category-label">{product.categoryLabel}</span>

            <h2 id="modal-product-title" className="modal-product-title">
              {product.name}
            </h2>

            <div className="modal-price-strip">
              <span className="modal-price-text">{product.priceLabel}</span>
              <span className="modal-lead-time">· {product.leadTime}</span>
            </div>

            <p className="modal-full-desc">{product.fullDesc}</p>

            {/* Sizes & Portions */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="modal-spec-block">
                <span className="modal-spec-heading">Available Sizes &amp; Portions</span>
                <ul className="modal-spec-list">
                  {product.sizes.map((size, index) => (
                    <li key={index}>
                      <span className="modal-bullet" aria-hidden="true">✦</span>
                      <span>{size}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Flavours & Occasions */}
            <div className="modal-meta-grid">
              {product.flavourNotes && (
                <div className="modal-meta-box">
                  <span className="modal-meta-label">Flavour Profile</span>
                  <span className="modal-meta-val">{product.flavourNotes}</span>
                </div>
              )}
              {product.occasions && (
                <div className="modal-meta-box">
                  <span className="modal-meta-label">Best For</span>
                  <span className="modal-meta-val">{product.occasions}</span>
                </div>
              )}
            </div>

            {/* Direct WhatsApp Ordering Action */}
            <div className="modal-action-row">
              <a
                className="btn btn-whatsapp modal-whatsapp-btn"
                href={getProductWhatsAppUrl(product)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Order this on WhatsApp</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>

              <p className="modal-disclaimer-note">
                Ready product order. Message us to check availability for your date and arrange pickup in Jakh, Samba.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
