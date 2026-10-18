import { useState, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';
import visualsData from '../data/visuals.json';
import './Visuals.css';

export default function Visuals() {
  const [selectedVisual, setSelectedVisual] = useState(null);

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedVisual(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (visualsData.length === 0) return null;

  return (
    <section id="visuals">
      <h2 className="section-title">System Design, Visualized</h2>
      <p className="section-subtitle">
        Lessons from building RAG pipelines, multi-agent workflows, Spark ETL and Python backends, each explained in a
        single picture. A new one every two weeks.
      </p>

      <div className="visuals-grid">
        {visualsData.map((visual) => (
          <button
            key={visual.id}
            className="glass-card visual-card"
            onClick={() => setSelectedVisual(visual)}
            aria-label={`View ${visual.title}`}
          >
            <img src={visual.image} alt={visual.title} loading="lazy" className="visual-thumb" />
            <div className="visual-meta">
              <Calendar size={12} /> {visual.date}
            </div>
            <h3 className="visual-card-title">{visual.title}</h3>
            <p className="visual-subtitle">{visual.subtitle}</p>
          </button>
        ))}
      </div>

      {/* Modal view for the full visual */}
      {selectedVisual && (
        <div className="modal-overlay" onClick={() => setSelectedVisual(null)}>
          <div
            className="modal-content-container"
            role="dialog"
            aria-modal="true"
            aria-label={selectedVisual.title}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-header-info">
                <span className="badge">{selectedVisual.topic}</span>
                <h3>{selectedVisual.title}</h3>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedVisual(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <img src={selectedVisual.image} alt={selectedVisual.title} className="visual-full" />
              {selectedVisual.post.context && (
                <p className="visual-context">{selectedVisual.post.context}</p>
              )}
              <ul className="visual-points">
                {selectedVisual.post.points.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
              <p className="visual-takeaway">💡 {selectedVisual.takeaway}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
