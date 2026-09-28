import { Link } from 'react-router-dom';
import FloatingShapes from '../../components/FloatingShapes';
import ScrollReveal from '../../components/ScrollReveal';
import SEO from '../../components/SEO';
import '../Pages.css';

export default function Matric() {
  return (
    <>
      <SEO
        title="Matric (9th & 10th) Coaching — Science & Arts | Stellar Academy Lahore"
        description="Comprehensive 9th and 10th Matric coaching in Lahore. BISE Lahore board preparation, regular test series, past paper solutions, and hands-on science practicals."
        canonical="https://stellarinstitute.pk/academy/matric"
        keywords="matric coaching lahore, 9th 10th science academy lahore, bise lahore preparation, stellar matric academy"
      />
      {/* SECTION 1 */}
      <section className="page-hero relative" style={{ overflow: 'hidden' }}>
        <FloatingShapes />
        <div className="page-hero-content container relative z-10">
          <div className="section-label" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '15px' }}>
            Academy / 9th & 10th (Matric)
          </div>
          <h1 style={{ marginBottom: '20px' }}>
            Where Hard Work Turns Into<br /><span>Board Exam Results</span>
          </h1>
          <p>
            Matric is the first board exam that truly counts, and at Stellar, it's treated with the seriousness it deserves. Every subject is taught against the board's own marking scheme, backed by regular practicals and test sessions that leave nothing to chance.
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
                <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.2rem', marginBottom: '8px' }}>Science & Arts</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Board Groups</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="stat-card" style={{ background: 'white' }}>
                <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.2rem', marginBottom: '8px' }}>Weekly</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Test Sessions</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <div className="stat-card" style={{ background: 'white' }}>
                <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.2rem', marginBottom: '8px' }}>Pre-Board</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Mock Exams</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <div className="stat-card" style={{ background: 'white' }}>
                <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.2rem', marginBottom: '8px' }}>Hands-On</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Practical Exams</p>
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
            <h2 className="section-title">Board Groups, Taught the Way the Exam Demands</h2>
            <p className="section-subtitle">
              Matric coaching at Stellar is built entirely around the board's own exam structure and marking scheme.
            </p>
          </div>

          <div className="curriculum-grid">
            <ScrollReveal delay={0.1}>
              <div className="curriculum-card">
                <span className="curriculum-badge">Group</span>
                <h3>Science Group</h3>
                <p>Physics, Chemistry, Biology/Computer Science, Mathematics.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="curriculum-card">
                <span className="curriculum-badge">Group</span>
                <h3>Arts / General Group</h3>
                <p>Humanities-focused subjects with the same test-driven approach.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="curriculum-card">
                <span className="curriculum-badge">Practical</span>
                <h3>Practical Exams</h3>
                <p>Hands-on lab work for Physics, Chemistry & Biology, prepping for board practicals.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="curriculum-card">
                <span className="curriculum-badge">Prep</span>
                <h3>Chapter-Wise Practice</h3>
                <p>Board-pattern questions after every chapter, not just before exams.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <div className="curriculum-card">
                <span className="curriculum-badge">Testing</span>
                <h3>Weekly Class Tests</h3>
                <p>Short, subject-wise tests to reinforce what's just been taught.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.6}>
              <div className="curriculum-card">
                <span className="curriculum-badge">Pre-Board</span>
                <h3>Mock Board Exams</h3>
                <p>Full-length papers under timed, exam-hall conditions.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SECTION 4 */}
      <section className="cta-section" style={{ background: 'var(--primary-dark)', padding: '80px 0', textAlign: 'center', color: 'white' }}>
        <div className="container">
          <ScrollReveal>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Ready to Start Matric Board Exam Prep?</h2>
            <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 40px auto', opacity: 0.9, lineHeight: 1.6 }}>
              Seats for the upcoming Matric session are limited. Talk to our academic counsellor today.
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
