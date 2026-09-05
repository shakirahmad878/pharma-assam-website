import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Plus, 
  Share2 
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';

interface EditorialVisualAidProps {
  onOpenEnquiry: (productName?: string) => void;
  onAddToRfq: (product: Product) => void;
}

export const EditorialVisualAid: React.FC<EditorialVisualAidProps> = ({
  onOpenEnquiry,
  onAddToRfq
}) => {
  const [activePageIndex, setActivePageIndex] = useState<number>(0);

  // Selected visual aid molecules
  const visualAidMolecules = PRODUCTS.slice(0, 5);
  const currentProduct = visualAidMolecules[activePageIndex];

  const handleNext = () => {
    setActivePageIndex((prev) => (prev + 1) % visualAidMolecules.length);
  };

  const handlePrev = () => {
    setActivePageIndex((prev) => (prev - 1 + visualAidMolecules.length) % visualAidMolecules.length);
  };

  return (
    <section className="py-24 bg-slate-50 border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-white text-[#0f2b48] px-4 py-1.5 rounded-full text-xs font-bold border border-slate-300 shadow-sm mb-3">
            <BookOpen className="w-4 h-4 text-teal-700" />
            <span>Institutional Clinical Monograph</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f2b48] tracking-tight">
            Digital Medical <span className="text-teal-700">Visual Monograph</span>
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            Interactive clinical detailer designed for procurement teams, hospital formularies, and medical representatives reviewing dosage rationales and stability parameters.
          </p>
        </div>

        {/* Monograph Slide Deck Container */}
        <div className="bg-white rounded-3xl border border-slate-300 shadow-xl overflow-hidden">
          
          {/* Deck Header Bar */}
          <div className="bg-[#0f2b48] text-white p-4 sm:p-6 flex flex-wrap justify-between items-center gap-4 border-b border-slate-800">
            
            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Monograph 0{activePageIndex + 1} / 0{visualAidMolecules.length}
              </span>
              <span className="text-xs font-mono text-slate-300 hidden sm:inline">
                Therapeutic Area: <strong className="text-white">{currentProduct.therapeuticSegment}</strong>
              </span>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrev}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
                title="Previous Monograph"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-1 px-2">
                {visualAidMolecules.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePageIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      activePageIndex === idx ? 'w-8 bg-cyan-400' : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
                title="Next Monograph"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* Monograph Content Body */}
          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Product Clinical Profile (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                    {currentProduct.dosageForm}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {currentProduct.pharmacopoeiaStandard} Standard
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-[#0f2b48]">
                  {currentProduct.name}
                </h3>

                <p className="text-xs sm:text-sm font-mono text-teal-800 bg-slate-50 p-3 rounded-xl border border-slate-200 font-semibold">
                  {currentProduct.genericComposition}
                </p>
              </div>

              {/* Therapeutic Highlights */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Clinical Indication & Efficacy:
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {currentProduct.indication}
                </p>
              </div>

              {/* Formulation Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <span className="text-slate-400 block text-[10px] font-mono">Pharmacopeial Standard:</span>
                  <strong className="text-[#0f2b48] font-bold text-xs">{currentProduct.pharmacopoeiaStandard} Assay Compliant</strong>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <span className="text-slate-400 block text-[10px] font-mono">Packaging Barrier:</span>
                  <strong className="text-[#0f2b48] font-bold text-xs">{currentProduct.packaging}</strong>
                </div>
              </div>

            </div>

            {/* Right Column: Key Molecule Rationale Card (5 Cols) */}
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 to-slate-100 rounded-3xl p-6 sm:p-8 border border-slate-300 space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-mono font-bold text-[#0f2b48] uppercase tracking-wider flex items-center">
                  <Sparkles className="w-4 h-4 mr-1 text-teal-700" />
                  Active Constituents
                </span>
                <span className="text-[11px] font-mono text-slate-500">MOQ: {currentProduct.moq}</span>
              </div>

              <div className="space-y-2">
                {currentProduct.activeMolecules.map((m, i) => (
                  <div
                    key={i}
                    className="p-3 bg-white rounded-xl border border-slate-200 text-xs font-mono font-semibold text-slate-800 flex items-center space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => onAddToRfq(currentProduct)}
                  className="w-full bg-[#0f2b48] hover:bg-[#0a192f] text-white font-black py-3 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Monograph Item to RFQ</span>
                </button>

                <button
                  onClick={() => onOpenEnquiry(`Clinical Monograph Query: ${currentProduct.name}`)}
                  className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center space-x-2 shadow-2xs"
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Request Full Clinical Dossier</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
