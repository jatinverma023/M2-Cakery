export default function Contact() {
  return (
    <section id="order" className="section contact">
      <div className="wrap">
        <div>
          <p className="eyebrow" style={{ color: 'var(--plum-deep)' }}>Ready to order?</p>
          <h2>Tell us the<br />occasion.</h2>
          <a
            className="btn btn-primary"
            style={{ marginTop: 28, background: 'var(--plum-deep)' }}
            href="https://wa.me/918491957400"
            target="_blank"
            rel="noreferrer"
          >
            Message on WhatsApp
          </a>
        </div>
        <div className="contact-details">
          <div className="contact-row">
            <div>
              <strong>Location</strong>
              <span>Jakh, Samba</span>
            </div>
          </div>
          <div className="contact-row">
            <div>
              <strong>WhatsApp</strong>
              <span>+91 84919 57400</span>
            </div>
          </div>
          <div className="contact-row">
            <div>
              <strong>Instagram</strong>
              <span>@m2_cakery_</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
