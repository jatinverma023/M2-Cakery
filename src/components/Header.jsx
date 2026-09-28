import { useState, useEffect } from 'react'
import { SITE_CONFIG, getWhatsAppUrl } from '../config/site'
import brandLogo from '../assets/brand/m2-cakery-logo.png'

const NAV_LINKS = [
  { label: 'CAKES', href: '#cakes' },
  { label: 'DESSERTS', href: '#desserts' },
  { label: 'OUR STORY', href: '#about' },
  { label: 'REVIEWS', href: '#reviews' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  // Close mobile navigation drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  return (
    <header className="site-header" role="banner">
      <div className="container header-container">
        {/* Brand Logo - Official M² Cakery PNG Asset */}
        <a className="brand-logo-link" href="#top" aria-label="M² Cakery Home">
          <img
            src={brandLogo}
            alt="M² Cakery"
            className="brand-logo-img"
            width="1024"
            height="341"
            loading="eager"
            decoding="async"
          />
        </a>

        {/* Minimal Desktop Navigation - ONLY 4 Links */}
        <nav className="desktop-nav-minimal" aria-label="Main navigation">
          <ul className="nav-center-list">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a className="nav-minimal-link" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Action Links: Divider + Instagram Circle + WhatsApp Berry Pill */}
        <div className="header-actions">
          <div className="nav-action-divider" aria-hidden="true" />

          <a
            className="instagram-circle-btn"
            href={SITE_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow M² Cakery on Instagram"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </a>

          <a
            className="btn-whatsapp-pill"
            href={getWhatsAppUrl('Hi M² Cakery! I would like to enquire about ordering a cake.')}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              width="18"
              height="18"
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
            <span>Order on WhatsApp</span>
            <span className="btn-arrow" aria-hidden="true">→</span>
          </a>

          {/* Accessible Mobile Hamburger Toggle */}
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={isOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      <div
        className={`mobile-nav-overlay ${isOpen ? 'is-open' : ''}`}
        aria-hidden="true"
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Navigation Drawer - Simplified to 4 links + WhatsApp + Instagram */}
      <nav
        id="mobile-nav-drawer"
        className={`mobile-nav-drawer ${isOpen ? 'is-open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
      >
        <ul className="mobile-nav-links">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a href={link.href} onClick={handleLinkClick}>
                <span>{link.label}</span>
                <span aria-hidden="true" style={{ fontSize: '1rem', color: 'var(--rose-dusty, #BA7A83)' }}>→</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mobile-nav-actions">
          <a
            className="btn-whatsapp-pill"
            style={{ width: '100%', justifyContent: 'center' }}
            href={getWhatsAppUrl('Hi M² Cakery! I would like to enquire about ordering a cake.')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
          >
            <svg
              width="18"
              height="18"
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
            <span>Order on WhatsApp</span>
            <span className="btn-arrow" aria-hidden="true">→</span>
          </a>

          <a
            className="btn btn-secondary"
            style={{ width: '100%', gap: '8px' }}
            href={SITE_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            <span>{SITE_CONFIG.instagramHandle} on Instagram</span>
          </a>
        </div>
      </nav>
    </header>
  )
}
