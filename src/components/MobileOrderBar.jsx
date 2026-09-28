import { SITE_CONFIG, getWhatsAppUrl } from '../config/site'

export default function MobileOrderBar() {
  return (
    <aside className="mobile-order-bar" aria-label="Mobile quick order bar">
      <div className="mobile-order-info">
        <span className="mobile-order-title">{SITE_CONFIG.name}</span>
        <span className="mobile-order-sub">Freshly baked in Samba</span>
      </div>

      <a
        className="btn btn-whatsapp mobile-order-btn"
        href={getWhatsAppUrl('Hi M² Cakery! I would like to enquire about ordering a cake.')}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order your cake from M² Cakery on WhatsApp"
      >
        <span>Order on WhatsApp</span>
        <svg
          width="16"
          height="16"
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
    </aside>
  )
}
