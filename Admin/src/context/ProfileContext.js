'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ProfileContext = createContext({});

export function ProfileProvider({ children }) {
  const [activeProfile, setActiveProfile] = useState('profile1');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem('adminActiveProfile');
    if (stored) {
      setActiveProfile(stored);
    }
  }, []);

  const changeProfile = (profileId) => {
    setActiveProfile(profileId);
    localStorage.setItem('adminActiveProfile', profileId);
  };

  if (!isMounted) return null; // Prevent hydration mismatch

  return (
    <ProfileContext.Provider value={{ activeProfile, changeProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
