import { useState, useEffect, useRef } from 'react'
import { CATEGORY_LABELS } from '../data/cakes'
import { getWhatsAppUrl } from '../utils/whatsapp'

export default function CakeDetailModal({ cake, onClose }) {
  const closeButtonRef = useRef(null)
  const [activeImage, setActiveImage] = useState(cake?.image || '')

  // Reset active image when cake changes
  useEffect(() => {
    if (cake) {
      setActiveImage(cake.image || '')
    }
  }, [cake])

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

  // Lock body scroll and set focus to close button
  useEffect(() => {
    if (cake) {
      document.body.style.overflow = 'hidden'
      closeButtonRef.current?.focus()
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [cake])

  if (!cake) return null

  const categoryName = CATEGORY_LABELS[cake.category] || cake.category

  const priceTag = cake.priceFormatted && cake.priceFormatted !== 'Enquire for pricing'
    ? ` (${cake.priceFormatted})`
    : ''

  const whatsAppUrl = getWhatsAppUrl(
    `Hi M² Cakery! I would like to enquire about ordering this cake: "${cake.title}"${priceTag}. Could you please share availability and ordering details?`
  )

  const galleryImages = Array.isArray(cake.images) && cake.images.length > 0
    ? cake.images
    : [{ url: cake.image, isPrimary: true }]

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-cake-title"
      onClick={onClose}
    >
      <div
        className="modal-dialog-content cake-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          ref={closeButtonRef}
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close cake details"
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

        <div className="cake-modal-grid">
          <div className="cake-modal-image-col">
            <div className="cake-modal-img-frame">
              <img
                src={activeImage || cake.image}
                alt={cake.title}
                width="700"
                height="600"
                className="cake-modal-img"
              />
            </div>

            {/* Multi-Photo Cloudinary Gallery Selector */}
            {galleryImages.length > 1 && (
              <div
                className="cake-modal-thumbs"
                role="group"
                aria-label="Cake photo gallery"
              >
                {galleryImages.map((img, idx) => (
                  <button
                    key={img.url || idx}
                    type="button"
                    className={`cake-modal-thumb-btn ${activeImage === img.url ? 'is-active' : ''}`}
                    onClick={() => setActiveImage(img.url)}
                    aria-label={`View photo ${idx + 1}`}
                  >
                    <img src={img.url} alt="" width="56" height="56" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="cake-modal-info-col">
            <span className="cake-modal-category">{categoryName}</span>
            <h2 id="modal-cake-title" className="cake-modal-title">
              {cake.title}
            </h2>

            {cake.priceFormatted && (
              <div className="cake-modal-price-strip">
                <span className="cake-modal-price-val">{cake.priceFormatted}</span>
              </div>
            )}

            {cake.description ? (
              <p className="cake-modal-desc">{cake.description}</p>
            ) : (
              <p className="cake-modal-desc" style={{ fontStyle: 'italic', color: 'rgba(44, 33, 30, 0.70)' }}>
                Bespoke celebration design handcrafted by M² Cakery in Jakh, Samba. Contact us on WhatsApp to discuss your date, theme, and custom preferences.
              </p>
            )}

            <div className="cake-modal-notice-box">
              <span className="cake-notice-icon" aria-hidden="true">✦</span>
              <span>All cakes are baked fresh to order. Please book custom orders in advance.</span>
            </div>

            <div className="cake-modal-actions">
              <a
                className="btn btn-whatsapp cake-modal-whatsapp-btn"
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Enquire on WhatsApp</span>
                <span className="btn-arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
