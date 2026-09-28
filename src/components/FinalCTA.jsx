import celebrationTableImg from '../assets/hero/celebration-table.jpg'
import { SITE_CONFIG, getWhatsAppUrl } from '../config/site'

export default function FinalCTA() {
  return (
    <section id="contact" className="final-cta-section" aria-labelledby="final-cta-title">
      <div className="final-cta-bg" aria-hidden="true">
        <img
          src={celebrationTableImg}
          alt="Warm celebration dessert banquet table with glowing candles"
          width="1600"
          height="900"
          loading="lazy"
        />
      </div>

      <div className="final-cta-overlay" aria-hidden="true" />

      <div className="container final-cta-content">
        <span className="section-tag section-tag-light">Your Celebration</span>

        <h2 id="final-cta-title" className="final-cta-title">
          Found your favourite?
        </h2>

        <p className="final-cta-desc">
          Let's make your celebration a little more special.
          Message us directly on WhatsApp to check availability for your date and reserve your cake.
        </p>

        <div>
          <a
            className="btn btn-whatsapp"
            style={{ padding: '16px 36px', fontSize: '1.02rem' }}
            href={getWhatsAppUrl('Hi M² Cakery! I found a favourite creation on your website and would like to order.')}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Order on WhatsApp</span>
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
        </div>

        {/* Verified Bakery Details */}
        <div className="final-cta-details" role="list" aria-label="Bakery contact details">
          <div className="final-detail-item" role="listitem">
            <span className="final-detail-label">Bakery</span>
            <span className="final-detail-val">{SITE_CONFIG.name}</span>
          </div>

          <div className="final-detail-item" role="listitem">
            <span className="final-detail-label">Location</span>
            <span className="final-detail-val">{SITE_CONFIG.fullLocation}</span>
          </div>

          <div className="final-detail-item" role="listitem">
            <span className="final-detail-label">WhatsApp</span>
            <a
              className="final-detail-val"
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              {SITE_CONFIG.phoneDisplay}
            </a>
          </div>

          <div className="final-detail-item" role="listitem">
            <span className="final-detail-label">Instagram</span>
            <a
              className="final-detail-val"
              href={SITE_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {SITE_CONFIG.instagramHandle}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
