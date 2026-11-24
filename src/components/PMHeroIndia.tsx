import React from 'react';

interface PMHeroIndiaProps {
  onNavigate: (sectionId: string) => void;
  onOpenEnquiry: (context?: string) => void;
}

export const PMHeroIndia: React.FC<PMHeroIndiaProps> = ({
  onNavigate,
  onOpenEnquiry
}) => {
  return (
    <>
      <style>{`
        .nl-hero {
          --saffron: #FF9933;
          --green: #138808;
          --navy: #14213d;
          --ink: #14213d;
          position: relative;
          overflow: hidden;
          min-height: 84vh;
          display: flex;
          align-items: center;
          padding: 64px 6vw;
          background: linear-gradient(120deg, #fff7ee 0%, #ffffff 50%, #eefaf0 100%);
          font-family: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
          color: var(--ink);
        }
        .nl-hero__text {
          position: relative;
          z-index: 2;
          max-width: 580px;
        }
        .nl-hero__eyebrow {
          letter-spacing: .18em;
          text-transform: uppercase;
          font-size: .82rem;
          color: var(--green);
          font-weight: 700;
        }
        .nl-hero h1 {
          font-size: clamp(2.3rem, 5vw, 3.8rem);
          line-height: 1.1;
          margin: .4em 0;
          font-weight: 800;
        }
        .nl-hero h1 span {
          background: linear-gradient(90deg, var(--saffron), var(--green));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .nl-hero p {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #3a4560;
        }
        .nl-hero__cta {
          display: flex;
          gap: 14px;
          margin-top: 28px;
          flex-wrap: wrap;
        }
        .nl-btn {
          padding: 13px 28px;
          border-radius: 999px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
        }
        .nl-btn--primary {
          background: var(--navy);
          color: #fff;
          border: 2px solid var(--navy);
          box-shadow: 0 4px 14px rgba(27, 42, 107, 0.25);
        }
        .nl-btn--primary:hover {
          background: #131f4f;
          border-color: #131f4f;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(27, 42, 107, 0.35);
        }
        .nl-btn--ghost {
          border: 2px solid var(--navy);
          color: var(--navy);
          background: transparent;
        }
        .nl-btn--ghost:hover {
          background: rgba(27, 42, 107, 0.06);
          transform: translateY(-2px);
        }
        .nl-hero__stats {
          display: flex;
          gap: 36px;
          margin-top: 36px;
          flex-wrap: wrap;
        }
        .nl-hero__stats b {
          display: block;
          font-size: 1.65rem;
          color: var(--navy);
          font-weight: 800;
        }
        .nl-hero__stats small {
          color: #5b6580;
          font-size: 0.85rem;
          font-weight: 500;
        }

        /* Mandala: 24 petals (a nod to the 24 spokes of the Ashoka Chakra) with pharma/health motifs */
        .nl-mandala {
          position: absolute;
          right: -6vw;
          top: 50%;
          width: min(62vw, 760px);
          aspect-ratio: 1;
          transform: translateY(-50%);
          opacity: .95;
          pointer-events: none;
        }
        .nl-mandala svg {
          width: 100%;
          height: 100%;
        }
        .ring-a {
          transform-origin: center;
          animation: spin 90s linear infinite;
        }
        .ring-b {
          transform-origin: center;
          animation: spin 140s linear infinite reverse;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ring-a, .ring-b { animation: none; }
        }
        @media (max-width: 820px) {
          .nl-mandala {
            opacity: .18;
            right: -30vw;
            width: 110vw;
          }
        }
      `}</style>

      <section className="nl-hero select-none">
        <div className="nl-hero__text">
          <div className="nl-hero__eyebrow">
            New Life Care Laboratories · Made in India
          </div>
          
          <h1>
            Creating Health.<br />
            <span>Inspiring Life.</span>
          </h1>
          
          <p>
            Quality pharmaceutical and nutraceutical formulations, developed in India for families across the country.
          </p>
          
          <div className="nl-hero__cta">
            <button 
              onClick={() => onNavigate('products')}
              className="nl-btn nl-btn--primary"
            >
              Explore Products
            </button>
            <button 
              onClick={() => onOpenEnquiry('B2B Partnership & Franchise Inquiry')}
              className="nl-btn nl-btn--ghost"
            >
              Partner With Us
            </button>
          </div>
          
          <div className="nl-hero__stats">
            <div>
              <b>10+</b>
              <small>Products</small>
            </div>
            <div>
              <b>GMP</b>
              <small>Quality focus</small>
            </div>
            <div>
              <b>NorthEast</b>
              <small>Distribution</small>
            </div>
          </div>
        </div>

        {/* Ashoka Chakra Mandala Visual Motif */}
        <div className="nl-mandala" aria-hidden="true">
          <svg viewBox="-300 -300 600 600" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="nlg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FF9933" />
                <stop offset="50%" stopColor="#1b2a6b" />
                <stop offset="100%" stopColor="#138808" />
              </linearGradient>
            </defs>

            {/* Outer ring: 24 petals (representing the 24 spokes of the Ashoka Chakra) */}
            <g className="ring-a" fill="url(#nlg)" opacity=".9">
              {Array.from({ length: 24 }, (_, i) => (
                <path
                  key={`petal-${i}`}
                  d="M0 -120 C 22 -170, 22 -230, 0 -280 C -22 -230, -22 -170, 0 -120 Z"
                  transform={`rotate(${i * 15})`}
                  opacity={i % 2 ? 0.55 : 0.9}
                />
              ))}
            </g>

            {/* Inner ring: 12 circles (molecule dots) */}
            <g className="ring-b" fill="none" stroke="#1b2a6b" strokeWidth="2" opacity=".6">
              {Array.from({ length: 12 }, (_, i) => (
                <circle
                  key={`dot-${i}`}
                  r="14"
                  cx="0"
                  cy="-96"
                  transform={`rotate(${i * 30})`}
                />
              ))}
            </g>

            {/* Central White Emblemed Disc */}
            <circle r="62" fill="#fff" stroke="url(#nlg)" strokeWidth="6" />

            {/* Simple Health Cross at Centre */}
            <path d="M-10 -34h20v24h24v20h-24v24h-20v-24h-24v-20h24z" fill="#138808" />
          </svg>
        </div>
      </section>
    </>
  );
};
