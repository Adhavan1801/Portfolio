'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const navItems = [
  {
    href: '/',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
    ),
  },
  {
    href: '/about',
    label: 'About / Profile',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    ),
  },
  {
    href: '/projects',
    label: 'Projects',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
    ),
  },
  {
    href: '/experience',
    label: 'Experience',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
    ),
  },
  {
    href: '/certifications',
    label: 'Certifications',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
    ),
  },
  {
    href: '/skills',
    label: 'Skills',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
    ),
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
    ),
  },
];

import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { activeProfile, changeProfile } = useProfile();
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const docRef = doc(db, 'settings', 'global');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMaintenanceMode(docSnap.data().maintenance_mode || false);
      }
    } catch (e) { console.error(e); }
  }

  async function toggleMaintenanceMode() {
    const newValue = !maintenanceMode;
    setMaintenanceMode(newValue);
    try {
      await setDoc(doc(db, 'settings', 'global'), { maintenance_mode: newValue }, { merge: true });
    } catch (error) {
      setMaintenanceMode(!newValue);
      console.error('Error updating maintenance mode', error);
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo" style={{ marginBottom: '12px', borderBottom: 'none', paddingBottom: '0' }}>
        <span className="dot"></span>
        Admin
      </div>

      <div style={{ padding: '0 12px 16px', borderBottom: '1px solid var(--border)', marginBottom: '16px' }}>
        <select 
          value={activeProfile} 
          onChange={async (e) => {
            const newProfile = e.target.value;
            changeProfile(newProfile);
            try {
              await setDoc(doc(db, 'settings', 'global'), { published_profile_id: newProfile }, { merge: true });
            } catch (err) {
              console.error('Failed to set live profile:', err);
            }
            window.location.reload(); // Reload to refetch data for the new profile
          }}
          className="form-select"
          style={{ width: '100%', fontSize: '0.85rem', padding: '6px 10px', backgroundColor: 'var(--gray-50)', fontWeight: 600 }}
        >
          <option value="profile1">Profile 1 (Adhavan)</option>
          <option value="profile2">Profile 2 (Duraisingam)</option>
        </select>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', marginBottom: '4px', backgroundColor: 'var(--surface-active)', borderRadius: '6px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: maintenanceMode ? '#ff4d4f' : '#52c41a' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {maintenanceMode ? 'Maintenance' : 'Live'}
            </span>
          </div>
          <label style={{ position: 'relative', display: 'inline-block', width: '36px', height: '20px', margin: 0 }}>
            <input type="checkbox" checked={maintenanceMode} onChange={toggleMaintenanceMode} style={{ opacity: 0, width: 0, height: 0 }} />
            <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: maintenanceMode ? '#ff4d4f' : '#ccc', transition: '.4s', borderRadius: '34px' }}>
              <span style={{ position: 'absolute', content: '""', height: '14px', width: '14px', left: maintenanceMode ? '18px' : '4px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
            </span>
          </label>
        </div>

        <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          View Portfolio
        </a>
        <button 
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '10px 12px',
            fontSize: '0.9rem',
            borderRadius: '6px',
            width: '100%',
            textAlign: 'left',
            fontFamily: 'inherit'
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#ff4d4f10'; e.currentTarget.style.color = '#ff4d4f'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
