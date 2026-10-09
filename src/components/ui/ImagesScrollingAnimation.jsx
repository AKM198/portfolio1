import { useEffect, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

function StickyProjectCard({ project, index, total, progress, reduceMotion }) {
  const start = index / total
  const targetScale = 1 - (total - index) * 0.05
  const scale = useTransform(progress, [start, 1], [1, targetScale])
  const dimStart = Math.min(1, (index + 1) / total)
  const dimEnd = Math.min(1, dimStart + .08)
  const dim = useTransform(
    progress,
    index === total - 1 ? [0, 1] : [dimStart, dimEnd],
    index === total - 1 ? [1, 1] : [1, .12],
  )

  return (
    <div className="project-scroll-sticky" style={{ zIndex: index + 10 }}>
      <motion.article
        className="project-scroll-card"
        style={{ scale: reduceMotion ? 1 : scale, opacity: reduceMotion ? 1 : dim, top: index * 18, transformOrigin: 'top center' }}
        aria-labelledby={`project-card-title-${index}`}
      >
        <img className="project-scroll-image" src={project.src} alt="" loading="lazy" decoding="async" />
        <div className="project-scroll-shade" />
        <div className="project-scroll-copy">
          <p className="project-scroll-index">{project.index}</p>
          <h3 id={`project-card-title-${index}`}>{project.name}</h3>
          <p className="project-scroll-description">{project.description}</p>
          <p className="project-scroll-context"><b>{project.contextLabel}</b> {project.context}</p>
          <div className="project-scroll-tags" aria-label={project.stackLabel}>
            {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
          <a href={project.href} className="project-scroll-link">{project.action} <span aria-hidden="true">→</span></a>
        </div>
      </motion.article>
    </div>
  )
}

export default function ImagesScrollingAnimation({ projects, onProjectChange }) {
  const container = useRef(null)
  const activeProjectIndex = useRef(-1)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  })
  const total = projects.length

  useEffect(() => {
    if (!total || !onProjectChange) return undefined

    const reportActiveProject = (progress) => {
      const index = Math.min(Math.max(0, Math.floor(progress * total)), total - 1)
      if (activeProjectIndex.current === index) return
      activeProjectIndex.current = index
      onProjectChange(index, projects[index])
    }

    reportActiveProject(scrollYProgress.get())
    return scrollYProgress.on('change', reportActiveProject)
  }, [onProjectChange, projects, scrollYProgress, total])

  return (
    <div id="project-scroll-track" ref={container} className="project-scroll-track" style={{ height: `${total * 100}vh` }}>
      {projects.map((project, index) => (
        <StickyProjectCard
          key={project.name}
          project={project}
          index={index}
          total={total}
          progress={scrollYProgress}
          reduceMotion={reduceMotion}
        />
      ))}
    </div>
  )
}
