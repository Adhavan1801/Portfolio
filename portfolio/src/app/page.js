import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import Certifications from '@/components/Certifications';
import Contact from '@/components/Contact';


// Static fallback data — used when Supabase is not connected
const fallbackProfile = {
  name: 'Durai Singam',
  title: 'AI & Data Science',
  tagline: 'Building intelligent systems from architecture to edge deployment',
  about_text: 'AI and Data Science undergraduate at Thoothukudi clg of engineering specialising in end-to-end ML pipeline engineering — from model architecture and training to edge deployment. Core interests span computer vision, natural language processing, Gen AI, embedded AI, and agentic AI workflows.',
  profile_image_url: '/profile.png',
  about_image_url: '/about.png',
  email: 'duraisingam@gmail.com',
  github_url: 'https://github.com/DuraiSingam',
  linkedin_url: 'https://linkedin.com/in/duraisingam',
  resume_url: '#',
  university: 'Thoothukudi clg of engineering',
  degree: 'B.Tech in AIDS',
  graduation_year: 2028,
};

const fallbackProjects = [
  {
    id: '1',
    title: 'House Price Prediction Model',
    short_description: 'A machine learning model to predict house prices based on various features using linear regression.',
    tech_stack: ['Python', 'Scikit-Learn', 'Pandas'],
    filter_category: 'machine-learning',
    github_url: 'https://github.com/DuraiSingam',
    show_github: true,
    show_live_demo: false,
    image_url: '',
  },
  {
    id: '2',
    title: 'Student Attendance System',
    short_description: 'Automated attendance tracking system using OpenCV for facial recognition.',
    tech_stack: ['Python', 'OpenCV', 'SQLite'],
    filter_category: 'computer-vision',
    github_url: 'https://github.com/DuraiSingam',
    show_github: true,
    show_live_demo: false,
    image_url: '',
  },
  {
    id: '3',
    title: 'Sales Data Dashboard',
    short_description: 'Interactive web dashboard built with Streamlit to visualize company sales data and trends.',
    tech_stack: ['Python', 'Streamlit', 'Matplotlib'],
    filter_category: 'data-analysis',
    github_url: 'https://github.com/DuraiSingam',
    show_github: true,
    show_live_demo: false,
    image_url: '',
  },
  {
    id: '4',
    title: 'Sentiment Analysis on Reviews',
    short_description: 'NLP project to classify movie reviews as positive or negative using NLTK and logistic regression.',
    tech_stack: ['Python', 'NLTK', 'Scikit-Learn'],
    filter_category: 'machine-learning',
    github_url: 'https://github.com/DuraiSingam',
    show_github: true,
    show_live_demo: false,
    image_url: '',
  },
  {
    id: '5',
    title: 'Personal Expense Tracker',
    short_description: 'A web application allowing users to log their daily expenses, categorize them, and view monthly spending summaries.',
    tech_stack: ['Python', 'Flask', 'SQLite'],
    filter_category: 'data-analysis',
    github_url: 'https://github.com/DuraiSingam',
    show_github: true,
    show_live_demo: false,
    image_url: '',
  }
];

const fallbackFilterCategories = [
  { id: '1', name: 'Machine Learning', slug: 'machine-learning', display_order: 1 },
  { id: '2', name: 'Data Analysis', slug: 'data-analysis', display_order: 2 },
  { id: '3', name: 'Computer Vision', slug: 'computer-vision', display_order: 3 },
];

const fallbackSkills = [
  { id: '1', category: 'Languages', items: ['Python', 'C/C++', 'SQL', 'HTML/CSS'], display_order: 1 },
  { id: '2', category: 'Libraries & Frameworks', items: ['Pandas', 'NumPy', 'Scikit-Learn', 'OpenCV', 'Matplotlib', 'Streamlit'], display_order: 2 },
  { id: '3', category: 'Core Concepts', items: ['Machine Learning', 'Data Preprocessing', 'Exploratory Data Analysis', 'Data Visualization'], display_order: 3 },
  { id: '4', category: 'Tools', items: ['Git', 'Jupyter Notebook', 'VS Code'], display_order: 4 },
];

const fallbackExperience = [
  {
    id: '1',
    role: 'Data Science Intern',
    company: 'Tech Solutions Inc.',
    location: 'Chennai, India (Remote)',
    start_date: '2025-05-01',
    end_date: '2025-07-31',
    description: 'Assisted in data cleaning, exploratory data analysis, and building basic predictive models for internal tools. Utilized Python, Pandas, and Matplotlib.',
    display_order: 1
  },
  {
    id: '2',
    role: 'Machine Learning Intern',
    company: 'InnovateAI Labs',
    location: 'Bangalore, India (Remote)',
    start_date: '2024-12-01',
    end_date: '2025-01-31',
    description: 'Worked on a web scraping pipeline to collect text data for natural language processing tasks. Built a dashboard using Streamlit to visualize the results.',
    display_order: 2
  }
];

const fallbackCertifications = [
  { id: '1', title: 'Machine Learning for Beginners', issuer: 'Coursera (Andrew Ng)', date: '2025-08-01', display_order: 1 },
  { id: '2', title: 'Python for Data Science', issuer: 'Udemy', date: '2025-01-01', display_order: 2 },
  { id: '3', title: 'Data Analysis with Pandas and Python', issuer: 'DataCamp', date: '2024-11-01', display_order: 3 },
  { id: '4', title: 'Introduction to Artificial Intelligence', issuer: 'IBM', date: '2024-09-01', display_order: 4 },
  { id: '5', title: 'OpenCV Computer Vision Basics', issuer: 'Udemy', date: '2024-08-01', display_order: 5 }
];

export default async function HomePage() {
  // Try fetching from Supabase; fall back to static data
  let profile = fallbackProfile;
  let projects = fallbackProjects;
  let skills = fallbackSkills;
  let experience = fallbackExperience;
  let certifications = fallbackCertifications;
  let filterCategories = fallbackFilterCategories;

  try {
    // Dynamic imports to avoid build errors when env vars aren't set
    if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      const {
        getProfile,
        getProjects,
        getSkills,
        getExperience,
        getCertifications,
        getFilterCategories,
      } = await import('@/lib/firebase');

      const [dbProfile, dbProjects, dbSkills, dbExperience, dbCerts, dbFilters] =
        await Promise.all([
          getProfile(),
          getProjects(),
          getSkills(),
          getExperience(),
          getCertifications(),
          getFilterCategories(),
        ]);

      if (dbProfile) profile = dbProfile;
      if (dbProjects?.length) projects = dbProjects;
      if (dbSkills?.length) skills = dbSkills;
      if (dbExperience?.length) experience = dbExperience;
      if (dbCerts?.length) certifications = dbCerts;
      if (dbFilters?.length) filterCategories = dbFilters;
    }
  } catch (err) {
    console.error('Firebase fetch failed, using fallback data:', err);
  }

  return (
    <>
      {/* Hero stays pinned; subsequent sections scroll over it */}
      <div className="sticky-hero-wrapper">
        <Hero profile={profile} />
      </div>
      <div className="scroll-over-hero">
        <About profile={profile} />
        <Skills skills={skills} />
        <Projects projects={projects} filterCategories={filterCategories} />
        <Experience experience={experience} />
        <Certifications certifications={certifications} />
        <Contact profile={profile} />
      </div>
    </>
  );
}
