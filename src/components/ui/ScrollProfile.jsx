import { useEffect, useState } from 'react'
import profileImage from '../../assets/profile.webp'

const SECTIONS = [
  { id: 'top', stage: 'hero' },
  { id: 'capabilities', stage: 'capabilities' },
  { id: 'about', stage: 'about' },
  { id: 'projects', stage: 'projects' },
]

function getActiveStage() {
  const probeY = window.innerHeight * 0.5

  for (let index = SECTIONS.length - 1; index >= 0; index -= 1) {
    const { id, stage } = SECTIONS[index]
    const element = document.getElementById(id)
    if (!element) continue

    const rect = element.getBoundingClientRect()
    if (rect.top <= probeY && rect.bottom > probeY) return stage
  }

  const projectsSection = document.getElementById('projects')
  if (projectsSection) {
    const projectRect = projectsSection.getBoundingClientRect()
    if (projectRect.bottom < window.innerHeight * 0.12) return 'after-projects'
  }

  return 'hero'
}

export default function ScrollProfile({ activeProject }) {
  const [stage, setStage] = useState('hero')

  useEffect(() => {
    let frame
    const updatePosition = () => setStage(getActiveStage())
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(updatePosition)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    updatePosition()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      className={`scroll-profile scroll-profile--${stage} scroll-profile--project-${activeProject}`}
      aria-hidden="true"
    >
      <div className="profile-card">
        <div className="profile-card-inner">
          <div className="profile-card-face profile-card-face--front">
            <img src={profileImage} alt="" />
          </div>
          <div className="profile-card-face profile-card-face--back">
            <img src={profileImage} alt="" />
          </div>
          <span className="profile-card-edge profile-card-edge--top" aria-hidden="true" />
          <span className="profile-card-edge profile-card-edge--right" aria-hidden="true" />
          <span className="profile-card-edge profile-card-edge--bottom" aria-hidden="true" />
          <span className="profile-card-edge profile-card-edge--left" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}
