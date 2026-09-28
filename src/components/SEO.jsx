import { useEffect } from 'react';

/**
 * SEO Component for dynamic meta tags, titles, and JSON-LD schema injection.
 * Fully compatible with Vite Single Page Applications (SPA).
 */
export default function SEO({
  title,
  description,
  keywords,
  canonical,
  ogImage = 'https://stellarinstitute.pk/stellar_logo.png',
  ogType = 'website',
  schemaData = null,
}) {
  useEffect(() => {
    // 1. Set Page Title
    const siteTitle = 'Stellar Institute & Academy — Lahore';
    document.title = title ? `${title} | ${siteTitle}` : 'Stellar Institute — Crafting Careers Through Education';

    // 2. Helper to set or create meta tag
    const setMeta = (nameAttr, nameVal, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${nameAttr}="${nameVal}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(nameAttr, nameVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 3. Helper to set or create link tag
    const setLink = (rel, href) => {
      if (!href) return;
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // Primary Meta Tags
    const defaultDesc = 'Stellar Institute & Academy in Lahore offers premier academic schooling (5th-8th, Matric, Intermediate, O/A Levels) and certified IT & professional short courses.';
    const finalDesc = description || defaultDesc;
    setMeta('name', 'description', finalDesc);
    
    const defaultKeywords = 'Stellar Institute, Stellar Academy, IT Courses Lahore, Web Development Course, Matric Coaching, FSc Pre-Medical, ICS Academy, O A Levels Lahore, Certified Courses';
    setMeta('name', 'keywords', keywords || defaultKeywords);
    setMeta('name', 'robots', 'index, follow, max-image-preview:large');

    // Canonical URL
    const finalUrl = canonical || (typeof window !== 'undefined' ? window.location.href : 'https://stellarinstitute.pk');
    setLink('canonical', finalUrl);

    // OpenGraph Meta Tags
    setMeta('property', 'og:title', title ? `${title} | Stellar Institute` : 'Stellar Institute & Academy — Crafting Careers Through Education');
    setMeta('property', 'og:description', finalDesc);
    setMeta('property', 'og:url', finalUrl);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:site_name', 'Stellar Institute & Academy');

    // Twitter Card Tags
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title ? `${title} | Stellar Institute` : 'Stellar Institute & Academy');
    setMeta('name', 'twitter:description', finalDesc);
    setMeta('name', 'twitter:image', ogImage);

    // Inject Schema.org JSON-LD if provided
    let scriptEl = document.getElementById('page-schema-jsonld');
    if (schemaData) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = 'page-schema-jsonld';
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(schemaData);
    } else if (scriptEl) {
      scriptEl.remove();
    }
  }, [title, description, keywords, canonical, ogImage, ogType, schemaData]);

  return null;
}
