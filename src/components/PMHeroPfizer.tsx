import React, { useState } from 'react';
import { ShieldCheck, Award, ArrowRight, Send, CheckCircle2, FlaskConical, MapPin, Building, ChevronRight, FileCheck } from 'lucide-react';
import { MolecularCanvas3D } from './3d/MolecularCanvas3D';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';

interface PMHeroPfizerProps {
  onSelectProduct: (product: Product) => void;
  onOpenEnquiry: (productName?: string) => void;
  onNavigate: (sectionId: string) => void;
}

export const PMHeroPfizer: React.FC<PMHeroPfizerProps> = ({
  onSelectProduct,
  onOpenEnquiry,
  onNavigate
}) => {
  // Quick spotlight formulation IDs for the interactive hero badge
  const spotlightFormulations = [
    { id: 'lyco-kr-syrup', label: 'Lyco-KR (Sugar-Free Syrup)' },
    { id: 'nl-nine-granules', label: 'NL-Nine (L-Arginine Granules)' },
    { id: 'life-kr-softgel', label: 'Life-KR (1300mg Omega-3)' },
    { id: 'lifekr-raft-suspension', label: 'Lifekr-Raft (Alginate Barrier)' }
  ];

  const [activeSpotlight, setActiveSpotlight] = useState(0);
  const currentProduct = PRODUCTS.find(p => p.id === spotlightFormulations[activeSpotlight].id) || PRODUCTS[0];

  return (
    <div className="relative bg-gradient-to-b from-[#F8FAFC] via-white to-[#F1F6F8] border-b border-[#DCE4EB] overflow-hidden">
      
      {/* 3D Molecular Lattice Background Simulation */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <MolecularCanvas3D className="w-full h-full" nodeCount={36} interactive={true} />
      </div>

      {/* Subtle Radial Glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#18A6A6]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 sm:pt-16 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Purpose Headline & Institutional CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pill Header */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#DCE4EB] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#18A6A6] animate-pulse" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#10243A]">
                New Life Care Laboratories Pvt. Ltd.
              </span>
              <span className="text-[11px] text-[#64748B] border-l border-slate-200 pl-2">
                CIN: U24239AS2024PTC018920
              </span>
            </div>

            {/* Big Pfizer-Style Purpose Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#10243A] tracking-tight leading-[1.15]">
              Advancing Healthcare Access Through{' '}
              <span className="text-[#18A6A6]">Precision Formulations.</span>
            </h1>

            {/* Corporate Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Delivering WHO-GMP & ISO compliant therapeutic formulations, capsules, syrups, and tablets. Dedicated to clinical excellence, healthcare professionals, and regional distribution partners across Assam and the North-East.
            </p>

            {/* Dual Institutional CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('products')}
                className="bg-[#10243A] hover:bg-[#18A6A6] text-white text-sm font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explore 13 Formulations</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenEnquiry('B2B Trade & Institutional Dossier Request')}
                className="bg-white hover:bg-slate-50 text-[#10243A] border border-[#CBD5E1] text-sm font-semibold py-3.5 px-6 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <FileCheck className="w-4 h-4 text-[#18A6A6]" />
                <span>Request B2B Trade Dossier</span>
              </button>
            </div>

            {/* Quick Formulation Spotlight Tabs */}
            <div className="pt-4 border-t border-slate-200">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
                Key Therapeutic Platforms:
              </span>
              <div className="flex flex-wrap gap-2">
                {spotlightFormulations.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSpotlight(idx)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                      activeSpotlight === idx
                        ? 'bg-[#18A6A6] text-white shadow-2xs font-semibold'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Hero Interactive Spotlight Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-[#DCE4EB] shadow-xl p-6 sm:p-7 relative overflow-hidden group">
              
              {/* Card Ambient Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#18A6A6]/10 rounded-full blur-2xl pointer-events-none" />

              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-[#18A6A6]" />
                  <span className="text-xs font-bold text-[#10243A] uppercase tracking-wider">
                    {currentProduct.category}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {currentProduct.pharmacopoeiaStandard} Standard
                </span>
              </div>

              {/* Product Packshot Showcase with 3D Float */}
              <div 
                onClick={() => onSelectProduct(currentProduct)}
                className="relative h-64 bg-gradient-to-b from-slate-50 to-teal-50/20 rounded-2xl my-4 flex flex-col items-center justify-center p-4 cursor-pointer overflow-hidden border border-slate-100 group-hover:border-[#18A6A6]/40 transition-colors"
              >
                <img
                  src={currentProduct.imageUrl}
                  alt={currentProduct.name}
                  className="max-h-52 max-w-full object-contain filter drop-shadow-[0_12px_20px_rgba(16,36,58,0.18)] group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-300 relative z-10"
                />
                
                {/* 3D Base Shadow */}
                <div className="w-32 h-2 rounded-[100%] bg-slate-900/15 blur-xs mt-2" />

                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-[10px] font-bold text-[#18A6A6] px-2 py-1 rounded-md shadow-2xs">
                  Click to View Monograph →
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-black text-[#10243A]">
                      {currentProduct.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono line-clamp-1">
                      {currentProduct.genericComposition}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#18A6A6] bg-teal-50 px-2 py-1 rounded shrink-0">
                    MOQ: {currentProduct.moq}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                  {currentProduct.indication}
                </p>
              </div>

              {/* Card Action Strip */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => onSelectProduct(currentProduct)}
                  className="text-xs font-bold text-[#10243A] hover:text-[#18A6A6] flex items-center gap-1 cursor-pointer"
                >
                  <span>Technical Specs</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onOpenEnquiry(currentProduct.name)}
                  className="bg-[#18A6A6] hover:bg-[#137F83] text-white text-xs font-bold py-2 px-3.5 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Inquire MOQ</span>
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Pfizer-Style 4-Pillar Trust Metric Strip */}
        <div className="mt-12 pt-8 border-t border-[#E2E8F0] grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#18A6A6] flex items-center justify-center shrink-0">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-extrabold text-[#10243A]">13 Formulations</div>
              <div className="text-xs text-slate-500">DCGI Registered Portfolio</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-extrabold text-[#10243A]">WHO-GMP & ISO</div>
              <div className="text-xs text-slate-500">9001:2015 Quality Certified</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-extrabold text-[#10243A]">100% Batch CoA</div>
              <div className="text-xs text-slate-500">Standardized Lab Verification</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-extrabold text-[#10243A]">Guwahati & Silchar</div>
              <div className="text-xs text-slate-500">Assam Regional Depots</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
