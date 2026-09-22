import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FloatingShapes from '../components/FloatingShapes';
import ScrollReveal from '../components/ScrollReveal';
import { itCourses, beautyCourses } from '../data/courses';
import './Pages.css';

export default function Admission() {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    parentName: '',
    parentMobile: '',
    email: '',
    classCourse: '',
    specificCourse: '',
    board: '',
    message: ''
  });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // If the main course category changes, reset the specific course
    if (name === 'classCourse') {
      setFormData({ ...formData, [name]: value, specificCourse: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch(`https://stellarinstitute.pk/api/admission.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        navigate('/admission/thankyou');
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('Network error. Please check your connection and try again.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <>
      <section className="page-hero relative" style={{ overflow: 'hidden' }}>
        <FloatingShapes />
        <div className="page-hero-content container relative z-10">
          <h1>Admission</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link> <span>/</span> <span>Admission</span>
          </div>
        </div>
      </section>

      {/* ===== FORM SECTION (moved up) ===== */}
      <section style={{ padding: '100px 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          {/* Split Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '60px', alignItems: 'start' }} className="split-layout">
            <style>{`
              @media (min-width: 992px) {
                .split-layout { grid-template-columns: 1fr 1.3fr !important; }
              }
            `}</style>

            {/* Left side: Context */}
            <div style={{ position: 'sticky', top: '100px' }}>
              <div style={{ display: 'inline-block', backgroundColor: 'var(--primary-50)', color: 'var(--primary-light)', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', marginBottom: '20px', fontFamily: 'var(--font-main)' }}>
                Apply for Admission
              </div>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 42px)', fontWeight: '700', color: '#0f172a', marginBottom: '24px', lineHeight: 1.1 }}>
                Tell Us About Your Child
              </h2>
              <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.6, marginBottom: '40px' }}>
                Share a few details below and our admissions team will get in touch to guide you through the rest — class placement, fee structure, and available seats.
              </p>
              
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li className="benefit-item">
                  <div className="benefit-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="benefit-text">No admission fee to apply</span>
                </li>
                <li className="benefit-item">
                  <div className="benefit-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="benefit-text">Free initial counselling session</span>
                </li>
                <li className="benefit-item">
                  <div className="benefit-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="benefit-text">Guidance on the right class or stream</span>
                </li>
                <li className="benefit-item">
                  <div className="benefit-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="benefit-text">Response within 24–48 hours</span>
                </li>
              </ul>
            </div>

            {/* Right side: Modern Admission Portal */}
            <div>
              <ScrollReveal>
                <div className="admission-portal-card">
                  {/* Top Branding Accent Header */}
                  <div className="admission-portal-header">
                    <div className="admission-header-content">
                      <h3>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffd000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                          <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                        </svg>
                        Student Registration Portal
                      </h3>
                      <p>Fill in the accredited details below to apply for admission</p>
                    </div>
                    <div className="admission-session-badge">
                      <span>●</span> Academic Session 2025–26
                    </div>
                  </div>

                  <form className="admission-portal-body" onSubmit={handleSubmit}>
                    {status === 'success' && (
                      <div className="form-alert form-alert-success">
                        ✓ Admission form submitted successfully. We will contact you soon!
                      </div>
                    )}

                    {status === 'error' && (
                      <div className="form-alert form-alert-error">
                        ✕ {errorMsg}
                      </div>
                    )}

                    {/* SECTION 1: Student Profile */}
                    <div className="admission-section-block">
                      <div className="admission-section-title">
                        <span className="admission-step-pill">01</span>
                        <span>Student Information</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                        <div className="admission-field">
                          <label htmlFor="fullName">
                            Student Full Name <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            className="admission-input"
                            placeholder="e.g. Muhammad Ali"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="admission-field">
                          <label htmlFor="mobileNumber">
                            Student / Contact Mobile <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <input
                            type="tel"
                            id="mobileNumber"
                            name="mobileNumber"
                            className="admission-input"
                            placeholder="0300 1234567"
                            value={formData.mobileNumber}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: Parent / Guardian Details */}
                    <div className="admission-section-block">
                      <div className="admission-section-title">
                        <span className="admission-step-pill">02</span>
                        <span>Parent / Guardian Details</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                        <div className="admission-field">
                          <label htmlFor="parentName">
                            Parent / Guardian Name <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <input
                            type="text"
                            id="parentName"
                            name="parentName"
                            className="admission-input"
                            placeholder="e.g. Tariq Mehmood"
                            value={formData.parentName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="admission-field">
                          <label htmlFor="parentMobile">
                            Parent Mobile Number <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <input
                            type="tel"
                            id="parentMobile"
                            name="parentMobile"
                            className="admission-input"
                            placeholder="0321 7654321"
                            value={formData.parentMobile}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3: Academic Program Selection */}
                    <div className="admission-section-block">
                      <div className="admission-section-title">
                        <span className="admission-step-pill">03</span>
                        <span>Program & Academic Stream</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                        <div className="admission-field">
                          <label htmlFor="email">Email Address (Optional)</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            className="admission-input"
                            placeholder="student@example.com"
                            value={formData.email}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="admission-field">
                          <label htmlFor="classCourse">
                            Select Class / Course <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <select
                            id="classCourse"
                            name="classCourse"
                            className="admission-select"
                            value={formData.classCourse}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select an option</option>
                            <option value="5th - 8th Classes">5th - 8th Classes</option>
                            <option value="9th Class">9th Class</option>
                            <option value="10th Class">10th Class</option>
                            <option value="First Year - I">First Year - I</option>
                            <option value="Second Year - II">Second Year - II</option>
                            <option value="IT Courses">IT Courses</option>
                            <option value="Beauty Courses">Beauty Courses</option>
                          </select>
                        </div>
                      </div>

                      {/* Dynamic Sub-Course Dropdowns */}
                      {formData.classCourse === 'IT Courses' && (
                        <div className="admission-field">
                          <label htmlFor="specificCourse">
                            Select IT Specialization <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <select
                            id="specificCourse"
                            name="specificCourse"
                            className="admission-select"
                            value={formData.specificCourse}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Choose IT Course...</option>
                            {itCourses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                          </select>
                        </div>
                      )}

                      {formData.classCourse === 'Beauty Courses' && (
                        <div className="admission-field">
                          <label htmlFor="specificCourse">
                            Select Beauty Specialization <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <select
                            id="specificCourse"
                            name="specificCourse"
                            className="admission-select"
                            value={formData.specificCourse}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Choose Beauty Course...</option>
                            {beautyCourses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                          </select>
                        </div>
                      )}

                      {formData.classCourse === '5th - 8th Classes' && (
                        <div className="admission-field">
                          <label htmlFor="specificCourse">
                            Select Class Level <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <select
                            id="specificCourse"
                            name="specificCourse"
                            className="admission-select"
                            value={formData.specificCourse}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select Class</option>
                            <option value="5th Class">5th Class</option>
                            <option value="6th Class">6th Class</option>
                            <option value="7th Class">7th Class</option>
                            <option value="8th Class">8th Class</option>
                          </select>
                        </div>
                      )}

                      {(formData.classCourse === 'First Year - I' || formData.classCourse === 'Second Year - II') && (
                        <div className="admission-field">
                          <label htmlFor="specificCourse">
                            Select Intermediate Discipline <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <select
                            id="specificCourse"
                            name="specificCourse"
                            className="admission-select"
                            value={formData.specificCourse}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select Option</option>
                            <option value="FSc Pre-Medical">FSc Pre-Medical</option>
                            <option value="FSc Pre-Engineering">FSc Pre-Engineering</option>
                            <option value="ICS (Mathematics, Computer Science, and Physics)">ICS (Mathematics, Computer Science, and Physics)</option>
                            <option value="ICS (Mathematics, Computer Science, and Statistics)">ICS (Mathematics, Computer Science, and Statistics)</option>
                            <option value="ICS (Mathematics, Computer Science, and Economics)">ICS (Mathematics, Computer Science, and Economics)</option>
                            <option value="I.Com">I.Com</option>
                            <option value="F.A">F.A</option>
                          </select>
                        </div>
                      )}

                      <div className="admission-field">
                        <label htmlFor="board">Examination Board (Optional)</label>
                        <select
                          id="board"
                          name="board"
                          className="admission-select"
                          value={formData.board}
                          onChange={handleChange}
                        >
                          <option value="">Select Board</option>
                          <option value="Punjab Board">Punjab Board (BISE Lahore)</option>
                          <option value="Federal Board">Federal Board (FBISE)</option>
                          <option value="Cambridge/O-Level">Cambridge / O-Level</option>
                          <option value="Other">Other / Technical Board</option>
                        </select>
                      </div>

                      <div className="admission-field">
                        <label htmlFor="message">Questions / Special Notes (Optional)</label>
                        <textarea
                          id="message"
                          name="message"
                          className="admission-textarea"
                          placeholder="Tell us about previous school, timing preferences, or specific queries..."
                          value={formData.message}
                          onChange={handleChange}
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Action & Trust Bar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <button 
                        type="submit" 
                        className="admission-submit-btn" 
                        disabled={status === 'sending'}
                      >
                        {status === 'sending' ? (
                          <>
                            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25"></circle>
                              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path>
                            </svg>
                            Submitting Registration...
                          </>
                        ) : (
                          <>
                            <span>Submit Official Application</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                              <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                          </>
                        )}
                      </button>

                      <div className="admission-trust-strip">
                        <span className="admission-trust-item">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                          Accredited Institution
                        </span>
                        <span>•</span>
                        <span className="admission-trust-item">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                          256-Bit Encrypted
                        </span>
                        <span>•</span>
                        <span className="admission-trust-item">
                          Free Counselling
                        </span>
                      </div>
                    </div>
                  </form>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROCESS SECTION (moved below form) ===== */}
      <section style={{ padding: '80px 0', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto 60px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#0f172a', marginBottom: '16px', lineHeight: 1.2 }}>
              Simple process, honest guidance.
            </h2>
            <p style={{ fontSize: '18px', color: '#475569', lineHeight: 1.6 }}>
              Our counsellors are here to help you pick the right class — from Nursery through Intermediate and O/A Level.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '30px' }}>
            {/* Step 1 */}
            <div className="process-card">
              <div className="process-number">01</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Submit the Form</h3>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>Fill out the application form above with your child's details.</p>
            </div>
            {/* Step 2 */}
            <div className="process-card">
              <div className="process-number">02</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Counsellor Call</h3>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>Our academic counsellor calls within 24–48 hours to discuss the right class.</p>
            </div>
            {/* Step 3 */}
            <div className="process-card">
              <div className="process-number">03</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Assessment / Interview</h3>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>A short, friendly assessment to confirm placement (where applicable).</p>
            </div>
            {/* Step 4 */}
            <div className="process-card">
              <div className="process-number">04</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Confirm & Enroll</h3>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>Complete documentation and fee submission to secure the seat.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
