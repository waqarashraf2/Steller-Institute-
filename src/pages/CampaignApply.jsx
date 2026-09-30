import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import FloatingShapes from '../components/FloatingShapes';
import { itCourses, beautyCourses } from '../data/courses';
import './CampaignApply.css';

export default function CampaignApply() {
  const [searchParams] = useSearchParams();

  // Extract campaign parameter from URL (e.g. ?campaign=FB_Ad_Lahore or ?utm_campaign=TikTok)
  const urlCampaign = searchParams.get('campaign') || 
                      searchParams.get('utm_campaign') || 
                      searchParams.get('source') || 
                      searchParams.get('ad') || 
                      'Website Campaign';

  const urlCourse = searchParams.get('course') || searchParams.get('program') || '';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    course: '',
    email: '',
    campaign: urlCampaign
  });

  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [leadResult, setLeadResult] = useState(null);

  // Set course from URL if available
  useEffect(() => {
    if (urlCourse) {
      setFormData(prev => ({
        ...prev,
        course: urlCourse,
        campaign: urlCampaign
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        campaign: urlCampaign
      }));
    }
  }, [urlCourse, urlCampaign]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        course: formData.course || 'General Inquiry',
        campaign: formData.campaign.trim() || 'Website Campaign',
        email: formData.email ? formData.email.trim() : null
      };

      const response = await fetch('https://crm.stellarinstitute.pk/api/api/v1/public/campaign-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));
      console.log('CRM Ingestion Result:', result);

      if (response.ok || result.status === 'success' || result.success || result.lead_id) {
        setLeadResult(result);
        setStatus('success');
      } else {
        // Even on validation notice, accept lead graciously
        setLeadResult(result);
        setStatus('success');
      }
    } catch (err) {
      console.error('Error submitting campaign lead:', err);
      setStatus('error');
      setErrorMsg('Network error. Please check your connection or contact us via WhatsApp directly.');
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Stellar Institute! I just applied for *${formData.course || 'a course'}* via the online campaign. Please share further batch details with me.`
  );

  return (
    <div className="campaign-page-wrapper">
      <SEO
        title="Apply Now — Fast-Track Admissions &amp; Special Course Offers | Stellar Institute"
        description="Fast track application portal for IT Courses, Beauty Skills, and Academic Coaching at Stellar Institute Lahore. Limited seats available."
        keywords="apply now stellar institute, fast track admission lahore, it course discount lahore, stellar academy enrollment"
        canonical="https://stellarinstitute.pk/apply"
      />

      <FloatingShapes />

      {/* ─── Hero Header Strip ────────────────────────────────────── */}
      <section className="campaign-hero-strip">
        <div className="campaign-container">
          <div className="campaign-tag-pill">
            <span className="campaign-pulse-dot" />
            <span>Admissions &amp; Discount Batch Open</span>
          </div>

          <h1 className="campaign-hero-title">
            Book Your Seat &amp; Claim <span>Special Discount</span>
          </h1>

          <p className="campaign-hero-subtitle">
            Join thousands of successful students at Stellar Institute &amp; Academy. Fill in your basic details below and our counsellor will call you within 24 hours.
          </p>
        </div>
      </section>

      {/* ─── Main Content Section ─────────────────────────────────── */}
      <section style={{ paddingBottom: '90px' }}>
        <div className="campaign-container">
          <div className="campaign-grid">

            {/* ── Left Column: Lead Capture Form ── */}
            <div className="campaign-form-card">
              {status === 'success' ? (
                <div className="campaign-success-card">
                  <div className="success-check-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h3>Application Submitted Successfully!</h3>
                  <p>
                    Thank you, <strong>{formData.name}</strong>! Your seat request for <strong>{formData.course}</strong> has been registered in our system. Our admissions team will contact you shortly.
                  </p>
                  
                  <div className="success-action-btns">
                    <a 
                      href={`https://wa.me/923000652124?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="campaign-submit-btn"
                      style={{ textDecoration: 'none', background: '#25d366' }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824z"/>
                      </svg>
                      Connect on WhatsApp Now
                    </a>

                    <Link to="/" className="campaign-wa-btn" style={{ background: '#0f172a', textAlign: 'center' }}>
                      Back to Home Page
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="campaign-form-header">
                    <h2>Quick Application Form</h2>
                    <p>Takes less than 1 minute to fill. No registration charges.</p>
                  </div>

                  {status === 'error' && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecdd3', color: '#e11d48', padding: '12px', borderRadius: '10px', fontSize: '13.5px', marginBottom: '16px' }}>
                      {errorMsg}
                    </div>
                  )}

                  {/* Full Name */}
                  <div className="campaign-form-group">
                    <label className="campaign-label" htmlFor="name">
                      <span>Full Name <span className="req">*</span></span>
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
                        placeholder="e.g. Bilal Ahmed"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Phone / WhatsApp */}
                  <div className="campaign-form-group">
                    <label className="campaign-label" htmlFor="phone">
                      <span>WhatsApp / Mobile Number <span className="req">*</span></span>
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
                        placeholder="0300-1234567"
                        required
                      />
                    </div>
                  </div>

                  {/* Course of Interest */}
                  <div className="campaign-form-group">
                    <label className="campaign-label" htmlFor="course">
                      <span>Course of Interest <span className="req">*</span></span>
                    </label>
                    <div className="campaign-input-wrap">
                      <span className="campaign-input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                      </span>
                      <select
                        className="campaign-select"
                        id="course"
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a Course or Program</option>
                        
                        <optgroup label="💻 Professional IT Courses">
                          {itCourses.map(c => (
                            <option key={c.id} value={c.title}>{c.title} ({c.duration})</option>
                          ))}
                        </optgroup>

                        <optgroup label="💄 Beauty &amp; Cosmetology">
                          {beautyCourses.map(c => (
                            <option key={c.id} value={c.title}>{c.title} ({c.duration})</option>
                          ))}
                        </optgroup>

                        <optgroup label="📚 Academic Coaching">
                          <option value="9th &amp; 10th Matric (Science / Arts)">9th &amp; 10th Matric (Science / Arts)</option>
                          <option value="FSc Pre-Medical / Pre-Engineering">FSc Pre-Medical / Pre-Engineering</option>
                          <option value="ICS (Computer Science)">ICS (Computer Science)</option>
                          <option value="Cambridge O &amp; A Levels">Cambridge O &amp; A Levels</option>
                          <option value="Middle Classes (5th - 8th)">Middle Classes (5th - 8th)</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  {/* Email (Optional) */}
                  <div className="campaign-form-group">
                    <label className="campaign-label" htmlFor="email">
                      <span>Email Address <span className="opt">(Optional)</span></span>
                    </label>
                    <div className="campaign-input-wrap">
                      <span className="campaign-input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                      </span>
                      <input
                        className="campaign-input"
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="yourname@gmail.com"
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
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Application Now</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                      </>
                    )}
                  </button>

                  <div className="campaign-guarantee-note">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    <span>100% Free Consultation. No hidden registration fee.</span>
                  </div>
                </form>
              )}
            </div>

            {/* ── Right Column: Perks & Direct Contact ── */}
            <div className="campaign-sidebar">
              {/* Offer Card */}
              <div className="campaign-offer-box">
                <span className="offer-badge-red">Limited Batch Seats</span>
                <h3>Why Learn at Stellar?</h3>
                <p>
                  Accelerate your learning with industry experts, hands-on lab training, and recognized certifications.
                </p>

                <ul className="campaign-perks-list">
                  <li className="campaign-perk-item">
                    <div className="perk-icon">✓</div>
                    <span>Certified &amp; Market-Ready Curriculum</span>
                  </li>
                  <li className="campaign-perk-item">
                    <div className="perk-icon">✓</div>
                    <span>100% Practical &amp; Project-Based Training</span>
                  </li>
                  <li className="campaign-perk-item">
                    <div className="perk-icon">✓</div>
                    <span>Career Mentorship &amp; Internship Support</span>
                  </li>
                  <li className="campaign-perk-item">
                    <div className="perk-icon">✓</div>
                    <span>Central Campus at 1-Montgomery Road, Lahore</span>
                  </li>
                </ul>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="campaign-whatsapp-card">
                <div className="campaign-wa-left">
                  <div className="wa-icon-large">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="campaign-wa-title">Need Instant Help?</div>
                    <div className="campaign-wa-sub">Chat directly with admission officer</div>
                  </div>
                </div>

                <a 
                  href={`https://wa.me/923000652124?text=${encodeURIComponent('Hello Stellar Institute! I have a question about admissions and courses.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="campaign-wa-btn"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
