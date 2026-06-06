'use client';

import { motion } from 'framer-motion';
import InteractiveGridBackground from './InteractiveGridBackground';

export default function Maintenance({ profile }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#F5F1EE',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* ── Perspective Grid Background ─────────────────────────── */}
      <InteractiveGridBackground />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '40px',
          maxWidth: '600px',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)',
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          style={{
            display: 'inline-block',
            marginBottom: '24px',
            color: '#C96D49',
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </motion.div>

        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            color: '#1A1A1A',
            marginBottom: '16px',
            lineHeight: 1.1,
          }}
        >
          We're Upgrading
          <br />
          <span style={{ color: '#C96D49' }}>The Experience.</span>
        </h1>

        <p
          style={{
            fontSize: '1.1rem',
            color: '#555',
            lineHeight: 1.6,
            marginBottom: '32px',
          }}
        >
          {profile?.name || 'Durai Singam'}'s portfolio is currently undergoing some scheduled maintenance. Please check back shortly!
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          {profile?.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: '#1A1A1A',
                color: '#fff',
                fontWeight: 600,
                borderRadius: '999px',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#C96D49')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#1A1A1A')}
            >
              LinkedIn
            </a>
          )}
          {profile?.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: 'transparent',
                color: '#1A1A1A',
                border: '2px solid #1A1A1A',
                fontWeight: 600,
                borderRadius: '999px',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#1A1A1A';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#1A1A1A';
              }}
            >
              GitHub
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}
