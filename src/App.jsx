import { useState } from 'react'
import AnnouncementBar from './components/AnnouncementBar'
import Header from './components/Header'
import Hero from './components/Hero'
import CakePortfolio from './components/CakePortfolio'
import Collection from './components/Collection'
import WhyM2 from './components/WhyM2'
import About from './components/About'
import HowToOrder from './components/HowToOrder'
import Testimonials from './components/Testimonials'
import InstagramGallery from './components/InstagramGallery'
import FAQ from './components/FAQ'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import MobileOrderBar from './components/MobileOrderBar'
import ProductDetailModal from './components/ProductDetailModal'
import CakeDetailModal from './components/CakeDetailModal'

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedCake, setSelectedCake] = useState(null)

  return (
    <>
      <a href="#main-content" className="sr-only">
        Skip to main content
      </a>

      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Header */}
      <Header />

      {/* Main Landmark */}
      <main id="main-content">
        {/* 3. Hero */}
        <Hero />

        {/* 4. Cakes Visual Portfolio Section */}
        <CakePortfolio onSelectCake={setSelectedCake} />

        {/* 5. Desserts & Sweet Treats Showcase */}
        <Collection onSelectProduct={setSelectedProduct} />

        {/* 6. Why M² Cakery (Editorial Trust Section) */}
        <WhyM2 />

        {/* 7. Brand Story */}
        <About />

        {/* 8. How To Order (Ready Products) */}
        <HowToOrder />

        {/* 9. Customer Reviews */}
        <Testimonials />

        {/* 10. Instagram Gallery */}
        <InstagramGallery />

        {/* 11. FAQ */}
        <FAQ />

        {/* 12. Final CTA */}
        <FinalCTA />
      </main>

      {/* 13. Footer */}
      <Footer />

      {/* Fixed Mobile Conversion Bar */}
      <MobileOrderBar />

      {/* Cake Portfolio Detail Modal */}
      {selectedCake && (
        <CakeDetailModal
          cake={selectedCake}
          onClose={() => setSelectedCake(null)}
        />
      )}

      {/* Ready Product Detail Modal (for Desserts & Treats) */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  )
}
