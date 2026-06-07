'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import InteractiveGridBackground from './InteractiveGridBackground';

/* ── animation helpers ──────────────────────────────────────────── */
// Scroll indicator fade — simple opacity only
const fade = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8, delay, ease: 'easeOut' },
});

// Left-column wrapper: instant show
const heroTextReveal = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
  transition: { duration: 0 },
};

/* ── NameLine ──────────────────────────────────────── */
// One line of the hero name:
//   • Black text visible from t=0 (the “z-back” state)
//   • Orange vertical sweep line crosses left → right
//   • Clip-path reveals orange colour as the line passes
function NameLine({ text, sweepDelay = 0.15 }) {
  return (
    <div style={{ position: 'relative', display: 'block', overflow: 'hidden' }}>
      {/* Black base — always visible */}
      <span style={{ display: 'block', color: '#111111' }}>{text}</span>

      {/* Orange text revealed left → right */}
      <motion.span
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          display: 'block',
          color: '#ce6b43',
          clipPath: 'inset(0 100% 0 0)',
          pointerEvents: 'none',
        }}
        animate={{ clipPath: 'inset(0 0% 0 0)' }}
        transition={{ duration: 0.75, delay: sweepDelay, ease: [0.76, 0, 0.24, 1] }}
      >
        {text}
      </motion.span>

      {/* Glowing sweep line — leads the colour reveal */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0, bottom: 0, left: 0,
          width: 0,
          background: '#ffffffff',
          boxShadow: '0 0 24px rgba(255, 255, 255, 0.9), 0 0 8px #ffffffff',
          borderRadius: 2,
          pointerEvents: 'none',
        }}
        animate={{ x: '100vw' }}
        transition={{ duration: 1, delay: sweepDelay, ease: [0.76, 0, 0.24, 1] }}
      />
    </div>
  );
}

