import React from 'react';
import { 
  Check, 
  X, 
  ShieldCheck, 
  HelpCircle, 
  Handshake, 
  ArrowRight, 
  Layers 
} from 'lucide-react';
import { PARTNERSHIP_PILLARS, COMPARISON_ITEMS } from '../data/partnership';

interface EditorialComparisonProps {
  onOpenEnquiry: (productName?: string) => void;
}

export const EditorialComparison: React.FC<EditorialComparisonProps> = ({ onOpenEnquiry }) => {
  return (
    <section id="why-partner" className="py-24 bg-white border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-slate-100 text-[#0f2b48] px-4 py-1.5 rounded-full text-xs font-bold border border-slate-300 shadow-sm mb-3">
            <Handshake className="w-4 h-4 text-teal-700" />
            <span>Strategic B2B Partnership</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f2b48] tracking-tight">
            Why Institutional Buyers <span className="text-teal-700">Choose Us</span>
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            Compare our verified quality protocols, transparent batch documentation, and regulatory compliance against conventional third-party toll manufacturers.
          </p>
        </div>

        {/* 6 Value Pillars Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {PARTNERSHIP_PILLARS.map((pillar, idx) => (
            <div
              key={pillar.id}
              className="bg-slate-50 rounded-3xl p-7 border border-slate-200 hover:border-[#0f2b48]/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                    Pillar 0{idx + 1}
                  </span>
                  <ShieldCheck className="w-5 h-5 text-[#0f2b48]" />
                </div>
                <h3 className="text-lg font-black text-[#0f2b48]">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 text-xs font-mono font-bold text-teal-800">
                {pillar.metric}
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-slate-50 rounded-3xl border border-slate-300 shadow-sm overflow-hidden mb-12">
          
          <div className="p-6 sm:p-8 bg-[#0f2b48] text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 block">
                Standard of Excellence
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Manufacturing Quality Comparison
              </h3>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/10 text-slate-200 border border-white/20">
              Institutional Benchmark
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600">
                  <th className="py-4 px-6">Evaluation Parameter</th>
                  <th className="py-4 px-6 bg-teal-50 text-teal-900 border-x border-teal-200">Our Quality Standard</th>
                  <th className="py-4 px-6 text-slate-500">Conventional Toll Manufacturer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {COMPARISON_ITEMS.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-100/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#0f2b48]">
                      {item.feature}
                    </td>
                    <td className="py-4 px-6 bg-teal-50/50 border-x border-teal-200 font-semibold text-teal-950">
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 font-black" />
                        <span>{item.us}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      <div className="flex items-center space-x-2">
                        <X className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>{item.others}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Bottom Call to Action Strip */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0f2b48] via-[#0a192f] to-[#0f2b48] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
              Institutional Sourcing & Partnership
            </span>
            <h4 className="text-2xl font-black text-white">
              Ready to elevate your pharmaceutical supply chain?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Connect with our procurement specialists to discuss contract manufacturing, distribution exclusivity, or hospital tenders.
            </p>
          </div>

          <button
            onClick={() => onOpenEnquiry('B2B Partnership & Technical Sourcing')}
            className="shrink-0 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black px-7 py-4 rounded-xl text-xs sm:text-sm transition-all shadow-lg flex items-center space-x-2 hover:scale-[1.02]"
          >
            <span>Initiate Partnership Inquiry</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
