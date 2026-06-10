'use client';

import { useState, useEffect } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query } from 'firebase/firestore';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { useProfile } from '@/context/ProfileContext';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const { activeProfile } = useProfile();

  const initialForm = {
    title: '', short_description: '', description: '',
    tech_stack: '', filter_category: '',
    github_url: '', live_demo_url: '', image_url: '',
    show_github: true, show_live_demo: false, is_visible: true,
    display_order: 0
  };
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  async function fetchProjects() {
    try {
      const q = query(collection(db, 'projects'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                     .filter(d => (d.profile_id || 'profile1') === activeProfile);
      data.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      setProjects(data);
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchCategories() {
    try {
      const q = query(collection(db, 'filter_categories'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                     .filter(d => (d.profile_id || 'profile1') === activeProfile);
      data.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      setCategories(data);
    } catch (e) {
      console.error(e);
    }
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
      setForm(prev => ({ ...prev, image_url: downloadURL }));
      showToast('Image uploaded successfully!');
    } catch (error) {
      showToast('Error uploading: ' + error.message, 'error');
    } finally {
      setUploading(false);
    }
  }

  function handleEdit(project) {
    setEditing(project.id);
    setForm({
      ...project,
      tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : project.tech_stack || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancel() {
    setEditing(null);
    setForm(initialForm);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this project?')) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
      showToast('Project deleted');
      fetchProjects();
    } catch (error) {
      showToast('Error deleting', 'error');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      tech_stack: form.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
      display_order: parseInt(form.display_order) || 0,
      profile_id: activeProfile
    };
    delete payload.id; // ensure no id inside document

    try {
      if (editing) {
        await updateDoc(doc(db, 'projects', editing), payload);
        showToast('Project updated!');
      } else {
        await addDoc(collection(db, 'projects'), payload);
        showToast('Project added!');
      }
      setForm(initialForm);
      setEditing(null);
      fetchProjects();
    } catch (error) {
      showToast('Error saving project', 'error');
    }
  }

  return (
    <>
      <div className="page-header">
        <h1>Projects</h1>
        <p>Manage your Portfolio projects</p>
      </div>

      <div className="card" style={{ marginBottom: '30px' }}>
        <h2 className="card-title" style={{ marginBottom: '20px' }}>{editing ? 'Edit Project' : 'Add New Project'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input required className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input" value={form.filter_category} onChange={e => setForm({...form, filter_category: e.target.value})}>
                <option value="">None</option>
                {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Short Description *</label>
            <input required className="form-input" value={form.short_description} onChange={e => setForm({...form, short_description: e.target.value})} />
          </div>

          <div className="form-group">
            <label className="form-label">Full Description</label>
            <textarea className="form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>

          <div className="form-group">
            <label className="form-label">Tech Stack</label>
            <input className="form-input" value={form.tech_stack} onChange={e => setForm({...form, tech_stack: e.target.value})} placeholder="React, Python, OpenCV (comma separated)" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <input className="form-input" value={form.github_url} onChange={e => setForm({...form, github_url: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Live Demo URL</label>
              <input className="form-input" value={form.live_demo_url} onChange={e => setForm({...form, live_demo_url: e.target.value})} />
            </div>
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Project Image</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input className="form-input" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} placeholder="URL or upload a file..." />
              <label className="btn btn-secondary" style={{ whiteSpace: 'nowrap', cursor: 'pointer' }}>
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} disabled={uploading} />
              </label>
            </div>
            {form.image_url && <img src={form.image_url} alt="Preview" style={{ height: '60px', marginTop: '10px', borderRadius: '4px' }} />}
          </div>

          <div className="form-row" style={{ marginTop: '20px', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" checked={form.show_github} onChange={e => setForm({...form, show_github: e.target.checked})} /> Show GitHub Link
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" checked={form.show_live_demo} onChange={e => setForm({...form, show_live_demo: e.target.checked})} /> Show Live Demo Link
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" checked={form.is_visible} onChange={e => setForm({...form, is_visible: e.target.checked})} /> Visible on Portfolio
            </label>
            <div className="form-group" style={{ margin: 0, marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label className="form-label" style={{ margin: 0 }}>Order:</label>
              <input className="form-input" type="number" style={{ width: '80px', margin: 0 }} value={form.display_order} onChange={e => setForm({...form, display_order: e.target.value})} />
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary">{editing ? 'Save Changes' : 'Add Project'}</button>
            {editing && <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="card">
        <h2 className="card-title" style={{ marginBottom: '20px' }}>All Projects</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Title</th>
                <th>Category</th>
                <th>Visible</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No projects found.</td></tr>
              ) : (
                projects.map(p => (
                  <tr key={p.id}>
                    <td>{p.display_order}</td>
                    <td><strong>{p.title}</strong></td>
                    <td>{categories.find(c => c.slug === p.filter_category)?.name || p.filter_category}</td>
                    <td>{p.is_visible ? 'Yes' : 'No'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEdit(p)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Edit</button>
                        <button onClick={() => handleDelete(p.id)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem', color: '#ff4d4f', borderColor: '#ff4d4f' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}
