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
    <section id="enquiry" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-2xl border-2 border-[#163e61]/20 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column: MOQ Information & Statutory Assurance */}
            <div className="lg:col-span-5 bg-[#163e61] text-white p-8 sm:p-10 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="inline-block bg-[#c72828] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Wholesale & Distributor Portal
                </div>

                <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                  Product & MOQ Requirement Enquiry
                </h3>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Have questions regarding our <strong>Minimum Order Quantity (MOQ)</strong>, batch manufacturing capacity, or regional stockist terms? Submit your enquiry below to receive official product catalogs and wholesale rate structures.
                </p>

                {/* Live Selected Molecule MOQ Card */}
                <div className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-300">
                    <PackageCheck className="w-4 h-4" />
                    <span>Selected Molecule Standard MOQ</span>
                  </div>
                  <p className="text-sm font-extrabold text-white">{currentProduct.name}</p>
                  <p className="text-xs text-emerald-400 font-semibold">Standard MOQ: {moqInfo}</p>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-700/60 text-xs">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-red-400" />
                    <span>Enquiry Line: <strong>{COMPANY_CONFIG.phone}</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-red-400" />
                    <span>Email: <strong>{COMPANY_CONFIG.email}</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Hash className="w-4 h-4 text-red-400" />
                    <span>GST No: <strong>{COMPANY_CONFIG.registrationNumber.replace('GST: ', '')}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-700/60">
                <p className="text-[11px] text-slate-300 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>This portal is for trade & institutional MOQ inquiries. No retail consumer order processing.</span>
                </p>
              </div>
            </div>

            {/* Right Column: MOQ Enquiry Form */}
            <div className="lg:col-span-7 p-8 sm:p-10">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-black text-[#163e61]">
                    Thank You! Your MOQ Enquiry Has Been Received.
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    We have recorded your MOQ inquiry for <strong>{quantity} {unit}</strong> of <strong>{selectedProductName}</strong> (Standard MOQ: {moqInfo}). Our institutional team will share wholesale terms shortly.
                  </p>
                  <div className="pt-4 flex justify-center gap-3">
                    <button
                      onClick={handleWhatsAppInquiry}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition-colors flex items-center gap-2"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat on WhatsApp</span>
                    </button>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="bg-[#163e61] text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow hover:bg-slate-800 transition-colors"
                    >
                      Inquire for Another Molecule
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Row 1: Product Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Product / Molecule for MOQ Enquiry <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedProductName}
                      onChange={(e) => setSelectedProductName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#163e61] font-semibold text-slate-800"
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
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Target Enquiry Quantity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#163e61]"
                        required
                      />
                      <p className="text-[10px] text-slate-500 mt-0.5">Standard MOQ: {moqInfo}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Packaging Unit
                      </label>
                      <input
                        type="text"
                        value={unit}
                        readOnly
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-100 text-slate-600 font-bold"
                      />
                    </div>
                  </div>

                  {/* Row 3: Name & Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Your Name / Stockist / Firm Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. Dr. Rajesh Sharma / MediLife Agency"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#163e61]"
                          required
                        />
                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Contact Phone / Mobile <span className="text-red-500">*</span>
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-2.5 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 text-slate-600 text-xs font-bold">
                          +91
                        </span>
                        <input
                          type="tel"
                          placeholder="9876543210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-r-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#163e61]"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="e.g. enquiry@distributor.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#163e61]"
                      />
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  {/* Row 5: Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Enquiry Specifics / Distribution Region
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Specify your target distribution district (e.g. Assam, Guwahati, North-East, Pan-India), franchise interest, or batch requirement..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#163e61]"
                    ></textarea>
                  </div>

                  {/* Submit Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      className="bg-[#c72828] hover:bg-red-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow transition-colors flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit MOQ Enquiry</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsAppInquiry}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition-colors flex items-center gap-2"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Instant WhatsApp MOQ Quote</span>
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
