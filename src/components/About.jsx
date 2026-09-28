import bakerImg from '../assets/baker/baker-kitchen.jpg'
import { getWhatsAppUrl } from '../config/site'

export default function About() {
  return (
    <section id="about" className="section-padding about-section" aria-labelledby="about-title">
      <div className="container">
        <div className="about-grid">
          {/* Left: Editorial Polaroid Baker Frame */}
          <div className="about-visual">
            <div className="polaroid-frame">
              <div className="polaroid-image-wrap">
                <img
                  src={bakerImg}
                  alt="Home baker lovingly decorating a multi-tier floral cake in the M² kitchen"
                  width="700"
                  height="595"
                />
              </div>
              <p className="polaroid-caption" aria-hidden="true">
                Fresh from the kitchen · Jakh, Samba
              </p>
            </div>
          </div>

          {/* Right: Story Content */}
          <div className="about-content">
            <span className="section-tag">Our Story</span>
            <h2 id="about-title" className="section-heading">
              Baked by hand. <br />
              <span style={{ fontStyle: 'italic', color: 'var(--rose)' }}>Made personally.</span>
            </h2>

            <p className="about-p">
              M² Cakery began in a home kitchen in Jakh, Samba, and grew one celebration
              at a time. No two cakes leave our oven the same way — every flavour,
              finish, and floral accent is carefully crafted in direct conversation with you.
            </p>

            <p className="about-p">
              Because all orders are taken personally over WhatsApp, there is a genuine
              dialogue about your celebration before a single ingredient is measured.
              We believe milestones deserve personal artistry, never mass-produced batches.
            </p>

            {/* Core Values */}
            <div className="about-values-list">
              <div className="value-item">
                <div className="value-title">Made to Order</div>
                <div className="value-desc">No frozen or pre-made stock. Baked specifically for your event date.</div>
              </div>

              <div className="value-item">
                <div className="value-title">Fresh Ingredients</div>
                <div className="value-desc">Pure dairy butter, rich chocolates, and fresh fruits prepared close to pickup.</div>
              </div>

              <div className="value-item">
                <div className="value-title">Bespoke Design</div>
                <div className="value-desc">Themes, headcount, and color palettes tailored to your aesthetic.</div>
              </div>

              <div className="value-item">
                <div className="value-title">Direct Conversation</div>
                <div className="value-desc">Chat directly with your baker on WhatsApp throughout the planning.</div>
              </div>
            </div>

            <div>
              <a
                className="btn btn-primary"
                href={getWhatsAppUrl('Hi M² Cakery! I would like to discuss a custom design for my upcoming event.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Start a Conversation</span>
                <svg
                  width="16"
                  height="16"
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
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
