import { useEffect, useState, useRef } from 'react'
import { Plus, Pencil, Trash2, LogOut, RotateCcw, Check, X, Upload } from 'lucide-react'
import { loadProducts, saveProducts, resetProducts, slugId, money } from './products'
import FooterOwl from './components/FooterOwl'

const EMPTY = { id: '', name: '', brand: '', note: '', price: '', image: '', inStock: true }

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [toast, setToast] = useState('')
  const fileRef = useRef(null)
  const formRef = useRef(null)
  const toastTimer = useRef(null)

  useEffect(() => {
    document.title = 'Admin · Margo'
    if (sessionStorage.getItem('margo_admin') !== '1') {
      window.location.href = '/login'
      return
    }
    setAuthed(true)
    setProducts(loadProducts())
  }, [])

  const flash = (msg) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2200)
  }

  const persist = (list) => {
    setProducts(list)
    saveProducts(list)
  }

  const startAdd = () => {
    setEditingId(null)
    setForm(EMPTY)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const startEdit = (p) => {
    setEditingId(p.id)
    setForm({ ...p, price: String(p.price) })
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const cancelEdit = () => { setEditingId(null); setForm(EMPTY) }

  const onFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm((f) => ({ ...f, image: reader.result }))
    reader.readAsDataURL(file)
  }

  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return flash('Please add a product name.')
    const price = parseFloat(form.price)
    if (isNaN(price) || price < 0) return flash('Please add a valid price.')

    const clean = {
      id: editingId || slugId(form.name),
      name: form.name.trim(),
      brand: form.brand.trim(),
      note: form.note.trim(),
      price,
      image: form.image || '/products/angel-gift-sets-shelf.jpg',
      inStock: !!form.inStock,
    }

    if (editingId) {
      persist(products.map((p) => (p.id === editingId ? clean : p)))
      flash('Product updated.')
    } else {
      persist([clean, ...products])
      flash('Product added.')
    }
    cancelEdit()
  }

  const remove = (p) => {
    if (!window.confirm(`Remove "${p.name}" from the shop?`)) return
    persist(products.filter((x) => x.id !== p.id))
    if (editingId === p.id) cancelEdit()
    flash('Product removed.')
  }

  const toggleStock = (p) => {
    persist(products.map((x) => (x.id === p.id ? { ...x, inStock: !x.inStock } : x)))
  }

  const restore = () => {
    if (!window.confirm('Restore the original product list? Any changes you made will be replaced.')) return
    resetProducts()
    setProducts(loadProducts())
    cancelEdit()
    flash('Original products restored.')
  }

  const logout = () => {
    sessionStorage.removeItem('margo_admin')
    window.location.href = '/'
  }

  if (!authed) return null

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <a href="/" className="admin-brand">
          <img src="/margo-logo.png" alt="" />
          Margo <small>Admin</small>
        </a>
        <div className="admin-actions">
          <button className="btn btn-ghost btn-sm" onClick={restore}><RotateCcw size={13} /> Restore stock</button>
          <button className="btn btn-ghost btn-sm" onClick={logout}><LogOut size={13} /> Sign out</button>
        </div>
      </div>

      <div className="admin-main">
        <h1 className="admin-h">Your products</h1>
        <p className="admin-sub">Add, edit and remove the products shown in your online shop. Changes save automatically.</p>

        {/* FORM */}
        <div className="admin-card" ref={formRef}>
          <p className="admin-section-title">{editingId ? 'Edit product' : 'Add a new product'}</p>
          <form onSubmit={submit}>
            <div className="admin-form-grid">
              <div className="field span-2">
                <label>Product name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Iris Restorative Shampoo" />
              </div>
              <div className="field">
                <label>Brand</label>
                <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="Wella, Brelil, De Lorenzo..." />
              </div>
              <div className="field">
                <label>Price (NZD)</label>
                <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="34" />
              </div>
              <div className="field span-2">
                <label>Short description</label>
                <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="A line or two about the product." />
              </div>
              <div className="field span-2">
                <label>Photo</label>
                <div className="image-picker">
                  <div className="preview">
                    {form.image ? <img src={form.image} alt="" /> : null}
                  </div>
                  <div>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()}>
                      <Upload size={13} /> {form.image ? 'Change photo' : 'Upload photo'}
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
                    <p style={{ fontSize: '0.72rem', opacity: 0.55, marginTop: '0.5rem' }}>JPG or PNG from your phone or computer.</p>
                  </div>
                </div>
              </div>
              <div className="field span-2">
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ width: 'auto' }} checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} />
                  In stock (available to buy)
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.7rem', marginTop: '1.2rem', flexWrap: 'wrap' }}>
              <button type="submit" className="btn btn-primary btn-sm">
                {editingId ? <><Check size={14} /> Save changes</> : <><Plus size={14} /> Add product</>}
              </button>
              {editingId && (
                <button type="button" className="btn btn-ghost btn-sm" onClick={cancelEdit}><X size={14} /> Cancel</button>
              )}
            </div>
          </form>
        </div>

        {/* LIST */}
        <div className="admin-card">
          <p className="admin-section-title">Live in your shop ({products.length})</p>
          {products.length === 0 && <div className="admin-empty">No products yet. Add your first one above.</div>}
          {products.map((p) => (
            <div className="admin-prow" key={p.id}>
              <div className="admin-prow-media"><img src={p.image} alt={p.name} /></div>
              <div>
                <div className="admin-prow-name">{p.name}</div>
                <div className="admin-prow-meta">
                  {p.brand}{p.brand ? ' · ' : ''}
                  <button
                    onClick={() => toggleStock(p)}
                    style={{ color: p.inStock ? 'var(--terracotta)' : 'var(--cream-soft)', textDecoration: 'underline', fontSize: '0.76rem' }}
                  >
                    {p.inStock ? 'In stock' : 'Sold out'}
                  </button>
                </div>
              </div>
              <div className="admin-prow-price">{money(p.price)}</div>
              <div className="admin-prow-actions">
                <button className="icon-btn" title="Edit" onClick={() => startEdit(p)}><Pencil size={15} /></button>
                <button className="icon-btn danger" title="Remove" onClick={() => remove(p)}><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="page-qv" style={{ paddingTop: '2.5rem' }}>
          <a href="https://quantumvector.org" target="_blank" rel="noopener noreferrer">
            <FooterOwl size={18} /> Powered by Quantum Vector
          </a>
        </div>
      </div>

      <div className={`admin-toast ${toast ? 'show' : ''}`}>{toast}</div>
    </div>
  )
}
