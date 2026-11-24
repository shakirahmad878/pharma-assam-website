import React from 'react';
import { Stethoscope, Building2, Hospital, ArrowRight, ShieldCheck, FileText, TrendingUp, CheckCircle2 } from 'lucide-react';

interface PMAudiencePortalsProps {
  onNavigate: (sectionId: string) => void;
  onOpenEnquiry: (context?: string) => void;
}

export const PMAudiencePortals: React.FC<PMAudiencePortalsProps> = ({
  onNavigate,
  onOpenEnquiry
}) => {
  const portals = [
    {
      id: 'hcp',
      title: 'Healthcare Professionals',
      subtitle: 'Clinicians, Physicians & Specialists',
      icon: Stethoscope,
      badge: 'Clinical Evidence',
      badgeColor: 'bg-teal-50 text-[#137F83] border-teal-200',
      description: 'Access scientific monographs, pharmacokinetics, molecular drug release profiles, and digital visual aid flipbooks for all 13 NLCL formulations.',
      points: [
        'Detailed active molecular specifications & dosages',
        'Interactive clinical visual aid flipbook viewer',
        'Prescribing indicators & therapeutic rationale'
      ],
      primaryAction: 'Review Visual Aid',
      primaryActionTarget: 'flipbook',
      secondaryAction: 'View Formulations',
      secondaryActionTarget: 'products',
      cardBorder: 'hover:border-[#18A6A6]'
    },
    {
      id: 'distributor',
      title: 'Stockists & PCD Partners',
      subtitle: 'Distributors, Retailers & PCD Franchise',
      icon: TrendingUp,
      badge: 'Commercial Monopoly',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      description: 'Secure exclusive district-level monopoly distribution rights across Assam and the North-East with attractive margins and prompt regional stock replenishment.',
      points: [
        'Exclusive district-level monopoly franchise rights',
        'Central depot dispatch from Guwahati & Silchar',
        'Transparent wholesale price list & promotional input support'
      ],
      primaryAction: 'Apply for PCD Monopoly',
      primaryActionHandler: () => onOpenEnquiry('Monopoly PCD Franchise Application'),
      secondaryAction: 'Check Product Catalog',
      secondaryActionTarget: 'products',
      cardBorder: 'hover:border-blue-600',
      featured: true
    },
    {
      id: 'institutional',
      title: 'Institutional Procurement',
      subtitle: 'Hospitals, Nursing Homes & Tenders',
      icon: Hospital,
      badge: 'WHO-GMP Compliant',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Streamlined bulk procurement for multi-specialty hospitals, institutional healthcare centers, and government/private rate contract tenders.',
      points: [
        'Batch-specific Certificate of Analysis (CoA) with every lot',
        'Guaranteed tamper-evident Alu-Alu & PET packaging',
        'Scheduled supply agreements with cold-chain compliance'
      ],
      primaryAction: 'Request Institutional RFQ',
      primaryActionHandler: () => onOpenEnquiry('Institutional Hospital Procurement RFQ'),
      secondaryAction: 'Corporate Factsheet',
      secondaryActionTarget: 'about',
      cardBorder: 'hover:border-emerald-600'
    }
  ];

  return (
    <section className="relative bg-[#F8FAFC] py-14 sm:py-20 border-b border-[#DCE4EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-200/70 border border-slate-300 text-[#10243A] text-xs font-bold tracking-wider uppercase">
            <Building2 className="w-3.5 h-3.5 text-[#18A6A6]" />
            <span>Tailored Healthcare Stakeholder Solutions</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#10243A] tracking-tight">
            How NLCL Partners With You
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Whether you are prescribing evidence-based therapies, establishing a high-growth distribution franchise, or securing hospital inventory, NLCL provides dedicated support.
          </p>
        </div>

        {/* 3 Audience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.id}
                className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between p-6 sm:p-8 shadow-xs hover:shadow-xl hover:-translate-y-1.5 relative overflow-hidden group ${
                  portal.featured
                    ? 'border-[#18A6A6] ring-1 ring-[#18A6A6]/20'
                    : 'border-[#DCE4EB]'
                } ${portal.cardBorder}`}
              >
                {portal.featured && (
                  <div className="absolute top-0 right-0 bg-[#18A6A6] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg tracking-wider uppercase">
                    High Demand
                  </div>
                )}

                <div className="space-y-4">
                  {/* Top Bar with Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#18A6A6] group-hover:bg-[#18A6A6] group-hover:text-white transition-colors duration-300 shadow-2xs">
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border ${portal.badgeColor}`}>
                      {portal.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#10243A] group-hover:text-[#18A6A6] transition-colors">
                      {portal.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {portal.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {portal.description}
                  </p>

                  {/* Bullet Points */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700">
                    {portal.points.map((pt, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#18A6A6] shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={() => {
                      if (portal.primaryActionHandler) {
                        portal.primaryActionHandler();
                      } else if (portal.primaryActionTarget) {
                        onNavigate(portal.primaryActionTarget);
                      }
                    }}
                    className="flex-1 bg-[#10243A] hover:bg-[#18A6A6] text-white text-xs font-semibold py-2.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>{portal.primaryAction}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {portal.secondaryAction && (
                    <button
                      onClick={() => portal.secondaryActionTarget && onNavigate(portal.secondaryActionTarget)}
                      className="text-xs font-semibold text-slate-600 hover:text-[#10243A] py-2.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      {portal.secondaryAction}
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
