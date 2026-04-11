import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API_ENDPOINTS from '../api/apiConfig';

function decodeHtml(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

const Pages = ({ token }) => {
  const { slug } = useParams();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);

  const API_URL = `${API_ENDPOINTS.GET_PAGES}?slug=${slug}`;

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      setVisible(false);
      setError('');

      try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(API_URL, { method: 'GET', headers });
        const data = await response.json();

        if (response.ok && data.status) {
          setTitle(data.page.page_title);
          setDescription(decodeHtml(data.page.page_description));
        } else {
          setError(data.message || 'Page not found.');
          setDescription('<p>Page not found.</p>');
        }
      } catch (err) {
        console.error('Error fetching page:', err);
        setError('An error occurred while fetching the page.');
        setDescription('<p>Error loading page.</p>');
      }

      setLoading(false);
      setTimeout(() => setVisible(true), 50);
    };

    fetchPage();
  }, [slug, token]);

  const displayTitle = title || (slug ? slug.replace(/-/g, ' ') : '');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

        :root {
          --gold: #C9A96E;
          --gold-light: #E2C898;
          --gold-dark: #8A6B3A;
          --cream: #FAF7F2;
          --ink: #1A1714;
          --ink-soft: #3D3530;
          --mist: #F0EBE3;
          --border: rgba(201, 169, 110, 0.25);
        }

        .lux-page-root {
          min-height: 100vh;
          background: var(--cream);
          font-family: 'Jost', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Ambient background texture */
        .lux-page-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 15% 10%, rgba(201,169,110,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 85% 90%, rgba(201,169,110,0.06) 0%, transparent 55%);
          pointer-events: none;
          z-index: 0;
        }

        /* Grain overlay */
        .lux-page-root::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        }

        .lux-container {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
          padding: 28px 40px 80px;
        }

        /* ── Ornamental top line ── */
        .lux-ornament-top {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 18px;
          opacity: 0;
          transform: translateY(-10px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .lux-ornament-top.visible { opacity: 1; transform: translateY(0); }

        .lux-ornament-top .line {
          flex: 1;
          max-width: 120px;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--gold));
        }
        .lux-ornament-top .line.right {
          background: linear-gradient(to left, transparent, var(--gold));
        }
        .lux-ornament-top .diamond {
          width: 6px;
          height: 6px;
          background: var(--gold);
          transform: rotate(45deg);
          flex-shrink: 0;
        }
        .lux-ornament-top .diamond-sm {
          width: 3px;
          height: 3px;
          background: var(--gold-light);
          transform: rotate(45deg);
          flex-shrink: 0;
        }

        /* ── Page title ── */
        .lux-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(1.8rem, 3.5vw, 2.8rem);
          line-height: 1.15;
          letter-spacing: 0.02em;
          color: var(--ink);
          text-align: center;
          margin: 0 0 8px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 1s ease 0.15s, transform 1s ease 0.15s;
          text-transform: capitalize;
        }
        .lux-title.visible { opacity: 1; transform: translateY(0); }

        .lux-title em {
          font-style: italic;
          color: var(--gold-dark);
        }

        /* ── Gold rule beneath title ── */
        .lux-rule {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin: 14px auto 28px;
          opacity: 0;
          transition: opacity 0.9s ease 0.3s;
        }
        .lux-rule.visible { opacity: 1; }

        .lux-rule .rule-line {
          width: 60px;
          height: 1px;
          background: var(--gold);
        }
        .lux-rule .rule-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--gold);
        }

        /* ── Loading state ── */
        .lux-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 80px 0;
          gap: 24px;
          opacity: 0;
          animation: fadeIn 0.5s ease 0.2s forwards;
        }

        @keyframes fadeIn { to { opacity: 1; } }

        .lux-loader {
          width: 48px;
          height: 48px;
          position: relative;
        }
        .lux-loader::before,
        .lux-loader::after {
          content: '';
          position: absolute;
          inset: 0;
          border: 1px solid transparent;
          border-radius: 50%;
        }
        .lux-loader::before {
          border-top-color: var(--gold);
          border-right-color: var(--gold);
          animation: spin 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .lux-loader::after {
          border-bottom-color: var(--gold-light);
          border-left-color: var(--gold-light);
          animation: spin 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite reverse;
          animation-delay: -0.7s;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .lux-loading-text {
          font-family: 'Jost', sans-serif;
          font-weight: 200;
          font-size: 0.75rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--gold-dark);
        }

        /* ── Content card ── */
        .lux-content-card {
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid var(--border);
          border-radius: 2px;
          padding: 56px 64px;
          position: relative;
          backdrop-filter: blur(8px);
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 1s ease 0.4s, transform 1s ease 0.4s;
          box-shadow:
            0 1px 0 rgba(201,169,110,0.15),
            0 40px 80px rgba(26,23,20,0.06),
            0 8px 24px rgba(26,23,20,0.04);
        }
        .lux-content-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Corner accents */
        .lux-content-card::before,
        .lux-content-card::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          border-color: var(--gold);
          border-style: solid;
          opacity: 0.6;
        }
        .lux-content-card::before {
          top: -1px;
          left: -1px;
          border-width: 1px 0 0 1px;
        }
        .lux-content-card::after {
          bottom: -1px;
          right: -1px;
          border-width: 0 1px 1px 0;
        }

        /* Inner corner accents via pseudo wrappers */
        .lux-corner-tr,
        .lux-corner-bl {
          position: absolute;
          width: 20px;
          height: 20px;
          border-color: var(--gold);
          border-style: solid;
          opacity: 0.6;
        }
        .lux-corner-tr {
          top: -1px;
          right: -1px;
          border-width: 1px 1px 0 0;
        }
        .lux-corner-bl {
          bottom: -1px;
          left: -1px;
          border-width: 0 0 1px 1px;
        }

        /* ── Prose styles ── */
        .lux-prose {
          color: var(--ink-soft);
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 1rem;
          line-height: 1.9;
          letter-spacing: 0.01em;
        }

        .lux-prose h1,
        .lux-prose h2,
        .lux-prose h3,
        .lux-prose h4 {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400;
          color: var(--ink);
          line-height: 1.3;
          margin: 2em 0 0.6em;
          letter-spacing: 0.02em;
        }
        .lux-prose h1 { font-size: 2rem; font-style: italic; }
        .lux-prose h2 { font-size: 1.6rem; }
        .lux-prose h3 { font-size: 1.3rem; }

        .lux-prose p { margin: 0 0 1.4em; }
        .lux-prose p:last-child { margin-bottom: 0; }

        .lux-prose a {
          color: var(--gold-dark);
          text-decoration: none;
          border-bottom: 1px solid rgba(138,107,58,0.3);
          transition: border-color 0.2s, color 0.2s;
        }
        .lux-prose a:hover {
          color: var(--gold);
          border-bottom-color: var(--gold);
        }

        .lux-prose strong {
          font-weight: 500;
          color: var(--ink);
        }

        .lux-prose em {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 1.05em;
          color: var(--gold-dark);
        }

        .lux-prose ul, .lux-prose ol {
          padding-left: 1.4em;
          margin: 0 0 1.4em;
        }
        .lux-prose li { margin-bottom: 0.4em; }

        .lux-prose blockquote {
          margin: 2em 0;
          padding: 1.2em 2em;
          border-left: 2px solid var(--gold);
          background: rgba(201,169,110,0.05);
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.15em;
          font-style: italic;
          color: var(--ink);
        }

        .lux-prose hr {
          border: none;
          border-top: 1px solid var(--border);
          margin: 2.5em 0;
        }

        .lux-prose img {
          max-width: 100%;
          border-radius: 2px;
          margin: 1.5em 0;
        }

        /* ── Error state ── */
        .lux-error {
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(180, 60, 40, 0.05);
          border: 1px solid rgba(180, 60, 40, 0.18);
          border-radius: 2px;
          padding: 18px 24px;
          margin-top: 24px;
          opacity: 0;
          animation: fadeIn 0.5s ease 0.5s forwards;
        }
        .lux-error-icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          color: #B03A2E;
        }
        .lux-error p {
          font-size: 0.82rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #8B2E22;
          margin: 0;
          font-weight: 400;
        }

        /* ── Bottom ornament ── */
        .lux-ornament-bottom {
          text-align: center;
          margin-top: 56px;
          opacity: 0;
          transition: opacity 0.8s ease 0.7s;
        }
        .lux-ornament-bottom.visible { opacity: 1; }
        .lux-ornament-bottom svg { color: var(--gold); opacity: 0.5; }

        @media (max-width: 640px) {
          .lux-container { padding: 20px 20px 60px; }
          .lux-content-card { padding: 28px 22px; }
          .lux-title { font-size: 1.7rem; }
        }
      `}</style>

      <div className="lux-page-root">
        <div className="lux-container">

          {/* Top ornament */}
          <div className={`lux-ornament-top ${visible ? 'visible' : ''}`}>
            <div className="line" />
            <div className="diamond-sm" />
            <div className="diamond" />
            <div className="diamond-sm" />
            <div className="line right" />
          </div>

          {/* Title */}
          {!loading && displayTitle && (
            <h1 className={`lux-title ${visible ? 'visible' : ''}`}>
              {displayTitle}
            </h1>
          )}

          {/* Rule */}
          {!loading && (
            <div className={`lux-rule ${visible ? 'visible' : ''}`}>
              <div className="rule-line" />
              <div className="rule-dot" />
              <div className="rule-line" />
            </div>
          )}

          {/* Main content */}
          {loading ? (
            <div className="lux-loading">
              <div className="lux-loader" />
              <span className="lux-loading-text">Loading</span>
            </div>
          ) : (
            <div className={`lux-content-card ${visible ? 'visible' : ''}`}>
              <div className="lux-corner-tr" />
              <div className="lux-corner-bl" />
              <div
                className="lux-prose"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="lux-error">
              <svg className="lux-error-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1"/>
                <path d="M8 5v3.5M8 11v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <p>{error}</p>
            </div>
          )}

          {/* Bottom ornament */}
          {!loading && (
            <div className={`lux-ornament-bottom ${visible ? 'visible' : ''}`}>
              <svg width="80" height="16" viewBox="0 0 80 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="8" x2="30" y2="8" stroke="currentColor" strokeWidth="0.5"/>
                <rect x="35" y="5" width="4" height="4" transform="rotate(45 37 7)" fill="currentColor"/>
                <rect x="39" y="6.5" width="3" height="3" transform="rotate(45 40.5 8)" stroke="currentColor" strokeWidth="0.5" fill="none"/>
                <rect x="43" y="5" width="4" height="4" transform="rotate(45 45 7)" fill="currentColor"/>
                <line x1="50" y1="8" x2="80" y2="8" stroke="currentColor" strokeWidth="0.5"/>
              </svg>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Pages;