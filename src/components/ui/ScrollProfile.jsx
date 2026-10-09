import { useLayoutEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import profileImage from '../../assets/profile.webp'

const SECTION_IDS = ['top', 'capabilities', 'about', 'experience', 'projects', 'project-scroll-track', 'faq', 'contact', 'footer']
const FALLBACK_ANCHORS = [0, 900, 1800, 2700, 3600, 3900, 4800, 5700, 6600]

function useSectionAnchors() {
  const [anchors, setAnchors] = useState(FALLBACK_ANCHORS)

  useLayoutEffect(() => {
    let resizeObserver

    const measure = () => {
      let previous = -1
      const next = SECTION_IDS.map((id, index) => {
        const section = document.getElementById(id)
        const measured = section
          ? section.getBoundingClientRect().top + window.scrollY
          : (previous < 0 ? FALLBACK_ANCHORS[index] : previous + window.innerHeight)
        const position = Math.max(0, measured, previous + 1)
        previous = position
        return position
      })

      setAnchors((current) => next.every((value, index) => value === current[index]) ? current : next)
    }

    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('load', measure)

    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(measure)
      SECTION_IDS
        .map((id) => document.getElementById(id))
        .filter(Boolean)
        .forEach((section) => resizeObserver.observe(section))
      resizeObserver.observe(document.body)
    }

    document.fonts?.ready.then(measure)

    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('load', measure)
      resizeObserver?.disconnect()
    }
  }, [])

  return anchors
}

export default function ScrollProfile({ projectImage }) {
  const reduceMotion = useReducedMotion()
  const anchors = useSectionAnchors()
  const { scrollY } = useScroll()
  const [viewport, setViewport] = useState({ width: 1280, height: 800 })

  useLayoutEffect(() => {
    const updateViewport = () => setViewport({ width: window.innerWidth, height: window.innerHeight })
    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  const [top, capabilities, about, experience, projects, projectTrack, faq, contact, footer] = anchors
  const blendEnd = projectTrack + viewport.height * 0.18
  const scrollAnchors = [top, capabilities, about, experience, projects, projectTrack, blendEnd, faq, contact, footer]
  const smallViewport = viewport.width <= 800
  const projectGutter = smallViewport ? 16 : Math.max(18, Math.min(viewport.width * 0.05, 72))
  const projectWidth = Math.min(viewport.width - projectGutter * 2, 1040)
  const projectHeight = Math.max(smallViewport ? 360 : 390, Math.min(viewport.height * (smallViewport ? 0.66 : 0.68), smallViewport ? 570 : 650))
  const profileWidth = viewport.width < 768
    ? Math.max(150, Math.min(viewport.width * 0.48, 230))
    : Math.max(220, Math.min(viewport.width * 0.22, 340))
  const profileHeight = viewport.width < 768
    ? Math.max(210, Math.min(viewport.width * 0.62, 300))
    : Math.max(300, Math.min(viewport.width * 0.38, 480))
  const rightPosition = smallViewport ? '18vw' : '30vw'
  const x = useTransform(scrollY, scrollAnchors, ['0vw', rightPosition, rightPosition, '0vw', '0vw', '0vw', '0vw', '0vw', '0vw', '0vw'])
  const width = useTransform(scrollY, scrollAnchors, [profileWidth, profileWidth, profileWidth, profileWidth, profileWidth, projectWidth, projectWidth, profileWidth, profileWidth, profileWidth])
  const height = useTransform(scrollY, scrollAnchors, [profileHeight, profileHeight, profileHeight, profileHeight, profileHeight, projectHeight, projectHeight, profileHeight, profileHeight, profileHeight])
  const rotateY = useTransform(scrollY, scrollAnchors, [0, 0, 0, 180, 180, 180, 180, 180, 180, 180])
  const rotateZ = useTransform(scrollY, scrollAnchors, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  const cardOpacity = useTransform(scrollY, scrollAnchors, [1, 1, 1, 1, 1, 1, 0, 0, 0, 0])
  const projectOpacity = useTransform(scrollY, scrollAnchors, [0, 0, 0, 0, 0, 1, 1, 0, 0, 0])
  const portraitOpacity = useTransform(projectOpacity, [0, 1], [1, 0])

  return (
    <div className="scroll-profile" aria-hidden="true">
      <motion.div
        className="profile-card-motion"
        style={{
          x: reduceMotion ? 0 : x,
          width: reduceMotion ? profileWidth : width,
          height: reduceMotion ? profileHeight : height,
          rotateY: reduceMotion ? 0 : rotateY,
          rotateZ: reduceMotion ? 0 : rotateZ,
          opacity: reduceMotion ? 1 : cardOpacity,
        }}
      >
        <div className="profile-card">
          <div className="profile-card-inner">
            <div className="profile-card-face profile-card-face--front">
              <img src={profileImage} alt="" />
            </div>
            <div className="profile-card-face profile-card-face--back">
              <motion.img
                className="profile-card-back-portrait"
                src={profileImage}
                alt=""
                style={{ opacity: reduceMotion ? 1 : portraitOpacity }}
              />
              <motion.div
                className="profile-card-project-image-layer"
                style={{ opacity: reduceMotion ? 0 : projectOpacity }}
              >
                <AnimatePresence initial={false}>
                  <motion.img
                    key={projectImage || 'profile-fallback'}
                    src={projectImage || profileImage}
                    alt=""
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />
                </AnimatePresence>
              </motion.div>
            </div>
            <span className="profile-card-edge profile-card-edge--top" />
            <span className="profile-card-edge profile-card-edge--right" />
            <span className="profile-card-edge profile-card-edge--bottom" />
            <span className="profile-card-edge profile-card-edge--left" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
