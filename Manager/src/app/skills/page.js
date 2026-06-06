'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);

  const initialForm = { category: '', items: '', display_order: 0 };
  const [form, setForm] = useState(initialForm);

  useEffect(() => { fetchSkills(); }, []);

  async function fetchSkills() {
    try {
      const q = query(collection(db, 'skills'), orderBy('display_order', 'asc'));
      const snapshot = await getDocs(q);
      setSkills(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) { console.error(e); }
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleEdit(skill) {
    setEditing(skill.id);
    setForm({
      category: skill.category,
      items: Array.isArray(skill.items) ? skill.items.join(', ') : skill.items || '',
      display_order: skill.display_order
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancel() {
    setEditing(null);
    setForm(initialForm);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this skill category?')) return;
    try {
      await deleteDoc(doc(db, 'skills', id));
      showToast('Skill deleted');
      fetchSkills();
    } catch (error) { showToast('Error deleting', 'error'); }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      category: form.category,
      items: form.items.split(',').map(s => s.trim()).filter(Boolean),
      display_order: parseInt(form.display_order) || 0
    };

    try {
      if (editing) {
        await updateDoc(doc(db, 'skills', editing), payload);
        showToast('Skill updated!');
      } else {
        await addDoc(collection(db, 'skills'), payload);
        showToast('Skill added!');
      }
      setForm(initialForm);
      setEditing(null);
      fetchSkills();
    } catch (error) { showToast('Error saving skill', 'error'); }
  }

  return (
    <>
      <div className="page-header">
        <h1>Skills</h1>
        <p>Manage your skill categories and items</p>
      </div>

      <div className="card" style={{ marginBottom: '30px' }}>
        <h2 className="card-title" style={{ marginBottom: '20px' }}>{editing ? 'Edit Skill Category' : 'Add New Category'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Category Name *</label>
              <input required className="form-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="e.g. Languages, AI & ML" />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Order</label>
              <input className="form-input" type="number" value={form.display_order} onChange={e => setForm({...form, display_order: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Skill Items *</label>
            <input required className="form-input" value={form.items} onChange={e => setForm({...form, items: e.target.value})} placeholder="Python, Java, React (comma separated)" />
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary">{editing ? 'Save Changes' : 'Add Category'}</button>
            {editing && <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="card">
        <h2 className="card-title" style={{ marginBottom: '20px' }}>Current Skills</h2>
        <table className="table">
          <thead>
            <tr><th>Order</th><th>Category</th><th>Items</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {skills.map(s => (
              <tr key={s.id}>
                <td>{s.display_order}</td>
                <td><strong>{s.category}</strong></td>
                <td>{Array.isArray(s.items) ? s.items.join(', ') : s.items}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEdit(s)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Edit</button>
                    <button onClick={() => handleDelete(s.id)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem', color: '#ff4d4f', borderColor: '#ff4d4f' }}>Delete</button>
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
