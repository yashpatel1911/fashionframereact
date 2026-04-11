import React, { useEffect, useRef, useState } from 'react';

const featureData = [
  {
    title: "Book An Appointment",
    description: "Reserve a personal styling session with our expert consultants, crafted around your taste and occasion.",
    number: "01",
    svg: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="8" width="26" height="23" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M5 15h26" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M12 5v6M24 5v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <rect x="11" y="20" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1"/>
        <rect x="21" y="20" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
  },
  {
    title: "Pick Up In Store",
    description: "Collect your curated pieces in-store, where our team ensures every detail is perfect before it leaves.",
    number: "02",
    svg: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 14l2.5-8h19L30 14" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
        <path d="M4 14h28v16a1 1 0 01-1 1H5a1 1 0 01-1-1V14z" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M14 31V22h8v9" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M4 14h8l-1 6H4M28 14h4v6h-7l-1-6h4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Special Packaging",
    description: "Every order is dressed in our signature wrapping — a ceremony of texture, ribbon, and refined detail.",
    number: "03",
    svg: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="14" width="24" height="17" rx="1" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M4 14h28v4H4z" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M18 14v17" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M18 14c0 0-5-6-5-8s2-2 3 0 2 5 2 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M18 14c0 0 5-6 5-8s-2-2-3 0-2 5-2 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Free Global Returns",
    description: "Shop with complete confidence. Returns are seamless, free of charge, from anywhere in the world.",
    number: "04",
    svg: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="13" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M5 18h26" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M18 5c0 0-6 5-6 13s6 13 6 13M18 5c0 0 6 5 6 13s-6 13-6 13" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M23 13l-5 5 5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

// Ethno weave pattern as SVG bg — inspired by traditional Indian textile motifs
const WeaveTile = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.035, pointerEvents: 'none' }}>
    <defs>
      <pattern id="weave" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        {/* Horizontal threads */}
        <line x1="0" y1="10" x2="60" y2="10" stroke="#C9A96E" strokeWidth="1.5"/>
        <line x1="0" y1="30" x2="60" y2="30" stroke="#C9A96E" strokeWidth="1.5"/>
        <line x1="0" y1="50" x2="60" y2="50" stroke="#C9A96E" strokeWidth="1.5"/>
        {/* Vertical threads */}
        <line x1="10" y1="0" x2="10" y2="60" stroke="#C9A96E" strokeWidth="1.5"/>
        <line x1="30" y1="0" x2="30" y2="60" stroke="#C9A96E" strokeWidth="1.5"/>
        <line x1="50" y1="0" x2="50" y2="60" stroke="#C9A96E" strokeWidth="1.5"/>
        {/* Crossing diamond motifs */}
        <rect x="7" y="7" width="6" height="6" transform="rotate(45 10 10)" fill="none" stroke="#C9A96E" strokeWidth="0.8"/>
        <rect x="27" y="7" width="6" height="6" transform="rotate(45 30 10)" fill="none" stroke="#C9A96E" strokeWidth="0.8"/>
        <rect x="47" y="7" width="6" height="6" transform="rotate(45 50 10)" fill="none" stroke="#C9A96E" strokeWidth="0.8"/>
        <rect x="7" y="27" width="6" height="6" transform="rotate(45 10 30)" fill="none" stroke="#C9A96E" strokeWidth="0.8"/>
        <rect x="27" y="27" width="6" height="6" transform="rotate(45 30 30)" fill="none" stroke="#C9A96E" strokeWidth="0.8"/>
        <rect x="47" y="27" width="6" height="6" transform="rotate(45 50 30)" fill="none" stroke="#C9A96E" strokeWidth="0.8"/>
        <rect x="7" y="47" width="6" height="6" transform="rotate(45 10 50)" fill="none" stroke="#C9A96E" strokeWidth="0.8"/>
        <rect x="27" y="47" width="6" height="6" transform="rotate(45 30 50)" fill="none" stroke="#C9A96E" strokeWidth="0.8"/>
        <rect x="47" y="47" width="6" height="6" transform="rotate(45 50 50)" fill="none" stroke="#C9A96E" strokeWidth="0.8"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#weave)"/>
    </defs>
    <rect width="100%" height="100%" fill="url(#weave)"/>
  </svg>
);

