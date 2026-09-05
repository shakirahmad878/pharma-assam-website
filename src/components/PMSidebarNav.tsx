import React from 'react';
import { X, ChevronRight, Building2, Phone, Mail, MessageCircle, ShieldCheck, Pill, FlaskConical, Layers, Syringe, BookOpen } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyConfig';
import { ProductCategory, Product } from '../types';

interface PMSidebarNavProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onSelectCategory: (category: ProductCategory | 'All Products') => void;
  onOpenEnquiry: () => void;
}

export const PMSidebarNav: React.FC<PMSidebarNavProps> = ({
  isOpen,
  onClose,
  activeSection,
  onNavigate,
  onSelectCategory,
  onOpenEnquiry
}) => {
  if (!isOpen) return null;

  const handleNav = (sectionId: string) => {
    onClose();
    onNavigate(sectionId);
  };

  const handleCategoryNav = (cat: ProductCategory) => {
    onClose();
    onSelectCategory(cat);
    onNavigate('products');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      
      {/* Outer Modal Container (Recreating the uploaded reference card layout) */}
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] overflow-hidden grid grid-cols-1 md:grid-cols-12 relative animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Left Column: Navigation & Sub-links */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[92vh]">
          
          <div className="space-y-6">
            
            {/* Top Bar: Close Button & Brand */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition-colors shadow-sm"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0b1e33] flex items-center justify-center text-[#00e5c9]">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-sm font-black tracking-tight text-[#0b1e33]">
                  {COMPANY_CONFIG.name}
                </span>
              </div>
            </div>

            {/* Primary Large Menu Links (with dark rounded arrow buttons like example) */}
            <nav className="space-y-2">
              
              {/* Home */}
              <button
                onClick={() => handleNav('home')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all group ${
                  activeSection === 'home' ? 'bg-red-50 text-[#c72828]' : 'hover:bg-slate-50 text-slate-800'
                }`}
              >
                <span className="text-xl sm:text-2xl font-black tracking-tight">Home</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                  activeSection === 'home' ? 'bg-[#c72828] text-white' : 'bg-[#0b1e33] text-white'
                }`}>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* About Us */}
              <button
                onClick={() => handleNav('about')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all group ${
                  activeSection === 'about' ? 'bg-red-50 text-[#c72828]' : 'hover:bg-slate-50 text-slate-800'
                }`}
              >
                <span className="text-xl sm:text-2xl font-black tracking-tight">About Us</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                  activeSection === 'about' ? 'bg-[#c72828] text-white' : 'bg-[#0b1e33] text-white'
                }`}>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* Products Directory */}
              <button
                onClick={() => handleNav('products')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all group ${
                  activeSection === 'products' ? 'bg-red-50 text-[#c72828]' : 'hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div>
                  <span className="text-xl sm:text-2xl font-black tracking-tight">Products & Catalog</span>
                  <p className="text-[11px] text-slate-400 font-semibold">10 Standard Formulations</p>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                  activeSection === 'products' ? 'bg-[#c72828] text-white' : 'bg-[#0b1e33] text-white'
                }`}>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* Flipbook / Visual Aid */}
              <button
                onClick={() => handleNav('flipbook')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all group ${
                  activeSection === 'flipbook' ? 'bg-red-50 text-[#c72828]' : 'hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div>
                  <span className="text-xl sm:text-2xl font-black tracking-tight">Flipbook / Visual Aid</span>
                  <p className="text-[11px] text-slate-400 font-semibold">Doctor & Representative Monograph</p>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                  activeSection === 'flipbook' ? 'bg-[#c72828] text-white' : 'bg-[#0b1e33] text-white'
                }`}>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* MOQ Enquiry */}
              <button
                onClick={() => {
                  onClose();
                  onOpenEnquiry();
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 text-slate-800 transition-all group"
              >
                <div>
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-[#c72828]">MOQ & Trade Enquiry</span>
                  <p className="text-[11px] text-slate-400 font-semibold">Wholesale Batch Quotation</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#c72828] text-white flex items-center justify-center transition-transform group-hover:scale-110">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* Contact Us */}
              <button
                onClick={() => handleNav('contact')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all group ${
                  activeSection === 'contact' ? 'bg-red-50 text-[#c72828]' : 'hover:bg-slate-50 text-slate-800'
                }`}
              >
                <span className="text-xl sm:text-2xl font-black tracking-tight">Contact Us</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                  activeSection === 'contact' ? 'bg-[#c72828] text-white' : 'bg-[#0b1e33] text-white'
                }`}>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

            </nav>

            {/* Secondary Quick Links Grid (2 Columns as per reference layout) */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600">
              <button 
                onClick={() => handleCategoryNav('Pharmaceutical Capsules')}
                className="text-left py-1 px-2 rounded hover:text-[#c72828] hover:bg-slate-50 flex items-center justify-between"
              >
                <span>Pharmaceutical Capsules</span>
                <span className="text-slate-400 text-[10px]">›</span>
              </button>

              <button 
                onClick={() => handleCategoryNav('Pharmaceutical Syrup')}
                className="text-left py-1 px-2 rounded hover:text-[#c72828] hover:bg-slate-50 flex items-center justify-between"
              >
                <span>Pharmaceutical Syrup</span>
                <span className="text-slate-400 text-[10px]">›</span>
              </button>

              <button 
                onClick={() => handleCategoryNav('Pharmaceutical Tablets')}
                className="text-left py-1 px-2 rounded hover:text-[#c72828] hover:bg-slate-50 flex items-center justify-between"
              >
                <span>Pharmaceutical Tablets</span>
                <span className="text-slate-400 text-[10px]">›</span>
              </button>

              <button 
                onClick={() => handleCategoryNav('Pharmaceutical Injectable')}
                className="text-left py-1 px-2 rounded hover:text-[#c72828] hover:bg-slate-50 flex items-center justify-between"
              >
                <span>Pharmaceutical Injectable</span>
                <span className="text-slate-400 text-[10px]">›</span>
              </button>
            </div>

          </div>

          {/* Bottom Quick Contact & Regulatory Badge Box */}
          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50 p-3 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Assam Regional Hub
            </span>
            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/?text=Hello,%20I%20would%20like%20to%20inquire%20about%20your%20pharmaceutical%20product%20MOQ."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* Right Column: Visual Showcase Card (Exact match to reference style) */}
        <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-[#0b1e33] to-[#163e61] p-6 flex-col justify-between text-white relative overflow-hidden">
          
          {/* Subtle Background Art */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-cyan-400 blur-3xl"></div>
            <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-red-500 blur-3xl"></div>
          </div>

          {/* Top Label */}
          <div className="relative z-10">
            <span className="bg-white/10 backdrop-blur-md border border-white/20 text-cyan-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest inline-block">
              Assam & North-East Healthcare
            </span>
            <h3 className="text-2xl font-black text-white mt-3 leading-tight tracking-tight">
              Quality Formulations Built for Clinical Trust.
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Standardized pharmacopoeial monograph compliance across Oral Solids, Liquid Formulations, and Lyophilized Sterile Injectables.
            </p>
          </div>

          {/* Center Product Visual Feature */}
          <div className="relative z-10 my-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center justify-center">
            <img
              src="https://2.wlimg.com/product_images/bc-500/2026/2/12905670/rabefill-dsr-capsules-1772254673-7305716.jpeg"
              alt="Featured Formulation"
              className="max-h-48 object-contain filter drop-shadow-xl"
            />
          </div>

          {/* Bottom Card Stat */}
          <div className="relative z-10 bg-slate-900/60 backdrop-blur-md border border-slate-700/60 p-3.5 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#00e5c9]">
              <ShieldCheck className="w-4 h-4" />
              <span>WHO-GMP Quality Certified</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Guwahati central logistics depot ensuring timely cold-chain and direct hospital dispatch.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
