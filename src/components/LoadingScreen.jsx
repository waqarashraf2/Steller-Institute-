import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Elegant minimum loading time to show the brand, even if assets load instantly
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onLoadingComplete) {
        setTimeout(onLoadingComplete, 400); // Give time for the exit animation
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  // Premium cubic-bezier transition curves for high-end feel
  const smoothCurve = [0.16, 1, 0.3, 1];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="premium-loader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            y: "-10%",
            filter: "blur(10px)",
          }}
          transition={{ 
            duration: 1.2, 
            ease: smoothCurve 
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'var(--bg-color, #ffffff)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            // Subtle noise texture overlay for editorial feel
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E")`
          }}
        >
          {/* Outer Shell - The Double-Bezel approach for a hardware-like feel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.4, ease: smoothCurve, delay: 0.2 }}
            style={{
              padding: '24px',
              borderRadius: '2rem',
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Inner Core */}
            <motion.div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'calc(2rem - 12px)',
                backgroundColor: '#ffffff',
                boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.05), 0 10px 30px -10px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {/* Logo Hat (Favicon) */}
              <motion.img 
                src="/stellar_fav.png" 
                alt="Stellar Academy" 
                style={{ width: '32px', height: 'auto', zIndex: 2 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: smoothCurve, delay: 0.4 }}
              />
              
              {/* Subtle sweeping light effect */}
              <motion.div 
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: '100%', opacity: 0.5 }}
                transition={{ 
                  duration: 2, 
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 0.5
                }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                  zIndex: 3,
                  transform: 'skewX(-20deg)'
                }}
              />
            </motion.div>
          </motion.div>

          {/* Minimalist Micro-Typography */}
          <motion.div
            initial={{ opacity: 0, filter: 'blur(4px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: smoothCurve, delay: 0.6 }}
            style={{
              marginTop: '40px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <span style={{
              fontFamily: "var(--font-main, 'Inter', sans-serif)",
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--primary-dark, #0f172a)'
            }}>
              Stellar Institute
            </span>
            
            {/* Elegant tiny progress indicator line */}
            <div style={{
              width: '40px',
              height: '1px',
              backgroundColor: 'rgba(0,0,0,0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.8, ease: smoothCurve, delay: 0.2 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  backgroundColor: 'var(--primary-dark, #0f172a)'
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
