import React, { useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Send, CheckCircle2 } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { COMPANY_CONFIG } from '../data/companyConfig';
import { Product } from '../types';

interface PMFlipbookProps {
  onOpenEnquiry: (productName: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const PMFlipbook: React.FC<PMFlipbookProps> = ({
  onOpenEnquiry,
  onSelectProduct
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = PRODUCTS.length;
  const currentProduct = PRODUCTS[currentPage];

  const nextPage = () => {
    setCurrentPage(prev => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage(prev => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section id="flipbook" className="py-16 bg-slate-100 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#c72828] uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-200">
            Digital Visual Aid
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-black text-[#163e61] tracking-tight">
            Medical Monograph & Visual Aid
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Clinical visual aid for doctors, medical representatives, and authorized stockists.
          </p>
        </div>

        {/* Flipbook Container Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden max-w-5xl mx-auto">
          
          {/* Top Control Bar */}
          <div className="bg-[#163e61] text-white px-6 py-3 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-red-400" />
              <span>{COMPANY_CONFIG.shortName} Product Visual Monograph</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-white/20 px-2.5 py-0.5 rounded text-[11px]">
                Page {currentPage + 1} of {totalPages}
              </span>
            </div>
          </div>

          {/* Flipbook Page Canvas */}
          <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-[460px]">
            
            {/* Left Page Half: High Quality Formulation Image */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200 shadow-inner">
              <div className="w-full h-64 sm:h-72 flex items-center justify-center">
                <img
                  src={currentProduct.imageUrl}
                  alt={currentProduct.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-md"
                />
              </div>
              <div className="w-full text-center mt-3 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-[#c72828] uppercase tracking-wider">
                  {currentProduct.category}
                </span>
                <p className="text-xs text-slate-500 font-medium">Packaging: {currentProduct.packagingSize || currentProduct.packaging} | MOQ: {currentProduct.moq}</p>
              </div>
            </div>

            {/* Right Page Half: Clinical & Pharmacological Monograph */}
            <div className="md:col-span-7 space-y-4">
              
              <div>
                <div className="inline-block bg-red-100 text-[#c72828] text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-1.5">
                  {currentProduct.regulatoryStatus}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#163e61]">
                  {currentProduct.name}
                </h3>
                <p className="text-sm font-semibold text-slate-700 mt-1">
                  {currentProduct.genericComposition}
                </p>
              </div>

              {/* Indication */}
              <div className="bg-slate-50 border-l-4 border-[#163e61] p-3 rounded-r-lg text-xs space-y-1">
                <span className="font-bold text-[#163e61] uppercase tracking-wide">Clinical Indication:</span>
                <p className="text-slate-600 leading-relaxed">{currentProduct.indication}</p>
              </div>

              {/* Clinical Highlights List */}
              <div className="space-y-1.5 pt-1">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Key Product Highlights:</p>
                {currentProduct.clinicalHighlights.map((hl, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onOpenEnquiry(currentProduct.name)}
                  className="bg-[#c72828] hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Inquire MOQ for {currentProduct.name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={() => onSelectProduct(currentProduct)}
                  className="bg-[#163e61] hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition-colors"
                >
                  View Full Specs
                </button>
              </div>

            </div>

          </div>

          {/* Bottom Flipbook Navigation Bar */}
          <div className="bg-slate-100 border-t border-slate-200 px-6 py-3 flex items-center justify-between">
            <button
              onClick={prevPage}
              className="flex items-center gap-1 text-xs font-bold text-[#163e61] hover:text-[#c72828] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Page</span>
            </button>

            {/* Direct Page Selector Thumbnails */}
            <div className="hidden sm:flex items-center gap-1.5">
              {PRODUCTS.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setCurrentPage(idx)}
                  className={`w-7 h-7 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                    idx === currentPage
                      ? 'bg-[#c72828] text-white shadow'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-300'
                  }`}
                  title={p.name}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={nextPage}
              className="flex items-center gap-1 text-xs font-bold text-[#163e61] hover:text-[#c72828] transition-colors"
            >
              <span>Next Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
