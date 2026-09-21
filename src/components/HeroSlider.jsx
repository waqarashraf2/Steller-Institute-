import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ThreeBackground = React.lazy(() => import('./ThreeBackground'));

import ImagePlaceholder from './ImagePlaceholder';
import { useWebsiteImages } from './WebsiteImagesProvider';
import './HeroSlider.css';

const slides = [
  {
    tag: 'Welcome To Stellar Institute',
    heading: 'Building Tomorrow\'s Leaders, Today.',
    subheading: 'From foundational education to professional skills, Stellar Institute shapes futures at every stage.',
    cta: { text: 'Explore Programs', link: '/skilled-institute' },
    cta2: { text: 'Contact Us', link: '/contact' },
    defaultImage: '/assets/stellar_images/hero_slide_1.jpg'
  },
  {
    tag: 'Stellar Academy',
    heading: 'Your Path to Top Grades\nStarts Here.',
    subheading: 'Preparing students for board exams with the guidance and discipline needed to score the highest grades.',
    cta: { text: 'View Programs', link: '/academy' },
    cta2: { text: 'Register Now', link: '/admission' },
    defaultImage: '/assets/stellar_images/hero_slide_2.jpg'
  },
  {
    tag: 'Stellar Skilled Institute',
    heading: 'Learn Skills. Build a Career.\nStart earning.',
    subheading: 'Master Graphic Design, Digital Marketing, Web Development, and more, and unlock real earning opportunities with international clients.',
    cta: { text: 'Browse Courses', link: '/skilled-institute' },
    cta2: { text: 'Enroll Now', link: '/admission' },
    defaultImage: '/assets/stellar_images/hero_slide_3.jpg'
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const { loaded } = useWebsiteImages();

  const goTo = useCallback((index) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent(prev => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, loaded]);

  const slide = slides[current];

  return (
    <section className="hero-slider" id="hero-slider" style={{ position: 'relative' }}>
      <Suspense fallback={null}>
        <ThreeBackground />
      </Suspense>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="hero-slide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-slide-bg" style={{ position: 'absolute', inset: 0, zIndex: 1, width: '100%', height: '100%' }}>
            <ImagePlaceholder 
              label={`Hero Slide ${current + 1}`} 
              placeholderKey={`Hero Slide ${current + 1}`}
              fallbackUrl={slide.defaultImage}
              priority={current === 0} 
            />
          </div>
          <div className="hero-slide-overlay" />
          
          {/* Decorative shapes */}
          <div className="hero-deco">
            <div className="hero-deco-ring hero-deco-ring-1" />
            <div className="hero-deco-ring hero-deco-ring-2" />
            <div className="hero-deco-line hero-deco-line-1" />
          </div>

          <div className="container hero-slide-content">
            <motion.span
              className="hero-tag"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {slide.tag}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease: [0.25, 0.8, 0.25, 1] }}
            >
              {slide.heading.split('\n').map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}
            </motion.h1>
            {slide.subheading && (
              <motion.p
                className="hero-subheading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', marginBottom: '30px', maxWidth: '600px', lineHeight: '1.6' }}
              >
                {slide.subheading}
              </motion.p>
            )}
            <motion.div
              className="hero-slide-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Link to={slide.cta.link} className="btn btn-hero-primary">{slide.cta.text}</Link>
              <Link to={slide.cta2.link} className="btn btn-hero-outline">{slide.cta2.text}</Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="hero-progress">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-progress-item ${i === current ? 'active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          >
            <span className="hero-progress-num">{String(i + 1).padStart(2, '0')}</span>
            {i === current && <span className="hero-progress-bar" />}
          </button>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-indicator">
        <span className="scroll-text">Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
