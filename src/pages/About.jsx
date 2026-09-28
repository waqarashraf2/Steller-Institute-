import { Link } from 'react-router-dom';
import FloatingShapes from '../components/FloatingShapes';
import ScrollReveal from '../components/ScrollReveal';
import { useWebsiteImage } from '../components/WebsiteImagesProvider';
import SEO from '../components/SEO';
import './Pages.css';

export default function About() {
  const aboutImage = useWebsiteImage('Institute about photo');

  return (
    <>
      <SEO
        title="About Us — Mission, Vision & Faculty | Stellar Institute & Academy"
        description="Learn about Stellar Institute & Academy Lahore. Dedicated to empowering students through premier academic coaching, technical certifications, and expert mentorship."
        canonical="https://stellarinstitute.pk/about"
        keywords="about stellar institute, premier education lahore, stellar faculty, stellar academy vision, montgomery road institute"
      />
      <section className="page-hero relative" style={{ overflow: 'hidden' }}>
        <FloatingShapes />
        <div className="page-hero-content container relative z-10">
          <h1>About Stellar Institute</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link> <span>/</span> <span>About Us</span>
          </div>
        </div>
      </section>

      <section className="programs-section">
        <div className="container">

          <div className="about-grid">
            <ScrollReveal direction="left">
              <div className="about-text">
                <div className="section-label" style={{ textAlign: 'left', paddingLeft: 0 }}>Our Mission</div>
                <h2 className="section-title" style={{ textAlign: 'left' }}>Empowering Through Education</h2>
                <div className="about-values" style={{ marginTop: '40px' }}>
                  <div className="about-value">
                    <h4>Excellence</h4>
                  </div>
                  <div className="about-value">
                    <h4>Integrity</h4>
                  </div>
                  <div className="about-value">
                    <h4>Innovation</h4>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div 
                className="about-visual"
                style={aboutImage ? { 
                  backgroundImage: `url(${aboutImage})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center' 
                } : {}}
              >
                {aboutImage && <div className="about-visual-overlay"></div>}
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <h3 style={aboutImage ? { color: 'white' } : {}}>Stellar Institute</h3>
                  <p style={aboutImage ? { color: 'rgba(255,255,255,0.9)' } : {}}>Lahore, Pakistan · Est. 2023</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div style={{ marginTop: '100px' }}>
            <ScrollReveal>
              <div className="section-header">
                <div className="section-label">Our Journey</div>
                <h2 className="section-title">Milestones</h2>
              </div>
            </ScrollReveal>

            <div className="timeline">
              {[
                { title: 'Founded Stellar Institute' },
                { title: 'Launched Skilled Institute' },
                { title: 'Stellar Academy Opens' },
                { title: 'Stellar School & College' },
                { title: '500+ Students Enrolled' },
              ].map((item, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <div className="timeline-item">
                    <div className="timeline-dot" />
                    <h4>{item.title}</h4>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <ScrollReveal>
              <h2 className="section-title">Join the Stellar Family</h2>
              <div style={{ marginTop: '32px' }}>
                <Link to="/contact" className="btn btn-primary btn-lg">Get in Touch →</Link>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>
    </>
  );
}
