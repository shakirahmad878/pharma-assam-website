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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-[#10243A]/70 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      {/* Outer Modal Container */}
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-[#DCE4EB] max-w-4xl w-full max-h-[92vh] overflow-hidden grid grid-cols-1 md:grid-cols-12 relative animate-scaleUp p-4 sm:p-6 gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Left Column: Navigation & Sub-links */}
        <div className="md:col-span-6 flex flex-col justify-between overflow-y-auto max-h-[82vh] pr-1 sm:pr-2">
          
          <div className="space-y-5">
            
            {/* Top Bar: Close Button & Brand Name */}
            <div className="flex items-center gap-4 border-b border-[#DCE4EB] pb-4">
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl border border-[#DCE4EB] flex items-center justify-center text-[#1E293B] hover:bg-[#F1F6F8] transition-all shadow-2xs active:scale-95 cursor-pointer"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5 text-[#1E293B]" />
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#10243A] flex items-center justify-center text-[#18A6A6] shadow-2xs">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold tracking-tight text-[#10243A] uppercase">
                    {COMPANY_CONFIG.name}
                  </span>
                  <span className="block text-[10px] text-[#64748B] font-medium">Commercial & Institutional Portal</span>
                </div>
              </div>
            </div>

            {/* Primary Large Menu Links */}
            <nav className="space-y-1.5">
              
              {/* Home */}
              <button
                onClick={() => handleNav('home')}
                className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl transition-all group cursor-pointer ${
                  activeSection === 'home' ? 'bg-[#F1F6F8] text-[#10243A] font-bold' : 'hover:bg-[#F5F8FA] text-[#1E293B]'
                }`}
              >
                <span className="text-lg sm:text-xl font-bold tracking-tight">Home</span>
                <div className="w-7 h-7 rounded-full bg-[#10243A] text-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xs">
                  <ChevronRight className="w-4 h-4 text-[#18A6A6]" />
                </div>
              </button>

              {/* Products & Catalog */}
              <button
                onClick={() => handleNav('products')}
                className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl transition-all group cursor-pointer ${
                  activeSection === 'products' ? 'bg-[#F1F6F8] text-[#10243A] font-bold' : 'hover:bg-[#F5F8FA] text-[#1E293B]'
                }`}
              >
                <span className="text-lg sm:text-xl font-bold tracking-tight">Formulation Directory</span>
                <div className="w-7 h-7 rounded-full bg-[#10243A] text-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xs">
                  <ChevronRight className="w-4 h-4 text-[#18A6A6]" />
                </div>
              </button>

              {/* Visual Aid / Flipbook */}
              <button
                onClick={() => handleNav('flipbook')}
                className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl transition-all group cursor-pointer ${
                  activeSection === 'flipbook' ? 'bg-[#F1F6F8] text-[#10243A] font-bold' : 'hover:bg-[#F5F8FA] text-[#1E293B]'
                }`}
              >
                <span className="text-lg sm:text-xl font-bold tracking-tight">Visual Aid Monograph</span>
                <div className="w-7 h-7 rounded-full bg-[#10243A] text-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xs">
                  <ChevronRight className="w-4 h-4 text-[#18A6A6]" />
                </div>
              </button>

              {/* MOQ & Trade Enquiry */}
              <button
                onClick={() => {
                  onClose();
                  onOpenEnquiry();
                }}
                className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#F5F8FA] text-[#10243A] transition-all group cursor-pointer"
              >
                <span className="text-lg sm:text-xl font-bold tracking-tight text-[#18A6A6]">Inquire MOQ & Quotation</span>
                <div className="w-7 h-7 rounded-full bg-[#18A6A6] text-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xs">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* About Us */}
              <button
                onClick={() => handleNav('about')}
                className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl transition-all group cursor-pointer ${
                  activeSection === 'about' ? 'bg-[#F1F6F8] text-[#10243A] font-bold' : 'hover:bg-[#F5F8FA] text-[#1E293B]'
                }`}
              >
                <span className="text-lg sm:text-xl font-bold tracking-tight">Corporate Factsheet</span>
                <div className="w-7 h-7 rounded-full bg-[#10243A] text-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xs">
                  <ChevronRight className="w-4 h-4 text-[#18A6A6]" />
                </div>
              </button>

              {/* Contact Us */}
              <button
                onClick={() => handleNav('contact')}
                className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl transition-all group cursor-pointer ${
                  activeSection === 'contact' ? 'bg-[#F1F6F8] text-[#10243A] font-bold' : 'hover:bg-[#F5F8FA] text-[#1E293B]'
                }`}
              >
                <span className="text-lg sm:text-xl font-bold tracking-tight">Contact & Depot</span>
                <div className="w-7 h-7 rounded-full bg-[#10243A] text-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xs">
                  <ChevronRight className="w-4 h-4 text-[#18A6A6]" />
                </div>
              </button>

            </nav>

            {/* Secondary Quick Links Grid */}
            <div className="pt-3 border-t border-[#DCE4EB] grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs font-medium text-[#64748B]">
              <button 
                onClick={() => handleCategoryNav('Pharmaceutical Capsules')}
                className="text-left py-1 hover:text-[#10243A] flex items-center justify-between group cursor-pointer"
              >
                <span>Capsules</span>
                <span className="text-[#64748B] group-hover:text-[#18A6A6] transition-colors">›</span>
              </button>

              <button 
                onClick={() => handleCategoryNav('Pharmaceutical Syrup')}
                className="text-left py-1 hover:text-[#10243A] flex items-center justify-between group cursor-pointer"
              >
                <span>Liquid Syrups</span>
                <span className="text-[#64748B] group-hover:text-[#18A6A6] transition-colors">›</span>
              </button>

              <button 
                onClick={() => handleCategoryNav('Pharmaceutical Tablets')}
                className="text-left py-1 hover:text-[#10243A] flex items-center justify-between group cursor-pointer"
              >
                <span>Tablets</span>
                <span className="text-[#64748B] group-hover:text-[#18A6A6] transition-colors">›</span>
              </button>

              <button 
                onClick={() => handleCategoryNav('Pharmaceutical Injectable')}
                className="text-left py-1 hover:text-[#10243A] flex items-center justify-between group cursor-pointer"
              >
                <span>Injectables</span>
                <span className="text-[#64748B] group-hover:text-[#18A6A6] transition-colors">›</span>
              </button>
            </div>

          </div>

          {/* Bottom Box */}
          <div className="mt-5 pt-3 border-t border-[#DCE4EB] flex items-center justify-between bg-[#F1F6F8] p-3 rounded-xl border border-[#DCE4EB]">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">
              ASSAM TRADE DESK
            </span>
            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/?text=Hello,%20I%20would%20like%20to%20inquire%20about%20your%20pharmaceutical%20formulations%20and%20MOQ."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
              <button
                onClick={() => {
                  onClose();
                  onOpenEnquiry();
                }}
                className="bg-[#10243A] hover:bg-[#182F49] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
              >
                Inquire MOQ
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Full-Height Vertical Photo Card */}
        <div className="hidden md:block md:col-span-6 relative rounded-2xl overflow-hidden shadow-sm border border-[#DCE4EB] bg-[#10243A] group">
          <img
            src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80"
            alt="Pharmaceutical Formulations & Research"
            className="w-full h-full min-h-[460px] object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#10243A]/90 via-[#10243A]/30 to-transparent flex flex-col justify-between p-6">
            <div className="flex justify-end">
              <span className="bg-[#10243A]/80 backdrop-blur-xs border border-white/20 text-white text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#18A6A6]" />
                WHO-GMP Monograph
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#18A6A6]">
                Scientific Integrity
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                Precision Formulations for Hospitals & Wholesalers.
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed">
                Monographs conforming strictly to IP, BP, and USP standards with certified batch release testing.
              </p>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-teal-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#18A6A6]"></span>
                <span>Guwahati Regional Distribution Hub</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
