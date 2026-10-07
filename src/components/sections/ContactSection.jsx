import { useState } from 'react'

const EMAIL = 'marizkyakmal@gmail.com'

export default function ContactSection({ language }) {
  const id = language === 'id'
  const [state, setState] = useState('')

  const submit = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') || '').trim()
    const email = String(form.get('email') || '').trim()
    const message = String(form.get('message') || '').trim()
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`)
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nReply to: ${email}`)
    setState(id ? 'Aplikasi email Anda akan terbuka dengan pesan yang sudah disiapkan.' : 'Your email app will open with the message ready to send.')
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`
  }

  return <section id="contact" className="contact section-shell" aria-labelledby="contact-title"><div className="contact-heading"><p className="section-number">No. 05 — {id ? 'Kontak' : 'Contact'}</p><h2 id="contact-title">{id ? <>Mari buat<br />sesuatu yang berguna.</> : <>Let’s make<br />something useful.</>}</h2><p>{id ? 'Punya peluang, ide produk, atau pertanyaan?' : 'Have an opportunity, a product idea, or a thoughtful question?'}</p><a className="email-link" href={`mailto:${EMAIL}`}>{EMAIL} <span>↗</span></a></div><form onSubmit={submit}><label>{id ? 'Nama' : 'Name'}<input type="text" name="name" autoComplete="name" required placeholder={id ? 'Nama Anda' : 'Your name'} /></label><label>Email<input type="email" name="email" autoComplete="email" required placeholder="you@company.com" /></label><label>{id ? 'Pesan' : 'Message'}<textarea name="message" rows="4" required placeholder={id ? 'Ceritakan singkat pesan Anda' : 'A few words about what you have in mind'} /></label><button className="submit-button" type="submit">{id ? 'Siapkan email' : 'Prepare email'} <span>→</span></button><p className="form-note">{id ? 'Form ini menyiapkan email melalui aplikasi email Anda.' : 'This form prepares an email in your email app.'}</p>{state && <p className="form-state" role="status">{state}</p>}</form></section>
}
