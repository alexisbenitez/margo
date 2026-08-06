import { useEffect, useState } from 'react'
import { MessageSquare, Phone } from 'lucide-react'
import {
  Reveal, useLenis, Nav, SiteFooter,
  BRANDS, PHONE_DISPLAY, PHONE_TEL, SMS_PRODUCTS, smsTo,
} from './shared'

// Margo shows what she stocks; she does not sell or ship online. She said it
// plainly on 2026-08-05: "solo quiero mostrar los productos que tengo a la venta
// sin individualizar mucho cada articulo". So: no prices, no cart, no checkout.
// Every shelf photo here is one she took herself and sent on 2026-07-09.
const SHELVES = [
  {
    brand: 'Wella',
    blurb:
      'The professional line Margo reaches for most, with a system for each kind of hair: repair for hair that has been through a lot, smooth for frizz, colour for keeping your tone true, and curls for definition without the crunch.',
    shots: [
      { src: '/products/shelf-wella-ultimate-repair.jpg', label: 'Ultimate Repair' },
      { src: '/products/shelf-wella-ultimate-smooth.jpg', label: 'Ultimate Smooth' },
      { src: '/products/shelf-wella-ultimate-color.jpg', label: 'Ultimate Colour' },
      { src: '/products/shelf-wella-nutri-curls.jpg', label: 'Nutri Curls' },
    ],
  },
  {
    brand: 'Paul Mitchell',
    blurb:
      'Everyday shampoos, conditioners and styling, plus the gift sets that come in around Christmas and Mother’s Day.',
    shots: [{ src: '/products/shelf-paul-mitchell.jpg', label: 'On the shelf' }],
  },
  {
    brand: 'De Lorenzo',
    blurb:
      'Australian-made and plant-based, for dryness and for fine hair that needs body without weight.',
    shots: [{ src: '/products/shelf-de-lorenzo.jpg', label: 'On the shelf' }],
  },
]

export default function Products() {
  const [lightbox, setLightbox] = useState(null)
  useLenis()

  useEffect(() => { document.title = 'Products · Margo Hairstylist' }, [])
  useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox])
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <Nav page="products" />

      <section id="products" className="products">
        <div className="section">
          <div className="section-head">
            <Reveal>
              <div className="eyebrow" style={{ marginBottom: '1rem' }}>In the studio</div>
              <h2>Take the care<br/>home with you.</h2>
            </Reveal>
            <Reveal as="p">
              Margo keeps a small, carefully chosen shelf: {BRANDS.slice(0, -1).join(', ')} and{' '}
              {BRANDS[BRANDS.length - 1]}. She will tell you honestly which one suits your hair,
              and you can pick it up at your appointment. Text her if you want to know whether
              something is in stock.
            </Reveal>
          </div>

          <Reveal className="brand-row">
            {BRANDS.map((b) => <span key={b} className="brand-chip">{b}</span>)}
          </Reveal>

          {SHELVES.map((group) => (
            <div className="shelf-group" key={group.brand}>
              <Reveal>
                <h3 className="shelf-brand">{group.brand}</h3>
                <p className="shelf-blurb">{group.blurb}</p>
              </Reveal>
              <div className={`shelf-grid ${group.shots.length === 1 ? 'single' : ''}`}>
                {group.shots.map((s) => (
                  <Reveal key={s.src} className="shelf-card">
                    <button
                      type="button"
                      className="shelf-media"
                      onClick={() => setLightbox({ ...s, brand: group.brand })}
                      aria-label={`View ${group.brand} ${s.label} larger`}
                    >
                      <img src={s.src} alt={`${group.brand} ${s.label} on the shelf in Margo's studio`} loading="lazy" />
                    </button>
                    <div className="shelf-label">{s.label}</div>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}

          <Reveal className="products-cta">
            <h3>Not sure which one is for you?</h3>
            <p>
              Text Margo and ask. The message is already written, you only have to press send.
              She answers between clients.
            </p>
            <div className="products-cta-actions">
              <a href={SMS_PRODUCTS} className="btn btn-primary">
                <MessageSquare size={15} /> Text Margo
              </a>
              <a href={PHONE_TEL} className="btn btn-ghost">
                <Phone size={15} /> Call {PHONE_DISPLAY}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />

      {lightbox && (
        <div className="shelf-lightbox" onClick={() => setLightbox(null)} role="dialog" aria-modal="true">
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.src} alt={`${lightbox.brand} ${lightbox.label}`} />
            <figcaption>
              <span>{lightbox.brand} · {lightbox.label}</span>
              <a href={smsTo(`Hi Margo, do you have the ${lightbox.brand} ${lightbox.label} in stock? `)} className="btn btn-primary btn-sm">
                <MessageSquare size={13} /> Ask about this
              </a>
            </figcaption>
          </figure>
          <button className="shelf-lightbox-close" onClick={() => setLightbox(null)} aria-label="Close">Close</button>
        </div>
      )}
    </>
  )
}
