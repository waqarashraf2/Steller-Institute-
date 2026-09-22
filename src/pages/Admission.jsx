import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FloatingShapes from '../components/FloatingShapes';
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
          <h1>Admission Application</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link> <span>/</span> <span>Admission</span>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="admission-section">
        <div className="container">
          <div className="admission-wrapper">

            {/* Left info strip — visible on wide screens */}
            <div className="admission-info">
              <div className="admission-info-block">
                <h4>Session</h4>
                <p>2025 – 2026</p>
                <small>Admissions open now</small>
              </div>
              <div className="admission-info-block">
                <h4>Admissions Office</h4>
                <p>+92 300 0000000</p>
                <small>Mon – Sat, 9am – 5pm</small>
              </div>
              <div className="admission-info-block">
                <h4>Response Time</h4>
                <p>24 – 48 hours</p>
                <small>A counsellor will call to confirm</small>
              </div>
              <p className="admission-info-note">
                Submitting this form is free. No registration fee is charged at the application stage.
              </p>
            </div>

            <ScrollReveal>
              <div className="admission-card">
                <div className="admission-card-header">
                  <h2>Student Admission Form</h2>
                  <p>Fill in the details below to apply for admission.</p>
                </div>

                <div className="admission-card-body">
                  <form onSubmit={handleSubmit}>
                    {status === 'error' && (
                      <div className="form-alert form-alert-error">
                        {errorMsg}
                      </div>
                    )}

                    {/* Student Details */}
                    <div className="admission-group">
                      <h3 className="admission-group-title">Student Details</h3>
                      <div className="admission-row">
                        <div className="admission-field">
                          <label htmlFor="fullName">Full Name <span className="req">*</span></label>
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            className="admission-input"
                            placeholder="Student full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="admission-field">
                          <label htmlFor="mobileNumber">Mobile Number <span className="req">*</span></label>
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

                    {/* Parent / Guardian */}
                    <div className="admission-group">
                      <h3 className="admission-group-title">Parent or Guardian Details</h3>
                      <div className="admission-row">
                        <div className="admission-field">
                          <label htmlFor="parentName">Father or Guardian Name <span className="req">*</span></label>
                          <input
                            type="text"
                            id="parentName"
                            name="parentName"
                            className="admission-input"
                            placeholder="Father or guardian name"
                            value={formData.parentName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="admission-field">
                          <label htmlFor="parentMobile">Contact Number <span className="req">*</span></label>
                          <input
                            type="tel"
                            id="parentMobile"
                            name="parentMobile"
                            className="admission-input"
                            placeholder="0300 1234567"
                            value={formData.parentMobile}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="admission-field" style={{ marginTop: '16px' }}>
                        <label htmlFor="email">Email Address <span className="opt">(Optional)</span></label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="admission-input"
                          placeholder="email@example.com"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Program */}
                    <div className="admission-group">
                      <h3 className="admission-group-title">Program of Study</h3>
                      <div className="admission-row">
                        <div className="admission-field">
                          <label htmlFor="classCourse">Class or Course <span className="req">*</span></label>
                          <select
                            id="classCourse"
                            name="classCourse"
                            className="admission-select"
                            value={formData.classCourse}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select class or course</option>
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
                          <label htmlFor="board">Board <span className="opt">(Optional)</span></label>
                          <select
                            id="board"
                            name="board"
                            className="admission-select"
                            value={formData.board}
                            onChange={handleChange}
                          >
                            <option value="">Select board</option>
                            <option value="Punjab Board">Punjab Board (BISE)</option>
                            <option value="Federal Board">Federal Board (FBISE)</option>
                            <option value="Cambridge/O-Level">Cambridge / O-Level</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      {formData.classCourse === 'IT Courses' && (
                        <div className="admission-field" style={{ marginTop: '16px' }}>
                          <label htmlFor="specificCourse">Select IT Course <span className="req">*</span></label>
                          <select
                            id="specificCourse"
                            name="specificCourse"
                            className="admission-select"
                            value={formData.specificCourse}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select IT course</option>
                            {itCourses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                          </select>
                        </div>
                      )}

                      {formData.classCourse === 'Beauty Courses' && (
                        <div className="admission-field" style={{ marginTop: '16px' }}>
                          <label htmlFor="specificCourse">Select Beauty Course <span className="req">*</span></label>
                          <select
                            id="specificCourse"
                            name="specificCourse"
                            className="admission-select"
                            value={formData.specificCourse}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select beauty course</option>
                            {beautyCourses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                          </select>
                        </div>
                      )}

                      {formData.classCourse === '5th - 8th Classes' && (
                        <div className="admission-field" style={{ marginTop: '16px' }}>
                          <label htmlFor="specificCourse">Select Grade <span className="req">*</span></label>
                          <select
                            id="specificCourse"
                            name="specificCourse"
                            className="admission-select"
                            value={formData.specificCourse}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select grade</option>
                            <option value="5th Class">Class 5</option>
                            <option value="6th Class">Class 6</option>
                            <option value="7th Class">Class 7</option>
                            <option value="8th Class">Class 8</option>
                          </select>
                        </div>
                      )}

                      {(formData.classCourse === 'First Year - I' || formData.classCourse === 'Second Year - II') && (
                        <div className="admission-field" style={{ marginTop: '16px' }}>
                          <label htmlFor="specificCourse">Select Stream <span className="req">*</span></label>
                          <select
                            id="specificCourse"
                            name="specificCourse"
                            className="admission-select"
                            value={formData.specificCourse}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select stream</option>
                            <option value="FSc Pre-Medical">FSc Pre-Medical</option>
                            <option value="FSc Pre-Engineering">FSc Pre-Engineering</option>
                            <option value="ICS (Mathematics, Computer Science, and Physics)">ICS (Math, Physics, Computer)</option>
                            <option value="ICS (Mathematics, Computer Science, and Statistics)">ICS (Math, Statistics, Computer)</option>
                            <option value="ICS (Mathematics, Computer Science, and Economics)">ICS (Math, Economics, Computer)</option>
                            <option value="I.Com">I.Com</option>
                            <option value="F.A">F.A</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Remarks */}
                    <div className="admission-group">
                      <h3 className="admission-group-title">Remarks <span className="opt">(Optional)</span></h3>
                      <div className="admission-field">
                        <textarea
                          id="message"
                          name="message"
                          className="admission-textarea"
                          placeholder="Any questions or remarks..."
                          value={formData.message}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="admission-submit-wrap">
                      <button
                        type="submit"
                        className="admission-submit-btn"
                        disabled={status === 'sending'}
                      >
                        {status === 'sending' ? (
                          <>
                            <svg className="loading-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"></path></svg>
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <span>Submit Application</span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Process Cards */}
      <section style={{ padding: '40px 0 72px', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div style={{ maxWidth: '700px', margin: '0 auto 52px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#0f172a', marginBottom: '14px', lineHeight: 1.2 }}>
              How the process works
            </h2>
            <p style={{ fontSize: '17px', color: '#475569', lineHeight: 1.6 }}>
              Our counsellors are here to help you pick the right class — from middle school through Intermediate and O/A Level.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '28px' }}>
            <div className="process-card">
              <div className="process-number">01</div>
              <h3 style={{ fontSize: '19px', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>Submit the Form</h3>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>Fill out the application form above with your child's details.</p>
            </div>
            <div className="process-card">
              <div className="process-number">02</div>
              <h3 style={{ fontSize: '19px', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>Counsellor Call</h3>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>Our academic counsellor calls within 24–48 hours to discuss the right class.</p>
            </div>
            <div className="process-card">
              <div className="process-number">03</div>
              <h3 style={{ fontSize: '19px', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>Assessment</h3>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>A short assessment to confirm placement where applicable.</p>
            </div>
            <div className="process-card">
              <div className="process-number">04</div>
              <h3 style={{ fontSize: '19px', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>Confirm & Enroll</h3>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>Complete documentation and fee submission to secure the seat.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
