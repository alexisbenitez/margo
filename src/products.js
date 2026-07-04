// Margo — product catalogue store.
//
// Persistence: localStorage (key below). This is a self-contained demo store so
// Margo can add / edit / remove products from the hidden /admin panel and see the
// storefront update immediately, with no backend to manage. To make her edits
// visible to every visitor (shared across devices), swap loadProducts/saveProducts
// for a Supabase table read/write — the rest of the app stays identical.

const KEY = 'margo_products_v2'
const EVENT = 'margo-products-changed'

// Seed stock (Margo will replace photos and products). She carries several
// professional, organic and cruelty-free brands (Angel, Brelil, De Lorenzo,
// Paul Mitchell, Wella). Prices in NZD are starting points, editable in admin.
export const SEED = [
  {
    id: 'orange-flower-finishing-spray',
    name: 'Orange Flower Finishing Spray',
    brand: '',
    note: 'Ultra-firm hold finishing spray, 350ml. Organic orange flower for a strong, brushable hold.',
    price: 34,
    image: '/products/angel-orange-flower-finishing-spray.jpg',
    inStock: true,
  },
  {
    id: 'iris-styling-hairspray',
    name: 'Iris Styling Hairspray',
    brand: '',
    note: 'Organic iris root styling spray. Flexible hold with shine, no crunch.',
    price: 32,
    image: '/products/angel-iris-styling-hairspray.jpg',
    inStock: true,
  },
  {
    id: 'flower-conditioning-mousse',
    name: 'Flower Conditioning Mousse',
    brand: '',
    note: 'Protective conditioning mousse with bitter orange flower. Body and softness for all hair types.',
    price: 33,
    image: '/products/angel-flower-conditioning-mousse.jpg',
    inStock: true,
  },
  {
    id: 'lavender-full-shampoo',
    name: 'Lavender Full Energetic Shampoo',
    brand: '',
    note: 'For fine and limp hair. Lavender, grapefruit and rosemary leaf for volume and strength. Salon 1L.',
    price: 58,
    image: '/products/angel-lavender-full-shampoo.jpg',
    inStock: true,
  },
  {
    id: 'iris-restorative-shampoo',
    name: 'Iris Restorative Shampoo',
    brand: '',
    note: 'For all hair types. Iris florentina root to reconstruct and hydrate. Salon 1L.',
    price: 58,
    image: '/products/angel-iris-restorative-shampoo.jpg',
    inStock: true,
  },
  {
    id: 'orange-flower-colour-mask',
    name: 'Orange Flower Colour Protect Hair Mask',
    brand: '',
    note: 'For coloured hair. Rich orange flower mask that holds colour and restores softness.',
    price: 42,
    image: '/products/angel-orange-flower-colour-mask.jpg',
    inStock: true,
  },
  {
    id: 'angel-gift-set',
    name: 'Gift Set',
    brand: '',
    note: 'Boxed gift set of salon favourites. A lovely present for someone who loves their hair.',
    price: 75,
    image: '/products/angel-gift-sets-shelf.jpg',
    inStock: true,
  },
]

export function loadProducts() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return SEED
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return SEED
    return parsed
  } catch {
    return SEED
  }
}

export function saveProducts(list) {
  localStorage.setItem(KEY, JSON.stringify(list))
  window.dispatchEvent(new Event(EVENT))
}

export function resetProducts() {
  localStorage.removeItem(KEY)
  window.dispatchEvent(new Event(EVENT))
}

export function onProductsChanged(cb) {
  window.addEventListener(EVENT, cb)
  window.addEventListener('storage', cb) // sync across tabs
  return () => {
    window.removeEventListener(EVENT, cb)
    window.removeEventListener('storage', cb)
  }
}

export function slugId(name) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'product'
  ) + '-' + Math.random().toString(36).slice(2, 6)
}

export const money = (n) => '$' + Number(n || 0).toFixed(Number(n) % 1 === 0 ? 0 : 2)
