const slots = [
  'Cookie tin',
  'Brownie tub',
  'Frosted cake',
  'Cupcake tray',
  'Detail shot',
  'Packaging',
  'Delivery',
  'Custom order',
]

export default function Gallery() {
  return (
    <section id="gallery" className="section">
      <div className="wrap">
        <p className="eyebrow">Recent work</p>
        <h2>From the kitchen</h2>
        <div className="gallery-grid">
          {slots.map((label) => (
            <div className="gallery-item" key={label}>
              <div className="placeholder-img">Photo: {label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
