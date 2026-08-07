import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, Scissors, Phone, Star, MessageSquare } from 'lucide-react'
import LoadingScreen from './components/LoadingScreen'
import {
  PHONE_DISPLAY, PHONE_TEL, SMS_URL, ADDRESS, MAPS_URL,
  Reveal, useReveal, useLenis, Nav, SiteFooter,
} from './shared'

const SERVICES = [
  { name: 'Cuts & Styling', desc: 'Women, men and kids. A cut shaped to suit you and to sit well as it grows out, finished with a proper blow wave.' },
  { name: 'Colour', desc: 'Full colour, root touch-ups, foils and balayage using professional Wella colour, always weighed against the health of your hair.' },
  { name: 'Smoothing & Straightening', desc: 'Permanent hair straightening, nanoplastia, keratin and smooth filler. Different ways to leave the frizz behind, chosen for what your hair can actually take.' },
  { name: 'Curly Hair', desc: 'Cutting and styling that works with your natural curl pattern instead of fighting it.' },
  { name: 'Treatments & Blow Waves', desc: 'Deep hydration treatments and salon blow waves to finish, using the professional products Margo trusts.' },
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

export default function App() {
  const [loading, setLoading] = useState(true)
  const reviewsSectionRef = useReveal()
  useLenis()

  return (
    <>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}

      <Nav page="home" />

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
              <em>without the rush.</em>
            </h1>
            <p className="hero-sub">
              Cuts, colour and curls by Margo, a qualified hairstylist with a home studio in
              Snells Beach. Plus the professional products she uses every day, on the shelf for
              you to take home.
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
              No rush, no upsell. Just one stylist who listens, has a good eye,
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
              <p>Curly hair, smoothing and straightening, colour and men's cuts, all done fast and accurately, with a real eye for what works.</p>
            </Reveal>
            <Reveal className="about-card">
              <span className="num">· 03</span>
              <h3>Warm and local</h3>
              <p>A relaxed home studio in Snells Beach with honest, reasonable pricing and the good products she believes in.</p>
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

      {/* ABOUT MARGO */}
      <section id="about" className="practitioner">
        <div className="section">
          <div className="practitioner-grid">
            <Reveal className="practitioner-text">
              <div className="eyebrow" style={{ marginBottom: '1rem' }}>The Stylist</div>
              <h2>Meet<br/>Margo.</h2>
              <p>
                Margo studied and worked at Servilles, and worked at Rodney Wayne, building a
                loyal following in Auckland before opening her own home studio in Snells Beach.
                Clients still travel to see her, which tells you most of what you need to know.
              </p>
              <p>
                She is known for reading hair well: curls, colour, smoothing and straightening
                and classic men's cuts, all done with care for the condition of your hair. She
                works with products she trusts.
              </p>
              <p>
                Forever a student of hair herself, she is always learning and happy to share what
                she knows, so you leave understanding your hair a little better each time.
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
              you love. The real difference is what you do at home, so Margo explains the how and
              the why as she goes, and gives you honest advice on the products and tools that
              genuinely help, so you leave with the confidence to keep your hair looking its best
              between visits.
            </p>
          </Reveal>
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

      {/* CONTACT (map left, details + CTA right) */}
      <section id="contact" className="contact-section" aria-label="Contact and location">
        <div className="section">
          <div className="section-head">
            <Reveal>
              <div className="eyebrow" style={{ marginBottom: '1rem' }}>Contact</div>
              <h2>Come and<br/>see Margo.</h2>
            </Reveal>
            <Reveal as="p">
              Margo works from her Snells Beach studio. Call or text to book a time, or pop in
              during opening hours.
            </Reveal>
          </div>

          <div className="contact-layout">
            {/* LEFT: map */}
            <Reveal className="contact-map">
              <div className="map-ornament">
                <div className="map-bline map-bline-1" />
                <div className="map-bline map-bline-2" />
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
            </Reveal>

            {/* RIGHT: details + CTA */}
            <Reveal className="contact-info">
              <div className="contact-panel">
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
                <div className="contact-hours">
                  <span className="contact-hours-title"><Clock size={15} /> Hours</span>
                  <ul className="hours-list">
                    <li><span>Monday - Friday</span><span>9am to 5pm</span></li>
                    <li><span>Saturday</span><span>9am to 1pm</span></li>
                    <li><span>Sunday</span><span>Closed</span></li>
                  </ul>
                  {/* The public holidays Margo closes for, given by her 2026-08-07. */}
                  <p className="hours-note">
                    Closed on Christmas, Good Friday, Labour Day and 21 November.
                  </p>
                </div>
                <div className="contact-cta">
                  <a href={PHONE_TEL} className="btn btn-primary"><Phone size={14}/> Call to book</a>
                  <a href={SMS_URL} className="btn btn-ghost"><MessageSquare size={14}/> Text</a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
