import { useState, useEffect } from 'react';
import './AnnouncementTicker.css';

const priorityColor = {
  urgent: '#ef4444',
  important: '#f59e0b',
  normal: '#3b82f6'
};

export default function AnnouncementTicker() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || '/api';
    fetch(`${API}/announcements`)
      .then(r => r.json())
      .then(data => {
        setAnnouncements(Array.isArray(data) ? data : []);
      })
      .catch(() => {});
  }, []);

  if (announcements.length === 0) return null;

  const items = [...announcements, ...announcements];

  return (
    <div className="ticker-strip">
      <div className="ticker-label">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      </div>
      <div className="ticker-track">
        <div className="ticker-content">
          {items.map((a, i) => (
            <span key={i} className="ticker-item">
              {a.link_url ? (
                <a href={a.link_url} target="_blank" rel="noreferrer">
                  <span className="ticker-dot" style={{ background: priorityColor[a.priority] || '#3b82f6' }} /> {a.title}
                </a>
              ) : (
                <span><span className="ticker-dot" style={{ background: priorityColor[a.priority] || '#3b82f6' }} /> {a.title}</span>
              )}
              <span className="ticker-separator">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
