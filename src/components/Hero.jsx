import heroCakeImg from '../assets/hero/hero-cake.jpg'
import { SITE_CONFIG, getWhatsAppUrl } from '../config/site'

export default function Hero() {
  return (
    <section id="top" className="hero-section" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero-grid">
          {/* Hero Left: Copy & Actions */}
          <div className="hero-content">
            <span className="hero-script-tag">Made for your moments.</span>

            <h1 id="hero-title" className="hero-title">
              Cakes made to <br />
              <span className="title-italic">be remembered.</span>
            </h1>

            <p className="hero-lede">
              Bespoke cakes, cupcakes, and signature desserts handmade in small
              batches in Jakh, Samba—for birthdays, weddings, and every celebration
              worth gathering for.
            </p>

            <div className="hero-actions">
              <a
                className="btn btn-whatsapp"
                href={getWhatsAppUrl('Hi M² Cakery! I would like to enquire about ordering a celebration cake.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Order on WhatsApp</span>
                <svg
                  width="17"
                  height="17"
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

              <a className="btn btn-secondary" href="#collection">
                <span>View Collection</span>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </a>
            </div>

            {/* Core Values Strip */}
            <div className="hero-features-strip" aria-label="Key bakery features">
              <span className="hero-feature-item">
                <span className="hero-feature-dot" aria-hidden="true">✦</span>
                <span>Custom Designs</span>
              </span>
              <span className="hero-feature-item">
                <span className="hero-feature-dot" aria-hidden="true">✦</span>
                <span>Freshly Baked</span>
              </span>
              <span className="hero-feature-item">
                <span className="hero-feature-dot" aria-hidden="true">✦</span>
                <span>Local Pickup / Delivery</span>
              </span>
            </div>

            {/* Verified Metrics */}
            <div className="hero-metrics" role="list" aria-label="Bakery highlights">
              {SITE_CONFIG.metrics.map((metric) => (
                <div className="metric-item" role="listitem" key={metric.label}>
                  <span className="metric-value">{metric.value}</span>
                  <span className="metric-label">{metric.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Right: Editorial Cake Photograph */}
          <div className="hero-visual-wrap">
            <div className="hero-image-frame">
              <img
                src={heroCakeImg}
                alt="Signature tiered floral celebration cake handcrafted by M² Cakery"
                width="800"
                height="960"
                fetchPriority="high"
              />
            </div>

            {/* Accessible Floating Social Proof Badge */}
            <div
              className="hero-rating-badge"
              role="status"
              aria-label="Rated 4.8 out of 5 stars by verified customers"
            >
              <span className="rating-stars" aria-hidden="true">★ 4.8</span>
              <div className="rating-text">
                <span className="rating-score">4.8 Rating</span>
                <span className="rating-sub">Verified customer orders</span>
              </div>
            </div>

            {/* Subtle Editorial Label */}
            <span className="hero-annotation" aria-hidden="true">
              Signature cake · Jakh, Samba
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
