import React, { useState } from 'react';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [focused, setFocused] = useState('');
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRe = /^[\d\s+\-().]{7,15}$/;

  const validate = (v) => {
    const e = {};
    if (!v.name.trim()) e.name = 'Name is required';
    if (!v.email.trim()) e.email = 'Email is required';
    else if (!emailRe.test(v.email)) e.email = 'Enter a valid email';
    if (!v.phone.trim()) e.phone = 'Phone number is required';
    else if (!phoneRe.test(v.phone)) e.phone = 'Enter a valid phone number';
    if (!v.message.trim()) e.message = 'Message is required';
    return e;
  };

  const errors = validate(form);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleBlur = (field) => {
    setFocused('');
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, message: true });
    if (!isValid) return;
    setSubmitted(true);
    setForm({ name: '', email: '', phone: '', message: '' });
    setTouched({});
    setTimeout(() => setSubmitted(false), 4000);
  };

  const fieldErr = (f) => touched[f] && errors[f];

  const infoItems = [
    {
      label: 'Manufactured & Marketed By',
      value: 'Fashion Frame PVT LTD',
      icon: (<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="8" width="14" height="9" rx="1" stroke="currentColor" strokeWidth="1"/><path d="M6 8V6a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>),
    },
    {
      label: 'Address',
      value: 'Plot No. 1126, Laxmi Textile Park, Sachin GIDC, Surat',
      icon: (<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2a5 5 0 015 5c0 3.5-5 9-5 9S4 10.5 4 7a5 5 0 015-5z" stroke="currentColor" strokeWidth="1"/><circle cx="9" cy="7" r="1.5" stroke="currentColor" strokeWidth="1"/></svg>),
    },
    {
      label: 'Customer Support',
      value: '+91 90333 18392',
      sub: 'Mon – Sat, 10:00 am – 6:00 pm',
      icon: (<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 4.5A1.5 1.5 0 014.5 3h1.382a.5.5 0 01.447.276l1.5 3a.5.5 0 01-.112.563L6.5 8.062C7.53 10.07 9.93 12.47 11.937 13.5l1.223-1.217a.5.5 0 01.563-.112l3 1.5A.5.5 0 0117 14.118V15.5A1.5 1.5 0 0115.5 17C8.044 17 1 9.956 1 2.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>),
    },
    {
      label: 'Email',
      value: 'fashionframe2025@gmail.com',
      icon: (<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="4" width="16" height="11" rx="1.5" stroke="currentColor" strokeWidth="1"/><path d="M1 5.5l8 5 8-5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>),
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

        :root {
          --gold: #C9A96E; --gold-light: #E2C898; --gold-dark: #8A6B3A;
          --cream: #FAF7F2; --ink: #1A1714; --ink-soft: #3D3530;
          --border: rgba(201,169,110,0.22); --card-bg: rgba(255,255,255,0.62);
          --err: #B03A2E;
        }

        .cu-root { min-height: 100vh; background: var(--cream); font-family: 'Jost', sans-serif; position: relative; overflow-x: hidden; }
        .cu-root::before { content: ''; position: fixed; inset: 0; background: radial-gradient(ellipse 70% 50% at 10% 0%, rgba(201,169,110,0.09) 0%, transparent 55%), radial-gradient(ellipse 55% 70% at 90% 100%, rgba(201,169,110,0.07) 0%, transparent 55%); pointer-events: none; z-index: 0; }

        .cu-container { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; padding: 36px 40px 80px; }

        .cu-header { text-align: center; margin-bottom: 48px; }
        .cu-ornament { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 16px; opacity: 0; animation: cuFadeUp 0.8s ease forwards; }
        .cu-ornament .ln { width: 80px; height: 1px; background: linear-gradient(to right, transparent, var(--gold)); }
        .cu-ornament .ln.r { background: linear-gradient(to left, transparent, var(--gold)); }
        .cu-ornament .dm { width: 5px; height: 5px; background: var(--gold); transform: rotate(45deg); }
        .cu-ornament .dm-sm { width: 3px; height: 3px; background: var(--gold-light); transform: rotate(45deg); }
        .cu-title { font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: clamp(1.9rem, 3.5vw, 2.8rem); color: var(--ink); letter-spacing: 0.03em; margin: 0 0 10px; opacity: 0; animation: cuFadeUp 0.9s ease 0.1s forwards; }
        .cu-rule { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 0 auto 20px; opacity: 0; animation: cuFadeUp 0.8s ease 0.2s forwards; }
        .cu-rule .rl { width: 48px; height: 1px; background: var(--gold); }
        .cu-rule .rd { width: 3px; height: 3px; border-radius: 50%; background: var(--gold); }
        .cu-desc { font-weight: 300; font-size: 0.92rem; line-height: 1.8; color: var(--ink-soft); max-width: 620px; margin: 0 auto; letter-spacing: 0.01em; opacity: 0; animation: cuFadeUp 0.9s ease 0.3s forwards; }
        .cu-desc a { color: var(--gold-dark); text-decoration: none; border-bottom: 1px solid rgba(138,107,58,0.3); transition: color 0.2s, border-color 0.2s; }
        .cu-desc a:hover { color: var(--gold); border-color: var(--gold); }

        .cu-info-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 2px; margin-bottom: 48px; overflow: hidden; opacity: 0; animation: cuFadeUp 0.9s ease 0.4s forwards; }
        .cu-info-cell { background: var(--card-bg); backdrop-filter: blur(6px); padding: 24px 22px; display: flex; flex-direction: column; gap: 10px; transition: background 0.25s; }
        .cu-info-cell:hover { background: rgba(255,255,255,0.85); }
        .cu-info-icon { color: var(--gold); flex-shrink: 0; }
        .cu-info-label { font-size: 0.65rem; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold-dark); }
        .cu-info-value { font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; font-weight: 400; color: var(--ink); line-height: 1.45; }
        .cu-info-sub { font-size: 0.72rem; font-weight: 300; color: var(--ink-soft); letter-spacing: 0.03em; }

        .cu-body { display: grid; grid-template-columns: 1fr 1.6fr; gap: 32px; align-items: start; }

        .cu-reach-card { background: var(--ink); border-radius: 2px; padding: 40px 36px; position: relative; overflow: hidden; opacity: 0; animation: cuFadeUp 0.9s ease 0.5s forwards; }
        .cu-reach-card::before { content: ''; position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; border-radius: 50%; background: radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 70%); pointer-events: none; }
        .cu-reach-corner { position: absolute; width: 18px; height: 18px; border-color: rgba(201,169,110,0.4); border-style: solid; }
        .cu-reach-corner.tl { top: 12px; left: 12px; border-width: 1px 0 0 1px; }
        .cu-reach-corner.br { bottom: 12px; right: 12px; border-width: 0 1px 1px 0; }
        .cu-reach-eyebrow { font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-bottom: 12px; font-weight: 400; }
        .cu-reach-heading { font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: 1.9rem; color: var(--cream); line-height: 1.2; margin: 0 0 28px; font-style: italic; }
        .cu-reach-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 20px; }
        .cu-reach-item { display: flex; align-items: flex-start; gap: 14px; }
        .cu-reach-item-icon { width: 32px; height: 32px; border: 1px solid rgba(201,169,110,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--gold); flex-shrink: 0; margin-top: 2px; }
        .cu-reach-item-text strong { display: block; font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold-light); font-weight: 400; margin-bottom: 2px; }
        .cu-reach-item-text span { font-size: 0.88rem; color: rgba(250,247,242,0.75); font-weight: 300; line-height: 1.5; }

        .cu-form-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 2px; padding: 40px 44px; position: relative; backdrop-filter: blur(8px); box-shadow: 0 20px 60px rgba(26,23,20,0.05); opacity: 0; animation: cuFadeUp 0.9s ease 0.55s forwards; }
        .cu-form-card::before, .cu-form-card::after { content: ''; position: absolute; width: 18px; height: 18px; border-color: var(--gold); border-style: solid; opacity: 0.5; }
        .cu-form-card::before { top: -1px; left: -1px; border-width: 1px 0 0 1px; }
        .cu-form-card::after { bottom: -1px; right: -1px; border-width: 0 1px 1px 0; }

        .cu-form-title { font-family: 'Cormorant Garamond', serif; font-weight: 400; font-size: 1.5rem; color: var(--ink); margin: 0 0 6px; letter-spacing: 0.02em; }
        .cu-form-sub { font-size: 0.78rem; font-weight: 300; color: var(--ink-soft); letter-spacing: 0.03em; margin: 0 0 28px; }

        .cu-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }

        .cu-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 20px; }
        .cu-field.no-mb { margin-bottom: 0; }

        .cu-field label { font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold-dark); font-weight: 500; transition: color 0.2s; display: flex; align-items: center; gap: 5px; }
        .cu-field.focused label { color: var(--gold); }
        .cu-field.has-error label { color: var(--err); }

        .cu-req-star { color: var(--gold); font-size: 0.55rem; }
        .cu-field.has-error .cu-req-star { color: var(--err); }

        .cu-field input, .cu-field textarea { background: transparent; border: none; border-bottom: 1px solid rgba(201,169,110,0.3); padding: 8px 0; font-family: 'Jost', sans-serif; font-size: 0.9rem; font-weight: 300; color: var(--ink); outline: none; transition: border-color 0.25s; resize: none; width: 100%; }
        .cu-field input::placeholder, .cu-field textarea::placeholder { color: rgba(61,53,48,0.35); font-weight: 200; }
        .cu-field input:focus, .cu-field textarea:focus { border-bottom-color: var(--gold); }
        .cu-field.has-error input, .cu-field.has-error textarea { border-bottom-color: var(--err); }

        .cu-field-err { font-size: 0.64rem; color: var(--err); letter-spacing: 0.03em; font-weight: 400; display: flex; align-items: center; gap: 5px; animation: cuErrIn 0.2s ease; }
        .cu-field-err svg { flex-shrink: 0; }
        @keyframes cuErrIn { from { opacity: 0; transform: translateY(-3px); } to { opacity: 1; transform: translateY(0); } }

        .cu-submit-wrap { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; gap: 16px; }
        .cu-submit-note { font-size: 0.7rem; font-weight: 300; color: var(--ink-soft); letter-spacing: 0.02em; display: flex; align-items: center; gap: 5px; }

        .cu-submit-btn { background: var(--ink); color: var(--cream); border: none; padding: 12px 36px; font-family: 'Jost', sans-serif; font-size: 0.7rem; font-weight: 400; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; position: relative; overflow: hidden; transition: background 0.3s; border-radius: 1px; flex-shrink: 0; }
        .cu-submit-btn::after { content: ''; position: absolute; inset: 0; background: var(--gold); transform: translateX(-101%); transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); }
        .cu-submit-btn:hover::after { transform: translateX(0); }
        .cu-submit-btn span { position: relative; z-index: 1; }

        .cu-toast { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%) translateY(20px); background: var(--ink); color: var(--cream); padding: 14px 28px; border-radius: 2px; font-size: 0.78rem; letter-spacing: 0.1em; text-transform: uppercase; border-left: 2px solid var(--gold); opacity: 0; pointer-events: none; transition: opacity 0.4s, transform 0.4s; z-index: 100; }
        .cu-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

        @keyframes cuFadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 900px) { .cu-info-grid { grid-template-columns: 1fr 1fr; } .cu-body { grid-template-columns: 1fr; } .cu-reach-card { order: 2; } .cu-form-card { order: 1; } }
        @media (max-width: 580px) { .cu-container { padding: 24px 18px 60px; } .cu-info-grid { grid-template-columns: 1fr; } .cu-form-row { grid-template-columns: 1fr; } .cu-form-card { padding: 28px 22px; } .cu-reach-card { padding: 28px 22px; } .cu-submit-wrap { flex-direction: column; align-items: flex-end; } }
      `}</style>

      <div className="cu-root">
        <div className="cu-container">

          <div className="cu-header">
            <div className="cu-ornament">
              <div className="ln" /><div className="dm-sm" /><div className="dm" /><div className="dm-sm" /><div className="ln r" />
            </div>
            <h1 className="cu-title">Contact Us</h1>
            <div className="cu-rule"><div className="rl" /><div className="rd" /><div className="rl" /></div>
            <p className="cu-desc">
              We'd love to hear from you. Fill out the form and we'll respond within 48 hours, or reach us at{' '}
              <a href="mailto:fashionframe2025@gmail.com">fashionframe2025@gmail.com</a>{' '}or{' '}
              <a href="tel:+919033318392">+91 90333 18392</a> (10:00 am – 6:00 pm).
            </p>
          </div>

          <div className="cu-info-grid">
            {infoItems.map((item, i) => (
              <div className="cu-info-cell" key={i}>
                <div className="cu-info-icon">{item.icon}</div>
                <div className="cu-info-label">{item.label}</div>
                <div className="cu-info-value">{item.value}</div>
                {item.sub && <div className="cu-info-sub">{item.sub}</div>}
              </div>
            ))}
          </div>

          <div className="cu-body">
            <div className="cu-reach-card">
              <div className="cu-reach-corner tl" /><div className="cu-reach-corner br" />
              <div className="cu-reach-eyebrow">Get in Touch</div>
              <h2 className="cu-reach-heading">We're here<br />for you</h2>
              <ul className="cu-reach-list">
                {[
                  { icon: <path d="M3 4.5A1.5 1.5 0 014.5 3h1.382a.5.5 0 01.447.276l1.5 3a.5.5 0 01-.112.563L6.5 8.062C7.53 10.07 9.93 12.47 11.937 13.5l1.223-1.217a.5.5 0 01.563-.112l3 1.5A.5.5 0 0117 14.118V15.5A1.5 1.5 0 0115.5 17C8.044 17 1 9.956 1 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>, label: 'Phone', text: '+91 90333 18392', sub: 'Mon – Sat, 10 am – 6 pm' },
                  { icon: <><rect x="1" y="4" width="16" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 5.5l8 5 8-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></>, label: 'Email', text: 'fashionframe2025@gmail.com' },
                  { icon: <><path d="M9 2a5 5 0 015 5c0 3.5-5 9-5 9S4 10.5 4 7a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.2"/><circle cx="9" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2"/></>, label: 'Studio', text: 'Plot 1126, Laxmi Textile Park,', sub: 'Sachin GIDC, Surat' },
                ].map((r, i) => (
                  <li className="cu-reach-item" key={i}>
                    <div className="cu-reach-item-icon">
                      <svg width="14" height="14" viewBox="0 0 18 18" fill="none">{r.icon}</svg>
                    </div>
                    <div className="cu-reach-item-text">
                      <strong>{r.label}</strong>
                      <span>{r.text}{r.sub && <><br />{r.sub}</>}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="cu-form-card">
              <h2 className="cu-form-title">Send a Message</h2>
              <p className="cu-form-sub">All fields are required. We'll respond within 48 hours.</p>

              <form onSubmit={handleSubmit} noValidate>
                <div className="cu-form-row">
                  <div className={`cu-field no-mb${focused === 'name' ? ' focused' : ''}${fieldErr('name') ? ' has-error' : ''}`}>
                    <label>Name <span className="cu-req-star">✦</span></label>
                    <input type="text" name="name" value={form.name} placeholder="Your full name"
                      onChange={handleChange} onFocus={() => setFocused('name')} onBlur={() => handleBlur('name')} />
                    {fieldErr('name') && (
                      <span className="cu-field-err">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4.5" stroke="currentColor" strokeWidth="1"/><path d="M5 3v2.5M5 7v.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
                        {errors.name}
                      </span>
                    )}
                  </div>
                  <div className={`cu-field no-mb${focused === 'email' ? ' focused' : ''}${fieldErr('email') ? ' has-error' : ''}`}>
                    <label>Email <span className="cu-req-star">✦</span></label>
                    <input type="email" name="email" value={form.email} placeholder="your@email.com"
                      onChange={handleChange} onFocus={() => setFocused('email')} onBlur={() => handleBlur('email')} />
                    {fieldErr('email') && (
                      <span className="cu-field-err">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4.5" stroke="currentColor" strokeWidth="1"/><path d="M5 3v2.5M5 7v.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                <div className={`cu-field${focused === 'phone' ? ' focused' : ''}${fieldErr('phone') ? ' has-error' : ''}`}>
                  <label>Phone Number <span className="cu-req-star">✦</span></label>
                  <input type="text" name="phone" value={form.phone} placeholder="+91 00000 00000"
                    onChange={handleChange} onFocus={() => setFocused('phone')} onBlur={() => handleBlur('phone')} />
                  {fieldErr('phone') && (
                    <span className="cu-field-err">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4.5" stroke="currentColor" strokeWidth="1"/><path d="M5 3v2.5M5 7v.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
                      {errors.phone}
                    </span>
                  )}
                </div>

                <div className={`cu-field${focused === 'message' ? ' focused' : ''}${fieldErr('message') ? ' has-error' : ''}`}>
                  <label>Message <span className="cu-req-star">✦</span></label>
                  <textarea name="message" rows="5" value={form.message} placeholder="Tell us how we can help…"
                    onChange={handleChange} onFocus={() => setFocused('message')} onBlur={() => handleBlur('message')} />
                  {fieldErr('message') && (
                    <span className="cu-field-err">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4.5" stroke="currentColor" strokeWidth="1"/><path d="M5 3v2.5M5 7v.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
                      {errors.message}
                    </span>
                  )}
                </div>

                <div className="cu-submit-wrap">
                  <span className="cu-submit-note">
                    <span className="cu-req-star" style={{color:'var(--gold)'}}>✦</span> Required fields
                  </span>
                  <button type="submit" className="cu-submit-btn">
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>

      <div className={`cu-toast${submitted ? ' show' : ''}`}>
        Message sent — we'll be in touch soon.
      </div>
    </>
  );
};

export default ContactUs;