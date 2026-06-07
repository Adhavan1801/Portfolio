'use client';

import ScrollReveal from './ScrollReveal';
import Image from 'next/image';

export default function About({ profile }) {
  const aboutText =
    profile?.about_text ||
    'AI and Data Science undergraduate at Thoothukudi clg of engineering specialising in end-to-end ML pipeline engineering — from model architecture and training to edge deployment. Core interests span computer vision, natural language processing, Gen AI, embedded AI, and agentic AI workflows.';

  return (
    <section id="about" className="section">
      <ScrollReveal>
        <span className="section-label">About Me</span>
      </ScrollReveal>

      <div className="about-grid">
        <ScrollReveal delay={100}>
          <div className="about-image-wrapper">
            <Image
              src={profile?.about_image_url || '/about.png'}
              alt={profile?.name || 'Durai Singam'}
              width={400}
              height={533}
              priority
              style={{ objectFit: 'cover', objectPosition: 'top center' }}
            />
            <div className="about-decoration" aria-hidden="true"></div>
          </div>
        </ScrollReveal>

        <div className="about-content">
          <ScrollReveal delay={150}>
            <h2 className="section-title">
              Crafting <span style={{ color: 'var(--accent)' }}>Intelligent Systems</span> from
              Architecture to Edge
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="about-text">{aboutText}</p>
          </ScrollReveal>

          <ScrollReveal delay={250}>
            <div className="about-info-grid">
              <div className="about-info-item">
                <div className="label">University</div>
                <div className="value">{profile?.university || 'Thoothukudi clg of engineering'}</div>
              </div>
              <div className="about-info-item">
                <div className="label">Degree</div>
                <div className="value">{profile?.degree || 'B.Tech in AIDS'}</div>
              </div>
              <div className="about-info-item">
                <div className="label">Location</div>
                <div className="value">Thoothukudi, India</div>
              </div>
              <div className="about-info-item">
                <div className="label">Graduating</div>
                <div className="value">{profile?.graduation_year || 2028}</div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <a href="#projects" className="btn-primary" onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('projects');
              if (el) {
                const top = el.getBoundingClientRect().top + window.scrollY - 80;
                if (window.__lenis) {
                  window.__lenis.scrollTo(top, { duration: 1.2 });
                } else {
                  window.scrollTo({ top, behavior: 'smooth' });
                }
              }
            }}>
              See My Work
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
