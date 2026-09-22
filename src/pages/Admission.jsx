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

            {/* Right side: Form */}
            <div>
              <ScrollReveal>
                <form className="contact-form" onSubmit={handleSubmit} style={{ padding: '48px', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.04)', borderRadius: '24px' }}>
                  
                  {status === 'success' && (
                    <div className="form-alert form-alert-success">
                      Admission form submitted successfully. We will contact you soon!
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="form-alert form-alert-error">
                      {errorMsg}
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label htmlFor="fullName">Student Name <span style={{ color: '#ef4444' }}>*</span></label>
                        <input type="text" id="fullName" name="fullName" placeholder="Full name" value={formData.fullName} onChange={handleChange} required />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label htmlFor="mobileNumber">Mobile Number <span style={{ color: '#ef4444' }}>*</span></label>
                        <input type="tel" id="mobileNumber" name="mobileNumber" placeholder="+92-300-0000000" value={formData.mobileNumber} onChange={handleChange} required />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label htmlFor="parentName">Parent/Guardian Name <span style={{ color: '#ef4444' }}>*</span></label>
                        <input type="text" id="parentName" name="parentName" placeholder="Parent's name" value={formData.parentName} onChange={handleChange} required />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label htmlFor="parentMobile">Parent Mobile <span style={{ color: '#ef4444' }}>*</span></label>
                        <input type="tel" id="parentMobile" name="parentMobile" placeholder="+92-300-0000000" value={formData.parentMobile} onChange={handleChange} required />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" name="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label htmlFor="classCourse">Select Class / Course <span style={{ color: '#ef4444' }}>*</span></label>
                        <select id="classCourse" name="classCourse" value={formData.classCourse} onChange={handleChange} required>
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

                    {/* CONDITIONAL SUB-COURSE DROPDOWNS */}
                    {formData.classCourse === 'IT Courses' && (
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label htmlFor="specificCourse">Select IT Course <span style={{ color: '#ef4444' }}>*</span></label>
                        <select id="specificCourse" name="specificCourse" value={formData.specificCourse} onChange={handleChange} required>
                          <option value="">Select IT Course</option>
                          {itCourses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                        </select>
                      </div>
                    )}

                    {formData.classCourse === 'Beauty Courses' && (
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label htmlFor="specificCourse">Select Beauty Course <span style={{ color: '#ef4444' }}>*</span></label>
                        <select id="specificCourse" name="specificCourse" value={formData.specificCourse} onChange={handleChange} required>
                          <option value="">Select Beauty Course</option>
                          {beautyCourses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                        </select>
                      </div>
                    )}

                    {formData.classCourse === '5th - 8th Classes' && (
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label htmlFor="specificCourse">Select Class <span style={{ color: '#ef4444' }}>*</span></label>
                        <select id="specificCourse" name="specificCourse" value={formData.specificCourse} onChange={handleChange} required>
                          <option value="">Select Class</option>
                          <option value="5th Class">5th Class</option>
                          <option value="6th Class">6th Class</option>
                          <option value="7th Class">7th Class</option>
                          <option value="8th Class">8th Class</option>
                        </select>
                      </div>
                    )}

                    {(formData.classCourse === 'First Year - I' || formData.classCourse === 'Second Year - II') && (
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label htmlFor="specificCourse">Select Program / Type <span style={{ color: '#ef4444' }}>*</span></label>
                        <select id="specificCourse" name="specificCourse" value={formData.specificCourse} onChange={handleChange} required>
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

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label htmlFor="board">Board</label>
                      <select id="board" name="board" value={formData.board} onChange={handleChange}>
                        <option value="">Select Board</option>
                        <option value="Punjab Board">Punjab Board</option>
                        <option value="Federal Board">Federal Board</option>
                        <option value="Cambridge/O-Level">Cambridge / O-Level</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label htmlFor="message">Message / Questions (Optional)</label>
                      <textarea id="message" name="message" placeholder="Any additional information..." value={formData.message} onChange={handleChange} style={{ minHeight: '120px' }} />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg" 
                    style={{ width: '100%', opacity: status === 'sending' ? 0.7 : 1, marginTop: '24px' }}
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? 'Submitting...' : 'Submit Application →'}
                  </button>
                </form>
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
