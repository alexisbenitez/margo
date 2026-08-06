import { useEffect, useState } from 'react'
import { ArrowRight, X, Phone } from 'lucide-react'
import { PHONE_TEL, Reveal, useLenis, Nav, SiteFooter } from './shared'

// Hair education articles. Genuine, helpful content in Margo's education-first
// spirit (she treats every appointment as a chance to teach, not just to cut).
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
      'The ranges she uses are built around real botanicals, each chosen for a job, whether that is hold, hydration, volume or colour protection, so you are not just buying a nice smell.',
      'Using the same products at home that Margo uses in the studio keeps your results consistent. She keeps them on the shelf in the studio, and if you are not sure what suits your hair, just ask at your appointment.',
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
      'And if you are unsure what your hair actually needs, mention it next time you are in. Margo is always happy to talk you through it.',
    ],
  },
]

export default function Blog() {
  const [article, setArticle] = useState(null)
  useLenis()

  useEffect(() => { document.title = 'Blog · Margo Hairstylist' }, [])
  useEffect(() => {
    document.body.style.overflow = article ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [article])

  return (
    <>
      <Nav page="blog" />

      {/* MARGO'S PROMISE */}
      <section className="philosophy" style={{ borderTop: 0 }}>
        <div className="section philosophy-inner">
          <Reveal>
            <div className="eyebrow">The Blog</div>
            <p className="philosophy-statement">
              Margo is committed to teaching, not just styling: she explains the how and the why,
              and shares honest advice so you leave with the confidence to keep your hair looking
              its best between visits. A few notes to help you understand and care for your hair.
            </p>
          </Reveal>
        </div>
      </section>

      {/* BLOG GRID */}
      <section id="journal" className="journal">
        <div className="section" style={{ paddingTop: 0 }}>
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

      <SiteFooter />

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
