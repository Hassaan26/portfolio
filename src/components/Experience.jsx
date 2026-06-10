import { Briefcase } from 'lucide-react';
import './Experience.css';

export default function Experience() {
  const experiences = [
    {
      role: 'Staff Software Consultant',
      company: '10Pearls',
      location: 'Lahore, Pakistan',
      period: 'Jan 2025 - Present',
      bullets: [
        'Building high-throughput, distributed ETL pipelines using Scala to process and transform large datasets into actionable analytics.',
        'Ensuring robust data persistence, high availability, and query performance by storing and managing pipeline outputs in MongoDB.',
        'Architecting and overseeing distributed data processing workflows on AWS EMR (Elastic MapReduce) clusters and AWS Glue jobs.'
      ],
      tech: ['Scala', 'AWS EMR', 'AWS Glue', 'MongoDB', 'Spark', 'S3', 'Data Engineering']
    },
    {
      role: 'Senior Software Engineer II',
      company: '10Pearls',
      location: 'Lahore, Pakistan',
      period: 'Aug 2022 - Dec 2024',
      bullets: [
        'Contributed to designing and building highly scalable backend system architectures.',
        'Developed performant, secure, and well-documented RESTful APIs in Python using modern backend frameworks.',
        'Collaborated with product teams to translate feature requirements into reliable system capabilities.'
      ],
      tech: ['Python', 'Django', 'FastAPI', 'REST APIs', 'SQL', 'Git', 'Agile']
    },
    {
      role: 'Senior Software Engineer',
      company: 'Rolustech',
      location: 'Lahore, Pakistan',
      period: 'Apr 2021 - Aug 2022',
      bullets: [
        'Designed, engineered, and maintained custom, data-driven web applications.',
        'Developed robust backends using Django and created dynamic, responsive user interfaces using React.js.'
      ],
      tech: ['Python', 'Django', 'React.js', 'JavaScript', 'HTML/CSS', 'PostgreSQL']
    },
    {
      role: 'Software Developer',
      company: 'Mezino Technologies',
      location: 'Lahore, Pakistan',
      period: 'Jul 2016 - Apr 2021',
      bullets: [
        'Built and deployed clean REST APIs, optimized backend database services, and scaled server capacities.',
        'Authored robust and comprehensive BDD (Behavior-Driven Development) test cases to guarantee high test coverage and system reliability.'
      ],
      tech: ['Python', 'Flask', 'REST APIs', 'BDD', 'Pytest', 'Docker', 'PostgreSQL']
    }
  ];

  return (
    <section id="experience">
      <h2 className="section-title">Work Experience</h2>
      <p className="section-subtitle">
        My professional timeline as a software engineer and consultant over the last 10+ years.
      </p>

      <div className="timeline">
        {experiences.map((exp, idx) => (
          <div className="timeline-item" key={idx}>
            <div className="timeline-dot"></div>
            <div className="glass-card timeline-card">
              <div className="timeline-header">
                <div>
                  <h3 className="timeline-role">{exp.role}</h3>
                  <div className="timeline-company">{exp.company} — {exp.location}</div>
                </div>
                <span className="timeline-date">{exp.period}</span>
              </div>
              <ul className="timeline-bullets">
                {exp.bullets.map((bullet, bIdx) => (
                  <li key={bIdx}>{bullet}</li>
                ))}
              </ul>
              <div className="timeline-tech">
                {exp.tech.map((tag, tIdx) => (
                  <span className="tech-tag" key={tIdx}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
