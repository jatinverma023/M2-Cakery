import { TESTIMONIALS } from '../data/testimonials'

export default function Testimonials() {
  return (
    <section id="reviews" className="section-padding testimonials-section" aria-labelledby="reviews-title">
      <div className="container">
        <div style={{ textAlign: 'center' }}>
          <span className="section-tag">Customer Love</span>
          <h2 id="reviews-title" className="section-heading section-heading-center">
            What our customers say
          </h2>
          <div className="divider-line" aria-hidden="true" />
          <p className="section-subtitle section-subtitle-center">
            Honest feedback from people across Samba who celebrated their most memorable milestones with M² Cakery.
          </p>
        </div>

        <div className="testimonials-grid">
          {TESTIMONIALS.map((review, idx) => (
            <article className="testimonial-card" key={idx}>
              <div>
                <div className="testimonial-stars" aria-label={`${review.stars} out of 5 stars`}>
                  ★★★★★
                </div>
                <blockquote className="testimonial-quote">
                  "{review.quote}"
                </blockquote>
              </div>

              <div className="testimonial-author">
                <div className="author-avatar-fallback" aria-hidden="true">
                  {review.initial}
                </div>
                <div className="author-info">
                  <span className="author-name">{review.author}</span>
                  <span className="author-occasion">{review.location}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
