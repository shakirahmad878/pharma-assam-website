import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  Building2, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  ExternalLink,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
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
  const [isFormulationsExpanded, setIsFormulationsExpanded] = useState<boolean>(true);

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
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Dimmed Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Cloudflare-Style Docked Left Sidebar */}
      <div 
        className="fixed inset-y-0 left-0 w-72 sm:w-80 bg-white border-r border-[#E2E8F0] shadow-2xl flex flex-col justify-between z-10 select-none animate-in slide-in-from-left duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header: Account / Organization Indicator (Exact Cloudflare Header Style) */}
        <div className="p-3.5 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#10243A] flex items-center justify-center text-[#18A6A6] flex-shrink-0 shadow-2xs border border-[#182F49]">
              <Building2 className="w-4 h-4 text-[#18A6A6]" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 truncate block tracking-tight">
                {COMPANY_CONFIG.name}
              </span>
              <span className="text-[10.5px] text-slate-500 font-mono block truncate">
                nlcl.in • Assam Pharma
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex-shrink-0 ml-2"
            title="Close Sidebar Menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 text-xs">
          
          {/* Main Website Sections (Cloudflare Flat Menu Style) */}
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left py-2 px-3 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
              activeSection === 'home'
                ? 'bg-[#F1F5F9] text-[#0284C7] font-bold'
                : 'text-slate-700 hover:bg-slate-100/80 font-medium'
            }`}
          >
            <span>Home</span>
          </button>

          <button
            onClick={() => handleNav('about')}
            className={`w-full text-left py-2 px-3 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
              activeSection === 'about'
                ? 'bg-[#F1F5F9] text-[#0284C7] font-bold'
                : 'text-slate-700 hover:bg-slate-100/80 font-medium'
            }`}
          >
            <span>Corporate Factsheet</span>
          </button>

          {/* Expandable Formulations Category */}
          <div>
            <button
              onClick={() => setIsFormulationsExpanded(!isFormulationsExpanded)}
              className={`w-full text-left py-2 px-3 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                activeSection === 'products'
                  ? 'bg-[#F1F5F9] text-[#0284C7] font-bold'
                  : 'text-slate-700 hover:bg-slate-100/80 font-medium'
              }`}
            >
              <span>Therapeutic Formulations</span>
              <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isFormulationsExpanded ? 'rotate-90 text-[#0284C7]' : ''}`} />
            </button>

            {/* Indented Subcategories */}
            {isFormulationsExpanded && (
              <div className="ml-3 pl-3 border-l border-slate-200 space-y-1 my-1">
                <button
                  onClick={() => handleCategoryNav('Pharmaceutical Tablets')}
                  className="w-full text-left py-1.5 px-2 text-[11.5px] text-slate-600 hover:text-[#0284C7] hover:bg-slate-50 rounded-md transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>Pharmaceutical Tablets</span>
                  <span className="text-[10px] text-slate-400 font-mono">3</span>
                </button>
                <button
                  onClick={() => handleCategoryNav('Pharmaceutical Syrup')}
                  className="w-full text-left py-1.5 px-2 text-[11.5px] text-slate-600 hover:text-[#0284C7] hover:bg-slate-50 rounded-md transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>Pharmaceutical Syrup</span>
                  <span className="text-[10px] text-slate-400 font-mono">3</span>
                </button>
                <button
                  onClick={() => handleCategoryNav('Pharmaceutical Capsules')}
                  className="w-full text-left py-1.5 px-2 text-[11.5px] text-slate-600 hover:text-[#0284C7] hover:bg-slate-50 rounded-md transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>Pharmaceutical Capsules</span>
                  <span className="text-[10px] text-slate-400 font-mono">2</span>
                </button>
                <button
                  onClick={() => handleCategoryNav('Pharmaceutical Injectable')}
                  className="w-full text-left py-1.5 px-2 text-[11.5px] text-slate-600 hover:text-[#0284C7] hover:bg-slate-50 rounded-md transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>Pharmaceutical Injectable</span>
                  <span className="text-[10px] text-slate-400 font-mono">1</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => handleNav('flipbook')}
            className={`w-full text-left py-2 px-3 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
              activeSection === 'flipbook'
                ? 'bg-[#F1F5F9] text-[#0284C7] font-bold'
                : 'text-slate-700 hover:bg-slate-100/80 font-medium'
            }`}
          >
            <span>Visual Aid Monograph</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenEnquiry();
            }}
            className="w-full text-left py-2 px-3 rounded-lg flex items-center justify-between transition-colors cursor-pointer text-slate-700 hover:bg-slate-100/80 font-medium"
          >
            <span>B2B Requirement Enquiry</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
              Direct
            </span>
          </button>

          <button
            onClick={() => handleNav('contact')}
            className={`w-full text-left py-2 px-3 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
              activeSection === 'contact'
                ? 'bg-[#F1F5F9] text-[#0284C7] font-bold'
                : 'text-slate-700 hover:bg-slate-100/80 font-medium'
            }`}
          >
            <span>Contact Dossier & Depot</span>
          </button>

          {/* Section Divider 1: Enterprise Portals */}
          <div className="pt-4 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block">
              Enterprise Portals
            </span>
          </div>

          <a
            href="https://reppulse.nlcl.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-left py-2 px-3 rounded-lg flex items-center justify-between transition-colors text-slate-700 hover:bg-slate-100/80 font-medium"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>RepPulse SFA</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <a
            href="https://hrms.nlcl.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-left py-2 px-3 rounded-lg flex items-center justify-between transition-colors text-slate-700 hover:bg-slate-100/80 font-medium"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Apex HRMS</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          {/* Section Divider 2: Trade & Direct Desk */}
          <div className="pt-4 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block">
              Direct Trade Desk
            </span>
          </div>

          <a
            href="https://wa.me/916900700102?text=Hello%20New%20Life%20Care%20Laboratories,%20I%20would%20like%20to%20inquire%20about%20pharmaceutical%20distribution%20and%20product%20MOQ."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-left py-2 px-3 rounded-lg flex items-center justify-between transition-colors text-slate-700 hover:bg-slate-100/80 font-medium"
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Trade Desk</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <a
            href={`tel:${COMPANY_CONFIG.phone}`}
            className="w-full text-left py-2 px-3 rounded-lg flex items-center justify-between transition-colors text-slate-700 hover:bg-slate-100/80 font-medium"
          >
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-teal-600" />
              <span>Helpline ({COMPANY_CONFIG.phone})</span>
            </div>
          </a>

        </div>

        {/* Bottom Statutory Strip */}
        <div className="p-3 border-t border-[#E2E8F0] bg-slate-50/70 text-[10.5px] text-slate-500 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#18A6A6]" />
            <span>WHO-GMP Compliant</span>
          </div>
          <p className="truncate font-mono text-[9.5px]">
            {COMPANY_CONFIG.registrationNumber}
          </p>
        </div>

      </div>
    </div>
  );
};
