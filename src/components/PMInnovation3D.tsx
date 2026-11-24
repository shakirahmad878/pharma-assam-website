import React, { useState } from 'react';
import { 
  Dna, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  FlaskConical, 
  CheckCircle2, 
  ArrowRight,
  Microscope,
  Pill
} from 'lucide-react';
import { MolecularCanvas3D } from './3d/MolecularCanvas3D';

interface PMInnovation3DProps {
  onOpenEnquiry: (productName?: string) => void;
  onNavigate: (sectionId: string) => void;
}

export const PMInnovation3D: React.FC<PMInnovation3DProps> = ({
  onOpenEnquiry,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const technologies = [
    {
      id: 'alginate-raft',
      title: 'Alginate Raft Barrier Matrix',
      subtitle: 'Targeted Mechanical GERD Protection',
      productName: 'Lifekr-Raft Oral Suspension',
      badge: 'Immediate Physical Barrier',
      icon: Layers,
      accentColor: '#18A6A6',
      description:
        'Upon contact with gastric hydrochloric acid, sodium alginate rapidly polymerizes into a low-density, highly cohesive viscous gel raft that floats above stomach contents. This mechanical barrier prevents acid and pepsin reflux into the esophagus within seconds.',
      specifications: [
        { label: 'Onset Velocity', value: '< 15 Seconds' },
        { label: 'Barrier Duration', value: 'Up to 4 Hours' },
        { label: 'Gestational Safety', value: 'Trimester 1-3 Safe' },
        { label: 'Active Matrix', value: 'Sodium Alginate + Bicarbonate' },
      ],
      mechanismPoints: [
        'Forms a buoyant protective layer floating on gastric chyme',
        'Directly neutralizes acid while trapping CO2 bubbles to preserve floatation',
        'Provides mucosal cytoprotection without disrupting systemic acid-base balance',
      ],
    },
    {
      id: 'enteric-pellets',
      title: 'Dual-Phase Multi-Unit Pellets',
      subtitle: 'Synchronized Duodenal & Gastric Delivery',
      productName: 'Esomax D40 Capsules',
      badge: 'Chronotherapeutic Kinetics',
      icon: Pill,
      accentColor: '#0EA5E9',
      description:
        'Engineered with micro-encapsulated enteric-coated Esomeprazole pellets combined with sustained-release Domperidone beads. Prevents gastric acid destruction of Esomeprazole while simultaneously sustaining upper GI prokinetic motility throughout 24 hours.',
      specifications: [
        { label: 'Acid Protection', value: 'pH 1.2 Resistant' },
        { label: 'Duodenal Dissolution', value: 'pH 6.8 Immediate' },
        { label: 'Motility Sustained', value: '24-Hour Continuous' },
        { label: 'Barrier Pack', value: 'Alu-Alu Cold-Form' },
      ],
      mechanismPoints: [
        'Shields acid-labile proton pump inhibitor through acidic gastric passage',
        'Enhances antral and duodenal contractions to promote gastric emptying',
        'Uniform micro-pellet dispersion minimizes localized mucosal irritation',
      ],
    },
    {
      id: 'nano-omega',
      title: 'Molecular Distilled Lipid Fractionation',
      subtitle: 'Ultra-Pure High EPA/DHA Bioavailability',
      productName: 'Life-KR Softgel & Syrup',
      badge: '99.4% Lipid Purity',
      icon: FlaskConical,
      accentColor: '#10B981',
      description:
        'Triple-stage vacuum molecular distillation separates pure eicosapentaenoic acid (EPA) and docosahexaenoic acid (DHA) at low thermal thresholds. Eliminates heavy metals, polychlorinated biphenyls (PCBs), and oxidative peroxides for optimal cellular absorption.',
      specifications: [
        { label: 'Total Omega-3', value: '1300 mg / Capsule' },
        { label: 'EPA Potency', value: '550 mg (42.3%)' },
        { label: 'DHA Potency', value: '350 mg (26.9%)' },
        { label: 'Heavy Metal Purity', value: '< 0.01 ppm' },
      ],
      mechanismPoints: [
        'Direct incorporation into myocardial and neuronal cellular lipid bilayers',
        'Suppresses pro-inflammatory eicosanoids and downregulates triglyceride synthesis',
        'Enteric-friendly encapsulation ensures zero unpleasant reflux or odor',
      ],
    },
    {
      id: 'glutathione-redox',
      title: 'Cellular Redox Tripeptide Matrix',
      subtitle: 'Bio-Regenerating Reduced L-Glutathione',
      productName: 'Glutavia-500 Tablets',
      badge: 'Cellular Detox & Rejuvenation',
      icon: Dna,
      accentColor: '#6366F1',
      description:
        'Pharmaceutical-grade reduced L-Glutathione paired with high-dose Ascorbic Acid (Vitamin C). Directs melanogenesis from dark eumelanin toward light pheomelanin while accelerating hepatic Phase II sulfoconjugation to purge oxidative free radicals.',
      specifications: [
        { label: 'Active Molecule', value: '500 mg Reduced Glutathione' },
        { label: 'Redox Co-Factor', value: '80 mg Ascorbic Acid' },
        { label: 'Enzymatic Target', value: 'Tyrosinase Inhibition' },
        { label: 'Hepatic Pathway', value: 'Phase-II Conjugation' },
      ],
      mechanismPoints: [
        'Neutralizes reactive oxygen species (ROS) and cellular DNA-damaging radicals',
        'Vitamin C continuously recycles oxidized glutathione back to active reduced state',
        'Enhances dermal fibroblast collagen density and evens persistent pigmentation',
      ],
    },
  ];

  const currentTech = technologies[activeTab];
  const IconComponent = currentTech.icon;

  return (
    <section className="py-20 bg-[#0B1E33] text-white relative overflow-hidden border-b border-[#182F49] select-none">
      
      {/* 3D Molecular Lattice Interactive Background */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <MolecularCanvas3D className="w-full h-full" nodeCount={36} interactive={true} />
      </div>

      {/* Subtle Radial Lighting Highlights */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#18A6A6]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#18A6A6]/20 border border-[#18A6A6]/40 text-[#00E5C9] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-md">
            <Microscope className="w-4 h-4 text-[#00E5C9]" />
            <span>Formulation Science & Pharmacokinetics</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Advanced 3D Drug Delivery Platforms
          </h2>
          
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Precision engineering at the molecular level ensuring superior gastrointestinal stability, accelerated therapeutic bioavailability, and strict IP/USP monograph reproducibility.
          </p>
        </div>

        {/* 4 Technology Selector Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
          {technologies.map((tech, idx) => {
            const TabIcon = tech.icon;
            const isSelected = activeTab === idx;
            return (
              <button
                key={tech.id}
                onClick={() => setActiveTab(idx)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white/15 border-[#00E5C9] shadow-[0_10px_30px_rgba(0,229,201,0.2)] backdrop-blur-md scale-[1.02]'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-[#18A6A6] text-white' : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    <TabIcon className="w-5 h-5" />
                  </div>
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#00E5C9] animate-pulse' : 'bg-slate-600'}`} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                    {tech.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 truncate">
                    {tech.productName}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* 3D Interactive Technology Detail Stage */}
        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-white/15 p-6 sm:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
          
          {/* Left Column: Pharmacological Narrative & Specs */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00E5C9] uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                {currentTech.badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {currentTech.title}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-300">
                Core NLCL Carrier: <span className="text-[#00E5C9]">{currentTech.productName}</span>
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {currentTech.description}
            </p>

            {/* 4 Quantitative Pharmacokinetic Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {currentTech.specifications.map((spec, sIdx) => (
                <div
                  key={sIdx}
                  className="bg-white/5 border border-white/10 rounded-xl p-3 text-center backdrop-blur-sm"
                >
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {spec.label}
                  </p>
                  <p className="text-xs sm:text-sm font-black text-white mt-1">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Mechanism of Action Bullets */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pharmacological Action Profile:
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {currentTech.mechanismPoints.map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00E5C9] flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action CTA */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenEnquiry(currentTech.productName)}
                className="bg-[#18A6A6] hover:bg-[#137F83] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Request Clinical Dossier & MOQ</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('products')}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-4 py-2.5 rounded-xl border border-white/20 transition-all cursor-pointer"
              >
                Explore Formulation in Catalog
              </button>
            </div>

          </div>

          {/* Right Column: 3D Holographic Molecular Core Display */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/20 p-6 flex flex-col items-center justify-center text-center shadow-[0_25px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden group">
              
              {/* Animated 3D Floating Pulse */}
              <div className="w-40 h-40 rounded-full bg-[#18A6A6]/20 blur-2xl absolute animate-pulse pointer-events-none" />

              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#18A6A6] to-[#0B1E33] flex items-center justify-center text-[#00E5C9] shadow-xl border border-white/30 my-4 relative z-10 group-hover:scale-110 transition-transform duration-500">
                <IconComponent className="w-10 h-10" />
              </div>

              <span className="text-[11px] font-bold text-[#00E5C9] uppercase tracking-widest relative z-10">
                Bio-Optimized Monograph
              </span>
              
              <h4 className="text-lg font-bold text-white mt-1 relative z-10">
                {currentTech.productName}
              </h4>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed relative z-10 px-2">
                Conforms strictly to Indian Pharmacopoeia (IP) dissolution & bioequivalence criteria.
              </p>

              <div className="mt-5 pt-4 border-t border-white/10 w-full flex items-center justify-between text-[11px] text-slate-400 relative z-10">
                <span className="flex items-center gap-1 font-semibold text-white">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00E5C9]" />
                  WHO-GMP Facility
                </span>
                <span className="font-mono text-emerald-400 font-bold">
                  Assay: 99.4%
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
