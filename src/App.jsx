import { useEffect, useRef, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Lenis from 'lenis'
import {
  MessageSquare, MapPin, Clock, ArrowRight, Scissors, Phone, Star,
  ShoppingCart, Plus, Minus, X, Check, ShieldCheck, BookOpen,
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
  { name: 'Colour', desc: 'Full colour, root touch-ups, foils and balayage using professional Wella colour, always weighed against the health of your hair.' },
  { name: 'Nanoplastia, Keratin & Straightening', desc: 'Nanoplastia, keratin and straightening treatments that leave frizz behind and make everyday hair far more manageable.' },
  { name: 'Curly Hair', desc: 'Curl-literate cutting and styling that works with your natural pattern instead of fighting it.' },
  { name: 'Treatments & Blow Waves', desc: 'Deep hydration treatments and salon blow waves to finish, using professional, organic and cruelty-free products.' },
]

// Hair education articles. Genuine, helpful content in Margo's education-first
// spirit (she treats every appointment as a chance to teach, not just to cut).
// Swap the images / add articles when Margo sends her own photos.
const JOURNAL = [
  {
    id: 'hair-thins-with-age',
    category: 'Hair science',
    date: 'July 2026',
    title: 'Why your hair gets finer with age, and what actually helps',
    image: '/blog/hair-thinning.jpg',
    thumb: '/blog/hair-thinning-thumb.jpg',
    excerpt: 'Aging hair is often not just "dry hair". The strand itself slowly changes. Here is what is really going on, and how to look after it.',
    body: [
      'If your hair feels finer, flatter or more fragile than it used to, you are not imagining it. Research shows that individual hair fibres can genuinely become smaller in diameter over time, from a mix of oxidative stress, inflammation and years of repeated wear and tear. Aging hair is often not simply "dry hair"; the structure of the strand itself is slowly changing.',
      'A younger, healthier strand tends to have a thick diameter, a smooth cuticle layer, plenty of stretch and good moisture retention. Over the years that can shift: the diameter thins, the cuticle weakens and lifts, elasticity drops so hair breaks more easily, it holds less moisture, and the surface becomes rougher, which creates more friction and more damage.',
      'The reason is simple once you look closely. Hair naturally loses some of its protein, lipids and internal moisture support as we age, and every strand becomes a little more vulnerable to the things we do to it: heat, colour, sun and rough brushing.',
      'The good news is that most of this is manageable. The aim is to protect what you have and support the strand rather than strip it. That means gentler, sulfate-free washing, keeping heat tools in check with a proper heat protectant, and feeding the hair with rich moisture and a little protein to keep it strong and elastic.',
      'This is exactly why Margo leans on professional, organic products and treatments like keratin smoothing. They work with the hair rather than against it, smoothing the cuticle and putting moisture and structure back in. Looking after the scalp matters too, since that is where every new, healthy strand begins.',
      'None of this is about chasing your twenty-year-old hair. It is about understanding how your hair is changing so you can care for the hair you have now, and keep it looking healthy, soft and full of life. If you are noticing changes, mention it at your next appointment and Margo will build a simple plan with you.',
    ],
  },
  {
    id: 'hair-science-basics',
    category: 'Hair science',
    date: 'July 2026',
    title: 'Hair science, simply: how your hair is actually built',
    image: '/blog/hair-science.jpg',
    thumb: '/blog/hair-science-thumb.jpg',
    excerpt: 'Once you understand how a strand of hair is put together, looking after it makes a lot more sense.',
    body: [
      'Margo believes that the more you understand your hair, the better you can care for it, so here is the science made simple. Every strand has two parts: the root, which sits inside your scalp in the follicle, and the shaft, the visible part you style.',
      'The shaft itself is built in three layers. The cuticle is the outer layer, made of overlapping scale-like cells that protect everything inside and give hair its shine. The cortex is the middle layer and makes up 80 to 90 percent of the hair, holding the keratin protein and the melanin that gives your natural colour, and providing strength and elasticity. Right in the centre is the medulla, a soft core that is not even present in every hair type.',
      'Your hair also grows in cycles, and every strand is at a different stage. Anagen is the active growth phase and can last two to six years. Catagen is a short transition of a few weeks. Telogen is the resting phase, where old hair eventually sheds to make room for new growth. Losing some hairs every day is completely normal; it is just part of the cycle.',
      'The difference between damaged and healthy hair comes down to that cuticle. Healthy hair has a smooth, flat cuticle, so it reflects light, feels soft and resists breakage. Damaged hair has a raised, rough cuticle, which leaves it dry, brittle and prone to split ends.',
      'Here is the part that connects to everything Margo does in the studio. Hair is made of keratin protein, held in shape by tiny disulfide bonds. Chemical services like colour, keratin smoothing and perms work by gently breaking and then reforming those bonds. Done with knowledge and good products, that is how we reshape and refresh your hair safely.',
      'So good hair care really is simple: cleanse gently with the right shampoo for your hair, condition regularly, nourish with oils or treatments, keep heat in check, and support it from the inside with a good diet and enough water. Healthy hair is, in the end, just well cared-for hair. Ask Margo anything about yours next time you are in the chair.',
    ],
  },
  {
    id: 'make-colour-last',
    category: 'Colour care',
    date: 'June 2026',
    title: 'Making your colour last between visits',
    image: '/journal/colour.jpg',
    excerpt: 'A few simple habits that keep your colour rich, glossy and true for much longer.',
    body: [
      'Fresh colour looks its best in the first couple of weeks, and with a little care you can hold onto that for far longer. Most of what fades colour early comes down to everyday habits, not the colour itself.',
      'Wash less often, and when you do, use cooler water. Hot water opens the hair cuticle and lets colour rinse away, so a cooler final rinse helps lock it in and adds shine.',
      'Use products made for coloured hair. A good colour-protect mask is one Margo keeps in the studio for exactly this: it feeds coloured hair and helps hold the tone between appointments.',
      'Protect from heat and sun. Always use a heat protectant before straighteners or a dryer, and remember that strong UV lifts colour just like it lifts a curtain, so a hat on long beach days genuinely helps.',
      'Book your maintenance in gently. A toner or gloss between full colours keeps everything looking fresh without over-processing your hair. Ask Margo what rhythm suits your colour when you next come in.',
    ],
  },
  {
    id: 'organic-difference',
    category: 'Products',
    date: 'May 2026',
    title: 'The organic difference, and why the products matter',
    image: '/journal/products.jpg',
    excerpt: "What 'organic' really means for your hair, and why it is worth having on your shelf at home.",
    body: [
      'Margo only puts professional, organic and cruelty-free products on her clients, and it is a deliberate choice rather than a trend. Good products are half the result, and they matter even more once you leave the chair.',
      'Organic, plant-based formulas tend to be gentler on your scalp and kinder to colour. Without harsh sulfates stripping the hair, your natural oils and your colour both last longer, and hair generally feels softer over time.',
      'The range is built around real botanicals: orange flower, lavender, iris root. Each is chosen for a job, whether that is hold, hydration, volume or colour protection, so you are not just buying a nice smell.',
      'Using the same products at home that Margo uses in the studio keeps your results consistent. You can pick any of them up in the shop here, and if you are not sure what suits your hair, just ask at your appointment.',
    ],
  },
  {
    id: 'how-often-wash',
    category: 'Hair care',
    date: 'April 2026',
    title: 'How often should you really wash your hair?',
    image: '/journal/care.jpg',
    excerpt: 'The honest answer is: less than you think. Here is how to find your hair’s natural rhythm.',
    body: [
      'It is one of the questions Margo hears most, and the honest answer is that there is no single number. It depends on your hair type, your scalp and your lifestyle, and part of good hair care is learning to read your own hair.',
      'Washing every day is rarely necessary and often works against you. Over-washing strips the natural oils that keep hair soft and protected, which can leave your scalp producing even more oil to compensate.',
      'As a rough guide, most people do well washing two to three times a week. Finer hair may need it a little more often; curly and coloured hair usually prefer less, since those oils are precious for moisture and shine.',
      'Look after the scalp, not just the lengths. A healthy scalp is where healthy hair starts, so focus your shampoo there and let the conditioner or treatment look after the ends.',
      'Use dry shampoo sparingly to stretch the days between washes, and if you are unsure what your hair actually needs, mention it next time you are in. Margo is always happy to talk you through it.',
    ],
  },
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
  const [article, setArticle] = useState(null) // open journal article
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
    const ids = ['services', 'shop', 'about', 'journal', 'visit']
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

  const lockScroll = menuOpen || cartOpen || !!checkout || !!article
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
          {[['services', 'Services'], ['shop', 'Shop'], ['about', 'About'], ['journal', 'Blog'], ['visit', 'Visit']].map(([id, label]) => (
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
          <li><a href="#journal" onClick={closeMenu}>Blog</a></li>
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
              <div className="lbl">Open</div>
              <div className="val">Mon to Sat</div>
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
              Cuts, styling, colour and more, from the Snells Beach studio. New to Margo? Just
              mention what you are after when you get in touch and she will talk you through it.
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
              <h2>Take the care<br/>home with you.</h2>
            </Reveal>
            <Reveal as="p">
              The professional, organic and cruelty-free products Margo trusts in the studio, from
              names like Angel, Brelil, De Lorenzo, Paul Mitchell and Wella. Add to your cart and
              check out online, or just ask about anything at your next visit.
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
                while she works. She works only with professional, organic and cruelty-free products.
              </p>
              <p>
                Margo treats every appointment as a chance to teach, not just to cut. Forever a
                student of hair herself, she is always learning and happy to share what she knows,
                so you leave understanding your hair a little better each time.
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

      {/* MARGO'S PROMISE */}
      <section className="philosophy">
        <div className="section philosophy-inner">
          <Reveal>
            <Scissors size={22} className="philosophy-icon" />
            <div className="eyebrow">Margo's promise</div>
            <p className="philosophy-statement">
              Great hair is not just what happens in the chair. Your cut and colour are shaped
              to work with your natural base, your texture, how much upkeep you want and the look
              you love. The real difference is what you do at home, and that takes knowledge. So
              Margo is committed to teaching, not just styling: she explains the how and the why,
              and gives you honest advice on the products and tools that genuinely help, so you
              leave with the confidence to keep your hair looking its best between visits.
            </p>
          </Reveal>
        </div>
      </section>

      {/* BLOG / HAIR EDUCATION */}
      <section id="journal" className="journal">
        <div className="section">
          <div className="section-head">
            <Reveal>
              <div className="eyebrow" style={{ marginBottom: '1rem' }}>The Blog</div>
              <h2>Learn a little<br/>about your hair.</h2>
            </Reveal>
            <Reveal as="p">
              A few honest notes to help you understand your hair and keep it looking its
              best between visits.
            </Reveal>
          </div>

          <div className="journal-grid">
            {JOURNAL.map((post) => (
              <Reveal key={post.id} className="journal-card" onClick={() => setArticle(post)} role="button" tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') setArticle(post) }}>
                <div className="journal-media">
                  <img src={post.thumb || post.image} alt={post.title} loading="lazy" />
                  <span className="journal-cat">{post.category}</span>
                </div>
                <div className="journal-body">
                  <span className="journal-date">{post.date}</span>
                  <h3 className="journal-title">{post.title}</h3>
                  <p className="journal-excerpt">{post.excerpt}</p>
                  <span className="journal-read">Read article <ArrowRight size={14} /></span>
                </div>
              </Reveal>
            ))}
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
              Margo works from her Snells Beach studio. Call or text to book a time, or pop in
              during opening hours.
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
                <li><span>Monday - Friday</span><span>9am to 5pm</span></li>
                <li><span>Saturday</span><span>9am to 1pm</span></li>
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

      {/* ARTICLE READER */}
      <div className={`modal-overlay ${article ? 'open' : ''}`} onClick={() => setArticle(null)}>
        <div className="article-modal" onClick={(e) => e.stopPropagation()}>
          {article && (
            <>
              <button className="cart-close article-close" onClick={() => setArticle(null)} aria-label="Close"><X size={22} /></button>
              <div className="article-head">
                <span className="article-meta">{article.category} · {article.date}</span>
                <h2>{article.title}</h2>
                <p className="article-hook">{article.excerpt}</p>
              </div>
              <div className="article-hero">
                <img src={article.image} alt={article.title} />
              </div>
              <div className="article-content">
                {article.body.map((p, i) => <p key={i}>{p}</p>)}
                <div className="article-foot">
                  <span>Questions about your hair? Margo is happy to talk you through it.</span>
                  <a href={PHONE_TEL} className="btn btn-primary btn-sm"><Phone size={14} /> Call to book</a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
