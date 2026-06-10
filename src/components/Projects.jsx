import { useState } from 'react';
import { Database, ShoppingCart, Cpu, FolderOpen, Truck, Globe } from 'lucide-react';
import './Projects.css';

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'python', label: 'Python & Backend' },
    { id: 'scala', label: 'Scala & Big Data' },
    { id: 'frontend', label: 'Frontend & Fullstack' }
  ];

  const projects = [
    {
      title: 'ETL Pipeline & Data Integration',
      description: 'Built scale-out distributed ETL workflows to process and clean complex medical logs and logistics records.',
      bullets: [
        'Built ETL pipelines using Scala to process healthcare and logistics data.',
        'Orchestrated workflows using AWS EMR clusters and Glue Jobs.',
        'Stored results in MongoDB for analytics and reporting.'
      ],
      icon: <Database size={22} />,
      categories: ['scala', 'data'],
      tags: ['Scala', 'AWS EMR', 'AWS Glue', 'MongoDB', 'Apache Spark', 'S3']
    },
    {
      title: 'Angular E-commerce Application',
      description: 'Developed a responsive and secure online storefront integrating a token-secured API structure.',
      bullets: [
        'Developed Angular frontend integrated with FastAPI backend.',
        'Implemented token-based authentication and clean UI design.'
      ],
      icon: <ShoppingCart size={22} />,
      categories: ['python', 'frontend'],
      tags: ['Angular.js', 'FastAPI', 'JWT', 'REST APIs', 'HTML/CSS']
    },
    {
      title: 'AI-Powered Customer Engagement',
      description: 'Engineered a machine learning service to run sentiment analysis and extract user behavior insights.',
      bullets: [
        'Built a sentiment analysis tool using machine learning.',
        'Processed CSV input data for model training and predictions.'
      ],
      icon: <Cpu size={22} />,
      categories: ['python'],
      tags: ['Python', 'Flask', 'Pandas', 'NLP', 'Unit Testing']
    },
    {
      title: 'Multi-Site File Tracking Application',
      description: 'Designed a document verification and indexing platform mapping system logs with automated visual analytics.',
      bullets: [
        'Created a multi-site document tracking system with analytics.',
        'Deployed on Digital Ocean with AWS static hosting.'
      ],
      icon: <FolderOpen size={22} />,
      categories: ['python'],
      tags: ['Python', 'Django', 'Django REST Framework', 'Docker', 'PostgreSQL']
    },
    {
      title: 'Vehicle Tracking Logistics System',
      description: 'Built a real-time monitor panel monitoring geo-locations and logistics efficiency for construction fleets.',
      bullets: [
        'Built a monitoring application for construction vehicle logistics.',
        'Implemented comprehensive BDD test suites to ensure system accuracy.'
      ],
      icon: <Truck size={22} />,
      categories: ['python'],
      tags: ['Python', 'Django', 'Django REST Framework', 'Docker', 'BDD']
    },
    {
      title: 'Web Scraping Microservice',
      description: 'Constructed an automated scraping pipeline using AI extractors and distributed processing nodes.',
      bullets: [
        'Developed an intelligent data scraping service enhanced with AI.',
        'Delivered structured insights using GCP cloud services.'
      ],
      icon: <Globe size={22} />,
      categories: ['python'],
      tags: ['FastAPI', 'Django', 'PostgreSQL', 'Google Cloud', 'Pytest']
    }
  ];

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.categories.includes(activeFilter));

  return (
    <section id="projects">
      <h2 className="section-title">Featured Projects</h2>
      <p className="section-subtitle">
        A selected showcase of pipelines, platforms, and applications I have engineered.
      </p>

      <div className="filter-container">
        {filters.map(filter => (
          <button
            key={filter.id}
            className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="projects-grid">
        {filteredProjects.map((project, idx) => (
          <div className="glass-card project-card" key={idx}>
            <div className="project-icon">
              {project.icon}
            </div>
            <h3 className="project-title">{project.title}</h3>
            <p className="project-description">{project.description}</p>
            <ul className="project-bullets">
              {project.bullets.map((bullet, bIdx) => (
                <li key={bIdx}>{bullet}</li>
              ))}
            </ul>
            <div className="project-tags">
              {project.tags.map((tag, tIdx) => (
                <span className="project-tag" key={tIdx}>{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
