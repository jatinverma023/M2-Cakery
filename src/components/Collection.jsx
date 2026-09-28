import { useState, useMemo } from 'react'
import { PRODUCTS } from '../data/products'
import { useProducts } from '../hooks/useProducts'
import { normalizeProducts } from '../services/productApi'
import ProductCard from './ProductCard'

// Non-cake artisanal creations for the Desserts showcase
const DESSERT_CATEGORIES = [
  { id: 'all', label: 'All Confections' },
  { id: 'cupcakes-desserts', label: 'Cupcakes & Parfaits' },
  { id: 'cookies-brownies', label: 'Brownies & Brookies' },
]

export default function Collection({ onSelectProduct }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const { products, loading } = useProducts({ limit: 50 })

  // Static fallback desserts (curated non-cake creations)
  const staticDesserts = useMemo(() => {
    const raw = PRODUCTS.filter(
      (p) => p.category === 'cupcakes-desserts' || p.category === 'cookies-brownies'
    )
    return normalizeProducts(raw)
  }, [])

  // Check if live database contains dessert products
  const liveDessertProducts = useMemo(() => {
    return products.filter((p) => p.category === 'desserts')
  }, [products])

  // Prefer live dessert products if available; otherwise use curated static fallback
  const availableDesserts = liveDessertProducts.length > 0 ? liveDessertProducts : staticDesserts

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return availableDesserts

    return availableDesserts.filter((p) => {
      // Direct category match (e.g. in static items)
      if (p.category === activeCategory) return true
      // Tag or occasion sub-match for live dessert items
      if (p.tag && p.tag.toLowerCase().includes(activeCategory.replace('-', ' '))) return true
      return false
    })
  }, [availableDesserts, activeCategory])

  return (
    <section id="desserts" className="section-padding desserts-section" aria-labelledby="desserts-title">
      <div className="container">
        <div style={{ textAlign: 'center' }}>
          <span className="section-tag">DESSERTS &amp; TREATS</span>
          <h2 id="desserts-title" className="section-heading section-heading-center">
            Gourmet Cupcakes &amp; Celebration Confections
          </h2>
          <div className="divider-line" aria-hidden="true" />
          <p className="section-subtitle section-subtitle-center">
            Artisanal cupcakes, handcrafted dessert jars, and signature sweet treats baked fresh to order in Jakh, Samba.
          </p>
        </div>

        {/* Category Filter Pills (Scrollable on Mobile) */}
        <div className="category-filter-wrap" role="tablist" aria-label="Dessert categories">
          {DESSERT_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id
            return (
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`category-pill ${isActive ? 'is-active' : ''}`}
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>

        {/* Product Cards Grid */}
        <div className="collection-grid" role="region" aria-live="polite">
          {/* Skeleton loading when fetching without static items */}
          {loading && availableDesserts.length === 0 && (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="product-card cake-skeleton-card" aria-hidden="true">
                <div className="product-image-wrap cake-skeleton-img" />
                <div className="product-body">
                  <div className="cake-skeleton-line cake-skeleton-category" />
                  <div className="cake-skeleton-line cake-skeleton-title" />
                  <div className="cake-skeleton-line cake-skeleton-desc" />
                </div>
              </div>
            ))
          )}

          {/* Render Products */}
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
