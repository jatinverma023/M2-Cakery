import { SITE_CONFIG, getWhatsAppUrl } from '../config/site'
import footerLogo from '../assets/brand/m2-cakery-logo-light.png'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <a className="footer-logo-link" href="#top" aria-label="M² Cakery Home">
              <img
                src={footerLogo}
                alt="M² Cakery"
                className="footer-logo-img"
                width="1024"
                height="341"
                loading="lazy"
                decoding="async"
              />
              <span className="footer-brand-subtitle">HOME BAKERY · JAKH, SAMBA</span>
            </a>
            <p className="footer-bio">
              Artisanal home bakery based in Jakh, Samba.
              Bespoke cakes, gourmet cupcakes, and signature celebration desserts
              handcrafted with passion and finest ingredients.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links-list">
              {(SITE_CONFIG.drawerLinks || SITE_CONFIG.navLinks).map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Details & Order Notice */}
          <div>
            <h4 className="footer-col-title">Connect Directly</h4>
            <ul className="footer-links-list">
              <li>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Order on WhatsApp"
                >
                  WhatsApp: {SITE_CONFIG.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow M² Cakery on Instagram"
                >
                  Instagram: {SITE_CONFIG.instagramHandle}
                </a>
              </li>
              <li>
                <span style={{ fontSize: '0.90rem', color: 'rgba(255, 249, 243, 0.65)' }}>
                  Location: {SITE_CONFIG.location}
                </span>
              </li>
              <li>
                <span style={{ fontSize: '0.82rem', color: 'var(--champagne-light)', display: 'block', marginTop: '6px' }}>
                  Orders booked 48 hours in advance
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Strip */}
        <div className="footer-bottom">
          <span>
            © {currentYear} {SITE_CONFIG.name}, Jakh, Samba. All rights reserved.
          </span>
          <span>
            Handcrafted with love for every celebration.
          </span>
        </div>
      </div>
    </footer>
  )
}
