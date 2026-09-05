import React from 'react';
import { X, ChevronRight, Building2, Phone, Mail, MessageCircle, ShieldCheck, Pill, ArrowUpRight } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyConfig';
import { ProductCategory } from '../types';

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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/60 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      
      {/* Outer Modal Container (Exact Zoox reference card layout) */}
      <div 
        className="bg-white rounded-3xl sm:rounded-[32px] shadow-2xl border border-slate-200/80 max-w-4xl w-full max-h-[92vh] overflow-hidden grid grid-cols-1 md:grid-cols-12 relative animate-scaleUp p-4 sm:p-6 gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Left Column: Navigation & Sub-links */}
        <div className="md:col-span-6 flex flex-col justify-between overflow-y-auto max-h-[82vh] pr-1 sm:pr-2">
          
          <div className="space-y-5">
            
            {/* Top Bar: Square Close Button & Brand Name */}
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all shadow-sm active:scale-95"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5 text-slate-700" />
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0b1e33] flex items-center justify-center text-[#00e5c9] shadow-sm">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-black tracking-tight text-[#0b1e33] uppercase">
                    {COMPANY_CONFIG.name}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-medium">Wholesale & Institutional Portal</span>
                </div>
              </div>
            </div>

            {/* Primary Large Menu Links with dark circular chevron buttons */}
            <nav className="space-y-1.5">
              
              {/* Home */}
              <button
                onClick={() => handleNav('home')}
                className={`w-full flex items-center justify-between py-2.5 px-3 rounded-2xl transition-all group ${
                  activeSection === 'home' ? 'bg-slate-100 text-[#0b1e33]' : 'hover:bg-slate-50 text-slate-900'
                }`}
              >
                <span className="text-xl sm:text-2xl font-bold tracking-tight">Home</span>
                <div className="w-8 h-8 rounded-full bg-[#1e293b] text-white flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-[#0b1e33] shadow-sm">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* Products & Catalog */}
              <button
                onClick={() => handleNav('products')}
                className={`w-full flex items-center justify-between py-2.5 px-3 rounded-2xl transition-all group ${
                  activeSection === 'products' ? 'bg-slate-100 text-[#0b1e33]' : 'hover:bg-slate-50 text-slate-900'
                }`}
              >
                <span className="text-xl sm:text-2xl font-bold tracking-tight">Products & Catalog</span>
                <div className="w-8 h-8 rounded-full bg-[#1e293b] text-white flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-[#0b1e33] shadow-sm">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* Visual Aid / Flipbook */}
              <button
                onClick={() => handleNav('flipbook')}
                className={`w-full flex items-center justify-between py-2.5 px-3 rounded-2xl transition-all group ${
                  activeSection === 'flipbook' ? 'bg-slate-100 text-[#0b1e33]' : 'hover:bg-slate-50 text-slate-900'
                }`}
              >
                <span className="text-xl sm:text-2xl font-bold tracking-tight">Flipbook / Visual Aid</span>
                <div className="w-8 h-8 rounded-full bg-[#1e293b] text-white flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-[#0b1e33] shadow-sm">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* MOQ & Trade Enquiry */}
              <button
                onClick={() => {
                  onClose();
                  onOpenEnquiry();
                }}
                className="w-full flex items-center justify-between py-2.5 px-3 rounded-2xl hover:bg-slate-50 text-slate-900 transition-all group"
              >
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#c72828]">MOQ & Trade Enquiry</span>
                <div className="w-8 h-8 rounded-full bg-[#c72828] text-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* About Us */}
              <button
                onClick={() => handleNav('about')}
                className={`w-full flex items-center justify-between py-2.5 px-3 rounded-2xl transition-all group ${
                  activeSection === 'about' ? 'bg-slate-100 text-[#0b1e33]' : 'hover:bg-slate-50 text-slate-900'
                }`}
              >
                <span className="text-xl sm:text-2xl font-bold tracking-tight">About Us</span>
                <div className="w-8 h-8 rounded-full bg-[#1e293b] text-white flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-[#0b1e33] shadow-sm">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* Contact Us */}
              <button
                onClick={() => handleNav('contact')}
                className={`w-full flex items-center justify-between py-2.5 px-3 rounded-2xl transition-all group ${
                  activeSection === 'contact' ? 'bg-slate-100 text-[#0b1e33]' : 'hover:bg-slate-50 text-slate-900'
                }`}
              >
                <span className="text-xl sm:text-2xl font-bold tracking-tight">Contact Us</span>
                <div className="w-8 h-8 rounded-full bg-[#1e293b] text-white flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-[#0b1e33] shadow-sm">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

            </nav>

            {/* Secondary Quick Links Grid (2 Columns as per reference layout) */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[13px] font-medium text-slate-600">
              <button 
                onClick={() => handleCategoryNav('Pharmaceutical Capsules')}
                className="text-left py-1 hover:text-[#0b1e33] flex items-center justify-between group"
              >
                <span>Capsules</span>
                <span className="text-slate-400 group-hover:text-slate-700 transition-colors">›</span>
              </button>

              <button 
                onClick={() => handleCategoryNav('Pharmaceutical Syrup')}
                className="text-left py-1 hover:text-[#0b1e33] flex items-center justify-between group"
              >
                <span>Liquid Syrups</span>
                <span className="text-slate-400 group-hover:text-slate-700 transition-colors">›</span>
              </button>

              <button 
                onClick={() => handleCategoryNav('Pharmaceutical Tablets')}
                className="text-left py-1 hover:text-[#0b1e33] flex items-center justify-between group"
              >
                <span>Tablets</span>
                <span className="text-slate-400 group-hover:text-slate-700 transition-colors">›</span>
              </button>

              <button 
                onClick={() => handleCategoryNav('Pharmaceutical Injectable')}
                className="text-left py-1 hover:text-[#0b1e33] flex items-center justify-between group"
              >
                <span>Injectables</span>
                <span className="text-slate-400 group-hover:text-slate-700 transition-colors">›</span>
              </button>

              <button 
                onClick={() => handleNav('about')}
                className="text-left py-1 hover:text-[#0b1e33] flex items-center justify-between group"
              >
                <span>Quality Policy</span>
                <span className="text-slate-400 group-hover:text-slate-700 transition-colors">›</span>
              </button>

              <button 
                onClick={() => handleNav('contact')}
                className="text-left py-1 hover:text-[#0b1e33] flex items-center justify-between group"
              >
                <span>Regional Depot</span>
                <span className="text-slate-400 group-hover:text-slate-700 transition-colors">›</span>
              </button>
            </div>

          </div>

          {/* Bottom Box (Matching the reference SOCIALS / QUICK CONTACT bar) */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/90 p-3 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
              ASSAM TRADE DESK
            </span>
            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/?text=Hello,%20I%20would%20like%20to%20inquire%20about%20your%20pharmaceutical%20formulations%20and%20MOQ."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white text-[#25D366]" />
                <span>WhatsApp</span>
              </a>
              <button
                onClick={() => {
                  onClose();
                  onOpenEnquiry();
                }}
                className="bg-[#0b1e33] hover:bg-[#163e61] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all active:scale-95"
              >
                Inquire MOQ
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Full-Height Vertical Photo Card (Exact match to reference style) */}
        <div className="hidden md:block md:col-span-6 relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-200/60 bg-slate-900 group">
          {/* Vertical Editorial Healthcare / Pharma Photography */}
          <img
            src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80"
            alt="Pharmaceutical Formulations & Research"
            className="w-full h-full min-h-[460px] object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Elegant Dark Gradient & Badges Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-between p-6">
            
            {/* Top Badge */}
            <div className="flex justify-end">
              <span className="bg-black/50 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00e5c9]" />
                WHO-GMP Monograph
              </span>
            </div>

            {/* Bottom Content Card */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#00e5c9]">
                Clinical Excellence
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                Precision Formulations for Hospitals & Wholesalers.
              </h3>
              <p className="text-xs text-slate-200/90 leading-relaxed font-normal">
                Standardized monographs across Oral Solids, Liquid Formulations, and Lyophilized Sterile Injectables.
              </p>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-white/80 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Guwahati Regional Cold-Chain Distribution</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

