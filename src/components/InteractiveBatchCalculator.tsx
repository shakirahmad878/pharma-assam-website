import React, { useState } from 'react';
import { 
  Calculator, 
  Layers, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Plus, 
  FileSpreadsheet, 
  FileCheck, 
  ArrowRight,
  Boxes,
  Zap
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';

interface InteractiveBatchCalculatorProps {
  onOpenEnquiry: (productName?: string) => void;
  onAddToRfq: (product: Product) => void;
}

export const InteractiveBatchCalculator: React.FC<InteractiveBatchCalculatorProps> = ({
  onOpenEnquiry,
  onAddToRfq
}) => {
  const [selectedProductIndex, setSelectedProductIndex] = useState<number>(0);
  const [batchVolume, setBatchVolume] = useState<number>(25000);
  const [packagingType, setPackagingType] = useState<string>('Alu-Alu Cold Formed Blister');
  const [targetDossier, setTargetDossier] = useState<string>('eCTD (Modules 1-5)');
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const selectedProduct = PRODUCTS[selectedProductIndex] || PRODUCTS[0];

  // Dynamic Batch Calculations
  const leadTimeDays = Math.round(18 + (batchVolume / 20000) * 3);
  const estimatedPacks = Math.round(batchVolume / 10);
  const cleanroomClass = selectedProduct.category === 'Injectables' ? 'ISO Class 5 (Grade A)' : 'ISO Class 7 (Grade C)';
  const qualityCheckpoints = selectedProduct.category === 'Injectables' ? 24 : 16;
  const stabilityValidation = 'Zone IVb (40°C / 75% RH Compliant)';

  const handleAddCustomBatchToRfq = () => {
    onAddToRfq(selectedProduct);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
  };

  return (
    <section id="calculator" className="py-24 bg-white border-b border-slate-200 relative overflow-hidden">
      
      {/* Background Accent Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-slate-100 text-[#0f2b48] px-4 py-1.5 rounded-full text-xs font-bold border border-slate-300 shadow-sm mb-3">
            <Calculator className="w-4 h-4 text-teal-700" />
            <span>Interactive Production Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f2b48] tracking-tight">
            Batch Sizing & <span className="text-teal-700">Formulation Studio</span>
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            Simulate commercial batch runs, estimate manufacturing lead times, cleanroom assignments, and regional distribution packaging requirements in real time.
          </p>
        </div>

        {/* Studio Bento Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Controls: Configuration Console (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-md space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0f2b48] flex items-center">
                <Boxes className="w-4 h-4 mr-1.5 text-teal-700" />
                Step 1: Select Formulation & Batch Parameters
              </span>
              <span className="text-[11px] font-mono text-slate-500">Real-Time Estimator</span>
            </div>

            {/* Molecule Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                Target Formulation Molecule:
              </label>
              <select
                value={selectedProductIndex}
                onChange={(e) => setSelectedProductIndex(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#0f2b48] focus:ring-1 focus:ring-[#0f2b48]"
              >
                {PRODUCTS.map((p, idx) => (
                  <option key={p.id} value={idx}>
                    {p.name} — [{p.dosageForm}] ({p.pharmacopoeiaStandard})
                  </option>
                ))}
              </select>
            </div>

            {/* Batch Volume Slider */}
            <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                  Batch Run Volume (Units):
                </label>
                <span className="text-base sm:text-lg font-mono font-black text-[#0f2b48] bg-slate-100 px-3 py-1 rounded-lg border border-slate-300">
                  {batchVolume.toLocaleString()} {selectedProduct.unit}
                </span>
              </div>

              <input
                type="range"
                min="5000"
                max="100000"
                step="5000"
                value={batchVolume}
                onChange={(e) => setBatchVolume(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0f2b48]"
              />

              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Pilot Batch: 5,000 Units</span>
                <span>Standard Commercial: 50,000</span>
                <span>Large Scale: 100,000+</span>
              </div>
            </div>

            {/* Primary Barrier Packaging Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                Primary Packaging Barrier:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Alu-Alu Cold Formed Blister',
                  'Blister PVC / PVDC (High Barrier)',
                  'Neutral Glass Amber Vials (Type I)',
                  'HDPE Tamper-Evident Bottles'
                ].map((pack) => (
                  <button
                    key={pack}
                    type="button"
                    onClick={() => setPackagingType(pack)}
                    className={`p-3 rounded-xl text-left text-xs font-medium transition-all border ${
                      packagingType === pack
                        ? 'bg-[#0f2b48] text-white font-bold border-[#0f2b48] shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    {pack}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Supply & Registration Framework */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                Target Supply & Registration Framework:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  'State DCA / CDSCO Approved',
                  'Assam Hospital Tender',
                  'PCD District Franchise'
                ].map((dossier) => (
                  <button
                    key={dossier}
                    type="button"
                    onClick={() => setTargetDossier(dossier)}
                    className={`p-2.5 rounded-xl text-center text-xs font-medium transition-all border ${
                      targetDossier === dossier
                        ? 'bg-teal-700 text-white font-bold border-teal-700'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    {dossier}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Calculated Batch Specification HUD (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#0f2b48] to-[#0a192f] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
            
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center">
                <Zap className="w-4 h-4 mr-1.5 text-cyan-400" />
                Live Production Metrics
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Ready for Quotation
              </span>
            </div>

            {/* Highlighted Formulation Card */}
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-sm space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400">Selected Molecule:</span>
              <h4 className="text-lg font-black text-white">{selectedProduct.name}</h4>
              <p className="text-xs font-mono text-cyan-200 line-clamp-1">{selectedProduct.genericComposition}</p>
            </div>

            {/* Live Telemetry Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-slate-400 text-[10px] font-sans flex items-center mb-1">
                  <Clock className="w-3.5 h-3.5 mr-1 text-cyan-300" />
                  Estimated Turnaround:
                </span>
                <span className="text-lg font-black text-white">{leadTimeDays} Days</span>
                <span className="text-[10px] text-slate-400 block">From API assay release</span>
              </div>

              <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-slate-400 text-[10px] font-sans flex items-center mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-300" />
                  Cleanroom Class:
                </span>
                <span className="text-sm font-black text-emerald-300">{cleanroomClass}</span>
                <span className="text-[10px] text-slate-400 block">HEPA 99.997% @ 0.3μm</span>
              </div>

              <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-slate-400 text-[10px] font-sans flex items-center mb-1">
                  <FileCheck className="w-3.5 h-3.5 mr-1 text-teal-300" />
                  Quality In-Process:
                </span>
                <span className="text-base font-bold text-white">{qualityCheckpoints} Assay Points</span>
                <span className="text-[10px] text-slate-400 block">cGLP Tested</span>
              </div>

              <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-slate-400 text-[10px] font-sans flex items-center mb-1">
                  <Boxes className="w-3.5 h-3.5 mr-1 text-amber-300" />
                  Finished Packs:
                </span>
                <span className="text-base font-bold text-amber-300">~{estimatedPacks.toLocaleString()} Boxes</span>
                <span className="text-[10px] text-slate-400 block">{packagingType.split(' ')[0]}</span>
              </div>
            </div>

            {/* Dossier & Compliance Badge */}
            <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Stability Compliance:</span>
                <span className="font-mono font-bold text-emerald-300 text-[11px]">{stabilityValidation}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Documentation:</span>
                <span className="font-mono font-bold text-cyan-300 text-[11px]">{targetDossier}</span>
              </div>
            </div>

            {/* Success Confirmation Toast */}
            {showConfirmation && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-mono flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400 shrink-0" />
                <span>Custom Batch Spec successfully added to RFQ Cart!</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleAddCustomBatchToRfq}
                className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black py-3.5 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Batch Spec to RFQ</span>
              </button>

              <button
                onClick={() => onOpenEnquiry(`Custom Batch Request: ${selectedProduct.name} (${batchVolume} Units)`)}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all border border-white/15 flex items-center justify-center space-x-2"
              >
                <span>Request Custom Sourcing Proposal</span>
                <ArrowRight className="w-4 h-4 text-cyan-300" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
