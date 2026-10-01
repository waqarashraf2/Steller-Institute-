import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`lms-header ${scrolled ? 'lms-header-scrolled' : ''}`}>
      <div className="lms-topbar">
        <div className="container">
          <div className="topbar-left">
            <span>Stellar Institute, Upper Ground Floor 1-Montgomery Road, Lahore</span>
            <span>|</span>
            <span>+92-300-0652124</span>
          </div>
          <div className="topbar-right">
            <Link to="/stellar-admin" onClick={() => sessionStorage.removeItem('stellar-admin-token')}>Login</Link>
          </div>
        </div>
      </div>

      <nav className="lms-navbar">
        <div className="container nav-container">
          <Link to="/" className="nav-brand" data-track-id="nav_logo" data-track-location="header_navbar">
            <img src="/stellar_logo.png" alt="Stellar Institute Logo" className="brand-logo" width={562} height={165} />
          </Link>

          <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)} data-track-id="nav_home" data-track-location="header_navbar">Home</Link>
            <Link to="/academy" className={location.pathname === '/academy' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)} data-track-id="nav_academy" data-track-location="header_navbar">Academy</Link>
            <Link to="/skilled-institute" className={location.pathname === '/skilled-institute' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)} data-track-id="nav_institute" data-track-location="header_navbar">Institute</Link>
            <Link to="/admission" className={location.pathname === '/admission' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)} data-track-id="nav_admissions" data-track-location="header_navbar">Admissions</Link>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)} data-track-id="nav_about" data-track-location="header_navbar">About</Link>
            <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)} data-track-id="nav_contact" data-track-location="header_navbar">Contact</Link>
            
            <div className="nav-mobile-btn">
              <Link to="/admission" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)} data-track-id="nav_register_mobile" data-track-location="mobile_menu">Register Now</Link>
            </div>
          </div>

          <div className="nav-actions">
            <Link to="/admission" className="btn btn-primary nav-desktop-btn" data-track-id="nav_register_desktop" data-track-location="header_navbar">Register Now</Link>
            <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} data-track-id="nav_mobile_toggle" data-track-location="header_navbar" aria-label="Toggle Navigation">
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
