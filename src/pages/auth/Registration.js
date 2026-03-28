import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_ENDPOINTS from '../../api/apiConfig';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .ff-overlay {
    position: fixed; top: 0; left: 0;
    width: 100vw; height: 100vh;
    z-index: 1050;
    display: flex; align-items: flex-start; justify-content: center;
    padding: 24px 16px;
    overflow-y: auto;
  }

  .ff-backdrop {
    position: fixed; inset: 0;
    background: rgba(8, 6, 14, 0.82);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .ff-reg-card {
    position: relative;
    width: 100%;
    max-width: 500px;
    background: #0f0d1a;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 24px;
    overflow: hidden;
    animation: ffSlideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    margin: auto;
  }

  @keyframes ffSlideUp {
    from { opacity: 0; transform: translateY(28px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .ff-glow {
    position: absolute; top: -100px; left: 50%;
    transform: translateX(-50%);
    width: 320px; height: 320px;
    background: radial-gradient(circle, rgba(196,160,100,0.15) 0%, transparent 70%);
    pointer-events: none;
  }

  .ff-header {
    padding: 36px 40px 0;
    text-align: center;
    position: relative;
  }

  .ff-logo-mark {
    display: inline-flex; align-items: center; gap: 8px;
    margin-bottom: 22px;
  }

  .ff-logo-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 14px; font-weight: 400;
    letter-spacing: 3px; text-transform: uppercase;
    color: rgba(255,255,255,0.45);
  }

  .ff-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 34px; font-weight: 300;
    color: #fff; line-height: 1.15;
    margin: 0 0 6px;
    letter-spacing: -0.3px;
  }

  .ff-title em {
    font-style: italic;
    color: #c4a064;
  }

  .ff-subtitle {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 300;
    color: rgba(255,255,255,0.35);
    letter-spacing: 0.3px;
    margin: 0;
  }

  .ff-divider {
    width: 40px; height: 1px;
    background: linear-gradient(90deg, transparent, #c4a064, transparent);
    margin: 18px auto;
  }

  .ff-body {
    padding: 4px 40px 40px;
  }

  .ff-field {
    margin-bottom: 16px;
  }

  .ff-label {
    display: block;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 500;
    letter-spacing: 1.5px; text-transform: uppercase;
    color: rgba(255,255,255,0.32);
    margin-bottom: 8px;
  }

  .ff-input-wrap {
    position: relative;
  }

  .ff-input {
    width: 100%; box-sizing: border-box;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 13px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 300;
    color: #fff;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    -webkit-appearance: none;
  }

  .ff-input::placeholder { color: rgba(255,255,255,0.18); }

  .ff-input:focus {
    border-color: rgba(196,160,100,0.5);
    background: rgba(196,160,100,0.05);
  }

  .ff-input:disabled {
    opacity: 0.4; cursor: not-allowed;
  }

  .ff-select {
    width: 100%; box-sizing: border-box;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 13px 40px 13px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 300;
    color: #fff;
    outline: none;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    -webkit-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
  }

  .ff-select:focus {
    border-color: rgba(196,160,100,0.5);
    background-color: rgba(196,160,100,0.05);
  }

  .ff-select:disabled {
    opacity: 0.35; cursor: not-allowed;
  }

  .ff-select option {
    background: #1a1826;
    color: #fff;
  }

  .ff-input-icon {
    position: absolute; right: 14px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: rgba(255,255,255,0.25); padding: 0;
    display: flex; align-items: center;
    transition: color 0.2s;
  }
  .ff-input-icon:hover { color: rgba(255,255,255,0.55); }

  .ff-row-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 16px;
  }

  @media (max-width: 480px) {
    .ff-row-2 { grid-template-columns: 1fr; }
    .ff-header { padding: 28px 24px 0; }
    .ff-body { padding: 4px 24px 32px; }
    .ff-reg-card { border-radius: 20px; }
  }

  .ff-alert {
    background: rgba(239,100,97,0.1);
    border: 1px solid rgba(239,100,97,0.25);
    border-radius: 10px;
    padding: 12px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 300;
    color: #ef9492;
    margin-bottom: 20px;
  }

  .ff-btn-primary {
    width: 100%; padding: 15px;
    background: linear-gradient(135deg, #c4a064 0%, #a8843e 100%);
    border: none; border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 500;
    letter-spacing: 1.8px; text-transform: uppercase;
    color: #0f0d1a;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    margin-bottom: 12px;
  }
  .ff-btn-primary:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .ff-btn-primary:active:not(:disabled) { transform: translateY(0); }
  .ff-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }

  .ff-btn-ghost {
    width: 100%; padding: 13px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 400;
    letter-spacing: 0.5px;
    color: rgba(255,255,255,0.4);
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .ff-btn-ghost:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); }

  .ff-footer-text {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 300;
    color: rgba(255,255,255,0.28);
    text-align: center;
    margin: 18px 0 0;
  }

  .ff-link {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 300;
    color: #c4a064;
    text-decoration: none;
    transition: opacity 0.2s;
    background: none; border: none; cursor: pointer; padding: 0;
  }
  .ff-link:hover { opacity: 0.7; }

  .ff-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(15,13,26,0.3);
    border-top-color: #0f0d1a;
    border-radius: 50%;
    animation: ffSpin 0.7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes ffSpin { to { transform: rotate(360deg); } }

  .ff-section-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 10px; font-weight: 500;
    letter-spacing: 2px; text-transform: uppercase;
    color: rgba(255,255,255,0.18);
    margin: 20px 0 14px;
    display: flex; align-items: center; gap: 10px;
  }
  .ff-section-label::before,
  .ff-section-label::after {
    content: ''; flex: 1; height: 1px;
    background: rgba(255,255,255,0.06);
  }
