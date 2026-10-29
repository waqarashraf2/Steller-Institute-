import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  // Close mobile menu on page change
  useEffect(() => {
    // Close the drawer when navigation is triggered outside the drawer itself.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Track scroll state: when scrolled down, condense into slim floating address pill
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`stellar-header-wrapper ${isScrolled ? 'is-scrolled' : ''} ${isHovered ? 'is-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="stellar-header-capsule">
        {/* Main Nav Row (Collapses on scroll, expands on hover / top) */}
        <div className="nav-main-row">
          <Link to="/" className="nav-brand" data-track-id="nav_logo" data-track-location="header_navbar">
            <img 
              src="/stellar_logo.png" 
              alt="Stellar Institute Logo" 
              className="brand-logo" 
              width={562} 
              height={165} 
            />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="nav-links desktop-nav" aria-label="Main Navigation">
            <Link 
              to="/" 
              className={`nav-link-item ${location.pathname === '/' ? 'active' : ''}`}
              data-track-id="nav_home" 
              data-track-location="header_navbar"
            >
              Home
            </Link>
            <Link 
              to="/academy" 
              className={`nav-link-item ${location.pathname === '/academy' ? 'active' : ''}`}
              data-track-id="nav_academy" 
              data-track-location="header_navbar"
            >
              Academy
            </Link>
            <Link 
              to="/skilled-institute" 
              className={`nav-link-item ${location.pathname === '/skilled-institute' ? 'active' : ''}`}
              data-track-id="nav_institute" 
              data-track-location="header_navbar"
            >
              Institute
            </Link>
            <Link 
              to="/admission" 
              className={`nav-link-item ${location.pathname === '/admission' ? 'active' : ''}`}
              data-track-id="nav_admissions" 
              data-track-location="header_navbar"
            >
              Admissions
            </Link>
            <Link 
              to="/about" 
              className={`nav-link-item ${location.pathname === '/about' ? 'active' : ''}`}
              data-track-id="nav_about" 
              data-track-location="header_navbar"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`nav-link-item ${location.pathname === '/contact' ? 'active' : ''}`}
              data-track-id="nav_contact" 
              data-track-location="header_navbar"
            >
              Contact
            </Link>
            <Link 
              to="/stellar-admin" 
              className="nav-link-item nav-login-link"
              onClick={() => sessionStorage.removeItem('stellar-admin-token')}
              data-track-id="nav_login"
              data-track-location="header_navbar"
            >
              Login
            </Link>
          </nav>

          {/* Right Actions: Register Button & Mobile Hamburger */}
          <div className="nav-actions">
            <Link 
              to="/admission" 
              className="stellar-cta-btn desktop-cta" 
              data-track-id="nav_register_desktop" 
              data-track-location="header_navbar"
            >
              <span>Register Now</span>
              <svg className="cta-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>

            <button 
              className={`stellar-mobile-toggle ${mobileMenuOpen ? 'open' : ''}`} 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              data-track-id="nav_mobile_toggle" 
              data-track-location="header_navbar" 
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
            </button>
          </div>
        </div>

        {/* Bottom Info Strip - Always remains visible and stays pinned at top on scroll */}
        <div className="nav-bottom-strip">
          <div className="nav-bottom-content">
            <a 
              href="https://maps.google.com/?q=Stellar+Institute+Upper+Ground+Floor+1-Montgomery+Road+Lahore" 
              target="_blank" 
              rel="noopener noreferrer"
              className="nav-info-link nav-address-text"
            >
              <svg className="info-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>Stellar Institute, Upper Ground Floor 1-Montgomery Road, Lahore</span>
            </a>

            <span className="nav-info-dot">•</span>

            <a href="tel:+923000652124" className="nav-info-link nav-phone-text">
              <svg className="info-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>+92-300-0652124</span>
            </a>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        <div className={`stellar-mobile-menu ${mobileMenuOpen ? 'is-open' : ''}`}>
          <div className="mobile-menu-body">
            <Link to="/" className={`mobile-nav-item ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
              <span>Home</span>
            </Link>
            <Link to="/academy" className={`mobile-nav-item ${location.pathname === '/academy' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
              <span>Academy</span>
            </Link>
            <Link to="/skilled-institute" className={`mobile-nav-item ${location.pathname === '/skilled-institute' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
              <span>Institute</span>
            </Link>
            <Link to="/admission" className={`mobile-nav-item ${location.pathname === '/admission' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
              <span>Admissions</span>
            </Link>
            <Link to="/about" className={`mobile-nav-item ${location.pathname === '/about' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
              <span>About</span>
            </Link>
            <Link to="/contact" className={`mobile-nav-item ${location.pathname === '/contact' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
              <span>Contact</span>
            </Link>
            <Link to="/stellar-admin" className="mobile-nav-item mobile-login-item" onClick={() => { setMobileMenuOpen(false); sessionStorage.removeItem('stellar-admin-token'); }}>
              <span>Admin Login</span>
            </Link>

            <div className="mobile-menu-actions">
              <Link to="/admission" className="stellar-cta-btn mobile-cta-btn" onClick={() => setMobileMenuOpen(false)}>
                Register Now
              </Link>
            </div>

            <div className="mobile-contact-details">
              <div className="mobile-contact-row">
                <span className="mobile-contact-icon">📍</span>
                <span>Upper Ground Floor 1-Montgomery Road, Lahore</span>
              </div>
              <a href="tel:+923000652124" className="mobile-contact-row mobile-phone-row">
                <span className="mobile-contact-icon">📞</span>
                <span>+92-300-0652124</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
