import ImagesScrollingAnimation from '../ui/ImagesScrollingAnimation'

const projects = [
  {
    name: 'Klinik Online',
    index: '01 / WEB APP',
    src: 'https://cdn.21st.dev/assets/mirror/6e/6ee7e225e62a880a4bb73ba9adcb4995e65b1d9c3e05d4facc9bb99c2f73bd97.jpg',
    description: 'A multi-role clinic booking system for patients, doctors, and administrators, built to keep appointment scheduling dependable.',
    descriptionId: 'Sistem pemesanan klinik multi-peran untuk pasien, dokter, dan administrator, dirancang agar penjadwalan tetap andal.',
    context: 'Prevent concurrent double bookings with transactions, lockForUpdate, and a database-level unique constraint.',
    contextId: 'Mencegah pemesanan ganda bersamaan dengan transaksi, lockForUpdate, dan unique constraint di basis data.',
    tags: ['Laravel', 'React', 'MySQL', 'Sanctum'],
    href: '#contact',
    action: 'Ask about this project',
    actionId: 'Tanyakan tentang proyek ini',
  },
  {
    name: 'Foody',
    index: '02 / INTERNSHIP',
    src: 'https://cdn.21st.dev/assets/mirror/44/4419aecb9623ba4f4412fc979676f380c9e584cb96b0e89c4705b63c597474df.jpg',
    description: 'A product built during my internship at PT Laskar Teknologi Mulia, contributing to the everyday work of a production-minded team.',
    descriptionId: 'Produk yang dikerjakan selama PKL di PT Laskar Teknologi Mulia, dengan kontribusi pada kebutuhan tim dan aplikasi produksi.',
    context: 'Worked on CRUD flows, relational data, API endpoints, and responsive UI slicing during the development cycle.',
    contextId: 'Mengerjakan alur CRUD, data relasional, endpoint API, dan UI responsif selama siklus pengembangan.',
    tags: ['Laravel', 'REST API', 'MySQL', 'Git'],
    href: '#contact',
    action: 'Ask about this project',
    actionId: 'Tanyakan tentang proyek ini',
  },
  {
    name: 'Portfolio Website',
    index: '03 / SPA',
    src: 'https://cdn.21st.dev/assets/mirror/12/12f8c3902d4e6935ce10be85aa1a2dcb21a9acb6e162c363c33f92aa2f3f8d34.jpg',
    description: 'A responsive portfolio that helps recruiters scan practical technical proof, project context, and contact details.',
    descriptionId: 'Portofolio responsif yang membantu perekrut meninjau bukti teknis, konteks proyek, dan informasi kontak.',
    context: 'Combine a React and Vite SPA, clear project content, and a direct email contact flow.',
    contextId: 'Menggabungkan SPA React dan Vite, konten proyek yang jelas, dan alur kontak email langsung.',
    tags: ['React', 'Vite', 'JavaScript', 'CSS'],
    href: '#top',
    action: 'Visit this site',
    actionId: 'Lihat situs ini',
  },
]

export default function ProjectsSection({ language, onProjectChange }) {
  const id = language === 'id'
  const localizedProjects = projects.map((project) => ({
    ...project,
    description: id ? project.descriptionId : project.description,
    context: id ? project.contextId : project.context,
    contextLabel: id ? 'Konteks —' : 'Context —',
    stackLabel: id ? 'Teknologi yang digunakan' : 'Technology stack',
    action: id ? project.actionId : project.action,
  }))

  return (
    <section id="projects" className="projects" data-surface="blue" aria-labelledby="projects-title">
      <div className="projects-intro">
        <p className="section-number">No. 03 — {id ? 'Karya Pilihan' : 'Selected Work'}</p>
        <h2 id="projects-title">{id ? <>Dibuat untuk<br />menjawab kebutuhan.</> : <>Made to solve<br />something real.</>}</h2>
        <p className="projects-intro-copy">
          {id ? 'Gulir untuk melihat tiga proyek dan konteks teknis di baliknya.' : 'Scroll through three projects and the technical context behind each one.'}
        </p>
      </div>
      <ImagesScrollingAnimation projects={localizedProjects} onProjectChange={onProjectChange} />
    </section>
  )
}
