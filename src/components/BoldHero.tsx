import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Pill, 
  Handshake, 
  CheckCircle2, 
  FileText, 
  Plus, 
  Layers, 
  Sparkles, 
  Boxes 
} from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyConfig';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';

interface BoldHeroProps {
  onNavigate: (sectionId: string) => void;
  onOpenEnquiry: (productName?: string) => void;
  onOpenDetails: (product: Product) => void;
  onAddToRfq: (product: Product) => void;
}

export const BoldHero: React.FC<BoldHeroProps> = ({
  onNavigate,
  onOpenEnquiry,
  onOpenDetails,
  onAddToRfq
}) => {
  const [activeHighlightIndex, setActiveHighlightIndex] = useState(0);

  const heroMolecules = [
    PRODUCTS[0], // Coenzyme Q10 + L-Carnitine Softgel
    PRODUCTS[1], // Rabeprazole + Domperidone Capsules
    PRODUCTS[3], // Myo-Inositol Tablets
    PRODUCTS[8], // Rabeprazole IV Lyophilized Injection
  ];

  const currentMolecule = heroMolecules[activeHighlightIndex];

  return (
    <div className="relative pt-48 sm:pt-56 lg:pt-60 pb-20 bg-gradient-to-b from-white via-slate-50 to-white text-slate-900 border-b border-slate-200 overflow-hidden">
      
      {/* Subtle Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Trust Eyebrow */}
        <div className="inline-flex items-center space-x-2 bg-slate-100 text-[#0f2b48] px-4 py-1.5 rounded-full text-xs font-bold border border-slate-300 shadow-sm mb-6">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>WHO-GMP & CDSCO Standards</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600 font-mono">Assam & North-East Supply</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Bold Editorial Value Proposition (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <h1 className="text-4xl sm:text-6xl lg:text-[62px] font-black tracking-tight text-[#0f2b48] leading-[1.1]">
              Advancing Healthcare Across <br className="hidden sm:inline" />
              <span className="text-teal-700 underline decoration-teal-300 decoration-wavy decoration-2">
                Assam & North-East
              </span> India.
            </h1>

            <p className="text-slate-600 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
              {COMPANY_CONFIG.subheadline}
            </p>

            {/* Live Operational Capability Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center space-x-2 text-[#0f2b48] font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Pure APIs</span>
                </div>
                <p className="text-slate-500 text-[11px] mt-1 font-mono">Assay per IP/BP/USP</p>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center space-x-2 text-[#0f2b48] font-bold">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Barrier Packaging</span>
                </div>
                <p className="text-slate-500 text-[11px] mt-1 font-mono">Alu-Alu & Neutral Glass</p>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center space-x-2 text-[#0f2b48] font-bold">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Cold-Chain Transit</span>
                </div>
                <p className="text-slate-500 text-[11px] mt-1 font-mono">Validated 2°C–8°C Nodes</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                onClick={() => onNavigate('products')}
                className="bg-[#0f2b48] hover:bg-[#0a192f] text-white font-extrabold px-8 py-4 rounded-xl shadow-lg shadow-slate-900/15 transition-all hover:scale-[1.02] flex items-center text-xs sm:text-sm"
              >
                <Pill className="w-4 h-4 mr-2 text-cyan-300" />
                <span>Explore Product Portfolio</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>

              <button
                onClick={() => onOpenEnquiry('B2B Sourcing / Partnership')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold px-7 py-4 rounded-xl border border-slate-300 transition-all hover:scale-[1.02] text-xs sm:text-sm flex items-center"
              >
                <Handshake className="w-4 h-4 mr-2 text-[#0f2b48]" />
                <span>Partner With Us</span>
              </button>

              <button
                onClick={() => onNavigate('calculator')}
                className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-5 py-4 rounded-xl border border-slate-200 transition-all text-xs sm:text-sm flex items-center shadow-sm"
              >
                <Boxes className="w-4 h-4 mr-2 text-teal-600" />
                <span>Batch Calculator</span>
              </button>
            </div>

          </div>

          {/* Right Column: Clean Editorial Spotlight Bento (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-xl space-y-6">
              
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0f2b48] flex items-center">
                  <Sparkles className="w-4 h-4 mr-1 text-teal-600" />
                  Key Formulation Spotlight
                </span>

                {/* Tab Switcher */}
                <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  {heroMolecules.map((m, idx) => (
                    <button
                      key={m.id}
                      onClick={() => setActiveHighlightIndex(idx)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                        activeHighlightIndex === idx
                          ? 'bg-[#0f2b48] text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      0{idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Product Details */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                    {currentMolecule.dosageForm}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    • {currentMolecule.pharmacopoeiaStandard} Standard
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-[#0f2b48]">
                  {currentMolecule.name}
                </h3>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Active Formulation:
                  </span>
                  <p className="text-xs font-mono text-slate-800 leading-relaxed font-semibold">
                    {currentMolecule.genericComposition}
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentMolecule.indication}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1 text-slate-600">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-sans">Packaging:</span>
                    <strong className="text-slate-900 truncate block text-[11px]">{currentMolecule.packaging}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-sans">Batch MOQ:</span>
                    <strong className="text-[#0f2b48] font-bold block text-[11px]">{currentMolecule.moq}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
                <button
                  onClick={() => onOpenDetails(currentMolecule)}
                  className="flex-1 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>View Technical Specs (TDS)</span>
                </button>

                <button
                  onClick={() => onAddToRfq(currentMolecule)}
                  className="bg-[#0f2b48] hover:bg-[#0a192f] text-white font-extrabold py-3 px-4 rounded-xl text-xs transition-all flex items-center space-x-1 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to RFQ</span>
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
