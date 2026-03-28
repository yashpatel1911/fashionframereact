import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_ENDPOINTS from '../../api/apiConfig';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .ff-overlay {
    position: fixed; top: 0; left: 0;
    width: 100vw; height: 100vh;
    z-index: 1050;
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
    overflow-y: auto;
  }

  .ff-backdrop {
    position: fixed; inset: 0;
    background: rgba(8, 6, 14, 0.82);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .ff-card {
    position: relative;
    width: 100%;
    max-width: 440px;
    background: #0f0d1a;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 24px;
    overflow: hidden;
    animation: ffSlideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes ffSlideUp {
    from { opacity: 0; transform: translateY(28px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .ff-glow {
    position: absolute; top: -120px; left: 50%;
    transform: translateX(-50%);
    width: 320px; height: 320px;
    background: radial-gradient(circle, rgba(196,160,100,0.18) 0%, transparent 70%);
    pointer-events: none;
  }

  .ff-header {
    padding: 40px 40px 0;
    text-align: center;
    position: relative;
  }

  .ff-logo-mark {
    display: inline-flex; align-items: center; gap: 8px;
    margin-bottom: 28px;
  }

  .ff-logo-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 15px; font-weight: 400;
    letter-spacing: 3px; text-transform: uppercase;
    color: rgba(255,255,255,0.5);
  }

  .ff-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px; font-weight: 300;
    color: #fff; line-height: 1.15;
    margin: 0 0 8px;
    letter-spacing: -0.3px;
  }

  .ff-title em {
    font-style: italic;
    color: #c4a064;
  }

  .ff-subtitle {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 300;
    color: rgba(255,255,255,0.38);
    letter-spacing: 0.3px;
    margin: 0;
  }

  .ff-divider {
    width: 40px; height: 1px;
    background: linear-gradient(90deg, transparent, #c4a064, transparent);
    margin: 20px auto;
  }

  .ff-body {
    padding: 8px 40px 40px;
  }

  .ff-field {
    margin-bottom: 18px;
  }

  .ff-label {
    display: block;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 500;
    letter-spacing: 1.5px; text-transform: uppercase;
    color: rgba(255,255,255,0.35);
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
    padding: 14px 16px;
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

  .ff-input.ff-error {
    border-color: rgba(239, 100, 97, 0.5);
    background: rgba(239,100,97,0.04);
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

  .ff-error-text {
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; color: #ef6461;
    margin: 6px 0 0 2px;
  }

  .ff-row {
    display: flex; align-items: center;
    justify-content: space-between;
    margin-bottom: 28px; margin-top: -4px;
  }

  .ff-check-label {
    display: flex; align-items: center; gap: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 300;
    color: rgba(255,255,255,0.4);
    cursor: pointer;
  }

  .ff-check-label input[type="checkbox"] {
    width: 15px; height: 15px;
    accent-color: #c4a064;
    cursor: pointer;
  }

  .ff-link {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 300;
    color: #c4a064;
    text-decoration: none;
    letter-spacing: 0.2px;
    transition: opacity 0.2s;
    background: none; border: none; cursor: pointer; padding: 0;
  }
  .ff-link:hover { opacity: 0.7; }

  .ff-btn-primary {
    width: 100%; padding: 15px;
    background: linear-gradient(135deg, #c4a064 0%, #a8843e 100%);
    border: none; border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500;
    letter-spacing: 1.8px; text-transform: uppercase;
    color: #0f0d1a;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    margin-bottom: 14px;
  }
  .ff-btn-primary:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .ff-btn-primary:active:not(:disabled) { transform: translateY(0); }
  .ff-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }

  .ff-btn-ghost {
    width: 100%; padding: 14px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 400;
    letter-spacing: 0.5px;
    color: rgba(255,255,255,0.45);
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .ff-btn-ghost:hover:not(:disabled) {
    background: rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.7);
  }
  .ff-btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }

  .ff-footer-text {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 300;
    color: rgba(255,255,255,0.3);
    text-align: center;
    margin: 20px 0 0;
  }

  .ff-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(15,13,26,0.3);
    border-top-color: #0f0d1a;
    border-radius: 50%;
    animation: ffSpin 0.7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes ffSpin { to { transform: rotate(360deg); } }

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

  .ff-success-icon {
    width: 76px; height: 76px; border-radius: 50%;
    background: rgba(100,196,140,0.1);
    border: 1px solid rgba(100,196,140,0.2);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 24px;
  }

  .ff-steps {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 18px;
    margin-bottom: 14px;
  }

  .ff-steps-title {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 500;
    letter-spacing: 1.4px; text-transform: uppercase;
    color: rgba(255,255,255,0.28);
    margin-bottom: 14px;
  }

  .ff-step {
    display: flex; align-items: flex-start; gap: 12px;
    margin-bottom: 10px;
  }
  .ff-step:last-child { margin-bottom: 0; }

  .ff-step-num {
    width: 20px; height: 20px; border-radius: 50%;
    background: rgba(196,160,100,0.12);
    border: 1px solid rgba(196,160,100,0.28);
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px; font-weight: 500;
    color: #c4a064; flex-shrink: 0;
  }

  .ff-step-text {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 300;
    color: rgba(255,255,255,0.42);
    line-height: 1.55; padding-top: 1px;
  }

  .ff-expiry {
    background: rgba(196,160,100,0.07);
    border: 1px solid rgba(196,160,100,0.16);
    border-radius: 10px;
    padding: 11px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12.5px; font-weight: 300;
    color: rgba(196,160,100,0.75);
    margin-bottom: 24px;
  }

  .ff-email-badge {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(196,160,100,0.08);
    border: 1px solid rgba(196,160,100,0.2);
    border-radius: 8px;
    padding: 7px 14px;
    margin-bottom: 16px;
  }

  .ff-email-badge span {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 400;
    color: #c4a064;
  }

  .ff-back-btn {
    background: none; border: none; cursor: pointer; padding: 0;
    display: flex; align-items: center; gap: 6px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 400;
    letter-spacing: 0.3px;
    color: rgba(255,255,255,0.28);
    transition: color 0.2s;
    margin-bottom: 20px;
  }
  .ff-back-btn:hover { color: rgba(255,255,255,0.6); }
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
    <svg width="26" height="28" viewBox="0 0 26 28" fill="none">
      <rect width="12" height="28" rx="4" fill="#1a3460"/>
      <rect x="14" y="0" width="12" height="28" rx="4" fill="#c4a064"/>
    </svg>
    <span className="ff-logo-text">Fashion Frame</span>
  </div>
);

// ─────────────────────────────────────────────────────────────
// Forgot Password
// ─────────────────────────────────────────────────────────────
const ForgotPassword = ({ onClose, switchToLogin }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validate = (v) => {
    if (!v.trim()) return 'Email address is required';
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(v.trim())) return 'Enter a valid email address';
    return '';
  };

  const handleSend = async () => {
    const err = validate(email);
    if (err) { setEmailError(err); return; }
    setEmailError('');
    setIsSending(true);
    try {
      const res = await fetch(API_ENDPOINTS.FORGOT_PASSWORD_SEND, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setEmailSent(true);
      } else {
        setEmailError(data.message || 'Failed to send reset link.');
      }
    } catch {
      setEmailError('An error occurred. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (emailSent) return (
    <>
      <div style={{ textAlign: 'center' }}>
        <div className="ff-success-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#64c48c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <h2 className="ff-title" style={{ fontSize: 28, marginBottom: 8 }}>Check your <em>inbox</em></h2>
        <p className="ff-subtitle" style={{ marginBottom: 16 }}>We sent a reset link to</p>
        <div className="ff-email-badge">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c4a064" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <span>{email.trim()}</span>
        </div>
        <p className="ff-subtitle" style={{ marginBottom: 24 }}>
          Open your email and tap "Click Here to Reset Password"
        </p>
      </div>

      <div className="ff-steps">
        <div className="ff-steps-title">What to do next</div>
        {['Open your email inbox', 'Find the email from Fashion Frame', 'Tap "Click Here to Reset Password"', 'Enter your new password on the page that opens'].map((s, i) => (
          <div className="ff-step" key={i}>
            <div className="ff-step-num">{i + 1}</div>
            <div className="ff-step-text">{s}</div>
          </div>
        ))}
      </div>

      <div className="ff-expiry">⏳ This link expires in <strong>30 minutes</strong></div>

      <button className="ff-btn-primary" onClick={onClose}>Back to Login</button>
      <p className="ff-footer-text">
        Didn't receive it?{' '}
        <button className="ff-link" onClick={() => setEmailSent(false)}>Try again</button>
      </p>
    </>
  );

  return (
    <>
      <button className="ff-back-btn" onClick={switchToLogin}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Back to login
      </button>

      <h2 className="ff-title" style={{ fontSize: 30, marginBottom: 6 }}>Reset your <em>password</em></h2>
      <p className="ff-subtitle" style={{ marginBottom: 28 }}>Enter your registered email — we'll send a secure link</p>

      <div className="ff-field">
        <label className="ff-label">Email Address</label>
        <input
          className={`ff-input${emailError ? ' ff-error' : ''}`}
          type="email"
          placeholder="you@example.com"
          value={email}
          autoComplete="email"
          onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        {emailError && <div className="ff-error-text">{emailError}</div>}
      </div>

      <div style={{ marginTop: 24 }}>
        <button className="ff-btn-primary" onClick={handleSend} disabled={isSending}>
          {isSending
            ? <><div className="ff-spinner" /> Sending...</>
            : 'Send Reset Link'}
        </button>
        <button className="ff-btn-ghost" onClick={onClose} disabled={isSending}>Close</button>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// Login
// ─────────────────────────────────────────────────────────────
const Login = ({ show = false, onClose, switchToRegistration }) => {
  const navigate = useNavigate();
  const [view, setView] = useState('login');
  const [formData, setFormData] = useState({ contact_no: '', password: '', rememberMe: false });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) { setView('login'); setError(''); }
  }, [show]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact_no: formData.contact_no, password: formData.password }),
      });
      const data = await res.json();
      if (res.ok && data.access_token) {
        localStorage.setItem('authToken', data.access_token);
        toast.success('Welcome back!', { position: 'top-center', autoClose: 2000 });
        setTimeout(() => { navigate('/'); window.location.reload(); if (onClose) onClose(); }, 2000);
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
        toast.error(data.message || 'Login failed.', { position: 'top-center', autoClose: 3000 });
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setView('login'); setError('');
    setFormData({ contact_no: '', password: '', rememberMe: false });
    if (onClose) onClose();
  };

  return (
    <>
      <style>{styles}</style>
      <ToastContainer />
      <div className="ff-overlay">
        <div className="ff-backdrop" onClick={handleClose} />

        <div className="ff-card">
          <div className="ff-glow" />

          <div className="ff-header">
            <Logo />
            {view === 'login' && (
              <>
                <h2 className="ff-title">Welcome <em>back</em></h2>
                <p className="ff-subtitle">Sign in to your account to continue</p>
              </>
            )}
            <div className="ff-divider" />
          </div>

          <div className="ff-body">
            {view === 'forgot' ? (
              <ForgotPassword onClose={handleClose} switchToLogin={() => setView('login')} />
            ) : (
              <>
                {error && <div className="ff-alert">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="ff-field">
                    <label className="ff-label">Contact Number</label>
                    <input
                      className="ff-input"
                      type="tel"
                      name="contact_no"
                      placeholder="Enter your contact number"
                      value={formData.contact_no}
                      onChange={handleChange}
                      autoComplete="tel"
                      required
                    />
                  </div>

                  <div className="ff-field">
                    <label className="ff-label">Password</label>
                    <div className="ff-input-wrap">
                      <input
                        className="ff-input"
                        type={showPw ? 'text' : 'password'}
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        style={{ paddingRight: 44 }}
                        required
                      />
                      <button type="button" className="ff-input-icon" onClick={() => setShowPw(p => !p)} tabIndex={-1}>
                        {showPw ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>

                  <div className="ff-row">
                    <label className="ff-check-label">
                      <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} />
                      Remember me
                    </label>
                    <button type="button" className="ff-link" onClick={() => { setView('forgot'); setError(''); }}>
                      Forgot password?
                    </button>
                  </div>

                  <button type="submit" className="ff-btn-primary" disabled={loading}>
                    {loading ? <><div className="ff-spinner" /> Signing in...</> : 'Sign In'}
                  </button>
                  <button type="button" className="ff-btn-ghost" onClick={handleClose} disabled={loading}>
                    Close
                  </button>
                </form>

                <p className="ff-footer-text">
                  Don't have an account?{' '}
                  <button className="ff-link" onClick={() => { if (switchToRegistration) switchToRegistration(); }}>
                    Create one here
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;