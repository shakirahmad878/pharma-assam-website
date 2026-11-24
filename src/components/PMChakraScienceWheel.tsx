import React, { useState, useEffect } from 'react';
import { FlaskConical, Dna, ShieldCheck, Truck, Award, Activity, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface PMChakraScienceWheelProps {
  onNavigate: (sectionId: string) => void;
  onOpenEnquiry: (context?: string) => void;
}

export const PMChakraScienceWheel: React.FC<PMChakraScienceWheelProps> = ({
  onNavigate,
  onOpenEnquiry
}) => {
  // 6 Core Scientific R&D & Molecular Milestones placed around the 24-spoke Chakra
  const pillars = [
    {
      id: 'synthesis',
      angle: 0,
      title: 'Active Molecular Synthesis',
      category: 'API Purity & Bio-Availability',
      icon: Dna,
      specs: 'Molecular Assay: ≥ 99.4% • Micronized Crystal Mesh: < 50µm',
      formula: 'C₆H₁₄N₄O₂ (L-Arginine) / C₅₉H₉₀O₄ (CoQ10)',
      description: 'Indigenous synthesis and pre-formulation stability testing of high-potency APIs including L-Arginine, Ubiquinone Co-Q10, Reduced Glutathione, and Marine Lipids.',
      actionLabel: 'View Active Formulations',
      actionTarget: 'products',
      badge: 'High Potency Molecules'
    },
    {
      id: 'hplc',
      angle: 60,
      title: 'Analytical Chromatography (HPLC)',
      category: 'Quality Control & Assay',
      icon: Activity,
      specs: 'HPLC / GC-MS Purity Standards • IP/BP/USP Monographs',
      formula: 'Peak Retention Resolution: Rs > 2.0 • RSD < 1.0%',
      description: 'Precision reverse-phase HPLC chromatography, heavy-metal limit verification (<10 ppm), and FTIR molecular fingerprinting for every manufacturing lot.',
      actionLabel: 'Request Analytical Specs',
      actionContext: 'Analytical Chromatography & HPLC Specs',
      badge: 'IP Standard Assays'
    },
    {
      id: 'cleanrooms',
      angle: 120,
      title: 'WHO-GMP Cleanrooms',
      category: 'Sterility & Environmental Control',
      icon: FlaskConical,
      specs: 'Class 10,000 (ISO Class 7) • Laminar Airflow Grade A/B',
      formula: 'Differential Pressure: +15 Pa • HEPA 99.97% Efficiency',
      description: 'Positive-pressure HEPA-filtered modular suites ensuring non-pyrogenic, sterile tableting, liquid filling, and blister sealing under certified WHO-GMP conditions.',
      actionLabel: 'Inspect Facility Standards',
      actionTarget: 'about',
      badge: 'Certified WHO-GMP'
    },
    {
      id: 'kinetics',
      angle: 180,
      title: 'Dissolution Kinetics & Delivery',
      category: 'Drug Release Dynamics',
      icon: Sparkles,
      specs: 'Gastric Disintegration: < 15 min • Raft Matrix: < 15 sec',
      formula: 'f2 Similarity Factor > 65 • Sustained 24h pH Elevation',
      description: 'Advanced drug delivery platforms engineered for targeted pharmacokinetics, including viscoelastic Alginate Raft gastric barriers and Dual-Phase Enteric micro-pellets.',
      actionLabel: 'Explore 3D Platforms',
      actionTarget: 'products',
      badge: 'Targeted Kinetics'
    },
    {
      id: 'coldchain',
      angle: 240,
      title: 'Northeast Cold-Chain Logistics',
      category: 'GDP Distribution Network',
      icon: Truck,
      specs: 'Central Depots: Guwahati & Silchar • 2°C - 8°C & 15°C - 25°C',
      formula: 'Continuous IoT Data-Logging • 24-48h Regional Reach',
      description: 'Temperature-monitored distribution corridors connecting Mumbai manufacturing with Guwahati Central Depot and Silchar hubs, reaching hospitals across 7 Northeast states.',
      actionLabel: 'Distribution Inquiries',
      actionContext: 'Northeast Distribution & Logistics Inquiry',
      badge: 'GDP Cold-Chain'
    },
    {
      id: 'batchcoa',
      angle: 300,
      title: 'Batch Certification & Compliance',
      category: 'DCGI & Regulatory Assurance',
      icon: ShieldCheck,
      specs: '100% CoA Lot Testing • DCGI / CDSCO Regulated',
      formula: 'Bacterial Endotoxin: < 0.2 EU/mg • Bioburden: Zero CFU',
      description: 'Complete regulatory transparency with lot-specific Certificates of Analysis issued for every supply order delivered to healthcare institutions and pharmacies.',
      actionLabel: 'Request Sample CoA',
      actionContext: 'Batch CoA Certificate Request',
      badge: '100% Tested'
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState(true);

  // Auto rotate through the 6 pillars every 5 seconds
  useEffect(() => {
    if (!isAutoSpinning) return;
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % pillars.length);
      setWheelRotation(prev => prev + 60);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoSpinning, pillars.length]);

  const handleSelectPillar = (index: number) => {
    setIsAutoSpinning(false);
    setActiveIndex(index);
    setWheelRotation(index * 60);
  };

  const currentPillar = pillars[activeIndex];
  const CurrentIcon = currentPillar.icon;

  // Generate 24 spokes for the authentic Ashoka Chakra
  const spokes = Array.from({ length: 24 }, (_, i) => i * 15);

  return (
    <section className="relative bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F6F8] py-16 sm:py-24 border-b border-[#DCE4EB] overflow-hidden">
      
      {/* Background Precision Hexagonal & Circular Watermark */}
      <div className="absolute inset-0 bg-[radial-gradient(#0A2540_0.75px,transparent_0.75px)] [background-size:28px_28px] opacity-10 pointer-events-none" />
      
      {/* Ambient Blue Glow */}
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20 space-y-3.5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 shadow-2xs">
            <span className="text-sm">🇮🇳</span>
            <span className="text-xs font-black tracking-wider uppercase text-[#0B2545]">
              Make in India • Pharmaceutical Excellence
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#18A6A6]" />
            <span className="text-[11px] font-bold text-[#18A6A6]">24/7 Precision Cycle</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#10243A] tracking-tight">
            The Scientific Chakra:{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B2545] via-[#137F83] to-[#18A6A6]">
              24 Spokes of Molecular Precision
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Inspired by India's timeless emblem of continuous progress and human service, our 24-spoke scientific cycle governs every phase—from raw active molecule synthesis in certified cleanrooms to cold-chain delivery across Assam and the Northeast.
          </p>
        </div>

        {/* The Chakra Wheel + Laboratory Console Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left: The Interactive 24-Spoke Ashoka Chakra Wheel */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            
            <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] flex items-center justify-center select-none">
              
              {/* Outer Ring with 24 Pulsing Beads */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#0B2545]/20 animate-spin-slow pointer-events-none" style={{ animationDuration: '60s' }} />

              {/* The Rotating Ashoka Chakra SVG */}
              <div 
                className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] transition-transform duration-1000 ease-out"
                style={{ transform: `rotate(${wheelRotation}deg)` }}
              >
                <svg
                  viewBox="0 0 300 300"
                  className="w-full h-full drop-shadow-[0_15px_30px_rgba(11,37,69,0.22)]"
                >
                  <defs>
                    <radialGradient id="chakraHubGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#18A6A6" />
                      <stop offset="60%" stopColor="#0B2545" />
                      <stop offset="100%" stopColor="#061528" />
                    </radialGradient>
                    <linearGradient id="spokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#18A6A6" />
                      <stop offset="50%" stopColor="#0B2545" />
                      <stop offset="100%" stopColor="#081D36" />
                    </linearGradient>
                  </defs>

                  {/* Outer Rim Double Circles */}
                  <circle cx="150" cy="150" r="140" fill="none" stroke="#0B2545" strokeWidth="6" />
                  <circle cx="150" cy="150" r="132" fill="none" stroke="#18A6A6" strokeWidth="1.5" strokeDasharray="3 3" />

                  {/* 24 Outer Rim Circlets/Beads */}
                  {spokes.map((deg, i) => {
                    const rad = (deg * Math.PI) / 180;
                    const bx = 150 + 136 * Math.cos(rad);
                    const by = 150 + 136 * Math.sin(rad);
                    return (
                      <circle
                        key={`bead-${i}`}
                        cx={bx}
                        cy={by}
                        r="2.5"
                        fill="#0B2545"
                      />
                    );
                  })}

                  {/* Inner Spoke Rim */}
                  <circle cx="150" cy="150" r="42" fill="none" stroke="#0B2545" strokeWidth="4" />
                  <circle cx="150" cy="150" r="38" fill="none" stroke="#18A6A6" strokeWidth="1" />

                  {/* 24 Precision Ashoka Tapered Spokes */}
                  {spokes.map((deg, i) => {
                    const isMilestone = i % 4 === 0;
                    return (
                      <g key={`spoke-${i}`} transform={`rotate(${deg} 150 150)`}>
                        {/* Tapered triangular spoke */}
                        <polygon
                          points="148.5,150 151.5,150 150.8,20 149.2,20"
                          fill={isMilestone ? "url(#spokeGrad)" : "#0B2545"}
                          opacity={isMilestone ? 0.95 : 0.65}
                        />
                        {/* Spoke apex diamond/teardrop */}
                        <circle cx="150" cy="22" r={isMilestone ? "3" : "2"} fill="#18A6A6" />
                      </g>
                    );
                  })}

                  {/* Central Hub Disc with Concentric Rings */}
                  <circle cx="150" cy="150" r="32" fill="url(#chakraHubGrad)" stroke="#FFFFFF" strokeWidth="2.5" />
                  <circle cx="150" cy="150" r="14" fill="#FFFFFF" opacity="0.9" />
                  <circle cx="150" cy="150" r="7" fill="#0B2545" />
                </svg>
              </div>

              {/* Central Static Logo/Emblem Badge Overlay */}
              <div className="absolute w-20 h-20 rounded-full bg-white/95 backdrop-blur-md border-2 border-[#0B2545] shadow-lg flex flex-col items-center justify-center p-1 pointer-events-none">
                <span className="text-[10px] font-black text-[#0B2545] tracking-tight leading-none text-center">
                  NLCL
                </span>
                <span className="text-[8px] font-bold text-[#18A6A6] uppercase tracking-wider mt-0.5">
                  INDIA
                </span>
                <span className="text-[7px] text-slate-500 font-mono mt-0.5">
                  24 SPOKES
                </span>
              </div>

              {/* 6 Orbiting Milestone Buttons Around the Wheel */}
              {pillars.map((pillar, idx) => {
                const rad = ((pillar.angle - 90) * Math.PI) / 180;
                // Radius for orbit buttons
                const dist = 175;
                const top = 50 + (dist / 2) * Math.sin(rad);
                const left = 50 + (dist / 2) * Math.cos(rad);
                const Icon = pillar.icon;
                const isActive = activeIndex === idx;

                return (
                  <button
                    key={pillar.id}
                    onClick={() => handleSelectPillar(idx)}
                    title={pillar.title}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer ${
                      isActive
                        ? 'bg-[#0B2545] text-white ring-4 ring-[#18A6A6]/40 scale-110 z-20'
                        : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-[#0B2545] border border-slate-200 z-10'
                    }`}
                    style={{
                      top: `${top}%`,
                      left: `${left}%`
                    }}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    {isActive && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#18A6A6] ring-2 ring-white animate-ping" />
                    )}
                  </button>
                );
              })}

            </div>

            {/* Quick Interactive Controller & Spoke Legend */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {pillars.map((pillar, idx) => (
                <button
                  key={`pill-${pillar.id}`}
                  onClick={() => handleSelectPillar(idx)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    activeIndex === idx
                      ? 'bg-[#0B2545] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {pillar.title.split(' ')[0]}
                </button>
              ))}
              <button
                onClick={() => setIsAutoSpinning(!isAutoSpinning)}
                className="text-[11px] text-slate-500 hover:text-slate-800 underline ml-2"
              >
                {isAutoSpinning ? 'Pause Rotation' : 'Auto Rotate'}
              </button>
            </div>

          </div>

          {/* Right: The Active Molecular & Laboratory Data Console */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl border border-[#DCE4EB] shadow-xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
              
              {/* Subtle Corner Background Watermark */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Console Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0B2545]">
                    <CurrentIcon className="w-6 h-6 text-[#18A6A6]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-[#137F83] tracking-wider block">
                      Spoke {activeIndex + 1} of 24 Precision Stages
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-[#10243A]">
                      {currentPillar.title}
                    </h3>
                  </div>
                </div>

                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#0B2545] border border-blue-200 hidden sm:inline-block">
                  {currentPillar.badge}
                </span>
              </div>

              {/* Laboratory Quality Spec Box */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>Pharmacopoeial Specification</span>
                  <span className="text-[#137F83] font-mono">IP / WHO-GMP Verified</span>
                </div>
                <div className="text-sm font-mono font-bold text-[#10243A]">
                  {currentPillar.specs}
                </div>
                <div className="text-xs font-mono text-slate-500 border-t border-slate-200 pt-1.5">
                  Formula / Kinetics: <strong className="text-[#0B2545]">{currentPillar.formula}</strong>
                </div>
              </div>

              {/* Detailed Scientific Description */}
              <p className="text-sm text-slate-600 leading-relaxed">
                {currentPillar.description}
              </p>

              {/* Scientific Rationale Highlights */}
              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#18A6A6] shrink-0 mt-0.5" />
                  <span>Complies with Indian Pharmacopoeia (IP) and CDSCO / DCGI regulatory standards.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#18A6A6] shrink-0 mt-0.5" />
                  <span>Validated by chromatography, microbial limit assays, and batch stability chamber testing.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#18A6A6] shrink-0 mt-0.5" />
                  <span>Manufactured for regional climate endurance across Assam and North-East India.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => {
                    if (currentPillar.actionContext) {
                      onOpenEnquiry(currentPillar.actionContext);
                    } else if (currentPillar.actionTarget) {
                      onNavigate(currentPillar.actionTarget);
                    }
                  }}
                  className="bg-[#0B2545] hover:bg-[#18A6A6] text-white text-xs font-bold py-3 px-5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>{currentPillar.actionLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-[11px] text-slate-400 font-mono">
                  Sovereign Standards • Made in India
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
