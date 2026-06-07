'use client';

import ScrollReveal from './ScrollReveal';

export default function Skills({ skills }) {
  // Fallback data if Supabase isn't connected yet
  const fallbackSkills = [
    { id: '1', category: 'Languages', items: ['Python', 'Java', 'React', 'Node.js', 'SQL', 'C/C++', 'MATLAB/Simulink'], display_order: 1 },
    { id: '2', category: 'AI & ML', items: ['PyTorch', 'TensorFlow', 'Scikit-Learn', 'OpenCV', 'Hugging Face', 'Graph RAG', 'LangGraph', 'OpenAI Whisper'], display_order: 2 },
    { id: '3', category: 'Core Concepts', items: ['Computer Vision', 'Medical Image Segmentation', 'CNN', 'Agentic Workflows', 'Continual Learning'], display_order: 3 },
    { id: '4', category: 'MLOps & Tools', items: ['Git', 'Jupyter Notebook', 'FastAPI', 'Flask', 'NGINX', 'Mixed-Precision Training', 'CLI'], display_order: 4 },
    { id: '5', category: 'Hardware', items: ['Raspberry Pi', 'ESP32', 'Jetson Orin Nano', 'Arduino'], display_order: 5 },
  ];

  const displaySkills = skills && skills.length > 0 ? skills : fallbackSkills;

  return (
    <section id="skills" className="section">
      <ScrollReveal>
        <span className="section-label">Tech Stack</span>
      </ScrollReveal>
      <ScrollReveal delay={50}>
        <h2 className="section-title">Skills &amp; Technologies</h2>
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <p className="section-subtitle">
          The tools and technologies I work with to build intelligent, production-ready systems.
        </p>
      </ScrollReveal>

      <div className="skills-grid scroll-reveal-stagger">
        {displaySkills.map((category, index) => (
          <ScrollReveal key={category.id || index} delay={index * 80}>
            <div className="skill-category">
              <h3 className="skill-category-title">{category.category}</h3>
              <div className="skill-tags">
                {(category.items || []).map((skill, i) => (
                  <span key={i} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
