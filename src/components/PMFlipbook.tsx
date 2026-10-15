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
  const currentProduct = PRODUCTS[currentPage] || PRODUCTS[0];

  const nextPage = () => {
    setCurrentPage(prev => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage(prev => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section id="flipbook" className="py-16 bg-white border-b border-[#DCE4EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#137F83] uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Clinical Detailing Tool
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#10243A] tracking-tight">
            Medical Monograph & Visual Aid
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#64748B]">
            Interactive detailing visual aid for medical practitioners, hospital formulary committees, and stockists.
          </p>
        </div>

        {/* Flipbook Container Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#DCE4EB] overflow-hidden max-w-5xl mx-auto">
          
          {/* Top Control Bar */}
          <div className="bg-[#10243A] text-white px-6 py-3.5 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#18A6A6]" />
              <span>{COMPANY_CONFIG.shortName} Product Visual Monograph</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-white/10 px-3 py-1 rounded-full text-[11px] font-mono border border-white/10">
                Page {currentPage + 1} of {totalPages}
              </span>
            </div>
          </div>

          {/* Flipbook Page Canvas */}
          <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-gradient-to-br from-[#F5F8FA] via-white to-[#F1F6F8] min-h-[460px]">
            
            {/* Left Page Half: Formulation Image */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-[#DCE4EB] shadow-2xs">
              <div className="w-full h-64 sm:h-72 flex items-center justify-center">
                <img
                  src={currentProduct.imageUrl}
                  alt={currentProduct.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-sm"
                />
              </div>
              <div className="w-full text-center mt-3 pt-3 border-t border-[#F1F6F8]">
                <span className="text-[11px] font-bold text-[#137F83] uppercase tracking-wider">
                  {currentProduct.category}
                </span>
                <p className="text-xs text-[#64748B] font-medium mt-0.5">Packaging: {currentProduct.packagingSize || currentProduct.packaging} | MOQ: {currentProduct.moq}</p>
              </div>
            </div>

            {/* Right Page Half: Clinical Monograph */}
            <div className="md:col-span-7 space-y-4">
              
              <div>
                <div className="inline-block bg-[#E8EEF4] text-[#10243A] text-[11px] font-semibold px-2.5 py-0.5 rounded-full mb-1.5 border border-[#DCE4EB]">
                  {currentProduct.regulatoryStatus}
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#10243A]">
                  {currentProduct.name}
                </h3>
                <p className="text-sm font-semibold text-[#1E293B] mt-1 border-l-3 border-[#18A6A6] pl-2.5">
                  {currentProduct.genericComposition}
                </p>
              </div>

              {/* Indication */}
              <div className="bg-white border border-[#DCE4EB] p-3.5 rounded-xl text-xs space-y-1 shadow-2xs">
                <span className="font-bold text-[#10243A] uppercase tracking-wide text-[11px]">Therapeutic Scope:</span>
                <p className="text-[#64748B] leading-relaxed">{currentProduct.indication}</p>
              </div>

              {/* Clinical Highlights List */}
              <div className="space-y-1.5 pt-1">
                <p className="text-xs font-bold text-[#10243A] uppercase tracking-wider">Clinical Pharmacology & Salient Features:</p>
                {currentProduct.clinicalHighlights.map((hl, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#64748B]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#18A6A6] flex-shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onOpenEnquiry(currentProduct.name)}
                  className="bg-[#18A6A6] hover:bg-[#137F83] text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Inquire MOQ for {currentProduct.name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={() => onSelectProduct(currentProduct)}
                  className="bg-[#10243A] hover:bg-[#182F49] text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-2xs transition-colors cursor-pointer"
                >
                  View Full Dossier
                </button>
              </div>

            </div>

          </div>

          {/* Bottom Flipbook Navigation Bar */}
          <div className="bg-[#F1F6F8] border-t border-[#DCE4EB] px-6 py-3.5 flex items-center justify-between">
            <button
              onClick={prevPage}
              className="flex items-center gap-1 text-xs font-bold text-[#10243A] hover:text-[#18A6A6] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Formulation</span>
            </button>

            {/* Direct Page Selector Thumbnails */}
            <div className="hidden sm:flex items-center gap-1.5">
              {PRODUCTS.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setCurrentPage(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all flex items-center justify-center cursor-pointer ${
                    idx === currentPage
                      ? 'bg-[#10243A] text-white shadow-2xs'
                      : 'bg-white text-[#64748B] hover:bg-[#E8EEF4] border border-[#DCE4EB]'
                  }`}
                  title={p.name}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={nextPage}
              className="flex items-center gap-1 text-xs font-bold text-[#10243A] hover:text-[#18A6A6] transition-colors cursor-pointer"
            >
              <span>Next Formulation</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
