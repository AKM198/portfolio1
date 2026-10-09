import { useCallback, useState } from 'react'
import { ReactLenis } from 'lenis/react'
import Navigation from './components/sections/Navigation'
import HeroSection from './components/sections/HeroSection'
import CapabilitiesSection from './components/sections/CapabilitiesSection'
import AboutSection from './components/sections/AboutSection'
import ExperienceSection from './components/sections/ExperienceSection'
import ProjectsSection from './components/sections/ProjectsSection'
import FaqSection from './components/sections/FaqSection'
import ContactSection from './components/sections/ContactSection'
import Footer from './components/sections/Footer'
import ScrollProfile from './components/ui/ScrollProfile'
import './App.css'

function App() {
  const [language, setLanguage] = useState('en')
  const [activeProjectImage, setActiveProjectImage] = useState(null)
  const handleProjectChange = useCallback((_, project) => {
    setActiveProjectImage(project?.src ?? null)
  }, [])
  return (
    <ReactLenis root options={{ anchors: true, lerp: 0.09, smoothWheel: true, respectReducedMotion: true }}>
      <main lang={language} data-surface="blue">
        <div className="viewport-frame" aria-hidden="true" />
        <div className="paper-grain" aria-hidden="true" />
        <ScrollProfile projectImage={activeProjectImage} />
        <Navigation language={language} onLanguageChange={setLanguage} />
        <HeroSection language={language} />
        <CapabilitiesSection language={language} />
        <AboutSection language={language} />
        <ExperienceSection language={language} />
        <ProjectsSection
          language={language}
          onProjectChange={handleProjectChange}
        />
        <FaqSection language={language} />
        <ContactSection language={language} />
        <Footer language={language} />
      </main>
    </ReactLenis>
  )
}

export default App
