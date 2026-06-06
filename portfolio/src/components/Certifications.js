'use client';

import ScrollReveal from './ScrollReveal';

export default function Certifications({ certifications }) {
  const fallbackCerts = [
    {
      id: '1',
      title: 'Deep Learning Specialization',
      issuer: 'Coursera — Andrew Ng',
      date: '2024-09-01',
      credential_url: '#',
      display_order: 1,
    },
    {
      id: '2',
      title: 'Machine Learning with Python',
      issuer: 'IBM — Cognitive Class',
      date: '2024-06-01',
      credential_url: '#',
      display_order: 2,
    },
    {
      id: '3',
      title: 'Computer Vision Nanodegree',
      issuer: 'Udacity',
      date: '2024-03-01',
      credential_url: '#',
      display_order: 3,
    },
  ];

  const displayCerts = certifications && certifications.length > 0 ? certifications : fallbackCerts;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <section id="certifications" className="section">
      <ScrollReveal>
        <span className="section-label">Certifications</span>
      </ScrollReveal>
      <ScrollReveal delay={50}>
        <h2 className="section-title">Certifications &amp; Courses</h2>
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <p className="section-subtitle">
          Continuous learning through industry-recognized certifications and specialized courses.
        </p>
      </ScrollReveal>

      <div className="certifications-grid">
        {displayCerts.map((cert, index) => (
          <ScrollReveal key={cert.id || index} delay={index * 100}>
            <div className="cert-card">
              <div className="cert-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="7"/>
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
                </svg>
              </div>
              <h3 className="cert-title">{cert.title}</h3>
              <p className="cert-issuer">{cert.issuer}</p>
              <span className="cert-date">{formatDate(cert.date)}</span>
              {cert.credential_url && cert.credential_url !== '#' && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cert-link"
                >
                  View Credential
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
