import { getWhatsAppUrl } from '../config/site'

const STEPS = [
  {
    num: '01',
    title: 'Choose your product',
    desc: 'Browse our ready showcase across celebration cakes, cupcakes, and dessert boxes.',
  },
  {
    num: '02',
    title: 'Check the details',
    desc: 'Review available sizes, portions, and flavour notes to find the perfect fit for your gathering.',
  },
  {
    num: '03',
    title: 'Message us on WhatsApp',
    desc: 'Click any WhatsApp button to send a direct enquiry with your chosen product and celebration date.',
  },
  {
    num: '04',
    title: 'Confirm your order',
    desc: 'We verify our baking schedule, confirm pickup or delivery in Samba, and bake your order fresh.',
  },
]

export default function HowToOrder() {
  return (
    <section id="how-to-order" className="section-padding order-process-section" aria-labelledby="how-to-order-title">
      <div className="container">
        <div style={{ textAlign: 'center' }}>
          <span className="section-tag">How To Order</span>
          <h2 id="how-to-order-title" className="section-heading section-heading-center">
            It's simple.
          </h2>
          <div className="divider-line" aria-hidden="true" />
          <p className="section-subtitle section-subtitle-center">
            Four easy steps to bring a handcrafted creation from our Samba kitchen to your celebration table.
          </p>
        </div>

        <div className="process-grid">
          {STEPS.map((step) => (
            <div className="process-card" key={step.num}>
              <span className="process-number" aria-hidden="true">
                {step.num}
              </span>
              <h3 className="process-title">{step.title}</h3>
              <p className="process-desc">{step.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <a
            className="btn btn-whatsapp"
            href={getWhatsAppUrl('Hi M² Cakery! I am looking to order a product from your showcase.')}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Start Your Order on WhatsApp</span>
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
    </section>
  )
}
