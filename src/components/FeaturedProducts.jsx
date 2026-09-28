import { PRODUCTS } from '../data/products'
import { useProducts } from '../hooks/useProducts'
import { normalizeProducts } from '../services/productApi'
import { getProductWhatsAppUrl } from '../utils/whatsapp'

export default function FeaturedProducts({ onSelectProduct }) {
  const { products } = useProducts({ featured: true })

  // Use live featured products if available, otherwise fallback to static products
  const liveFeatured = products.filter((p) => p.featured && p.published && !p.archived)
  const staticFeatured = normalizeProducts(PRODUCTS.filter((p) => p.featured))
  const featured = liveFeatured.length > 0 ? liveFeatured : staticFeatured

  const heroProduct = featured[0] || null
  const sideProducts = featured.slice(1, 3)

  if (!heroProduct) return null

  return (
    <section id="featured" className="section-padding featured-products-section" aria-labelledby="featured-heading">
      <div className="container">
        <div className="featured-header-row">
          <div>
            <span className="section-tag">Featured From The Kitchen</span>
            <h2 id="featured-heading" className="section-heading">
              Crafted for unforgettable moments.
            </h2>
          </div>
          <p className="featured-header-sub">
            Handmade celebration creations currently featured in our Samba kitchen.
            Ready to order for your next milestone.
          </p>
        </div>

        <div className="featured-layout-grid">
          {/* Main Showcase Hero Product */}
          {heroProduct && (
            <article className="featured-hero-card" id={`featured-${heroProduct.id}`}>
              <div className="featured-hero-image-wrap">
                <img
                  src={heroProduct.image}
                  alt={heroProduct.alt}
                  width="800"
                  height="640"
                  loading="lazy"
                />
                <span className="featured-pill-badge">{heroProduct.tag}</span>
              </div>

              <div className="featured-hero-body">
                <span className="product-category">{heroProduct.categoryLabel}</span>
                <h3 className="featured-hero-title">{heroProduct.name}</h3>
                <p className="featured-hero-desc">{heroProduct.shortDesc}</p>

                <div className="featured-hero-footer">
                  <span className="product-price-label">{heroProduct.priceLabel}</span>

                  <div className="featured-hero-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => onSelectProduct(heroProduct)}
                      aria-label={`View full details for ${heroProduct.name}`}
                    >
                      <span>View Details</span>
                      <span aria-hidden="true">→</span>
                    </button>

                    <a
                      className="btn btn-whatsapp"
                      href={getProductWhatsAppUrl(heroProduct)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Enquire about ${heroProduct.name} on WhatsApp`}
                    >
                      <span>Order on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* Secondary Featured Side Products */}
          <div className="featured-side-col">
            {sideProducts.map((product) => (
              <article className="featured-mini-card" key={product.id}>
                <div className="featured-mini-image-wrap">
                  <img
                    src={product.image}
                    alt={product.alt}
                    width="400"
                    height="320"
                    loading="lazy"
                  />
                  <span className="featured-mini-pill">{product.tag}</span>
                </div>

                <div className="featured-mini-body">
                  <span className="product-category">{product.categoryLabel}</span>
                  <h4 className="featured-mini-title">{product.name}</h4>
                  <p className="featured-mini-desc">{product.shortDesc}</p>

                  <div className="featured-mini-footer">
                    <span className="product-price-label">{product.priceLabel}</span>

                    <button
                      type="button"
                      className="btn-text-link"
                      onClick={() => onSelectProduct(product)}
                      aria-label={`View details for ${product.name}`}
                    >
                      <span>View Details</span>
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
