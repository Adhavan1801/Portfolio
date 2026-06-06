import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, addDoc, collection, writeBatch } from 'firebase/firestore';

// You must fill these out before running!
const firebaseConfig = {
  apiKey: "AIzaSyC_p9gKybLd9QKaSCcVoTbdnLOI0XOSGqM",
  authDomain: "portfolio-5aa3a.firebaseapp.com",
  projectId: "portfolio-5aa3a",
  storageBucket: "portfolio-5aa3a.firebasestorage.app",
  messagingSenderId: "860219018008",
  appId: "1:860219018008:web:48382b11999b3b6c52ac6d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const profile = {
  name: 'Durai Singam',
  title: 'AI & Data Science',
  tagline: 'Building intelligent systems from architecture to edge deployment',
  about_text: 'AI and Data Science undergraduate at Thoothukudi clg of engineering specialising in end-to-end ML pipeline engineering...',
  profile_image_url: '/profile.png',
  about_image_url: '/about.png',
  email: 'duraisingam@gmail.com',
  github_url: 'https://github.com/DuraiSingam',
  linkedin_url: 'https://linkedin.com/in/duraisingam',
  university: 'Thoothukudi clg of engineering',
  degree: 'B.Tech in AIDS',
  graduation_year: 2028,
};

const projects = [
  {
    title: 'House Price Prediction Model',
    short_description: 'A machine learning model to predict house prices based on various features using linear regression.',
    tech_stack: ['Python', 'Scikit-Learn', 'Pandas'],
    filter_category: 'machine-learning',
    github_url: 'https://github.com/DuraiSingam',
    show_github: true, show_live_demo: false, is_visible: true, display_order: 1
  },
  {
    title: 'Student Attendance System',
    short_description: 'Automated attendance tracking system using OpenCV for facial recognition.',
    tech_stack: ['Python', 'OpenCV', 'SQLite'],
    filter_category: 'computer-vision',
    github_url: 'https://github.com/DuraiSingam',
    show_github: true, show_live_demo: false, is_visible: true, display_order: 2
  }
];

const skills = [
  { category: 'Languages', items: ['Python', 'C/C++', 'SQL', 'HTML/CSS'], display_order: 1 },
  { category: 'Libraries & Frameworks', items: ['Pandas', 'NumPy', 'Scikit-Learn', 'OpenCV', 'Matplotlib'], display_order: 2 }
];

const filter_categories = [
  { name: 'Machine Learning', slug: 'machine-learning', display_order: 1 },
  { name: 'Computer Vision', slug: 'computer-vision', display_order: 2 }
];

async function seed() {
  console.log('Seeding Profile...');
  await setDoc(doc(db, 'profile', 'default'), profile);
  
  console.log('Seeding Filter Categories...');
  for (const cat of filter_categories) {
    await addDoc(collection(db, 'filter_categories'), cat);
  }

  console.log('Seeding Projects...');
  for (const p of projects) {
    await addDoc(collection(db, 'projects'), p);
  }

  console.log('Seeding Skills...');
  for (const s of skills) {
    await addDoc(collection(db, 'skills'), s);
  }

  console.log('Seeding Complete! You can now view your Portfolio.');
  process.exit(0);
}

seed().catch(console.error);
