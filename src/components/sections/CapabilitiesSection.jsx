const capabilities = [
  {
    title: 'Backend',
    items: [
      'Laravel REST APIs',
      'Resource controllers & Eloquent',
      'Form Request validation',
      'Sanctum auth & RBAC (Spatie)',
    ],
  },
  {
    title: 'Frontend',
    items: [
      'React & Vite SPAs',
      'Responsive UI slicing',
      'Axios interceptor integration',
      'Accessible interface states',
    ],
  },
  {
    title: 'Mobile',
    items: [
      'Flutter cross-platform apps',
      'Reusable screen components',
      'API-connected flows',
    ],
  },
  {
    title: 'Database & Tools',
    items: [
      'MySQL schema design',
      'Normalization & indexing',
      'Git & GitHub workflow',
      'cPanel deployment via FileZilla',
    ],
  },
]

export default function CapabilitiesSection({ language }) {
  const id = language === 'id'
  return (
    <section
      id="capabilities"
      className="capabilities section-shell"
      aria-labelledby="capabilities-title"
    >
      <div className="section-intro">
        <p className="section-number">No. 01 — {id ? 'Yang Bisa Saya Kerjakan' : 'What I Can Do'}</p>
        <h2 id="capabilities-title">
          {id ? <>Yang bisa<br />saya kerjakan.</> : <>What I<br />can do.</>}
        </h2>
        <p>
          {id ? 'Saya menyatukan bagian-bagian produk—mulai dari model data hingga layar yang digunakan.' : "I make the moving parts of a product work together—from the data model beneath it to the screen in someone's hand."}
        </p>
      </div>
      <div className="capability-grid">
        {capabilities.map((category, index) => (
          <article className="capability" key={category.title}>
            <div className="capability-top">
              <span>{String(index + 1).padStart(2, '0')}.</span>
              <h3>{id && category.title === 'Database & Tools' ? 'Basis Data & Tools' : category.title}</h3>
            </div>
            <ul>
              {category.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
