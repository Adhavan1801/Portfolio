'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { useProfile } from '@/context/ProfileContext';
import { uploadToCloudinary } from '@/lib/cloudinary';

export default function CertificationsPage() {
  const [certs, setCerts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { activeProfile } = useProfile();

  const initialForm = { title: '', issuer: '', date: '', credential_url: '', is_visible: true, display_order: 0 };
  const [form, setForm] = useState(initialForm);

  useEffect(() => { fetchCerts(); }, [activeProfile]);

  async function fetchCerts() {
    try {
      const q = query(collection(db, 'certifications'), where('profile_id', '==', activeProfile));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      setCerts(data);
    } catch (e) { console.error(e); }
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const downloadURL = await uploadToCloudinary(file);
      setForm(prev => ({ ...prev, credential_url: downloadURL }));
      showToast('Certificate uploaded successfully!');
    } catch (error) {
      showToast('Error uploading file: ' + error.message, 'error');
    } finally {
      setUploading(false);
    }
  }

  function handleEdit(cert) {
    setEditing(cert.id);
    setForm(cert);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancel() {
    setEditing(null);
    setForm(initialForm);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this certification?')) return;
    try {
      await deleteDoc(doc(db, 'certifications', id));
      showToast('Deleted');
      fetchCerts();
    } catch (error) { showToast('Error deleting', 'error'); }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...form, display_order: parseInt(form.display_order) || 0, profile_id: activeProfile };
    delete payload.id;

    try {
      if (editing) {
        await updateDoc(doc(db, 'certifications', editing), payload);
        showToast('Updated!');
      } else {
        await addDoc(collection(db, 'certifications'), payload);
        showToast('Added!');
      }
      setForm(initialForm);
      setEditing(null);
      fetchCerts();
    } catch (error) { showToast('Error saving', 'error'); }
  }

  return (
    <>
      <div className="page-header">
        <h1>Certifications</h1>
        <p>Manage your certifications and awards</p>
      </div>

      <div className="card" style={{ marginBottom: '30px' }}>
        <h2 className="card-title" style={{ marginBottom: '20px' }}>{editing ? 'Edit' : 'Add New'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input required className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Issuer *</label>
              <input required className="form-input" value={form.issuer} onChange={e => setForm({...form, issuer: e.target.value})} placeholder="e.g. Coursera" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input className="form-input" value={form.date} onChange={e => setForm({...form, date: e.target.value})} placeholder="e.g. Aug 2025" />
            </div>
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label">Credential URL or File</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input className="form-input" value={form.credential_url} onChange={e => setForm({...form, credential_url: e.target.value})} placeholder="URL or upload a file..." />
                <label className="btn btn-secondary" style={{ whiteSpace: 'nowrap', cursor: 'pointer' }}>
                  {uploading ? 'Uploading...' : 'Upload File'}
                  <input type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleFileUpload} disabled={uploading} />
                </label>
              </div>
            </div>
          </div>
          <div className="form-row" style={{ marginTop: '20px', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" checked={form.is_visible} onChange={e => setForm({...form, is_visible: e.target.checked})} /> Visible
            </label>
            <div className="form-group" style={{ margin: 0, marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label className="form-label" style={{ margin: 0 }}>Order:</label>
              <input className="form-input" type="number" style={{ width: '80px', margin: 0 }} value={form.display_order} onChange={e => setForm({...form, display_order: e.target.value})} />
            </div>
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary">{editing ? 'Save Changes' : 'Add'}</button>
            {editing && <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="card">
        <h2 className="card-title" style={{ marginBottom: '20px' }}>Current Certifications</h2>
        <div className="table-container">
          <table className="data-table">
          <thead>
            <tr><th>Order</th><th>Title</th><th>Issuer</th><th>Date</th><th>Visible</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {certs.map(c => (
              <tr key={c.id}>
                <td>{c.display_order}</td>
                <td><strong>{c.title}</strong></td>
                <td>{c.issuer}</td>
                <td>{c.date}</td>
                <td>{c.is_visible ? 'Yes' : 'No'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEdit(c)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Edit</button>
                    <button onClick={() => handleDelete(c.id)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem', color: '#ff4d4f', borderColor: '#ff4d4f' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}
