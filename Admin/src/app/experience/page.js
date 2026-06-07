'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

export default function ExperiencePage() {
  const [experience, setExperience] = useState([]);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);

  const initialForm = { role: '', company: '', location: '', start_date: '', end_date: '', description: '', is_visible: true, display_order: 0 };
  const [form, setForm] = useState(initialForm);

  useEffect(() => { fetchExperience(); }, []);

  async function fetchExperience() {
    try {
      const q = query(collection(db, 'experience'), orderBy('display_order', 'asc'));
      const snapshot = await getDocs(q);
      setExperience(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) { console.error(e); }
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleEdit(exp) {
    setEditing(exp.id);
    setForm(exp);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancel() {
    setEditing(null);
    setForm(initialForm);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this experience?')) return;
    try {
      await deleteDoc(doc(db, 'experience', id));
      showToast('Experience deleted');
      fetchExperience();
    } catch (error) { showToast('Error deleting', 'error'); }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...form, display_order: parseInt(form.display_order) || 0 };
    delete payload.id;

    try {
      if (editing) {
        await updateDoc(doc(db, 'experience', editing), payload);
        showToast('Experience updated!');
      } else {
        await addDoc(collection(db, 'experience'), payload);
        showToast('Experience added!');
      }
      setForm(initialForm);
      setEditing(null);
      fetchExperience();
    } catch (error) { showToast('Error saving experience', 'error'); }
  }

  return (
    <>
      <div className="page-header">
        <h1>Experience</h1>
        <p>Manage your work experience and internships</p>
      </div>

      <div className="card" style={{ marginBottom: '30px' }}>
        <h2 className="card-title" style={{ marginBottom: '20px' }}>{editing ? 'Edit Experience' : 'Add New Experience'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Role / Job Title *</label>
              <input required className="form-input" value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Company *</label>
              <input required className="form-input" value={form.company} onChange={e => setForm({...form, company: e.target.value})} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input type="text" required className="form-input" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} placeholder="e.g. May 2024" />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input className="form-input" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} placeholder="e.g. Aug 2024 or Present" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
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
            <button type="submit" className="btn btn-primary">{editing ? 'Save Changes' : 'Add Experience'}</button>
            {editing && <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="card">
        <h2 className="card-title" style={{ marginBottom: '20px' }}>Current Experience</h2>
        <table className="table">
          <thead>
            <tr><th>Order</th><th>Role</th><th>Company</th><th>Dates</th><th>Visible</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {experience.map(e => (
              <tr key={e.id}>
                <td>{e.display_order}</td>
                <td><strong>{e.role}</strong></td>
                <td>{e.company}</td>
                <td>{e.start_date} - {e.end_date || 'Present'}</td>
                <td>{e.is_visible ? 'Yes' : 'No'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEdit(e)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Edit</button>
                    <button onClick={() => handleDelete(e.id)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem', color: '#ff4d4f', borderColor: '#ff4d4f' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}
