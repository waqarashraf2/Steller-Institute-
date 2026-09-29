import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import CertificateTemplate from '../components/CertificateTemplate';
import SEO from '../components/SEO';
import './VerifyCertificate.css';

export default function VerifyCertificate() {
  const { regNo: paramRegNo } = useParams();
  const [searchParams] = useSearchParams();
  const queryReg = searchParams.get('id') || searchParams.get('reg');

  const initialReg = paramRegNo || queryReg || '';
  const [searchInput, setSearchInput] = useState(initialReg);
  const [currentReg, setCurrentReg] = useState(initialReg);
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(Boolean(initialReg));
  const [searched, setSearched] = useState(Boolean(initialReg));
  const [error, setError] = useState('');

  const certRef = useRef(null);

  useEffect(() => {
    if (!currentReg) {
      setLoading(false);
      setCertData(null);
      return;
    }

    let active = true;
    setLoading(true);
    setError('');
    setCertData(null);
    const API = import.meta.env.VITE_API_URL || '/api';

    const verifyCertificate = async () => {
      try {
        const response = await fetch(`${API}/certificates?reg=${encodeURIComponent(currentReg.trim())}`);
        let data = null;
        try {
          data = await response.json();
        } catch {
          // Treat a non-JSON response as a service error below.
        }

        if (response.status === 404 || data?.found === false) {
          if (active) setError('No official record found for this Registration Number.');
        } else if (!response.ok) {
          throw new Error(data?.error || 'Certificate service request failed');
        } else if (data?.found && data?.certificate) {
          if (active) setCertData(data.certificate);
        } else if (active) {
          setError('No official record found for this Registration Number.');
        }
      } catch (err) {
        console.error('Verification error:', err);
        if (active) setError('The verification service is unavailable. Please try again later.');
      } finally {
        if (active) {
          setLoading(false);
          setSearched(true);
        }
      }
    };

    verifyCertificate();
    return () => {
      active = false;
    };
  }, [currentReg]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCurrentReg(searchInput.trim());
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="verify-page">
      <SEO
        title="Verify Certificate — Official Verification Portal | Stellar Institute"
        description="Verify the authenticity of Stellar Institute student certificates and diplomas online using registration or roll numbers."
        canonical="https://stellarinstitute.pk/verify"
        keywords="stellar certificate verification, verify diploma lahore, online certificate validation, student credential check"
      />
      <div className="verify-container">
        {/* Header */}
        <div className="verify-header">
          <div className="verify-badge-top">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
            </svg>
            Official Credential Registry
          </div>
          <h1 className="verify-title">Certificate Authenticity Verification</h1>
          <p className="verify-subtitle">
            Stellar Institute & Academy verifies the credentials of students who have completed accredited academic and professional skill programs.
          </p>
        </div>

        {/* Search Bar */}
        <div className="verify-search-card no-print">
          <form className="verify-search-form" onSubmit={handleSearch}>
            <input
              type="text"
              className="verify-input"
              placeholder="Enter Registration No (e.g. STI250189)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="verify-btn">
              Verify Credential
            </button>
          </form>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '50px 0', color: '#64748b' }}>
            <p>Verifying credentials with official database registry...</p>
          </div>
        )}

        {/* Results */}
        {!loading && searched && (
          <>
            {certData && certData.is_valid ? (
              <>
                {/* Green Valid Status Banner */}
                <div className="verify-status-banner">
                  <div className="verify-status-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </div>
                  <div className="verify-status-text">
                    <h3>Verified Authentic Certificate</h3>
                    <p>
                      This certificate is officially recognized and issued by <strong>Stellar Institute & Academy</strong>. All course requirements were successfully fulfilled.
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="verify-details-grid no-print">
                  <div className="verify-detail-card">
                    <div className="verify-detail-label">Student Name</div>
                    <div className="verify-detail-value">{certData.student_name}</div>
                  </div>
                  <div className="verify-detail-card">
                    <div className="verify-detail-label">Registration No</div>
                    <div className="verify-detail-value" style={{ color: '#0284c7' }}>
                      {certData.registration_no}
                    </div>
                  </div>
                  {certData.cnic && (
                    <div className="verify-detail-card">
                      <div className="verify-detail-label">Student CNIC</div>
                      <div className="verify-detail-value" style={{ color: '#0f172a' }}>
                        {certData.cnic}
                      </div>
                    </div>
                  )}
                  {certData.duration_from && certData.duration_to && (
                    <div className="verify-detail-card">
                      <div className="verify-detail-label">Course Duration</div>
                      <div className="verify-detail-value">
                        {new Date(certData.duration_from).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} to {new Date(certData.duration_to).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  )}
                  <div className="verify-detail-card">
                    <div className="verify-detail-label">Course Completed</div>
                    <div className="verify-detail-value">{certData.course_title}</div>
                  </div>
                  <div className="verify-detail-card">
                    <div className="verify-detail-label">Issue Date</div>
                    <div className="verify-detail-value">
                      {certData.issue_date ? new Date(certData.issue_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Verified'}
                    </div>
                  </div>
                </div>

                {/* Certificate Visual Preview */}
                <div className="verify-cert-preview-card">
                  <div className="cert-outer-wrapper">
                    <CertificateTemplate
                      ref={certRef}
                      student_name={certData.student_name}
                      registration_no={certData.registration_no}
                      cnic={certData.cnic || ''}
                      course_title={certData.course_title}
                      course_duration={certData.course_duration}
                      duration_from={certData.duration_from || ''}
                      duration_to={certData.duration_to || ''}
                      issue_date={certData.issue_date || ''}
                      principal_title={certData.principal_title}
                      instructor_title={certData.instructor_title}
                    />
                  </div>

                  <div className="verify-actions no-print">
                    <button className="verify-print-btn" onClick={handlePrint}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 6 2 18 2 18 9" />
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                        <rect x="6" y="14" width="12" height="8" />
                      </svg>
                      Print / Save Certificate
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Invalid / Not Found Banner */
              <div className="verify-status-banner invalid">
                <div className="verify-status-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                  </svg>
                </div>
                <div className="verify-status-text">
                  <h3>Certificate Not Found or Invalid</h3>
                  <p>
                    {error || 'The registration number provided does not match any accredited certificate record in our registry. Please ensure the registration number is correct.'}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
