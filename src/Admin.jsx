import { useEffect, useState, useRef } from 'react'
import { Plus, Pencil, Trash2, LogOut, RotateCcw, Check, X, Upload } from 'lucide-react'
import { loadProducts, saveProducts, resetProducts, slugId, money, loadTags, saveTags } from './products'
import FooterOwl from './components/FooterOwl'
import { isAdmin, signOutAdmin } from './shared'

const EMPTY = { id: '', name: '', tags: [], note: '', price: '', image: '', inStock: true }

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [products, setProducts] = useState([])
  const [tagList, setTagList] = useState([])
  const [newTag, setNewTag] = useState('')
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [toast, setToast] = useState('')
  const fileRef = useRef(null)
  const formRef = useRef(null)
  const toastTimer = useRef(null)

  useEffect(() => {
    document.title = 'Admin · Margo'
    if (!isAdmin()) {
      window.location.href = '/login'
      return
    }
    setAuthed(true)
    setProducts(loadProducts())
    setTagList(loadTags())
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
  const persistTags = (list) => {
    setTagList(list)
    saveTags(list)
  }

  // ---- Tag management ----
  const toggleFormTag = (t) => setForm((f) => {
    const has = (f.tags || []).includes(t)
    return { ...f, tags: has ? f.tags.filter((x) => x !== t) : [...(f.tags || []), t] }
  })
  const createTag = () => {
    const t = newTag.trim()
    if (!t) return
    if (!tagList.includes(t)) persistTags([...tagList, t])
    setForm((f) => ({ ...f, tags: (f.tags || []).includes(t) ? f.tags : [...(f.tags || []), t] }))
    setNewTag('')
  }
  const deleteTag = (t) => {
    if (!window.confirm(`Delete the tag "${t}"? It will be removed from all products.`)) return
    persistTags(tagList.filter((x) => x !== t))
    persist(products.map((p) => ({ ...p, tags: (p.tags || []).filter((x) => x !== t) })))
    setForm((f) => ({ ...f, tags: (f.tags || []).filter((x) => x !== t) }))
    flash('Tag deleted.')
  }
  const renameTag = (t) => {
    const nn = window.prompt('Rename tag', t)
    if (!nn) return
    const nt = nn.trim()
    if (!nt || nt === t) return
    persistTags(tagList.map((x) => (x === t ? nt : x)))
    persist(products.map((p) => ({ ...p, tags: (p.tags || []).map((x) => (x === t ? nt : x)) })))
    setForm((f) => ({ ...f, tags: (f.tags || []).map((x) => (x === t ? nt : x)) }))
    flash('Tag renamed.')
  }

  const startAdd = () => {
    setEditingId(null)
    setForm(EMPTY)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const startEdit = (p) => {
    setEditingId(p.id)
    setForm({ ...p, price: String(p.price), tags: p.tags || [] })
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
      tags: form.tags || [],
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
    signOutAdmin()
    window.location.href = '/'
  }

  if (!authed) return null

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <a href="/" className="admin-brand">
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
                <label>Price (NZD)</label>
                <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="34" />
              </div>
              <div className="field span-2">
                <label>Tags / lines (these drive the shop filters)</label>
                <div className="tag-picker">
                  {tagList.map((t) => (
                    <button type="button" key={t} className={`chip ${(form.tags || []).includes(t) ? 'active' : ''}`} onClick={() => toggleFormTag(t)}>{t}</button>
                  ))}
                  {tagList.length === 0 && <span className="tag-hint">No tags yet. Create your first one below.</span>}
                </div>
                <div className="tag-new">
                  <input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); createTag() } }}
                    placeholder="New tag, e.g. Shampoo, Colour, Curly"
                  />
                  <button type="button" className="btn btn-ghost btn-sm" onClick={createTag}><Plus size={13} /> Add tag</button>
                </div>
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

        {/* MANAGE TAGS */}
        <div className="admin-card">
          <p className="admin-section-title">Your tags ({tagList.length})</p>
          <p className="admin-sub" style={{ marginBottom: '1rem' }}>Create tags here and tick them on a product above. Your tags become the filters customers use in the shop.</p>
          <div className="tag-manage">
            {tagList.length === 0 && <span className="tag-hint">No tags yet.</span>}
            {tagList.map((t) => (
              <span className="tag-manage-item" key={t}>
                {t}
                <button title="Rename" onClick={() => renameTag(t)}><Pencil size={12} /></button>
                <button title="Delete" onClick={() => deleteTag(t)}><X size={13} /></button>
              </span>
            ))}
          </div>
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
                  {(p.tags || []).join(', ')}{(p.tags && p.tags.length) ? ' · ' : ''}
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
