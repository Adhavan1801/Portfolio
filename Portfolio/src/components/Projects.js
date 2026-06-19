'use client';

import { useState } from 'react';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';

export default function Projects({ projects, filterCategories }) {
  const [activeFilter, setActiveFilter] = useState('all');

  // Fallback data
  const fallbackProjects = [
    {
      id: '1',
      title: 'GhostMTFormer: Dual-Encoder Skin Lesion Segmentation',
      short_description: 'Dual-encoder (GhostNet + dilated CNN) with multi-scale CFCA cross-attention, XFF bottleneck, BRM boundary refinement, and MC-Dropout for clinically explainable segmentation.',
      tech_stack: ['PyTorch', 'GhostNet', 'Cross-Attention', 'Grad-CAM'],
      filter_categories: ['computer-vision'],
      github_url: 'https://github.com/DuraiSingam',
      live_demo_url: '',
      show_github: true,
      show_live_demo: false,
      image_url: '',
    },
    {
      id: '2',
      title: 'GPS-Guided Autonomous Robot for Air Quality Monitoring',
      short_description: 'ESP32 robot with MQ-series sensors and NEO-6M GPS streaming georeferenced data to a FastAPI + LightGBM AQI classifier visualised on a Leaflet.js heatmap.',
      tech_stack: ['ESP32', 'FastAPI', 'LightGBM', 'Leaflet.js'],
      filter_categories: ['embedded-ai'],
      github_url: 'https://github.com/DuraiSingam',
      live_demo_url: '',
      show_github: true,
      show_live_demo: false,
      image_url: '',
    },
    {
      id: '3',
      title: 'Blood Donation Prediction using Decision Tree',
      short_description: 'RFMTC transfusion dataset pipeline — IQR outlier removal, SMOTE oversampling, and GridSearchCV-tuned CART Decision Tree with stratified k-fold cross-validation.',
      tech_stack: ['Python', 'Scikit-Learn', 'SMOTE', 'GridSearchCV'],
      filter_categories: ['ml-data-science'],
      github_url: 'https://github.com/DuraiSingam',
      live_demo_url: '',
      show_github: true,
      show_live_demo: false,
      image_url: '',
    },
    {
      id: '4',
      title: 'Attention-Based Deep RL for Adaptive TCP Congestion Control',
      short_description: 'GRU-DDQN and Attention-DDQN models for TCP congestion control on a simulated 100 Mbps network. Achieved 0.15% packet loss and 27.7% latency reduction.',
      tech_stack: ['PyTorch', 'GRU', 'DDQN', 'Reinforcement Learning'],
      filter_categories: ['ml-data-science'],
      github_url: 'https://github.com/DuraiSingam',
      live_demo_url: '',
      show_github: true,
      show_live_demo: false,
      image_url: '',
    },
    {
      id: '5',
      title: 'Multi-Task Continual Learning for Satellite Monitoring',
      short_description: '3D-CNN/TCN continual learning framework with EWC and MMD alignment for remote sensing tasks. Deployed on Jetson Orin Nano at sub-66ms latency.',
      tech_stack: ['PyTorch', '3D-CNN', 'TCN', 'EWC', 'Jetson Orin'],
      filter_categories: ['computer-vision'],
      github_url: 'https://github.com/DuraiSingam',
      live_demo_url: '',
      show_github: true,
      show_live_demo: false,
      image_url: '',
    },
  ];

  const fallbackCategories = [
    { id: '1', name: 'All', slug: 'all' },
    { id: '2', name: 'Computer Vision', slug: 'computer-vision' },
    { id: '3', name: 'ML & Data Science', slug: 'ml-data-science' },
    { id: '4', name: 'Embedded AI', slug: 'embedded-ai' },
  ];

  const displayProjects = projects && projects.length > 0 ? projects : fallbackProjects;
  const displayCategories = filterCategories && filterCategories.length > 0
    ? [{ id: 'all', name: 'All', slug: 'all' }, ...filterCategories]
    : fallbackCategories;

  const filtered =
    activeFilter === 'all'
      ? displayProjects
      : displayProjects.filter((p) => {
          if (p.filter_categories && Array.isArray(p.filter_categories)) {
            return p.filter_categories.includes(activeFilter);
          }
          return p.filter_category === activeFilter;
        });

  // Show only 4 on the homepage
  const visibleProjects = filtered.slice(0, 4);

  return (
    <section id="projects" className="section">
      <ScrollReveal>
        <span className="section-label">Portfolio</span>
      </ScrollReveal>
      <ScrollReveal delay={50}>
        <h2 className="section-title">Featured Projects <span className="projects-count-badge">{displayProjects.length}</span></h2>
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: 'var(--space-xl)' }}>
          <p className="section-subtitle" style={{ margin: 0, maxWidth: '600px' }}>
            A selection of projects showcasing my work in AI, computer vision, embedded systems, and more.
          </p>
          <Link
            href="/projects"
            className="btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.85rem', border: '1.5px solid #000000', color: '#000000', transition: 'all var(--transition-fast)', textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            View All Projects
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={150}>
        <div className="project-filter-bar">
          {displayCategories.map((cat) => (
            <button
              key={cat.id || cat.slug}
              className={`filter-btn ${activeFilter === cat.slug ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </ScrollReveal>

      <div className="projects-grid">
        {visibleProjects.map((project, index) => (
          <ScrollReveal key={project.id || index} delay={index * 100}>
            <Link
              href={`/projects?id=${project.id}`}
              style={{ textDecoration: 'none', display: 'block', color: 'inherit', height: '100%' }}
            >
              <div className="project-card" style={{ height: '100%' }}>
                <div className="project-card-image">
                  {project.image_url ? (
                    <img src={project.image_url} alt={project.title} loading="lazy" />
                  ) : (
                    <span className="placeholder-icon">🧠</span>
                  )}
                </div>
                <div className="project-card-body">
                  <h3 className="project-card-title">{project.title}</h3>
                  <p className="project-card-desc">{project.short_description || project.description}</p>
                  <div className="project-card-tech">
                    {(project.tech_stack || []).map((tech, i) => (
                      <span key={i} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="project-card-links">
                    <span className="project-link" style={{ color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600, fontSize: '0.82rem' }}>
                      View Details
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>


    </section>
  );
}
