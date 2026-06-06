'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, getDoc, setDoc } from 'firebase/firestore';

export default function SettingsPage() {
  const [filters, setFilters] = useState([]);
  const [toast, setToast] = useState(null);
  const [filterForm, setFilterForm] = useState({ name: '', slug: '', display_order: 0 });
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => { 
    fetchFilters(); 
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
    setMaintenanceMode(newValue); // optimistic update
    try {
      await setDoc(doc(db, 'settings', 'global'), { maintenance_mode: newValue }, { merge: true });
      showToast(`Maintenance mode ${newValue ? 'enabled' : 'disabled'}!`);
    } catch (error) {
      setMaintenanceMode(!newValue); // revert on error
      showToast('Error updating maintenance mode', 'error');
    }
  }

  async function fetchFilters() {
    try {
      const q = query(collection(db, 'filter_categories'), orderBy('display_order', 'asc'));
      const snapshot = await getDocs(q);
      setFilters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) { console.error(e); }
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function addFilter(e) {
    e.preventDefault();
    const payload = { ...filterForm, display_order: parseInt(filterForm.display_order) || 0 };
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

      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 className="card-title" style={{ marginBottom: '16px' }}>Site Maintenance Mode</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', color: maintenanceMode ? '#ff4d4f' : 'var(--text-primary)' }}>{maintenanceMode ? 'Maintenance Mode is Active' : 'Site is Live'}</h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>When active, all visitors will see a maintenance screen instead of your portfolio.</p>
          </div>
          <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '28px' }}>
            <input type="checkbox" checked={maintenanceMode} onChange={toggleMaintenanceMode} style={{ opacity: 0, width: 0, height: 0 }} />
            <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: maintenanceMode ? '#ff4d4f' : '#ccc', transition: '.4s', borderRadius: '34px' }}>
              <span style={{ position: 'absolute', content: '""', height: '20px', width: '20px', left: maintenanceMode ? '26px' : '4px', bottom: '4px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
            </span>
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
