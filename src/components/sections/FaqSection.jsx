import { useState } from 'react'

const faqs = [
  ['What can you build?', 'End-to-end web applications: a Laravel REST API, a React interface, relational data in MySQL, and—when the product calls for it—a Flutter mobile companion.'],
  ['How do you approach a project?', 'I start with requirements and the database shape, then build the API and validation layer before connecting the UI. That keeps product decisions visible early and prevents the frontend from drifting away from the data.'],
  ['Is there real proof behind the stack?', 'Klinik Online handles concurrent bookings with database transactions, lockForUpdate, and a UNIQUE constraint to prevent double bookings. It also includes Sanctum authentication and role-based dashboards.'],
  ['Do you have work experience?', 'Yes. I completed a Full-Stack Developer internship at PT Laskar Teknologi Mulia from January to April 2026, working across CRUD systems, REST APIs, relational queries, UI slicing, and deployment.'],
]

export default function FaqSection({ language }) {
  const id = language === 'id'
  const [openFaq, setOpenFaq] = useState(0)
  const items = id ? [
    ['Apa yang bisa Anda bangun?', 'Aplikasi web end-to-end: REST API Laravel, antarmuka React, data relasional di MySQL, dan aplikasi pendamping Flutter bila dibutuhkan.'],
    ['Bagaimana pendekatan Anda pada proyek?', 'Saya mulai dari kebutuhan dan rancangan basis data, lalu membangun API beserta validasi sebelum menghubungkan UI.'],
    ['Apakah ada bukti nyata dari kemampuan ini?', 'Klinik Online menangani pemesanan bersamaan dengan transaksi basis data, lockForUpdate, dan UNIQUE constraint untuk mencegah jadwal ganda. Proyek ini juga memiliki autentikasi Sanctum dan dashboard berbasis peran.'],
    ['Apakah Anda punya pengalaman kerja?', 'Ya. Saya menyelesaikan PKL Full-Stack Developer di PT Laskar Teknologi Mulia dari Januari hingga April 2026, mengerjakan sistem CRUD, REST API, query relasional, UI, dan deployment.'],
  ] : faqs
  return <section id="faq" className="faq section-shell" data-surface="paper" aria-labelledby="faq-title"><div className="faq-heading"><p className="section-number">No. 04 — {id ? 'Tanya Jawab' : 'The Fine Print'}</p><h2 id="faq-title">{id ? <>Pertanyaan,<br />terjawab.</> : <>Questions,<br />answered.</>}</h2></div><div className="accordion">{items.map(([question, answer], index) => <div className={`faq-item ${openFaq === index ? 'is-open' : ''}`} key={question}><button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}><span>0{index + 1}</span>{question}<b aria-hidden="true">{openFaq === index ? '—' : '+'}</b></button><div className="faq-answer"><p>{answer}</p></div></div>)}</div></section>
}
