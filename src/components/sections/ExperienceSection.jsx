export default function ExperienceSection({ language }) {
  const id = language === 'id'
  return (
    <section
      id="experience"
      className="experience section-shell"
      aria-labelledby="experience-title"
    >
      <div className="section-intro">
        <p className="section-number">No. 02½ — {id ? 'Pengalaman & Kredensial' : 'Experience & Credentials'}</p>
        <h2 id="experience-title">
          {id ? <>Pengalaman<br />saya.</> : <>Where I've<br />been.</>}
        </h2>
        <p>
          {id ? 'Ringkasan pengalaman kerja dan kredensial yang mendukungnya.' : 'A condensed timeline of real-world work and the credentials behind it.'}
        </p>
      </div>

      <div className="experience-content">
        {/* Experience Timeline */}
        <div className="timeline">
          <article className="timeline-item">
            <div className="timeline-marker" aria-hidden="true" />
            <div className="timeline-body">
              <p className="timeline-date">Jan — Apr 2026</p>
              <h3>{id ? 'PKL Full-Stack Developer' : 'Full-Stack Developer Internship'}</h3>
              <p className="timeline-company">
                PT Laskar Teknologi Mulia — Bandung
              </p>
              <ul className="timeline-points">
                <li>{id ? 'Membangun sistem CRUD end-to-end dengan resource controller Laravel dan Eloquent' : 'Built end-to-end CRUD systems with Laravel resource controllers and Eloquent'}</li>
                <li>{id ? 'Merancang skema tabel relasional dengan normalisasi dan optimasi query' : 'Designed relational table schemas with normalization and query optimization'}</li>
                <li>{id ? 'Mengembangkan endpoint REST API yang digunakan frontend melalui Axios' : 'Developed REST API endpoints consumed by frontend via Axios'}</li>
                <li>{id ? 'Menerapkan desain UI responsif secara manual dari mockup' : 'Sliced responsive UI from design mockups—manual, no CSS framework'}</li>
                <li>{id ? 'Deploy aplikasi ke cPanel via FileZilla dan menyiapkan konfigurasi .env' : 'Deployed production apps from Laragon → cPanel via FileZilla, including .env config'}</li>
              </ul>
            </div>
          </article>
        </div>

        {/* Credentials */}
        <div className="credentials">
          <h3 className="credentials-title">{id ? 'Pendidikan & Sertifikasi' : 'Credentials'}</h3>

          <div className="credential-item credential-item--highlight">
            <span className="credential-badge">830</span>
            <div>
              <p className="credential-name">TOEIC — Listening & Reading</p>
              <p className="credential-date">August 2025</p>
            </div>
          </div>

          <div className="credential-item">
            <span className="credential-icon">◆</span>
            <div>
              <p className="credential-name">
                S1 Informatika — Institut Teknologi Nasional Bandung (ITENAS)
              </p>
              <p className="credential-date">In progress</p>
            </div>
          </div>

          <div className="credential-item">
            <span className="credential-icon">◆</span>
            <div>
              <p className="credential-name">
                SMK Bakti Nusantara 666 — PPLG
              </p>
              <p className="credential-date">
                Graduated · Avg. grade 86.78
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
