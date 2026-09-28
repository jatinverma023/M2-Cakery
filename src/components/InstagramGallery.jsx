import insta1 from '../assets/gallery/gallery-1.jpg'
import insta2 from '../assets/gallery/gallery-2.jpg'
import insta3 from '../assets/gallery/gallery-3.jpg'
import insta4 from '../assets/gallery/gallery-4.jpg'
import insta5 from '../assets/gallery/gallery-5.jpg'
import insta6 from '../assets/gallery/gallery-6.jpg'
import { SITE_CONFIG } from '../config/site'

const INSTA_PHOTOS = [
  { img: insta1, alt: 'Custom birthday cake with vintage piping' },
  { img: insta2, alt: 'Artisanal gift box of frosted cupcakes' },
  { img: insta3, alt: 'Chocolate drip cake with blackberries' },
  { img: insta4, alt: 'Layered pistachio signature dessert jars' },
  { img: insta5, alt: 'Bakery tin with cookies and sea salt brownies' },
  { img: insta6, alt: 'Tiered celebration cake with delicate florals' },
]

export default function InstagramGallery() {
  return (
    <section className="section-padding instagram-section" aria-labelledby="instagram-title">
      <div className="container" style={{ textAlign: 'center' }}>
        <span className="section-tag">Follow Along</span>
        <h2 id="instagram-title" className="section-heading section-heading-center">
          Fresh from our kitchen
        </h2>

        <div>
          <a
            className="insta-handle-link"
            href={SITE_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View M² Cakery on Instagram"
          >
            <svg
              width="20"
              height="20"
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
            <span>{SITE_CONFIG.instagramHandle}</span>
          </a>
        </div>

        <div className="insta-grid">
          {INSTA_PHOTOS.map((item, i) => (
            <a
              className="insta-item"
              href={SITE_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              key={i}
              aria-label={`View photo on Instagram: ${item.alt}`}
            >
              <img
                src={item.img}
                alt={item.alt}
                width="300"
                height="300"
              />
            </a>
          ))}
        </div>

        <div>
          <a
            className="btn btn-secondary"
            href={SITE_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Follow us on Instagram</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
