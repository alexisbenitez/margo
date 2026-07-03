import { useState, useEffect } from 'react'
import { Lock, ArrowRight } from 'lucide-react'
import FooterOwl from './components/FooterOwl'

// Demo-level gate. The password lives client-side, so this keeps the admin page
// out of casual reach (no link points to it, and you need the URL + password) but
// it is not bank-grade security. For a public launch, move product writes behind
// Supabase Auth. Margo can change this password here.
const PASSWORD = 'margo2026'

export default function Login() {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Sign in · Margo'
    if (sessionStorage.getItem('margo_admin') === '1') {
      window.location.href = '/admin'
    }
  }, [])

  const submit = (e) => {
    e.preventDefault()
    if (value === PASSWORD) {
      sessionStorage.setItem('margo_admin', '1')
      window.location.href = '/admin'
    } else {
      setError('Incorrect password. Please try again.')
      setValue('')
    }
  }

  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={submit}>
        <img src="/margo-logo.png" alt="Margo" className="mark" />
        <div className="login-eyebrow">Salon Admin</div>
        <h1>Welcome back, Margo</h1>
        <p style={{ color: 'var(--cream-soft)', opacity: 0.7, fontSize: '0.85rem', margin: '0.2rem 0 1.6rem' }}>
          Sign in to manage your products.
        </p>

        <div className="field">
          <label htmlFor="pw">Password</label>
          <input
            id="pw"
            type="password"
            autoFocus
            autoComplete="current-password"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError('') }}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="btn btn-primary login-btn">
          <Lock size={14} /> Sign in <ArrowRight size={14} />
        </button>

        <div className="login-error">{error}</div>

        <a href="/" className="login-back">← Back to website</a>
      </form>

      <div className="page-qv">
        <a href="https://quantumvector.org" target="_blank" rel="noopener noreferrer">
          <FooterOwl size={18} /> Powered by Quantum Vector
        </a>
      </div>
    </div>
  )
}
