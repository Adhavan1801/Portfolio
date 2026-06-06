'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experience: 0,
    certifications: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [projectsSnap, skillsSnap, expSnap, certsSnap] = await Promise.all([
          getDocs(collection(db, 'projects')),
          getDocs(collection(db, 'skills')),
          getDocs(collection(db, 'experience')),
          getDocs(collection(db, 'certifications')),
        ]);

        setStats({
          projects: projectsSnap.size || 0,
          skills: skillsSnap.size || 0,
          experience: expSnap.size || 0,
          certifications: certsSnap.size || 0,
        });
      } catch (err) {
        console.log('Firebase not connected yet — showing default stats');
      }
    }
    fetchStats();
  }, []);

  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your portfolio content</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Projects</div>
          <div className="stat-value accent">{stats.projects}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Skill Categories</div>
          <div className="stat-value">{stats.skills}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Experience</div>
          <div className="stat-value">{stats.experience}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Certifications</div>
          <div className="stat-value">{stats.certifications}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Quick Actions</h2>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/projects" className="btn btn-primary">+ Add Project</a>
          <a href="/about" className="btn btn-secondary">Edit About</a>
          <a href="/experience" className="btn btn-secondary">Add Experience</a>
          <a href="/skills" className="btn btn-secondary">Manage Skills</a>
          <a href="/settings" className="btn btn-secondary">Settings</a>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">
          <h2 className="card-title">Setup Guide</h2>
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          <p><strong>1.</strong> Create a Firebase project at <a href="https://firebase.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>firebase.google.com</a></p>
          <p><strong>2.</strong> Enable Firestore Database and Firebase Storage in your console</p>
          <p><strong>3.</strong> Copy your Firebase config keys to <code>.env.local</code> in both <code>portfolio/</code> and <code>Manager/</code></p>
          <p><strong>4.</strong> Run the seed script to populate default data.</p>
        </div>
      </div>
    </>
  );
}
