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
          <Link to="/" className="nav-brand">
            <img src="/stellar_logo.png" alt="Stellar Institute Logo" className="brand-logo" width={562} height={165} />
          </Link>

          <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/academy" className={location.pathname === '/academy' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Academy</Link>
            <Link to="/skilled-institute" className={location.pathname === '/skilled-institute' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Institute</Link>
            <Link to="/admission" className={location.pathname === '/admission' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Admissions</Link>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            
            <div className="nav-mobile-btn">
              <Link to="/admission" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>Register Now</Link>
            </div>
          </div>

          <div className="nav-actions">
            <Link to="/admission" className="btn btn-primary nav-desktop-btn">Register Now</Link>
            <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
