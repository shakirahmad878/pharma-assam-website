import React from 'react';
import { ShieldCheck, Truck, Award, Target, Compass, HeartHandshake } from 'lucide-react';
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
    { label: 'Nature of Business', value: 'Manufacturer & Supplier' },
    { label: 'Number of Employees', value: '10+ Industry Professionals' },
    { label: 'Year of Establishment', value: '2023' },
    { label: 'Market Covered', value: 'Assam, North-East & Pan-India' },
    { label: 'Name of Directors', value: '1. Mrs. Anupriya Deb | 2. Sandeep Kumar Mollick | 3. Priya Banik' },
    { label: 'GST No', value: COMPANY_CONFIG.registrationNumber.replace('GST: ', '') },
    { label: 'Legal Status of Firm', value: 'Private Limited Company (Limited by Shares)' },
    { label: 'Registered Address', value: COMPANY_CONFIG.registeredAddress }
  ];

  return (
    <section id="about" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section 1: Official Corporate Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#c72828] rounded-full"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#c72828]">
                Corporate Profile
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#163e61] tracking-tight leading-tight">
              Progressive Molecules <span className="text-[#c72828]">Pvt. Ltd.</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
              <span className="font-bold text-[#163e61]">Progressive Molecules Pvt. Ltd.</span> is a thriving and prominent manufacturer and supplier of superior quality pharmaceutical products. We understand the clinical and therapeutic needs of patients and medical practitioners, focusing on delivering reliable therapeutic solutions to diverse conditions and infections.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              We leverage innovative pharmaceutical research and technology to manufacture high-quality medicines. Sourcing superior grade active pharmaceutical ingredients (APIs) and raw materials from audited vendors, all products are manufactured under strict supervision of experienced professionals and distributed at competitive, customer-friendly rates.
            </p>

            {/* Product Assurance & Distribution Highlight Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-[#c72828]">
                  <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                  <h4 className="font-bold text-sm text-[#163e61]">Product Assurance</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We manufacture pharmaceutical capsules, syrups, tablets, and injectables ensuring highest safety, purity, and efficacy. Stringent in-process and finished product quality checks safeguard patient compliance.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-[#163e61]">
                  <Truck className="w-5 h-5 flex-shrink-0" />
                  <h4 className="font-bold text-sm text-[#163e61]">Distribution Network</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We offer outstanding quality products throughout Assam, North-East, Maharashtra, and pan-India through dedicated channel partners, ensuring timely delivery within stipulated timeframes.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenEnquiry}
                className="bg-[#c72828] hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition-colors"
              >
                Send Direct Requirement
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="bg-[#163e61] hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition-colors"
              >
                View Corporate Offices
              </button>
            </div>

          </div>

          {/* Right Column: Company Factsheet Table (Direct Replica of progressivemolecules.in) */}
          <div className="lg:col-span-5">
            <div className="bg-slate-50 border-2 border-[#163e61]/20 rounded-2xl p-6 shadow-lg">
              
              <div className="border-b border-slate-200 pb-3 mb-4">
                <h3 className="text-lg font-bold text-[#163e61] flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#c72828]" />
                  Company Profile & Factsheet
                </h3>
                <p className="text-xs text-slate-500">Official statutory & business details</p>
              </div>

              <div className="divide-y divide-slate-200 text-xs">
                {companyProfileRows.map((row, idx) => (
                  <div key={idx} className="py-2.5 grid grid-cols-12 gap-2">
                    <span className="col-span-5 font-bold text-slate-600">{row.label}</span>
                    <span className="col-span-7 font-semibold text-slate-900 leading-tight">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 text-center">
                <span className="inline-block bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full">
                  ✓ Verified Corporate Entity & Active GST
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Section 2: Vision, Mission & Values (Exact replica of official site cards) */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-black text-[#163e61]">
              Our Guiding Principles
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Committed to ethical pharmaceutical excellence, therapeutic reliability, and patient well-being.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Vision */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 text-center space-y-3 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 mx-auto rounded-full bg-red-100 text-[#c72828] flex items-center justify-center">
                <Target className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-[#163e61]">Our Vision</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                To emerge as one of the most trusted and progressive pharmaceutical enterprises, delivering quality formulations that enrich patient health and clinical outcomes.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 text-center space-y-3 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 mx-auto rounded-full bg-blue-100 text-[#163e61] flex items-center justify-center">
                <Compass className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-[#163e61]">Our Mission</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                To provide safe, efficacious, and affordable pharmaceutical products through strict regulatory adherence, continuous research, and reliable supply networks.
              </p>
            </div>

            {/* Values */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 text-center space-y-3 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-[#163e61]">Core Values</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Uncompromising quality integrity, ethical commercial transparency, clinical reliability, and enduring commitment to patient care and partner success.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
