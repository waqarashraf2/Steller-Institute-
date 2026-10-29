import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import FloatingShapes from '../components/FloatingShapes';
import { pushStellarEvent } from '../utils/tracking';
import './CampaignApply.css';

const FORM_ID = 'apply_admission_inquiry';

export default function CampaignApply() {
  const [searchParams] = useSearchParams();
  const formRef = useRef(null);
  const formElementRef = useRef(null);

  // Tracking state refs (prevent duplicates & track lifecycle)
  const hasFiredFormViewRef = useRef(false);
  const hasFiredFormStartRef = useRef(false);
  const focusedFieldsRef = useRef(new Set());
  const completedFieldsRef = useRef(new Set());
  const debounceTimersRef = useRef({});
  const lastSubmissionMethodRef = useRef('button');
  const leadFiredRef = useRef(false);

  // Extract campaign parameter from URL (e.g. ?campaign=FB_Ad_Lahore or ?utm_campaign=TikTok)
  const urlCampaign = searchParams.get('campaign') ||
                      searchParams.get('utm_campaign') ||
                      searchParams.get('source') ||
                      searchParams.get('ad') ||
                      'Website Campaign';

  const urlLocation = searchParams.get('location') || searchParams.get('area') || searchParams.get('city') || '';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: urlLocation,
    campaign: urlCampaign
  });

  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      location: urlLocation || prev.location,
      campaign: urlCampaign
    }));
  }, [urlLocation, urlCampaign]);

  // Form View Tracking (>= 50% visible, once per route visit)
  useEffect(() => {
    const el = formElementRef.current;
    if (!el || hasFiredFormViewRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5 && !hasFiredFormViewRef.current) {
            hasFiredFormViewRef.current = true;
            pushStellarEvent('form_view', {
              form_id: FORM_ID
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [status]);

  // Map DOM names to safe allowlisted tracking field names
  const getFieldTrackName = (name) => {
    if (name === 'name' || name === 'student_parent_name') return 'student_parent_name';
    if (name === 'phone' || name === 'phone_whatsapp') return 'phone_whatsapp';
    if (name === 'location' || name === 'location_area') return 'location_area';
    return null;
  };

  // Trigger form_start on first non-whitespace input
  const triggerFormStart = () => {
    if (!hasFiredFormStartRef.current) {
      hasFiredFormStartRef.current = true;
      pushStellarEvent('form_start', {
        form_id: FORM_ID
      });
    }
  };

  // Field Focus tracking
  const handleFieldFocus = (fieldKey) => {
    const trackName = getFieldTrackName(fieldKey);
    if (!trackName) return;

    if (!focusedFieldsRef.current.has(trackName)) {
      focusedFieldsRef.current.add(trackName);
      pushStellarEvent('form_field_focus', {
        form_id: FORM_ID,
        field_name: trackName
      });
    }
  };

  // Field Completed tracking (500ms debounce or blur, fires once per field)
  const triggerFieldCompleted = useCallback((fieldKey, value) => {
    const trackName = getFieldTrackName(fieldKey);
    if (!trackName) return;

    if (debounceTimersRef.current[trackName]) {
      clearTimeout(debounceTimersRef.current[trackName]);
      delete debounceTimersRef.current[trackName];
    }

    if (value && typeof value === 'string' && value.trim().length > 0 && !completedFieldsRef.current.has(trackName)) {
      completedFieldsRef.current.add(trackName);
      pushStellarEvent('form_field_completed', {
        form_id: FORM_ID,
        field_name: trackName,
        field_status: 'non_empty'
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Ensure focus event is recorded even if user typed directly or used autofill
    handleFieldFocus(name);

    if (value && value.trim().length > 0) {
      triggerFormStart();

      const trackName = getFieldTrackName(name);
      if (trackName && !completedFieldsRef.current.has(trackName)) {
        if (debounceTimersRef.current[trackName]) {
          clearTimeout(debounceTimersRef.current[trackName]);
        }
        debounceTimersRef.current[trackName] = setTimeout(() => {
          triggerFieldCompleted(name, value);
        }, 500);
      }
    }
  };

  const handleFieldBlur = (e) => {
    const { name, value } = e.target;
    triggerFieldCompleted(name, value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      lastSubmissionMethodRef.current = 'keyboard';
    }
  };

  const handleSubmitClick = () => {
    lastSubmissionMethodRef.current = 'button';
    pushStellarEvent('form_submit_click', {
      form_id: FORM_ID,
      button_id: 'apply_submit',
      click_location: 'apply_form'
    });
  };

  const scrollToForm = () => {
    pushStellarEvent('apply_cta_click', {
      button_id: 'apply_admission_now',
      click_location: 'apply_bottom_cta'
    });
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  /**
   * Stellar CRM - Campaign Lead Ingestion
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionMethod = lastSubmissionMethodRef.current || 'button';

    // Flush pending completed fields
    triggerFieldCompleted('name', formData.name);
    triggerFieldCompleted('phone', formData.phone);
    if (formData.location) {
      triggerFieldCompleted('location', formData.location);
    }

    // Submit Intent
    pushStellarEvent('form_submit_attempt', {
      form_id: FORM_ID,
      submission_method: submissionMethod
    });

    // Client-side Validation Checks
    const trimmedName = formData.name.trim();
    const trimmedPhone = formData.phone.trim();
    let hasValidationError = false;

    if (!trimmedName) {
      hasValidationError = true;
      pushStellarEvent('form_error', {
        form_id: FORM_ID,
        field_name: 'student_parent_name',
        error_type: 'validation',
        error_code: 'required'
      });
    }

    if (!trimmedPhone) {
      hasValidationError = true;
      pushStellarEvent('form_error', {
        form_id: FORM_ID,
        field_name: 'phone_whatsapp',
        error_type: 'validation',
        error_code: 'required'
      });
    } else if (trimmedPhone.replace(/\D/g, '').length < 7) {
      hasValidationError = true;
      pushStellarEvent('form_error', {
        form_id: FORM_ID,
        field_name: 'phone_whatsapp',
        error_type: 'validation',
        error_code: 'invalid_phone'
      });
    }

    if (hasValidationError) {
      setStatus('error');
      setErrorMsg('Please fill in your valid contact information.');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    try {
      const payload = {
        name: trimmedName,
        phone: trimmedPhone,
        location: formData.location ? formData.location.trim() : null,
        course: null,
        campaign: formData.campaign.trim() || 'Website Campaign',
        email: null
      };

      let saveSuccess = false;

      // Try direct CRM endpoint
      try {
        const response = await fetch('https://crm.stellarinstitute.pk/api/api/v1/public/campaign-lead', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        const result = await response.json().catch(() => ({}));
        if (response.ok && result.success !== false && !['error', 'failed', 'failure'].includes(String(result.status || '').toLowerCase())) {
          saveSuccess = true;
        }
      } catch (directErr) {
        console.warn('Direct CRM endpoint error, trying proxy:', directErr);
      }

      // Try proxy if direct failed
      if (!saveSuccess) {
        try {
          const response = await fetch('https://stellarinstitute.pk/api/crm-intake.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ form: 'campaign', payload })
          });
          const result = await response.json().catch(() => ({}));
          if (response.ok && result.success !== false) {
            saveSuccess = true;
          }
        } catch {}
      }

      // Fallback: If both network calls failed
      if (!saveSuccess) {
        pushStellarEvent('form_error', {
          form_id: FORM_ID,
          error_type: 'server',
          error_code: 'save_failed'
        });
        setStatus('error');
        setErrorMsg('We could not save your inquiry at this moment. Please try again or reach out on WhatsApp.');
        return;
      }

      // Fire generate_lead ONLY once upon confirmed backend save
      if (!leadFiredRef.current) {
        leadFiredRef.current = true;
        pushStellarEvent('generate_lead', {
          form_id: FORM_ID,
          lead_type: 'admission_inquiry'
        });
      }

      setStatus('success');
    } catch (err) {
      console.error('Error submitting campaign lead:', err);
      pushStellarEvent('form_error', {
        form_id: FORM_ID,
        error_type: 'network',
        error_code: 'network_failure'
      });
      setStatus('error');
      setErrorMsg('Network issue. Please check your connection or contact our admission office directly.');
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Stellar Academy & Institute! I have submitted an admission inquiry${formData.location ? ` from *${formData.location}*` : ''}. Please share batch details, fee structure, and scholarship criteria with me.`
  );

  return (
    <div className="campaign-page-wrapper">
      <SEO
        title="Admissions Open 2026–27 | Stellar Academy & Institute Lahore"
        description="Give your child the right start for a better future. Admissions open for Classes 5th-8th, Matric, Intermediate, Entry Test & Computer Courses at Stellar Academy & Institute Lahore."
        keywords="stellar academy lahore, admissions open lahore, matric coaching, intermediate coaching lahore, fsc coaching, entry test preparation lahore"
        canonical="https://stellarinstitute.pk/apply"
      />

      <FloatingShapes />

      {/* ─── Hero Section ─────────────────────────────────────────── */}
      <section className="campaign-hero-strip">
        <div className="campaign-container">
          <h1 className="campaign-hero-title">
            Give Your Child the Right Start for a <span>Better Future</span>
          </h1>

          <p className="campaign-hero-subtitle">
            Quality education, experienced teachers, regular testing and a supportive learning environment, all in one place.
          </p>

          <div className="campaign-hero-badges">
            <span className="hero-feature-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              Classes 5th to Intermediate
            </span>
            <span className="hero-feature-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              Board-Focused Preparation
            </span>
            <span className="hero-feature-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              50% Scholarship Available
            </span>
          </div>
        </div>
      </section>

      {/* ─── Form & Special Benefits Section ────────────────────────── */}
      <section className="campaign-main-section" ref={formRef}>
        <div className="campaign-container">
          <div className="campaign-grid">

            {/* ── Left Column: Lead Capture Form ── */}
            <div className="campaign-form-card" ref={formElementRef}>
              {status === 'success' ? (
                <div className="campaign-success-card">
                  <div className="success-check-icon">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h3>Admission Inquiry Submitted!</h3>
                  <p>
                    Thank you, <strong>{formData.name}</strong>! Your inquiry has been received. Our admission team will contact you shortly to guide you regarding batches, fee structure, and scholarships.
                  </p>

                  <div className="success-action-btns">
                    <a
                      href={`https://wa.me/923000652124?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="campaign-submit-btn"
                      style={{ textDecoration: 'none' }}
                      data-track-id="apply_whatsapp_success"
                      data-track-location="apply_success_cta"
                      data-track-event="whatsapp_click"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                      Contact Admission Office
                    </a>

                    <Link to="/" className="campaign-outline-btn" data-track-id="apply_success_home_btn" data-track-location="apply_success_cta">
                      Back to Home Page
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
                  <div className="campaign-form-header">
                    <h2>Interested in Admission?</h2>
                    <p>
                      Fill in your details below. Our admission team will contact you and guide you about classes, fee structure, scholarships and available batches.
                    </p>
                  </div>

                  {status === 'error' && (
                    <div className="campaign-error-alert">
                      {errorMsg}
                    </div>
                  )}

                  {/* Student / Parent Name */}
                  <div className="campaign-form-group">
                    <label className="campaign-label" htmlFor="name">
                      <span>Student / Parent Name <span className="req">*</span></span>
                    </label>
                    <div className="campaign-input-wrap">
                      <span className="campaign-input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      </span>
                      <input
                        className="campaign-input"
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => handleFieldFocus('name')}
                        onClick={() => handleFieldFocus('name')}
                        onBlur={handleFieldBlur}
                        placeholder="Enter your full name"
                        required
                        data-track-field="student_parent_name"
                      />
                    </div>
                  </div>

                  {/* Phone / WhatsApp Number */}
                  <div className="campaign-form-group">
                    <label className="campaign-label" htmlFor="phone">
                      <span>Phone / WhatsApp Number <span className="req">*</span></span>
                    </label>
                    <div className="campaign-input-wrap">
                      <span className="campaign-input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                      </span>
                      <input
                        className="campaign-input"
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => handleFieldFocus('phone')}
                        onClick={() => handleFieldFocus('phone')}
                        onBlur={handleFieldBlur}
                        placeholder="Enter your active contact number"
                        required
                        data-track-field="phone_whatsapp"
                      />
                    </div>
                  </div>

                  {/* Location / Area */}
                  <div className="campaign-form-group">
                    <label className="campaign-label" htmlFor="location">
                      <span>Location / Area <span className="opt">(Optional)</span></span>
                    </label>
                    <div className="campaign-input-wrap">
                      <span className="campaign-input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      </span>
                      <input
                        className="campaign-input"
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        onFocus={() => handleFieldFocus('location')}
                        onClick={() => handleFieldFocus('location')}
                        onBlur={handleFieldBlur}
                        placeholder="Enter your area or location"
                        data-track-field="location_area"
                      />
                    </div>
                  </div>

                  {/* Hidden / Detectable Campaign Tag */}
                  <input type="hidden" name="campaign" value={formData.campaign} />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="campaign-submit-btn"
                    disabled={status === 'submitting'}
                    onClick={handleSubmitClick}
                    data-track-id="apply_submit"
                    data-track-location="apply_form"
                  >
                    {status === 'submitting' ? (
                      <>
                        <svg className="adm-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.2"/><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/></svg>
                        <span>Submitting Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                      </>
                    )}
                  </button>

                  <p className="campaign-disclaimer-text">
                    By submitting this form, you agree to be contacted by the Stellar Academy admission team regarding your inquiry.
                  </p>
                </form>
              )}
            </div>

            {/* ── Right Column: Special Admission Benefits ── */}
            <div className="campaign-sidebar">

              {/* Special Benefits Card */}
              <div className="campaign-benefits-card">
                <div className="benefit-badge-pill">Session 2026–27</div>
                <h3 className="benefits-title">Special Admission Benefits</h3>
                <p className="benefits-sub">
                  Admissions for the <strong>2026–27 session</strong> are now open. Enroll today and avail exclusive privileges:
                </p>

                <div className="benefit-items-list">
                  <div className="benefit-item">
                    <div className="benefit-icon-box">
                      <span className="campaign-icon campaign-icon--percent" aria-hidden="true" />
                    </div>
                    <div className="benefit-text">
                      <h4>50% Discount on Admission Fee</h4>
                      <p>Early bird concession for incoming new students.</p>
                    </div>
                  </div>

                  <div className="benefit-item">
                    <div className="benefit-icon-box">
                      <span className="campaign-icon campaign-icon--award" aria-hidden="true" />
                    </div>
                    <div className="benefit-text">
                      <h4>Scholarships Up to 50%</h4>
                      <p>Merit-based financial aid for high achievers.</p>
                    </div>
                  </div>

                  <div className="benefit-item">
                    <div className="benefit-icon-box">
                      <span className="campaign-icon campaign-icon--chalkboard" aria-hidden="true" />
                    </div>
                    <div className="benefit-text">
                      <h4>Free Demo Class</h4>
                      <p>Experience our teaching methodology before final enrollment.</p>
                    </div>
                  </div>
                </div>

                <div className="benefit-limited-notice">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  <span>Seats in selected classes and batches may be limited.</span>
                </div>
              </div>

              {/* Campus Location Card */}
              <div className="campaign-campus-card">
                <div className="campus-info-header">
                  <div className="campus-pin-icon">
                    <span className="campaign-icon campaign-icon--location" aria-hidden="true" />
                  </div>
                  <div>
                    <h4>Campus Location</h4>
                    <p>Upper Ground Floor, 1-Montgomery Road, Lahore</p>
                  </div>
                </div>
                <div className="campus-phone-row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <span><strong>Admission Helpline:</strong> +92-300-0652124</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ─── Why Choose Stellar Academy? Section ────────────────────── */}
      <section className="campaign-why-section">
        <div className="campaign-container">
          <div className="section-header-center">
            <span className="section-pill-tag">Why Choose Us</span>
            <h2 className="section-title-large">Why Choose Stellar Academy?</h2>
            <p className="section-desc-text">
              At Stellar Academy &amp; Institute, we focus on helping students understand concepts, improve academic performance and prepare confidently for their exams.
            </p>
          </div>

          <div className="why-features-grid">

            {/* Feature 1 */}
            <div className="why-feature-card">
              <div className="feature-icon-wrapper">
                <span className="campaign-icon campaign-icon--chalkboard" aria-hidden="true" />
              </div>
              <h3>Experienced Teachers</h3>
              <p>Learn from qualified and experienced teachers with a strong focus on concept-based learning.</p>
            </div>

            {/* Feature 2 */}
            <div className="why-feature-card">
              <div className="feature-icon-wrapper">
                <span className="campaign-icon campaign-icon--clipboard" aria-hidden="true" />
              </div>
              <h3>Weekly Tests &amp; Progress Tracking</h3>
              <p>Regular tests help students identify weaknesses and improve their preparation throughout the session.</p>
            </div>

            {/* Feature 3 */}
            <div className="why-feature-card">
              <div className="feature-icon-wrapper">
                <span className="campaign-icon campaign-icon--chart" aria-hidden="true" />
              </div>
              <h3>Parent Reporting</h3>
              <p>Parents stay informed about their child's academic progress, attendance, and exam performance.</p>
            </div>

            {/* Feature 4 */}
            <div className="why-feature-card">
              <div className="feature-icon-wrapper">
                <span className="campaign-icon campaign-icon--reader" aria-hidden="true" />
              </div>
              <h3>Board-Focused Preparation</h3>
              <p>Structured preparation, important questions, past paper practice and exam-oriented guidance to help students perform better.</p>
            </div>

            {/* Feature 5 */}
            <div className="why-feature-card why-feature-card-wide">
              <div className="feature-icon-wrapper">
                <span className="campaign-icon campaign-icon--heart" aria-hidden="true" />
              </div>
              <div>
                <h3>Supportive Learning Environment</h3>
                <p>A disciplined and student-friendly environment where students can learn with confidence and personalized attention.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Programs We Offer Section ────────────────────────────── */}
      <section className="campaign-programs-section">
        <div className="campaign-container">
          <div className="section-header-center">
            <span className="section-pill-tag">Academic &amp; Skill Pathways</span>
            <h2 className="section-title-large">Programs We Offer</h2>
            <p className="section-desc-text">
              Comprehensive coaching tailored for all levels of school, college, entry tests, and professional IT skills.
            </p>
          </div>

          <div className="programs-cards-grid">

            {/* Program 1 */}
            <div className="program-box">
              <div className="program-number">01</div>
              <div className="program-icon-badge">
                <span className="campaign-icon campaign-icon--book" aria-hidden="true" />
              </div>
              <h3>Classes 5th–8th</h3>
              <p>Build strong academic concepts and prepare students thoroughly for higher classes and foundation building.</p>
            </div>

            {/* Program 2 */}
            <div className="program-box">
              <div className="program-number">02</div>
              <div className="program-icon-badge">
                <span className="campaign-icon campaign-icon--layers" aria-hidden="true" />
              </div>
              <h3>Matric (9th &amp; 10th)</h3>
              <p>Focused preparation for board examinations with regular testing, complete syllabus revision, and past papers.</p>
            </div>

            {/* Program 3 */}
            <div className="program-box">
              <div className="program-number">03</div>
              <div className="program-icon-badge">
                <span className="campaign-icon campaign-icon--graduation" aria-hidden="true" />
              </div>
              <h3>Intermediate (FSc, ICS, FA)</h3>
              <p>In-depth academic support and exam-focused preparation for college students aiming for top board positions.</p>
            </div>

            {/* Program 4 */}
            <div className="program-box">
              <div className="program-number">04</div>
              <div className="program-icon-badge">
                <span className="campaign-icon campaign-icon--checklist" aria-hidden="true" />
              </div>
              <h3>Entry Test Preparation</h3>
              <p>Structured practice, test tricks, and comprehensive guidance for students preparing for competitive entry tests.</p>
            </div>

            {/* Program 5 */}
            <div className="program-box">
              <div className="program-number">05</div>
              <div className="program-icon-badge">
                <span className="campaign-icon campaign-icon--laptop" aria-hidden="true" />
              </div>
              <h3>Computer Courses</h3>
              <p>Practical computer skills designed for students who want to improve their digital knowledge and career readiness.</p>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Bottom CTA Banner ────────────────────────────────────── */}
      <section className="campaign-cta-banner">
        <div className="campaign-container">
          <div className="cta-banner-content">
            <span className="cta-pill-white">Admissions Open 2026–27</span>
            <h2>Take the First Step Today</h2>
            <p>
              Give your child the academic support, guidance and learning environment they need to move forward with confidence.
            </p>
            <div className="cta-btn-group">
              <button
                onClick={scrollToForm}
                className="cta-primary-btn"
                data-track-id="apply_admission_now"
                data-track-location="apply_bottom_cta"
              >
                Apply for Admission Now
              </button>
              <a
                href={`https://wa.me/923000652124?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-secondary-btn"
                data-track-id="apply_whatsapp"
                data-track-location="apply_bottom_cta"
                data-track-event="whatsapp_click"
              >
                Inquire on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
