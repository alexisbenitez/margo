import { useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue, animate } from 'framer-motion';

/**
 * FooterOwl — scripted choreography for the QV footer.
 *
 * Sequence (loops forever):
 *   1s  → double blink
 *   0.2s → eyes drift right (toward "Quantum Vector" text)
 *   1.2s → eyes glide back to centre
 *   1s  → single blink
 *   1.5s → single blink
 *   3s  → repeat
 */
export default function FooterOwl({ size = 40 }) {
  const controls = useAnimation();
  const eyeX     = useMotionValue(0);
  const eyeY     = useMotionValue(0);
  const alive    = useRef(true);

  useEffect(() => {
    alive.current = true;

    const wait   = (ms) => new Promise(r => setTimeout(r, ms));
    const blink  = () => controls.start({
      scaleY:     [1, 0, 1],
      transition: { duration: 0.15, ease: 'easeInOut' },
    });
    const lookRight = () => Promise.all([
      animate(eyeX, 11, { duration: 0.18, ease: 'easeOut' }),
      animate(eyeY, 2,  { duration: 0.18, ease: 'easeOut' }),
    ]);
    const lookCentre = () => Promise.all([
      animate(eyeX, 0, { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }),
      animate(eyeY, 0, { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }),
    ]);

    const loop = async () => {
      while (alive.current) {
        // 1 — double blink
        await wait(1000);
        if (!alive.current) break;
        await blink();
        await wait(130);
        await blink();

        // 2 — look right at "Quantum Vector"
        await wait(200);
        if (!alive.current) break;
        await lookRight();

        // 3 — drift back to centre
        await wait(1200);
        if (!alive.current) break;
        await lookCentre();

        // 4 — single blink
        await wait(1000);
        if (!alive.current) break;
        await blink();

        // 5 — single blink
        await wait(1500);
        if (!alive.current) break;
        await blink();

        // 6 — pause then repeat
        await wait(1000);
      }
    };

    loop();
    return () => { alive.current = false; controls.stop(); };
  }, [controls, eyeX, eyeY]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 0 8px rgba(147,51,234,0.4))', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="footerOwlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#41d1ff" />
          <stop offset="50%"  stopColor="#9333ea" />
          <stop offset="100%" stopColor="#bd34fe" />
        </linearGradient>
      </defs>

      {/* Body */}
      <path
        d="M 10 90 C 10 50, 15 20, 25 15 L 45 30 L 55 30 L 75 15 C 85 20, 90 50, 90 90 Z"
        fill="url(#footerOwlGrad)"
      />

      {/* Whites */}
      <motion.circle cx="34" cy="48" r="24" fill="#f1f5f9"
        animate={controls} style={{ originY: '24px' }} />
      <motion.circle cx="66" cy="48" r="24" fill="#f1f5f9"
        animate={controls} style={{ originY: '24px' }} />

      {/* Pupils */}
      <motion.circle cx="34" cy="48" r="7" fill="#020617"
        animate={controls}
        style={{ x: eyeX, y: eyeY, originY: '24px' }} />
      <motion.circle cx="66" cy="48" r="7" fill="#020617"
        animate={controls}
        style={{ x: eyeX, y: eyeY, originY: '24px' }} />

      {/* Beak */}
      <path d="M 46 64 L 54 64 L 50 72 Z"
        fill="url(#footerOwlGrad)" stroke="#020617" strokeWidth="1" />
    </svg>
  );
}
