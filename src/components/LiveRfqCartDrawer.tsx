import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Send, 
  CheckCircle2, 
  FileSpreadsheet, 
  ShieldCheck, 
  Building2, 
  Plus, 
  ArrowRight 
} from 'lucide-react';
import { Product } from '../types';
import { COMPANY_CONFIG } from '../data/companyConfig';

export interface RfqItem {
  product: Product;
  quantity: number;
  unit: string;
}

interface LiveRfqCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: RfqItem[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, qty: number) => void;
  onClearCart: () => void;
}

export const LiveRfqCartDrawer: React.FC<LiveRfqCartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [businessType, setBusinessType] = useState('Distributor / Importer');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitRfq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Please provide your Full Name and Business Email.');
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div 
        className="w-full max-w-xl bg-slate-950 text-white h-full shadow-2xl border-l border-white/15 flex flex-col justify-between overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-6 bg-slate-900 border-b border-white/10 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">B2B RFQ Requisition Cart</h3>
              <p className="text-[11px] text-slate-400 font-mono">{items.length} Formulations Selected</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-6 space-y-6 flex-grow">
          
          {isSubmitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-950 border border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-xl font-bold text-white">Multi-Product RFQ Submitted!</h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                Thank you, <strong>{name}</strong> ({company || 'Your Organization'}). Our corporate sales team has received your requisition for {items.length} formulation lines and will follow up with complete wholesale pricing and technical dossiers at <strong>{email}</strong>.
              </p>

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  onClearCart();
                  onClose();
                }}
                className="bg-cyan-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition-all"
              >
                Done
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-3">
              <FileSpreadsheet className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="text-base font-bold text-white">Your RFQ Requisition is Empty</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Explore our formulation catalog and click <strong>"Add to RFQ"</strong> on any product to bundle multiple items into a single proposal.
              </p>
              <button
                onClick={onClose}
                className="bg-cyan-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs mt-2"
              >
                Browse Formulations
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitRfq} className="space-y-6">
              
              {/* Product Requisition List */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                  <span>Selected Products & Batch Volumes:</span>
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="text-red-400 hover:text-red-300 underline text-[11px]"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {items.map(({ product, quantity, unit }) => (
                    <div 
                      key={product.id}
                      className="p-3.5 bg-slate-900 rounded-2xl border border-white/10 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0 flex-grow space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono text-cyan-300 font-bold">{product.dosageForm}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-[10px] font-mono text-emerald-400">{product.pharmacopoeiaStandard}</span>
                        </div>
                        <h5 className="text-xs font-bold text-white truncate">{product.name}</h5>
                        <p className="text-[10px] text-slate-400 font-mono truncate">{product.packaging}</p>
                      </div>

                      {/* Quantity Input */}
                      <div className="flex items-center space-x-2 shrink-0">
                        <input
                          type="number"
                          min="100"
                          step="100"
                          value={quantity}
                          onChange={(e) => onUpdateQuantity(product.id, Number(e.target.value))}
                          className="w-20 px-2 py-1 bg-slate-950 border border-white/15 rounded-lg text-xs font-mono text-white text-center"
                        />
                        <span className="text-[10px] text-slate-400 font-mono">{unit}</span>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(product.id)}
                          className="text-slate-500 hover:text-red-400 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buyer Information Section */}
              <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 block">
                  Procurement Officer Information:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. David Miller"
                      className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Company / Organization</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. MediCore Logistics"
                      className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Business Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. procurement@medicore.com"
                      className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Destination Country / Region</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. United Kingdom"
                      className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Special Packaging / Lead Time Requirements</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Specify target delivery timeline, custom private label, or technical documentation needs..."
                    className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-black py-3.5 rounded-xl text-xs shadow-lg transition-all flex items-center justify-center space-x-2 mt-4"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Unified Multi-Product RFQ</span>
                </button>
              </div>

            </form>
          )}

        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-slate-900 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span className="flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
            Direct Manufacturer Proposal
          </span>
          <span>{COMPANY_CONFIG.name}</span>
        </div>

      </div>
    </div>
  );
};
