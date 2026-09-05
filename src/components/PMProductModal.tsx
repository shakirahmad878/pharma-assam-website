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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="bg-[#c72828] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
              {product.category}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {product.pharmacopoeiaStandard} Standard
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Main Visual & Info Header */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            <div className="sm:col-span-5 bg-slate-50 rounded-xl border border-slate-200 p-4 flex items-center justify-center h-56">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="max-h-full max-w-full object-contain filter drop-shadow-md"
              />
            </div>

            <div className="sm:col-span-7 space-y-2">
              <h2 className="text-2xl font-black text-[#163e61]">
                {product.name}
              </h2>
              <p className="text-sm font-semibold text-slate-700 leading-snug">
                {product.genericComposition}
              </p>
              <p className="text-xs text-slate-500">
                Regulatory Status: <strong className="text-slate-800">{product.regulatoryStatus}</strong>
              </p>
              
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-medium">
                  Packaging: <strong>{product.packagingSize || product.packaging}</strong>
                </span>
                <span className="bg-red-50 text-[#c72828] border border-red-200 px-2.5 py-1 rounded font-bold flex items-center gap-1">
                  <PackageCheck className="w-3.5 h-3.5" />
                  MOQ: <strong>{product.moq}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Indication / Therapeutic Scope */}
          <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 space-y-1">
            <h4 className="text-xs font-bold text-[#c72828] uppercase tracking-wider">Therapeutic Indication:</h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {product.indication}
            </p>
          </div>

          {/* Active Molecules & Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <h4 className="font-bold text-[#163e61] uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-4 h-4 text-[#c72828]" />
                Active Molecules / Ingredients:
              </h4>
              <ul className="space-y-1 text-slate-600">
                {product.activeMolecules.map((m, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <h4 className="font-bold text-[#163e61] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#163e61]" />
                Clinical Advantages:
              </h4>
              <ul className="space-y-1 text-slate-600">
                {product.clinicalHighlights.map((ch, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{ch}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Storage & Quality */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-600 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <span className="font-bold text-slate-700">Storage Conditions: </span>
              <span>{product.storageCondition}</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
              <ShieldCheck className="w-4 h-4" />
              <span>WHO-GMP Quality Certified</span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenEnquiry(product.name);
            }}
            className="bg-[#c72828] hover:bg-red-700 text-white text-xs font-bold px-6 py-2 rounded-lg shadow transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Inquire Product MOQ & Quotation</span>
          </button>
        </div>

      </div>
    </div>
  );
};
