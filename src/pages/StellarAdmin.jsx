import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { itCourses, beautyCourses } from '../data/courses';
import CertificateTemplate from '../components/CertificateTemplate';
import './StellarAdmin.css';

const API = import.meta.env.VITE_API_URL || '/api';
const emptyAnn = {
  title: '', body: '', type: 'popup', priority: 'normal',
  link_url: '', link_text: '', image_url: '',
  is_active: true, start_date: '', end_date: ''
};
const emptyImg = {
  placeholder_key: '', image_url: ''
};

const createDefaultRegNo = () => {
  const yy = new Date().getFullYear().toString().slice(-2);
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `STI${yy}${rand}`;
};

const emptyCert = {
  registration_no: '',
  student_name: '',
  cnic: '',
  course_title: 'Digital Marketing and Website Development',
  course_duration: 'A 3-Month Professional Course Conducted by Stellar Institute.',
  duration_from: '',
  duration_to: '',
  conducted_by: 'Stellar Institute.',
  issue_date: new Date().toISOString().split('T')[0],
  principal_title: 'Stellar Institute',
  instructor_title: 'Stellar Institute',
  is_valid: true
};

export default function StellarAdmin() {
  const [token, setToken] = useState(sessionStorage.getItem('stellar-admin-token') || '');
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  const [activeTab, setActiveTabState] = useState(() => {
    return sessionStorage.getItem('stellar-admin-active-tab') || 'announcements';
  });

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    sessionStorage.setItem('stellar-admin-active-tab', tab);
  };
  const [loading, setLoading] = useState(false);

  // Announcements State
  const [anns, setAnns] = useState([]);
  const [showAnnForm, setShowAnnForm] = useState(false);
  const [editingAnn, setEditingAnn] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [annForm, setAnnForm] = useState(emptyAnn);

  // Images State
  const [websiteImages, setWebsiteImages] = useState([]);
  const [showImgForm, setShowImgForm] = useState(false);
  const [imgForm, setImgForm] = useState(emptyImg);

  // Courses State
  const emptyCourse = { category: 'it', title: '', duration: '', image_url: '', banner_url: '', base_price: '', discount_price: '', special_offer_tag: '' };
  const [courses, setCourses] = useState([]);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState(emptyCourse);

  // Certificates State
  const [certificates, setCertificates] = useState([]);
  const [certForm, setCertForm] = useState({ ...emptyCert, registration_no: createDefaultRegNo() });
  const [editingCertId, setEditingCertId] = useState(null);
  const [certSearch, setCertSearch] = useState('');
  const [savingCert, setSavingCert] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [previewZoom, setPreviewZoom] = useState('fit'); // 'fit' | '100'
  const certPrintRef = useRef(null);

  // Pages state
  const [privacyPolicy, setPrivacyPolicy] = useState('');
  const [savingPolicy, setSavingPolicy] = useState(false);

  const headers = useCallback(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }), [token]);

  const fetchData = useCallback(async (showLoading = false) => {
    if (!token) return;
    if (showLoading) setLoading(true);
    try {
      const [rAnns, rImgs, rCourses, rPages, rCerts] = await Promise.all([
        fetch(`${API}/admin-announcements`, { headers: headers() }),
        fetch(`${API}/admin-images`, { headers: headers() }),
        fetch(`${API}/courses`, { headers: headers() }),
        fetch(`${API}/pages?slug=privacy-policy`),
        fetch(`${API}/admin-certificates`, { headers: headers() }).catch(() => ({ ok: false }))
      ]);
      
      if (rAnns.status === 401 || rCourses.status === 401) { logout(); return; }
      
      if (rAnns.ok) setAnns(await rAnns.json());
      if (rImgs.ok) setWebsiteImages(await rImgs.json());
      
      const localCourses = getLocalCourses();
      const initialDefault = [
        ...itCourses.map(c => ({ ...c, category: 'it', image_url: c.image, banner_url: c.bannerImage })),
        ...beautyCourses.map(c => ({ ...c, category: 'beauty', image_url: c.image, banner_url: c.bannerImage }))
      ];

      if (rCourses && rCourses.ok) {
        const dbCourses = await rCourses.json();
        const baseList = (Array.isArray(dbCourses) && dbCourses.length > 0) ? dbCourses : initialDefault;
        const merged = baseList.map(c => {
          const override = localCourses.find(lc => 
            (lc.id && c.id && String(lc.id) === String(c.id)) || 
            (lc.title && c.title && lc.title.trim().toLowerCase() === c.title.trim().toLowerCase())
          );
          return override ? { ...c, ...override } : c;
        });
        setCourses(merged);
      } else {
        const merged = initialDefault.map(c => {
          const override = localCourses.find(lc => 
            (lc.id && c.id && String(lc.id) === String(c.id)) || 
            (lc.title && c.title && lc.title.trim().toLowerCase() === c.title.trim().toLowerCase())
          );
          return override ? { ...c, ...override } : c;
        });
        setCourses(merged);
      }

      if (rPages.ok) {
        const pData = await rPages.json();
        setPrivacyPolicy(pData.content || '');
      }
      if (rCerts && rCerts.ok) {
        const apiCerts = await rCerts.json();
        if (Array.isArray(apiCerts)) {
          const local = getLocalCerts();
          const unSynced = local.filter(lc => lc.registration_no && !apiCerts.some(ac => ac.registration_no?.toUpperCase() === lc.registration_no?.toUpperCase()));
          if (unSynced.length > 0) {
            for (const cert of unSynced) {
              const { id, ...certData } = cert;
              const validIntId = id && Number.isInteger(Number(id)) && Number(id) < 2147483647 ? Number(id) : null;
              try {
                const syncRes = await fetch(`${API}/admin-certificates`, {
                  method: 'POST',
                  headers: headers(),
                  body: JSON.stringify(validIntId ? { ...certData, id: validIntId } : certData)
                });
                if (syncRes.ok) {
                  const saved = await syncRes.json();
                  apiCerts.unshift(saved);
                }
              } catch (e) {
                console.warn('Auto-sync local cert failed:', e);
              }
            }
          }
          saveLocalCerts(apiCerts);
          setCertificates(apiCerts);
        } else {
          setCertificates(getLocalCerts());
        }
      } else {
        setCertificates(getLocalCerts());
      }
    } catch {}
    if (showLoading) setLoading(false);
  }, [token, headers]);

  useEffect(() => {
    if (token) {
      const s = sessionStorage.getItem('stellar-admin-user');
      if (s) setUser(JSON.parse(s));
      fetchData(true);
    }
  }, [token, fetchData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const r = await fetch(`${API}/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const d = await r.json();
      if (d.success) {
        setToken(d.token);
        setUser(d.user);
        sessionStorage.setItem('stellar-admin-token', d.token);
        sessionStorage.setItem('stellar-admin-user', JSON.stringify(d.user));
      } else {
        setLoginError(d.error || 'Login failed');
      }
    } catch {
      setLoginError('Network error');
    }
    setLoginLoading(false);
  };

  const logout = () => {
    setToken('');
    setUser(null);
    sessionStorage.removeItem('stellar-admin-token');
    sessionStorage.removeItem('stellar-admin-user');
  };

  // --- ANNOUNCEMENTS LOGIC ---
  const handleSaveAnn = async (e) => {
    e.preventDefault();
    const method = editingAnn ? 'PUT' : 'POST';
    const payload = editingAnn ? { ...annForm, id: editingAnn.id } : annForm;
    try {
      const r = await fetch(`${API}/admin-announcements`, {
        method, headers: headers(), body: JSON.stringify(payload)
      });
      if (r.ok) {
        setShowAnnForm(false);
        setEditingAnn(null);
        setAnnForm(emptyAnn);
        fetchData();
      } else {
        const d = await r.json();
        alert('Failed to save: ' + (d.error || 'Server error'));
      }
    } catch {
      alert('Network error.');
    }
  };

  const handleDeleteAnn = async (id) => {
    try {
      await fetch(`${API}/admin-announcements`, {
        method: 'DELETE', headers: headers(), body: JSON.stringify({ id })
      });
      setDeleteTarget(null);
      fetchData();
    } catch {}
  };

  const toggleActiveAnn = async (a) => {
    try {
      await fetch(`${API}/admin-announcements`, {
        method: 'PUT', headers: headers(), body: JSON.stringify({ ...a, is_active: !a.is_active })
      });
      fetchData();
    } catch {}
  };

  const openEditAnn = (a) => {
    setAnnForm({
      title: a.title, body: a.body || '', type: a.type, priority: a.priority,
      link_url: a.link_url || '', link_text: a.link_text || '',
      image_url: a.image_url || '', is_active: a.is_active,
      start_date: a.start_date ? a.start_date.split('T')[0] : '',
      end_date: a.end_date ? a.end_date.split('T')[0] : ''
    });
    setEditingAnn(a);
    setShowAnnForm(true);
  };

  // --- API calls for Pages ---
  const savePrivacyPolicy = async () => {
    setSavingPolicy(true);
    try {
      const res = await fetch(`${API}/admin-pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ slug: 'privacy-policy', content: privacyPolicy }),
      });
      if (!res.ok) throw new Error('Failed to save policy');
      alert('Privacy Policy saved successfully!');
    } catch (error) {
      alert(error.message);
    } finally {
      setSavingPolicy(false);
    }
  };

  // --- IMAGES LOGIC ---
  const handleSaveImg = async (e) => {
    e.preventDefault();
    try {
      const r = await fetch(`${API}/admin-images`, {
        method: 'POST', headers: headers(), body: JSON.stringify(imgForm)
      });
      if (r.ok) {
        setShowImgForm(false);
        setImgForm(emptyImg);
        fetchData();
      } else {
        const d = await r.json();
        alert('Failed to save image: ' + (d.error || 'Server error'));
      }
    } catch {
      alert('Network error.');
    }
  };

  const handleDeleteImg = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      const r = await fetch(`${API}/admin-images`, {
        method: 'DELETE', headers: headers(), body: JSON.stringify({ id })
      });
      if (r.ok) fetchData();
    } catch {}
  };

  const openEditImg = (i) => {
    setImgForm({ placeholder_key: i.placeholder_key, image_url: i.image_url });
    setShowImgForm(true);
  };

  const handleImageUploadBase64 = (e, formSetter, currentForm, field = 'image_url') => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('File too large. Max 10MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        const MAX = 1600; // Increased resolution limit for web backgrounds
        if (w > h && w > MAX) { h *= MAX / w; w = MAX; }
        else if (h > MAX) { w *= MAX / h; h = MAX; }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        formSetter({ ...currentForm, [field]: canvas.toDataURL('image/jpeg', 0.85) });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Helpers for resilient course storage
  const getLocalCourses = () => {
    try {
      return JSON.parse(localStorage.getItem('stellar_custom_courses') || '[]');
    } catch {
      return [];
    }
  };

  const saveLocalCourses = (data) => {
    try {
      localStorage.setItem('stellar_custom_courses', JSON.stringify(data));
      window.dispatchEvent(new Event('stellar_courses_updated'));
    } catch {}
  };

  // --- COURSES LOGIC ---
  const handleSaveCourse = async (e) => {
    e.preventDefault();
    const isEdit = Boolean(editingCourse);
    const targetCourse = { 
      ...(editingCourse || {}), 
      ...courseForm,
      base_price: courseForm.base_price ? Number(courseForm.base_price) : 0,
      discount_price: courseForm.discount_price ? Number(courseForm.discount_price) : 0,
      special_offer_tag: courseForm.special_offer_tag || '',
      id: editingCourse?.id || Date.now()
    };

    // 1. Immediately save to LocalStorage for instant persistence & reactive update
    const local = getLocalCourses();
    let updatedLocal;
    const matchIdx = local.findIndex(c => 
      (c.id && targetCourse.id && String(c.id) === String(targetCourse.id)) ||
      (c.title && targetCourse.title && c.title.trim().toLowerCase() === targetCourse.title.trim().toLowerCase())
    );
    if (matchIdx !== -1) {
      updatedLocal = [...local];
      updatedLocal[matchIdx] = { ...updatedLocal[matchIdx], ...targetCourse };
    } else {
      updatedLocal = [...local, targetCourse];
    }
    saveLocalCourses(updatedLocal);

    // 2. Update state in Admin UI immediately
    setCourses(prev => {
      const exists = prev.some(c => 
        (c.id && targetCourse.id && String(c.id) === String(targetCourse.id)) ||
        (c.title && targetCourse.title && c.title.trim().toLowerCase() === targetCourse.title.trim().toLowerCase())
      );
      if (exists) {
        return prev.map(c => 
          ((c.id && targetCourse.id && String(c.id) === String(targetCourse.id)) ||
           (c.title && targetCourse.title && c.title.trim().toLowerCase() === targetCourse.title.trim().toLowerCase()))
            ? { ...c, ...targetCourse }
            : c
        );
      }
      return [targetCourse, ...prev];
    });

    setShowCourseForm(false);
    setEditingCourse(null);
    setCourseForm(emptyCourse);

    // 3. Save to backend database API
    try {
      const method = isEdit ? 'PUT' : 'POST';
      await fetch(`${API}/courses`, {
        method, headers: headers(), body: JSON.stringify(targetCourse)
      });
    } catch (err) {
      console.warn('API course sync warning:', err);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    // Remove from local storage
    const local = getLocalCourses();
    const updatedLocal = local.filter(c => String(c.id) !== String(id));
    saveLocalCourses(updatedLocal);

    setCourses(prev => prev.filter(c => String(c.id) !== String(id)));

    try {
      await fetch(`${API}/courses`, {
        method: 'DELETE', headers: headers(), body: JSON.stringify({ id })
      });
    } catch {}
  };

  // Helper for resilient certificate storage
  const getLocalCerts = () => {
    try {
      return JSON.parse(localStorage.getItem('stellar_admin_certs') || '[]');
    } catch {
      return [];
    }
  };

  const saveLocalCerts = (certs) => {
    try {
      localStorage.setItem('stellar_admin_certs', JSON.stringify(certs));
    } catch {}
  };

  // --- CERTIFICATES LOGIC ---
  const handleSaveCertificate = async (e) => {
    e.preventDefault();
    if (!certForm.student_name.trim() || !certForm.registration_no.trim()) {
      alert('Please fill in Student Name and Registration No.');
      return;
    }
    setSavingCert(true);
    try {
      const validEditId = editingCertId && Number.isInteger(Number(editingCertId)) && Number(editingCertId) < 2147483647 ? Number(editingCertId) : null;
      const payload = validEditId 
        ? { ...certForm, id: validEditId } 
        : { ...certForm };

      let savedCert = null;
      let apiError = null;
      try {
        const r = await fetch(`${API}/admin-certificates`, {
          method: 'POST',
          headers: headers(),
          body: JSON.stringify(payload)
        });
        if (r.ok) {
          savedCert = await r.json();
        } else {
          const errData = await r.json().catch(() => ({}));
          apiError = errData.error || 'Server error';
          console.warn('Server save warning:', errData);
        }
      } catch (err) {
        apiError = err.message || 'Network error';
        console.warn('API save fallback to local:', err);
      }

      if (apiError && !savedCert) {
        alert(`Warning: Cloud database save failed (${apiError}). Saved to local browser storage only.`);
      }

      const finalRecord = savedCert || (editingCertId ? { ...certForm, id: editingCertId } : { ...certForm, id: Date.now() });

      // Always maintain local storage sync for instant reactivity & offline preview
      const local = getLocalCerts();
      let updated;
      if (editingCertId) {
        updated = local.map(c => (c.id === editingCertId || c.registration_no === finalRecord.registration_no ? { ...c, ...finalRecord } : c));
        if (!updated.some(c => c.registration_no === finalRecord.registration_no)) {
          updated.unshift(finalRecord);
        }
      } else {
        updated = [finalRecord, ...local.filter(c => c.registration_no !== finalRecord.registration_no)];
      }
      saveLocalCerts(updated);
      setCertificates(updated);

      if (!apiError) {
        alert(editingCertId ? 'Certificate updated successfully in database!' : 'Certificate created & saved in database!');
      }
      setEditingCertId(null);
      setCertForm({ ...emptyCert, registration_no: createDefaultRegNo() });
      if (savedCert) fetchData();
    } catch (err) {
      console.error('Save certificate error:', err);
      alert('Error saving certificate. Please try again.');
    } finally {
      setSavingCert(false);
    }
  };

  const syncCertificatesToCloud = async () => {
    const local = getLocalCerts();
    if (local.length === 0) {
      alert('No local certificates found to sync.');
      return;
    }
    setLoading(true);
    let syncedCount = 0;
    for (const cert of local) {
      const { id, ...certData } = cert;
      const validIntId = id && Number.isInteger(Number(id)) && Number(id) < 2147483647 ? Number(id) : null;
      try {
        const res = await fetch(`${API}/admin-certificates`, {
          method: 'POST',
          headers: headers(),
          body: JSON.stringify(validIntId ? { ...certData, id: validIntId } : certData)
        });
        if (res.ok) syncedCount++;
      } catch (err) {
        console.warn('Manual sync failed for:', cert.registration_no, err);
      }
    }
    await fetchData();
    alert(`Sync complete! ${syncedCount} certificate(s) uploaded to cloud database.`);
  };

  const handleEditCertificate = (c) => {
    setEditingCertId(c.id);
    setCertForm({
      registration_no: c.registration_no || '',
      student_name: c.student_name || '',
      cnic: c.cnic || '',
      course_title: c.course_title || '',
      course_duration: c.course_duration || 'A 3-Month Professional Course Conducted by Stellar Institute.',
      duration_from: c.duration_from ? c.duration_from.split('T')[0] : '',
      duration_to: c.duration_to ? c.duration_to.split('T')[0] : '',
      conducted_by: c.conducted_by || 'Stellar Institute.',
      issue_date: c.issue_date ? c.issue_date.split('T')[0] : new Date().toISOString().split('T')[0],
      principal_title: c.principal_title || 'Stellar Institute & Academy',
      instructor_title: c.instructor_title || 'Stellar Institute',
      is_valid: c.is_valid !== undefined ? c.is_valid : true
    });
  };

  const handleDeleteCertificate = async (id, registrationNo) => {
    if (!window.confirm('Are you sure you want to delete this certificate record?')) return;
    try {
      const isMatch = (c) => {
        if (id && c.id && String(c.id) === String(id)) return true;
        if (registrationNo && c.registration_no && c.registration_no.trim().toUpperCase() === registrationNo.trim().toUpperCase()) return true;
        return false;
      };

      setCertificates(prev => prev.filter(c => !isMatch(c)));
      const local = getLocalCerts().filter(c => !isMatch(c));
      saveLocalCerts(local);

      if (editingCertId === id || (registrationNo && certForm.registration_no === registrationNo)) {
        setEditingCertId(null);
        setCertForm({ ...emptyCert, registration_no: createDefaultRegNo() });
      }

      await fetch(`${API}/admin-certificates`, {
        method: 'DELETE',
        headers: headers(),
        body: JSON.stringify({ id, registration_no: registrationNo })
      });
    } catch (err) {
      console.warn('Error deleting certificate:', err);
    }
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById('printable-certificate');
    if (!element) return;
    try {
      setIsGeneratingPdf(true);
      
      // Ensure all certificate fonts are loaded into memory
      if (document.fonts) {
        await Promise.all([
          document.fonts.load('64px "Alex Brush"').catch(() => {}),
          document.fonts.load('bold 26.5px "Inter"').catch(() => {}),
          document.fonts.load('italic 18px "Inter"').catch(() => {}),
          document.fonts.ready
        ]);
      }
      
      // Ensure all images (logo, crest, banner vector) are fully decoded
      const images = Array.from(element.querySelectorAll('img'));
      await Promise.all(
        images.map(img => {
          if (img.complete) return Promise.resolve();
          return img.decode ? img.decode().catch(() => {}) : Promise.resolve();
        })
      );

      const studentSlug = (certForm.student_name || 'Student').replace(/[^a-zA-Z0-9_-]/g, '_');
      const regSlug = certForm.registration_no || 'STI250189';
      const opt = {
        margin: 0,
        filename: `Certificate_${regSlug}_${studentSlug}.pdf`,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { 
          scale: 2.5, 
          useCORS: true, 
          allowTaint: true,
          logging: false,
          scrollY: 0,
          scrollX: 0,
          width: 1000,
          height: 630,
          windowWidth: 1000,
          windowHeight: 630,
          onclone: (clonedDoc) => {
            const el = clonedDoc.getElementById('printable-certificate');
            if (el) {
              el.style.width = '1000px';
              el.style.height = '630px';
              el.style.minWidth = '1000px';
              el.style.minHeight = '630px';
              el.style.maxWidth = '1000px';
              el.style.maxHeight = '630px';
              el.style.transform = 'none';
              el.style.boxShadow = 'none';
              el.style.margin = '0';
              el.style.borderRadius = '0';
            }
          }
        },
        jsPDF: { unit: 'px', format: [1000, 630], orientation: 'landscape', hotfixes: ['px_scaling'] }
      };
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('Direct PDF download failed. Please use Print / Save Certificate PDF.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (!token) return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <img src="/stellar_logo.png" alt="Stellar" className="admin-logo" />
          <h2>Admin Panel</h2>
          <p>Sign in to manage Stellar Institute</p>
        </div>
        <form onSubmit={handleLogin}>
          {loginError && <div className="admin-error">{loginError}</div>}
          <div className="admin-field">
            <label>Username</label>
            <input type="text" value={loginForm.username} onChange={e => setLoginForm({ ...loginForm, username: e.target.value })} required autoFocus />
          </div>
          <div className="admin-field">
            <label>Password</label>
            <input type="password" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} required />
          </div>
          <button type="submit" className="admin-login-btn" disabled={loginLoading}>
            {loginLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="admin-wrapper">
      <div className="admin-topbar">
        <div className="admin-topbar-left">
          <img src="/stellar_logo.png" alt="Stellar" className="admin-topbar-logo" />
          <div className="admin-tabs">
            <button className={`admin-tab-btn ${activeTab === 'announcements' ? 'active' : ''}`} onClick={() => setActiveTab('announcements')}>Announcements</button>
            <button className={`admin-tab-btn ${activeTab === 'images' ? 'active' : ''}`} onClick={() => setActiveTab('images')}>Website Images</button>
            <button className={`admin-tab-btn ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>Course Manager</button>
            <button className={`admin-tab-btn ${activeTab === 'certificates' ? 'active' : ''}`} onClick={() => setActiveTab('certificates')}>Certificates</button>
            <button className={`admin-tab-btn ${activeTab === 'pages' ? 'active' : ''}`} onClick={() => setActiveTab('pages')}>Pages</button>
          </div>
        </div>
        <div className="admin-topbar-right">
          <Link to="/" className="admin-back-link">← Back to Site</Link>
          <span className="admin-user-name">{user?.name || user?.username}</span>
          <button onClick={logout} className="admin-logout-btn">Log out</button>
        </div>
      </div>

      <div className="admin-content">
        {loading && <div className="admin-loading">Loading…</div>}

        {/* --- ANNOUNCEMENTS TAB --- */}
        {!loading && activeTab === 'announcements' && (
          <>
            <div className="admin-stats">
              <div className="stat-card">
                <div className="stat-number">{anns.length}</div>
                <div className="stat-label">Total</div>
              </div>
              <div className="stat-card stat-active">
                <div className="stat-number">{anns.filter(a => a.is_active).length}</div>
                <div className="stat-label">Active</div>
              </div>
              <div className="stat-card stat-urgent">
                <div className="stat-number">{anns.filter(a => a.priority === 'urgent' && a.is_active).length}</div>
                <div className="stat-label">Urgent</div>
              </div>
            </div>

            <div className="admin-actions-bar">
              <h2>All Announcements</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={fetchData} className="admin-logout-btn" title="Refresh">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                </button>
                <button onClick={() => { setAnnForm(emptyAnn); setEditingAnn(null); setShowAnnForm(true); }} className="admin-add-btn">
                  + New Announcement
                </button>
              </div>
            </div>

            {anns.length === 0 ? (
              <div className="admin-empty">No announcements yet.</div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Priority</th>
                      <th>Schedule</th>
                      <th>Active</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {anns.map(a => (
                      <tr key={a.id} className={!a.is_active ? 'row-inactive' : ''}>
                        <td className="td-title">
                          <strong>{a.title}</strong>
                          {a.body && <span className="td-body-preview">{a.body.substring(0, 60)}{a.body.length > 60 && '…'}</span>}
                        </td>
                        <td><span className={`badge badge-type-${a.type}`}>{a.type}</span></td>
                        <td><span className={`badge badge-priority-${a.priority}`}>{a.priority}</span></td>
                        <td className="td-date">
                          {a.start_date ? new Date(a.start_date).toLocaleDateString('en-PK') : '—'}
                          {' → '}
                          {a.end_date ? new Date(a.end_date).toLocaleDateString('en-PK') : '∞'}
                        </td>
                        <td>
                          <button className={`toggle-btn ${a.is_active ? 'toggle-on' : 'toggle-off'}`} onClick={() => toggleActiveAnn(a)}>
                            <span className="toggle-thumb" />
                          </button>
                        </td>
                        <td className="td-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <button onClick={() => openEditAnn(a)} className="action-btn action-edit" title="Edit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                          <button onClick={() => setDeleteTarget(a)} className="action-btn action-delete" title="Delete" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* --- IMAGES TAB --- */}
        {!loading && activeTab === 'images' && (
          <>
            <div className="admin-actions-bar" style={{ marginTop: '20px' }}>
              <div>
                <h2>Website Images</h2>
                <p style={{ color: 'var(--admin-muted)', fontSize: '13px', margin: '4px 0 0 0' }}>Upload high-resolution images. They will be automatically cropped and fitted to placeholders on the website.</p>
              </div>
              <button onClick={() => { setImgForm(emptyImg); setShowImgForm(true); }} className="admin-add-btn">
                + Upload Image
              </button>
            </div>

            <div className="image-grid">
              {websiteImages.length === 0 ? (
                <div className="admin-empty">No website images uploaded yet.</div>
              ) : (
                websiteImages.map(img => (
                  <div key={img.id} className="image-card">
                    <div className="image-card-preview">
                      <img src={img.image_url} alt={img.placeholder_key} />
                    </div>
                    <div className="image-card-info">
                      <div className="image-card-key" title={img.placeholder_key}>{img.placeholder_key}</div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button onClick={() => openEditImg(img)} className="action-btn action-edit" title="Replace" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button onClick={() => handleDeleteImg(img.id)} className="action-btn action-delete" title="Delete" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

      {/* --- ANNOUNCEMENT MODAL --- */}
      {showAnnForm && (
        <div className="admin-modal-overlay" onClick={() => setShowAnnForm(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingAnn ? 'Edit Announcement' : 'New Announcement'}</h3>
              <button onClick={() => setShowAnnForm(false)} className="admin-modal-close">✕</button>
            </div>
            <form onSubmit={handleSaveAnn} className="admin-modal-form">
              <div className="admin-field">
                <label>Title *</label>
                <input type="text" value={annForm.title} onChange={e => setAnnForm({ ...annForm, title: e.target.value })} required />
              </div>
              <div className="admin-field">
                <label>Body</label>
                <textarea value={annForm.body} onChange={e => setAnnForm({ ...annForm, body: e.target.value })} rows={3} />
              </div>
              <div className="admin-field-row">
                <div className="admin-field">
                  <label>Type</label>
                  <select value={annForm.type} onChange={e => setAnnForm({ ...annForm, type: e.target.value })}>
                    <option value="popup">Popup</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label>Priority</label>
                  <select value={annForm.priority} onChange={e => setAnnForm({ ...annForm, priority: e.target.value })}>
                    <option value="normal">Normal</option>
                    <option value="important">Important</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div className="admin-field-row">
                <div className="admin-field">
                  <label>Link URL</label>
                  <input type="url" value={annForm.link_url} onChange={e => setAnnForm({ ...annForm, link_url: e.target.value })} placeholder="https://..." />
                </div>
                <div className="admin-field">
                  <label>Link Text</label>
                  <input type="text" value={annForm.link_text} onChange={e => setAnnForm({ ...annForm, link_text: e.target.value })} placeholder="Apply Now" />
                </div>
              </div>
              <div className="admin-field">
                <label>Image (up to 10MB)</label>
                <input type="file" accept="image/*" onChange={(e) => handleImageUploadBase64(e, setAnnForm, annForm)} />
                {annForm.image_url && (
                  <div style={{ marginTop: 8, position: 'relative', display: 'inline-block' }}>
                    <img src={annForm.image_url} alt="Preview" style={{ height: 64, borderRadius: 4, border: '1px solid var(--admin-border)' }} />
                    <button type="button" onClick={() => setAnnForm({ ...annForm, image_url: '' })} style={{ position: 'absolute', top: -6, right: -6, background: '#171717', color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                  </div>
                )}
              </div>
              <div className="admin-field-row">
                <div className="admin-field">
                  <label>Start Date</label>
                  <input type="date" value={annForm.start_date} onChange={e => setAnnForm({ ...annForm, start_date: e.target.value })} />
                </div>
                <div className="admin-field">
                  <label>End Date</label>
                  <input type="date" value={annForm.end_date} onChange={e => setAnnForm({ ...annForm, end_date: e.target.value })} />
                </div>
              </div>
              <div className="admin-field">
                <label className="admin-checkbox-label">
                  <input type="checkbox" checked={annForm.is_active} onChange={e => setAnnForm({ ...annForm, is_active: e.target.checked })} />
                  Active
                </label>
              </div>
              <div className="admin-modal-actions">
                <button type="button" onClick={() => setShowAnnForm(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">{editingAnn ? 'Save' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- IMAGE UPLOAD MODAL --- */}
      {showImgForm && (
        <div className="admin-modal-overlay" onClick={() => setShowImgForm(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Upload Website Image</h3>
              <button onClick={() => setShowImgForm(false)} className="admin-modal-close">✕</button>
            </div>
            <form onSubmit={handleSaveImg} className="admin-modal-form">
              <div className="admin-field">
                <label>Placeholder Key *</label>
                <input 
                  type="text" 
                  value={imgForm.placeholder_key} 
                  onChange={e => setImgForm({ ...imgForm, placeholder_key: e.target.value })} 
                  required 
                  placeholder="e.g. Campus Photo, Students Photo" 
                  list="placeholder-suggestions"
                  autoComplete="off"
                />
                <datalist id="placeholder-suggestions">
                  <option value="Hero Slide 1" />
                  <option value="Hero Slide 2" />
                  <option value="Hero Slide 3" />
                  <option value="Campus Photo" />
                  {[...itCourses, ...beautyCourses].map(c => (
                    <option key={c.title} value={c.title} />
                  ))}
                </datalist>
                <p style={{ fontSize: '11px', color: 'var(--admin-muted)', margin: '6px 0 0 0', lineHeight: '1.4' }}>
                  Click the box to select from a list of known placeholders (like <strong>Courses</strong> or <strong>Hero Slides</strong>), or type a custom one.
                </p>
              </div>
              <div className="admin-field">
                <label>Image (up to 10MB)</label>
                <input type="file" accept="image/*" onChange={(e) => handleImageUploadBase64(e, setImgForm, imgForm)} required={!imgForm.image_url} />
                {imgForm.image_url && (
                  <div style={{ marginTop: 12, position: 'relative', display: 'inline-block', width: '100%' }}>
                    <img src={imgForm.image_url} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--admin-border)' }} />
                  </div>
                )}
              </div>
              <div className="admin-modal-actions">
                <button type="button" onClick={() => setShowImgForm(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Image</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- COURSES TAB --- */}
      {!loading && activeTab === 'courses' && (
        <div className="course-manager-wrapper">
          <div className="course-manager-header">
            <div>
              <h3>Course Manager</h3>
              <p>Manage IT and Beauty courses. Changes instantly reflect on the main website.</p>
            </div>
            <button className="vercel-btn-primary" onClick={() => { setEditingCourse(null); setCourseForm(emptyCourse); setShowCourseForm(true); }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Add Course
            </button>
          </div>

          <div className="course-grid">
            {courses.length === 0 ? (
              <div className="admin-empty" style={{ gridColumn: '1 / -1', padding: '60px 20px', background: '#fff', border: '1px solid var(--admin-border)', borderRadius: '8px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px', display: 'inline-block' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                <p style={{ margin: 0, color: '#666', fontSize: '15px' }}>No courses found. Add your first course.</p>
              </div>
            ) : (
              courses.map(c => (
                <div key={c.id} className="course-card">
                  <div className="course-card-img">
                    <span className="course-category-badge">{c.category === 'it' ? 'IT' : 'Beauty'}</span>
                    {c.image_url ? (
                      <img src={c.image_url} alt={c.title} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '13px' }}>No Image</div>
                    )}
                  </div>
                  <div className="course-card-content">
                    <h4 className="course-card-title">{c.title}</h4>
                    <div className="course-card-meta">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      {c.duration || 'Duration not set'}
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      {c.base_price && Number(c.base_price) > 0 ? (
                        <>
                          {c.discount_price && Number(c.discount_price) > 0 && Number(c.discount_price) < Number(c.base_price) ? (
                            <>
                              <span style={{ fontWeight: '700', color: '#16a34a' }}>PKR {Number(c.discount_price).toLocaleString()}</span>
                              <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '12px' }}>PKR {Number(c.base_price).toLocaleString()}</span>
                            </>
                          ) : (
                            <span style={{ fontWeight: '700', color: '#0f172a' }}>PKR {Number(c.base_price).toLocaleString()}</span>
                          )}
                          {c.special_offer_tag && (
                            <span style={{ background: '#fef2f2', color: '#e11d48', fontSize: '11px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px' }}>
                              {c.special_offer_tag}
                            </span>
                          )}
                        </>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '12px', fontStyle: 'italic' }}>No price set (Hidden on frontend)</span>
                      )}
                    </div>
                    <div className="course-card-actions" style={{ marginTop: '12px' }}>
                      <button className="vercel-btn-secondary" style={{ flex: 1 }} onClick={() => { setEditingCourse(c); setCourseForm({ ...emptyCourse, ...c }); setShowCourseForm(true); }}>Edit</button>
                      <button className="vercel-btn-danger" style={{ flex: 1 }} onClick={() => handleDeleteCourse(c.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* --- COURSE MODAL --- */}
      {showCourseForm && (
        <div className="vercel-modal-overlay" onClick={() => setShowCourseForm(false)}>
          <div className="vercel-modal" onClick={e => e.stopPropagation()}>
            <div className="vercel-modal-header">
              <h3>{editingCourse ? 'Edit Course' : 'Create New Course'}</h3>
              <button type="button" className="vercel-modal-close" onClick={() => setShowCourseForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveCourse} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div className="vercel-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                  <div className="vercel-field-group">
                    <label className="vercel-label">Category</label>
                    <select className="vercel-select" value={courseForm.category} onChange={e => setCourseForm({...courseForm, category: e.target.value})} required>
                      <option value="it">IT Course</option>
                      <option value="beauty">Beauty Course</option>
                    </select>
                  </div>
                  <div className="vercel-field-group">
                    <label className="vercel-label">Duration</label>
                    <input className="vercel-input" type="text" value={courseForm.duration || ''} onChange={e => setCourseForm({...courseForm, duration: e.target.value})} placeholder="e.g. 3 Months" />
                  </div>
                </div>
                
                <div className="vercel-field-group">
                  <label className="vercel-label">Course Title</label>
                  <input className="vercel-input" type="text" value={courseForm.title || ''} onChange={e => setCourseForm({...courseForm, title: e.target.value})} placeholder="e.g. Graphic Design Masterclass" required />
                </div>

                {/* --- Pricing & Discount Fields in PKR --- */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', marginTop: '6px', marginBottom: '14px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v12M15 9.5H9.5a2.5 2.5 0 0 0 0 5h5a2.5 2.5 0 0 1 0 5H9"></path></svg>
                    Course Pricing & Special Offer (PKR)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="vercel-field-group" style={{ margin: 0 }}>
                      <label className="vercel-label">Base Course Price (PKR)</label>
                      <input 
                        className="vercel-input" 
                        type="number" 
                        min="0"
                        value={courseForm.base_price || ''} 
                        onChange={e => setCourseForm({...courseForm, base_price: e.target.value})} 
                        placeholder="e.g. 25000 (Leave blank if hidden)" 
                      />
                      <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', display: 'block' }}>
                        Agar price set hogi tab hi front par show hogi.
                      </span>
                    </div>

                    <div className="vercel-field-group" style={{ margin: 0 }}>
                      <label className="vercel-label">Discounted / Offer Price (PKR)</label>
                      <input 
                        className="vercel-input" 
                        type="number" 
                        min="0"
                        value={courseForm.discount_price || ''} 
                        onChange={e => setCourseForm({...courseForm, discount_price: e.target.value})} 
                        placeholder="e.g. 18000 (Optional)" 
                      />
                      <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', display: 'block' }}>
                        Base price se kam ho to strike-through & discount show hoga.
                      </span>
                    </div>
                  </div>

                  <div className="vercel-field-group" style={{ marginTop: '12px', marginBottom: 0 }}>
                    <label className="vercel-label">Special Offer Tag / Badge (Optional)</label>
                    <input 
                      className="vercel-input" 
                      type="text" 
                      value={courseForm.special_offer_tag || ''} 
                      onChange={e => setCourseForm({...courseForm, special_offer_tag: e.target.value})} 
                      placeholder="e.g. Limited Time Offer, Early Bird 20% Off" 
                    />
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '8px' }}>
                  <div className="vercel-field-group">
                    <label className="vercel-label">Square Image (Home/Grid)</label>
                    <label className="vercel-image-upload-area">
                      {courseForm.image_url ? (
                        <img src={courseForm.image_url} alt="Preview" className="vercel-image-preview" />
                      ) : (
                        <div style={{ height: '140px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#888', gap: '8px', marginBottom: '12px', border: '1px solid #eaeaea', borderRadius: '6px' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                          <span style={{ fontSize: '13px' }}>Click to upload</span>
                        </div>
                      )}
                      <div className="vercel-btn-secondary" style={{ width: '100%', padding: '6px', textAlign: 'center', display: 'block' }}>{courseForm.image_url ? 'Change Image' : 'Select File'}</div>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUploadBase64(e, setCourseForm, courseForm, 'image_url')} style={{ display: 'none' }} />
                    </label>
                  </div>

                  <div className="vercel-field-group">
                    <label className="vercel-label">Banner Image (Programs Page)</label>
                    <label className="vercel-image-upload-area">
                      {courseForm.banner_url ? (
                        <img src={courseForm.banner_url} alt="Preview" className="vercel-image-preview" />
                      ) : (
                        <div style={{ height: '140px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#888', gap: '8px', marginBottom: '12px', border: '1px solid #eaeaea', borderRadius: '6px' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                          <span style={{ fontSize: '13px' }}>Click to upload</span>
                        </div>
                      )}
                      <div className="vercel-btn-secondary" style={{ width: '100%', padding: '6px', textAlign: 'center', display: 'block' }}>{courseForm.banner_url ? 'Change Image' : 'Select File'}</div>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUploadBase64(e, setCourseForm, courseForm, 'banner_url')} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="vercel-modal-footer">
                <button type="button" className="vercel-btn-secondary" onClick={() => setShowCourseForm(false)}>Cancel</button>
                <button type="submit" className="vercel-btn-primary">
                  {editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE ANNOUNCEMENT MODAL --- */}
      {deleteTarget && (
        <div className="admin-modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="admin-modal admin-modal-sm" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Delete Announcement</h3>
            </div>
            <div className="admin-modal-body">
              <p>Delete "<strong>{deleteTarget.title}</strong>"?</p>
              <p style={{ color: 'var(--admin-muted)', fontSize: 13 }}>This cannot be undone.</p>
            </div>
            <div className="admin-modal-actions">
              <button onClick={() => setDeleteTarget(null)} className="btn btn-secondary">Cancel</button>
              <button onClick={() => handleDeleteAnn(deleteTarget.id)} className="admin-delete-confirm-btn">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* --- CERTIFICATES TAB --- */}
      {!loading && activeTab === 'certificates' && (
        <div className="vercel-container fade-in">
          {/* Compact Top Header & KPI Stats Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Student Certificates & QR Registry
              </h2>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
                Generate official certificates, customize student credentials, and manage live QR verification.
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div className="stat-card" style={{ padding: '6px 14px', borderRadius: '8px', gap: '10px' }}>
                  <div className="stat-label">Total:</div>
                  <div className="stat-number" style={{ fontSize: '15px' }}>{certificates.length}</div>
                </div>
                <div className="stat-card stat-active" style={{ padding: '6px 14px', borderRadius: '8px', gap: '10px' }}>
                  <div className="stat-label">Active:</div>
                  <div className="stat-number" style={{ fontSize: '15px' }}>{certificates.filter(c => c.is_valid).length}</div>
                </div>
                <div className="stat-card" style={{ padding: '6px 14px', borderRadius: '8px', gap: '10px' }}>
                  <div className="stat-label">Courses:</div>
                  <div className="stat-number" style={{ fontSize: '15px' }}>{courses.length}</div>
                </div>
              </div>

              <button onClick={fetchData} className="admin-logout-btn" title="Refresh" style={{ height: '32px', display: 'flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              </button>
            </div>
          </div>

          {/* Top: 2-Column Certificate Generator & Live Preview */}
          <div className="cert-admin-layout" style={{ marginTop: '10px' }}>
            {/* Form */}
            <div className="cert-form-card">
              <h3 style={{ fontSize: '13.5px', fontWeight: 800, marginBottom: '12px', color: '#0f172a' }}>
                {editingCertId ? '✏️ Edit Certificate' : '🎓 Generate New Certificate'}
              </h3>
              <form onSubmit={handleSaveCertificate} style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '8px' }}>
                  <div className="vercel-field-group">
                    <label className="vercel-label">Student Full Name *</label>
                    <input
                      type="text"
                      className="vercel-input"
                      value={certForm.student_name}
                      onChange={e => setCertForm({ ...certForm, student_name: e.target.value })}
                      placeholder="e.g. Anas Ali"
                      required
                    />
                  </div>
                  <div className="vercel-field-group">
                    <label className="vercel-label">Student CNIC</label>
                    <input
                      type="text"
                      className="vercel-input"
                      value={certForm.cnic}
                      onChange={e => setCertForm({ ...certForm, cnic: e.target.value })}
                      placeholder="35201-1234567-1"
                    />
                  </div>
                </div>

                <div className="vercel-field-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="vercel-label">Registration No *</label>
                    <button
                      type="button"
                      onClick={() => setCertForm({ ...certForm, registration_no: createDefaultRegNo() })}
                      style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '11px', cursor: 'pointer', fontWeight: 700 }}
                    >
                      🎲 Auto Generate
                    </button>
                  </div>
                  <input
                    type="text"
                    className="vercel-input"
                    value={certForm.registration_no}
                    onChange={e => setCertForm({ ...certForm, registration_no: e.target.value })}
                    placeholder="e.g. STI250189"
                    required
                  />
                </div>

                <div className="vercel-field-group">
                  <label className="vercel-label">Course Title *</label>
                  <input
                    type="text"
                    className="vercel-input"
                    value={certForm.course_title}
                    onChange={e => setCertForm({ ...certForm, course_title: e.target.value })}
                    placeholder="e.g. Digital Marketing and Website Development"
                    required
                  />
                </div>

                <div className="vercel-field-group">
                  <label className="vercel-label">Course Description / Duration Line</label>
                  <input
                    type="text"
                    className="vercel-input"
                    value={certForm.course_duration}
                    onChange={e => setCertForm({ ...certForm, course_duration: e.target.value })}
                    placeholder="e.g. A 3-Month Professional Course Conducted by Stellar Institute."
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div className="vercel-field-group">
                    <label className="vercel-label">From Date (Start)</label>
                    <input
                      type="date"
                      className="vercel-input"
                      value={certForm.duration_from}
                      onChange={e => setCertForm({ ...certForm, duration_from: e.target.value })}
                    />
                  </div>
                  <div className="vercel-field-group">
                    <label className="vercel-label">To Date (End)</label>
                    <input
                      type="date"
                      className="vercel-input"
                      value={certForm.duration_to}
                      onChange={e => setCertForm({ ...certForm, duration_to: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div className="vercel-field-group">
                    <label className="vercel-label">Issue Date</label>
                    <input
                      type="date"
                      className="vercel-input"
                      value={certForm.issue_date}
                      onChange={e => setCertForm({ ...certForm, issue_date: e.target.value })}
                    />
                  </div>

                  <div className="vercel-field-group">
                    <label className="vercel-label">Status</label>
                    <select
                      className="vercel-select"
                      value={certForm.is_valid ? 'true' : 'false'}
                      onChange={e => setCertForm({ ...certForm, is_valid: e.target.value === 'true' })}
                    >
                      <option value="true">Valid (Active)</option>
                      <option value="false">Revoked / Suspended</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div className="vercel-field-group">
                    <label className="vercel-label">Principal Subtitle</label>
                    <input
                      type="text"
                      className="vercel-input"
                      value={certForm.principal_title}
                      onChange={e => setCertForm({ ...certForm, principal_title: e.target.value })}
                    />
                  </div>
                  <div className="vercel-field-group">
                    <label className="vercel-label">Instructor Subtitle</label>
                    <input
                      type="text"
                      className="vercel-input"
                      value={certForm.instructor_title}
                      onChange={e => setCertForm({ ...certForm, instructor_title: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <button type="submit" className="vercel-btn-primary" disabled={savingCert} style={{ flex: 1, padding: '7px 12px', fontSize: '12.5px' }}>
                    {savingCert ? 'Saving...' : editingCertId ? 'Update & Save' : 'Register & Issue Certificate'}
                  </button>
                  {editingCertId && (
                    <button
                      type="button"
                      className="vercel-btn-secondary"
                      style={{ padding: '7px 12px', fontSize: '12.5px' }}
                      onClick={() => {
                        setEditingCertId(null);
                        setCertForm({ ...emptyCert, registration_no: createDefaultRegNo() });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Interactive Live Preview */}
            <div className="cert-preview-pane">
              <div className="cert-preview-header">
                <div className="cert-preview-title-group">
                  <span className="cert-live-indicator" />
                  <span className="cert-preview-title">Real-Time Certificate Studio</span>
                  <span className="cert-resolution-pill">1000 × 630 px</span>
                </div>
                <div className="cert-zoom-controls">
                  <button
                    type="button"
                    className={`cert-zoom-btn ${previewZoom === 'fit' ? 'active' : ''}`}
                    onClick={() => setPreviewZoom('fit')}
                  >
                    Fit Screen
                  </button>
                  <button
                    type="button"
                    className={`cert-zoom-btn ${previewZoom === '100' ? 'active' : ''}`}
                    onClick={() => setPreviewZoom('100')}
                  >
                    100% Size
                  </button>
                </div>
              </div>

              <div className="cert-preview-canvas-box">
                <div className={`cert-preview-scale-wrapper ${previewZoom === 'fit' ? 'cert-scale-fit' : 'cert-scale-100'}`}>
                  <CertificateTemplate
                    ref={certPrintRef}
                    student_name={certForm.student_name || 'Student Name'}
                    registration_no={certForm.registration_no || 'STI250189'}
                    cnic={certForm.cnic || ''}
                    course_title={certForm.course_title || 'Course Title Here'}
                    course_duration={certForm.course_duration || 'A 3-Month Professional Course Conducted by Stellar Institute.'}
                    duration_from={certForm.duration_from || ''}
                    duration_to={certForm.duration_to || ''}
                    issue_date={certForm.issue_date || ''}
                    principal_title={certForm.principal_title || 'Stellar Institute & Academy'}
                    instructor_title={certForm.instructor_title || 'Stellar Institute'}
                  />
                </div>
              </div>

              <div className="cert-preview-actions no-print">
                <button
                  type="button"
                  className="cert-action-btn-print"
                  onClick={() => window.print()}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                  Print / Save Certificate
                </button>
                <a
                  href={`/verify/${certForm.registration_no || 'STI250189'}`}
                  target="_blank"
                  rel="noreferrer"
                  className="cert-action-btn-verify"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                  </svg>
                  Verify Link
                </a>
              </div>
            </div>
          </div>

          {/* Bottom: Registered Certificates Registry & Search */}
          <div style={{ marginTop: '36px' }}>
            <div className="cert-registry-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <h2 className="cert-registry-title">Registered Certificates ({certificates.length})</h2>
                <button
                  type="button"
                  onClick={syncCertificatesToCloud}
                  className="cert-table-btn"
                  title="Upload all local certificates to cloud database"
                >
                  Sync to Cloud DB
                </button>
              </div>
              <div style={{ width: '280px' }}>
                <input
                  type="text"
                  className="vercel-input"
                  placeholder="Search by student, CNIC or reg no..."
                  value={certSearch}
                  onChange={e => setCertSearch(e.target.value)}
                  style={{ padding: '8px 12px', fontSize: '13px' }}
                />
              </div>
            </div>

            {certificates.length === 0 ? (
              <div className="admin-empty">No certificates issued yet. Fill the form above to register your first student.</div>
            ) : (
              <div className="cert-table-card">
                <table className="cert-table">
                  <thead>
                    <tr>
                      <th>Reg No.</th>
                      <th>Student Name</th>
                      <th>CNIC</th>
                      <th>Course</th>
                      <th>Issue Date</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right', paddingRight: '20px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificates
                      .filter(c => 
                        !certSearch ||
                        (c.student_name && c.student_name.toLowerCase().includes(certSearch.toLowerCase())) ||
                        (c.registration_no && c.registration_no.toLowerCase().includes(certSearch.toLowerCase())) ||
                        (c.cnic && c.cnic.toLowerCase().includes(certSearch.toLowerCase())) ||
                        (c.course_title && c.course_title.toLowerCase().includes(certSearch.toLowerCase()))
                      )
                      .map(c => (
                        <tr key={c.id || c.registration_no}>
                          <td style={{ fontWeight: 800, color: '#0284c7' }}>{c.registration_no}</td>
                          <td style={{ fontWeight: 600 }}>{c.student_name}</td>
                          <td style={{ color: '#475569', fontSize: '13px' }}>{c.cnic || '—'}</td>
                          <td>{c.course_title}</td>
                          <td>{c.issue_date ? new Date(c.issue_date).toLocaleDateString() : '-'}</td>

                          <td>
                            {c.is_valid ? (
                              <span className="cert-status-valid">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                  <polyline points="9 12 11 14 15 10" />
                                </svg>
                                <span>Active</span>
                              </span>
                            ) : (
                              <span className="cert-status-revoked">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10" />
                                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                                </svg>
                                <span>Revoked</span>
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="cert-td-actions">
                              <button
                                type="button"
                                className="cert-action-btn"
                                onClick={() => {
                                  handleEditCertificate(c);
                                  window.scrollTo({ top: 120, behavior: 'smooth' });
                                }}
                              >
                                Edit / View
                              </button>
                              <a
                                href={`/verify/${c.registration_no}`}
                                target="_blank"
                                rel="noreferrer"
                                className="cert-action-btn"
                              >
                                Verify
                              </a>
                              <button
                                type="button"
                                className="cert-action-btn cert-action-btn-danger"
                                onClick={() => handleDeleteCertificate(c.id, c.registration_no)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- PAGES TAB --- */}
      {!loading && activeTab === 'pages' && (
        <div className="vercel-container fade-in">
          <div className="vercel-header">
            <div>
              <h2 className="vercel-title">Website Pages</h2>
              <p className="vercel-subtitle">Manage static content like Privacy Policy.</p>
            </div>
            <button 
              onClick={savePrivacyPolicy} 
              className="vercel-btn-primary"
              disabled={savingPolicy}
            >
              {savingPolicy ? 'Saving...' : 'Publish Privacy Policy'}
            </button>
          </div>

          <div className="vercel-card">
            <div className="vercel-card-body">
              <div className="vercel-field">
                <label className="vercel-label">Privacy Policy Content (HTML / Text)</label>
                <textarea 
                  className="vercel-input" 
                  value={privacyPolicy} 
                  onChange={(e) => setPrivacyPolicy(e.target.value)} 
                  placeholder="<p>Your privacy policy goes here...</p>" 
                  style={{ minHeight: '400px', fontFamily: 'monospace', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
