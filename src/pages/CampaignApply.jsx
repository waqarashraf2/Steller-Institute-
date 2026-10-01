import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import FloatingShapes from '../components/FloatingShapes';
import './CampaignApply.css';

export default function CampaignApply() {
  const [searchParams] = useSearchParams();
  const formRef = useRef(null);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  /**
   * Stellar CRM - Campaign Lead Ingestion
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        location: formData.location ? formData.location.trim() : null,
        course: null,
        campaign: formData.campaign.trim() || 'Website Campaign',
        email: null
      };

      let success = false;

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
        if (response.ok || result.status === 'success' || result.success || result.lead_id) {
          success = true;
        }
      } catch (directErr) {
        console.warn('Direct CRM endpoint error, trying proxy:', directErr);
      }

      // Try proxy if direct failed
      if (!success) {
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
            success = true;
          }
        } catch {}
      }

      setStatus('success');
    } catch (err) {
      console.error('Error submitting campaign lead:', err);
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
            <div className="campaign-form-card">
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
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                      Contact Admission Office
                    </a>

                    <Link to="/" className="campaign-outline-btn">
                      Back to Home Page
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
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
                        placeholder="Enter your full name"
                        required
                        autoFocus
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
                        placeholder="Enter your active contact number"
                        required
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
                        placeholder="Enter your area or location"
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
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    </div>
                    <div className="benefit-text">
                      <h4>50% Discount on Admission Fee</h4>
                      <p>Early bird concession for incoming new students.</p>
                    </div>
                  </div>

                  <div className="benefit-item">
                    <div className="benefit-icon-box">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                    </div>
                    <div className="benefit-text">
                      <h4>Scholarships Up to 50%</h4>
                      <p>Merit-based financial aid for high achievers.</p>
                    </div>
                  </div>

                  <div className="benefit-item">
                    <div className="benefit-icon-box">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
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
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3>Experienced Teachers</h3>
              <p>Learn from qualified and experienced teachers with a strong focus on concept-based learning.</p>
            </div>

            {/* Feature 2 */}
            <div className="why-feature-card">
              <div className="feature-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <h3>Weekly Tests &amp; Progress Tracking</h3>
              <p>Regular tests help students identify weaknesses and improve their preparation throughout the session.</p>
            </div>

            {/* Feature 3 */}
            <div className="why-feature-card">
              <div className="feature-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              </div>
              <h3>Parent Reporting</h3>
              <p>Parents stay informed about their child's academic progress, attendance, and exam performance.</p>
            </div>

            {/* Feature 4 */}
            <div className="why-feature-card">
              <div className="feature-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
              </div>
              <h3>Board-Focused Preparation</h3>
              <p>Structured preparation, important questions, past paper practice and exam-oriented guidance to help students perform better.</p>
            </div>

            {/* Feature 5 */}
            <div className="why-feature-card why-feature-card-wide">
              <div className="feature-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              </div>
              <h3>Classes 5th–8th</h3>
              <p>Build strong academic concepts and prepare students thoroughly for higher classes and foundation building.</p>
            </div>

            {/* Program 2 */}
            <div className="program-box">
              <div className="program-number">02</div>
              <div className="program-icon-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
              </div>
              <h3>Matric (9th &amp; 10th)</h3>
              <p>Focused preparation for board examinations with regular testing, complete syllabus revision, and past papers.</p>
            </div>

            {/* Program 3 */}
            <div className="program-box">
              <div className="program-number">03</div>
              <div className="program-icon-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
              </div>
              <h3>Intermediate (FSc, ICS, FA)</h3>
              <p>In-depth academic support and exam-focused preparation for college students aiming for top board positions.</p>
            </div>

            {/* Program 4 */}
            <div className="program-box">
              <div className="program-number">04</div>
              <div className="program-icon-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
              </div>
              <h3>Entry Test Preparation</h3>
              <p>Structured practice, test tricks, and comprehensive guidance for students preparing for competitive entry tests.</p>
            </div>

            {/* Program 5 */}
            <div className="program-box">
              <div className="program-number">05</div>
              <div className="program-icon-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
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
              <button onClick={scrollToForm} className="cta-primary-btn">
                Apply for Admission Now
              </button>
              <a
                href={`https://wa.me/923000652124?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-secondary-btn"
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
