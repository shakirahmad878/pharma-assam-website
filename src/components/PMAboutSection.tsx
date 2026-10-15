import React from 'react';
import { ShieldCheck, Truck, Award, Target, Compass, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyConfig';

interface PMAboutSectionProps {
  onOpenEnquiry: () => void;
  onNavigate: (sectionId: string) => void;
}

export const PMAboutSection: React.FC<PMAboutSectionProps> = ({
  onOpenEnquiry,
  onNavigate
}) => {
  const companyProfileRows = [
    { label: 'Nature of Business', value: 'Pharmaceutical Manufacturer & Regional Supplier' },
    { label: 'Operational Focus', value: 'Assam & North-East Healthcare Supply Chain' },
    { label: 'Regulatory Compliance', value: 'WHO-GMP & State Drug Control Standard' },
    { label: 'Markets Served', value: COMPANY_CONFIG.marketsServed },
    { label: 'Corporate Management', value: COMPANY_CONFIG.directors },
    { label: 'Registration & GSTIN', value: COMPANY_CONFIG.registrationNumber },
    { label: 'Quality Standards', value: 'IP / BP / USP Monograph Compliance' },
    { label: 'Central Depot & HQ', value: COMPANY_CONFIG.registeredAddress }
  ];

  return (
    <section id="about" className="py-16 bg-[#F5F8FA] border-b border-[#DCE4EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section 1: Corporate Narrative & Factsheet */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#18A6A6] rounded-full"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#137F83]">
                Corporate Profile & Factsheet
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#10243A] tracking-tight leading-tight">
              {COMPANY_CONFIG.name}
            </h2>

            <p className="text-sm sm:text-base text-[#1E293B] leading-relaxed font-medium">
              <strong className="text-[#10243A]">{COMPANY_CONFIG.name}</strong> is an established regional pharmaceutical manufacturing and distribution enterprise dedicated to supplying superior, WHO-GMP compliant therapeutics. We address clinical requirements across Assam and the North-East, prioritizing therapeutic reliability, stability, and ethical commercial partnerships.
            </p>

            <p className="text-sm text-[#64748B] leading-relaxed">
              Our formulations incorporate tested APIs from audited suppliers. Each batch undergoes rigorous physicochemical and microbiological assays to comply with Indian Pharmacopoeia (IP) standards and state drug licensing norms.
            </p>

            {/* Product Assurance & Distribution Highlight Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white border border-[#DCE4EB] rounded-xl p-4 space-y-2 shadow-2xs">
                <div className="flex items-center gap-2 text-[#18A6A6]">
                  <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                  <h4 className="font-bold text-sm text-[#10243A]">Quality Assurance</h4>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Every dosage form—capsules, syrups, tablets, and injectables—is released with batch certificates guaranteeing sterility, stability, and dissolution kinetics.
                </p>
              </div>

              <div className="bg-white border border-[#DCE4EB] rounded-xl p-4 space-y-2 shadow-2xs">
                <div className="flex items-center gap-2 text-[#10243A]">
                  <Truck className="w-5 h-5 flex-shrink-0 text-[#18A6A6]" />
                  <h4 className="font-bold text-sm text-[#10243A]">Regional Logistics Network</h4>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Guwahati central depot and authorized regional partners ensure rapid, temperature-monitored transit across all Assam districts and neighboring states.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenEnquiry}
                className="bg-[#18A6A6] hover:bg-[#137F83] text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-2xs transition-colors cursor-pointer"
              >
                Inquire Commercial MOQ
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="bg-[#10243A] hover:bg-[#182F49] text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-2xs transition-colors cursor-pointer"
              >
                View Regional Depot & Hub
              </button>
            </div>

          </div>

          {/* Right Column: Company Factsheet Table */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#DCE4EB] rounded-2xl p-6 shadow-sm">
              
              <div className="border-b border-[#DCE4EB] pb-3 mb-4">
                <h3 className="text-base font-bold text-[#10243A] flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#18A6A6]" />
                  Corporate Factsheet & Credentials
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">Licensed pharmaceutical distribution metrics</p>
              </div>

              <div className="divide-y divide-[#F1F6F8] text-xs">
                {companyProfileRows.map((row, idx) => (
                  <div key={idx} className="py-2.5 grid grid-cols-12 gap-2">
                    <span className="col-span-5 font-semibold text-[#64748B]">{row.label}</span>
                    <span className="col-span-7 font-medium text-[#1E293B] leading-tight">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-[#DCE4EB] text-center">
                <span className="inline-flex items-center gap-1.5 bg-teal-50 text-[#137F83] border border-teal-200 text-[11px] font-semibold px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Regulatory & Supply Standing
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Section 2: Vision, Mission & Values */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-[#10243A]">
              Our Guiding Principles
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Committed to ethical pharmaceutical excellence, therapeutic reliability, and patient well-being.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Vision */}
            <div className="bg-white rounded-xl border border-[#DCE4EB] p-6 text-center space-y-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto rounded-xl bg-[#E8EEF4] text-[#10243A] flex items-center justify-center">
                <Target className="w-6 h-6 text-[#18A6A6]" />
              </div>
              <h4 className="text-base font-bold text-[#10243A]">Our Vision</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                To stand as the most dependable pharmaceutical partner across the North-East, delivering high-integrity formulations that enrich clinical outcomes.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white rounded-xl border border-[#DCE4EB] p-6 text-center space-y-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto rounded-xl bg-[#E8EEF4] text-[#10243A] flex items-center justify-center">
                <Compass className="w-6 h-6 text-[#10243A]" />
              </div>
              <h4 className="text-base font-bold text-[#10243A]">Our Mission</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                To provide safe, efficacious, and accessible healthcare solutions through uncompromising regulatory adherence and consistent regional supply.
              </p>
            </div>

            {/* Values */}
            <div className="bg-white rounded-xl border border-[#DCE4EB] p-6 text-center space-y-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto rounded-xl bg-[#E8EEF4] text-[#137F83] flex items-center justify-center">
                <HeartHandshake className="w-6 h-6 text-[#18A6A6]" />
              </div>
              <h4 className="text-base font-bold text-[#10243A]">Core Values</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Uncompromising pharmaceutical integrity, commercial transparency, medical practitioner support, and patient-centric dedication.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
