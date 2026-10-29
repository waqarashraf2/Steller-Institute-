import { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './CertificateTemplate.css';

const formatDate = (d) => {
  if (!d) return '';
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return d;
  }
};

const CertificateTemplate = forwardRef(function CertificateTemplate(
  {
    student_name = 'Anas Ali',
    registration_no = 'STI250189',
    cnic = '',
    course_title = 'Digital Marketing and Website Development',
    course_duration = 'A 3-Month Professional Course Conducted by Stellar Institute.',
    duration_from = '',
    duration_to = '',
    issue_date = '',
    principal_title = 'Stellar Institute',
    instructor_title = 'Stellar Institute',
    verification_url,
  },
  ref
) {
  // Construct absolute verification URL (defaults to official domain)
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://stellarinstitute.pk';
  const qrUrl = verification_url || `${origin}/verify/${registration_no}`;

  const renderCourseDuration = () => {
    let text = course_duration || 'A 3-Month Professional Course Conducted by Stellar Institute.';
    if (text.includes('Stellar Institute')) {
      return (
        <>
          <span>{text.replace(/Stellar Institute\.?/g, '').trim()} </span>
          <span className="cert-desc-bold">Stellar Institute.</span>
        </>
      );
    }
    return <span>{text}</span>;
  };

  return (
    <div className="cert-container" ref={ref} id="printable-certificate">
      {/* ─── Inner Framing Border ─────────────────────────────────── */}
      <div className="cert-inner-frame" />

      {/* ─── Corner Brackets (Exact Replica) ───────────────────────── */}
      <div className="cert-bracket-tl" />
      <div className="cert-bracket-tr" />
      <div className="cert-bracket-bl-v" />
      <div className="cert-bracket-bl-h" />
      <div className="cert-bracket-br-v" />
      <div className="cert-bracket-br-h" />

      {/* ─── Center Background Watermark (Official Logo Emblem) ──────── */}
      <img 
        src="/cert_watermark.png" 
        alt="Stellar Watermark" 
        className="cert-watermark-img"
        crossOrigin="anonymous"
      />

      {/* ─── Left Main Content (White Canvas) ──────────────────────── */}
      <div className="cert-main">
        {/* Top Header & Official Logo */}
        <div className="cert-header">
          <img
            src="/stellar_institute_logo.png"
            alt="Stellar Institute"
            className="cert-logo-img"
          />
          <div className="cert-header-tagline" style={{ opacity: 0.1 }}>
            A Project of Stellar Education System
          </div>
        </div>

        {/* Certificate Text Body */}
        <div className="cert-body">
          <p className="cert-intro-text">This is to certify that</p>

          <div className="cert-student-name-wrap">
            <span className="cert-student-name">{student_name || 'Anas Ali'}</span>
            <div className="cert-name-underline" />
          </div>

          <p className="cert-middle-text">
            {cnic ? (
              <>bearing CNIC <strong>{cnic}</strong> has successfully completed the</>
            ) : (
              'has successfully completed the'
            )}
          </p>

          <h2 className="cert-course-title">{course_title}</h2>

          <div className="cert-course-desc">
            {renderCourseDuration()}
          </div>

          <div className="cert-meta-row">
            <div className="cert-meta-item">
              <span className="cert-meta-label">Issue Date: </span>
              <span className="cert-meta-val">{formatDate(issue_date || new Date())}</span>
            </div>
            {duration_from && duration_to && (
              <div className="cert-meta-item">
                <span className="cert-meta-label">Duration: </span>
                <span className="cert-meta-val">{formatDate(duration_from)} to {formatDate(duration_to)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Signatures Area */}
        <div className="cert-signatures-row">
          <div className="cert-signatures">
            <div className="cert-sig-block">
              <div className="cert-sig-line" />
              <span className="cert-sig-role">PRINCIPAL</span>
              <span className="cert-sig-org">{principal_title}</span>
            </div>
            <div className="cert-sig-block">
              <div className="cert-sig-line" />
              <span className="cert-sig-role">INSTRUCTOR</span>
              <span className="cert-sig-org">{instructor_title}</span>
            </div>
          </div>
        </div>

        {/* Footer Info Strip */}
        <div className="cert-footer-strip">
          <div className="cert-footer-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
            </svg>
            <span>+92 300 0652124</span>
          </div>
          <div className="cert-footer-div" />
          <div className="cert-footer-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
            </svg>
            <span>Stellar Institute, 1-Montgomery Road, Lahore</span>
          </div>
          <div className="cert-footer-div" />
          <div className="cert-footer-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
            </svg>
            <span>www.stellarinstitute.pk</span>
          </div>
        </div>
      </div>

      {/* ─── Right Navy Banner & Accents (Exact Replica) ───────────── */}
      <div className="cert-banner-wrapper">
        <div className="cert-banner-container">
          {/* Vector Image Background with exact Swallowtail V-cut and Yellow border (100% Canvas & PDF Compatible) */}
          <img
            src="/cert_banner_bg.svg"
            alt="Banner Vector"
            className="cert-banner-bg-img"
            crossOrigin="anonymous"
          />

          <div className="cert-banner">
            {/* Top Registration Info */}
            <div className="cert-banner-top-group">
              <span className="cert-reg-title">REGISTRATION NO.</span>
              <div className="cert-reg-pill-wrap">
                <div className="cert-reg-dash" />
                <div className="cert-reg-pill">{registration_no}</div>
                <div className="cert-reg-dash" />
              </div>
            </div>

            {/* Original Laurel Wreath & Cap Emblem Asset with Side Accent Lines */}
            <div className="cert-badge-crest-wrap">
              <img
                src="/cert_laurel_crest.png?v=2"
                alt="Laurel Crest"
                className="cert-laurel-crest-img"
              />
            </div>

            {/* Certificate of Completion Heading */}
            <div className="cert-banner-heading-wrap">
              <h3 className="cert-banner-main-title">CERTIFICATE</h3>
              <span className="cert-banner-sub-title">OF COMPLETION</span>
            </div>

            <div className="cert-banner-divider-line" />

            {/* Dynamic QR Code Card (Positioned snugly near bottom V-cut) */}
            <div className="cert-qr-card">
              <div className="cert-qr-box">
                <QRCodeSVG
                  value={qrUrl}
                  size={54}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <div className="cert-qr-text">
                <span className="cert-qr-heading">SCAN TO VERIFY</span>
                <span className="cert-qr-subtext">Certificate Verification</span>
                <span className="cert-qr-reg">{registration_no}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CertificateTemplate;
