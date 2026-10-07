import { useState } from 'react'
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
  const [activeProject, setActiveProject] = useState(0)
  const [language, setLanguage] = useState('en')
  return (
    <main lang={language}>
      <div className="paper-grain" aria-hidden="true" />
      <ScrollProfile activeProject={activeProject} />
      <Navigation language={language} onLanguageChange={setLanguage} />
      <HeroSection language={language} />
      <CapabilitiesSection language={language} />
      <AboutSection language={language} />
      <ExperienceSection language={language} />
      <ProjectsSection language={language} onProjectChange={setActiveProject} />
      <FaqSection language={language} />
      <ContactSection language={language} />
      <Footer language={language} />
    </main>
  )
}

export default App
