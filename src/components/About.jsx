import { GraduationCap, Languages, Cpu, Database, Cloud, Layout } from 'lucide-react';
import './About.css';

export default function About() {
  return (
    <section id="about">
      <h2 className="section-title">About Me</h2>
      <p className="section-subtitle">
        A brief introduction to my professional background, core expertise, and academic credentials.
      </p>

      <div className="about-container">
        <div className="about-text">
          <p>
            I am a highly skilled and adaptive full-stack engineer and consultant with over <strong>10 years of experience</strong> working in fast-paced agile environments. I specialize in engineering end-to-end applications, automating complex business workflows, and deploying intelligent AI solutions featuring RAG pipeline architectures.
          </p>
          <p>
            My core competency lies in architecting scalable server-side environments using <strong>Python (Django & FastAPI)</strong> and building high-volume distributed ETL pipelines in <strong>Scala</strong> on AWS EMR and Glue. I couple these backends with modern AI integrations, automated background workflows, and premium interactive frontend experiences using <strong>React.js</strong>.
          </p>

          <div className="about-highlights">
            <div className="highlight-item">
              <Cpu size={24} className="badge" style={{ padding: '8px', marginBottom: '12px' }} />
              <h4>Backend Engineering</h4>
              <p>Designing performant, scalable server-side systems and secure microservices.</p>
            </div>
            <div className="highlight-item">
              <Database size={24} className="badge" style={{ padding: '8px', marginBottom: '12px' }} />
              <h4>Big Data & ETL</h4>
              <p>Building pipelines using Scala, Apache Spark, and orchestrating on AWS.</p>
            </div>
            <div className="highlight-item">
              <Cloud size={24} className="badge" style={{ padding: '8px', marginBottom: '12px' }} />
              <h4>Cloud & DevOps</h4>
              <p>Deploying infrastructure and workflows on AWS (EMR, Glue) and Docker containerization.</p>
            </div>
            <div className="highlight-item">
              <Layout size={24} className="badge" style={{ padding: '8px', marginBottom: '12px' }} />
              <h4>Frontend Integration</h4>
              <p>Developing rich, interactive single-page web applications with React and Angular.</p>
            </div>
          </div>
        </div>

        <div className="about-side">
          <div className="glass-card side-card">
            <h3>
              <GraduationCap size={20} style={{ color: 'var(--primary-light)' }} /> Education
            </h3>
            <div className="education-item">
              <h4>BS in Computer Science</h4>
              <p className="education-school">Government College University, Lahore</p>
              <a 
                href="https://www.gcu.edu.pk" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="education-link"
              >
                gcu.edu.pk
              </a>
            </div>
          </div>

          <div className="glass-card side-card">
            <h3>
              <Languages size={20} style={{ color: 'var(--accent)' }} /> Languages
            </h3>
            <ul className="lang-list">
              <li className="lang-item">
                <span className="lang-name">English</span>
                <span className="lang-level">Proficient (C2)</span>
              </li>
              <li className="lang-item">
                <span className="lang-name">Urdu</span>
                <span className="lang-level">Native</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
