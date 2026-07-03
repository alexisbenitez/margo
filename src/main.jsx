import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './Login.jsx'
import Admin from './Admin.jsx'

// Tiny path router — keeps deps minimal. Netlify SPA redirect (/* -> index.html)
// and Vite's dev fallback both serve index.html for these paths, so /login and
// /admin resolve on direct navigation. There are no links to /login anywhere on
// the public site: it is reached only by typing the URL.
function Router() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (path === '/login') return <Login />
  if (path === '/admin') return <Admin />
  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
