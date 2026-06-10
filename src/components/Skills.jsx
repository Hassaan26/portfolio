import { Code, Layout, Cloud, Brain } from 'lucide-react';
import './Skills.css';

export default function Skills() {
  const skillGroups = [
    {
      title: 'Languages',
      icon: <Code size={20} />,
      skills: [
        { name: 'Python', level: '95%', value: 95 },
        { name: 'Scala', level: '85%', value: 85 },
        { name: 'JavaScript', level: '80%', value: 80 },
        { name: 'SQL', level: '90%', value: 90 },
        { name: 'Bash & Scripting', level: '75%', value: 75 }
      ]
    },
    {
      title: 'Web Frameworks',
      icon: <Layout size={20} />,
      skills: [
        { name: 'Django / DRF', level: '95%', value: 95 },
        { name: 'FastAPI', level: '90%', value: 90 },
        { name: 'Flask', level: '80%', value: 80 },
        { name: 'React.js', level: '85%', value: 85 },
        { name: 'Angular.js', level: '70%', value: 70 }
      ]
    },
    {
      title: 'AI, LLMs & RAG',
      icon: <Brain size={20} />,
      skills: [
        { name: 'LangChain / LangGraph', level: '90%', value: 90 },
        { name: 'RAG Pipeline Design', level: '90%', value: 90 },
        { name: 'Vector DBs (pgvector, Chroma)', level: '85%', value: 85 },
        { name: 'OpenAI / Gemini APIs', level: '95%', value: 95 },
        { name: 'Prompt Eng. & Guardrails', level: '85%', value: 85 }
      ]
    },
    {
      title: 'Cloud, DBs & DevOps',
      icon: <Cloud size={20} />,
      skills: [
        { name: 'AWS (EMR, Glue, S3)', level: '85%', value: 85 },
        { name: 'PostgreSQL & MongoDB', level: '90%', value: 90 },
        { name: 'Docker & Kubernetes', level: '80%', value: 80 },
        { name: 'Pytest & BDD Testing', level: '85%', value: 85 },
        { name: 'Git / CI/CD', level: '90%', value: 90 }
      ]
    }
  ];

  return (
    <section id="skills">
      <h2 className="section-title">Technical Skills</h2>
      <p className="section-subtitle">
        A breakdown of my technical stack and expertise across languages, frameworks, cloud platforms, and tools.
      </p>

      <div className="skills-grid">
        {skillGroups.map((group, idx) => (
          <div className="glass-card skills-card" key={idx}>
            <h3 className="skills-card-title">
              <span>{group.icon}</span> {group.title}
            </h3>
            <div className="skills-list">
              {group.skills.map((skill, sIdx) => (
                <div className="skill-item" key={sIdx}>
                  <div className="skill-info">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-level">{skill.level}</span>
                  </div>
                  <div className="skill-bar-bg">
                    <div
                      className="skill-bar-fill"
                      style={{ width: skill.level }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
