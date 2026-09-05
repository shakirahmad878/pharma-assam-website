import React, { useState } from 'react';
import { 
  Building, 
  Wind, 
  Gauge, 
  Thermometer, 
  Droplets, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Zap, 
  ArrowRight 
} from 'lucide-react';
import { MANUFACTURING_FACILITIES, MANUFACTURING_PROCESS_STEPS } from '../data/manufacturing';

interface EditorialCleanroomProps {
  onOpenEnquiry: (productName?: string) => void;
}

export const EditorialCleanroom: React.FC<EditorialCleanroomProps> = ({ onOpenEnquiry }) => {
  const [activeFacilityIndex, setActiveFacilityIndex] = useState<number>(0);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(0);

  const currentFacility = MANUFACTURING_FACILITIES[activeFacilityIndex] || MANUFACTURING_FACILITIES[0];

  return (
    <section id="manufacturing" className="py-24 bg-slate-50 border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-white text-[#0f2b48] px-4 py-1.5 rounded-full text-xs font-bold border border-slate-300 shadow-sm mb-3">
            <Building className="w-4 h-4 text-teal-700" />
            <span>WHO-GMP Compliant Infrastructure</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f2b48] tracking-tight">
            Advanced Cleanroom & <span className="text-teal-700">Sterility Facilities</span>
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            Engineered with automated HVAC air handling units, terminal HEPA filtration (99.997%), and continuous positive pressure differentials to eliminate cross-contamination.
          </p>
        </div>

        {/* Cleanroom Environment Switcher */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {MANUFACTURING_FACILITIES.map((facility, idx) => (
            <button
              key={facility.id}
              onClick={() => setActiveFacilityIndex(idx)}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                activeFacilityIndex === idx
                  ? 'bg-[#0f2b48] text-white border-[#0f2b48] shadow-md font-black'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
              }`}
            >
              <span className="font-mono text-cyan-300 mr-2">0{idx + 1}</span>
              {facility.title} ({facility.classification})
            </button>
          ))}
        </div>

        {/* Interactive Cleanroom HUD Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          
          {/* Main Cleanroom Spec Card (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-sm flex flex-col justify-between space-y-6">
            
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200">
                  {currentFacility.classification}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  • Positive Airflow Isolation
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-[#0f2b48]">
                {currentFacility.title}
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed">
                {currentFacility.description}
              </p>
            </div>

            {/* Key Capabilities List */}
            <div className="space-y-2.5 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <span className="text-xs font-mono font-bold text-[#0f2b48] uppercase tracking-wider block">
                Sterility & Isolation Protocols:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {currentFacility.capabilities.map((cap, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium">{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* In-use Equipment Highlights */}
            <div className="pt-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Automated Processing Equipment:
              </span>
              <div className="flex flex-wrap gap-2">
                {currentFacility.equipment.map((eq, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 font-mono text-xs font-semibold border border-slate-200"
                  >
                    {eq}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Real-time Environmental HUD Telemetry (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#0f2b48] to-[#0a192f] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col justify-between space-y-6">
            
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center">
                <Gauge className="w-4 h-4 mr-1.5 text-cyan-400" />
                Live HVAC Telemetry HUD
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 font-mono">
              
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1 font-sans">
                  <Wind className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Particle Count:</span>
                </div>
                <div className="text-base sm:text-lg font-black text-cyan-300">
                  {currentFacility.specifications.particles}
                </div>
                <div className="text-[10px] text-slate-400 font-sans mt-0.5">≥ 0.5 µm/m³</div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1 font-sans">
                  <Gauge className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Pressure Delta:</span>
                </div>
                <div className="text-base sm:text-lg font-black text-emerald-300">
                  {currentFacility.specifications.pressure}
                </div>
                <div className="text-[10px] text-slate-400 font-sans mt-0.5">Positive differential</div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1 font-sans">
                  <Thermometer className="w-3.5 h-3.5 text-amber-300" />
                  <span>Temp Target:</span>
                </div>
                <div className="text-base sm:text-lg font-black text-amber-300">
                  {currentFacility.specifications.temperature}
                </div>
                <div className="text-[10px] text-slate-400 font-sans mt-0.5">Automated BMS</div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1 font-sans">
                  <Droplets className="w-3.5 h-3.5 text-teal-300" />
                  <span>Rel Humidity:</span>
                </div>
                <div className="text-base sm:text-lg font-black text-teal-300">
                  {currentFacility.specifications.humidity}
                </div>
                <div className="text-[10px] text-slate-400 font-sans mt-0.5">Dehumidified</div>
              </div>

            </div>

            {/* Filtration Standard */}
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs font-mono space-y-1">
              <span className="text-slate-400 uppercase text-[10px] font-sans">Terminal Filtration:</span>
              <p className="text-white font-bold">{currentFacility.specifications.filtration}</p>
              <p className="text-slate-400 text-[11px] font-sans">DOP/PAO Smoke tested per ISO 14644-1</p>
            </div>

            <button
              onClick={() => onOpenEnquiry(`Cleanroom Audit Request: ${currentFacility.title}`)}
              className="w-full bg-white hover:bg-slate-100 text-[#0f2b48] font-black py-3 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center space-x-1.5"
            >
              <span>Schedule Virtual Technical Audit</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* 6-Stage Validated Manufacturing Workflow */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-300 shadow-sm space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-700 block">
                cGLP & cGMP Quality Lifecycle
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-[#0f2b48]">
                6-Stage Batch Execution Architecture
              </h4>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Interactive Workflow Inspector
            </span>
          </div>

          {/* Workflow Stage Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {MANUFACTURING_PROCESS_STEPS.map((step, idx) => (
              <button
                key={step.step}
                onClick={() => setActiveWorkflowStep(idx)}
                className={`p-4 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                  activeWorkflowStep === idx
                    ? 'bg-[#0f2b48] text-white border-[#0f2b48] shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <div>
                  <span className={`text-[11px] font-mono font-bold block mb-1 ${
                    activeWorkflowStep === idx ? 'text-cyan-300' : 'text-teal-700'
                  }`}>
                    Stage 0{step.step}
                  </span>
                  <strong className="text-xs block font-bold leading-tight">{step.title}</strong>
                </div>
                <span className={`text-[10px] font-mono mt-3 block ${
                  activeWorkflowStep === idx ? 'text-slate-300' : 'text-slate-500'
                }`}>
                  {step.verification}
                </span>
              </button>
            ))}
          </div>

          {/* Active Step Detailed Card */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold text-teal-700 uppercase tracking-wider">
                Stage 0{MANUFACTURING_PROCESS_STEPS[activeWorkflowStep].step} Focus:
              </span>
              <h5 className="text-lg font-black text-[#0f2b48]">
                {MANUFACTURING_PROCESS_STEPS[activeWorkflowStep].title}
              </h5>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                {MANUFACTURING_PROCESS_STEPS[activeWorkflowStep].description}
              </p>
            </div>

            <div className="shrink-0 bg-white p-4 rounded-xl border border-slate-300 text-xs font-mono">
              <span className="text-slate-400 block text-[10px] font-sans">Quality Assurance Mandate:</span>
              <strong className="text-[#0f2b48] font-bold">
                {MANUFACTURING_PROCESS_STEPS[activeWorkflowStep].verification}
              </strong>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
