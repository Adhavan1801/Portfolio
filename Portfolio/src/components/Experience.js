'use client';

import ScrollReveal from './ScrollReveal';

export default function Experience({ experience }) {
  const fallbackExperience = [
    {
      id: '1',
      role: 'AI Research Intern',
      company: 'Research Lab — Thoothukudi clg of engineering',
      location: 'Thoothukudi, India',
      start_date: '2025-01-01',
      end_date: null,
      description: 'Working on medical image segmentation using dual-encoder architectures and continual learning frameworks for remote sensing applications.',
      display_order: 1,
    },
    {
      id: '2',
      role: 'Freelance ML Engineer',
      company: 'Self-Employed',
      location: 'Remote',
      start_date: '2024-06-01',
      end_date: '2024-12-31',
      description: 'Built end-to-end machine learning pipelines for clients including data preprocessing, model training, and deployment on edge devices.',
      display_order: 2,
    },
  ];

  const displayExperience = experience && experience.length > 0 ? experience : fallbackExperience;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Present';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <section id="experience" className="section">
      <ScrollReveal>
        <span className="section-label">Experience</span>
      </ScrollReveal>
      <ScrollReveal delay={50}>
        <h2 className="section-title">Work Experience</h2>
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <p className="section-subtitle">
          My professional journey and hands-on experience in AI and software engineering.
        </p>
      </ScrollReveal>

      <div className="experience-timeline">
        {displayExperience.map((item, index) => (
          <ScrollReveal key={item.id || index} delay={index * 120}>
            <div className="experience-item">
              <div className="experience-date">
                {formatDate(item.start_date)} — {formatDate(item.end_date)}
              </div>
              <h3 className="experience-role">{item.role}</h3>
              <div className="experience-company">
                {item.company} · {item.location}
              </div>
              <p className="experience-desc">{item.description}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
