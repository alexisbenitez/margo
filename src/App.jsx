import { useEffect, useRef, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Lenis from 'lenis'
import {
  MessageSquare, MapPin, Clock, ArrowRight, Scissors, Phone, Star,
  ShoppingCart, Plus, Minus, X, Check, ShieldCheck,
} from 'lucide-react'
import FooterOwl from './components/FooterOwl'
import LoadingScreen from './components/LoadingScreen'
import { loadProducts, onProductsChanged, money } from './products'

// ---- Contact (from Margo's card) --------------------------------------------
// Margo takes bookings by phone call or text (SMS) only, and writes them into
// her booking book by hand. So every call to action is a call or an SMS: there
// is no email contact and no online booking form.
const PHONE_DISPLAY = '021 202 9441'
const PHONE_TEL = 'tel:+64212029441'
const SMS_URL = 'sms:+64212029441'
const ADDRESS = '121 Mahurangi East Road, Snells Beach 0920'
const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Margo%20Hairstylist%20121%20Mahurangi%20East%20Road%20Snells%20Beach'

const SERVICES = [
  { name: 'Cuts & Styling', desc: 'Women, men and kids. A cut shaped to suit you and to sit well as it grows out, finished with a proper blow wave.' },
  { name: 'Colour', desc: 'Full colour, root touch-ups, foils and balayage, always weighed against the health of your hair.' },
  { name: 'Keratin & Straightening', desc: 'Smoothing and keratin treatments that leave frizz behind and make everyday hair far more manageable.' },
  { name: 'Curly Hair', desc: 'Curl-literate cutting and styling that works with your natural pattern instead of fighting it.' },
  { name: 'Treatments & Blow Waves', desc: 'Deep hydration treatments and salon blow waves using the Angel en Provence organic range.' },
]

// Real reviews from Margo's Google listing (4.9 stars, verbatim, lightly tidied).
const REVIEWS = [
  { name: 'Anne-marie Marsh', featured: true, text: 'I absolutely love Margo and her wizardry as a hairdresser. I followed her from Auckland because I love how she cuts and styles my hair. Her prices are very reasonable and she is so lovely. Look no further.' },
  { name: 'Lisa Lowe', text: 'Really happy with my keratin treatment. It has made my hair so much more manageable. Margo really listens and is skilled at what she does.' },
  { name: 'Jo Campling', featured: true, text: "I love Margo. Every time I see her I feel like I'm leaving with a bit more wisdom about life, as well as a great hair do. The Snells Beach community are lucky to have her." },
  { name: 'Elaine Brand', text: 'What an amazing experience my first visit with Margo was. She knew exactly what to do with my curly hair. What a blessing. I can recommend her with confidence.' },
  { name: 'Martin Gray', text: "My third time having a great men's cut from Margo. So happy I found her. She works fast and accurately and always gives me the cut I ask for. Very professional. Added bonus, I get to practise my Spanish while she works." },
  { name: 'Isabella Van Hulten', text: 'Margo is great. So knowledgeable and such a good eye for what suits you while considering the health of your hair. Highly recommended.' },
  { name: 'Vicki Partridge', text: "This lady is a very talented and beautiful soul. Her prices are really excellent and the products she uses are specific to her client, not generic. Can't recommend her enough." },
]

function useReveal() {
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

function Reveal({ children, as: Tag = 'div', className = '', ...rest }) {
  const ref = useReveal()
  return <Tag ref={ref} className={`fade-up ${className}`} {...rest}>{children}</Tag>
}

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([]) // [{id, qty}]
  const [cartOpen, setCartOpen] = useState(false)
  const [checkout, setCheckout] = useState(null) // null | 'methods' | 'success'
  const [active, setActive] = useState('') // current section for nav underline
  const navListRef = useRef(null)
  const [uline, setUline] = useState({ left: 0, width: 0, show: false }) // sliding underline
  const reviewsSectionRef = useReveal()

  const snapUnderlineToActive = () => {
    const el = navListRef.current?.querySelector('a.active')
    if (el) setUline({ left: el.offsetLeft, width: el.offsetWidth, show: true })
    else setUline((u) => ({ ...u, show: false }))
  }

  // Scroll-spy (position based): the underline follows whichever section crosses
  // the reference line, and clears entirely on the hero (above the first section).
  useEffect(() => {
    const ids = ['services', 'shop', 'about', 'visit']
    const compute = () => {
      const line = window.innerHeight * 0.42
      let current = ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const r = el.getBoundingClientRect()
        if (r.top <= line && r.bottom > line) { current = id; break }
      }
      setActive(current)
    }
    compute()
    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute)
    return () => { window.removeEventListener('scroll', compute); window.removeEventListener('resize', compute) }
  }, [])

  // Slide the underline to the active link whenever the section changes / on resize.
  useEffect(() => { snapUnderlineToActive() }, [active])
  useEffect(() => {
    const onResize = () => snapUnderlineToActive()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Products (live-synced with the admin panel)
  useEffect(() => {
    const refresh = () => setProducts(loadProducts())
    refresh()
    return onProductsChanged(refresh)
  }, [])

  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [loading])

  useEffect(() => {
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!isDesktop) return
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: true })
    let rafId
    function raf(time) { lenis.raf(time); rafId = requestAnimationFrame(raf) }
    rafId = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(rafId); lenis.destroy() }
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const lockScroll = menuOpen || cartOpen || !!checkout
  useEffect(() => {
    document.body.style.overflow = lockScroll ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lockScroll])

  const closeMenu = () => setMenuOpen(false)

  // ---- Cart ----
  const productById = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products])
  const cartLines = cart
    .map((line) => ({ ...line, product: productById[line.id] }))
    .filter((l) => l.product)
  const cartCount = cartLines.reduce((n, l) => n + l.qty, 0)
  const cartTotal = cartLines.reduce((n, l) => n + l.qty * l.product.price, 0)

  const addToCart = (id) => {
    setCart((c) => {
      const found = c.find((l) => l.id === id)
      if (found) return c.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l))
      return [...c, { id, qty: 1 }]
    })
    setCartOpen(true)
  }
  const setQty = (id, delta) =>
    setCart((c) =>
      c
        .map((l) => (l.id === id ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0)
    )
  const removeLine = (id) => setCart((c) => c.filter((l) => l.id !== id))

  const startCheckout = () => { setCartOpen(false); setCheckout('methods') }
  const pay = () => {
    setCheckout('success')
    setCart([])
  }
  const closeCheckout = () => setCheckout(null)

  return (
    <>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}

      {/* NAV */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
        <a href="#top" className="nav-brand" onClick={closeMenu}>
          <img src="/margo-logo.png" alt="" className="nav-brand-mark" />
          <span className="nav-brand-text">Margo</span>
        </a>
        <ul className="nav-links" ref={navListRef}>
          {[['services', 'Services'], ['shop', 'Shop'], ['about', 'About'], ['visit', 'Visit']].map(([id, label]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={active === id ? 'active' : ''}
                onClick={() => setActive(id)}
              >{label}</a>
            </li>
          ))}
          <span
            className="nav-underline"
            style={{ left: uline.left, width: uline.width, opacity: uline.show ? 1 : 0 }}
          />
        </ul>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a href={PHONE_TEL} className="btn btn-primary nav-cta">Call to book <ArrowRight size={14} /></a>
          <button className="nav-cart" aria-label="Open cart" onClick={() => setCartOpen(true)}>
            <ShoppingCart size={18} />
            {cartCount > 0 && <span className="nav-cart-count">{cartCount}</span>}
          </button>
        </div>
        <button
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className={`nav-burger ${menuOpen ? 'is-open' : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
        ><span/><span/><span/></button>
      </nav>

      {/* MOBILE DRAWER */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <ul className="mobile-menu-links">
          <li><a href="#services" onClick={closeMenu}>Services</a></li>
          <li><a href="#shop" onClick={closeMenu}>Shop</a></li>
          <li><a href="#about" onClick={closeMenu}>About</a></li>
          <li><a href="#visit" onClick={closeMenu}>Visit</a></li>
        </ul>
        <a href={PHONE_TEL} className="btn btn-primary mobile-menu-cta" onClick={closeMenu}>
          Call to book <Phone size={14} />
        </a>
        <div className="mobile-menu-foot">
          <a href={PHONE_TEL} onClick={closeMenu}>Call {PHONE_DISPLAY}</a>
          <a href={SMS_URL} onClick={closeMenu}>Text Margo</a>
        </div>
      </div>

      {/* HERO */}
      <header id="top" className="hero">
        <div className="hero-inner">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>
              <Scissors size={14} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }}/>
              Qualified Hairstylist · Snells Beach
            </div>
            <h1 className="hero-title">
              Salon-quality hair,<br/>
              in a warm <em>little studio.</em>
            </h1>
            <p className="hero-sub">
              Cuts, colour, curls and keratin by Margo, a qualified hairstylist with a home
              studio in Snells Beach. Plus a small shop of the organic products she uses every day.
            </p>
            <div className="hero-actions">
              <a href={PHONE_TEL} className="btn btn-primary"><Phone size={14}/> Call to book</a>
              <a href={SMS_URL} className="btn btn-ghost"><MessageSquare size={14}/> Text to book</a>
            </div>
          </motion.div>

          <motion.div
            className="hero-meta"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div className="hero-meta-item">
              <div className="lbl">Studio</div>
              <div className="val">Snells Beach</div>
            </div>
            <div className="hero-meta-item">
              <div className="lbl">By appointment</div>
              <div className="val">Mon - Sat</div>
            </div>
            <div className="hero-meta-item">
              <div className="lbl">Rated on Google</div>
              <div className="val" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                4.9 <Star size={16} fill="var(--terracotta)" color="var(--terracotta)" />
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* WHY MARGO */}
      <section id="ethos" className="about">
        <div className="section">
          <div className="section-head">
            <Reveal>
              <div className="eyebrow" style={{ marginBottom: '1rem' }}>Why Margo</div>
              <h2>Hair that suits<br/>your actual life.</h2>
            </Reveal>
            <Reveal as="p">
              No conveyor belt, no upsell. Just one stylist who listens, has a good eye,
              and looks after the health of your hair as much as the look. The kind of place
              people follow across town for.
            </Reveal>
          </div>

          <div className="about-grid">
            <Reveal className="about-card">
              <span className="num">· 01</span>
              <h3>She listens</h3>
              <p>You get the cut and colour you actually asked for, shaped to suit your face, your hair and how much time you want to spend on it.</p>
            </Reveal>
            <Reveal className="about-card">
              <span className="num">· 02</span>
              <h3>Genuinely skilled</h3>
              <p>Curly hair, keratin smoothing, colour and men's cuts, all done fast and accurately, with a real eye for what works.</p>
            </Reveal>
            <Reveal className="about-card">
              <span className="num">· 03</span>
              <h3>Warm and local</h3>
              <p>A relaxed home studio in Snells Beach with honest, reasonable pricing and the good organic products she believes in.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services">
        <div className="section">
          <div className="section-head">
            <Reveal>
              <div className="eyebrow" style={{ marginBottom: '1rem' }}>Services</div>
              <h2>What Margo<br/>does.</h2>
            </Reveal>
            <Reveal as="p">
              Everything is by appointment in the Snells Beach studio. New to Margo? Just mention
              what you are after when you book and she will talk you through it.
            </Reveal>
          </div>

          <div className="services-list">
            {SERVICES.map((s, i) => (
              <Reveal key={s.name} className="service">
                <div className="idx">· 0{i + 1}</div>
                <h3>{s.name}</h3>
                <div className="desc">{s.desc}</div>
              </Reveal>
            ))}
          </div>
          <Reveal as="p" className="services-note">
            Pricing is friendly and by consultation, so you always know the cost before we start.
            {' '}<a href={PHONE_TEL} style={{ color: 'var(--terracotta)' }}>Call</a> or{' '}
            <a href={SMS_URL} style={{ color: 'var(--terracotta)' }}>text to book →</a>
          </Reveal>
        </div>
      </section>

      {/* SHOP */}
      <section id="shop" className="shop">
        <div className="section">
          <div className="section-head">
            <Reveal>
              <div className="eyebrow" style={{ marginBottom: '1rem' }}>The Shop</div>
              <h2>Take the salon<br/>home with you.</h2>
            </Reveal>
            <Reveal as="p">
              The same Angel en Provence organic range Margo uses in the studio, available to buy.
              Add to your cart and check out online, or just ask about anything at your next appointment.
            </Reveal>
          </div>

          <div className="product-grid">
            {products.map((p) => (
              <Reveal key={p.id} className="product-card">
                <div className="product-media">
                  <img src={p.image} alt={p.name} loading="lazy" />
                  {p.brand && <span className="product-brandtag">{p.brand}</span>}
                  {!p.inStock && <span className="product-soldout-badge">Sold out</span>}
                </div>
                <div className="product-body">
                  <div className="product-name">{p.name}</div>
                  {p.note && <p className="product-note">{p.note}</p>}
                  <div className="product-foot">
                    <span className="product-price">{money(p.price)}</span>
                    <button
                      className="add-btn"
                      disabled={!p.inStock}
                      onClick={() => addToCart(p.id)}
                    >
                      <Plus size={13} /> {p.inStock ? 'Add' : 'Sold out'}
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT MARGO */}
      <section id="about" className="practitioner">
        <div className="section">
          <div className="practitioner-grid">
            <Reveal className="practitioner-text">
              <div className="eyebrow" style={{ marginBottom: '1rem' }}>The Stylist</div>
              <h2>Meet<br/>Margo.</h2>
              <p>
                Margo is a qualified hairstylist who built a loyal following in Auckland before
                opening her own home studio in Snells Beach. Clients still travel to see her,
                which tells you most of what you need to know.
              </p>
              <p>
                She is known for reading hair well: curls, colour, keratin smoothing and clean
                men's cuts, all done with care for the condition of your hair and a warm chat
                while she works. Only the organic Angel en Provence range touches your hair.
              </p>
              <blockquote>
                "I want you to walk out feeling like yourself, only better,
                with hair that is easy to live with."
              </blockquote>
            </Reveal>
            <Reveal className="practitioner-image" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="reviews" ref={reviewsSectionRef}>
        <div className="section reviews-head">
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: '1rem' }}>Kind words</div>
            <h2>Loved in Snells Beach.</h2>
          </Reveal>
          <Reveal as="div" className="reviews-stars">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} fill="var(--terracotta)" color="var(--terracotta)" />
            ))}
            <p className="reviews-stars-sub">
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">4.9 out of 5 on Google</a>
            </p>
          </Reveal>
        </div>
        <div className="reviews-track">
          {[...Array(2)].map((_, setIdx) => (
            REVIEWS.map((review, i) => (
              <div className={`review-card ${review.featured ? 'is-featured' : ''}`} key={`${setIdx}-${i}`}>
                <div className="review-stars">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={13} fill="var(--terracotta)" color="var(--terracotta)" />
                  ))}
                </div>
                <p className="review-text">&ldquo;{review.text}&rdquo;</p>
                <p className="review-name">{review.name}</p>
              </div>
            ))
          ))}
        </div>
      </section>

      {/* VISIT / CONTACT */}
      <section id="visit">
        <div className="section">
          <div className="section-head">
            <Reveal>
              <div className="eyebrow" style={{ marginBottom: '1rem' }}>Visit</div>
              <h2>Book your<br/>appointment.</h2>
            </Reveal>
            <Reveal as="p">
              Margo works by appointment only from her Snells Beach studio. Give her a call or a
              text and she will find you a time and note you into the book.
            </Reveal>
          </div>

          <div className="contact-grid">
            <Reveal className="contact-card">
              <h3>Get in touch</h3>
              <a className="contact-row" href={PHONE_TEL}>
                <Phone size={18} className="icon" />
                <div>
                  <span className="lbl">Call</span>
                  <span className="val">{PHONE_DISPLAY}</span>
                </div>
              </a>
              <a className="contact-row" href={SMS_URL}>
                <MessageSquare size={18} className="icon" />
                <div>
                  <span className="lbl">Text (SMS)</span>
                  <span className="val">Text {PHONE_DISPLAY}</span>
                </div>
              </a>
              <a className="contact-row" href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                <MapPin size={18} className="icon" />
                <div>
                  <span className="lbl">Studio</span>
                  <span className="val">{ADDRESS}</span>
                  <span className="row-hint">Open in Google Maps →</span>
                </div>
              </a>
            </Reveal>

            <Reveal className="contact-card">
              <h3><Clock size={18} style={{ marginRight: 10, verticalAlign: 'middle', color: 'var(--terracotta)' }}/>Hours</h3>
              <ul className="hours-list">
                <li><span>Monday - Saturday</span><span>By appointment</span></li>
                <li><span>Sunday</span><span>Closed</span></li>
              </ul>
              <div style={{ display: 'flex', gap: '0.7rem', marginTop: 'auto', marginBottom: '1.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <a href={PHONE_TEL} className="btn btn-primary"><Phone size={14}/> Call</a>
                <a href={SMS_URL} className="btn btn-ghost"><MessageSquare size={14}/> Text</a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* MAP — ornamental frame in the brand colours */}
      <section className="map-section" aria-label="Studio location">
        <div className="map-ornament">
          {/* double-line border */}
          <div className="map-bline map-bline-1" />
          <div className="map-bline map-bline-2" />
          {/* corner flourishes */}
          {[
            { top: 0, left: 0, transform: 'rotate(0deg)' },
            { top: 0, right: 0, transform: 'rotate(90deg)' },
            { bottom: 0, right: 0, transform: 'rotate(180deg)' },
            { bottom: 0, left: 0, transform: 'rotate(270deg)' },
          ].map((pos, i) => (
            <svg key={i} className="map-corner" style={pos} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="16" y1="16" x2="48" y2="16" stroke="currentColor" strokeWidth="1.5" />
              <line x1="16" y1="16" x2="16" y2="48" stroke="currentColor" strokeWidth="1.5" />
              <line x1="22" y1="22" x2="48" y2="22" stroke="currentColor" strokeWidth="0.7" />
              <line x1="22" y1="22" x2="22" y2="48" stroke="currentColor" strokeWidth="0.7" />
              <path d="M16,16 C14,10 8,6 4,8 C0,10 0,16 4,18 C8,20 12,16 10,12 C8,8 4,8 2,12" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
              <path d="M16,6 C14,2 18,0 20,4 C21,6 18,8 16,6Z" fill="currentColor" opacity="0.45" />
              <path d="M6,16 C2,14 0,18 4,20 C6,21 8,18 6,16Z" fill="currentColor" opacity="0.45" />
              <circle cx="16" cy="16" r="2" fill="currentColor" opacity="0.5" />
            </svg>
          ))}
          {/* map */}
          <div className="map-wrap">
            <iframe
              className="map-frame"
              title="Margo Hairstylist, Snells Beach"
              src="https://maps.google.com/maps?q=121%20Mahurangi%20East%20Road,%20Snells%20Beach&t=&z=15&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
        <div className="map-cta">
          <p className="map-address">121 Mahurangi East Road, Snells Beach 0920</p>
          <a className="btn btn-primary map-btn" href={MAPS_URL} target="_blank" rel="noopener noreferrer">
            <MapPin size={16} /> Open in Google Maps
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-mark">Margo</div>
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

      {/* CART FAB */}
      {cartCount > 0 && !cartOpen && (
        <button className="cart-fab" onClick={() => setCartOpen(true)} aria-label="View cart">
          <ShoppingCart size={16} /> Cart
          <span className="cart-fab-count">{cartCount}</span>
        </button>
      )}

      {/* CART DRAWER */}
      <div className={`cart-overlay ${cartOpen ? 'open' : ''}`} onClick={() => setCartOpen(false)} />
      <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`} aria-hidden={!cartOpen}>
        <div className="cart-head">
          <h3>Your cart</h3>
          <button className="cart-close" onClick={() => setCartOpen(false)} aria-label="Close cart"><X size={22} /></button>
        </div>

        {cartLines.length === 0 ? (
          <div className="cart-items">
            <div className="cart-empty">
              <ShoppingCart size={30} strokeWidth={1.4} />
              <p>Your cart is empty.</p>
              <a href="#shop" className="btn btn-ghost btn-sm" onClick={() => setCartOpen(false)}>Browse the shop</a>
            </div>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartLines.map((l) => (
                <div className="cart-line" key={l.id}>
                  <div className="cart-line-media"><img src={l.product.image} alt={l.product.name} /></div>
                  <div>
                    <div className="cart-line-name">{l.product.name}</div>
                    <div className="cart-line-unit">{money(l.product.price)} each</div>
                    <div className="qty">
                      <button onClick={() => setQty(l.id, -1)} aria-label="Decrease"><Minus size={13} /></button>
                      <span>{l.qty}</span>
                      <button onClick={() => setQty(l.id, +1)} aria-label="Increase"><Plus size={13} /></button>
                    </div>
                  </div>
                  <div className="cart-line-right">
                    <div className="cart-line-price">{money(l.qty * l.product.price)}</div>
                    <button className="cart-remove" onClick={() => removeLine(l.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-foot">
              <div className="cart-total">
                <span className="lbl">Total</span>
                <span className="amt">{money(cartTotal)}</span>
              </div>
              <button className="btn btn-primary checkout-btn" onClick={startCheckout}>
                Checkout <ArrowRight size={14} />
              </button>
              <p className="cart-foot-note">Or collect and pay at your next appointment.</p>
            </div>
          </>
        )}
      </aside>

      {/* CHECKOUT MODAL */}
      <div className={`modal-overlay ${checkout ? 'open' : ''}`} onClick={closeCheckout}>
        <div className="checkout-modal" style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
          {checkout === 'success' ? (
            <div className="checkout-success">
              <div className="tick"><Check size={30} /></div>
              <h3>Thank you!</h3>
              <p>This is a demo order, so nothing has been charged. Margo will confirm your products and let you know when they are ready.</p>
              <button className="btn btn-primary btn-sm" style={{ marginTop: '1.4rem' }} onClick={closeCheckout}>Done</button>
            </div>
          ) : (
            <>
              <button className="cart-close" style={{ position: 'absolute', top: '1.2rem', right: '1.2rem' }} onClick={closeCheckout} aria-label="Close"><X size={20} /></button>
              <h3>Checkout</h3>
              <p className="checkout-sub">Choose how you would like to pay.</p>

              <div className="checkout-summary">
                {cartLines.map((l) => (
                  <div className="row" key={l.id}><span>{l.qty} × {l.product.name}</span><span>{money(l.qty * l.product.price)}</span></div>
                ))}
                <div className="row total"><span>Total</span><span>{money(cartTotal)}</span></div>
              </div>

              <p className="pay-label">Pay with</p>
              <div className="pay-methods">
                <button className="pay-btn pay-paypal" onClick={pay}><b>Pay</b><i>Pal</i></button>
                <button className="pay-btn pay-card" onClick={pay}>Credit or debit card</button>
                <button className="pay-btn pay-apple" onClick={pay}> Apple Pay</button>
                <button className="pay-btn pay-bank" onClick={pay}>Pay by bank transfer</button>
              </div>

              <div className="demo-note">
                <ShieldCheck size={13} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                Demo checkout: these payment buttons are for showcase only and do not take real money yet.
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
