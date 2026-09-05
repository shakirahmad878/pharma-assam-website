import React, { useState } from 'react';
import { 
  MapPin, 
  Truck, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Clock,
  Handshake,
  Boxes
} from 'lucide-react';
import { 
  ASSAM_REGIONAL_HUBS, 
  SUPPLY_CHANNELS, 
  STATUTORY_COMPLIANCE_LIST 
} from '../data/regionalNetwork';

interface RegionalAssamNetworkProps {
  onOpenEnquiry: (productName?: string) => void;
}

export const RegionalAssamNetwork: React.FC<RegionalAssamNetworkProps> = ({ onOpenEnquiry }) => {
  const [activeHubIndex, setActiveHubIndex] = useState<number>(0);

  const currentHub = ASSAM_REGIONAL_HUBS[activeHubIndex] || ASSAM_REGIONAL_HUBS[0];

  return (
    <section id="regional-network" className="py-24 bg-slate-50 border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-white text-[#0f2b48] px-4 py-1.5 rounded-full text-xs font-bold border border-slate-300 shadow-sm mb-3">
            <MapPin className="w-4 h-4 text-teal-700" />
            <span>Assam & North-East Supply Chain</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f2b48] tracking-tight">
            Regional Distribution Network & <span className="text-teal-700">Assam Supply</span>
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            Supplying medical colleges, multi-specialty hospitals, PCD pharma franchise distributors, and authorized retail stockists across all 35 Assam districts with dependable 24–48 hour dispatch.
          </p>
        </div>

        {/* Regional Assam Hub Switcher */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {ASSAM_REGIONAL_HUBS.map((hub, idx) => (
            <button
              key={hub.id}
              onClick={() => setActiveHubIndex(idx)}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                activeHubIndex === idx
                  ? 'bg-[#0f2b48] text-white border-[#0f2b48] shadow-md font-black'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
              }`}
            >
              <span className="font-mono text-cyan-300 mr-2">0{idx + 1}</span>
              {hub.hubCity}
            </button>
          ))}
        </div>

        {/* Hub Details Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          
          {/* Main Regional Hub Details Card (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-sm flex flex-col justify-between space-y-6">
            
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200">
                  {currentHub.facilityType}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  • Dedicated Assam Corridor
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-[#0f2b48]">
                {currentHub.zone}
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed">
                {currentHub.description}
              </p>
            </div>

            {/* Covered Districts */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-mono font-bold text-[#0f2b48] uppercase tracking-wider block">
                Primary Coverage Districts:
              </span>
              <div className="flex flex-wrap gap-2">
                {currentHub.coverageDistricts.map((district, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-xl bg-white text-slate-800 font-mono text-xs font-semibold border border-slate-200 shadow-2xs"
                  >
                    {district}
                  </span>
                ))}
              </div>
            </div>

            {/* Quality & Transport Assurance */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Logistics & Commercial Benefits:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>District Monopoly Protection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Fast E-Way Bill Transport Clearance</span>
                </div>
              </div>
            </div>

          </div>

          {/* Real-time Regional Delivery Telemetry HUD (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#0f2b48] to-[#0a192f] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col justify-between space-y-6">
            
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center">
                <Truck className="w-4 h-4 mr-1.5 text-cyan-400" />
                Regional Supply Telemetry
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active Supply Route
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 font-mono">
              
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1 font-sans">
                  <Clock className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Dispatch SLA:</span>
                </div>
                <div className="text-base sm:text-lg font-black text-cyan-300">
                  {currentHub.transitTime}
                </div>
                <div className="text-[10px] text-slate-400 font-sans mt-0.5">Direct express cargo</div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1 font-sans">
                  <Building2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Central Depot:</span>
                </div>
                <div className="text-base sm:text-lg font-black text-emerald-300">
                  Guwahati
                </div>
                <div className="text-[10px] text-slate-400 font-sans mt-0.5">Assam Headquarters</div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1 font-sans">
                  <Boxes className="w-3.5 h-3.5 text-amber-300" />
                  <span>Buffer Stock:</span>
                </div>
                <div className="text-base sm:text-lg font-black text-amber-300">
                  100% Ready
                </div>
                <div className="text-[10px] text-slate-400 font-sans mt-0.5">High seasonal demand</div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1 font-sans">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
                  <span>Drug License:</span>
                </div>
                <div className="text-base sm:text-lg font-black text-teal-300">
                  Assam DCA
                </div>
                <div className="text-[10px] text-slate-400 font-sans mt-0.5">Form 25 & 28 Valid</div>
              </div>

            </div>

            {/* Commercial terms */}
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs font-mono space-y-1">
              <span className="text-slate-400 uppercase text-[10px] font-sans">Franchise & Stockist Perks:</span>
              <p className="text-white font-bold">Visual Aids • MR Bags • Catch Covers • Sample Packs</p>
            </div>

            <button
              onClick={() => onOpenEnquiry(`PCD Franchise / Stockist Inquiry for ${currentHub.hubCity}`)}
              className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black py-3 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center space-x-1.5"
            >
              <span>Inquire on Franchise / District Rights</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* 4 Core B2B Supply Channels */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-700 block mb-1">
              Commercial Opportunities
            </span>
            <h4 className="text-2xl sm:text-3xl font-black text-[#0f2b48]">
              Partnership & Supply Models in Assam
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SUPPLY_CHANNELS.map((channel, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-7 border border-slate-300 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#0f2b48]/40 hover:shadow-lg transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200">
                      {channel.badge}
                    </span>
                    <Handshake className="w-5 h-5 text-[#0f2b48]" />
                  </div>
                  <h5 className="text-lg font-black text-[#0f2b48]">
                    {channel.title}
                  </h5>
                  <p className="text-xs font-mono text-teal-700 font-bold">
                    {channel.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {channel.description}
                  </p>
                </div>

                <button
                  onClick={() => onOpenEnquiry(`Inquiry: ${channel.title}`)}
                  className="w-full bg-slate-50 hover:bg-slate-100 text-[#0f2b48] border border-slate-300 text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center space-x-1"
                >
                  <span>Inquire for Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Statutory Regulatory & Drug Authority Compliance */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-300 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-700 block">
                Statutory Compliance
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-[#0f2b48]">
                Assam State Drug Licensing & Standards
              </h4>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Audit-Ready Documentation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STATUTORY_COMPLIANCE_LIST.map((stat, idx) => (
              <div
                key={idx}
                className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#0f2b48]">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{stat.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {stat.description}
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 inline-block self-start mt-2">
                  {stat.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
