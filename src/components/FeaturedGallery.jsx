import gallery1 from '../assets/gallery/gallery-1.jpg'
import gallery2 from '../assets/gallery/gallery-2.jpg'
import gallery3 from '../assets/gallery/gallery-3.jpg'
import gallery4 from '../assets/gallery/gallery-4.jpg'
import gallery5 from '../assets/gallery/gallery-5.jpg'
import gallery6 from '../assets/gallery/gallery-6.jpg'
import gallery7 from '../assets/gallery/gallery-7.jpg'

const GALLERY_ITEMS = [
  {
    image: gallery1,
    title: 'Vintage Piped Cake',
    tag: 'Bespoke Birthday',
    alt: 'Vintage scalloped border celebration cake with delicate buttercream pearls',
  },
  {
    image: gallery2,
    title: 'Raspberry Rose Cupcakes',
    tag: 'Boxed Gift Set',
    alt: 'Gourmet artisanal cupcakes with piped rosettes and edible gold leaf in gift box',
  },
  {
    image: gallery3,
    title: 'Dark Chocolate & Fig Drip',
    tag: 'Anniversary Cake',
    alt: 'Decadent chocolate drip celebration cake crowned with fresh blackberries and mission figs',
  },
  {
    image: gallery4,
    title: 'Pistachio Dessert Jars',
    tag: 'Signature Dessert',
    alt: 'Layered pistachio mousse dessert jars and fresh berry tarts on marble slab',
  },
  {
    image: gallery5,
    title: 'Artisan Cookie & Brownie Tin',
    tag: 'Festive Gifting',
    alt: 'Handcrafted chocolate chunk cookies and fudgy sea salt brownies in matte cream gift tin',
  },
  {
    image: gallery6,
    title: 'Tiered Floral Celebration',
    tag: 'Special Milestone',
    alt: 'Multi-tiered bespoke wedding cake with pastel roses and edible gold leaf',
  },
  {
    image: gallery7,
    title: 'Freshly Baked in Samba',
    tag: 'From The Oven',
    alt: 'Freshly assembled celebration cake decorated with botanical accents in home kitchen',
  },
]

export default function FeaturedGallery() {
  return (
    <section id="featured" className="section-padding featured-section" aria-labelledby="gallery-title">
      <div className="container">
        <div style={{ textAlign: 'center' }}>
          <span className="section-tag">Featured Cakes</span>
          <h2 id="gallery-title" className="section-heading section-heading-center">
            Real celebrations. Real happiness.
          </h2>
          <div className="divider-line" aria-hidden="true" />
          <p className="section-subtitle section-subtitle-center">
            A glimpse into recent creations from our home kitchen in Samba. Swipe through our recent bespoke cakes and desserts.
          </p>
        </div>
      </div>

      {/* Horizontal Carousel Track (Swipeable on Mobile & Tablet) */}
      <div className="gallery-carousel-wrap">
        <div className="gallery-track container" role="region" aria-label="Recent baked creations gallery">
          {GALLERY_ITEMS.map((item, index) => (
            <div className="gallery-card" key={index}>
              <div className="gallery-card-image">
                <img
                  src={item.image}
                  alt={item.alt}
                  width="400"
                  height="400"
                  loading="lazy"
                />
              </div>
              <div className="gallery-card-info">
                <span className="gallery-item-title">{item.title}</span>
                <span className="gallery-item-tag">{item.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
