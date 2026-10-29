import { useRef, useState, useEffect, useCallback } from 'react';
import './TestimonialCarousel.css';

const CARD_WIDTH = 340;
const CARD_GAP = 24;
const STEP = CARD_WIDTH + CARD_GAP;

export default function TestimonialCarousel({ testimonials }) {
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const [isDragging, setIsDragging] = useState(false);
  
  const dragStart = useRef(null);
  const dragOffset = useRef(0);
  const rafRef = useRef(null);
  const targetOffset = useRef(0);
  const currentOffset = useRef(0);
  const velRef = useRef(0);
  const lastX = useRef(0);
  const lastT = useRef(0);

  const items = [...testimonials, ...testimonials, ...testimonials];
  const total = testimonials.length;
  const loopWidth = total * STEP;

  const normalise = useCallback((val) => {
    // keep in range [0, loopWidth)
    return ((val % loopWidth) + loopWidth) % loopWidth;
  }, [loopWidth]);

  // Animation loop
  useEffect(() => {
    let running = true;
    const animate = () => {
      if (!running) return;
      currentOffset.current += (targetOffset.current - currentOffset.current) * 0.08;
      const offset = normalise(currentOffset.current);
      
      // Update DOM nodes directly to avoid React re-renders 60fps
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        
        const pos = (index * STEP - offset + loopWidth * 10) % (items.length * STEP);
        const center = ((items.length * STEP) / 2);
        const relPos = pos - center;

        // Curve: arc the cards
        const normalised = relPos / (items.length * STEP / 2); // -1 to 1
        const angle = normalised * 40; // degrees
        const depth = Math.cos((normalised * Math.PI) / 2) * 200 - 200;
        const yShift = Math.abs(normalised) * 60;
        const scale = 1 - Math.abs(normalised) * 0.25;
        let opacity = 1 - Math.abs(normalised) * 0.7;

        // Only show cards near center
        const visible = Math.abs(relPos) < (STEP * 4);

        if (visible) {
          card.style.transform = `translateX(${relPos}px) translateZ(${depth}px) rotateY(${angle}deg) translateY(${yShift}px) scale(${scale})`;
          card.style.opacity = Math.max(0.1, opacity);
          card.style.zIndex = Math.round(100 - Math.abs(normalised) * 50);
          card.style.pointerEvents = 'auto';
        } else {
          card.style.opacity = 0;
          card.style.pointerEvents = 'none';
        }
      });
      
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, [loopWidth, items.length, normalise]);

  // Auto-scroll
  useEffect(() => {
    if (isDragging) return;
    const id = setInterval(() => {
      targetOffset.current += 0.5;
    }, 16);
    return () => clearInterval(id);
  }, [isDragging]);

  const onPointerDown = useCallback((e) => {
    setIsDragging(true);
    dragStart.current = e.clientX ?? e.touches?.[0]?.clientX;
    dragOffset.current = targetOffset.current;
    lastX.current = dragStart.current;
    lastT.current = Date.now();
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!isDragging) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX;
    const now = Date.now();
    velRef.current = (lastX.current - x) / Math.max(now - lastT.current, 1);
    lastX.current = x;
    lastT.current = now;
    const delta = dragStart.current - x;
    targetOffset.current = dragOffset.current + delta;
  }, [isDragging]);

  const onPointerUp = useCallback(() => {
    setIsDragging(false);
    // fling
    targetOffset.current += velRef.current * 80;
  }, []);

  return (
    <div
      className="tc-scene"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div className="tc-track" ref={trackRef}>
        {items.map((t, i) => (
          <div 
            key={i} 
            className="tc-card" 
            ref={el => cardRefs.current[i] = el}
            style={{ opacity: 0 }} // Initial state before first frame
          >
            <div className="tc-card-inner">
              {/* Stars */}
              <div className="tc-stars">{'★★★★★'}</div>

              {/* Quote mark */}
              <div className="tc-quote-icon">"</div>

              {/* Quote text */}
              <p className="tc-quote">{t.quote}</p>

              {/* Divider */}
              <div className="tc-divider" />

              {/* Author */}
              <div className="tc-author">
                <div className="tc-avatar">
                  {t.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="tc-author-info">
                  <div className="tc-name">{t.name}</div>
                  <div className="tc-role">{t.role}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hint */}
      <p className="tc-hint">Drag to explore all reviews</p>
    </div>
  );
}
