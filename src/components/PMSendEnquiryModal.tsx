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
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10243A]/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-[#DCE4EB] max-w-lg w-full max-h-[90vh] overflow-y-auto relative animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#10243A] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#18A6A6]">
              Wholesale & Institutional Inquiry
            </span>
            <h3 className="text-base font-bold">Inquire MOQ & Batch Quotation</h3>
          </div>
          <button
            onClick={resetAndClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4 animate-fadeIn">
              <div className="w-14 h-14 bg-teal-50 text-[#18A6A6] border border-teal-200 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-[#10243A]">
                Inquiry Sent Successfully
              </h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Thank you for inquiring about <strong>{productName}</strong>. Our distribution desk will review your target quantity of <strong>{quantity} {unit}</strong> (Standard MOQ: {moq}) and reach out with wholesale terms.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-2">
                <button
                  onClick={handleWhatsApp}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send on WhatsApp</span>
                </button>
                <button
                  onClick={resetAndClose}
                  className="bg-[#10243A] text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-xs hover:bg-[#182F49] transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Product Select */}
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                  Product / Molecule <span className="text-rose-500">*</span>
                </label>
                <select
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCE4EB] bg-white focus:outline-none focus:ring-1 focus:ring-[#18A6A6] font-medium text-[#1E293B] cursor-pointer"
                >
                  {PRODUCTS.map(p => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.category}) — [MOQ: {p.moq}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                    Enquiry Quantity <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCE4EB] bg-white focus:outline-none focus:ring-1 focus:ring-[#18A6A6]"
                    required
                  />
                  <p className="text-[10px] text-[#64748B] mt-0.5">MOQ: {moq}</p>
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

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                  Stockist / Firm Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Dr. A. Sharma / MediLife Distributors"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-[#DCE4EB] bg-white focus:outline-none focus:ring-1 focus:ring-[#18A6A6]"
                    required
                  />
                  <User className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 top-2.5" />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                  Mobile / WhatsApp Number <span className="text-rose-500">*</span>
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

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                  Specific Requirements (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Specify target territory, delivery timeline, or batch quantity..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCE4EB] bg-white focus:outline-none focus:ring-1 focus:ring-[#18A6A6]"
                ></textarea>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-[#F1F6F8] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#18A6A6] hover:bg-[#137F83] text-white font-semibold text-xs px-5 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
