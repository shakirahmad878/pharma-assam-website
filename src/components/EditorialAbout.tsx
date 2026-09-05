import React from 'react';
import { 
  Building, 
  ShieldCheck, 
  Factory, 
  FlaskConical, 
  Truck, 
  ArrowRight, 
  Boxes 
} from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyConfig';

interface EditorialAboutProps {
  onNavigate: (sectionId: string) => void;
  onOpenEnquiry: (productName?: string) => void;
}

export const EditorialAbout: React.FC<EditorialAboutProps> = ({ onNavigate, onOpenEnquiry }) => {
  const pillars = [
    {
      icon: FlaskConical,
      title: 'Formulation & R&D Excellence',
      description: 'Systematic pre-formulation stability studies, micronized API solubility enhancement, and optimal drug release kinetics.'
    },
    {
      icon: Factory,
      title: 'Quality Cleanroom Infrastructure',
      description: 'HEPA-filtered positive pressure suites complying with ISO 14644 cleanroom standards.'
    },
    {
      icon: ShieldCheck,
      title: 'Pharmacopeial Integrity & Safety',
      description: 'Zero-compromise chromatographic assays, heavy metal limits, and microbiological safety assurance per batch.'
    },
    {
      icon: Truck,
      title: 'Cold-Chain & Regional Reliability',
      description: 'Temperature-monitored warehousing and verified GDP logistics ensuring uninterrupted 24–48hr supply to hospital networks, stockists, and franchise partners across Assam and the North-East.'
    }
  ];

  return (
    <section id="about" className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-slate-100 text-[#0f2b48] px-4 py-1.5 rounded-full text-xs font-bold border border-slate-300 mb-3">
            <Building className="w-4 h-4 text-teal-700" />
            <span>Corporate Profile & Credibility</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f2b48] tracking-tight">
            Built on Scientific Precision & <span className="text-teal-700">Pharmaceutical Trust</span>
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            {COMPANY_CONFIG.subheadline}
          </p>
        </div>

        {/* 2-Column Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Left: Corporate Thesis */}
          <div className="lg:col-span-6 space-y-6">
            <div className="border-l-4 border-[#0f2b48] pl-6 space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 block">
                Corporate Mission Statement
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0f2b48] leading-snug">
                {COMPANY_CONFIG.missionStatement}
              </h3>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">
              We bridge the gap between complex pharmaceutical manufacturing and dependable commercial distribution. Our formulations serve hospital networks, prescription-driven clinics, and B2B partners requiring consistent quality and prompt batch availability.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('manufacturing')}
                className="bg-[#0f2b48] hover:bg-[#0a192f] text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center space-x-2"
              >
                <span>Discover Our Manufacturing</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-300" />
              </button>
              
              <button
                onClick={() => onOpenEnquiry('Corporate Profile Deck Request')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-5 py-3.5 rounded-xl transition-all border border-slate-300"
              >
                Request Corporate Deck
              </button>
            </div>
          </div>

          {/* Right: Verified Corporate Governance Box */}
          <div className="lg:col-span-6 bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-300 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase text-teal-700 tracking-wider block">
                  Corporate Entity
                </span>
                <h4 className="text-xl font-black text-[#0f2b48]">
                  {COMPANY_CONFIG.name}
                </h4>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-slate-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {COMPANY_CONFIG.corporateStory}
            </p>

            {/* 4 Verified Metric Placeholders */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-sans font-medium block text-[11px]">Experience</span>
                <strong className="text-[#0f2b48] font-bold block text-xs">{COMPANY_CONFIG.yearsOfExperience}</strong>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-sans font-medium block text-[11px]">Formulations</span>
                <strong className="text-[#0f2b48] font-bold block text-xs">{COMPANY_CONFIG.productsCount}</strong>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-sans font-medium block text-[11px]">Regional Coverage</span>
                <strong className="text-[#0f2b48] font-bold block text-xs">{COMPANY_CONFIG.marketsServed}</strong>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-sans font-medium block text-[11px]">Production</span>
                <strong className="text-teal-700 font-bold block text-xs">{COMPANY_CONFIG.manufacturingSuitesCount}</strong>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200">
              <span>Standard: <strong>GMP & ISO Compliant</strong></span>
              <span className="text-[#0f2b48] font-bold">100% Tested Batches</span>
            </div>
          </div>

        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={idx}
                className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-[#0f2b48]/50 hover:shadow-lg transition-all space-y-3 group"
              >
                <div className="w-10 h-10 rounded-2xl bg-slate-100 group-hover:bg-[#0f2b48] text-[#0f2b48] group-hover:text-white flex items-center justify-center transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#0f2b48] group-hover:text-teal-700 transition-colors">
                  {pillar.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
