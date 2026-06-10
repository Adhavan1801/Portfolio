'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where, getDoc, setDoc } from 'firebase/firestore';
import { useProfile } from '@/context/ProfileContext';

export default function SettingsPage() {
  const [filters, setFilters] = useState([]);
  const [toast, setToast] = useState(null);
  const [filterForm, setFilterForm] = useState({ name: '', slug: '', display_order: 0 });
  const [liveProfile, setLiveProfile] = useState('profile1');
  const { activeProfile } = useProfile();

  useEffect(() => { 
    fetchFilters(); 
    fetchGlobalSettings();
  }, [activeProfile]);

  async function fetchGlobalSettings() {
    try {
      const docRef = doc(db, 'settings', 'global');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLiveProfile(docSnap.data().published_profile_id || 'profile1');
      }
    } catch (e) { console.error(e); }
  }

  async function updateLiveProfile(profileId) {
    setLiveProfile(profileId);
    try {
      await setDoc(doc(db, 'settings', 'global'), { published_profile_id: profileId }, { merge: true });
      showToast('Live profile updated!');
    } catch (e) {
      showToast('Failed to update live profile', 'error');
    }
  }

  async function fetchFilters() {
    try {
      const q = query(collection(db, 'filter_categories'), where('profile_id', '==', activeProfile));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      setFilters(data);
    } catch (e) { console.error(e); }
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function addFilter(e) {
    e.preventDefault();
    const payload = { ...filterForm, display_order: parseInt(filterForm.display_order) || 0, profile_id: activeProfile };
    try {
      await addDoc(collection(db, 'filter_categories'), payload);
      showToast('Filter added!');
      setFilterForm({ name: '', slug: '', display_order: 0 });
      fetchFilters();
    } catch (error) {
      showToast('Error', 'error');
    }
  }

  async function deleteFilter(id) {
    if (!confirm('Delete this filter?')) return;
    try {
      await deleteDoc(doc(db, 'filter_categories', id));
      showToast('Deleted');
      fetchFilters();
    } catch (error) {
      showToast('Error', 'error');
    }
  }

  return (
    <>
      <div className="page-header"><h1>Settings</h1><p>Manage project filter categories and Firebase settings</p></div>

      <div className="card" style={{ marginBottom: '24px', backgroundColor: '#fff9f0', border: '1px solid var(--accent)' }}>
        <h2 className="card-title" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '10px', height: '10px', backgroundColor: '#52c41a', borderRadius: '50%' }}></span>
          Live Website Profile
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Choose which profile is currently displayed on your public portfolio website.
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '10px 16px', border: liveProfile === 'profile1' ? '2px solid var(--accent)' : '1px solid var(--border)', borderRadius: '8px', background: liveProfile === 'profile1' ? 'var(--orange-glow)' : 'white' }}>
            <input type="radio" name="liveProfile" value="profile1" checked={liveProfile === 'profile1'} onChange={() => updateLiveProfile('profile1')} />
            <span style={{ fontWeight: liveProfile === 'profile1' ? '600' : '400' }}>Profile 1 (Adhavan)</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '10px 16px', border: liveProfile === 'profile2' ? '2px solid var(--accent)' : '1px solid var(--border)', borderRadius: '8px', background: liveProfile === 'profile2' ? 'var(--orange-glow)' : 'white' }}>
            <input type="radio" name="liveProfile" value="profile2" checked={liveProfile === 'profile2'} onChange={() => updateLiveProfile('profile2')} />
            <span style={{ fontWeight: liveProfile === 'profile2' ? '600' : '400' }}>Profile 2 (Duraisingam)</span>
          </label>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 className="card-title" style={{ marginBottom: '20px' }}>Project Filter Categories</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          These categories appear as filter buttons in the Projects section. The slug should match the <code>filter_category</code> field on your projects.
        </p>
        <form onSubmit={addFilter} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '20px' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '150px' }}>
            <label className="form-label">Name</label>
            <input className="form-input" value={filterForm.name} onChange={(e) => setFilterForm({ ...filterForm, name: e.target.value })} placeholder="Computer Vision" required />
          </div>
          <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '150px' }}>
            <label className="form-label">Slug</label>
            <input className="form-input" value={filterForm.slug} onChange={(e) => setFilterForm({ ...filterForm, slug: e.target.value })} placeholder="computer-vision" required />
          </div>
          <div className="form-group" style={{ marginBottom: 0, width: '80px' }}>
            <label className="form-label">Order</label>
            <input className="form-input" type="number" value={filterForm.display_order} onChange={(e) => setFilterForm({ ...filterForm, display_order: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: '40px' }}>Add</button>
        </form>

        {filters.length === 0 ? (
          <div className="empty-state"><div className="icon">🏷️</div><p>No filter categories yet.</p></div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead><tr><th>Order</th><th>Name</th><th>Slug</th><th>Actions</th></tr></thead>
              <tbody>
                {filters.map((f) => (
                  <tr key={f.id}>
                    <td>{f.display_order}</td>
                    <td style={{ fontWeight: 600 }}>{f.name}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>{f.slug}</td>
                    <td><button className="btn btn-sm btn-danger" onClick={() => deleteFilter(f.id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="card-title" style={{ marginBottom: '16px' }}>Environment Info</h2>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '2' }}>
          <p>Firebase API Key: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Connected' : '❌ Not set'}</p>
          <p>Firebase Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Connected' : '❌ Not set'}</p>
          <p>Firebase Auth Domain: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Connected' : '❌ Not set'}</p>
          <p>Firebase Storage Bucket: {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ Connected' : '❌ Not set'}</p>
        </div>
      </div>
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}
