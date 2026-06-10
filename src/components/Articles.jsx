import { useState, useEffect } from 'react';
import { BookOpen, Calendar, Clock, X } from 'lucide-react';
import articlesData from '../data/articles.json';
import './Articles.css';

export default function Articles() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedArticle(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const parseInlineStyles = (text) => {
    // Escape HTML and replace markdown constructs (**bold** and `code`)
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
      
    return <span dangerouslySetInnerHTML={{ __html: escaped }} />;
  };

  const renderMarkdown = (content) => {
    if (!content) return null;
    
    // Split block by double newlines
    const blocks = content.split('\n\n');
    
    return blocks.map((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // Code blocks
      if (trimmed.startsWith('```')) {
        const lines = trimmed.split('\n');
        const code = lines.slice(1, -1).join('\n');
        return (
          <pre key={idx}>
            <code>{code}</code>
          </pre>
        );
      }

      // Headers
      if (trimmed.startsWith('### ')) {
        return <h3 key={idx}>{parseInlineStyles(trimmed.replace('### ', ''))}</h3>;
      }
      if (trimmed.startsWith('#### ')) {
        return <h4 key={idx}>{parseInlineStyles(trimmed.replace('#### ', ''))}</h4>;
      }

      // Bullet Lists
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed.split('\n').map(item => item.replace(/^[-*]\s+/, ''));
        return (
          <ul key={idx}>
            {items.map((item, itemIdx) => (
              <li key={itemIdx}>{parseInlineStyles(item)}</li>
            ))}
          </ul>
        );
      }

      // Default Paragraph
      return <p key={idx}>{parseInlineStyles(trimmed)}</p>;
    });
  };

  return (
    <section id="articles">
      <h2 className="section-title">Trending Insights</h2>
      <p className="section-subtitle">
        Autonomously generated biweekly analyses covering technical trends in AI, big data transformations, and full-stack system patterns.
      </p>

      <div className="articles-grid">
        {articlesData.map((article) => (
          <div 
            key={article.id} 
            className="glass-card article-card"
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedArticle(article)}
          >
            <div className="article-meta">
              <span className="badge">{article.category}</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={12} /> {article.date}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {article.readTime}
                </span>
              </div>
            </div>
            <h3 className="article-card-title">{article.title}</h3>
            <p className="article-snippet">{article.snippet}</p>
            <button 
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.85rem', width: 'fit-content' }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedArticle(article);
              }}
            >
              Read Article
            </button>
          </div>
        ))}
      </div>

      {/* Modal view for full article */}
      {selectedArticle && (
        <div className="modal-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="modal-content-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-info">
                <span className="badge">{selectedArticle.category}</span>
                <h3>{selectedArticle.title}</h3>
                <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} /> Published: {selectedArticle.date}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} /> {selectedArticle.readTime}
                  </span>
                </div>
              </div>
              <button 
                className="modal-close-btn"
                onClick={() => setSelectedArticle(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body md-content">
              {renderMarkdown(selectedArticle.content)}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
