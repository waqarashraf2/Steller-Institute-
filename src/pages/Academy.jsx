import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FloatingShapes from '../components/FloatingShapes';
import ScrollReveal from '../components/ScrollReveal';
import DriveVideoFacade from '../components/DriveVideoFacade';
import SEO from '../components/SEO';
import { academyReviews } from '../data/reviews';
import './Pages.css';

export default function Academy() {
  const academySchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    "name": "Stellar Academy Board Exam Coaching",
    "description": "Comprehensive board exam coaching for Matric (9th-10th), Intermediate (FSc, ICS, FA, I.Com), and Cambridge O/A Levels in Lahore.",
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Stellar Institute & Academy",
      "url": "https://stellarinstitute.pk"
    },
    "educationalCredentialAwarded": "Board Exam Success & Academic Excellence"
  };

  return (
    <>
      <SEO
        title="Academic Coaching — Matric, Intermediate, FSc, ICS & O/A Levels"
        description="Top-tier academic preparation for 5th to 12th grades and Cambridge O/A Levels in Lahore. High-achieving board test sessions, separate boys/girls classes, and expert teachers."
        keywords="Stellar Academy Lahore, Matric Coaching, FSc Pre Medical Lahore, ICS Academy, O Level Classes Lahore, A Level Academy, Board Exam Preparation"
        canonical="https://stellarinstitute.pk/academy"
        schemaData={academySchema}
      />
      {/* SECTION 1: HERO */}
      <section className="page-hero relative" style={{ overflow: 'hidden' }}>
        <FloatingShapes />
        <div className="page-hero-content container relative z-10">
          <div className="section-label" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '15px' }}>
            Stellar Academy — Matric · Intermediate · O & A Levels
          </div>
          <h1 style={{ marginBottom: '20px' }}>
            Where Hard Work Turns Into<br/><span>Top Grades</span>
          </h1>
          <p>
            Focused board exam preparation, disciplined test sessions, and mentorship built to help every student reach their highest grades without losing sight of who they're becoming.
          </p>
          <div className="hero-actions" style={{ marginTop: '30px' }}>
            <Link to="/admission" className="btn btn-primary">Secure Admission</Link>
          </div>

          <div className="hero-stats-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginTop: '60px',
            textAlign: 'left'
          }}>
            <div className="stat-card">
              <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px' }}>5th – 12th</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: 0 }}>Classes Covered</p>
            </div>
            <div className="stat-card">
              <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px' }}>Boys & Girls</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: 0 }}>Separate Sections</p>
            </div>
            <div className="stat-card">
              <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px' }}>Weekly</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: 0 }}>Test Sessions</p>
            </div>
            <div className="stat-card">
              <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px' }}>Board-Aligned</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: 0 }}>Curriculum</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: TRACKS */}
      <section className="programs-section" style={{ padding: '80px 0', background: 'var(--bg-color-alt)' }}>
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <h2 className="section-title">A Track for Every Board Exam Ahead</h2>
              <p className="section-subtitle">
                From Matric to Intermediate and beyond, every class is built around the exams that matter most, with teaching paced to the board's own timeline.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <Link to="/academy/grades-5-8" style={{ textDecoration: 'none', display: 'block', color: 'inherit' }}>
              <div className="program-card clickable-card" style={{ marginBottom: '30px' }}>
                <div className="program-card-header">
                  <h2>Middle Classes</h2>
                  <span className="grades">5th – 8th</span>
                </div>
                <div className="program-card-body">
                  <p>Regular testing, hands-on practical work, and a disciplined routine so every child enters Matric confident.</p>
                  <div className="program-details-grid">
                    <div className="program-detail-block">
                      <h4>Highlights</h4>
                      <ul>
                        <li>Weekly Class Tests</li>
                        <li>Hands-On Science Labs</li>
                      </ul>
                    </div>
                    <div className="program-detail-block" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                      <span className="view-details-link">View Details &rarr;</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <Link to="/academy/matric" style={{ textDecoration: 'none', display: 'block', color: 'inherit' }}>
              <div className="program-card clickable-card" style={{ marginBottom: '30px' }}>
                <div className="program-card-header">
                  <h2>Matric</h2>
                  <span className="grades">9th – 10th</span>
                </div>
                <div className="program-card-body">
                  <p>Science & Arts groups, taught to the board syllabus with continuous assessment.</p>
                  <div className="program-details-grid">
                    <div className="program-detail-block">
                      <h4>Streams</h4>
                      <ul>
                        <li>Science Group</li>
                        <li>Arts / General Group</li>
                      </ul>
                    </div>
                    <div className="program-detail-block" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                      <span className="view-details-link">View Details &rarr;</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <Link to="/academy/intermediate" style={{ textDecoration: 'none', display: 'block', color: 'inherit' }}>
              <div className="program-card clickable-card" style={{ marginBottom: '30px' }}>
                <div className="program-card-header">
                  <h2>Intermediate (FSc / ICS / Commerce)</h2>
                  <span className="grades">11th – 12th</span>
                </div>
                <div className="program-card-body">
                  <p>Pre-Medical, Pre-Engineering, ICS, and Commerce streams with entry-test relevant coaching.</p>
                  <div className="program-details-grid">
                    <div className="program-detail-block">
                      <h4>Streams</h4>
                      <ul>
                        <li>Pre-Medical & Pre-Engineering</li>
                        <li>ICS</li>
                        <li>Commerce / I.Com</li>
                      </ul>
                    </div>
                    <div className="program-detail-block" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                      <span className="view-details-link">View Details &rarr;</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <Link to="/academy/o-a-levels" style={{ textDecoration: 'none', display: 'block', color: 'inherit' }}>
              <div className="program-card clickable-card" style={{ marginBottom: '30px' }}>
                <div className="program-card-header">
                  <h2>Cambridge O & A Levels</h2>
                  <span className="grades">O / A LEVEL</span>
                </div>
                <div className="program-card-body">
                  <p>Subject-specific support aligned with Cambridge assessment objectives and past-paper practice.</p>
                  <div className="program-details-grid">
                    <div className="program-detail-block">
                      <h4>Streams</h4>
                      <ul>
                        <li>O Level core & elective subjects</li>
                        <li>A Level (Sciences, Commerce, Humanities)</li>
                      </ul>
                    </div>
                    <div className="program-detail-block" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                      <span className="view-details-link">View Details &rarr;</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 3: TEST SESSIONS */}
      <section className="section" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="section-header" style={{ maxWidth: '800px', margin: '0 auto 50px auto', textAlign: 'center' }}>
            <div className="section-label">Test Sessions & Performance Tracking</div>
            <h2 className="section-title">Consistent Testing. Visible Progress.</h2>
            <p className="section-subtitle">
              Regular, structured assessments, so no student's weak spot goes unnoticed until it's too late.
            </p>
          </div>

          <div className="test-sessions-grid">
            <ScrollReveal delay={0.1}>
              <div className="test-session-card">
                <div className="ts-badge">WEEKLY</div>
                <h3>Class Tests</h3>
                <p>Short, subject-wise tests after every unit to reinforce what's just been taught.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="test-session-card">
                <div className="ts-badge">MONTHLY</div>
                <h3>Progress Assessments</h3>
                <p>Full-syllabus-to-date tests with detailed performance reports shared with parents.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="test-session-card">
                <div className="ts-badge">PRE-BOARD</div>
                <h3>Mock Board Exams</h3>
                <p>Full-length papers under timed, exam-hall conditions before the actual boards.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="test-session-card">
                <div className="ts-badge">ONGOING</div>
                <h3>Performance Tracking</h3>
                <p>Individual student trend reports, so improvement or a dip is caught early.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SECTION 4: STUDENT REVIEWS */}
      <section className="reviews-section">
        <div className="container">
          <div className="section-header" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div className="section-label">Academy Student Success</div>
            <h2 className="section-title">Hear From Our Students</h2>
            <p className="section-subtitle">
              Don't just take our word for it. See what our students have to say about their experience preparing for their board exams.
            </p>
          </div>

          <div className="reviews-grid">
            {academyReviews.map((review, index) => (
              <ScrollReveal key={review.id} delay={index * 0.1}>
                <div className="review-card-container">
                  <DriveVideoFacade videoId={review.id} title={review.title} videoPath={review.videoPath} />
                  <h3 className="review-card-title">{review.title}</h3>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: CTA */}
      <section className="cta-section" style={{ background: 'var(--primary-dark)', padding: '80px 0', textAlign: 'center', color: 'white' }}>
        <div className="container">
          <ScrollReveal>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Ready to Start Your Board Exam Prep?</h2>
            <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 40px auto', opacity: 0.9, lineHeight: 1.6 }}>
              Seats for the upcoming session are limited. Talk to our academic counsellor and find the right class for your child.
            </p>
            <div style={{ marginTop: '40px' }}>
              <Link to="/admission" className="btn btn-white-dynamic btn-lg">Secure admission</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
