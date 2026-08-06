import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { ArrowRight, Phone, MessageSquare } from 'lucide-react'
import FooterOwl from './components/FooterOwl'

// ---- Contact (from Margo's card) --------------------------------------------
// Bookings by phone call or text (SMS) only; no email, no online booking form.
export const PHONE_DISPLAY = '021 202 9441'
export const PHONE_E164 = '+64212029441'
export const PHONE_TEL = `tel:${PHONE_E164}`
export const ADDRESS = '121 Mahurangi East Road, Snells Beach 0920'
export const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Margo%20Hairstylist%20121%20Mahurangi%20East%20Road%20Snells%20Beach'

// Text-to-book links. `?&body=` is the one form every platform accepts: iOS and
// macOS Messages want `&body=`, Android wants `?body=`, and `?&body=` satisfies
// both, so one href works on an iPhone, an Android and a Mac with no sniffing.
// The message arrives already written so the visitor only has to press send.
export const smsTo = (body) => `sms:${PHONE_E164}?&body=${encodeURIComponent(body)}`
export const SMS_URL = smsTo('Hi Margo, I would like to book an appointment. My name is ')
export const SMS_PRODUCTS = smsTo('Hi Margo, I would like to ask about a product. ')

// Product lines Margo carries, premium to everyday. Brelil is deliberately out:
// she only stocks one of its lines for now (confirmed 2026-08-07), so it does not
// earn a place on the shelf list yet.
export const BRANDS = ['Wella', 'Paul Mitchell', 'De Lorenzo']

// ---- Admin auth (client-side, demo-level) -----------------------------------
// Shared password both Margo and Alexis use. Client-side only: keeps the admin
// out of casual reach, not bank-grade. "Remember me" stores the session in
// localStorage so they stay signed in on that device; otherwise sessionStorage.
export const ADMIN_PASSWORD = 'margo2026'
const AUTH_KEY = 'margo_admin'
export function isAdmin() {
  try { return localStorage.getItem(AUTH_KEY) === '1' || sessionStorage.getItem(AUTH_KEY) === '1' }
  catch { return false }
}
export function signInAdmin(remember) {
  (remember ? localStorage : sessionStorage).setItem(AUTH_KEY, '1')
}
export function signOutAdmin() {
  try { localStorage.removeItem(AUTH_KEY); sessionStorage.removeItem(AUTH_KEY) } catch {}
}

// Scroll-reveal helpers
export function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('in') },
      { threshold: 0.18 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

export function Reveal({ children, as: Tag = 'div', className = '', ...rest }) {
  const ref = useReveal()
  return <Tag ref={ref} className={`fade-up ${className}`} {...rest}>{children}</Tag>
}

// Smooth scroll (desktop)
export function useLenis() {
  useEffect(() => {
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!isDesktop) return
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: true })
    let rafId
    function raf(time) { lenis.raf(time); rafId = requestAnimationFrame(raf) }
    rafId = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(rafId); lenis.destroy() }
  }, [])
}

const LINKS = [
  ['services', 'Services'],
  ['products', 'Products'],
  ['about', 'About'],
  ['blog', 'Blog'],
  ['contact', 'Contact'],
]

// Shared top navigation. `page` is 'home' | 'products' | 'blog'.
// On home the sliding underline follows the in-view section; on products/blog it
// sits statically under the current page's link.
export function Nav({ page = 'home' }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState(page === 'home' ? '' : page)
  const navListRef = useRef(null)
  const [uline, setUline] = useState({ left: 0, width: 0, show: false })

  const hrefFor = (id) => {
    if (id === 'products') return '/products'
    if (id === 'blog') return '/blog'
    return page === 'home' ? `#${id}` : `/#${id}`
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll-spy only on the home page (tracks the in-page sections).
  useEffect(() => {
    if (page !== 'home') return
    const ids = ['services', 'about', 'contact']
    const compute = () => {
      const line = window.innerHeight * 0.42
      let cur = ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const r = el.getBoundingClientRect()
        if (r.top <= line && r.bottom > line) { cur = id; break }
      }
      setActive(cur)
    }
    compute()
    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute)
    return () => { window.removeEventListener('scroll', compute); window.removeEventListener('resize', compute) }
  }, [page])

  const snap = () => {
    const el = navListRef.current?.querySelector('a.active')
    if (el) setUline({ left: el.offsetLeft, width: el.offsetWidth, show: true })
    else setUline((u) => ({ ...u, show: false }))
  }
  useEffect(() => { snap() }, [active])
  useEffect(() => {
    const r = () => snap()
    window.addEventListener('resize', r)
    return () => window.removeEventListener('resize', r)
  }, [])

  const closeMenu = () => setMenuOpen(false)
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
        <a href="/" className="nav-brand" onClick={closeMenu} aria-label="Margo Hairstyles, home">
          <img src="/margo-mark.png" alt="" className="nav-brand-mark" width="57" height="46" />
          <span className="nav-brand-text">Margo</span>
        </a>
        <ul className="nav-links" ref={navListRef}>
          {LINKS.map(([id, label]) => (
            <li key={id}>
              <a
                href={hrefFor(id)}
                className={active === id ? 'active' : ''}
                onClick={() => { if (page === 'home' && id !== 'products' && id !== 'blog') setActive(id) }}
              >{label}</a>
            </li>
          ))}
          <span className="nav-underline" style={{ left: uline.left, width: uline.width, opacity: uline.show ? 1 : 0 }} />
        </ul>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a href={PHONE_TEL} className="btn btn-primary nav-cta">Call to book <ArrowRight size={14} /></a>
        </div>
        <button
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          data-nav-toggle
          aria-expanded={menuOpen}
          className={`nav-burger ${menuOpen ? 'is-open' : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
        ><span/><span/><span/></button>
      </nav>

      {/* The nav is fixed, and on home the hero sits underneath it by design.
          Every other page starts its copy at the top of the document, where the
          nav lands on top of the first line on phones. This clears it. */}
      {page !== 'home' && <div className="nav-spacer" aria-hidden="true" />}

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <ul className="mobile-menu-links">
          {LINKS.map(([id, label]) => (
            <li key={id}><a href={hrefFor(id)} onClick={closeMenu}>{label}</a></li>
          ))}
        </ul>
        <a href={PHONE_TEL} className="btn btn-primary mobile-menu-cta" onClick={closeMenu}>
          Call to book <Phone size={14} />
        </a>
        <div className="mobile-menu-foot">
          <a href={PHONE_TEL} onClick={closeMenu}>Call {PHONE_DISPLAY}</a>
          <a href={SMS_URL} onClick={closeMenu}>Text Margo</a>
        </div>
      </div>
    </>
  )
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <img src="/margo-logo.png" alt="Margo Hairstyles" className="footer-logo" width="200" height="212" />
      <div className="footer-tag">Qualified Hairstylist · Snells Beach</div>
      <div className="footer-bar">
        <span>© {new Date().getFullYear()} Margo Hairstylist · All rights reserved</span>
      </div>
      <div className="qv-badge">
        <a href="https://quantumvector.org" target="_blank" rel="noopener noreferrer">
          <FooterOwl size={28} />
          Powered by Quantum Vector
        </a>
      </div>
    </footer>
  )
}
