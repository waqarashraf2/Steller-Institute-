import { Link } from 'react-router-dom';
import FloatingShapes from '../../components/FloatingShapes';
import ScrollReveal from '../../components/ScrollReveal';
import SEO from '../../components/SEO';
import '../Pages.css';

export default function OALevels() {
  return (
    <>
      <SEO
        title="Cambridge O Level & A Level Coaching — Stellar Academy Lahore"
        description="Top CAIE O Level and A Level coaching in Lahore. Cambridge past paper analysis, ATP science practicals, and customized subject coaching."
        canonical="https://stellarinstitute.pk/academy/o-a-levels"
        keywords="o level tuition lahore, a level coaching montgomery road, caie lahore academy, cambridge coaching lahore"
      />
      {/* SECTION 1 */}
      <section className="page-hero relative" style={{ overflow: 'hidden' }}>
        <FloatingShapes />
        <div className="page-hero-content container relative z-10">
          <div className="section-label" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '15px' }}>
            Stellar Academy — O & A Level
          </div>
          <h1 style={{ marginBottom: '20px' }}>
            Where Hard Work Meets<br /><span>Cambridge Standards</span>
          </h1>
          <p>
            O and A Level students face a different exam structure than local boards; Stellar's coaching is built specifically around Cambridge assessment objectives, backed by hands-on practicals and regular test sessions, not adapted from Matric-style teaching.
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
                <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.2rem', marginBottom: '8px' }}>O & A Level</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Levels Covered</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="stat-card" style={{ background: 'white' }}>
                <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.2rem', marginBottom: '8px' }}>Cambridge</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Assessment-Aligned</p>
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
            <h2 className="section-title">Coaching Mapped to Cambridge, Not Adapted From It</h2>
            <p className="section-subtitle">
              O and A Level subjects are taught by exam component, with hands-on practicals so students know exactly how Cambridge examiners award marks.
            </p>
          </div>

          <div className="curriculum-grid">
            <ScrollReveal delay={0.1}>
              <div className="curriculum-card">
                <span className="curriculum-badge">O Level</span>
                <h3>Core Subjects</h3>
                <p>English, Mathematics, Sciences taught to Cambridge syllabus objectives.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="curriculum-card">
                <span className="curriculum-badge">O Level</span>
                <h3>Elective Subjects</h3>
                <p>Additional subject coaching based on each student's chosen combination.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="curriculum-card">
                <span className="curriculum-badge">A Level</span>
                <h3>Sciences</h3>
                <p>Physics, Chemistry, Biology, Mathematics at AS & A2 level.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="curriculum-card">
                <span className="curriculum-badge">A Level</span>
                <h3>Commerce & Humanities</h3>
                <p>Business, Economics, Accounting, and Humanities subjects.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <div className="curriculum-card">
                <span className="curriculum-badge">Practical</span>
                <h3>Lab Practicals</h3>
                <p>Hands-on Science practicals matching Cambridge practical assessment components.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.6}>
              <div className="curriculum-card">
                <span className="curriculum-badge">Method</span>
                <h3>Component-Based Coaching</h3>
                <p>Separate technique training for MCQs, structured, and essay-based papers.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SECTION 4 */}
      <section className="cta-section" style={{ background: 'var(--primary-dark)', padding: '80px 0', textAlign: 'center', color: 'white' }}>
        <div className="container">
          <ScrollReveal>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Ready to Start Your O/A Level Prep?</h2>
            <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 40px auto', opacity: 0.9, lineHeight: 1.6 }}>
              Seats for the upcoming O/A Level session are limited. Talk to our academic counsellor today.
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
