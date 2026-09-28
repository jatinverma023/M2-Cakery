const COMMITMENTS = [
  {
    num: '01',
    title: 'Made to Order',
    desc: 'Every design is baked fresh around your celebration date — never frozen, pre-made, or left on shelves.',
  },
  {
    num: '02',
    title: 'Fresh Small Batches',
    desc: 'Crafted in limited quantities with pure dairy butter, rich chocolates, and fresh fruits for superior flavor and texture.',
  },
  {
    num: '03',
    title: 'Thoughtful Details',
    desc: 'From hand-piped vintage shell borders to fresh garden florals and edible gold leaf, every finish receives artisan care.',
  },
  {
    num: '04',
    title: 'Local & Personal',
    desc: 'Direct, personal conversation over WhatsApp with your baker in Jakh, Samba from first question to cake collection.',
  },
]

export default function WhyM2() {
  return (
    <section id="why-us" className="section-padding why-m2-section" aria-labelledby="why-m2-heading">
      <div className="container">
        <div style={{ textAlign: 'center' }}>
          <span className="section-tag">The Bakery Standard</span>
          <h2 id="why-m2-heading" className="section-heading section-heading-center">
            Why M² Cakery
          </h2>
          <div className="divider-line" aria-hidden="true" />
          <p className="section-subtitle section-subtitle-center">
            Four honest commitments behind every cake, cupcake box, and dessert that leaves our kitchen in Samba.
          </p>
        </div>

        <div className="why-grid">
          {COMMITMENTS.map((item) => (
            <div className="why-card" key={item.num}>
              <span className="why-number" aria-hidden="true">{item.num}</span>
              <h3 className="why-card-title">{item.title}</h3>
              <p className="why-card-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
