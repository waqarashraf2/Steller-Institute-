import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCourses } from '../components/CoursesProvider';
import FloatingShapes from '../components/FloatingShapes';
import ImagePlaceholder from '../components/ImagePlaceholder';
import ScrollReveal from '../components/ScrollReveal';
import DriveVideoFacade from '../components/DriveVideoFacade';
import { instituteReviews } from '../data/reviews';
import './Pages.css';

export default function SkilledInstitute() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { itCourses, beautyCourses, loading } = useCourses();

  const allCourses = useMemo(() => {
    return [...itCourses.map(c => ({...c, category: 'it'})), ...beautyCourses.map(c => ({...c, category: 'beauty'}))];
  }, [itCourses, beautyCourses]);

  const filteredCourses = useMemo(() => {
    return allCourses.filter(course => {
      const matchesCategory = filter === 'all' || course.category === filter;
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [filter, searchQuery, allCourses]);

  return (
    <>
      <section className="page-hero relative" style={{ overflow: 'hidden' }}>
        <FloatingShapes />
        <div className="page-hero-content container relative z-10">
          <h1>Learn Skills. Build a Career.<br/><span>Start earning.</span></h1>
          <p>Master Graphic Design, Digital Marketing, Web Development, and more, and unlock real earning opportunities with international clients.</p>
          <div className="breadcrumb">
            <Link to="/">Home</Link> <span>/</span> <span>Skilled Institute</span>
          </div>
        </div>
      </section>

      <section className="programs-section">
        <div className="container" style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
          
          <aside className="skilled-sidebar">
            <div className="sidebar-widget">
              <h3 className="widget-title">Search Courses</h3>
              <div className="search-box">
                <div className="search-input-wrapper">
                  <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                    <button className="clear-search" onClick={() => setSearchQuery('')}>✕</button>
                  )}
                </div>
              </div>
            </div>

            <div className="sidebar-widget">
              <h3 className="widget-title">Categories</h3>
              <div className="category-list">
                <button className={`category-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                  <span className="cat-name">All Courses</span>
                  <span className="cat-count">{allCourses.length}</span>
                </button>
                <button className={`category-btn ${filter === 'it' ? 'active' : ''}`} onClick={() => setFilter('it')}>
                  <span className="cat-name">IT Courses</span>
                  <span className="cat-count">{itCourses.length}</span>
                </button>
                <button className={`category-btn ${filter === 'beauty' ? 'active' : ''}`} onClick={() => setFilter('beauty')}>
                  <span className="cat-name">Female Beauty Courses</span>
                  <span className="cat-count">{beautyCourses.length}</span>
                </button>
              </div>
            </div>
          </aside>

          <div className="skilled-content" style={{ flex: 1 }}>
            <div className="content-header">
              <h2>{loading ? 'Loading...' : `Showing ${filteredCourses.length} ${filteredCourses.length === 1 ? 'Course' : 'Courses'}`}</h2>
            </div>

            {filteredCourses.length > 0 ? (
              <div className="courses-grid">
                {filteredCourses.map((course, i) => (
                  <motion.div 
                    key={course.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="lms-course-card" 
                    style={{ height: '100%' }}
                  >
                    <div className="course-image-placeholder">
                      {course.banner_url || course.image_url ? (
                        <img 
                          src={course.banner_url || course.image_url} 
                          alt={course.title}
                          loading="lazy"
                          decoding="async"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center',
                            display: 'block'
                          }}
                        />
                      ) : (
                        <ImagePlaceholder label={course.title} />
                      )}
                      <span className="course-category">
                        {course.category === 'it' ? 'IT Courses' : 'Female Beauty Courses'}
                      </span>
                    </div>
                    <div className="course-content">
                      <h3>{course.title}</h3>
                      <div className="course-meta">
                        <span className="course-duration">Duration: {course.duration}</span>
                      </div>
                      <div className="course-footer">
                        <Link to="/admission" className="course-enroll">Enroll Now →</Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <h3>No courses found matching "{searchQuery}"</h3>
                <button className="btn btn-primary" onClick={() => setSearchQuery('')}>Clear Search</button>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* SECTION: STUDENT REVIEWS */}
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
