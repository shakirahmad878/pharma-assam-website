import React, { useState } from 'react';
import { 
  Send, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Download, 
  Building2, 
  Globe 
} from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyConfig';
import { PRODUCTS } from '../data/products';

export const EditorialContact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    phone: '',
    country: 'Assam',
    inquiryType: 'PCD Pharma Franchise (District Monopoly)',
    targetProduct: PRODUCTS[0].name,
    batchQuantity: '25,000 Units',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <section id="contact" className="py-24 bg-white border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-slate-100 text-[#0f2b48] px-4 py-1.5 rounded-full text-xs font-bold border border-slate-300 shadow-sm mb-3">
            <Mail className="w-4 h-4 text-teal-700" />
            <span>Direct B2B Procurement Portal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f2b48] tracking-tight">
            Institutional RFP & <span className="text-teal-700">Partnership RFQ</span>
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            Submit your commercial tender specifications, contract formulation requirements, or export distribution proposals directly to our corporate procurement committee.
          </p>
        </div>

        {/* Split Screen Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Corporate Dossier & Contact Credentials (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0f2b48] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 flex flex-col justify-between space-y-8">
            
            <div className="space-y-6">
              
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 block mb-1">
                  Global Headquarters & Plant
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {COMPANY_CONFIG.name}
                </h3>
                <p className="text-xs text-slate-300 mt-2 font-mono">
                  Corporate Reg. ID: <strong className="text-white">{COMPANY_CONFIG.registrationNumber}</strong>
                </p>
              </div>

              {/* Contact Information Points */}
              <div className="space-y-4 text-xs font-mono">
                <div className="flex items-start space-x-3 text-slate-300">
                  <MapPin className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-sans">Manufacturing Facility & Office:</strong>
                    <span className="leading-relaxed">{COMPANY_CONFIG.headquarters}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-slate-300">
                  <Mail className="w-4 h-4 text-teal-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-sans">Procurement & Export Inquiries:</strong>
                    <a href={`mailto:${COMPANY_CONFIG.email}`} className="text-cyan-200 hover:underline">
                      {COMPANY_CONFIG.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-slate-300">
                  <Phone className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-sans">Institutional Direct Desk:</strong>
                    <a href={`tel:${COMPANY_CONFIG.phone}`} className="text-white hover:underline">
                      {COMPANY_CONFIG.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-slate-300">
                  <Clock className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-sans">Business Desk Hours:</strong>
                    <span>{COMPANY_CONFIG.operatingHours}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Corporate Assurance Box */}
            <div className="p-4 bg-white/10 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-300">
                <ShieldCheck className="w-4 h-4" />
                <span>NDA & Confidentiality Assured</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                All formulation inquiries and RFP documentation are covered under our binding Non-Disclosure Agreement (NDA) protocol.
              </p>
            </div>

          </div>

          {/* Right Column: Institutional RFQ Form (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-300 shadow-sm">
            
            {isSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-[#0f2b48]">
                  RFQ Requisition Received
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>. Your commercial requisition ticket has been assigned to our senior technical sales officer. We will review your specifications and reply within <strong>24 business hours</strong>.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-[#0f2b48] hover:bg-[#0a192f] text-white text-xs font-bold px-6 py-3 rounded-xl transition-all"
                >
                  Submit Another Requisition
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Alex Mercer / Procurement Director"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0f2b48]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                      Company / Organization *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Health Distribution Ltd."
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0f2b48]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="procurement@organization.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0f2b48]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0f2b48]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                      Inquiry Category *
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0f2b48]"
                    >
                      <option value="PCD Pharma Franchise (District Monopoly)">PCD Pharma Franchise (District Monopoly)</option>
                      <option value="Hospital & Medical College Supply (GMCH, AMCH, etc.)">Hospital & Medical College Supply (GMCH, AMCH, etc.)</option>
                      <option value="Third-Party Contract Manufacturing (P2P)">Third-Party Contract Manufacturing (P2P)</option>
                      <option value="Stockist & Retail Chemist Supply">Stockist & Retail Chemist Supply</option>
                      <option value="Tea Estate & Institutional Healthcare Supply">Tea Estate & Institutional Healthcare Supply</option>
                      <option value="Sample Product Monograph & Dossier Request">Sample Product Monograph & Dossier Request</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                      Target District / State (Assam / NE) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kamrup Metro (Guwahati), Dibrugarh, Silchar, Jorhat, Tezpur, Meghalaya..."
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0f2b48]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                      Product Formulation of Interest:
                    </label>
                    <select
                      value={formData.targetProduct}
                      onChange={(e) => setFormData({ ...formData, targetProduct: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0f2b48]"
                    >
                      {PRODUCTS.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} ({p.dosageForm})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                      Target Batch Volume:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 50,000 Boxes / Annual Contract"
                      value={formData.batchQuantity}
                      onChange={(e) => setFormData({ ...formData, batchQuantity: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0f2b48]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                    Technical Specifications / Packaging Notes:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide details on target pharmacopeial standard, packaging preference, delivery timeline, or regulatory registration assistance..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0f2b48]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0f2b48] hover:bg-[#0a192f] text-white font-black py-4 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <span>Transmitting Encrypted RFQ...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-cyan-300" />
                      <span>Submit Commercial RFQ Requisition</span>
                    </>
                  )}
                </button>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
