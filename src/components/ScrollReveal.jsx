import React from 'react';
import { motion } from 'framer-motion';

const ScrollReveal = React.memo(function ScrollReveal({ children, direction = 'up', delay = 0, className = '' }) {
  // Initial states based on direction
  let startState = { opacity: 0 };
  switch (direction) {
    case 'up': startState.y = 40; break;
    case 'down': startState.y = -40; break;
    case 'left': startState.x = -40; break;
    case 'right': startState.x = 40; break;
    case 'scale': startState.scale = 0.9; break;
  }

  return (
    <motion.div
      initial={startState}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.16, 1, 0.3, 1] // power3.out equivalent
      }}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
});

export default ScrollReveal;
