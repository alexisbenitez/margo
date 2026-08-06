import { useState, useEffect } from 'react'
import { Lock, ArrowRight } from 'lucide-react'
import FooterOwl from './components/FooterOwl'
import { ADMIN_PASSWORD, isAdmin, signInAdmin } from './shared'

// Demo-level gate. The password lives client-side, so this keeps the admin page
// out of casual reach (no link points to it, and you need the URL + password) but
// it is not bank-grade security. "Keep me signed in" persists the session so
// Margo and Alexis only type the password once per device.
export default function Login() {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [remember, setRemember] = useState(true)

  useEffect(() => {
    document.title = 'Sign in · Margo'
    if (isAdmin()) window.location.href = '/admin'
  }, [])

  const submit = (e) => {
    e.preventDefault()
    if (value === ADMIN_PASSWORD) {
      signInAdmin(remember)
      window.location.href = '/admin'
    } else {
      setError('Incorrect password. Please try again.')
      setValue('')
    }
  }

  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={submit}>
        <div className="login-eyebrow">Salon Admin</div>
        <h1>Welcome back</h1>
        <p style={{ color: 'var(--cream-soft)', opacity: 0.7, fontSize: '0.85rem', margin: '0.2rem 0 1.6rem' }}>
          Sign in to manage your shop products.
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

        <label className="login-remember">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          Keep me signed in on this device
        </label>

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
