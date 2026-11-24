import React, { useState } from 'react';
import { PRODUCTS } from '../data/products';
import { ProductCategory } from '../types';

interface PMHomeSectionsProps {
  onNavigate: (sectionId: string) => void;
  onSelectCategory: (category: ProductCategory | 'All Products') => void;
  onSelectFlagshipProduct: (index: number) => void;
}

const DIVISIONS: {
  key: 'nutri' | 'omega' | 'digest' | 'spec';
  category: ProductCategory;
  title: string;
  text: string;
  icon: string;
}[] = [
  {
    key: 'nutri',
    category: 'Nutritional Support',
    title: 'Nutritional Support',
    text: 'Vitamin, mineral and nutrient formulations for daily and condition-linked needs.',
    icon: 'M12 3c4 4 6 7 6 10a6 6 0 0 1-12 0c0-3 2-6 6-10z'
  },
  {
    key: 'omega',
    category: 'Omega-3 Range',
    title: 'Omega-3 Range',
    text: 'Marine-lipid EPA and DHA formulations in softgel form.',
    icon: 'M3 12c3-6 6-6 9 0s6 6 9 0'
  },
  {
    key: 'digest',
    category: 'Digestive Wellness',
    title: 'Digestive Wellness',
    text: 'Enzyme, acid-peptic, anti-reflux and antacid formulations.',
    icon: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z'
  },
  {
    key: 'spec',
    category: "Women's & Specialized Wellness",
    title: 'Specialized Care',
    text: 'Targeted formulations for specific therapeutic needs.',
    icon: 'M12 5v14M5 12h14'
  }
];

const FEATURED_PRODUCTS = [
  {
    name: 'Lyco-KR',
    form: 'Syrup · 200 ml',
    cat: 'Nutritional support',
    img: './images/products/lyco-kr-syrup.jpg'
  },
  {
    name: 'Life-KR',
    form: 'Softgel Capsules · 30s (1300mg)',
    cat: 'Omega-3 Range',
    img: './images/products/life-kr-softgel.jpg'
  },
  {
    name: 'NL-Nine',
    form: 'Granules · 10 x 5g Sachets',
    cat: 'Nutritional support',
    img: './images/products/nl-nine-granules.jpg'
  },
  {
    name: 'Myo-Q10',
    form: 'Syrup · 225 ml',
    cat: 'Nutritional support',
    img: './images/products/myo-q10-syrup.jpg'
  }
];