const Features = () => {
  const [visible, setVisible] = useState([]);
  const refs = useRef([]);

  useEffect(() => {
    const observers = refs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible((prev) => [...new Set([...prev, i])]);
            obs.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o && o.disconnect());
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

        :root {
          --gold: #C9A96E;
          --gold-light: #E2C898;
          --gold-dark: #8A6B3A;
          --cream: #FAF7F2;
          --ink: #1A1714;
          --ink-soft: #3D3530;
          --border: rgba(201,169,110,0.22);
        }

        .ft-section {
          background: var(--cream);
          padding: 72px 40px 80px;
          position: relative;
          overflow: hidden;
          font-family: 'Jost', sans-serif;
        }

        /* Ambient glow spots */
        .ft-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 40% at 0% 50%, rgba(201,169,110,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 100% 50%, rgba(201,169,110,0.06) 0%, transparent 60%);
          pointer-events: none;
        }

        .ft-inner {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* ── Section header ── */
        .ft-header {
          text-align: center;
          margin-bottom: 56px;
        }

        .ft-eyebrow {
          font-size: 0.62rem;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 400;
          margin-bottom: 14px;
          opacity: 0;
          animation: ftFadeUp 0.7s ease forwards;
        }

        .ft-heading {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          color: var(--ink);
          letter-spacing: 0.03em;
          margin: 0 0 16px;
          opacity: 0;
          animation: ftFadeUp 0.8s ease 0.1s forwards;
        }

        .ft-ornament {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          opacity: 0;
          animation: ftFadeUp 0.7s ease 0.2s forwards;
        }
        .ft-ornament .ln { width: 40px; height: 1px; background: var(--gold); }
        .ft-ornament .dm { width: 4px; height: 4px; background: var(--gold); transform: rotate(45deg); }
        .ft-ornament .dm-sm { width: 2.5px; height: 2.5px; background: var(--gold-light); transform: rotate(45deg); }

        /* ── Grid ── */
        .ft-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 2px;
          overflow: hidden;
        }

        /* ── Card ── */
        .ft-card {
          background: var(--cream);
          padding: 44px 32px 40px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 0;
          transition: background 0.35s;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s ease, background 0.35s;
        }
        .ft-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .ft-card:hover { background: #fff; }

        /* Weave texture bg per card */
        .ft-card-weave {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        /* Ethno border accent — top edge with a traditional band motif */
        .ft-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg,
            transparent 0%,
            var(--gold-dark) 20%,
            var(--gold) 40%,
            var(--gold-light) 50%,
            var(--gold) 60%,
            var(--gold-dark) 80%,
            transparent 100%
          );
          opacity: 0;
          transition: opacity 0.35s;
        }
        .ft-card:hover::before { opacity: 1; }

        /* Number watermark */
        .ft-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 5rem;
          font-weight: 300;
          color: rgba(201,169,110,0.1);
          position: absolute;
          top: 12px;
          right: 20px;
          line-height: 1;
          pointer-events: none;
          transition: color 0.35s;
          user-select: none;
        }
        .ft-card:hover .ft-number { color: rgba(201,169,110,0.18); }

        /* Icon */
        .ft-icon-wrap {
          width: 56px;
          height: 56px;
          border: 1px solid var(--border);
          border-radius: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold-dark);
          margin-bottom: 24px;
          position: relative;
          transition: border-color 0.35s, color 0.35s;
          flex-shrink: 0;
        }

        /* Corner pip on icon box */
        .ft-icon-wrap::before,
        .ft-icon-wrap::after {
          content: '';
          position: absolute;
          width: 6px; height: 6px;
          border-color: var(--gold);
          border-style: solid;
          opacity: 0;
          transition: opacity 0.35s;
        }
        .ft-icon-wrap::before { top: -1px; left: -1px; border-width: 1px 0 0 1px; }
        .ft-icon-wrap::after  { bottom: -1px; right: -1px; border-width: 0 1px 1px 0; }
        .ft-card:hover .ft-icon-wrap::before,
        .ft-card:hover .ft-icon-wrap::after { opacity: 1; }
        .ft-card:hover .ft-icon-wrap { border-color: rgba(201,169,110,0.5); color: var(--gold); }

        /* Title */
        .ft-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-weight: 400;
          color: var(--ink);
          letter-spacing: 0.025em;
          margin: 0 0 12px;
          line-height: 1.3;
        }

        /* Divider */
        .ft-divider {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 14px;
        }
        .ft-divider .d-line { height: 1px; width: 28px; background: var(--gold); opacity: 0.5; transition: width 0.35s, opacity 0.35s; }
        .ft-divider .d-dot  { width: 2.5px; height: 2.5px; background: var(--gold); transform: rotate(45deg); }
        .ft-card:hover .ft-divider .d-line { width: 40px; opacity: 1; }

        /* Description */
        .ft-desc {
          font-size: 0.85rem;
          font-weight: 300;
          line-height: 1.75;
          color: var(--ink-soft);
          letter-spacing: 0.01em;
          margin: 0;
        }

        /* Bottom border band */
        .ft-card-band {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: repeating-linear-gradient(
            90deg,
            var(--gold) 0px,
            var(--gold) 4px,
            transparent 4px,
            transparent 8px
          );
          opacity: 0;
          transition: opacity 0.35s;
        }
        .ft-card:hover .ft-card-band { opacity: 0.4; }

        /* Bottom ornament */
        .ft-footer {
          text-align: center;
          margin-top: 48px;
          opacity: 0;
          animation: ftFadeUp 0.8s ease 0.8s forwards;
        }
        .ft-footer svg { color: var(--gold); opacity: 0.45; }

        @keyframes ftFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 960px) {
          .ft-grid { grid-template-columns: repeat(2, 1fr); }
          .ft-section { padding: 56px 28px 64px; }
        }
        @media (max-width: 540px) {
          .ft-grid { grid-template-columns: 1fr; }
          .ft-section { padding: 44px 18px 52px; }
          .ft-card { padding: 32px 24px; }
        }
      `}</style>

      <section className="ft-section">
        <div className="ft-inner">

          {/* Header */}
          <div className="ft-header">
            <p className="ft-eyebrow">The Fashion Frame Promise</p>
            <h2 className="ft-heading">Crafted for Every Detail</h2>
            <div className="ft-ornament">
              <div className="ln" />
              <div className="dm-sm" /><div className="dm" /><div className="dm-sm" />
              <div className="ln" />
            </div>
          </div>

          {/* Cards */}
          <div className="ft-grid">
            {featureData.map((f, i) => (
              <div
                key={i}
                ref={(el) => (refs.current[i] = el)}
                className={`ft-card${visible.includes(i) ? ' visible' : ''}`}
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                {/* Weave texture */}
                <div className="ft-card-weave">
                  <svg width="100%" height="100%" viewBox="0 0 60 60" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.04 }}>
                    <defs>
                      <pattern id={`wp${i}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="5" x2="20" y2="5" stroke="#C9A96E" strokeWidth="0.8"/>
                        <line x1="0" y1="15" x2="20" y2="15" stroke="#C9A96E" strokeWidth="0.8"/>
                        <line x1="5" y1="0" x2="5" y2="20" stroke="#C9A96E" strokeWidth="0.8"/>
                        <line x1="15" y1="0" x2="15" y2="20" stroke="#C9A96E" strokeWidth="0.8"/>
                        <rect x="3" y="3" width="4" height="4" transform="rotate(45 5 5)" fill="none" stroke="#C9A96E" strokeWidth="0.5"/>
                        <rect x="13" y="13" width="4" height="4" transform="rotate(45 15 15)" fill="none" stroke="#C9A96E" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#wp${i})`}/>
                  </svg>
                </div>

                {/* Number watermark */}
                <span className="ft-number">{f.number}</span>

                {/* Icon */}
                <div className="ft-icon-wrap">{f.svg}</div>

                {/* Title */}
                <h3 className="ft-title">{f.title}</h3>

                {/* Mini divider */}
                <div className="ft-divider">
                  <div className="d-line" />
                  <div className="d-dot" />
                </div>

                {/* Description */}
                <p className="ft-desc">{f.description}</p>

                {/* Bottom dashed band */}
                <div className="ft-card-band" />
              </div>
            ))}
          </div>

          {/* Footer ornament */}
          <div className="ft-footer">
            <svg width="120" height="16" viewBox="0 0 120 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="8" x2="42" y2="8" stroke="currentColor" strokeWidth="0.6"/>
              <rect x="46" y="5" width="5" height="5" transform="rotate(45 48.5 7.5)" fill="currentColor"/>
              <rect x="52.5" y="6" width="4" height="4" transform="rotate(45 54.5 8)" stroke="currentColor" strokeWidth="0.7" fill="none"/>
              <rect x="59" y="5" width="5" height="5" transform="rotate(45 61.5 7.5)" fill="currentColor"/>
              <line x1="66" y1="8" x2="120" y2="8" stroke="currentColor" strokeWidth="0.6"/>
            </svg>
          </div>

        </div>
      </section>
    </>
  );
};

export default Features;