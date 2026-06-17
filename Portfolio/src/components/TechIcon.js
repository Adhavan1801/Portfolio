import { 
  SiPytorch, 
  SiPython, 
  SiFastapi, 
  SiScikitlearn, 
  SiOpencv, 
  SiStreamlit, 
  SiFlask, 
  SiSqlite,
  SiLeaflet,
  SiEspressif,
  SiReact,
  SiFirebase,
  SiCplusplus,
  SiJavascript,
  SiPandas,
  SiNumpy
} from 'react-icons/si';
import { FiCpu, FiCode, FiDatabase, FiSettings, FiActivity, FiLayers } from 'react-icons/fi';

const iconMap = {
  // Languages & Frameworks
  'pytorch': SiPytorch,
  'python': SiPython,
  'fastapi': SiFastapi,
  'scikit-learn': SiScikitlearn,
  'opencv': SiOpencv,
  'streamlit': SiStreamlit,
  'flask': SiFlask,
  'sqlite': SiSqlite,
  'leaflet.js': SiLeaflet,
  'leaflet': SiLeaflet,
  'esp32': SiEspressif,
  'react': SiReact,
  'next.js': SiReact,
  'firebase': SiFirebase,
  'c/c++': SiCplusplus,
  'c++': SiCplusplus,
  'javascript': SiJavascript,
  'pandas': SiPandas,
  'numpy': SiNumpy,
  
  // Generic / Architecture concepts mapped to Feather icons
  'ghostnet': FiLayers,
  'cross-attention': FiActivity,
  'grad-cam': FiActivity,
  'lightgbm': FiDatabase,
  'smote': FiSettings,
  'gridsearchcv': FiSettings,
  'gru': FiLayers,
  'ddqn': FiActivity,
  'reinforcement learning': FiActivity,
  '3d-cnn': FiLayers,
  'tcn': FiLayers,
  'ewc': FiSettings,
  'jetson orin': FiCpu
};

export default function TechIcon({ tech }) {
  if (!tech) return <FiCode className="tech-icon" />;
  
  const key = tech.toLowerCase().trim();
  const Icon = iconMap[key];
  
  if (Icon) {
    return <Icon className="tech-icon" />;
  }
  
  // Fallback for unknown techs
  if (key.includes('learning') || key.includes('net') || key.includes('cnn')) {
    return <FiLayers className="tech-icon" />;
  }
  
  return <FiCode className="tech-icon" />;
}