export const PMHomeSections: React.FC<PMHomeSectionsProps> = ({
  onNavigate,
  onSelectCategory,
  onSelectFlagshipProduct
}) => {
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const getDivisionCount = (key: 'nutri' | 'omega' | 'digest' | 'spec') => {
    if (key === 'nutri') return PRODUCTS.filter(p => p.category === 'Nutritional Support').length;
    if (key === 'omega') return PRODUCTS.filter(p => p.category === 'Omega-3 Range').length;
    if (key === 'digest') return PRODUCTS.filter(p => p.category === 'Digestive Wellness').length;
    return PRODUCTS.filter(
      p =>
        p.category === 'Skin Brightening' ||
        p.category === "Women's & Specialized Wellness" ||
        p.category === 'Cardiovascular & Energy'
    ).length;
  };

  return (
    <>
      {/* ===== HOME: WHO WE ARE ===== */}
      <section className="hm" aria-labelledby="hm-who-title">
        <div className="hm-wrap hm-who__grid">
          <div className="hm-who">
            <span className="sec-badge">Who we are</span>
            <h2 id="hm-who-title">
              A North-East company <span>for everyday health</span>
            </h2>
            <p>
              New Life Care Laboratories Pvt. Ltd. (NLCL) develops and supplies pharmaceutical and
              nutraceutical formulations for doctors, stockists and hospitals across Assam and the
              North-East.
            </p>
            <p>
              We keep the range focused, the product information clear, and the supply dependable.
            </p>
            <div className="hm-actions">
              <button type="button" className="btn" onClick={() => onNavigate('about')}>
                About NLCL
              </button>
              <button type="button" className="link" onClick={() => onNavigate('contact')}>
                Talk to us →
              </button>
            </div>
          </div>
          <div className="hm-facts">
            <div className="hm-fact">
              <b id="hm-count">{PRODUCTS.length}</b>
              <span>Formulations</span>
            </div>
            <div className="hm-fact">
              <b id="hm-seg-count">{DIVISIONS.length}</b>
              <span>Therapeutic segments</span>
            </div>
            <div className="hm-fact">
              <b>3</b>
              <span>Ways to partner</span>
            </div>
            <div className="hm-fact">
              <b>NE India</b>
              <span>Where we serve</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOME: WHAT WE DO (DIVISIONS) ===== */}
      <section className="hm hm--alt" aria-labelledby="hm-div-title">
        <div className="hm-wrap">
          <div className="sec-head">
            <span className="sec-badge">What we do</span>
            <h2 id="hm-div-title">
              Four segments, <span>one focused range</span>
            </h2>
            <p>Pick a segment to see its formulations, compositions and pack sizes.</p>
          </div>
          <div className="hm-div-grid" id="hm-divisions">
            {DIVISIONS.map((d) => (
              <button
                key={d.key}
                type="button"
                className="hm-div"
                onClick={() => {
                  onSelectCategory(d.category);
                  onNavigate('products');
                }}
              >
                <span className="pc__icon">
                  <svg viewBox="0 0 24 24">
                    <path d={d.icon} />
                  </svg>
                </span>
                <h3>{d.title}</h3>
                <p>{d.text}</p>
                <span className="hm-div__meta">{getDivisionCount(d.key)} formulations →</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOME: FEATURED PRODUCTS ===== */}
      <section className="hm" aria-labelledby="hm-feat-title">
        <div className="hm-wrap">
          <div className="sec-head">
            <span className="sec-badge">Featured</span>
            <h2 id="hm-feat-title">
              Formulations <span>doctors ask about</span>
            </h2>
            <p>
              A first look at the range. Open any product for its full composition and clinical
              notes.
            </p>
          </div>
          <div className="hm-prod-grid" id="hm-featured">
            {FEATURED_PRODUCTS.map((p, i) => {
              const initials = p.name.replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase();
              return (
                <button
                  key={p.name}
                  type="button"
                  className="hm-prod"
                  onClick={() => {
                    onSelectFlagshipProduct(i);
                    onNavigate('flagship');
                  }}
                >
                  <div className="fp__vis">
                    {p.img && !imgErrors[i] ? (
                      <img
                        src={p.img}
                        alt={`${p.name} pack`}
                        onError={() => setImgErrors((prev) => ({ ...prev, [i]: true }))}
                      />
                    ) : (
                      <div className="fp__ph">{initials}</div>
                    )}
                  </div>
                  <small>{p.cat}</small>
                  <h3>{p.name}</h3>
                  <p>{p.form}</p>
                </button>
              );
            })}
          </div>
          <div className="hm-center">
            <button
              type="button"
              className="btn"
              onClick={() => {
                onSelectCategory('All Products');
                onNavigate('products');
              }}
            >
              See all formulations
            </button>
          </div>
        </div>
      </section>

      {/* ===== HOME: WHY NLCL ===== */}
      <section className="hm hm--alt" aria-labelledby="hm-why-title">
        <div className="hm-wrap">
          <div className="sec-head">
            <span className="sec-badge">Why NLCL</span>
            <h2 id="hm-why-title">
              Built to be <span>easy to work with</span>
            </h2>
          </div>
          <div className="hm-why-grid">
            <article className="hm-why">
              <span className="hm-why__num">01</span>
              <h3>Clear product information</h3>
              <p>
                Composition, dosage form and pack size are listed for every formulation, so doctors
                and buyers can decide quickly.
              </p>
            </article>
            <article className="hm-why">
              <span className="hm-why__num">02</span>
              <h3>Focused on the North-East</h3>
              <p>
                We plan our range and supply around Assam and the North-East, not as an
                afterthought to a national catalogue.
              </p>
            </article>
            <article className="hm-why">
              <span className="hm-why__num">03</span>
              <h3>A route for every partner</h3>
              <p>
                Separate paths for healthcare professionals, stockists and PCD partners, and
                hospital procurement.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ===== HOME: CALL TO ACTION ===== */}
      <section className="hm hm-cta" aria-labelledby="hm-cta-title">
        <div className="hm-wrap">
          <div className="hm-cta__box">
            <div>
              <h2 id="hm-cta-title">
                Ready to work <span>with NLCL?</span>
              </h2>
              <p>
                Tell us whether you prescribe, distribute or buy for an institution. Our team will
                get back to you.
              </p>
            </div>
            <div className="hm-cta__btns">
              <button
                type="button"
                className="hm-cta__primary"
                onClick={() => onNavigate('partners')}
              >
                See partner options
              </button>
              <button
                type="button"
                className="hm-cta__ghost"
                onClick={() => onNavigate('contact')}
              >
                Contact us
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
