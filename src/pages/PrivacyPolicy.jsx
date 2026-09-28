import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
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
        if (active && typeof page?.content === 'string' && page.content.trim()) {
          setContent(page.content);
        }
      })
      .catch(() => {
        // Keep the bundled policy available when the CMS cannot be reached.
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="page-container privacy-policy-page">
      <header className="privacy-policy-hero">
        <div className="privacy-policy-frame">
          <span className="privacy-policy-accent" aria-hidden="true" />
          <h1 className="privacy-policy-title">Privacy Policy</h1>
        </div>
      </header>
      <div className="privacy-policy-frame privacy-policy-body">
        <article className="privacy-policy-paper">
          <div
            className="rich-text-content google-doc-container privacy-policy-copy"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(content, { FORBID_TAGS: ['style'] }),
            }}
          />
        </article>
      </div>
    </div>
  );
}
