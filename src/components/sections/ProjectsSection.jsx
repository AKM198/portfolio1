import { useEffect, useRef } from 'react'
import ProjectCopy from './ProjectCopy'

const projects = [
  { name: 'Klinik Online', index: '01 / WEB APP', description: 'A multi-role clinic booking system for patients, doctors, and administrators—built to keep appointment scheduling dependable.', context: 'Prevent concurrent double bookings with transactions, lockForUpdate, and a database-level unique constraint.', tags: ['Laravel', 'React', 'MySQL', 'Sanctum'], href: '#contact', action: 'Ask about this project' },
  { name: 'Portfolio Website', index: '02 / SPA', description: 'A responsive personal site designed to make technical proof, contact details, and project context easy for recruiters to scan.', context: 'Pair an editorial interface with a React SPA, centralized Axios error handling, and an email-ready contact flow.', tags: ['React', 'Vite', 'Axios', 'CSS'], href: '#top', action: 'Visit the live site' },
  { name: 'Foody', index: '03 / INTERNSHIP', description: 'A product built during my internship at PT Laskar Teknologi Mulia, contributing to the everyday work of a production-minded team.', context: 'Delivered CRUD flows, relational data work, API endpoints, and responsive UI slicing through a practical development cycle.', tags: ['Laravel', 'REST API', 'MySQL', 'Git'], href: '#contact', action: 'Ask about this project' },
]

export default function ProjectsSection({ onProjectChange, language }) {
  const refs = useRef([])
  useEffect(() => {
    let frame
    const update = () => {
      const center = window.innerHeight / 2
      const active = refs.current.reduce((best, element, index) => {
        if (!element) return best
        const rect = element.getBoundingClientRect()
        const distance = Math.abs(rect.top + rect.height / 2 - center)
        return distance < best.distance ? { index, distance } : best
      }, { index: 0, distance: Infinity })
      onProjectChange(active.index)
    }
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update) }
    window.addEventListener('scroll', onScroll, { passive: true }); update()
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame) }
  }, [onProjectChange])
  const id = language === 'id'
  const localizedProjects = id ? projects.map((project, index) => ({
    ...project,
    description: [
      'Sistem pemesanan klinik multi-peran untuk pasien, dokter, dan administrator—dirancang agar penjadwalan tetap andal.',
      'Situs personal responsif yang memudahkan perekrut meninjau kemampuan teknis, kontak, dan konteks proyek.',
      'Produk yang dikerjakan selama PKL di PT Laskar Teknologi Mulia, dengan kontribusi pada kebutuhan tim dan aplikasi produksi.',
    ][index],
    context: [
      'Mencegah pemesanan ganda bersamaan dengan transaksi, lockForUpdate, dan unique constraint pada basis data.',
      'Menggabungkan antarmuka editorial dengan React SPA, penanganan error terpusat, dan alur kontak berbasis email.',
      'Mengerjakan alur CRUD, data relasional, endpoint API, dan UI responsif dalam siklus pengembangan praktis.',
    ][index],
    action: index === 1 ? 'Lihat situs ini' : 'Tanyakan proyek ini',
  })) : projects
  return <section id="projects" className="projects" aria-labelledby="projects-title"><div className="projects-intro"><p className="section-number">No. 03 — {id ? 'Karya Pilihan' : 'Selected Work'}</p><h2 id="projects-title">{id ? <>Dibuat untuk<br />menjawab kebutuhan.</> : <>Made to solve<br />something real.</>}</h2></div><div className="project-gallery">{localizedProjects.map((project, index) => <article className={`project-panel project-panel--${index}`} ref={(element) => { refs.current[index] = element }} key={project.name}><div className="project-panel-caption"><p>{project.index}</p><h3>{project.name}</h3><ProjectCopy {...project} showHeading={false}>{project.action}</ProjectCopy></div></article>)}</div></section>
}
