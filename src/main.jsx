import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Products from './Products.jsx'
import Blog from './Blog.jsx'
import Login from './Login.jsx'
import Admin from './Admin.jsx'

// Tiny path router — keeps deps minimal. Netlify SPA redirect (/* -> index.html)
// and Vite's dev fallback both serve index.html for these paths, so every route
// resolves on direct navigation. /login has no link on the site: URL only.
function Router() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (path === '/products') return <Products />
  if (path === '/shop') { window.location.replace('/products'); return null }
  if (path === '/blog') return <Blog />
  if (path === '/login') return <Login />
  if (path === '/admin') return <Admin />
  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
