import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FloatingShapes from '../components/FloatingShapes';

export default function ComingSoon() {
  return (
    <div className="lms-home" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <section className="lms-hero relative" style={{ padding: '0', width: '100%' }}>
        <FloatingShapes />
        <div className="container relative z-10 text-center">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: 'spring' }}
          >
            <h1 style={{ fontSize: '64px', marginBottom: '20px' }}>Coming Soon</h1>
            <p style={{ fontSize: '20px', maxWidth: '600px', margin: '0 auto 40px auto' }}>
              We're currently working hard on this feature. It will be available very soon. Stay tuned for something amazing!
            </p>
            <div className="hero-buttons">
              <Link to="/" className="btn btn-primary pulse-hover">Return Home</Link>
              <Link to="/contact" className="btn btn-secondary bounce-hover">Contact Us</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
