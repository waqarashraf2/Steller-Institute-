import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import React, { useEffect, useState, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy load pages for better performance (code splitting)
const Home = React.lazy(() => import('./pages/Home'));
const Academy = React.lazy(() => import('./pages/Academy'));
const Grades5to8 = React.lazy(() => import('./pages/academy/Grades5to8'));
const Matric = React.lazy(() => import('./pages/academy/Matric'));
const Intermediate = React.lazy(() => import('./pages/academy/Intermediate'));
const OALevels = React.lazy(() => import('./pages/academy/OALevels'));
const SkilledInstitute = React.lazy(() => import('./pages/SkilledInstitute'));
const School = React.lazy(() => import('./pages/School'));
const College = React.lazy(() => import('./pages/College'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Admission = React.lazy(() => import('./pages/Admission'));
const AdmissionThankYou = React.lazy(() => import('./pages/AdmissionThankYou'));
const ComingSoon = React.lazy(() => import('./pages/ComingSoon'));
const StellarAdmin = React.lazy(() => import('./pages/StellarAdmin'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));

import CursorTrail from './components/CursorTrail';
import AnnouncementPopup from './components/AnnouncementPopup';
import PageTransition from './components/PageTransition';
import { WebsiteImagesProvider } from './components/WebsiteImagesProvider';
import { CoursesProvider } from './components/CoursesProvider';
import LoadingScreen from './components/LoadingScreen';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px' }}>
      <div>
        <h1 style={{ fontSize: '72px', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>404</h1>
        <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '32px' }}>The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">Return Home</Link>
      </div>
    </div>
  );
}

function AppLayout() {
  const location = useLocation();
  return (
    <>
      <Navbar />
      <main>
        <PageTransition>
          <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="loading-spinner"></div></div>}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/academy" element={<Academy />} />
              <Route path="/academy/grades-5-8" element={<Grades5to8 />} />
              <Route path="/academy/matric" element={<Matric />} />
              <Route path="/academy/intermediate" element={<Intermediate />} />
              <Route path="/academy/o-a-levels" element={<OALevels />} />
              <Route path="/skilled-institute" element={<SkilledInstitute />} />
              <Route path="/school" element={<School />} />
              <Route path="/college" element={<College />} />
              <Route path="/about" element={<About />} />
              <Route path="/admission" element={<Admission />} />
              <Route path="/admission/thankyou" element={<AdmissionThankYou />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/coming-soon" element={<ComingSoon />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </PageTransition>
      </main>
      <Footer />
    </>
  );
}

function App() {
  // Loading screen logic - locks scroll while loading
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isLoading]);

  return (
    <WebsiteImagesProvider>
      <CoursesProvider>
        <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
        <Router>
          <CursorTrail />
          <ScrollToTop />
          <AnnouncementPopup />
          <Routes>
            <Route path="/stellar-admin" element={
              <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="loading-spinner"></div></div>}>
                <StellarAdmin />
              </Suspense>
            } />
            <Route path="*" element={
              <PageTransition>
                <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="loading-spinner"></div></div>}>
                  <AppLayout />
                </Suspense>
              </PageTransition>
            } />
          </Routes>
        </Router>
      </CoursesProvider>
    </WebsiteImagesProvider>
  );
}

export default App;
