import React, { useState, useRef, useEffect } from 'react';

interface PMPartnersAndFlagshipProps {
  onNavigate: (sectionId: string) => void;
  onOpenEnquiry: (context?: string) => void;
  activeSection?: string;
}

export const PMPartnersAndFlagship: React.FC<PMPartnersAndFlagshipProps> = ({
  onNavigate,
  onOpenEnquiry,
  activeSection
}) => {
  const PRODUCTS = [
    {
      name: "Lyco-KR",
      form: "Syrup · 200 ml",
      cat: "Nutritional support",
      comp: "Lycopene 10% (2000 IU) + L-Lysine 200 mg + Zinc + B-Complex",
      note: "Sugar-free antioxidant and nutritional support formulation.",
      img: "./images/products/lyco-kr-syrup.jpg",
      href: "#products"
    },
    {
      name: "Life-KR",
      form: "Softgel Capsules · 30s (1300mg)",
      cat: "Omega-3 Range",
      comp: "Molecular-Distilled Marine Lipids: EPA 360 mg + DHA 240 mg",
      note: "High-potency omega-3 marine triglycerides for cardio and neuro health.",
      img: "./images/products/life-kr-softgel.jpg",
      href: "#products"
    },
    {
      name: "NL-Nine",
      form: "Granules · 10 x 5g Sachets",
      cat: "Nutritional support",
      comp: "L-Arginine 3g + DHA 20% 200mg + Proanthocyanidin 75mg + Folic Acid + Zinc",
      note: "Placental vascular perfusion & gestational vitality sachet.",
      img: "./images/products/nl-nine-granules.jpg",
      href: "#products"
    },
    {
      name: "Myo-Q10",
      form: "Syrup · 225 ml",
      cat: "Nutritional support",
      comp: "Ubiquinone Co-Q10 + Myo-Inositol + L-Carnitine + Folic Acid",
      note: "Mitochondrial bio-energetic ATP resynthesis formulation.",
      img: "./images/products/myo-q10-syrup.jpg",
      href: "#products"
    },
    {
      name: "Glutavia",
      form: "Tablets · 30s",
      cat: "Skin Brightening & Vitality",
      comp: "Reduced L-Glutathione (500mg) + Vitamin C",
      note: "Cellular master antioxidant and hepatic detoxification therapy.",
      img: "./images/products/glutavia-500.jpg",
      href: "#products"
    },
    {
      name: "Zymocare",
      form: "Syrup · 200 ml",
      cat: "Digestive Wellness",
      comp: "Fungal Diastase (1:1200) 50mg + Pepsin (1:3000) 10mg",
      note: "Enzymatic digestive stimulant for dyspepsia and appetite revival.",
      img: "./images/products/zymocare-syrup.jpg",
      href: "#products"
    },
    {
      name: "Esomax D40",
      form: "Capsules · 10 x 15 Alu-Alu",
      cat: "Digestive Wellness",
      comp: "Esomeprazole 40mg (Enteric Coated) + Domperidone 30mg (Sustained Release)",
      note: "Dual-phase micro-pellet technology for 24h acid-peptic control.",
      img: "./images/products/esomax-d40.jpg",
      href: "#products"
    },
    {
      name: "Borifemina",
      form: "Vaginal Tablets · 14s with Applicator",
      cat: "Women's & Specialized Wellness",
      comp: "Boric Acid 600mg + Tea Tree Oil + Aloe Vera Extract",
      note: "Targeted microbiological flora restoration and vaginal hygiene.",
      img: "./images/products/borifemina-tablets.jpg",
      href: "#products"
    },
    {
      name: "Lifekr-Raft",
      form: "Oral Suspension · 200 ml",
      cat: "Digestive Wellness",
      comp: "Sodium Alginate + Sodium Bicarbonate + Calcium Carbonate",
      note: "Forms an inert neutral floating barrier preventing acid and pepsin reflux.",
      img: "./images/products/lifekr-raft-suspension.jpg",
      href: "#products"
    },
    {
      name: "Ran-Life",
      form: "Oral Solution · 100 ml",
      cat: "Digestive Wellness",
      comp: "Ranitidine Hydrochloride IP 75mg / 5ml",
      note: "H2-receptor antagonist liquid formulation for rapid acid neutralization.",
      img: "./images/products/ran-life-oral-solution.jpg",
      href: "#products"
    }
  ];

  const [cur, setCur] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const n = PRODUCTS.length;
  const currentProduct = PRODUCTS[cur];

  useEffect(() => {
    if (activeSection === 'flagship' && railRef.current) {
      const tile = railRef.current.children[cur] as HTMLElement;
      if (tile) {
        railRef.current.scrollTo({
          left: tile.offsetLeft - (railRef.current.clientWidth - tile.offsetWidth) / 2,
          behavior: 'smooth'
        });
      }
    }
  }, [activeSection, cur]);

  const handleSelectProduct = (i: number) => {
    const nextIndex = (i + n) % n;
    setCur(nextIndex);

    // Smoothly center the active tile in the horizontal rail
    if (railRef.current) {
      const tile = railRef.current.children[nextIndex] as HTMLElement;
      if (tile) {
        railRef.current.scrollTo({
          left: tile.offsetLeft - (railRef.current.clientWidth - tile.offsetWidth) / 2,
          behavior: 'smooth'
        });
      }
    }
  };

  const renderVisual = (p: typeof PRODUCTS[0], index: number) => {
    const isError = imgErrors[index];
    const initials = p.name.replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase();

    return (
      <div className="fp__vis">
        {p.img && !isError ? (
          <img
            src={p.img}
            alt={`${p.name} pack`}
            onError={() => setImgErrors(prev => ({ ...prev, [index]: true }))}
          />
        ) : (
          <span className="fp__ph">{initials}</span>
        )}
      </div>
    );
  };

  return (
    <>
      <style>{`
        .pp, .fp {
          --navy: #14213d;
          --saffron: #FF9933;
          --green: #138808;
          --teal: #0f766e;
          --muted: #5b6580;
          --line: #e4e8f1;
          font-family: "Inter", system-ui, sans-serif;
          color: var(--navy);
          padding: 88px 6vw;
        }
        .pp *, .fp * { box-sizing: border-box; }
        .pp { background: #f7f9fc; }
        .fp { background: #fff; }
        .sec-head { text-align: center; max-width: 780px; margin: 0 auto 48px; }
        .sec-badge {
          display: inline-block;
          padding: 7px 16px;
          border-radius: 999px;
          background: #eef8f1;
          color: var(--green);
          font-size: .75rem;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
        }
        .sec-head h2 {
          font-size: clamp(1.9rem, 4vw, 2.9rem);
          line-height: 1.12;
          letter-spacing: -.02em;
          margin: 16px 0 12px;
          font-weight: 800;
        }
        .sec-head h2 span {
          background: linear-gradient(90deg, var(--saffron), var(--green));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .sec-head p { font-size: 1.05rem; line-height: 1.65; color: var(--muted); margin: 0; }
        a:focus-visible, button:focus-visible { outline: 3px solid var(--saffron); outline-offset: 3px; }

        /* ---------- partner cards ---------- */
        .pp__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 1160px;
          margin: 0 auto;
          align-items: stretch;
        }
        .pc {
          position: relative;
          display: flex;
          flex-direction: column;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 22px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(20, 33, 61, .05);
        }
        .pc--hot {
          border: 2px solid transparent;
          background: linear-gradient(#fff, #fff) padding-box, linear-gradient(135deg, var(--saffron), var(--green)) border-box;
          box-shadow: 0 20px 50px rgba(19, 136, 8, .12);
        }
        .pc__ribbon {
          position: absolute;
          top: -13px;
          left: 30px;
          background: linear-gradient(90deg, var(--saffron), var(--green));
          color: #fff;
          font-size: .72rem;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 999px;
        }
        .pc__top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
        .pc__icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: #eef2fb;
          display: grid;
          place-items: center;
          color: var(--navy);
        }
        .pc__icon svg { width: 24px; height: 24px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .pc__tag { font-size: .75rem; font-weight: 700; padding: 6px 12px; border-radius: 999px; background: #e6f5ea; color: var(--green); }
        .pc h3 { font-size: 1.4rem; margin: 0 0 4px; font-weight: 800; }
        .pc__sub { font-size: .9rem; color: var(--muted); margin: 0 0 16px; font-weight: 500; }
        .pc__text { font-size: 1rem; line-height: 1.6; color: #3a4560; margin: 0 0 20px; }
        .pc__list { list-style: none; margin: 0 0 28px; padding: 18px 0 0; border-top: 1px solid var(--line); display: grid; gap: 12px; }
        .pc__list li { display: flex; gap: 12px; font-size: .97rem; line-height: 1.45; color: #3a4560; }
        .pc__list li::before {
          content: "✓";
          flex: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #e6f5ea;
          color: var(--green);
          display: grid;
          place-items: center;
          font-size: .75rem;
          font-weight: 700;
          margin-top: 1px;
        }
        .pc__actions { margin-top: auto; display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
        .btn {
          display: inline-block;
          padding: 13px 24px;
          border-radius: 999px;
          font-weight: 600;
          font-size: .97rem;
          text-decoration: none;
          background: var(--navy);
          color: #fff;
          border: 0;
          cursor: pointer;
          transition: background .2s, transform .2s;
        }
        .btn:hover { background: #0c1629; transform: translateY(-1px); }
        .btn--teal { background: var(--teal); }
        .btn--teal:hover { background: #0b5e58; }
        .link {
          font-weight: 600;
          font-size: .95rem;
          color: var(--navy);
          text-decoration: none;
          border-bottom: 2px solid var(--saffron);
          padding-bottom: 2px;
          cursor: pointer;
        }
        .link:hover { color: #000; }

        /* ---------- flagship products ---------- */
        .fp__stage {
          display: grid;
          grid-template-columns: minmax(260px, 5fr) 6fr;
          gap: 44px;
          align-items: center;
          max-width: 1160px;
          margin: 0 auto;
          background: #f7f9fc;
          border: 1px solid var(--line);
          border-radius: 28px;
          padding: 36px;
        }
        .fp__vis {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          border-radius: 22px;
          background: radial-gradient(circle at 50% 40%, #fff, #eef2fb);
          display: grid;
          place-items: center;
          overflow: hidden;
        }
        .fp__vis img {
          width: 86%;
          height: 86%;
          object-fit: contain;
          filter: drop-shadow(0 18px 24px rgba(20, 33, 61, .18));
        }
        .fp__ph {
          font-size: clamp(2.4rem, 6vw, 4rem);
          font-weight: 800;
          color: #b6bfd6;
          letter-spacing: .04em;
        }
        .fp__cat {
          display: inline-block;
          font-size: .78rem;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: var(--teal);
          background: #e6f4f2;
          padding: 6px 12px;
          border-radius: 999px;
        }
        .fp__name { font-size: clamp(1.8rem, 3.4vw, 2.5rem); line-height: 1.1; margin: 14px 0 4px; font-weight: 800; }
        .fp__form { color: var(--muted); font-size: 1rem; margin: 0 0 18px; font-weight: 500; }
        .fp__spec { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 16px 18px; margin-bottom: 14px; }
        .fp__spec small { display: block; font-size: .75rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
        .fp__spec span { font-size: 1.02rem; font-weight: 600; line-height: 1.5; color: #14213d; }
        .fp__note { font-size: 1rem; line-height: 1.6; color: #3a4560; margin: 0 0 22px; }
        .fp__btns { display: flex; gap: 18px; align-items: center; flex-wrap: wrap; }
        .fp__fade { animation: fpfade .35s ease; }
        @keyframes fpfade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

        .fp__railbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1160px;
          margin: 28px auto 14px;
        }
        .fp__count { font-weight: 600; color: var(--muted); font-size: .95rem; }
        .fp__arrows { display: flex; gap: 10px; }
        .fp__arrow {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: 1.5px solid #d3d9e8;
          background: #fff;
          color: var(--navy);
          font-size: 1.2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all .2s;
        }
        .fp__arrow:hover { background: var(--navy); color: #fff; border-color: var(--navy); }
        .fp__rail {
          position: relative;
          display: flex;
          gap: 14px;
          max-width: 1160px;
          margin: 0 auto;
          overflow-x: auto;
          padding: 6px 4px 14px;
          scroll-snap-type: x proximity;
          scrollbar-width: thin;
        }
        .fp__tile {
          flex: none;
          width: 150px;
          scroll-snap-align: center;
          background: #fff;
          border: 2px solid var(--line);
          border-radius: 18px;
          padding: 10px;
          cursor: pointer;
          text-align: center;
          transition: all .25s;
          font: inherit;
          color: var(--navy);
        }
        .fp__tile .fp__vis { border-radius: 12px; }
        .fp__tile .fp__ph { font-size: 1.6rem; }
        .fp__tile b { display: block; margin-top: 8px; font-size: .92rem; font-weight: 700; }
        .fp__tile:hover { border-color: var(--saffron); }
        .fp__tile[aria-current="true"] {
          border-color: var(--green);
          box-shadow: 0 10px 24px rgba(19, 136, 8, .16);
          transform: translateY(-3px);
        }
        .fp__all { display: block; text-align: center; margin-top: 22px; }

        @media (max-width: 900px) {
          .pp, .fp { padding: 60px 5vw; }
          .pp__grid { grid-template-columns: 1fr; max-width: 560px; }
          .fp__stage { grid-template-columns: 1fr; padding: 22px; gap: 24px; }
          .fp__vis { max-width: 340px; margin: 0 auto; }
        }
        @media (prefers-reduced-motion: reduce) {
          .fp__fade { animation: none; }
          .fp__tile { transition: none; }
        }
      `}</style>

      {/* ======================= PARTNERS ======================= */}
      <section className="pp" id="partners" aria-labelledby="pp-title" hidden={activeSection ? activeSection !== 'partners' : false}>
        <div className="sec-head">
          <span className="sec-badge">Work with NLCL</span>
          <h2 id="pp-title">How NLCL <span>partners with you</span></h2>
          <p>Whether you prescribe, distribute or procure for an institution, we have a dedicated way to work together.</p>
        </div>

        <div className="pp__grid">
          {/* Card 1: Healthcare Professionals */}
          <article className="pc">
            <div className="pc__top">
              <div className="pc__icon">
                <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
              </div>
              <span className="pc__tag">Clinical evidence</span>
            </div>
            <h3>Healthcare Professionals</h3>
            <p className="pc__sub">Clinicians, physicians &amp; specialists</p>
            <p className="pc__text">Scientific monographs, molecular profiles and a digital visual aid for all our formulations.</p>
            <ul className="pc__list">
              <li>Active ingredient specifications and dosage</li>
              <li>Interactive visual aid flipbook</li>
              <li>Prescribing indications and therapeutic rationale</li>
            </ul>
            <div className="pc__actions">
              <button 
                type="button" 
                className="btn" 
                onClick={() => onNavigate('flipbook')}
              >
                Review visual aid
              </button>
              <button 
                type="button" 
                className="link" 
                onClick={() => onNavigate('products')}
              >
                View formulations
              </button>
            </div>
          </article>

          {/* Card 2: Stockists & PCD Partners */}
          <article className="pc pc--hot">
            <span className="pc__ribbon">Most popular</span>
            <div className="pc__top">
              <div className="pc__icon">
                <svg viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-8M15 7h6v6" /></svg>
              </div>
              <span className="pc__tag">Franchise</span>
            </div>
            <h3>Stockists &amp; PCD Partners</h3>
            <p className="pc__sub">Distributors, retailers &amp; PCD franchise</p>
            <p className="pc__text">District-level distribution rights across Assam and the North-East, with attractive margins and quick regional restocking.</p>
            <ul className="pc__list">
              <li>Exclusive district-level franchise rights</li>
              <li>Direct depot dispatch from Guwahati &amp; Silchar</li>
              <li>Transparent wholesale price list and promotional support</li>
            </ul>
            <div className="pc__actions">
              <button 
                type="button" 
                className="btn" 
                onClick={() => onOpenEnquiry('Monopoly PCD Franchise Application')}
              >
                Apply for PCD
              </button>
              <button 
                type="button" 
                className="link" 
                onClick={() => onNavigate('products')}
              >
                Product catalog
              </button>
            </div>
          </article>

          {/* Card 3: Institutional Procurement */}
          <article className="pc">
            <div className="pc__top">
              <div className="pc__icon">
                <svg viewBox="0 0 24 24"><path d="M4 21V7l8-4 8 4v14M9 21v-6h6v6M9 10h.01M15 10h.01" /></svg>
              </div>
              <span className="pc__tag">Institutions</span>
            </div>
            <h3>Institutional Procurement</h3>
            <p className="pc__sub">Hospitals, nursing homes &amp; tenders</p>
            <p className="pc__text">Bulk supply for multi-specialty hospitals, healthcare centres and government or private rate-contract tenders.</p>
            <ul className="pc__list">
              <li>Certificate of Analysis (CoA) with every batch</li>
              <li>Tamper-evident, institution-grade packaging</li>
              <li>Scheduled supply agreements with cold-chain handling</li>
            </ul>
            <div className="pc__actions">
              <button 
                type="button" 
                className="btn" 
                onClick={() => onOpenEnquiry('Institutional Hospital Procurement RFQ')}
              >
                Request an RFQ
              </button>
              <button 
                type="button" 
                className="link" 
                onClick={() => onNavigate('about')}
              >
                Corporate factsheet
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* ======================= FLAGSHIP PRODUCTS ======================= */}
      <section className="fp" id="flagship" aria-labelledby="fp-title" hidden={activeSection ? activeSection !== 'flagship' : false}>
        <div className="sec-head">
          <span className="sec-badge">Our portfolio</span>
          <h2 id="fp-title">Flagship formulations <span>&amp; delivery systems</span></h2>
          <p>Select a product to see its composition and details.</p>
        </div>

        {/* Active Product Spotlight Stage */}
        <div className="fp__stage" aria-live="polite">
          <div key={`stage-vis-${cur}`}>
            {renderVisual(currentProduct, cur)}
          </div>
          
          <div key={`stage-info-${cur}`} className="fp__fade" id="fp-info">
            {currentProduct.cat && (
              <span className="fp__cat" id="fp-cat">{currentProduct.cat}</span>
            )}
            
            <h3 className="fp__name" id="fp-name">{currentProduct.name}</h3>
            
            {currentProduct.form && (
              <p className="fp__form" id="fp-form">{currentProduct.form}</p>
            )}
            
            {currentProduct.comp && (
              <div className="fp__spec" id="fp-specbox">
                <small>Composition</small>
                <span id="fp-comp">{currentProduct.comp}</span>
              </div>
            )}
            
            {currentProduct.note && (
              <p className="fp__note" id="fp-note">{currentProduct.note}</p>
            )}
            
            <div className="fp__btns">
              <button
                type="button"
                className="btn btn--teal"
                id="fp-cta"
                onClick={() => onNavigate('products')}
              >
                View product details
              </button>
              
              <button
                type="button"
                className="link"
                onClick={() => onOpenEnquiry(`${currentProduct.name} - Product Inquiry`)}
              >
                Enquire
              </button>
            </div>
          </div>
        </div>

        {/* Product Slider Rail Bar */}
        <div className="fp__railbar">
          <span className="fp__count" id="fp-count">
            {cur + 1} of {n} products
          </span>
          <div className="fp__arrows">
            <button
              className="fp__arrow"
              id="fp-prev"
              type="button"
              aria-label="Previous product"
              onClick={() => handleSelectProduct(cur - 1)}
            >
              &#8592;
            </button>
            <button
              className="fp__arrow"
              id="fp-next"
              type="button"
              aria-label="Next product"
              onClick={() => handleSelectProduct(cur + 1)}
            >
              &#8594;
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Rail */}
        <div className="fp__rail" id="fp-rail" ref={railRef}>
          {PRODUCTS.map((p, i) => (
            <button
              key={`tile-${p.name}-${i}`}
              type="button"
              className="fp__tile"
              aria-current={i === cur ? "true" : undefined}
              onClick={() => handleSelectProduct(i)}
            >
              {renderVisual(p, i)}
              <b>{p.name}</b>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="link fp__all"
          style={{ width: 'max-content', margin: '22px auto 0' }}
          onClick={() => onNavigate('products')}
        >
          View all products
        </button>
      </section>
    </>
  );
};
