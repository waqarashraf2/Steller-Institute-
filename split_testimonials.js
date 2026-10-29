import fs from 'node:fs';
let code = fs.readFileSync('src/pages/Home.jsx', 'utf8');

const newTestimonialsHtml = `      {/* ===== TESTIMONIALS ===== */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header">
            <div className="section-label">Testimonials</div>
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Student Reviews
            </motion.h2>
          </div>

          <div style={{ marginBottom: '60px' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2rem', color: 'var(--primary-dark)' }}>Stellar Academy</h3>
            <div className="testimonials-stagger">
              {/* Added placeholders for Stellar Academy video testimonials */}
              {[1, 2, 3].map((i) => (
                <ScrollReveal key={'acad-'+i} delay={i * 0.1}>
                  <div className="test-card video-test-card" style={{ padding: '0', overflow: 'hidden', height: '350px', background: '#000', borderRadius: '16px', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'white' }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="white" style={{ opacity: 0.8, marginBottom: '10px' }}><path d="M8 5v14l11-7z"/></svg>
                      <span style={{ fontSize: '1rem', fontWeight: 600 }}>Video Placeholder {i}</span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2rem', color: 'var(--primary-dark)' }}>Stellar Skilled Institute</h3>
            <div className="testimonials-stagger">
              {/* Added placeholders for Stellar Skilled Institute video testimonials */}
              {[1, 2, 3].map((i) => (
                <ScrollReveal key={'skill-'+i} delay={i * 0.1}>
                  <div className="test-card video-test-card" style={{ padding: '0', overflow: 'hidden', height: '350px', background: '#000', borderRadius: '16px', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'white' }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="white" style={{ opacity: 0.8, marginBottom: '10px' }}><path d="M8 5v14l11-7z"/></svg>
                      <span style={{ fontSize: '1rem', fontWeight: 600 }}>Video Placeholder {i}</span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>`;

// Replace old testimonials
code = code.replace(/\{\/\* ===== TESTIMONIALS ===== \*\/\}[\s\S]*?<\/section>/, newTestimonialsHtml);
fs.writeFileSync('src/pages/Home.jsx', code);
console.log('Replaced testimonials section with video placeholders');
