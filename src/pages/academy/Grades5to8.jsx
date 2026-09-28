import { Link } from 'react-router-dom';
import FloatingShapes from '../../components/FloatingShapes';
import ScrollReveal from '../../components/ScrollReveal';
import SEO from '../../components/SEO';
import '../Pages.css';

export default function Grades5to8() {
  return (
    <>
      <SEO
        title="Middle Classes (5th to 8th Grade) Coaching — Stellar Academy Lahore"
        description="Strong academic foundation for 5th to 8th graders in Lahore. Weekly test routines, conceptual clarity in Math & Science, and attentive mentoring."
        canonical="https://stellarinstitute.pk/academy/grades-5-to-8"
        keywords="middle school coaching lahore, 5th 6th 7th 8th class tuition lahore, foundation coaching, stellar academy middle section"
      />
      {/* SECTION 1 */}
      <section className="page-hero relative" style={{ overflow: 'hidden' }}>
        <FloatingShapes />
        <div className="page-hero-content container relative z-10">
          <div className="section-label" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '15px' }}>
            Stellar Academy — Middle Classes (5th to 8th)
          </div>
          <h1 style={{ marginBottom: '20px' }}>
            Where Hard Work<br /><span>Builds the Foundation</span>
          </h1>
          <p>
            These are the years that decide how a child performs in Matric. At Stellar, Grades 5 to 8 are built around regular testing, hands-on practical work, and a disciplined routine so every child enters Matric confident, not anxious.
          </p>
          <div style={{ marginTop: '30px' }}>
            <Link to="/admission" className="btn btn-primary">Secure Admission</Link>
          </div>
        </div>
      </section>

      {/* SECTION 2 */}
      <section style={{ background: 'var(--bg-color-alt)', padding: '60px 0' }}>
        <div className="container">
          <div className="hero-stats-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px', 
            textAlign: 'left'
          }}>
            <ScrollReveal delay={0.1}>
              <div className="stat-card" style={{ background: 'white' }}>
                <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.2rem', marginBottom: '8px' }}>Grade 5 – 8</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Classes Covered</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="stat-card" style={{ background: 'white' }}>
                <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.2rem', marginBottom: '8px' }}>Weekly</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Class Tests</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <div className="stat-card" style={{ background: 'white' }}>
                <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.2rem', marginBottom: '8px' }}>Monthly</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Progress Reports</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <div className="stat-card" style={{ background: 'white' }}>
                <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.2rem', marginBottom: '8px' }}>Hands-On</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Science Labs</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SECTION 3 */}
      <section className="section" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="section-header" style={{ maxWidth: '800px', margin: '0 auto 50px auto', textAlign: 'center' }}>
            <div className="section-label">What's Taught</div>
            <h2 className="section-title">Every Subject, Taught the Exam-Ready Way</h2>
            <p className="section-subtitle">
              Every subject at this stage is taught to build the foundation Matric will demand not just to finish the syllabus.
            </p>
          </div>

          <div className="curriculum-grid">
            <ScrollReveal delay={0.1}>
              <div className="curriculum-card">
                <span className="curriculum-badge">Core</span>
                <h3>English & Urdu</h3>
                <p>Grammar, comprehension, and writing practice in both languages.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="curriculum-card">
                <span className="curriculum-badge">Core</span>
                <h3>Mathematics</h3>
                <p>Numerical practice that builds the foundation for Matric-level Maths.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="curriculum-card">
                <span className="curriculum-badge">Practical</span>
                <h3>Science</h3>
                <p>Practical labs begin from Grade 6; students don't just memorize; they experiment.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="curriculum-card">
                <span className="curriculum-badge">Core</span>
                <h3>Islamiyat</h3>
                <p>Structured religious studies aligned with the school syllabus.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <div className="curriculum-card">
                <span className="curriculum-badge">Core</span>
                <h3>Social Studies</h3>
                <p>Pakistan Studies, geography, and civic knowledge.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.6}>
              <div className="curriculum-card">
                <span className="curriculum-badge">Practical</span>
                <h3>Computer / IT Basics</h3>
                <p>Foundational computer skills, essential in every field today.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SECTION 4 */}
      <section className="cta-section" style={{ background: 'var(--primary-dark)', padding: '80px 0', textAlign: 'center', color: 'white' }}>
        <div className="container">
          <ScrollReveal>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Give Your Child a Head Start Before Matric</h2>
            <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 40px auto', opacity: 0.9, lineHeight: 1.6 }}>
              Seats for Grades 5–8 are limited for the upcoming session. Talk to our counsellor today.
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn btn-white-dynamic btn-lg">Book a Free Consultation</Link>
              <a href="tel:+923000652124" className="btn btn-outline btn-lg">Call the Academy Desk</a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
