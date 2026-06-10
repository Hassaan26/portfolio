import { ArrowRight, Mail, FileText } from 'lucide-react';
import { Linkedin, Github } from './Icons';
import './Hero.css';

export default function Hero() {
  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="home" className="hero-section animate-fade">
      <div className="hero-content">
        <div className="hero-subtitle">
          <span className="badge">Available for Consultant Roles</span>
        </div>
        <h1 className="hero-title">
          Engineering Scalable Full-Stack Apps &<span>Intelligent Data Workflows</span>
        </h1>
        <p className="hero-description">
          Hi, I'm <strong>Hassaan Riaz</strong>. A Full Stack Engineer and Staff Software Consultant with over 10 years of expertise. I architect high-performance server-side systems, automate business workflows, build intelligent AI applications utilizing RAG pipelines, and design responsive frontends.
        </p>
        <div className="hero-actions">
          <a
            href="#projects"
            className="btn btn-primary"
            onClick={(e) => handleScrollTo(e, 'projects')}
          >
            Explore Projects <ArrowRight size={18} />
          </a>
          <a
            href="#contact"
            className="btn btn-secondary"
            onClick={(e) => handleScrollTo(e, 'contact')}
          >
            Get in Touch <Mail size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/hassaan-riaz-093a6651/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            aria-label="LinkedIn Profile"
          >
            <Linkedin size={18} /> LinkedIn
          </a>
          <a
            href="https://github.com/Hassaan26"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            aria-label="GitHub Profile"
          >
            <Github size={18} /> GitHub
          </a>
        </div>
      </div>
      
      <div className="hero-visual">
        <div className="visual-container">
          <div className="glow-ring"></div>
          <div className="glow-ring-inner">
            <div className="hero-tech-card">
              <h3>10+</h3>
              <p>Years of<br />Experience</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
