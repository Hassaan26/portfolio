import { useState } from 'react';
import { Mail, Phone, Copy, Check } from 'lucide-react';
import { Linkedin, Github } from './Icons';
import './Contact.css';

export default function Contact() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const emailAddress = 'hassaan26@gmail.com';
  const phoneNumber = '+92 3454124598';

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'email') {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else {
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
      }
    });
  };

  return (
    <section id="contact">
      <h2 className="section-title">Get In Touch</h2>
      <p className="section-subtitle">
        I'm always open to discussing backend architectures, big data integration, or consulting opportunities.
      </p>

      <div className="contact-container">
        <div className="contact-info">
          {/* Email Card */}
          <div className="glass-card contact-card">
            <div className="contact-detail">
              <div className="contact-icon">
                <Mail size={20} />
              </div>
              <div>
                <div className="contact-text-label">Email Address</div>
                <div className="contact-value">{emailAddress}</div>
              </div>
            </div>
            <button
              className={`copy-btn ${copiedEmail ? 'copied' : ''}`}
              onClick={() => copyToClipboard(emailAddress, 'email')}
              aria-label="Copy email address"
            >
              {copiedEmail ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>

          {/* Phone Card */}
          <div className="glass-card contact-card">
            <div className="contact-detail">
              <div className="contact-icon">
                <Phone size={20} />
              </div>
              <div>
                <div className="contact-text-label">Phone Number</div>
                <div className="contact-value">{phoneNumber}</div>
              </div>
            </div>
            <button
              className={`copy-btn ${copiedPhone ? 'copied' : ''}`}
              onClick={() => copyToClipboard(phoneNumber, 'phone')}
              aria-label="Copy phone number"
            >
              {copiedPhone ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>

          {/* LinkedIn Card */}
          <div className="glass-card contact-card">
            <div className="contact-detail">
              <div className="contact-icon">
                <Linkedin size={20} />
              </div>
              <div>
                <div className="contact-text-label">Professional Network</div>
                <div className="contact-value">linkedin.com/in/hassaan-riaz-093a6651</div>
              </div>
            </div>
            <a
              href="https://www.linkedin.com/in/hassaan-riaz-093a6651/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              Connect
            </a>
          </div>

          {/* GitHub Card */}
          <div className="glass-card contact-card">
            <div className="contact-detail">
              <div className="contact-icon">
                <Github size={20} />
              </div>
              <div>
                <div className="contact-text-label">Open Source Work</div>
                <div className="contact-value">github.com/Hassaan26</div>
              </div>
            </div>
            <a
              href="https://github.com/Hassaan26"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              Follow
            </a>
          </div>
        </div>

        <div className="glass-card contact-message-card">
          <h3>Let's collaborate</h3>
          <p>
            Whether you need assistance setting up distributed ETL pipelines on AWS Glue/EMR, designing custom Django/FastAPI backend APIs, or scaling your general software systems, let's talk about how I can help your team succeed.
          </p>
          <div className="availability-status">
            <div className="status-indicator"></div>
            Currently Open for Freelance & Consultant Projects
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Hassaan Riaz. Built with React.js & Vanilla CSS. All Rights Reserved.</p>
      </footer>
    </section>
  );
}
