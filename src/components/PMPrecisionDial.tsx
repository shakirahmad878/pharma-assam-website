import React, { useState, useEffect } from 'react';

interface PMPrecisionDialProps {
  onNavigate: (sectionId: string) => void;
  onOpenEnquiry: (context?: string) => void;
}

export const PMPrecisionDial: React.FC<PMPrecisionDialProps> = ({
  onNavigate,
  onOpenEnquiry
}) => {
  const STAGES = [
    {
      tab: 'Active ingredients',
      title: 'Active Ingredient Sourcing',
      text: 'We start with qualified suppliers and incoming-material checks, so every batch begins with ingredients we can trace.',
      speclabel: 'Focus',
      spec: 'Supplier qualification · Incoming material checks',
      points: [
        'Documented supplier approval',
        'Identity checks on incoming materials',
        'Full traceability from the first step'
      ],
      cta: 'Ask about sourcing'
    },
    {
      tab: 'Analytical',
      title: 'Analytical Chromatography (HPLC)',
      text: 'Reverse-phase HPLC, heavy-metal limit checks and FTIR fingerprinting for every manufacturing lot.',
      speclabel: 'Pharmacopoeial standard',
      spec: 'IP / BP / USP monographs · HPLC · GC-MS',
      points: [
        'Follows Indian Pharmacopoeia standards',
        'Chromatography and microbial limit assays',
        'Batch stability chamber testing'
      ],
      cta: 'Request analytical specs'
    },
    {
      tab: 'WHO-GMP',
      title: 'WHO-GMP Manufacturing',
      text: 'Production in controlled, documented conditions with clear records for every step.',
      speclabel: 'Certification',
      spec: 'WHO-GMP & ISO 9001:2015 Compliant Cleanrooms',
      points: [
        'Controlled cleanroom environment',
        'Batch manufacturing records',
        'Regular internal audits'
      ],
      cta: 'View certificates'
    },
    {
      tab: 'Dissolution',
      title: 'Dissolution & Release Testing',
      text: 'We confirm that each dosage form releases its active ingredient the way it should.',
      speclabel: 'Test',
      spec: 'Dissolution profile · Content uniformity',
      points: [
        'Tested against defined limits',
        'Results recorded per batch',
        'Out-of-spec lots are held back'
      ],
      cta: 'Ask about testing'
    },
    {
      tab: 'Northeast',
      title: 'Built for the Northeast',
      text: 'Heat and humidity are tested for, so products stay stable on the long road to Assam and the region.',
      speclabel: 'Stability',
      spec: 'Climate-condition stability studies',
      points: [
        'Stability checks for humid conditions',
        'Packaging chosen for transport',
        'Cold-chain where the product needs it'
      ],
      cta: 'Become a partner'
    },
    {
      tab: 'Batch release',
      title: 'Batch Review & Release',
      text: 'No batch leaves until its records and test results have been reviewed and signed off.',
      speclabel: 'Final check',
      spec: 'Documentation review · QA sign-off',
      points: [
        'Every batch has a unique number',
        'QA approval before dispatch',
        'Recall-ready records'
      ],
      cta: 'Contact quality team'
    }
  ];

  const SPOKES = 24;
  const PER = SPOKES / STAGES.length; // 4
  const R_IN = 80;
  const R_OUT = 196;
  const R_NODE = 222;
  const STEP_MS = 6000;

  const [cur, setCur] = useState(1); // Start on Analytical (index 1) as in script

  useEffect(() => {
    const timer = setInterval(() => {
      setCur((prev) => (prev + 1) % STAGES.length);
    }, STEP_MS);
    return () => clearInterval(timer);
  }, [STAGES.length]);

  const rad = (d: number) => (d * Math.PI) / 180;
  const ang = (i: number) => -90 + i * 15;

  const arc = (a0: number, a1: number, r0: number, r1: number) => {
    const p = (r: number, a: number) =>
      `${(Math.cos(rad(a)) * r).toFixed(1)} ${(Math.sin(rad(a)) * r).toFixed(1)}`;
    return `M ${p(r0, a0)} L ${p(r1, a0)} A ${r1} ${r1} 0 0 1 ${p(r1, a1)} L ${p(r0, a1)} A ${r0} ${r0} 0 0 0 ${p(r0, a0)} Z`;
  };

  const wedgeD = arc(ang(cur * PER) - 7.5, ang(cur * PER + PER - 1) + 7.5, 76, 238);

  const activeStage = STAGES[cur];

  return (
    <>
      <style>{`
        .pd {
          --navy: #14213d;
          --saffron: #FF9933;
          --green: #138808;
          --teal: #0f766e;
          --muted: #5b6580;
          font-family: "Inter", system-ui, sans-serif;
          color: var(--navy);
          background: #fff;
          padding: 96px 6vw 80px;
          position: relative;
        }
        .pd * { box-sizing: border-box; }
        .pd__head { text-align: center; max-width: 760px; margin: 0 auto 56px; }
        .pd__badge {
          display: inline-block;
          padding: 8px 18px;
          border-radius: 999px;
          background: #eef8f1;
          color: var(--green);
          font-size: .78rem;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
        }
        .pd h2 { font-size: clamp(2rem, 4.4vw, 3.2rem); line-height: 1.1; margin: 18px 0 14px; letter-spacing: -.02em; font-weight: 800; }
        .pd h2 span {
          background: linear-gradient(90deg, var(--saffron), var(--green));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .pd__lead { font-size: 1.08rem; line-height: 1.65; color: var(--muted); margin: 0; }
        .pd__grid {
          display: grid;
          grid-template-columns: minmax(300px, 1fr) minmax(320px, 1fr);
          gap: 56px;
          align-items: center;
          max-width: 1120px;
          margin: 0 auto;
        }
        /* dial */
        .pd__dialwrap { position: relative; width: 100%; max-width: 520px; aspect-ratio: 1; margin: 0 auto; }
        .pd__dialwrap svg { width: 100%; height: 100%; display: block; }
        .pd__node {
          position: absolute;
          width: 44px;
          height: 44px;
          margin: -22px 0 0 -22px;
          border-radius: 50%;
          border: 2px solid #d9deea;
          background: #fff;
          color: var(--navy);
          font-weight: 700;
          font-size: .95rem;
          cursor: pointer;
          transition: all .25s;
          box-shadow: 0 4px 14px rgba(20, 33, 61, .08);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pd__node:hover { border-color: var(--saffron); }
        .pd__node[aria-selected="true"] {
          background: var(--navy);
          color: #fff;
          border-color: var(--navy);
          transform: scale(1.18);
        }
        .pd__node:focus-visible, .pd__tab:focus-visible, .pd__cta:focus-visible {
          outline: 3px solid var(--saffron);
          outline-offset: 3px;
        }
        .spoke { stroke: #c3cadb; stroke-width: 2; stroke-linecap: round; transition: stroke .3s, stroke-width .3s; }
        .spoke.on { stroke: url(#pdg); stroke-width: 4; }
        .dot { fill: #c3cadb; transition: fill .3s, r .3s; }
        .dot.on { fill: var(--green); }
        #pd-wedge { transition: d .4s; }

        /* card */
        .pd__card {
          background: #fff;
          border: 1px solid #e4e8f1;
          border-radius: 24px;
          padding: 36px;
          box-shadow: 0 24px 60px rgba(20, 33, 61, .10);
        }
        .pd__step { font-size: .85rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--teal); }
        .pd__card h3 { font-size: 1.7rem; line-height: 1.2; margin: 8px 0 14px; font-weight: 800; }
        .pd__card p { font-size: 1.02rem; line-height: 1.65; color: #3a4560; margin: 0 0 20px; }
        .pd__spec { background: #f6f8fc; border-radius: 14px; padding: 14px 18px; margin-bottom: 20px; font-size: .95rem; font-weight: 600; }
        .pd__spec small { display: block; color: var(--muted); font-weight: 500; margin-bottom: 4px; }
        .pd__list { list-style: none; padding: 0; margin: 0 0 28px; display: grid; gap: 12px; }
        .pd__list li { display: flex; gap: 12px; font-size: 1rem; line-height: 1.5; color: #3a4560; }
        .pd__list li::before {
          content: "✓";
          flex: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #e6f5ea;
          color: var(--green);
          display: grid;
          place-items: center;
          font-size: .8rem;
          font-weight: 700;
          margin-top: 1px;
        }
        .pd__cta {
          display: inline-block;
          padding: 14px 28px;
          border-radius: 999px;
          background: var(--navy);
          color: #fff;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          border: none;
          transition: background .2s, transform .2s;
        }
        .pd__cta:hover {
          background: #0d172a;
          transform: translateY(-2px);
        }
        .pd__fade { animation: pdfade .35s ease; }
        @keyframes pdfade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

        /* controls */
        .pd__tabs {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin: 44px auto 0;
          max-width: 1120px;
        }
        .pd__tab {
          padding: 10px 18px;
          border-radius: 999px;
          border: 1.5px solid #d9deea;
          background: #fff;
          color: var(--navy);
          font-size: .95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all .2s;
        }
        .pd__tab:hover { border-color: var(--navy); }
        .pd__tab[aria-selected="true"] {
          background: var(--navy);
          border-color: var(--navy);
          color: #fff;
        }

        @media (max-width: 860px) {
          .pd { padding: 64px 5vw; }
          .pd__grid { grid-template-columns: 1fr; gap: 36px; }
          .pd__card { padding: 26px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pd__fade { animation: none; }
          .spoke, .dot, .pd__node { transition: none; }
        }
      `}</style>

      <section className="pd" id="precision" aria-labelledby="pd-title">
        <div className="pd__head">
          <span className="pd__badge">Made in India · Pharmaceutical Excellence</span>
          <h2 id="pd-title">Six stages. <span>One standard of care.</span></h2>
          <p className="pd__lead">
            Every NLCL product moves through the same six-stage quality cycle, from analysis to batch release, built for the climate and needs of Assam and the Northeast.
          </p>
        </div>

        <div className="pd__grid">
          {/* Dial SVG & Orbit Nodes */}
          <div className="pd__dialwrap" id="pd-dial">
            <svg viewBox="-260 -260 520 520" aria-hidden="true">
              <defs>
                <linearGradient id="pdg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FF9933" />
                  <stop offset="100%" stopColor="#138808" />
                </linearGradient>
                <radialGradient id="pdbg">
                  <stop offset="0%" stopColor="#fff" />
                  <stop offset="100%" stopColor="#f1f4fa" />
                </radialGradient>
              </defs>

              <circle r="238" fill="url(#pdbg)" stroke="#e4e8f1" strokeWidth="2" />
              <circle r="206" fill="none" stroke="#e4e8f1" strokeWidth="1.5" strokeDasharray="2 8" />
              
              {/* Active sector wedge */}
              <path id="pd-wedge" d={wedgeD} fill="url(#pdg)" opacity=".13" />

              {/* 24 Spokes + Perimeter Dots */}
              <g id="pd-spokes">
                {Array.from({ length: SPOKES }, (_, i) => {
                  const a = rad(ang(i));
                  const c = Math.cos(a);
                  const s = Math.sin(a);
                  const isOn = Math.floor(i / PER) === cur;

                  return (
                    <React.Fragment key={`spoke-grp-${i}`}>
                      <line
                        x1={c * R_IN}
                        y1={s * R_IN}
                        x2={c * R_OUT}
                        y2={s * R_OUT}
                        className={`spoke ${isOn ? 'on' : ''}`}
                      />
                      <circle
                        cx={c * R_OUT}
                        cy={s * R_OUT}
                        r={5}
                        className={`dot ${isOn ? 'on' : ''}`}
                      />
                    </React.Fragment>
                  );
                })}
              </g>

              {/* Central Hub Disc */}
              <circle r="72" fill="#fff" stroke="url(#pdg)" strokeWidth="5" />
              <text
                y="-4"
                textAnchor="middle"
                fontSize="30"
                fontWeight="800"
                fill="#14213d"
                fontFamily="Inter,system-ui,sans-serif"
              >
                NLCL
              </text>
              <text
                y="22"
                textAnchor="middle"
                fontSize="11.5"
                fontWeight="700"
                letterSpacing="2"
                fill="#138808"
                fontFamily="Inter,system-ui,sans-serif"
              >
                MADE IN INDIA
              </text>
            </svg>

            {/* Orbiting numbered stage buttons */}
            {STAGES.map((st, k) => {
              const mid = ang(k * PER + (PER - 1) / 2);
              const a = rad(mid);
              const left = `${50 + (Math.cos(a) * R_NODE / 520) * 100}%`;
              const top = `${50 + (Math.sin(a) * R_NODE / 520) * 100}%`;

              return (
                <button
                  key={`node-${k}`}
                  type="button"
                  className="pd__node"
                  aria-selected={cur === k}
                  aria-label={st.tab}
                  role="tab"
                  style={{ left, top }}
                  onClick={() => setCur(k)}
                >
                  {k + 1}
                </button>
              );
            })}
          </div>

          {/* Dynamic Stage Details Card */}
          <article className="pd__card" aria-live="polite">
            <div key={`card-${cur}`} className="pd__fade" id="pd-card">
              <div className="pd__step" id="pd-step">
                Stage {cur + 1} of {STAGES.length}
              </div>
              <h3 id="pd-title2">{activeStage.title}</h3>
              <p id="pd-text">{activeStage.text}</p>
              
              <div className="pd__spec">
                <small id="pd-speclabel">{activeStage.speclabel}</small>
                <span id="pd-spec">{activeStage.spec}</span>
              </div>
              
              <ul className="pd__list" id="pd-list">
                {activeStage.points.map((pt, idx) => (
                  <li key={`pt-${idx}`}>{pt}</li>
                ))}
              </ul>

              <button
                type="button"
                className="pd__cta"
                id="pd-cta"
                onClick={() => onOpenEnquiry(`${activeStage.title} - ${activeStage.cta}`)}
              >
                {activeStage.cta}
              </button>
            </div>
          </article>
        </div>

        {/* Bottom Stage Control Tabs */}
        <div className="pd__tabs" role="tablist" aria-label="Quality stages" id="pd-tabs">
          {STAGES.map((st, k) => (
            <button
              key={`tab-${k}`}
              type="button"
              className="pd__tab"
              role="tab"
              aria-selected={cur === k}
              onClick={() => setCur(k)}
            >
              {st.tab}
            </button>
          ))}
        </div>
      </section>
    </>
  );
};
