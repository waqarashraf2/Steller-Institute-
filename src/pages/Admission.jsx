import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FloatingShapes from '../components/FloatingShapes';
import ScrollReveal from '../components/ScrollReveal';
import SEO from '../components/SEO';
import { itCourses, beautyCourses } from '../data/courses';
import { pushStellarEvent } from '../utils/tracking';
import './Pages.css';
import './Admission.css';

export default function Admission() {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    parentName: '',
    parentMobile: '',
    email: '',
    cnic: '',
    batch_timing: 'Morning',
    expected_joining_date: new Date().toISOString().split('T')[0],
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

    pushStellarEvent('form_submit_attempt', {
      form_id: 'online_admission_form',
      submission_method: 'button'
    });

    const courseSelected = formData.specificCourse
      ? `${formData.classCourse} - ${formData.specificCourse}`
      : (formData.classCourse || 'General Admission');

    const crmPayload = {
      student_name: formData.fullName || '',
      father_name: formData.parentName || '',
      phone: formData.mobileNumber || formData.parentMobile || '',
      cnic: formData.cnic || '',
      batch_timing: formData.batch_timing || 'Morning',
      education_level: formData.board ? `${formData.classCourse} (${formData.board})` : (formData.classCourse || 'Intermediate / Matric'),
      expected_joining_date: formData.expected_joining_date || new Date().toISOString().split('T')[0],
      course_name: courseSelected
    };

    let crmSuccess = false;
    let emailSuccess = false;

    try {
      const response = await fetch('https://crm.stellarinstitute.pk/api/api/v1/public/online-admission', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json' 
        },
        body: JSON.stringify(crmPayload)
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok || data.status === 'success' || data.lead_id) {
        crmSuccess = true;
      }
    } catch (crmErr) {
      console.warn('Direct CRM error, attempting proxy:', crmErr);
      try {
        const response = await fetch('https://stellarinstitute.pk/api/crm-intake.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ form: 'admission', payload: crmPayload })
        });
        const data = await response.json().catch(() => ({}));
        crmSuccess = response.ok && data.success !== false;
      } catch {}
    }

    try {
      const response = await fetch(`https://stellarinstitute.pk/api/admission.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, course_name: courseSelected })
      });
      const data = await response.json().catch(() => ({}));
      emailSuccess = response.ok && data.success === true;
    } catch (phpErr) {
      console.warn('PHP Email notification warning:', phpErr);
    }

    if (crmSuccess || emailSuccess) {
      pushStellarEvent('generate_lead', {
        form_id: 'online_admission_form',
        lead_type: 'admission_inquiry'
      });
    }

    navigate('/admission/thankyou');
  };

  return (
    <>
      <SEO
        title="Online Admission Portal — Academic &amp; Skill Courses Registration"
        description="Apply for academic admission (5th–12th grades, Matric, FSc, ICS) or enroll in certified professional IT &amp; Beauty courses at Stellar Institute Lahore."
        keywords="Admission Stellar Institute, Apply Online Academy Lahore, Matric Admission, FSc Admission Lahore, IT Course Admission"
        canonical="https://stellarinstitute.pk/admission"
      />
      <section className="page-hero relative" style={{ overflow: 'hidden' }}>
        <FloatingShapes />
        <div className="page-hero-content container relative z-10">
          <h1>Admission</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link> <span>/</span> <span>Admission</span>
          </div>
        </div>
      </section>

      <section style={{ padding: '100px 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '60px', alignItems: 'start' }} className="split-layout">
            <style>{`
              @media (min-width: 992px) {
                .split-layout { grid-template-columns: 1fr 1.3fr !important; }
              }
            `}</style>

            {/* ── LEFT: context column ── */}
            <div style={{ position: 'sticky', top: '100px' }}>
              <div className="adm-eyebrow-plain">Apply for Admission</div>
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

            {/* ── RIGHT: admission form ── */}
            <div>
              <ScrollReveal>
                <div className="adm-form">
                  <form className="adm-form-body" onSubmit={handleSubmit}>

                    {status === 'error' && (
                      <div className="adm-error">{errorMsg}</div>
                    )}

                    {/* Student Details */}
                    <div className="adm-fieldset">
                      <div className="adm-section-title">Student details</div>
                      <div className="adm-row">
                        <div className="adm-field">
                          <label className="adm-label" htmlFor="fullName">Full name <span className="req">*</span></label>
                          <input className="adm-input" type="text" id="fullName" name="fullName" placeholder="Student's full name" value={formData.fullName} onChange={handleChange} required />
                        </div>
                        <div className="adm-field">
                          <label className="adm-label" htmlFor="mobileNumber">Mobile number <span className="req">*</span></label>
                          <input className="adm-input" type="tel" id="mobileNumber" name="mobileNumber" placeholder="+92-300-0000000" value={formData.mobileNumber} onChange={handleChange} required />
                        </div>
                      </div>
                      <div className="adm-row-single" style={{ marginTop: '20px' }}>
                        <div className="adm-field">
                          <label className="adm-label" htmlFor="cnic">CNIC / B-Form Number <span className="opt-note">(Optional)</span></label>
                          <input className="adm-input" type="text" id="cnic" name="cnic" placeholder="e.g. 35201-1234567-1" value={formData.cnic} onChange={handleChange} />
                        </div>
                      </div>
                    </div>

                    <hr className="adm-divider" />

                    {/* Parent / Guardian */}
                    <div className="adm-fieldset">
                      <div className="adm-section-title">Parent / Guardian</div>
                      <div className="adm-row">
                        <div className="adm-field">
                          <label className="adm-label" htmlFor="parentName">Father / Guardian name <span className="req">*</span></label>
                          <input className="adm-input" type="text" id="parentName" name="parentName" placeholder="Guardian's full name" value={formData.parentName} onChange={handleChange} required />
                        </div>
                        <div className="adm-field">
                          <label className="adm-label" htmlFor="parentMobile">Contact number <span className="req">*</span></label>
                          <input className="adm-input" type="tel" id="parentMobile" name="parentMobile" placeholder="+92-300-0000000" value={formData.parentMobile} onChange={handleChange} required />
                        </div>
                      </div>
                      <div className="adm-row-single" style={{ marginTop: '20px' }}>
                        <div className="adm-field">
                          <label className="adm-label" htmlFor="email">Email address <span className="opt-note">(Optional)</span></label>
                          <input className="adm-input" type="email" id="email" name="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} />
                        </div>
                      </div>
                    </div>

                    <hr className="adm-divider" />

                    {/* Program of Study */}
                    <div className="adm-fieldset">
                      <div className="adm-section-title">Program of study & Schedule</div>
                      <div className="adm-row">
                        <div className="adm-field">
                          <label className="adm-label" htmlFor="classCourse">Class / Course <span className="req">*</span></label>
                          <select className="adm-select" id="classCourse" name="classCourse" value={formData.classCourse} onChange={handleChange} required>
                            <option value="">Select an option</option>
                            <option value="5th - 8th Classes">5th – 8th Classes</option>
                            <option value="9th Class">9th Class</option>
                            <option value="10th Class">10th Class</option>
                            <option value="First Year - I">First Year (11th)</option>
                            <option value="Second Year - II">Second Year (12th)</option>
                            <option value="IT Courses">IT Courses</option>
                            <option value="Beauty Courses">Beauty Courses</option>
                          </select>
                        </div>
                        <div className="adm-field">
                          <label className="adm-label" htmlFor="board">Board <span className="opt-note">(Optional)</span></label>
                          <select className="adm-select" id="board" name="board" value={formData.board} onChange={handleChange}>
                            <option value="">Select Board</option>
                            <option value="Punjab Board">Punjab Board</option>
                            <option value="Federal Board">Federal Board</option>
                            <option value="Cambridge/O-Level">Cambridge / O-Level</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="adm-row" style={{ marginTop: '20px' }}>
                        <div className="adm-field">
                          <label className="adm-label" htmlFor="batch_timing">Preferred Batch Timing <span className="req">*</span></label>
                          <select className="adm-select" id="batch_timing" name="batch_timing" value={formData.batch_timing} onChange={handleChange}>
                            <option value="Morning">Morning Batch (9:00 AM - 1:00 PM)</option>
                            <option value="Afternoon">Afternoon Batch (1:00 PM - 5:00 PM)</option>
                            <option value="Evening">Evening Batch (5:00 PM - 9:00 PM)</option>
                            <option value="Weekend">Weekend Batch (Sat & Sun)</option>
                            <option value="Flexible">Flexible / Any Timing</option>
                          </select>
                        </div>
                        <div className="adm-field">
                          <label className="adm-label" htmlFor="expected_joining_date">Expected Joining Date <span className="req">*</span></label>
                          <input className="adm-input" type="date" id="expected_joining_date" name="expected_joining_date" value={formData.expected_joining_date} onChange={handleChange} required />
                        </div>
                      </div>

                      {formData.classCourse === 'IT Courses' && (
                        <div className="adm-row-single" style={{ marginTop: '20px' }}>
                          <div className="adm-field">
                            <label className="adm-label" htmlFor="specificCourse">IT Course <span className="req">*</span></label>
                            <select className="adm-select" id="specificCourse" name="specificCourse" value={formData.specificCourse} onChange={handleChange} required>
                              <option value="">Select IT Course</option>
                              {itCourses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                            </select>
                          </div>
                        </div>
                      )}

                      {formData.classCourse === 'Beauty Courses' && (
                        <div className="adm-row-single" style={{ marginTop: '20px' }}>
                          <div className="adm-field">
                            <label className="adm-label" htmlFor="specificCourse">Beauty Course <span className="req">*</span></label>
                            <select className="adm-select" id="specificCourse" name="specificCourse" value={formData.specificCourse} onChange={handleChange} required>
                              <option value="">Select Beauty Course</option>
                              {beautyCourses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                            </select>
                          </div>
                        </div>
                      )}

                      {formData.classCourse === '5th - 8th Classes' && (
                        <div className="adm-row-single" style={{ marginTop: '20px' }}>
                          <div className="adm-field">
                            <label className="adm-label" htmlFor="specificCourse">Grade <span className="req">*</span></label>
                            <select className="adm-select" id="specificCourse" name="specificCourse" value={formData.specificCourse} onChange={handleChange} required>
                              <option value="">Select Class</option>
                              <option value="5th Class">Class 5</option>
                              <option value="6th Class">Class 6</option>
                              <option value="7th Class">Class 7</option>
                              <option value="8th Class">Class 8</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {(formData.classCourse === 'First Year - I' || formData.classCourse === 'Second Year - II') && (
                        <div className="adm-row-single" style={{ marginTop: '20px' }}>
                          <div className="adm-field">
                            <label className="adm-label" htmlFor="specificCourse">Stream <span className="req">*</span></label>
                            <select className="adm-select" id="specificCourse" name="specificCourse" value={formData.specificCourse} onChange={handleChange} required>
                              <option value="">Select Option</option>
                              <option value="FSc Pre-Medical">FSc Pre-Medical</option>
                              <option value="FSc Pre-Engineering">FSc Pre-Engineering</option>
                              <option value="ICS (Mathematics, Computer Science, and Physics)">ICS (Math, Computer, Physics)</option>
                              <option value="ICS (Mathematics, Computer Science, and Statistics)">ICS (Math, Computer, Statistics)</option>
                              <option value="ICS (Mathematics, Computer Science, and Economics)">ICS (Math, Computer, Economics)</option>
                              <option value="I.Com">I.Com</option>
                              <option value="F.A">F.A</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    <hr className="adm-divider" />

                    {/* Remarks */}
                    <div className="adm-fieldset">
                      <div className="adm-section-title">
                        Remarks <span style={{ fontWeight: 400, fontSize: '11px', textTransform: 'none', letterSpacing: 0, color: '#94a3b8' }}>(Optional)</span>
                      </div>
                      <div className="adm-field">
                        <textarea className="adm-textarea" id="message" name="message" placeholder="Any questions or additional notes..." value={formData.message} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="adm-submit-area">
                      <button type="submit" className="adm-submit" disabled={status === 'sending'}>
                        {status === 'sending' ? (
                          <>
                            <svg className="adm-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.2"/><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/></svg>
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <span>Submit Application</span>
                        )}
                      </button>
                      <p className="adm-submit-note">No application fee. Our team will contact you within 24–48 hours.</p>
                    </div>

                  </form>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ===== PROCESS SECTION ===== */}
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
            <div className="process-card">
              <div className="process-number">01</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Submit the Form</h3>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>Fill out the application form above with your child's details.</p>
            </div>
            <div className="process-card">
              <div className="process-number">02</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Counsellor Call</h3>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>Our academic counsellor calls within 24–48 hours to discuss the right class.</p>
            </div>
            <div className="process-card">
              <div className="process-number">03</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Assessment / Interview</h3>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>A short, friendly assessment to confirm placement (where applicable).</p>
            </div>
            <div className="process-card">
              <div className="process-number">04</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Confirm &amp; Enroll</h3>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>Complete documentation and fee submission to secure the seat.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
