import { useEffect, useState } from 'react'

/**
 * Te Whare Mirimiri loading screen.
 * The favicon koru draws itself in alongside a progress bar, then fades out.
 */
export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
    const DURATION = isMobile ? 1400 : 2000
    const INTERVAL = 20
    const STEPS = DURATION / INTERVAL
    const FADE_DELAY = 380
    let current = 0
    const timer = setInterval(() => {
      current++
      const eased = Math.round(100 * (1 - Math.pow(1 - current / STEPS, 3)))
      const clamped = Math.min(eased, 100)
      setProgress(clamped)
      if (current >= STEPS) {
        clearInterval(timer)
        setProgress(100)
        setTimeout(() => {
          setHidden(true)
          onDone?.()
        }, FADE_DELAY)
      }
    }, INTERVAL)
    return () => clearInterval(timer)
  }, [onDone])

  return (
    <div
      aria-hidden={hidden}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.1rem',
        opacity: hidden ? 0 : 1,
        visibility: hidden ? 'hidden' : 'visible',
        transition: 'opacity 0.6s ease, visibility 0.6s ease',
        pointerEvents: hidden ? 'none' : 'all',
      }}
    >
      <img src="/margo-logo.png" alt="Margo" className="load-logo" />

      <div
        style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: '1.4rem',
          fontWeight: 400,
          letterSpacing: '0.02em',
          color: 'var(--cream)',
        }}
      >
        Margo
      </div>

      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.65rem',
          fontWeight: 500,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'var(--terracotta)',
          marginTop: '-0.4rem',
        }}
      >
        Hairstylist · Snells Beach
      </div>

      {/* Scissors travelling along the strand, snipping as they go */}
      <div className="load-strand">
        <div className="load-strand-base" />
        <div className="load-strand-cut" style={{ width: progress + '%' }} />
        <div className="load-scissors" style={{ left: progress + '%' }}>
          <svg width="30" height="26" viewBox="0 0 30 26" fill="none"
            stroke="var(--cream)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            {/* top blade + handle + loop */}
            <g>
              <animateTransform attributeName="transform" type="rotate"
                values="-13 11 13; -3 11 13; -13 11 13" dur="0.45s" repeatCount="indefinite" />
              <path d="M11 13 L28 7" />
              <path d="M11 13 L5 8.5" />
              <circle cx="3.4" cy="7.6" r="2.5" />
            </g>
            {/* bottom blade + handle + loop */}
            <g>
              <animateTransform attributeName="transform" type="rotate"
                values="13 11 13; 3 11 13; 13 11 13" dur="0.45s" repeatCount="indefinite" />
              <path d="M11 13 L28 19" />
              <path d="M11 13 L5 17.5" />
              <circle cx="3.4" cy="18.4" r="2.5" />
            </g>
            <circle cx="11" cy="13" r="1" fill="var(--cream)" stroke="none" />
          </svg>
          <span className="fleck fleck-1" />
          <span className="fleck fleck-2" />
        </div>
      </div>

      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.72rem',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '0.12em',
          color: 'rgba(244, 233, 241, 0.4)',
          marginTop: '0.2rem',
        }}
      >
        {progress}%
      </div>
    </div>
  )
}
