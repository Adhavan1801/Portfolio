'use client';

import { useState } from 'react';
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

  return (
    <section id="projects" className="section">
      <ScrollReveal>
        <span className="section-label">Portfolio</span>
      </ScrollReveal>
      <ScrollReveal delay={50}>
        <h2 className="section-title">Featured Projects</h2>
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <p className="section-subtitle">
          A selection of projects showcasing my work in AI, computer vision, embedded systems, and more.
        </p>
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
        {filtered.map((project, index) => (
          <ScrollReveal key={project.id || index} delay={index * 100}>
            <div className="project-card">
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
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                </div>
                <div className="project-card-links">
                  {project.show_github && project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="project-link">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                      GitHub
                    </a>
                  )}
                  {project.show_live_demo && project.live_demo_url && (
                    <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer" className="project-link">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
