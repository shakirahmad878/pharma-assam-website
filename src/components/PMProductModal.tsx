import React from 'react';
import { X, Send, ShieldCheck, CheckCircle2, Package, Sparkles, PackageCheck } from 'lucide-react';
import { Product } from '../types';

interface PMProductModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenEnquiry: (productName: string) => void;
}

export const PMProductModal: React.FC<PMProductModalProps> = ({
  product,
  onClose,
  onOpenEnquiry
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10243A]/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-[#DCE4EB] max-w-3xl w-full max-h-[90vh] overflow-y-auto relative animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xs border-b border-[#DCE4EB] px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="bg-[#10243A] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {product.category}
            </span>
            <span className="text-xs font-semibold text-[#64748B] bg-[#F1F6F8] px-2.5 py-0.5 rounded-full border border-[#DCE4EB]">
              {product.pharmacopoeiaStandard} Standard
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#10243A] hover:bg-[#F1F6F8] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Main Visual & Info Header */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            <div className="sm:col-span-5 bg-[#F5F8FA] rounded-xl border border-[#DCE4EB] p-4 flex items-center justify-center h-56">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="max-h-full max-w-full object-contain filter drop-shadow-sm"
              />
            </div>

            <div className="sm:col-span-7 space-y-2.5">
              <h2 className="text-2xl font-black text-[#10243A] tracking-tight">
                {product.name}
              </h2>
              <p className="text-sm font-semibold text-[#1E293B] leading-snug">
                {product.genericComposition}
              </p>
              <p className="text-xs text-[#64748B]">
                Regulatory Class: <strong className="text-[#10243A] font-semibold">{product.regulatoryStatus}</strong>
              </p>
              
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="bg-[#F1F6F8] text-[#1E293B] border border-[#DCE4EB] px-3 py-1 rounded-lg font-medium">
                  Packaging: <strong className="font-bold">{product.packagingSize || product.packaging}</strong>
                </span>
                <span className="bg-teal-50 text-[#137F83] border border-teal-200 px-3 py-1 rounded-lg font-bold flex items-center gap-1.5">
                  <PackageCheck className="w-3.5 h-3.5 text-[#18A6A6]" />
                  Standard MOQ: <strong>{product.moq}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Indication / Therapeutic Scope */}
          <div className="bg-[#F5F8FA] border border-[#DCE4EB] rounded-xl p-4 space-y-1">
            <h4 className="text-xs font-bold text-[#137F83] uppercase tracking-wider">Therapeutic Indication:</h4>
            <p className="text-xs sm:text-sm text-[#1E293B] leading-relaxed">
              {product.indication}
            </p>
          </div>

          {/* Active Molecules & Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-white border border-[#DCE4EB] rounded-xl p-4 space-y-2 shadow-2xs">
              <h4 className="font-bold text-[#10243A] uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-4 h-4 text-[#18A6A6]" />
                Active Molecules / Ingredients:
              </h4>
              <ul className="space-y-1 text-[#64748B]">
                {product.activeMolecules.map((m, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#18A6A6]"></span>
                    <span className="text-[#1E293B]">{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-[#DCE4EB] rounded-xl p-4 space-y-2 shadow-2xs">
              <h4 className="font-bold text-[#10243A] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#18A6A6]" />
                Clinical Advantages:
              </h4>
              <ul className="space-y-1 text-[#64748B]">
                {product.clinicalHighlights.map((ch, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#18A6A6] flex-shrink-0 mt-0.5" />
                    <span className="text-[#1E293B]">{ch}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Storage & Quality */}
          <div className="bg-[#F1F6F8] rounded-xl p-4 border border-[#DCE4EB] text-xs text-[#64748B] flex items-center justify-between gap-4 flex-wrap">
            <div>
              <span className="font-semibold text-[#10243A]">Storage Conditions: </span>
              <span>{product.storageCondition}</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-[#137F83] bg-teal-50 px-3 py-1 rounded-lg border border-teal-200">
              <ShieldCheck className="w-4 h-4 text-[#18A6A6]" />
              <span>WHO-GMP Quality Assurance</span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white border-t border-[#DCE4EB] px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-[#F1F6F8] transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenEnquiry(product.name);
            }}
            className="bg-[#18A6A6] hover:bg-[#137F83] text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Inquire Product MOQ & Quotation</span>
          </button>
        </div>

      </div>
    </div>
  );
};
