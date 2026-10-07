export default function AboutSection({ language }) {
  const id = language === 'id'
  return (
    <section id="about" className="about section-shell" aria-labelledby="about-title">
      <div className="about-copy">
        <p className="section-number">No. 02 — {id ? 'Tentang Saya' : 'About'}</p>
        <h2 id="about-title">{id ? <>Kode dengan<br />tujuan jelas.</> : <>Code with<br />clear intent.</>}</h2>
        <p className="drop-cap-paragraph">
          {id ? 'Saya Marizky, mahasiswa Informatika di Institut Teknologi Nasional Bandung yang mengubah kebutuhan produk menjadi aplikasi yang andal. Saya bekerja dengan Laravel, React, Flutter, dan MySQL—dengan fokus pada pengalaman yang mudah dipakai dan fondasi teknis yang kuat.' : "I'm Marizky, an Informatics student at Institut Teknologi Nasional Bandung who turns messy requirements into dependable applications. I work across Laravel, React, Flutter, and MySQL—always aiming for a product that is clear to use and solid underneath."}
        </p>
        <p>
          {id ? 'Saya mengutamakan bukti nyata daripada klaim berlebihan: skema data harus masuk akal, validasi dibuat dengan cermat, dan antarmuka mudah dipahami. PKL di PT Laskar Teknologi Mulia mengasah pengalaman saya dari query relasional hingga deployment produksi.' : 'I care about practical proof over inflated claims: the schema should make sense, validation should be deliberate, and the interface should meet people where they are. My internship at PT Laskar Teknologi Mulia sharpened every layer of this—from relational queries to production deployment.'}
        </p>
        <div className="stat-row" aria-label="Career highlights">
          <div>
            <strong>01</strong>
            <span>{id ? <>PKL full-stack<br />selesai</> : <>full-stack internship<br />completed</>}</span>
          </div>
          <div>
            <strong>03</strong>
            <span>{id ? <>proyek terpilih<br />diselesaikan</> : <>focused projects<br />shipped</>}</span>
          </div>
          <div>
            <strong>830</strong>
            <span>{id ? <>skor TOEIC<br />Agustus 2025</> : <>TOEIC score<br />August 2025</>}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
