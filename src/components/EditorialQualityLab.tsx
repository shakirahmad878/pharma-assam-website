import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Microscope, 
  FlaskConical, 
  FileCheck, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react';
import { QUALITY_PROTOCOLS, COMPLIANCE_CERTIFICATIONS } from '../data/quality';

interface EditorialQualityLabProps {
  onOpenEnquiry: (productName?: string) => void;
}

export const EditorialQualityLab: React.FC<EditorialQualityLabProps> = ({ onOpenEnquiry }) => {
  const [activeTestTab, setActiveTestTab] = useState<'hplc' | 'dissolution' | 'stability' | 'sterility'>('hplc');
  const [selectedBatch, setSelectedBatch] = useState<string>('CQ10-2026-B812');

  return (
    <section id="quality" className="py-24 bg-white border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-slate-100 text-[#0f2b48] px-4 py-1.5 rounded-full text-xs font-bold border border-slate-300 shadow-sm mb-3">
            <Microscope className="w-4 h-4 text-teal-700" />
            <span>cGLP Analytical Testing Suite</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f2b48] tracking-tight">
            Rigorous Quality Control & <span className="text-teal-700">Analytical Lab</span>
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            Every production batch undergoes multi-point analytical validation per IP/BP/USP pharmacopeias with 100% digital 21 CFR Part 11 audit trails before Certificate of Analysis (CoA) release.
          </p>
        </div>

        {/* Interactive Lab Dashboard Bento */}
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-300 shadow-md space-y-8 mb-16">
          
          {/* Lab Top Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            
            {/* Test Method Selector */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {[
                { id: 'hplc', label: 'HPLC Purity Assay', icon: Activity },
                { id: 'dissolution', label: 'In-Vitro Dissolution', icon: TrendingUp },
                { id: 'stability', label: 'Zone IVb Stability', icon: Clock },
                { id: 'sterility', label: 'Microbial & Endotoxin', icon: FlaskConical }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTestTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTestTab(tab.id as any)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border whitespace-nowrap ${
                      isActive
                        ? 'bg-[#0f2b48] text-white border-[#0f2b48] shadow-sm font-black'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-300' : 'text-teal-700'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Batch Selector */}
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-slate-500 font-bold">Simulated Batch:</span>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0f2b48]"
              >
                <option value="CQ10-2026-B812">Batch #CQ10-2026-B812 (CoQ10 Softgel)</option>
                <option value="RAB-2026-A109">Batch #RAB-2026-A109 (Rabeprazole IV)</option>
                <option value="MYO-2026-C441">Batch #MYO-2026-C441 (Myo-Inositol)</option>
              </select>
            </div>

          </div>

          {/* Dynamic Test Simulation Visualizer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* SVG Interactive Chart / Telemetry View (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              
              {activeTestTab === 'hplc' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-[#0f2b48] flex items-center">
                      <Activity className="w-4 h-4 mr-1 text-teal-700" />
                      Shimadzu Prominence HPLC • UV @ 254nm
                    </span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Purity: 99.88% (Spec: ≥ 98.0%)
                    </span>
                  </div>

                  {/* HPLC Chromatogram SVG */}
                  <div className="h-56 bg-slate-900 rounded-xl p-4 relative overflow-hidden border border-slate-800">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-40" />
                    
                    <svg className="w-full h-full relative z-10" viewBox="0 0 500 180" preserveAspectRatio="none">
                      {/* Baseline */}
                      <line x1="20" y1="150" x2="480" y2="150" stroke="#475569" strokeWidth="1.5" />
                      
                      {/* Noise and peaks */}
                      <path
                        d="M 20 150 Q 50 149 80 150 Q 110 148 130 150 L 150 149 L 160 145 L 170 150 L 220 150 L 240 148 L 260 25 L 280 148 L 330 150 L 370 145 L 385 150 L 480 150"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />

                      {/* Major Peak Annotation */}
                      <circle cx="260" cy="25" r="4" fill="#38bdf8" className="animate-ping" />
                      <circle cx="260" cy="25" r="4" fill="#38bdf8" />
                      <text x="270" y="30" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                        API Retention Peak (Rt: 4.82 min) - 99.88%
                      </text>
                    </svg>

                    <div className="absolute bottom-2 left-4 right-4 flex justify-between text-[10px] font-mono text-slate-400">
                      <span>0.0 min</span>
                      <span>2.5 min</span>
                      <span>5.0 min</span>
                      <span>7.5 min</span>
                      <span>10.0 min</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs font-mono text-slate-600 pt-1">
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Retention Time:</span>
                      <strong className="text-slate-900">4.82 ± 0.05 min</strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Theoretical Plates:</span>
                      <strong className="text-slate-900">&gt; 5,800 N</strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Tailing Factor:</span>
                      <strong className="text-slate-900">1.08 (&lt; 1.5)</strong>
                    </div>
                  </div>
                </div>
              )}

              {activeTestTab === 'dissolution' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-[#0f2b48] flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1 text-teal-700" />
                      Electrolab USP Apparatus II • Paddle @ 50 RPM, 37.0°C
                    </span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      30 Min Release: 98.4% (Spec: &gt; 80%)
                    </span>
                  </div>

                  {/* Dissolution Curve SVG */}
                  <div className="h-56 bg-slate-900 rounded-xl p-4 relative overflow-hidden border border-slate-800">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-40" />
                    
                    <svg className="w-full h-full relative z-10" viewBox="0 0 500 180" preserveAspectRatio="none">
                      {/* Grid Lines */}
                      <line x1="40" y1="150" x2="480" y2="150" stroke="#475569" strokeWidth="1" />
                      <line x1="40" y1="90" x2="480" y2="90" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="40" y1="30" x2="480" y2="30" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                      
                      {/* Spec line (80% @ 30 min) */}
                      <line x1="40" y1="60" x2="480" y2="60" stroke="#ef4444" strokeWidth="1" strokeDasharray="6 4" />
                      <text x="45" y="55" fill="#f87171" fontSize="10" fontFamily="monospace">Pharmacopeial Limit (&gt; 80%)</text>

                      {/* Dissolution Curve */}
                      <path
                        d="M 40 150 Q 120 70 200 45 T 350 35 T 480 32"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      {/* 30-min point */}
                      <circle cx="260" cy="40" r="5" fill="#34d399" />
                      <text x="270" y="42" fill="#34d399" fontSize="11" fontFamily="monospace" fontWeight="bold">
                        98.4% @ 30 min
                      </text>
                    </svg>

                    <div className="absolute bottom-2 left-10 right-4 flex justify-between text-[10px] font-mono text-slate-400">
                      <span>0 min</span>
                      <span>15 min</span>
                      <span>30 min</span>
                      <span>45 min</span>
                      <span>60 min</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs font-mono text-slate-600 pt-1">
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Medium:</span>
                      <strong className="text-slate-900">0.1N HCl (pH 1.2)</strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Apparatus:</span>
                      <strong className="text-slate-900">USP Type II Paddle</strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Bath Temp:</span>
                      <strong className="text-slate-900">37.0°C ± 0.5°C</strong>
                    </div>
                  </div>
                </div>
              )}

              {activeTestTab === 'stability' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-[#0f2b48] flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-teal-700" />
                      ICH Q1A(R2) Zone IVb Stability Testing Chamber
                    </span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      6-Month Accelerated: 99.4%
                    </span>
                  </div>

                  <div className="h-56 bg-slate-900 rounded-xl p-5 text-white flex flex-col justify-between border border-slate-800">
                    <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <span className="text-slate-400 block text-[10px]">Accelerated Condition:</span>
                        <strong className="text-amber-300 text-sm">40°C ± 2°C / 75% RH ± 5%</strong>
                        <p className="text-[10px] text-slate-400 mt-1">Tropical & Hot Humid Zones</p>
                      </div>

                      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <span className="text-slate-400 block text-[10px]">Long-Term Real Time:</span>
                        <strong className="text-emerald-300 text-sm">30°C ± 2°C / 65% RH ± 5%</strong>
                        <p className="text-[10px] text-slate-400 mt-1">36-Month Commercial Shelf-Life</p>
                      </div>
                    </div>

                    <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs font-mono flex items-center justify-between">
                      <span className="text-slate-300">Degradation Products / Impurities:</span>
                      <strong className="text-emerald-300 font-bold">&lt; 0.10% (Complies)</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs font-mono text-slate-600 pt-1">
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">ICH Climate:</span>
                      <strong className="text-slate-900">Zone IVb Validated</strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Packaging Barrier:</span>
                      <strong className="text-slate-900">Alu-Alu Foil</strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Photostability:</span>
                      <strong className="text-slate-900">ICH Q1B Confirmed</strong>
                    </div>
                  </div>
                </div>
              )}

              {activeTestTab === 'sterility' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-[#0f2b48] flex items-center">
                      <FlaskConical className="w-4 h-4 mr-1 text-teal-700" />
                      Direct Inoculation Sterility & Turbidimetric LAL
                    </span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      14-Day Incubation: Sterile
                    </span>
                  </div>

                  <div className="h-56 bg-slate-900 rounded-xl p-5 text-white flex flex-col justify-between border border-slate-800">
                    <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <span className="text-slate-400 block text-[10px]">Bacterial Endotoxin:</span>
                        <strong className="text-cyan-300 text-sm">&lt; 0.25 EU/mL</strong>
                        <p className="text-[10px] text-slate-400 mt-1">USP &lt;85&gt; Kinetic Chromogenic</p>
                      </div>

                      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <span className="text-slate-400 block text-[10px]">Bioburden Assay:</span>
                        <strong className="text-emerald-300 text-sm">0 CFU / 100 mL</strong>
                        <p className="text-[10px] text-slate-400 mt-1">Membrane Filtration Method</p>
                      </div>
                    </div>

                    <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs font-mono flex items-center justify-between">
                      <span className="text-slate-300">Media Fill Challenge Test:</span>
                      <strong className="text-emerald-300 font-bold">100% Zero Growth Pass</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs font-mono text-slate-600 pt-1">
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">FTM Incubation:</span>
                      <strong className="text-slate-900">32.5°C ± 2.5°C (14d)</strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">SCDM Incubation:</span>
                      <strong className="text-slate-900">22.5°C ± 2.5°C (14d)</strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Sub-Visible Particles:</span>
                      <strong className="text-slate-900">USP &lt;788&gt; Compliant</strong>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Test Specification Details (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-teal-700 uppercase tracking-wider block">
                  Pharmacopeial Release Protocol
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-[#0f2b48]">
                  Zero Compromise on Assay & Stability
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Our dedicated analytical chemists operate in temperature-controlled, computerized laboratory environments with automated electronic signatures and unalterable audit trails.
                </p>
              </div>

              <div className="space-y-3">
                {QUALITY_PROTOCOLS.map((protocol) => (
                  <div
                    key={protocol.id}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-start space-x-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-bold text-[#0f2b48] block">{protocol.title}</strong>
                      <p className="text-[11px] text-slate-600 mt-0.5">{protocol.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onOpenEnquiry('Certificate of Analysis (CoA) & Stability Dossier Request')}
                className="w-full bg-[#0f2b48] hover:bg-[#0a192f] text-white font-extrabold py-3.5 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <FileCheck className="w-4 h-4 text-cyan-300" />
                <span>Request Sample Batch CoA & Method Dossier</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>

        </div>

        {/* Regulatory Compliance & Pharmacopoeias Verified Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {COMPLIANCE_CERTIFICATIONS.map((cert) => (
            <div
              key={cert.title}
              className="p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-2"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono font-bold text-teal-700">{cert.title}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs text-slate-600 font-medium leading-tight">{cert.description}</p>
              <span className="text-[10px] font-mono text-slate-400">{cert.badge}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
