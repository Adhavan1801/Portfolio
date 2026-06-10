import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, getDoc, doc, query, orderBy, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'dummy',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'dummy',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'dummy',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'dummy',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'dummy',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'dummy'
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

/* ── Helper fetchers ─────────────────────────────────────────────── */

export async function getProfile(profileId = 'profile1') {
  try {
    const docRef = doc(db, 'profile', profileId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

export async function getProjects(profileId = 'profile1') {
  try {
    const q = query(
      collection(db, 'projects'),
      where('is_visible', '==', true),
      where('profile_id', '==', profileId)
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    return data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getSkills(profileId = 'profile1') {
  try {
    const q = query(
      collection(db, 'skills'),
      where('profile_id', '==', profileId)
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    return data;
  } catch (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
}

export async function getExperience(profileId = 'profile1') {
  try {
    const q = query(
      collection(db, 'experience'),
      where('is_visible', '==', true),
      where('profile_id', '==', profileId)
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    return data;
  } catch (error) {
    console.error('Error fetching experience:', error);
    return [];
  }
}

export async function getCertifications(profileId = 'profile1') {
  try {
    const q = query(
      collection(db, 'certifications'),
      where('is_visible', '==', true),
      where('profile_id', '==', profileId)
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    return data;
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return [];
  }
}

export async function getFilterCategories(profileId = 'profile1') {
  try {
    const q = query(
      collection(db, 'filter_categories'),
      where('profile_id', '==', profileId)
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    return data;
  } catch (error) {
    console.error('Error fetching filter categories:', error);
    return [];
  }
}

export async function getSettings() {
  try {
    const docRef = doc(db, 'settings', 'global');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
}
