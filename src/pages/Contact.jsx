import { useState } from 'react';
import { Link } from 'react-router-dom';
import FloatingShapes from '../components/FloatingShapes';
import ScrollReveal from '../components/ScrollReveal';
import SEO from '../components/SEO';
import { contactInfo } from '../data/courses';
import { pushStellarEvent } from '../utils/tracking';
import './Pages.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    pushStellarEvent('form_submit_attempt', {
      form_id: 'contact_inquiry_form',
      submission_method: 'button'
    });

    let crmSuccess = false;
    let emailSuccess = false;

    // 1. Post to CRM endpoint
    try {
      const crmRes = await fetch('https://crm.stellarinstitute.pk/api/api/v1/public/online-admission', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json' 
        },
        body: JSON.stringify({
          student_name: formData.name || '',
          father_name: 'Website Contact Inquiry',
          phone: formData.phone || '',
          cnic: '',
          batch_timing: 'Flexible',
          education_level: formData.subject || 'Website Inquiry',
          expected_joining_date: new Date().toISOString().split('T')[0],
          course_name: formData.subject ? `Inquiry: ${formData.subject}` : 'General Contact Inquiry'
        })
      });
      const crmData = await crmRes.json().catch(() => ({}));
      if (crmRes.ok || crmData.status === 'success' || crmData.lead_id) {
        crmSuccess = true;
      }
    } catch (crmErr) {
      console.warn('Direct CRM Contact log warning, trying proxy:', crmErr);
      try {
        const crmRes = await fetch('https://stellarinstitute.pk/api/crm-intake.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ form: 'contact', payload: {
            student_name: formData.name || '',
            father_name: 'Website Contact Inquiry',
            phone: formData.phone || '',
            cnic: '',
            batch_timing: 'Flexible',
            education_level: formData.subject || 'Website Inquiry',
            expected_joining_date: new Date().toISOString().split('T')[0],
            course_name: formData.subject ? `Inquiry: ${formData.subject}` : 'General Contact Inquiry'
          } })
        });
        const crmData = await crmRes.json().catch(() => ({}));
        crmSuccess = crmRes.ok && crmData.success !== false;
      } catch {}
    }

    // 2. Post to cPanel email backend
    try {
      const res = await fetch(`https://stellarinstitute.pk/api/contact.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json().catch(() => ({}));
      emailSuccess = res.ok && data.success === true;
    } catch (err) {
      console.warn('Contact email submission warning:', err);
    }

    if (crmSuccess || emailSuccess) {
      pushStellarEvent('generate_lead', {
        form_id: 'contact_inquiry_form',
        lead_type: 'contact_inquiry'
      });
    }

    setStatus('success');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <>
      <SEO
        title="Contact Us — Stellar Institute & Academy Lahore"
        description="Get in touch with Stellar Institute & Academy. Visit our campus at 1-Montgomery Road Lahore, call +92 300 0652124, or send us an inquiry."
        canonical="https://stellarinstitute.pk/contact"
        keywords="contact stellar institute, stellar academy lahore contact, montgomery road lahore institute, admission helpline"
      />
      <section className="page-hero relative" style={{ overflow: 'hidden' }}>
        <FloatingShapes />
        <div className="page-hero-content container relative z-10">
          <h1>Contact Us</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link> <span>/</span> <span>Contact</span>
          </div>
        </div>
      </section>

      <section className="programs-section">
        <div className="container">
          <div className="contact-grid">
            <ScrollReveal direction="left">
              <form className="contact-form" onSubmit={handleSubmit}>
                <h2>Send Us a Message</h2>

                {status === 'success' && (
                  <div className="form-alert form-alert-success">
                    Message sent successfully.
                  </div>
                )}

                {status === 'error' && (
                  <div className="form-alert form-alert-error">
                    {errorMsg}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input type="text" id="name" name="name" placeholder="Your full name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input type="tel" id="phone" name="phone" placeholder="+92-300-0000000" value={formData.phone} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <select id="subject" name="subject" value={formData.subject} onChange={handleChange} required>
                      <option value="">Select a subject</option>
                      <option value="admission">Admission Inquiry</option>
                      <option value="courses">Course Information</option>
                      <option value="fees">Fee Structure</option>
                      <option value="general">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" placeholder="How can we help you?" value={formData.message} onChange={handleChange} required />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', opacity: status === 'sending' ? 0.7 : 1 }}
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message →'}
                </button>
              </form>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="contact-info-side">
                <div className="contact-info-card">
                  <h4>Our Address</h4>
                  <p>{contactInfo.address}</p>
                </div>

                <div className="contact-info-card">
                  <h4>Phone</h4>
                  <p>{contactInfo.phone}</p>
                </div>

                <div className="contact-info-card">
                  <h4>Email</h4>
                  <p>{contactInfo.email}</p>
                </div>

                <div className="contact-info-card">
                  <h4>Working Hours</h4>
                  <p>Monday – Saturday: 8:00 AM – 8:00 PM</p>
                </div>

                <div className="contact-map">
                  <iframe
                    src="https://maps.google.com/maps?q=31.563333,74.3266952&z=17&output=embed"
                    title="Stellar Institute Location"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
