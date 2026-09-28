const items = [
  {
    name: 'Bespoke Cakes',
    desc: 'Birthday, anniversary and celebration cakes, designed around your theme, flavour and headcount.',
    tag: 'From ₹—/kg',
  },
  {
    name: 'Gourmet Cupcakes',
    desc: 'Small-batch cupcakes in rotating flavours — sold individually or as boxed sets for events.',
    tag: 'Sold by the box',
  },
  {
    name: 'Signature Desserts',
    desc: 'Jars, tarts and plated desserts for gifting or dessert tables.',
    tag: 'Ask for the current list',
  },
]

export default function Menu() {
  return (
    <section id="menu" className="section menu-section">
      <div className="wrap">
        <p className="eyebrow">What we bake</p>
        <h2>The menu</h2>
        <div className="menu-list">
          {items.map((item) => (
            <div className="menu-row" key={item.name}>
              <div>
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
              </div>
              <span className="tag">{item.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
