export default function Navigation({ language, onLanguageChange }) {
  const id = language === 'id'
  return (
    <nav className="site-nav" aria-label="Primary navigation">
      <a className="nav-mark" href="#top" aria-label="Go to top">MA</a>
      <div className="nav-links">
        <a href="#projects">{id ? 'Karya' : 'Work'}</a>
        <a href="#about">{id ? 'Tentang' : 'About'}</a>
        <a href="#contact">{id ? 'Kontak' : 'Contact'}</a>
      </div>
      <div className="nav-actions">
        <button className="language-toggle" type="button" onClick={() => onLanguageChange(id ? 'en' : 'id')} aria-label={id ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}>{id ? 'ID / EN' : 'EN / ID'}</button>
        <a className="nav-contact" href="#contact">{id ? 'Hubungi Saya' : "Let's Talk"}</a>
      </div>
    </nav>
  )
}
