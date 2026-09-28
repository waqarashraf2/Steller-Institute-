import { Link } from 'react-router-dom';
import FloatingShapes from '../../components/FloatingShapes';
import ScrollReveal from '../../components/ScrollReveal';
import SEO from '../../components/SEO';
import '../Pages.css';

export default function Intermediate() {
  return (
    <>
      <SEO
        title="FSc & ICS Intermediate (11th & 12th) Coaching — Stellar Academy Lahore"
        description="FSc Pre-Medical, Pre-Engineering, ICS & I.Com coaching in Lahore. Comprehensive board preparation, test sessions, and entry test foundation."
        canonical="https://stellarinstitute.pk/academy/intermediate"
        keywords="fsc coaching lahore, ics academy lahore, intermediate coaching montgomery road, fsc pre-medical tuition"
      />
      {/* SECTION 1 */}
      <section className="page-hero relative" style={{ overflow: 'hidden' }}>
        <FloatingShapes />
        <div className="page-hero-content container relative z-10">
          <div className="section-label" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '15px' }}>
            Stellar Academy — Intermediate (11th & 12th)
          </div>
          <h1 style={{ marginBottom: '20px' }}>
            Where Hard Work Opens the<br /><span>Door to University</span>
          </h1>
          <p>
            Intermediate isn't just two more years of school; it's the foundation for university admissions, entry tests, and career direction. Stellar's Intermediate coaching pairs board-focused teaching with practical lab work and test sessions that keep both in view.
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
                <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.2rem', marginBottom: '8px' }}>11th & 12th</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Classes Covered</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="stat-card" style={{ background: 'white' }}>
                <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.2rem', marginBottom: '8px' }}>4 Streams</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Pre-Med / Pre-Eng / ICS / Commerce</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <div className="stat-card" style={{ background: 'white' }}>
                <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.2rem', marginBottom: '8px' }}>Weekly</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Test Sessions</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <div className="stat-card" style={{ background: 'white' }}>
                <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.2rem', marginBottom: '8px' }}>Hands-On</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Practical Labs</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SECTION 3 */}
      <section className="section" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="section-header" style={{ maxWidth: '800px', margin: '0 auto 50px auto', textAlign: 'center' }}>
            <div className="section-label">What's Covered</div>
            <h2 className="section-title">Streams Built for What Comes Next</h2>
            <p className="section-subtitle">
              Every stream is coached with an eye on both the board exam and the entry test that follows it, with hands-on lab work throughout.
            </p>
          </div>

          <div className="curriculum-grid">
            <ScrollReveal delay={0.1}>
              <div className="curriculum-card">
                <span className="curriculum-badge">Stream</span>
                <h3>Pre-Medical</h3>
                <p>Physics, Chemistry, Biology — coached with MDCAT relevance in mind.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="curriculum-card">
                <span className="curriculum-badge">Stream</span>
                <h3>Pre-Engineering</h3>
                <p>Physics, Chemistry, Mathematics — coached with ECAT relevance in mind.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="curriculum-card">
                <span className="curriculum-badge">Stream</span>
                <h3>ICS</h3>
                <p>Computer Science, Mathematics, Physics/Statistics.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="curriculum-card">
                <span className="curriculum-badge">Stream</span>
                <h3>Commerce / I.Com</h3>
                <p>Accounting, Business Studies, Economics.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <div className="curriculum-card">
                <span className="curriculum-badge">Practical</span>
                <h3>Lab & Practical Exams</h3>
                <p>Hands-on Physics, Chemistry & Biology practicals matching board requirements.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.6}>
              <div className="curriculum-card">
                <span className="curriculum-badge">Support</span>
                <h3>1-on-1 Doubt Sessions</h3>
                <p>Individual attention for subjects where a student is falling behind.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SECTION 4 */}
      <section className="cta-section" style={{ background: 'var(--primary-dark)', padding: '80px 0', textAlign: 'center', color: 'white' }}>
        <div className="container">
          <ScrollReveal>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Ready to Start Your Intermediate Journey?</h2>
            <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 40px auto', opacity: 0.9, lineHeight: 1.6 }}>
              Seats for the upcoming Intermediate session are limited. Talk to our academic counsellor today.
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
