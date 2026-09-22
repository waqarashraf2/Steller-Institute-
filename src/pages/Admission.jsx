import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import { itCourses, beautyCourses } from '../data/courses';
import './Pages.css';
import './Admission.css';

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
        <div className="page-hero-content container relative z-10">
          <h1>Admission</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link> <span>/</span> <span>Admission</span>
          </div>
        </div>
      </section>

      {/* ===== FORM SECTION ===== */}
      <section className="admission-section">
        <div className="container">
          <div className="admission-grid">

            {/* Left side: Context & Institutional Trust */}
            <div className="admission-context">
              <div className="admission-eyebrow">
                <span className="admission-eyebrow-bar"></span>
                <span>Official Admissions Office</span>
              </div>
              <h2 className="admission-title">
                Enroll at Stellar Institute & Academy
              </h2>
              <p className="admission-subtitle">
                Submit your child's admission details below. Our admissions board and academic counsellors review every submission to ensure proper class placement, curriculum alignment, and available seat confirmation.
              </p>
              
              <ul className="admission-benefits-list">
                <li className="admission-benefit-row">
                  <div className="admission-benefit-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div>
                    <div className="admission-benefit-title">No Application or Registration Fee</div>
                    <div className="admission-benefit-desc">Submitting an admission inquiry or registration is completely free of charge.</div>
                  </div>
                </li>
                <li className="admission-benefit-row">
                  <div className="admission-benefit-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div>
                    <div className="admission-benefit-title">Personalized Academic Counseling</div>
                    <div className="admission-benefit-desc">Our experienced counsellors help you select the optimal subject combinations and board.</div>
                  </div>
                </li>
                <li className="admission-benefit-row">
                  <div className="admission-benefit-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div>
                    <div className="admission-benefit-title">Structured Learning & Board Prep</div>
                    <div className="admission-benefit-desc">Matric, Intermediate, O/A Levels, and technical certification programs.</div>
                  </div>
                </li>
                <li className="admission-benefit-row">
                  <div className="admission-benefit-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div>
                    <div className="admission-benefit-title">Prompt Confirmation Within 24–48 Hours</div>
                    <div className="admission-benefit-desc">Our admissions officer will call to confirm test scheduling and seat availability.</div>
                  </div>
                </li>
              </ul>

              <div className="admission-help-card">
                <h4>Admissions Help Desk</h4>
                <p>Have questions about fee structures, timings, or transport? Contact our admissions officer directly.</p>
                <a href="tel:+923000000000" className="admission-helpline-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <span>+92 300 0000000</span>
                </a>
              </div>
            </div>

            {/* Right side: The Structured Admission Form */}
            <div>
              <ScrollReveal>
                <div className="admission-form-card">
                  
                  {/* Form Top Banner */}
                  <div className="admission-form-header">
                    <div className="admission-form-header-main">
                      <h3>Admission Application Form</h3>
                      <p>Please provide authentic student & parent details for official enrollment.</p>
                    </div>
                    <div className="admission-session-badge">
                      Session 2025–2026
                    </div>
                  </div>

                  <div className="admission-form-body">
                    <form onSubmit={handleSubmit}>
                      
                      {status === 'success' && (
                        <div className="form-alert form-alert-success">
                          Admission application submitted successfully. Our admissions office will contact you shortly!
                        </div>
                      )}

                      {status === 'error' && (
                        <div className="form-alert form-alert-error">
                          {errorMsg}
                        </div>
                      )}

                      {/* SECTION 1: APPLICANT DETAILS */}
                      <div className="admission-fieldset">
                        <div className="admission-section-header">
                          <span className="admission-section-num">01</span>
                          <h4 className="admission-section-title">Student Information</h4>
                        </div>
                        <div className="admission-fields-grid two-cols">
                          <div className="admission-field">
                            <label htmlFor="fullName">Student Full Name <span className="req">*</span></label>
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
                            <label htmlFor="mobileNumber">Student Mobile Number <span className="req">*</span></label>
                            <input 
                              type="tel" 
                              id="mobileNumber" 
                              name="mobileNumber" 
                              className="admission-input"
                              placeholder="+92-300-0000000" 
                              value={formData.mobileNumber} 
                              onChange={handleChange} 
                              required 
                            />
                          </div>
                        </div>
                      </div>

                      {/* SECTION 2: PARENT / GUARDIAN DETAILS */}
                      <div className="admission-fieldset">
                        <div className="admission-section-header">
                          <span className="admission-section-num">02</span>
                          <h4 className="admission-section-title">Parent / Guardian Information</h4>
                        </div>
                        <div className="admission-fields-grid two-cols">
                          <div className="admission-field">
                            <label htmlFor="parentName">Parent / Guardian Name <span className="req">*</span></label>
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
                            <label htmlFor="parentMobile">Parent Contact Number <span className="req">*</span></label>
                            <input 
                              type="tel" 
                              id="parentMobile" 
                              name="parentMobile" 
                              className="admission-input"
                              placeholder="+92-300-0000000" 
                              value={formData.parentMobile} 
                              onChange={handleChange} 
                              required 
                            />
                          </div>
                        </div>
                        <div className="admission-fields-grid" style={{ marginTop: '16px' }}>
                          <div className="admission-field">
                            <label htmlFor="email">Email Address <span style={{ color: '#94a3b8', fontWeight: 500 }}>(Optional)</span></label>
                            <input 
                              type="email" 
                              id="email" 
                              name="email" 
                              className="admission-input"
                              placeholder="name@example.com" 
                              value={formData.email} 
                              onChange={handleChange} 
                            />
                          </div>
                        </div>
                      </div>

                      {/* SECTION 3: ACADEMIC PROGRAM SELECTION */}
                      <div className="admission-fieldset">
                        <div className="admission-section-header">
                          <span className="admission-section-num">03</span>
                          <h4 className="admission-section-title">Academic Program & Stream</h4>
                        </div>
                        <div className="admission-fields-grid two-cols">
                          <div className="admission-field">
                            <label htmlFor="classCourse">Select Class / Course <span className="req">*</span></label>
                            <select 
                              id="classCourse" 
                              name="classCourse" 
                              className="admission-select"
                              value={formData.classCourse} 
                              onChange={handleChange} 
                              required
                            >
                              <option value="">Choose Class or Course</option>
                              <option value="5th - 8th Classes">5th - 8th Classes</option>
                              <option value="9th Class">9th Class (Matric Part I)</option>
                              <option value="10th Class">10th Class (Matric Part II)</option>
                              <option value="First Year - I">First Year - 11th (FSc / ICS / I.Com)</option>
                              <option value="Second Year - II">Second Year - 12th (FSc / ICS / I.Com)</option>
                              <option value="IT Courses">IT Professional Courses</option>
                              <option value="Beauty Courses">Beauty & Aesthetic Courses</option>
                            </select>
                          </div>

                          <div className="admission-field">
                            <label htmlFor="board">Examination Board / Affiliation</label>
                            <select 
                              id="board" 
                              name="board" 
                              className="admission-select"
                              value={formData.board} 
                              onChange={handleChange}
                            >
                              <option value="">Select Board (if applicable)</option>
                              <option value="Punjab Board">Punjab Board (BISE)</option>
                              <option value="Federal Board">Federal Board (FBISE)</option>
                              <option value="Cambridge/O-Level">Cambridge / O-Level</option>
                              <option value="Other">Other / Technical Board</option>
                            </select>
                          </div>
                        </div>

                        {/* CONDITIONAL SUB-COURSE DROPDOWNS */}
                        {formData.classCourse === 'IT Courses' && (
                          <div className="admission-fields-grid" style={{ marginTop: '16px' }}>
                            <div className="admission-field">
                              <label htmlFor="specificCourse">Select IT Course <span className="req">*</span></label>
                              <select 
                                id="specificCourse" 
                                name="specificCourse" 
                                className="admission-select"
                                value={formData.specificCourse} 
                                onChange={handleChange} 
                                required
                              >
                                <option value="">Choose IT Course</option>
                                {itCourses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                              </select>
                            </div>
                          </div>
                        )}

                        {formData.classCourse === 'Beauty Courses' && (
                          <div className="admission-fields-grid" style={{ marginTop: '16px' }}>
                            <div className="admission-field">
                              <label htmlFor="specificCourse">Select Beauty Course <span className="req">*</span></label>
                              <select 
                                id="specificCourse" 
                                name="specificCourse" 
                                className="admission-select"
                                value={formData.specificCourse} 
                                onChange={handleChange} 
                                required
                              >
                                <option value="">Choose Beauty Course</option>
                                {beautyCourses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                              </select>
                            </div>
                          </div>
                        )}

                        {formData.classCourse === '5th - 8th Classes' && (
                          <div className="admission-fields-grid" style={{ marginTop: '16px' }}>
                            <div className="admission-field">
                              <label htmlFor="specificCourse">Select Specific Grade <span className="req">*</span></label>
                              <select 
                                id="specificCourse" 
                                name="specificCourse" 
                                className="admission-select"
                                value={formData.specificCourse} 
                                onChange={handleChange} 
                                required
                              >
                                <option value="">Choose Grade</option>
                                <option value="5th Class">Class 5</option>
                                <option value="6th Class">Class 6</option>
                                <option value="7th Class">Class 7</option>
                                <option value="8th Class">Class 8</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {(formData.classCourse === 'First Year - I' || formData.classCourse === 'Second Year - II') && (
                          <div className="admission-fields-grid" style={{ marginTop: '16px' }}>
                            <div className="admission-field">
                              <label htmlFor="specificCourse">Select Academic Stream / Combination <span className="req">*</span></label>
                              <select 
                                id="specificCourse" 
                                name="specificCourse" 
                                className="admission-select"
                                value={formData.specificCourse} 
                                onChange={handleChange} 
                                required
                              >
                                <option value="">Choose Program Stream</option>
                                <option value="FSc Pre-Medical">FSc Pre-Medical (Physics, Chemistry, Biology)</option>
                                <option value="FSc Pre-Engineering">FSc Pre-Engineering (Physics, Chemistry, Math)</option>
                                <option value="ICS (Mathematics, Computer Science, and Physics)">ICS (Math, Computer Science, Physics)</option>
                                <option value="ICS (Mathematics, Computer Science, and Statistics)">ICS (Math, Computer Science, Statistics)</option>
                                <option value="ICS (Mathematics, Computer Science, and Economics)">ICS (Math, Computer Science, Economics)</option>
                                <option value="I.Com">I.Com (Commerce & Accounting)</option>
                                <option value="F.A">F.A (Humanities / Arts)</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* SECTION 4: OPTIONAL MESSAGE */}
                      <div className="admission-fieldset">
                        <div className="admission-section-header">
                          <span className="admission-section-num">04</span>
                          <h4 className="admission-section-title">Additional Inquiries <span style={{ color: '#94a3b8', textTransform: 'none', fontWeight: 500 }}>(Optional)</span></h4>
                        </div>
                        <div className="admission-field">
                          <textarea 
                            id="message" 
                            name="message" 
                            className="admission-textarea"
                            placeholder="Mention any questions regarding class shifts, transport, previous school grades, or fee concessions..." 
                            value={formData.message} 
                            onChange={handleChange} 
                          />
                        </div>
                      </div>

                      {/* SUBMIT BUTTON */}
                      <div className="admission-submit-wrap">
                        <button 
                          type="submit" 
                          className="admission-submit-btn" 
                          disabled={status === 'sending'}
                        >
                          {status === 'sending' ? (
                            <>
                              <svg className="loading-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"></path></svg>
                              <span>Submitting Application...</span>
                            </>
                          ) : (
                            <>
                              <span>Submit Admission Application</span>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </>
                          )}
                        </button>
                        <div className="admission-security-notice">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                          <span>Official application to Stellar Institute. All submitted data is encrypted and confidential.</span>
                        </div>
                      </div>

                    </form>
                  </div>
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
