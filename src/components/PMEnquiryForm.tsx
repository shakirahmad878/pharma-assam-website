import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, Phone, Mail, User, Hash } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { COMPANY_CONFIG } from '../data/companyConfig';

interface PMEnquiryFormProps {
  defaultProduct?: string;
}

export const PMEnquiryForm: React.FC<PMEnquiryFormProps> = ({ defaultProduct }) => {
  const [selectedProductName, setSelectedProductName] = useState(defaultProduct || PRODUCTS[0].name);
  const [quantity, setQuantity] = useState(100);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Derive unit from selected product
  const currentProduct = PRODUCTS.find(p => p.name === selectedProductName) || PRODUCTS[0];
  const unit = currentProduct.unit || 'Pack';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleWhatsAppInquiry = () => {
    const text = `*Inquiry for ${selectedProductName}*\n*Quantity:* ${quantity} ${unit}\n*Name:* ${name || 'Prospective Buyer'}\n*Phone:* ${phone || 'N/A'}\n*Email:* ${email || 'N/A'}\n*Requirement:* ${message || 'Please share best quotation and availability.'}`;
    window.open(`https://wa.me/916001137678?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="enquiry" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-2xl border-2 border-[#163e61]/20 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column: Form Intro & Contact Assurance */}
            <div className="lg:col-span-5 bg-[#163e61] text-white p-8 sm:p-10 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="inline-block bg-[#c72828] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Direct Manufacturer Portal
                </div>

                <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                  Send Your Requirement & Get Instant Quotation
                </h3>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Tell us your product formulation requirements, desired order quantity, and institutional delivery location. Our distribution team will revert with confirmed batch pricing and shipping terms.
                </p>

                <div className="space-y-3 pt-4 border-t border-slate-700/60 text-xs">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-red-400" />
                    <span>Call: <strong>{COMPANY_CONFIG.phone}</strong></span>
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
                <p className="text-[11px] text-slate-300">
                  🔒 Institutional confidentiality guaranteed. Orders dispatched under audited cold-chain / climate-controlled protocols.
                </p>
              </div>
            </div>

            {/* Right Column: Interactive Requirement Form (Exact fields from progressivemolecules.in) */}
            <div className="lg:col-span-7 p-8 sm:p-10">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-black text-[#163e61]">
                    Thank You! Your Enquiry Has Been Sent Successfully.
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    We have received your requirement for <strong>{quantity} {unit}</strong> of <strong>{selectedProductName}</strong>. Our business development team will contact you shortly.
                  </p>
                  <div className="pt-4 flex justify-center gap-3">
                    <button
                      onClick={handleWhatsAppInquiry}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition-colors flex items-center gap-2"
                    >
                      <span>Connect via WhatsApp</span>
                    </button>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="bg-[#163e61] text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow hover:bg-slate-800 transition-colors"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Row 1: Product Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Product / Formulation Looking For <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedProductName}
                      onChange={(e) => setSelectedProductName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#163e61] font-semibold text-slate-800"
                      required
                    >
                      {PRODUCTS.map(p => (
                        <option key={p.id} value={p.name}>
                          {p.name} ({p.category}) - {p.genericComposition}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Row 2: Quantity & Unit */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Quantity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#163e61]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Unit
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
                        Your Name / Institution <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. Dr. Rajesh Sharma / Apollo Hospital"
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
                        Mobile Number <span className="text-red-500">*</span>
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
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="e.g. purchase@hospital.com"
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
                      Enquiry Details / Delivery Destination
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Please provide details such as target delivery state (e.g. Assam, Guwahati, Pan-India), timeline, or batch size..."
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
                      <span>Submit Requirement</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsAppInquiry}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition-colors flex items-center gap-2"
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
