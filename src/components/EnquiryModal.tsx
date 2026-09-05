import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { COMPANY_CONFIG } from '../data/companyConfig';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProductName?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  defaultProductName
}) => {
  if (!isOpen) return null;

  const [productName, setProductName] = useState(defaultProductName || PRODUCTS[0].name);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [businessType, setBusinessType] = useState('Distributor / Importer');
  const [quantity, setQuantity] = useState('500');
  const [unit, setUnit] = useState('Pack / Box');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (defaultProductName) {
      setProductName(defaultProductName);
    }
  }, [defaultProductName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Please provide your Full Name and Business Email Address.');
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pharma-950 via-pharma-900 to-pharma-800 text-white p-6 relative flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-cyan-300 border border-white/15">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Send Business Enquiry</h3>
              <p className="text-[11px] text-slate-300">{COMPANY_CONFIG.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 sm:p-7">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                Enquiry Logged Successfully!
              </h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                Thank you, <strong>{name}</strong>. Our business development team will follow up shortly at <strong>{email}</strong> regarding <strong>{productName}</strong>.
              </p>

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  onClose();
                }}
                className="text-xs text-slate-500 underline font-semibold mt-2 block mx-auto"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product / Requirement *</label>
                <select
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-pharma-900"
                >
                  <option value="General Portfolio Inquiry">All Products / General Distribution Inquiry</option>
                  <option value="Contract Manufacturing Inquiry">Contract Manufacturing / Private Label</option>
                  {PRODUCTS.map((p) => (
                    <option key={p.id} value={p.name}>{p.name} ({p.dosageForm})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estimated Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-pharma-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Packaging Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-pharma-900"
                  >
                    <option value="Pack / Box">Pack / Box</option>
                    <option value="Strip">Strip</option>
                    <option value="Bottle">Bottle</option>
                    <option value="Vial">Vial</option>
                    <option value="Commercial Batch">Commercial Batch</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-pharma-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company Name</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company / Agency"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-pharma-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Business Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-pharma-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Country / Region</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-pharma-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Message / Requirements</label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mention target territory, custom specifications, or batch timeline..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-pharma-900"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-pharma-900 hover:bg-pharma-950 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Submit RFQ</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
