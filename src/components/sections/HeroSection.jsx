export default function HeroSection({ language }) {
  const id = language === 'id'
  return (
    <header id="top" className="masthead">
      <div className="hero-left entrance-one">
        <h1>MARIZKY<br />AKMAL</h1>
      </div>
      <div className="hero-right entrance-two">
        <p className="hero-role">{id ? 'PENGEMBANG FULL-STACK' : 'FULL-STACK DEVELOPER'}</p>
        <p className="hero-description">
          {id ? 'Saya membangun produk web dengan Laravel, React, Flutter, dan MySQL—dari skema data hingga antarmuka.' : 'I build useful web products with Laravel, React, Flutter, and MySQL—from schema to screen.'}
        </p>
      </div>
      <p className="hero-location entrance-three">
        BANDUNG, INDONESIA — VOL. 01 — FULLSTACK ISSUE
      </p>
      <span className="hero-greeting entrance-three">Hi</span>
      <a className="hero-scroll entrance-three" href="#capabilities">
        {id ? 'Gulir untuk menjelajah' : 'Scroll to explore'} <span>↓</span>
      </a>
    </header>
  )
}
