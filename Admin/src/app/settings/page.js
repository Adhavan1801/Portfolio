'use client';

import { useState, useEffect } from 'react';
import { useProfile } from '@/context/ProfileContext';

export default function SettingsPage() {
  // The settings page now only displays environment variables and other global settings

  return (
    <>
      <div className="page-header"><h1>Settings</h1><p>Manage Firebase settings</p></div>

      <div className="card">
        <h2 className="card-title" style={{ marginBottom: '16px' }}>Environment Info</h2>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '2' }}>
          <p>Firebase API Key: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Connected' : '❌ Not set'}</p>
          <p>Firebase Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Connected' : '❌ Not set'}</p>
          <p>Firebase Auth Domain: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Connected' : '❌ Not set'}</p>
          <p>Firebase Storage Bucket: {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ Connected' : '❌ Not set'}</p>
        </div>
      </div>
    </>
  );
}
