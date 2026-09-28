import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FloatingShapes from '../components/FloatingShapes';
import ScrollReveal from '../components/ScrollReveal';
import DriveVideoFacade from '../components/DriveVideoFacade';
import SEO from '../components/SEO';
import { academyReviews } from '../data/reviews';
import './Pages.css';
import './Academy.css';

export default function Academy() {
  const academicTracks = [
    {
      id: 'middle-classes',
      title: 'Middle Classes',
      gradeBadge: '5th – 8th Grade',
      path: '/academy/grades-5-8',
      desc: 'Solid foundation in conceptual learning, routine testing, and science labs to ensure effortless transition into board exams.',
      streams: ['Mathematics', 'General Science', 'English & Urdu', 'Computer Science'],
      highlights: ['Weekly Chapter Tests', 'Science Lab Experiments', 'Activity-Based Learning'],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      )
    },
    {
      id: 'matric',
      title: 'Matriculation (BISE)',
      gradeBadge: '9th & 10th Grade',
      path: '/academy/matric',
      desc: 'Rigorous preparation designed for Lahore & Federal Board exams with extensive past paper practice and mock tests.',
      streams: ['Science Group (Bio/Comp)', 'Arts / General Group', 'Maths & Physics Coaching'],
      highlights: ['Board-Pattern Mocks', 'Daily Problem Sessions', 'Individual Assessment'],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      )
    },
    {
      id: 'intermediate',
      title: 'Intermediate College Prep',
      gradeBadge: 'FSc / ICS / I.Com',
      path: '/academy/intermediate',
      desc: 'Advanced coaching for Pre-Medical, Pre-Engineering, ICS & Commerce students targeting top university entrance and high percentages.',
      streams: ['FSc Pre-Medical', 'FSc Pre-Engineering', 'ICS (Comp/Stats/Econ)', 'I.Com & F.A'],
      highlights: ['ECAT / MDCAT Oriented', 'Concept Clearing Classes', 'Senior College Faculty'],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
          <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
        </svg>
      )
    },
    {
      id: 'o-a-levels',
      title: 'Cambridge O & A Levels',
      gradeBadge: 'CAIE Board',
      path: '/academy/o-a-levels',
      desc: 'International syllabus alignment, analytical skill development, and Cambridge past-paper marking schemes.',
      streams: ['O-Level Core Subjects', 'A-Level Sciences', 'A-Level Business & Economics'],
      highlights: ['Cambridge Certified Teachers', 'Topical Revision', 'Mock Exam Series'],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      )
    }
  ];

  return (
    <>
      <SEO
        title="Academic Coaching — Matric, Intermediate, FSc, ICS & O/A Levels"
        description="Top-tier academic preparation for 5th to 12th grades and Cambridge O/A Levels in Lahore. High-achieving board test sessions, separate boys/girls classes, and expert teachers."
        keywords="Stellar Academy Lahore, Matric Coaching, FSc Pre Medical Lahore, ICS Academy, O Level Classes Lahore, A Level Academy, Board Exam Preparation"
        canonical="https://stellarinstitute.pk/academy"
      />

      {/* SECTION 1: HERO */}
      <section className="page-hero relative" style={{ overflow: 'hidden' }}>
        <FloatingShapes />
        <div className="page-hero-content container relative z-10">
          <div className="academy-hero-badge">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            Stellar Academy — Matric · Intermediate · O &amp; A Levels
          </div>
          
          <h1 style={{ marginBottom: '20px' }}>
            Where Hard Work Turns Into<br /><span>Top Grades</span>
          </h1>
          <p>
            Focused board exam preparation, disciplined test sessions, and mentorship built to help every student reach their highest grades and gain admission into top universities.
          </p>

          <div className="hero-actions" style={{ marginTop: '30px' }}>
            <Link to="/admission" className="btn btn-primary">Secure Admission</Link>
            <Link to="/contact" className="btn btn-outline" style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)', marginLeft: '12px' }}>
              Book Free Counseling
            </Link>
          </div>
          
          {/* Quick Stats Grid */}
          <div className="academy-stats-grid">
            <div className="academy-stat-box">
              <div className="academy-stat-number">5th – 12th</div>
              <p className="academy-stat-label">Classes Covered</p>
            </div>
            <div className="academy-stat-box">
              <div className="academy-stat-number">Boys &amp; Girls</div>
              <p className="academy-stat-label">Separate Batches</p>
            </div>
            <div className="academy-stat-box">
              <div className="academy-stat-number">Weekly</div>
              <p className="academy-stat-label">Test Sessions</p>
            </div>
            <div className="academy-stat-box">
              <div className="academy-stat-number">Board-Aligned</div>
              <p className="academy-stat-label">Syllabus &amp; Papers</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ACADEMIC TRACKS */}
      <section className="academy-tracks-section">
        <div className="container">
          <ScrollReveal>
            <div className="section-header" style={{ maxWidth: '800px', margin: '0 auto 40px', textAlign: 'center' }}>
              <div className="section-label">Academic Programs</div>
              <h2 className="section-title">A Track for Every Board Exam Ahead</h2>
              <p className="section-subtitle">
                From middle school foundational mastery to Intermediate and Cambridge exams, every program is structured to deliver outstanding results.
              </p>
            </div>
          </ScrollReveal>

          <div className="academy-tracks-grid">
            {academicTracks.map((track, i) => (
              <ScrollReveal key={track.id} delay={i * 0.1}>
                <Link to={track.path} className="academic-track-card">
                  {/* Card Header */}
                  <div className="track-card-top">
                    <div className="track-icon-wrapper">
                      {track.icon}
                    </div>
                    <span className="track-grade-badge">
                      {track.gradeBadge}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="track-card-body">
                    <div>
                      <h3 className="track-title">{track.title}</h3>
                      <p className="track-desc">{track.desc}</p>

                      {/* Streams / Subject Tags */}
                      <div className="track-tags-block">
                        <div className="track-tags-title">Offered Subjects &amp; Groups</div>
                        <div className="track-tags-list">
                          {track.streams.map((stream, idx) => (
                            <span key={idx} className="track-tag">{stream}</span>
                          ))}
                        </div>
                      </div>

                      {/* Features */}
                      <ul className="track-features-list">
                        {track.highlights.map((item, idx) => (
                          <li key={idx} className="track-feature-item">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Card Footer */}
                    <div className="track-card-footer">
                      <span className="track-cta-link">
                        <span>View Curriculum &amp; Details</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: TEST SESSIONS & TRACKING */}
      <section className="test-sessions-section">
        <div className="container">
          <div className="section-header" style={{ maxWidth: '800px', margin: '0 auto 50px auto', textAlign: 'center' }}>
            <div className="section-label">Test Sessions &amp; Performance Tracking</div>
            <h2 className="section-title">Consistent Testing. Visible Progress.</h2>
            <p className="section-subtitle">
              Structured assessment routines designed to eliminate weak spots before final board examinations.
            </p>
          </div>
          
          <div className="test-sessions-grid">
            <ScrollReveal delay={0.05}>
              <div className="test-session-card">
                <div className="ts-badge">WEEKLY</div>
                <h3>Class Unit Tests</h3>
                <p>Short, subject-wise chapter tests after every topic to reinforce classroom concepts immediately.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="test-session-card">
                <div className="ts-badge">MONTHLY</div>
                <h3>Progress Evaluations</h3>
                <p>Full-syllabus cumulative assessments with detailed performance reports shared directly with parents.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="test-session-card">
                <div className="ts-badge">PRE-BOARD</div>
                <h3>Mock Board Exams</h3>
                <p>Full-length papers conducted under realistic exam-hall conditions and timed environment.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="test-session-card">
                <div className="ts-badge">ONGOING</div>
                <h3>Parent-Teacher Meetings</h3>
                <p>Regular individual feedback meetings so strengths are accelerated and dips are corrected immediately.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SECTION 4: STUDENT REVIEWS */}
      <section className="reviews-section" style={{ background: 'var(--primary-50)' }}>
        <div className="container">
          <div className="section-header" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div className="section-label">Academy Student Success</div>
            <h2 className="section-title">Hear From Our Students &amp; Toppers</h2>
            <p className="section-subtitle">
              Real feedback from students who achieved A+ grades and top board positions with Stellar Academy.
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

      {/* SECTION 5: CTA BANNER */}
      <section className="academy-cta-banner">
        <div className="container">
          <ScrollReveal>
            <div className="academy-cta-content">
              <h2 className="academy-cta-title">Ready to Start Your Board Exam Preparation?</h2>
              <p className="academy-cta-desc">
                Seats for the upcoming academic session are filling fast. Book a free consultation with our head of academics to choose the best stream for your child.
              </p>
              <div className="academy-cta-btns">
                <Link to="/admission" className="btn-white-accent">
                  <span>Register for Admission</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
                <Link to="/contact" className="btn-outline-white">
                  <span>Contact Admissions Office</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
