import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCourses } from '../components/CoursesProvider';
import FloatingShapes from '../components/FloatingShapes';
import ImagePlaceholder from '../components/ImagePlaceholder';
import ScrollReveal from '../components/ScrollReveal';
import DriveVideoFacade from '../components/DriveVideoFacade';
import SEO from '../components/SEO';
import { instituteReviews } from '../data/reviews';
import './Pages.css';
import './SkilledInstitute.css';

export default function SkilledInstitute() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { itCourses, beautyCourses, loading } = useCourses();

  const allCourses = useMemo(() => {
    return [
      ...itCourses.map(c => ({ ...c, category: 'it' })),
      ...beautyCourses.map(c => ({ ...c, category: 'beauty' }))
    ];
  }, [itCourses, beautyCourses]);

  const filteredCourses = useMemo(() => {
    return allCourses.filter(course => {
      const matchesCategory = filter === 'all' || course.category === filter;
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [filter, searchQuery, allCourses]);

  const getCategoryName = (key) => {
    if (key === 'it') return 'IT & Software Courses';
    if (key === 'beauty') return 'Female Beauty Courses';
    return 'All Available Courses';
  };

  return (
    <>
      <SEO
        title="Skilled Institute — IT, Web Development, Digital Marketing & Beauty Courses"
        description="Explore 23+ industry-certified professional short courses in Lahore. Master Web Development, Graphic Design, Digital Marketing, and Cosmetology with hands-on training."
        keywords="IT Courses Lahore, Web Development Course Lahore, Digital Marketing Training, Graphic Designing, Beautician Course Lahore, Certificate Verification"
        canonical="https://stellarinstitute.pk/skilled-institute"
      />
      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section className="page-hero relative" style={{ overflow: 'hidden' }}>
        <FloatingShapes />
        <div className="page-hero-content container relative z-10">
          <h1>Learn Skills. Build a Career.<br /><span>Start earning.</span></h1>
          <p>
            Master Web Development, Digital Marketing, Graphic Design, and Professional Cosmetology to unlock high-income opportunities with global and local clients.
          </p>
          <div className="breadcrumb">
            <Link to="/">Home</Link> <span>/</span> <span>Skilled Institute</span>
          </div>
        </div>
      </section>

      {/* ─── Main Catalog Section ─────────────────────────────────── */}
      <section className="skilled-programs-section">
        <div className="container skilled-layout-container">

          {/* ─── Sticky Sidebar ───────────────────────────────────── */}
          <aside className="skilled-sidebar">
            {/* Search Box */}
            <div className="sidebar-widget">
              <h3 className="widget-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                Search Courses
              </h3>
              <div className="search-box">
                <div className="search-input-wrapper">
                  <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by course name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="course-search-input"
                  />
                  {searchQuery && (
                    <button className="clear-search" onClick={() => setSearchQuery('')} title="Clear search">✕</button>
                  )}
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="sidebar-widget">
              <h3 className="widget-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                Course Categories
              </h3>
              <div className="category-list">
                <button
                  className={`category-btn ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  <div className="cat-left">
                    <span className="cat-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polygon points="12 6 12 12 16 14"></polygon>
                      </svg>
                    </span>
                    <span className="cat-name">All Programs</span>
                  </div>
                  <span className="cat-count">{allCourses.length}</span>
                </button>

                <button
                  className={`category-btn ${filter === 'it' ? 'active' : ''}`}
                  onClick={() => setFilter('it')}
                >
                  <div className="cat-left">
                    <span className="cat-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <polyline points="16 18 22 12 16 6"></polyline>
                        <polyline points="8 6 2 12 8 18"></polyline>
                      </svg>
                    </span>
                    <span className="cat-name">IT & Tech</span>
                  </div>
                  <span className="cat-count">{itCourses.length}</span>
                </button>

                <button
                  className={`category-btn ${filter === 'beauty' ? 'active' : ''}`}
                  onClick={() => setFilter('beauty')}
                >
                  <div className="cat-left">
                    <span className="cat-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                      </svg>
                    </span>
                    <span className="cat-name">Female Beauty</span>
                  </div>
                  <span className="cat-count">{beautyCourses.length}</span>
                </button>
              </div>
            </div>

          </aside>

          {/* ─── Main Content Grid ─────────────────────────────────── */}
          <div className="skilled-content">
            {/* Content Top Bar */}
            <div className="content-top-header">
              <div className="content-title-wrap">
                <h2 className="content-title">
                  {getCategoryName(filter)}
                </h2>
                <span className="content-count-pill">
                  {loading ? '...' : `${filteredCourses.length} Courses`}
                </span>
              </div>
              {searchQuery && (
                <div className="active-filter-badge">
                  <span>Searching: "{searchQuery}"</span>
                </div>
              )}
            </div>

            {/* Courses Grid */}
            {filteredCourses.length > 0 ? (
              <div className="courses-grid">
                <AnimatePresence>
                  {filteredCourses.map((course, i) => (
                    <motion.div
                      key={course.id || course.title}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.03, duration: 0.3 }}
                      className="lms-course-card"
                    >
                      {/* Media Header with Badges */}
                      <div className="course-card-media">
                        {course.banner_url || course.image_url || course.image ? (
                          <img
                            src={course.banner_url || course.image_url || course.image}
                            alt={course.title}
                            loading="lazy"
                            decoding="async"
                            className="course-card-img"
                          />
                        ) : (
                          <ImagePlaceholder label={course.title} />
                        )}
                        <div className="course-media-overlay" />

                        {/* Category Floating Pill */}
                        <span className={`course-category-badge ${course.category === 'it' ? 'badge-it' : 'badge-beauty'}`}>
                          {course.category === 'it' ? 'IT Course' : 'Beauty & Wellness'}
                        </span>

                        {/* Duration Floating Badge */}
                        <span className="course-duration-badge">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          {course.duration || '2-3 Months'}
                        </span>
                      </div>

                      {/* Card Content & Details */}
                      <div className="course-card-body">
                        <div className="course-card-main-info">
                          <h3 className="course-card-title" title={course.title}>
                            {course.title}
                          </h3>

                          {/* Feature Highlights Chips */}
                          <div className="course-features-wrap">
                            <span className="course-feature-chip">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                              Hands-on Projects
                            </span>
                            <span className="course-feature-chip">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                              Certified
                            </span>
                          </div>
                        </div>

                        {/* Footer & Action Button */}
                        <div className="course-card-footer">
                          <div className="course-institution-tag">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.2">
                              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                            </svg>
                            <span>Stellar Institute</span>
                          </div>
                          <Link to="/admission" className="course-enroll-btn">
                            <span>Enroll Now</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                              <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="no-results-card">
                <div className="no-results-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <h3>No courses found matching "{searchQuery}"</h3>
                <p>Try clearing your search query or choosing a different category.</p>
                <button className="btn btn-primary" onClick={() => { setSearchQuery(''); setFilter('all'); }}>
                  View All Courses
                </button>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ─── Student Reviews Section ─────────────────────────────── */}
      <section className="reviews-section" style={{ background: 'var(--primary-50)' }}>
        <div className="container">
          <div className="section-header" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div className="section-label">Institute Student Experiences</div>
            <h2 className="section-title">See What They Achieved</h2>
            <p className="section-subtitle">
              Real stories and feedback from students who leveled up their technical and creative skills with us.
            </p>
          </div>

          <div className="reviews-grid">
            {instituteReviews.map((review, index) => (
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
    </>
  );
}