`;

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const Logo = () => (
  <div className="ff-logo-mark">
    <svg width="24" height="26" viewBox="0 0 26 28" fill="none">
      <rect width="12" height="28" rx="4" fill="#1a3460"/>
      <rect x="14" y="0" width="12" height="28" rx="4" fill="#c4a064"/>
    </svg>
    <span className="ff-logo-text">Fashion Frame</span>
  </div>
);

const Registration = ({ show = false, onClose, switchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', address: '',
    mobile: '', password: '',
    state_id: '', city_id: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [states, setStates] = useState([]);
  const [statesLoading, setStatesLoading] = useState(true);
  const [statesError, setStatesError] = useState('');
  const [cities, setCities] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [cityDisabled, setCityDisabled] = useState(true);

  // Fetch states on mount
  useEffect(() => {
    setStatesLoading(true);
    setStatesError('');
    fetch(API_ENDPOINTS.GET_STATES, { headers: { 'Content-Type': 'application/json' } })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.states)) {
          setStates(data.states);
          localStorage.setItem('statesList', JSON.stringify(data.states));
        } else {
          setStates([]);
          setStatesError('Failed to load states.');
        }
      })
      .catch(() => { setStates([]); setStatesError('Failed to load states.'); })
      .finally(() => setStatesLoading(false));
  }, []);

  // Fetch cities when state changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, city_id: '' }));
    if (!formData.state_id) {
      setCities([]); setCityDisabled(true); return;
    }
    const fetchCities = async () => {
      setCityDisabled(true); setCityLoading(true);
      try {
        const res = await fetch(`${API_ENDPOINTS.GET_CITY}?state_id=${formData.state_id}`, {
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        const list = Array.isArray(data.cities) ? data.cities : Array.isArray(data.data) ? data.data : [];
        setCities(list);
        localStorage.setItem('citiesList', JSON.stringify(list));
      } catch {
        setCities([]);
      } finally {
        setCityDisabled(false); setCityLoading(false);
      }
    };
    fetchCities();
  }, [formData.state_id]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.address.trim() ||
        !formData.mobile.trim() || !formData.password.trim() || !formData.city_id || !formData.state_id) {
      setError('All fields are required.');
      toast.error('All fields are required.', { position: 'top-center', autoClose: 3000 });
      return;
    }
    setError(''); setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.REGISTRATION, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pu_name: formData.name,
          pu_email: formData.email,
          pud_address: formData.address,
          pu_contact_no: formData.mobile,
          password: formData.password,
          state_id: formData.state_id,
          city_id: formData.city_id,
        }),
      });
      const data = await response.json();
      if (response.ok && data.message) {
        toast.success(data.message || 'Registration successful!', { position: 'top-center', autoClose: 2000 });
        setTimeout(() => { if (switchToLogin) switchToLogin(); if (onClose) onClose(); }, 2000);
      } else {
        setError(data.error || 'Registration failed. Please check your details.');
        toast.error(data.error || 'Registration failed.', { position: 'top-center', autoClose: 3000 });
      }
    } catch {
      setError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.', { position: 'top-center', autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <ToastContainer />

      <div className="ff-overlay">
        <div className="ff-backdrop" onClick={onClose} />

        <div className="ff-reg-card">
          <div className="ff-glow" />

          <div className="ff-header">
            <Logo />
            <h2 className="ff-title">Create an <em>account</em></h2>
            <p className="ff-subtitle">Join Fashion Frame — it only takes a minute</p>
            <div className="ff-divider" />
          </div>

          <div className="ff-body">
            {error && <div className="ff-alert">{error}</div>}

            <form onSubmit={handleSubmit} autoComplete="off">

              {/* ── Personal Info ── */}
              <div className="ff-section-label">Personal Info</div>

              <div className="ff-field">
                <label className="ff-label">Full Name</label>
                <input className="ff-input" type="text" name="name"
                  placeholder="Your full name"
                  value={formData.name} onChange={handleChange}
                  autoComplete="off" required />
              </div>

              <div className="ff-field">
                <label className="ff-label">Email</label>
                <input className="ff-input" type="email" name="email"
                  placeholder="you@example.com"
                  value={formData.email} onChange={handleChange}
                  autoComplete="off" required />
              </div>

              <div className="ff-field">
                <label className="ff-label">Mobile</label>
                <input className="ff-input" type="tel" name="mobile"
                  placeholder="10-digit mobile number"
                  value={formData.mobile} onChange={handleChange}
                  autoComplete="off" required />
              </div>

              <div className="ff-field">
                <label className="ff-label">Password</label>
                <div className="ff-input-wrap">
                  <input
                    className="ff-input"
                    type={showPw ? 'text' : 'password'}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    style={{ paddingRight: 44 }}
                    required
                  />
                  <button type="button" className="ff-input-icon"
                    onClick={() => setShowPw(p => !p)} tabIndex={-1}>
                    {showPw ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {/* ── Address ── */}
              <div className="ff-section-label">Address</div>

              <div className="ff-field">
                <label className="ff-label">Street Address</label>
                <input className="ff-input" type="text" name="address"
                  placeholder="House / flat / street"
                  value={formData.address} onChange={handleChange}
                  autoComplete="off" required />
              </div>

              <div className="ff-row-2">
                <div>
                  <label className="ff-label">State</label>
                  <select className="ff-select" name="state_id"
                    value={formData.state_id} onChange={handleChange}
                    required disabled={statesLoading}>
                    <option value="">{statesLoading ? 'Loading...' : 'Select state'}</option>
                    {states.map(s => (
                      <option key={s.state_id} value={s.state_id}>{s.state_name}</option>
                    ))}
                  </select>
                  {statesError && (
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#ef6461', marginTop: 5 }}>
                      {statesError}
                    </div>
                  )}
                </div>

                <div>
                  <label className="ff-label">City</label>
                  <select className="ff-select" name="city_id"
                    value={formData.city_id} onChange={handleChange}
                    required disabled={cityDisabled}>
                    <option value="">{cityLoading ? 'Loading...' : 'Select city'}</option>
                    {cities.map(c => (
                      <option key={c.city_id} value={c.city_id}>{c.city_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ── Buttons ── */}
              <div style={{ marginTop: 24 }}>
                <button type="submit" className="ff-btn-primary" disabled={loading}>
                  {loading ? <><div className="ff-spinner" /> Creating account...</> : 'Create Account'}
                </button>
                <button type="button" className="ff-btn-ghost" onClick={onClose} disabled={loading}>
                  Close
                </button>
              </div>

              <p className="ff-footer-text">
                Already registered?{' '}
                <button type="button" className="ff-link"
                  onClick={() => { if (switchToLogin) switchToLogin(); }}>
                  Login here
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Registration;