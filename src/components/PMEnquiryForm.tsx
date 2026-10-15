import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, Phone, Mail, User, Hash, HelpCircle, PackageCheck } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { COMPANY_CONFIG } from '../data/companyConfig';

interface PMEnquiryFormProps {
  defaultProduct?: string;
}

export const PMEnquiryForm: React.FC<PMEnquiryFormProps> = ({ defaultProduct }) => {
  const [selectedProductName, setSelectedProductName] = useState(defaultProduct || PRODUCTS[0].name);
  const currentProduct = PRODUCTS.find(p => p.name === selectedProductName) || PRODUCTS[0];
  
  const [quantity, setQuantity] = useState(500);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const unit = currentProduct.unit || 'Pack';
  const moqInfo = currentProduct.moq || '500 Units';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleWhatsAppInquiry = () => {
    const text = `*MOQ & Product Enquiry for ${selectedProductName}*\n*Standard MOQ:* ${moqInfo}\n*Target Enquiry Quantity:* ${quantity} ${unit}\n*Name:* ${name || 'Prospective Partner'}\n*Phone:* ${phone || 'N/A'}\n*Email:* ${email || 'N/A'}\n*Enquiry Notes:* ${message || 'Please provide MOQ details, batch quotation, and distributor terms.'}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="enquiry" className="py-16 bg-[#F5F8FA] border-b border-[#DCE4EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-2xl border border-[#DCE4EB] shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column: MOQ Information & Statutory Assurance */}
            <div className="lg:col-span-5 bg-[#10243A] text-white p-8 sm:p-10 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="inline-block bg-[#182F49] text-[#18A6A6] border border-slate-700 text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                  Commercial B2B Supply
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                  Formulation & MOQ Requirement Inquiry
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Connect with our institutional desk regarding <strong>Minimum Order Quantities (MOQ)</strong>, batch manufacturing lead times, hospital rate contracts, and regional stockist allocations.
                </p>

                {/* Live Selected Molecule MOQ Card */}
                <div className="bg-[#182F49] border border-slate-700 p-4 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#18A6A6]">
                    <PackageCheck className="w-4 h-4 text-[#18A6A6]" />
                    <span>Selected Molecule Standard MOQ</span>
                  </div>
                  <p className="text-sm font-bold text-white mt-1">{currentProduct.name}</p>
                  <p className="text-xs text-teal-300 font-semibold">Standard Commercial MOQ: {moqInfo}</p>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#18A6A6]" />
                    <span>Trade Desk: <strong className="text-white">{COMPANY_CONFIG.phone}</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#18A6A6]" />
                    <span>Email: <strong className="text-white">{COMPANY_CONFIG.email}</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Hash className="w-4 h-4 text-[#18A6A6]" />
                    <span>GSTIN: <strong className="text-white">{COMPANY_CONFIG.registrationNumber.replace('GST: ', '')}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800">
                <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-[#18A6A6] flex-shrink-0" />
                  <span>Trade portal reserved for licensed pharmaceutical distributors, stockists, and hospital pharmacies.</span>
                </p>
              </div>
            </div>

            {/* Right Column: MOQ Enquiry Form */}
            <div className="lg:col-span-7 p-8 sm:p-10">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 bg-teal-50 text-[#18A6A6] border border-teal-200 rounded-full flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-bold text-[#10243A]">
                    Inquiry Successfully Registered
                  </h4>
                  <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto leading-relaxed">
                    We have recorded your MOQ requirement for <strong>{quantity} {unit}</strong> of <strong>{selectedProductName}</strong> (Standard MOQ: {moqInfo}). Our institutional team will share the official dossier and quotation shortly.
                  </p>
                  <div className="pt-4 flex justify-center gap-3">
                    <button
                      onClick={handleWhatsAppInquiry}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat via WhatsApp</span>
                    </button>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="bg-[#10243A] text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-xs hover:bg-[#182F49] transition-colors cursor-pointer"
                    >
                      Inquire for Another Formulation
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Row 1: Product Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                      Target Formulation <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={selectedProductName}
                      onChange={(e) => setSelectedProductName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCE4EB] bg-white focus:outline-none focus:ring-1 focus:ring-[#18A6A6] font-medium text-[#1E293B] cursor-pointer"
                      required
                    >
                      {PRODUCTS.map(p => (
                        <option key={p.id} value={p.name}>
                          {p.name} ({p.category}) — [MOQ: {p.moq}]
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Row 2: Desired Quantity & Unit */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                        Required Quantity <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCE4EB] bg-white focus:outline-none focus:ring-1 focus:ring-[#18A6A6]"
                        required
                      />
                      <p className="text-[10px] text-[#64748B] mt-1">Standard MOQ: {moqInfo}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                        Packaging Unit
                      </label>
                      <input
                        type="text"
                        value={unit}
                        readOnly
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCE4EB] bg-[#F1F6F8] text-[#10243A] font-bold"
                      />
                    </div>
                  </div>

                  {/* Row 3: Name & Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                        Firm / Stockist Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. MediLife Agency / Dr. Roy"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-[#DCE4EB] bg-white focus:outline-none focus:ring-1 focus:ring-[#18A6A6]"
                          required
                        />
                        <User className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 top-2.5" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                        Contact Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-2.5 rounded-l-xl border border-r-0 border-[#DCE4EB] bg-[#F1F6F8] text-[#64748B] text-xs font-bold">
                          +91
                        </span>
                        <input
                          type="tel"
                          placeholder="9876543210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-r-xl border border-[#DCE4EB] bg-white focus:outline-none focus:ring-1 focus:ring-[#18A6A6]"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Email */}
                  <div>
                    <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                      Business Email Address (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="e.g. orders@distributor.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-[#DCE4EB] bg-white focus:outline-none focus:ring-1 focus:ring-[#18A6A6]"
                      />
                      <Mail className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  {/* Row 5: Message */}
                  <div>
                    <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                      Territory / Target Supply Region
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Specify your target distribution region (e.g., Guwahati, Silchar, Agartala, Aizawl, Dibrugarh) or institutional requirement..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCE4EB] bg-white focus:outline-none focus:ring-1 focus:ring-[#18A6A6]"
                    ></textarea>
                  </div>

                  {/* Submit Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      className="bg-[#18A6A6] hover:bg-[#137F83] text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit MOQ Requirement</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsAppInquiry}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Instant WhatsApp Quote</span>
                    </button>
                  </div>

                </form>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
