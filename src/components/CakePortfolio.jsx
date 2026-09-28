import { useState } from 'react'
import { CAKE_CATEGORIES, CATEGORY_LABELS } from '../data/cakes'
import { useProducts } from '../hooks/useProducts'
import { getWhatsAppUrl } from '../utils/whatsapp'
import CakeCard from './CakeCard'

const INITIAL_LIMIT = 6

export default function CakePortfolio({ onSelectCake }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [expanded, setExpanded] = useState(false)
  const { products, loading } = useProducts({ limit: 50 })

  // Filter celebration cakes (excludes desserts which are showcased in the confections section)
  const cakeProducts = products.filter((p) => p.category !== 'desserts')

  const filteredCakes = activeCategory === 'all'
    ? cakeProducts
    : cakeProducts.filter((cake) => cake.category === activeCategory)

  // Visible cakes: max 6 initially, all when expanded
  const visibleCakes = expanded
    ? filteredCakes
    : filteredCakes.slice(0, INITIAL_LIMIT)

  const handleCategorySelect = (catId) => {
    if (catId !== activeCategory) {
      setActiveCategory(catId)
      setExpanded(false)
    }
  }

  const handleToggleExpand = () => {
    if (expanded) {
      setExpanded(false)
      const section = document.getElementById('cakes')
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else {
      setExpanded(true)
    }
  }

  const getCtaText = () => {
    if (expanded) return 'Show Less'
    if (activeCategory === 'all') return 'See All Cakes'
    const catLabel = CATEGORY_LABELS[activeCategory] || activeCategory
    return `See All ${catLabel} Cakes`
  }

  return (
    <section id="cakes" className="section-padding cake-portfolio-section" aria-labelledby="cakes-headline">
      {/* Anchor alias for existing #collection links */}
      <span id="collection" className="anchor-offset-target" aria-hidden="true" />

      <div className="container">
        {/* Section Header */}
        <div className="cake-portfolio-header">
          <span className="section-tag">CAKES</span>
          <h2 id="cakes-headline" className="section-heading section-heading-center">
            Cakes made for every celebration
          </h2>
          <div className="divider-line" aria-hidden="true" />
          <p className="section-subtitle section-subtitle-center">
            Explore cakes created for birthdays, weddings, anniversaries, milestones, and special celebrations.
          </p>
        </div>

        {/* Clean Category Filters (Horizontally Scrollable on Mobile) */}
        <div
          className="cake-category-filter-wrap"
          role="tablist"
          aria-label="Cake celebration categories"
        >
          {CAKE_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id
            return (
              <button
                type="button"
                role="tab"
                id={`tab-${cat.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${cat.id}`}
                className={`cake-category-pill ${isActive ? 'is-active' : ''}`}
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
              >
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>

        {/* Cake Portfolio Grid: 3-col Desktop, 2-col Tablet, 1-col Mobile */}
        <div
          id={`panel-${activeCategory}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeCategory}`}
          className="cake-portfolio-grid"
        >
          {/* 1. Loading Skeleton State */}
          {loading && (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="cake-portfolio-card cake-skeleton-card" aria-hidden="true">
                <div className="cake-card-image-wrap cake-skeleton-img" />
                <div className="cake-card-info">
                  <div className="cake-skeleton-line cake-skeleton-category" />
                  <div className="cake-skeleton-line cake-skeleton-title" />
                  <div className="cake-skeleton-line cake-skeleton-desc" />
                </div>
              </div>
            ))
          )}

          {/* 2. Empty State (When no cakes match category or catalog is empty) */}
          {!loading && filteredCakes.length === 0 && (
            <div className="cake-empty-state" role="status">
              <span className="cake-empty-icon" aria-hidden="true">🎂</span>
              <h3 className="cake-empty-title">
                {activeCategory === 'all'
                  ? 'No Cake Designs Currently Listed'
                  : 'No Designs in this Category Right Now'}
              </h3>
              <p className="cake-empty-desc">
                {activeCategory === 'all'
                  ? 'All cakes are baked fresh to order in Jakh, Samba. Contact us on WhatsApp to discuss your date, theme, and custom preferences.'
                  : 'We have not uploaded designs for this specific celebration category yet. Explore all cakes or message us directly on WhatsApp to design your custom cake.'}
              </p>
              <div className="cake-empty-actions">
                {activeCategory !== 'all' && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleCategorySelect('all')}
                  >
                    <span>View All Cakes</span>
                  </button>
                )}
                <a
                  className="btn btn-whatsapp"
                  href={getWhatsAppUrl('Hi M² Cakery! I would like to enquire about commissioning a custom cake design.')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Enquire on WhatsApp</span>
                  <span className="btn-arrow" aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          )}

          {/* 3. Populated Cake Cards */}
          {!loading && visibleCakes.length > 0 && (
            visibleCakes.map((cake, index) => (
              <CakeCard
                key={cake.id}
                cake={cake}
                onSelectCake={onSelectCake}
                isPriority={index < 3}
                className={index >= INITIAL_LIMIT ? 'cake-card-reveal' : ''}
              />
            ))
          )}
        </div>

        {/* 4. See All / Show Less CTA */}
        {!loading && filteredCakes.length > INITIAL_LIMIT && (
          <div className="cake-portfolio-actions">
            <button
              type="button"
              className={`cake-portfolio-cta ${expanded ? 'is-expanded' : ''}`}
              onClick={handleToggleExpand}
              aria-expanded={expanded}
              aria-controls={`panel-${activeCategory}`}
            >
              <span>{getCtaText()}</span>
              <span className="cake-portfolio-cta-arrow" aria-hidden="true">
                {expanded ? '↑' : '→'}
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
