import { useState, useEffect } from 'react';
import './AnnouncementPopup.css';

export default function AnnouncementPopup() {
  const [announcement, setAnnouncement] = useState(null);
  const [visible, setVisible] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    // Check if already dismissed this session
    const dismissed = JSON.parse(sessionStorage.getItem('dismissed-popups') || '[]');

    const API = import.meta.env.VITE_API_URL || '/api';
    fetch(`${API}/announcements`)
      .then(r => r.json())
      .then(data => {
        // Get popup/both type announcements that haven't been dismissed
        const popupItems = data.filter(
          a => (a.type === 'popup' || a.type === 'both') && !dismissed.includes(a.id)
        );
        if (popupItems.length > 0) {
          // Show after 1 second delay (like KIPS)
          setTimeout(() => {
            setAnnouncement(popupItems[0]);
            setVisible(true);
          }, 1000);
        }
      })
      .catch(() => {});
  }, []);

  const dismiss = () => {
    if (announcement) {
      const dismissed = JSON.parse(sessionStorage.getItem('dismissed-popups') || '[]');
      dismissed.push(announcement.id);
      sessionStorage.setItem('dismissed-popups', JSON.stringify(dismissed));
    }
    setVisible(false);
  };

  const handleClick = () => {
    if (announcement?.link_url) {
      window.open(announcement.link_url, '_blank', 'noopener,noreferrer');
    }
  };

  if (!visible || !announcement) return null;

  return (
    <div className="popup-overlay" onClick={dismiss}>
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>
        {/* Close button — small circle top-right */}
        <button className="popup-close" onClick={dismiss} aria-label="Close">
          ✕
        </button>

        {/* Clickable content */}
        <a
          href={announcement.link_url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="popup-link"
          onClick={(e) => {
            if (!announcement.link_url) {
              e.preventDefault();
            }
          }}
        >
          {/* If image exists — show as the main content (KIPS-style) */}
          {announcement.image_url && !imageFailed ? (
            <img
              src={announcement.image_url}
              alt={announcement.title}
              className="popup-image"
              onError={() => setImageFailed(true)}
            />
          ) : (
            /* Fallback if no image — styled text card */
            <div className="popup-text-card">
              {announcement.priority !== 'normal' && (
                <span className="popup-badge">
                  {announcement.priority === 'urgent' ? 'Urgent' : 'Important'}
                </span>
              )}
              <h3>{announcement.title}</h3>
              {announcement.body && <p>{announcement.body}</p>}
              {announcement.link_url && (
                <span className="popup-cta">
                  {announcement.link_text || 'Learn More'} →
                </span>
              )}
            </div>
          )}
        </a>
      </div>
    </div>
  );
}
