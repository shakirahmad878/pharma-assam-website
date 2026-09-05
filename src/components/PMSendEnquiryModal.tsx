import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, MessageSquare, Phone, User, Mail, PackageCheck } from 'lucide-react';
import { PRODUCTS } from '../data/products';

interface PMSendEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProductName?: string;
}

export const PMSendEnquiryModal: React.FC<PMSendEnquiryModalProps> = ({
  isOpen,
  onClose,
  defaultProductName
}) => {
  const [productName, setProductName] = useState(defaultProductName || PRODUCTS[0].name);
  const currentProduct = PRODUCTS.find(p => p.name === productName) || PRODUCTS[0];
  
  const [quantity, setQuantity] = useState(500);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (defaultProductName) {
      setProductName(defaultProductName);
    }
  }, [defaultProductName]);

  if (!isOpen) return null;

  const unit = currentProduct.unit || 'Pack';
  const moq = currentProduct.moq || '500 Units';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  const handleWhatsApp = () => {
    const text = `*MOQ & Product Enquiry for ${productName}*\n*Standard MOQ:* ${moq}\n*Target Enquiry Quantity:* ${quantity} ${unit}\n*Name:* ${name || 'Prospective Partner'}\n*Phone:* ${phone || 'N/A'}\n*Notes:* ${message || 'Please share MOQ details and batch quotation.'}`;
    window.open(`https://wa.me/916001137678?text=${encodeURIComponent(text)}`, '_blank');
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto relative animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#163e61] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-300">
              Wholesale & Institutional Enquiry
            </span>
            <h3 className="text-base font-bold">Inquire MOQ & Product Quotation</h3>
          </div>
          <button
            onClick={resetAndClose}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4 animate-fadeIn">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-[#163e61]">
                MOQ Enquiry Sent Successfully!
              </h4>
              <p className="text-xs text-slate-600">
                Thank you for inquiring about <strong>{productName}</strong>. Our distribution team will review your target quantity of <strong>{quantity} {unit}</strong> (Standard MOQ: {moq}) and contact you with wholesale pricing.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-2">
                <button
                  onClick={handleWhatsApp}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg shadow transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send on WhatsApp</span>
                </button>
                <button
                  onClick={resetAndClose}
                  className="bg-[#163e61] text-white font-bold text-xs px-4 py-2 rounded-lg shadow hover:bg-slate-800 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Product Info Banner */}
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg flex items-center justify-between">
                <span className="font-bold text-[#163e61]">{productName}</span>
                <span className="text-[11px] font-bold text-[#c72828] bg-red-50 px-2 py-0.5 rounded border border-red-100">
                  MOQ: {moq}
                </span>
              </div>

              {/* Product Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Product / Molecule <span className="text-red-500">*</span>
                </label>
                <select
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#163e61]"
                  required
                >
                  {PRODUCTS.map(p => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.category}) [MOQ: {p.moq}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity & Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Enquiry Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#163e61]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit</label>
                  <input
                    type="text"
                    value={unit}
                    readOnly
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-100 text-slate-600 font-bold"
                  />
                </div>
              </div>

              {/* Name & Phone */}
              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Your Name / Pharmacy / Stockist Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Dr. Rajesh Kumar / City Chemist"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#163e61]"
                      required
                    />
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-2.5 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 text-slate-600 font-bold">
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-r-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#163e61]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="e.g. contact@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#163e61]"
                    />
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Target Region / Specific Requirements
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Region of distribution (e.g. Assam, Mumbai, etc.), PCD interest, or batch inquiries..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#163e61]"
                  ></textarea>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#c72828] hover:bg-red-700 text-white font-bold px-5 py-2 rounded-lg shadow transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit MOQ Enquiry</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
