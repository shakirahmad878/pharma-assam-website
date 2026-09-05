import React, { useState } from 'react';
import { 
  X, 
  Package, 
  ShieldCheck, 
  CheckCircle2, 
  Send, 
  Thermometer, 
  Printer
} from 'lucide-react';
import { Product } from '../types';
import { COMPANY_CONFIG } from '../data/companyConfig';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenEnquiry: (productName: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenEnquiry
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!product) return null;

  const handleSimulateDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => {
      window.print();
    }, 500);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-pharma-950 via-pharma-900 to-pharma-800 text-white p-6 sm:p-8 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
              {product.category}
            </span>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {product.pharmacopoeiaStandard} Standard
            </span>
            {product.badge && (
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-tealbrand-600 text-white">
                {product.badge}
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {product.name}
          </h2>

          <div className="mt-3 bg-white/10 p-3.5 rounded-2xl border border-white/15">
            <span className="text-[10px] uppercase font-bold text-cyan-300 tracking-wider block mb-1">
              Active Salt / Molecule Formulation:
            </span>
            <p className="text-xs sm:text-sm font-mono text-white leading-relaxed">
              {product.genericComposition}
            </p>
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
          
          {/* Key Technical Specifications Grid */}
          <div>
            <h4 className="text-xs uppercase font-mono font-extrabold text-slate-400 tracking-wider mb-3">
              Technical Data Sheet (TDS) Summary
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Dosage Form</span>
                <strong className="text-slate-900 font-bold mt-0.5 block">{product.dosageForm}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Therapeutic Segment</span>
                <strong className="text-slate-900 font-bold mt-0.5 block">{product.therapeuticSegment}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Shelf Life</span>
                <strong className="text-slate-900 font-bold mt-0.5 block">{product.shelfLife}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Commercial MOQ</span>
                <strong className="text-pharma-900 font-mono font-bold mt-0.5 block">{product.moq}</strong>
              </div>
            </div>
          </div>

          {/* Active Molecules Checklist */}
          <div>
            <h4 className="text-xs uppercase font-mono font-extrabold text-slate-400 tracking-wider mb-3">
              Active Pharmaceutical Ingredients (APIs)
            </h4>
            <div className="flex flex-wrap gap-2">
              {product.activeMolecules.map((mol, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-pharma-50 text-pharma-900 border border-pharma-200 text-xs font-semibold flex items-center"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-tealbrand-600 mr-1.5 shrink-0" />
                  {mol}
                </span>
              ))}
            </div>
          </div>

          {/* Clinical Highlights & Formulation Advantages */}
          <div>
            <h4 className="text-xs uppercase font-mono font-extrabold text-slate-400 tracking-wider mb-3">
              Formulation & Quality Benchmarks
            </h4>
            <div className="space-y-2">
              {product.clinicalHighlights.map((hl, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-semibold leading-relaxed">{hl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Therapeutic Indication */}
          <div>
            <h4 className="text-xs uppercase font-mono font-extrabold text-slate-400 tracking-wider mb-2">
              Clinical Indication & Pharmacological Purpose
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 bg-cyan-50/60 p-4 rounded-2xl border border-cyan-100 leading-relaxed">
              {product.indication}
            </p>
          </div>

          {/* Packaging & Storage Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block flex items-center">
                <Package className="w-3.5 h-3.5 mr-1 text-slate-500" />
                Packaging Presentation
              </span>
              <p className="text-slate-800 font-semibold">{product.packaging}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block flex items-center">
                <Thermometer className="w-3.5 h-3.5 mr-1 text-slate-500" />
                Storage & Stability
              </span>
              <p className="text-slate-800 font-semibold">{product.storageCondition}</p>
            </div>
          </div>

          {/* Regulatory & Quality Compliance Stamp */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 gap-3">
            <span className="flex items-center font-bold">
              <ShieldCheck className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
              <span>{product.regulatoryStatus} • 100% Quality Tested</span>
            </span>
            <span className="font-mono text-emerald-700 font-semibold text-[11px]">
              {COMPANY_CONFIG.name}
            </span>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-6 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSimulateDownload}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-pharma-900 bg-white border border-slate-300 hover:bg-slate-50 transition-colors flex items-center space-x-1.5 shadow-sm"
              title="Print / Save TDS"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>{downloadSuccess ? 'Preparing Print Sheet...' : 'Print / Export TDS Sheet'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenEnquiry(product.name);
            }}
            className="bg-pharma-900 hover:bg-pharma-950 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-2"
          >
            <Send className="w-4 h-4 text-cyan-300" />
            <span>Send Enquiry for this Product</span>
          </button>
        </div>

      </div>
    </div>
  );
};
