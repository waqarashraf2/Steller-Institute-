/**
 * Stellar Institute & Academy — Analytics & Event Tracking Engine
 *
 * Implements strict dataLayer event contract without PII (zero personal user info).
 * Compatible with GTM container: GTM-PKT66JMQ and GA4: G-LQ86LF6VQT.
 */

// Ensure window.dataLayer is initialized safely
if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
}

/**
 * Pushes standard sanitized event to window.dataLayer with complete null-initialized schema
 * to prevent variable leakage between different tag executions in GTM.
 */
export function pushStellarEvent(event, params = {}) {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];

  const currentPath = window.location.pathname;
  const isPaidLanding = currentPath.replace(/\/$/, '') === '/apply' ||
                        currentPath.replace(/\/$/, '') === '/campaign' ||
                        currentPath.replace(/\/$/, '') === '/quick-apply';

  const payload = {
    event,
    page_path: currentPath,
    page_type: isPaidLanding ? 'paid_landing_page' : 'website',
    form_id: null,
    field_name: null,
    field_status: null,
    button_id: null,
    click_location: null,
    submission_method: null,
    error_type: null,
    error_code: null,
    lead_type: null,
    destination_type: null,
    destination_path: null,
    destination_host: null,
    social_platform: null,
    file_type: null,
    scroll_percent: null
  };

  Object.keys(params).forEach(key => {
    if (
      Object.prototype.hasOwnProperty.call(payload, key) &&
      key !== 'event' &&
      key !== 'page_path' &&
      params[key] !== undefined
    ) {
      payload[key] = params[key];
    }
  });

  window.dataLayer.push(payload);
}

/**
 * Fires stellar_page_ready event once after route changes and title updates.
 */
export function trackPageReady(pathname) {
  const isPaidLanding = pathname.replace(/\/$/, '') === '/apply' ||
                        pathname.replace(/\/$/, '') === '/campaign' ||
                        pathname.replace(/\/$/, '') === '/quick-apply';

  pushStellarEvent('stellar_page_ready', {
    page_type: isPaidLanding ? 'paid_landing_page' : 'website'
  });
}

/**
 * Scroll depth tracker (25%, 50%, 75%, 90%) per route visit.
 * Resets on route change.
 */
export function createScrollTracker() {
  const firedThresholds = new Set();
  const thresholds = [25, 50, 75, 90];

  const handleScroll = () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercent = Math.min(100, Math.round((scrollTop / docHeight) * 100));

    thresholds.forEach(t => {
      if (scrollPercent >= t && !firedThresholds.has(t)) {
        firedThresholds.add(t);
        pushStellarEvent('scroll_depth', {
          scroll_percent: t
        });
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}

/**
 * Global delegated click tracking for links, buttons, and social/contact triggers.
 */
export function setupGlobalClickTracking() {
  if (typeof window === 'undefined') return () => {};

  const handleClick = (e) => {
    // Exclude admin pages
    if (window.location.pathname.startsWith('/stellar-admin')) return;

    const target = e.target.closest('a, button, [data-track-id]');
    if (!target) return;

    const explicitTrackId = target.getAttribute('data-track-id');
    const explicitLocation = target.getAttribute('data-track-location');
    const explicitEvent = target.getAttribute('data-track-event');

    // If target is inside a form with submit, avoid firing generic button_click (handled by form events)
    if (target.type === 'submit' || target.closest('form')) {
      if (target.type === 'submit' || target.getAttribute('role') === 'button') {
        // Let form handlers emit form_submit_click
        if (!explicitEvent) return;
      }
    }

    // 1. Explicitly tracked event
    if (explicitEvent) {
      pushStellarEvent(explicitEvent, {
        button_id: explicitTrackId || 'unlabeled_button',
        click_location: explicitLocation || 'page_body'
      });
      return;
    }

    const href = target.getAttribute('href') || '';

    // 2. WhatsApp clicks
    if (href.includes('wa.me') || href.includes('whatsapp.com')) {
      pushStellarEvent('whatsapp_click', {
        button_id: explicitTrackId || 'whatsapp_link',
        click_location: explicitLocation || 'floating_or_content',
        destination_type: 'whatsapp'
      });
      return;
    }

    // 3. Phone (tel:) clicks
    if (href.startsWith('tel:')) {
      pushStellarEvent('phone_click', {
        button_id: explicitTrackId || 'phone_link',
        click_location: explicitLocation || 'contact_info',
        destination_type: 'phone'
      });
      return;
    }

    // 4. Email (mailto:) clicks
    if (href.startsWith('mailto:')) {
      pushStellarEvent('email_click', {
        button_id: explicitTrackId || 'email_link',
        click_location: explicitLocation || 'contact_info',
        destination_type: 'email'
      });
      return;
    }

    // 5. Social platform links
    const socialPlatforms = [
      { name: 'facebook', regex: /facebook\.com/i },
      { name: 'instagram', regex: /instagram\.com/i },
      { name: 'youtube', regex: /youtube\.com/i },
      { name: 'tiktok', regex: /tiktok\.com/i },
      { name: 'linkedin', regex: /linkedin\.com/i }
    ];
    for (const sp of socialPlatforms) {
      if (sp.regex.test(href)) {
        pushStellarEvent('social_click', {
          button_id: explicitTrackId || `${sp.name}_profile_link`,
          click_location: explicitLocation || 'footer_or_header',
          destination_type: 'social',
          social_platform: sp.name
        });
        return;
      }
    }

    // 6. File Downloads
    const fileExtMatch = href.match(/\.(pdf|zip|docx|xlsx|csv|pptx)$/i);
    if (fileExtMatch) {
      pushStellarEvent('file_download_click', {
        button_id: explicitTrackId || 'file_download_link',
        click_location: explicitLocation || 'content_link',
        destination_type: 'download',
        file_type: fileExtMatch[1].toLowerCase()
      });
      return;
    }

    // 7. Internal navigation link vs Outbound external link
    if (target.tagName.toLowerCase() === 'a' && href) {
      if (href.startsWith('/') || href.startsWith('#') || href.includes(window.location.hostname)) {
        try {
          const url = new URL(href, window.location.origin);
          pushStellarEvent('navigation_click', {
            button_id: explicitTrackId || 'nav_link',
            click_location: explicitLocation || 'navigation',
            destination_type: 'internal',
            destination_path: url.pathname
          });
        } catch { /* Continue with the existing fallback. */ }
      } else if (href.startsWith('http://') || href.startsWith('https://')) {
        try {
          const url = new URL(href);
          pushStellarEvent('outbound_click', {
            button_id: explicitTrackId || 'outbound_link',
            click_location: explicitLocation || 'page_content',
            destination_type: 'external',
            destination_host: url.hostname
          });
        } catch { /* Continue with the existing fallback. */ }
      }
      return;
    }

    // 8. Generic button click
    if (target.tagName.toLowerCase() === 'button' || target.getAttribute('role') === 'button') {
      pushStellarEvent('button_click', {
        button_id: explicitTrackId || 'interactive_button',
        click_location: explicitLocation || 'page_content'
      });
    }
  };

  document.addEventListener('click', handleClick, { passive: true });
  return () => {
    document.removeEventListener('click', handleClick);
  };
}