export default function Hero({ profile }) {
  const name = profile?.name || 'Durai Singam';
  const title = profile?.title || 'AI & Data Science';
  const tagline =
    profile?.tagline ||
    'Building production-ready AI products, agentic workflows, and automation systems.';

  // Split name into two lines for the large headline
  const nameParts = name.split(' ');
  const firstLine = nameParts.slice(0, Math.ceil(nameParts.length / 2)).join(' ');
  const secondLine = nameParts.slice(Math.ceil(nameParts.length / 2)).join(' ');

  const sectionRef = useRef(null);

  // Scroll-driven scale + blur transition
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let rafId;

    function update() {
      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      // progress: 0 at top, 1 when scrolled one full viewport
      const progress = Math.min(Math.max(scrollY / vh, 0), 1);

      const scale = 1 - progress * 0.08;        // 1.0 → 0.92
      const blur = progress * 6;               // 0px → 6px

      section.style.transform = `scale(${scale})`;
      section.style.filter = `blur(${blur}px)`;
    }

    function onScroll() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update(); // initialise

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="hero-section"
      style={{
        position: 'relative',
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#F5F1EE',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        transformOrigin: 'center center',
        willChange: 'transform, filter',
      }}
    >
      {/* ── Perspective Grid Background ─────────────────────────── */}
      <InteractiveGridBackground />

      {/* ── Content Layer ────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: 1440,
          margin: '0 auto',
          padding: '0 clamp(24px, 5vw, 80px)',
          display: 'grid',
          gridTemplateColumns: '60% 40%',
          alignItems: 'center',
          minHeight: '100vh',
          // perspective removed — now lives on the motion.div itself
        }}
        className="hero-grid"
      >
        {/* ── Left Column — ALL text as single animated entity ─── */}
        <motion.div
          initial={heroTextReveal.initial}
          animate={heroTextReveal.animate}
          transition={heroTextReveal.transition}
          style={{
            paddingTop: 80,
            paddingBottom: 80,
            // Perspective lives HERE on the element itself.
            // The vanishing point is the element's own centre → pure straight-line
            // depth movement, zero left-right drift regardless of column position.
            transformPerspective: 10000,
          }}
        >
          {/* Title / role — fades in with tagline after name animation */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2.0, ease: 'easeOut' }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(1.3rem, 2.9vw, 9rem)',
              fontWeight: 800,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#1A1A1A',
              marginBottom: 20,
            }}
          >
            {title}
          </motion.p>

          {/* ── Name block ───────────────────────────────────── */}
          {/* Phase 1 (0s):      Both lines at 55% scale, BLACK       */}
          {/* Phase 2 (0→1.2s): Sweep lines cross each line → orange   */}
          {/* Phase 3 (1.3→2.5s): Scale expands 55% → 100% (full size) */}
          <motion.h1
            initial={{ scale: 0.85 }}
            animate={{ scale: [0.85, 0.85, 1] }}
            transition={{
              duration: 2.5,
              times: [0, 0.52, 1],         // hold at 55% for first 52%, then grow
              ease: ['linear', [0.25, 0.46, 0.45, 0.94]],
            }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(100px, 9vw, 300px)',
              fontWeight: 1000,
              lineHeight: 1,
              textTransform: 'uppercase',
              letterSpacing: '-1px',
              marginBottom: 28,
            }}
          >
            {/* DURAI — sweep starts immediately */}
            <NameLine text={name.split(' ')[0]} sweepDelay={0.1} />

            {/* Gap between the two name lines */}
            <div style={{ height: 'clamp(4px, 0.8vw, 14px)' }} />

            {/* SINGAM — sweep starts after DURAI sweep is mid-way */}
            <NameLine text={name.split(' ').slice(1).join(' ')} sweepDelay={0.42} />
          </motion.h1>

          {/* Tagline — fades in after name expands */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2.0, ease: 'easeOut' }}
            style={{
              fontSize: 'clamp(1.05rem, 1.6vw, 1.35rem)',
              fontWeight: 600,
              lineHeight: 1.55,
              color: '#000000ff',
              maxWidth: 580,
              marginBottom: 36,
            }}
          >
            {tagline}
          </motion.p>

          {/* CTA + Social Row — fades in last */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6, ease: 'easeOut' }}
            style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}
          >
            <a
              href="#contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 36px',
                backgroundColor: '#C96D49',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                borderRadius: 999,
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 24px rgba(201,109,73,0.35)',
              }}
              className="hero-cta"
            >
              Let&apos;s Connect
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: 12 }}>
              <a
                href={profile?.linkedin_url || 'https://linkedin.com/in/duraisingam'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hero-social-icon"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href={profile?.github_url || 'https://github.com/DuraiSingam'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="hero-social-icon"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Right Column: Profile Image ──────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Decorative crosshair */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              top: '8%',
              right: '5%',
              width: 28,
              height: 28,
              zIndex: 3,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <line x1="14" y1="0" x2="14" y2="28" stroke="#C96D49" strokeWidth="1.5" />
              <line x1="0" y1="14" x2="28" y2="14" stroke="#C96D49" strokeWidth="1.5" />
            </svg>
          </motion.div>

          {/* Decorative small square */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              bottom: '18%',
              left: '2%',
              width: 14,
              height: 14,
              border: '2px solid #C96D49',
              borderRadius: 3,
              zIndex: 3,
            }}
          />

          {/* Profile Image with float animation */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'relative',
              width: 'clamp(260px, 28vw, 420px)',
              height: 'clamp(260px, 28vw, 420px)',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '5px solid rgba(255,255,255,0.8)',
                boxShadow: '0 20px 60px rgba(201,109,73,0.2), 0 8px 24px rgba(0,0,0,0.08)',
                position: 'relative',
              }}
            >
              <Image
                src={profile?.profile_image_url || '/profile.png'}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                style={{ objectFit: 'cover', objectPosition: 'top center' }}
              />
            </div>

            {/* Glow ring behind image */}
            <div
              style={{
                position: 'absolute',
                inset: -8,
                borderRadius: '50%',
                border: '1px solid rgba(201,109,73,0.15)',
                zIndex: -1,
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────────── */}
      <motion.div
        {...fade(1.2)}
        style={{
          position: 'absolute',
          bottom: 36,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          zIndex: 3,
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.7rem',
            letterSpacing: 2,
            color: '#999',
            textTransform: 'uppercase',
          }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 1,
            height: 36,
            background: 'linear-gradient(to bottom, #C96D49, transparent)',
            transformOrigin: 'top',
          }}
        />
      </motion.div>
    </section>
  );
}
