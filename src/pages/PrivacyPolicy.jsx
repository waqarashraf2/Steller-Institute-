import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import './Pages.css';
import './PrivacyPolicy.css';
import { privacyPolicyHtml } from '../data/privacyPolicyHtml';

export default function PrivacyPolicy() {
  const [content, setContent] = useState(privacyPolicyHtml);

  useEffect(() => {
    let active = true;
    const API = import.meta.env.VITE_API_URL || '/api';

    fetch(`${API}/pages?slug=privacy-policy`)
      .then(response => {
        if (!response.ok) throw new Error('Privacy policy fetch failed');
        return response.json();
      })
      .then(page => {
        if (active && typeof page?.content === 'string') setContent(page.content);
      })
      .catch(() => {
        // Keep the bundled policy available when the CMS cannot be reached.
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="page-container page-content-container">
      <div className="container">
        <h1 className="page-title text-center">Privacy Policy</h1>
        <div className="page-content-box" style={{ padding: '0', overflow: 'hidden' }}>
          <div
            className="rich-text-content google-doc-container"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
            style={{ 
              maxWidth: '100%', 
              overflowX: 'auto',
              backgroundColor: '#fff',
              color: '#000',
              padding: '20px'
            }}
          />
        </div>
      </div>
    </div>
  );
}
