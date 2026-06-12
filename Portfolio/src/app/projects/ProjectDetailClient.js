'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';

export default function ProjectDetailClient({ projects, filterCategories }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const detailPanelRef = useRef(null);
  const searchParams = useSearchParams();
  const targetId = searchParams.get('id');

  const displayCategories = filterCategories && filterCategories.length > 0
    ? [{ id: 'all', name: 'All', slug: 'all' }, ...filterCategories]
    : [{ id: 'all', name: 'All', slug: 'all' }];

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter((p) => {
        if (p.filter_categories && Array.isArray(p.filter_categories)) {
          return p.filter_categories.includes(activeFilter);
        }
        return p.filter_category === activeFilter;
      });

  function handleSelectProject(project) {
    if (selectedProject?.id === project.id) return;
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedProject(project);
      setIsAnimating(false);
      // Scroll detail panel back to top
      if (detailPanelRef.current) {
        detailPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
  }

  // Auto-select first project on load or filter change
  useEffect(() => {
    if (filteredProjects.length > 0) {
      setSelectedProject(filteredProjects[0]);
    } else {
      setSelectedProject(null);
    }
  }, [activeFilter]);

  // Auto-select: prefer ?id= param, otherwise first project
  useEffect(() => {
    if (projects.length === 0) return;
    if (targetId) {
      const match = projects.find(p => p.id === targetId);
      if (match) {
        setSelectedProject(match);
        return;
      }
    }
    if (!selectedProject) setSelectedProject(projects[0]);
  }, [projects]);

  const techStack = selectedProject
    ? (Array.isArray(selectedProject.tech_stack)
        ? selectedProject.tech_stack
        : (selectedProject.tech_stack || '').split(',').map(s => s.trim()).filter(Boolean))
    : [];

  const projectCategories = selectedProject
    ? (selectedProject.filter_categories || (selectedProject.filter_category ? [selectedProject.filter_category] : []))
    : [];

  return (
    <section className="projects-detail-page">
      {/* ── Page Header ── */}
      <div className="projects-detail-header">
        <ScrollReveal>
          <Link href="/#projects" className="back-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to Portfolio
          </Link>
        </ScrollReveal>
        <ScrollReveal delay={50}>
          <span className="section-label">Portfolio</span>
          <h1 className="projects-detail-title">All Projects</h1>
          <p className="projects-detail-subtitle">
            A full collection of my work in AI, computer vision, embedded systems, and more.
          </p>
        </ScrollReveal>

        {/* ── Filter Bar ── */}
        <ScrollReveal delay={100}>
          <div className="project-filter-bar" style={{ marginBottom: 0 }}>
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
      </div>

      {/* ── Main Layout ── */}
      <div className="projects-detail-layout">
        {/* ── Left: Project List Sidebar ── */}
        <aside className="project-list-sidebar">
          {filteredProjects.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', padding: '1rem', fontSize: '0.9rem' }}>No projects match this filter.</p>
          ) : (
            filteredProjects.map((project, i) => {
              const isActive = selectedProject?.id === project.id;
              const cats = project.filter_categories || (project.filter_category ? [project.filter_category] : []);
              return (
                <button
                  key={project.id || i}
                  className={`project-list-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectProject(project)}
                >
                  <div className="project-list-item-image">
                    {project.image_url
                      ? <img src={project.image_url} alt={project.title} />
                      : <span className="placeholder-icon">🧠</span>
                    }
                  </div>
                  <div className="project-list-item-content">
                    <h3>{project.title}</h3>
                    <p>{project.short_description || (project.description || '').split('\n')[0]}</p>
                    {cats.length > 0 && (
                      <div className="project-list-item-cats">
                        {cats.map(slug => {
                          const cat = filterCategories?.find(c => c.slug === slug);
                          return <span key={slug} className="cat-chip">{cat?.name || slug}</span>;
                        })}
                      </div>
                    )}
                  </div>
                  {isActive && <span className="active-indicator" />}
                </button>
              );
            })
          )}
        </aside>

        {/* ── Right: Project Detail Panel ── */}
        <main ref={detailPanelRef} className={`project-detail-panel ${isAnimating ? 'fading' : ''}`}>
          {!selectedProject ? (
            <div className="project-detail-empty">
              <span style={{ fontSize: '3rem' }}>👆</span>
              <p>Select a project to see its details</p>
            </div>
          ) : (
            <>
              {/* Hero image */}
              <div className="project-detail-image">
                {selectedProject.image_url
                  ? <img src={selectedProject.image_url} alt={selectedProject.title} />
                  : (
                    <div className="project-detail-image-placeholder">
                      <span>🧠</span>
                    </div>
                  )
                }
              </div>

              {/* Meta row */}
              <div className="project-detail-meta">
                {projectCategories.map(slug => {
                  const cat = filterCategories?.find(c => c.slug === slug);
                  return <span key={slug} className="filter-btn active" style={{ fontSize: '0.75rem', padding: '4px 14px' }}>{cat?.name || slug}</span>;
                })}
              </div>

              {/* Title */}
              <h2 className="project-detail-name">{selectedProject.title}</h2>

              {/* Short description */}
              {selectedProject.short_description && (
                <p className="project-detail-tagline">{selectedProject.short_description}</p>
              )}

              <hr className="project-detail-divider" />

              {/* Full description */}
              {selectedProject.description && (
                <div className="project-detail-section">
                  <h3 className="project-detail-section-title">
                    <span className="section-dot" />
                    About This Project
                  </h3>
                  <div className="project-detail-description">
                    {selectedProject.description.split('\n').map((line, i) => (
                      line.trim() ? <p key={i}>{line}</p> : <br key={i} />
                    ))}
                  </div>
                </div>
              )}

              {/* Tech stack */}
              {techStack.length > 0 && (
                <div className="project-detail-section">
                  <h3 className="project-detail-section-title">
                    <span className="section-dot" />
                    Technologies Used
                  </h3>
                  <div className="project-card-tech" style={{ marginTop: '0.75rem' }}>
                    {techStack.map((tech, i) => (
                      <span key={i} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {(selectedProject.show_github && selectedProject.github_url) || (selectedProject.show_live_demo && selectedProject.live_demo_url) ? (
                <div className="project-detail-section">
                  <h3 className="project-detail-section-title">
                    <span className="section-dot" />
                    Links
                  </h3>
                  <div className="project-detail-links">
                    {selectedProject.show_github && selectedProject.github_url && (
                      <a href={selectedProject.github_url} target="_blank" rel="noopener noreferrer" className="project-detail-link-btn outline">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        View on GitHub
                      </a>
                    )}
                  </div>
                </div>
              ) : null}

              {/* Live Demo */}
              {selectedProject.show_live_demo && selectedProject.live_demo_url && (
                <div className="project-detail-live-demo">
                  <div className="project-detail-section">
                    <h3 className="project-detail-section-title">
                      <span className="section-dot" />
                      Live Demo
                    </h3>
                  </div>
                  <div className="project-detail-demo-frame">
                    <div className="demo-frame-bar">
                      <span /><span /><span />
                      <p className="demo-frame-url">{selectedProject.live_demo_url}</p>
                    </div>
                    <iframe
                      src={selectedProject.live_demo_url}
                      title={`${selectedProject.title} Live Demo`}
                      loading="lazy"
                      allow="fullscreen"
                    />
                  </div>
                  <a href={selectedProject.live_demo_url} target="_blank" rel="noopener noreferrer" className="project-detail-link-btn outline" style={{ marginTop: '12px', display: 'inline-flex' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                    View in Full Screen
                  </a>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </section>
  );
}
