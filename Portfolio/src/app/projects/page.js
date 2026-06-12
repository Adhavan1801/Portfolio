import { Suspense } from 'react';
import ProjectDetailClient from './ProjectDetailClient';

export const revalidate = 60;

const fallbackProjects = [
  {
    id: '1',
    title: 'GhostMTFormer: Dual-Encoder Skin Lesion Segmentation',
    short_description: 'Dual-encoder (GhostNet + dilated CNN) with multi-scale CFCA cross-attention for clinically explainable segmentation.',
    description: 'Dual-encoder (GhostNet + dilated CNN) with multi-scale CFCA cross-attention, XFF bottleneck, BRM boundary refinement, and MC-Dropout for clinically explainable segmentation.\nResult: Dice 94.00%, IoU 89.63%, HD95 3.24px on HAM10000 - 61.74M params.',
    tech_stack: ['PyTorch', 'GhostNet', 'Cross-Attention', 'Grad-CAM'],
    filter_categories: ['computer-vision'],
    github_url: '',
    live_demo_url: '',
    show_github: false,
    show_live_demo: false,
    image_url: '',
  },
  {
    id: '2',
    title: 'GPS-Guided Autonomous Robot for Air Quality Monitoring',
    short_description: 'ESP32 robot with MQ-series sensors streaming georeferenced data to a FastAPI + LightGBM AQI classifier.',
    description: 'ESP32 robot with MQ-series sensors and NEO-6M GPS streaming georeferenced data to a FastAPI + LightGBM AQI classifier visualised on a Leaflet.js heatmap.\nResult: 93.5% 4-class AQI accuracy (macro-F1: 0.93) over a 400m campus loop.',
    tech_stack: ['ESP32', 'FastAPI', 'LightGBM', 'Leaflet.js'],
    filter_categories: ['embedded'],
    github_url: '',
    live_demo_url: '',
    show_github: false,
    show_live_demo: false,
    image_url: '',
  },
];

const fallbackFilterCategories = [
  { id: '1', name: 'Computer Vision', slug: 'computer-vision', display_order: 1 },
  { id: '2', name: 'Embedded', slug: 'embedded', display_order: 2 },
];

export default async function ProjectsPage() {
  let projects = fallbackProjects;
  let filterCategories = fallbackFilterCategories;

  try {
    if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      const { getProjects, getFilterCategories, getSettings } = await import('@/lib/firebase');
      const dbSettings = await getSettings();
      const liveProfile = dbSettings?.published_profile_id || 'profile1';

      const [dbProjects, dbFilters] = await Promise.all([
        getProjects(liveProfile),
        getFilterCategories(liveProfile),
      ]);

      if (dbProjects?.length) projects = dbProjects;
      if (dbFilters?.length) filterCategories = dbFilters;
    }
  } catch (err) {
    console.error('Firebase fetch failed, using fallback data:', err);
  }

  return (
    <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
      <ProjectDetailClient projects={projects} filterCategories={filterCategories} />
    </Suspense>
  );
}
