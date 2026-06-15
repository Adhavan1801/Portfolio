'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const mainSections = [
  { id: 'home',     label: 'Home'     },
  { id: 'about',   label: 'About'    },
  { id: 'projects',label: 'Projects' },
];

const othersItems = [
  { id: 'experience',     label: 'Work Experience'         },
  { id: 'certifications', label: 'Certifications & Courses' },
];

export default function Navbar() {
  const [visible,       setVisible]       = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [othersOpen,    setOthersOpen]    = useState(false);
  const navRef    = useRef(null);
  const closeTimer = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  // ── Scroll tracking ────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const scrollY    = window.scrollY;
      const heroHeight = window.innerHeight * 0.8;
      setVisible(scrollY > heroHeight);

      const sectionIds = ['home', 'about', 'skills', 'projects', 'experience', 'certifications', 'courses'];
      let current = 'home';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            current = ['experience', 'certifications', 'courses'].includes(id) ? 'others' : id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Smooth scroll helper ───────────────────────────────────────────
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    if (window.__lenis) {
      window.__lenis.scrollTo(top, { duration: 1.2 });
    } else {
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const handleNavClick = (id) => {
    if (id === 'projects') {
      router.push('/projects');
      return;
    }
    if (id === 'home') {
      if (pathname === '/') {
        if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.2 });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        router.push('/');
      }
      return;
    }
    
    // For about, experience, certifications
    if (pathname !== '/') {
      router.push('/#' + id);
    } else {
      scrollTo(id);
    }
  };

  // ── Dropdown hover helpers (with small delay to prevent flicker) ───
  const openDropdown  = () => { clearTimeout(closeTimer.current); setOthersOpen(true);  };
  const closeDropdown = () => { closeTimer.current = setTimeout(() => setOthersOpen(false), 120); };

  return (
    <nav ref={navRef} className={`navbar ${visible ? 'visible' : ''}`} aria-label="Main navigation">

      {/* Regular nav links */}
      {mainSections.map(({ id, label }) => (
        <button
          key={id}
          className={`nav-link ${activeSection === id ? 'active' : ''}`}
          onClick={() => handleNavClick(id)}
          aria-current={activeSection === id ? 'page' : undefined}
        >
          {label}
        </button>
      ))}

      {/* Others — hover dropdown */}
      <div
        className="nav-others-wrapper"
        onMouseEnter={openDropdown}
        onMouseLeave={closeDropdown}
      >
        <button
          className={`nav-link nav-others-trigger ${activeSection === 'others' ? 'active' : ''}`}
          aria-haspopup="listbox"
          aria-expanded={othersOpen}
          onClick={() => setOthersOpen(o => !o)}
        >
          Others
          <svg
            className={`nav-chevron ${othersOpen ? 'open' : ''}`}
            width="10" height="10"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="2,3 5,7 8,3" />
          </svg>
        </button>

        {/* Dropdown panel */}
        {othersOpen && (
          <div
            className="nav-dropdown"
            role="listbox"
            onMouseEnter={openDropdown}
            onMouseLeave={closeDropdown}
          >
            {othersItems.map(({ id, label }) => (
              <button
                key={id}
                className="nav-dropdown-item"
                role="option"
                onClick={() => { handleNavClick(id); setOthersOpen(false); }}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <a href="mailto:duraisingam@gmail.com" className="nav-cta">
        Contact
      </a>
    </nav>
  );
}
