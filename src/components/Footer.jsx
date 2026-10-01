import { Link } from 'react-router-dom';
import { contactInfo } from '../data/courses';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="lms-footer">
      <div className="container">
        <div className="footer-grid">
          
          <div className="footer-widget">
            <Link to="/" className="footer-logo-link" data-track-id="footer_logo" data-track-location="footer">
              <img src="/stellar_logo.png" alt="Stellar Institute Logo" className="footer-logo-img" width={562} height={165} />
            </Link>
            <ul className="footer-contact-info">
              <li><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,marginRight:6}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> {contactInfo.address}</li>
              <li><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,marginRight:6}}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg> <a href={`tel:${contactInfo.phone.replace(/[^0-9+]/g, '')}`} data-track-id="footer_phone_link" data-track-location="footer" style={{ color: 'inherit', textDecoration: 'none' }}>{contactInfo.phone}</a></li>
              <li><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,marginRight:6}}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> <a href={`mailto:${contactInfo.email}`} data-track-id="footer_email_link" data-track-location="footer" style={{ color: 'inherit', textDecoration: 'none' }}>{contactInfo.email}</a></li>
            </ul>
            <div className="footer-socials">
              <a href={contactInfo.socials.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" data-track-id="footer_social_youtube" data-track-location="footer">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              </a>
              <a href={contactInfo.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" data-track-id="footer_social_instagram" data-track-location="footer">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href={contactInfo.socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" data-track-id="footer_social_facebook" data-track-location="footer">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
            </div>
          </div>

          <div className="footer-widget">
            <h4 className="widget-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/" data-track-id="footer_link_home" data-track-location="footer_quick_links">Home</Link></li>
              <li><Link to="/academy" data-track-id="footer_link_academy" data-track-location="footer_quick_links">Academy</Link></li>
              <li><Link to="/skilled-institute" data-track-id="footer_link_skilled" data-track-location="footer_quick_links">Skilled Institute</Link></li>
              <li><Link to="/about" data-track-id="footer_link_about" data-track-location="footer_quick_links">About Us</Link></li>
              <li><Link to="/contact" data-track-id="footer_link_contact" data-track-location="footer_quick_links">Contact</Link></li>
              <li><Link to="/privacy-policy" data-track-id="footer_link_privacy" data-track-location="footer_quick_links">Privacy Policy</Link></li>
              <li><Link to="/apply" data-track-id="footer_link_apply" data-track-location="footer_quick_links">Apply</Link></li>
            </ul>
          </div>

          <div className="footer-widget">
            <h4 className="widget-title">Institutes</h4>
            <ul className="footer-links">
              <li><Link to="/academy" data-track-id="footer_inst_academy" data-track-location="footer_institutes">Stellar Academy</Link></li>
              <li><Link to="/skilled-institute" data-track-id="footer_inst_skilled" data-track-location="footer_institutes">Stellar Skilled Institute</Link></li>
              <li><Link to="/coming-soon" data-track-id="footer_inst_school" data-track-location="footer_institutes">Stellar School</Link></li>
              <li><Link to="/coming-soon" data-track-id="footer_inst_college" data-track-location="footer_institutes">Stellar College</Link></li>
            </ul>
          </div>

          <div className="footer-widget">
            <h4 className="widget-title">Working Hours</h4>
            <ul className="footer-contact-info">
              <li>Monday – Saturday</li>
              <li>8:00 AM – 8:00 PM</li>
              <li style={{ marginTop: '8px', opacity: 0.6 }}>Sunday: Closed</li>
            </ul>
          </div>

        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} Stellar Institute. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
