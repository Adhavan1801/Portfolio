'use client';

import { useState, useEffect } from 'react';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { uploadToCloudinary } from '@/lib/cloudinary';

export default function AboutPage() {
  const [profile, setProfile] = useState(null);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    name: '', title: '', tagline: '', about_text: '',
    profile_image_url: '', about_image_url: '', email: '', github_url: '', linkedin_url: '',
    resume_url: '', university: '', degree: '', graduation_year: 2028,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchProfile(); }, []);

  async function fetchProfile() {
    try {
      const docRef = doc(db, 'profile', 'default');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() };
        setProfile(data);
        setForm(data);
      }
    } catch (e) {
      console.error(e);
    }
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleFileUpload(e, field) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const downloadURL = await uploadToCloudinary(file);
      setForm((prev) => ({ ...prev, [field]: downloadURL }));
      showToast('File uploaded successfully!');
    } catch (error) {
      showToast('Error uploading file: ' + error.message, 'error');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { id, ...restForm } = form;
    const payload = { ...restForm, graduation_year: parseInt(form.graduation_year) || 2028 };

    try {
      if (profile) {
        await updateDoc(doc(db, 'profile', 'default'), payload);
      } else {
        await setDoc(doc(db, 'profile', 'default'), payload);
      }
      showToast('Profile saved!');
      fetchProfile();
    } catch (error) {
      showToast('Error saving profile', 'error');
    }
  }

  return (
    <>
      <div className="page-header">
        <h1>About / Profile</h1>
        <p>Edit your personal information and about section content</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: '20px' }}>
          <h2 className="card-title" style={{ marginBottom: '20px' }}>Personal Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Title / Role</label>
              <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="AI & Data Science" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Tagline</label>
            <input className="form-input" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="Building intelligent systems..." />
          </div>
          <div className="form-group">
            <label className="form-label">About Text</label>
            <textarea className="form-textarea" style={{ minHeight: '150px' }} value={form.about_text} onChange={(e) => setForm({ ...form, about_text: e.target.value })} />
          </div>
        </div>

        <div className="card" style={{ marginBottom: '20px' }}>
          <h2 className="card-title" style={{ marginBottom: '20px' }}>Education</h2>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">University</label>
              <input className="form-input" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Degree</label>
              <input className="form-input" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} />
            </div>
          </div>
          <div className="form-group" style={{ maxWidth: '200px' }}>
            <label className="form-label">Graduation Year</label>
            <input className="form-input" type="number" value={form.graduation_year} onChange={(e) => setForm({ ...form, graduation_year: e.target.value })} />
          </div>
        </div>

        <div className="card" style={{ marginBottom: '20px' }}>
          <h2 className="card-title" style={{ marginBottom: '20px' }}>Links & Contact</h2>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Profile Image URL</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input className="form-input" value={form.profile_image_url} onChange={(e) => setForm({ ...form, profile_image_url: e.target.value })} />
                <label className="btn btn-secondary" style={{ whiteSpace: 'nowrap', cursor: 'pointer' }}>
                  {uploading ? 'Uploading...' : 'Upload Image'}
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'profile_image_url')} disabled={uploading} />
                </label>
              </div>
              <span className="form-hint">Used in the Hero section</span>
            </div>
            <div className="form-group">
              <label className="form-label">About Image URL</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input className="form-input" value={form.about_image_url} onChange={(e) => setForm({ ...form, about_image_url: e.target.value })} />
                <label className="btn btn-secondary" style={{ whiteSpace: 'nowrap', cursor: 'pointer' }}>
                  {uploading ? 'Uploading...' : 'Upload Image'}
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'about_image_url')} disabled={uploading} />
                </label>
              </div>
              <span className="form-hint">Used in the About Me section</span>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <input className="form-input" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">LinkedIn URL</label>
              <input className="form-input" value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} />
            </div>
          </div>
          
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Resume / CV</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input className="form-input" value={form.resume_url} onChange={(e) => setForm({ ...form, resume_url: e.target.value })} placeholder="URL or upload a file..." />
              <label className="btn btn-secondary" style={{ whiteSpace: 'nowrap', cursor: 'pointer' }}>
                {uploading ? 'Uploading...' : 'Upload File'}
                <input type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'resume_url')} disabled={uploading} />
              </label>
            </div>
            <span className="form-hint">Upload your resume (PDF recommended) or paste an external URL</span>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Save Profile</button>
      </form>

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}
