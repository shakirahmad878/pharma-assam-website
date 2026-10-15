import React from 'react';
import { Pill, Phone, Mail, MapPin, ChevronRight, Lock, ShieldCheck } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyConfig';
import { CATEGORIES } from '../data/products';
import { ProductCategory } from '../types';

interface PMFooterProps {
  onNavigate: (sectionId: string) => void;
  onSelectCategory: (category: ProductCategory | 'All Products') => void;
  onOpenPortal?: () => void;
}

export const PMFooter: React.FC<PMFooterProps> = ({
  onNavigate,
  onSelectCategory,
  onOpenPortal
}) => {
  const handleCategoryClick = (categoryLabel: string) => {
    onSelectCategory(categoryLabel as ProductCategory | 'All Products');
    onNavigate('products');
  };

  return (
    <footer className="bg-[#10243A] text-white text-xs border-t-2 border-[#18A6A6]">
      
      {/* Top Footer Strip */}
      <div className="bg-[#0D1C2D] py-6 border-b border-[#182F49]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#182F49] border border-slate-700 flex items-center justify-center text-[#18A6A6] shadow-2xs">
              <Pill className="w-5 h-5 text-[#18A6A6]" />
            </div>
            <div>
              <p className="text-base font-bold tracking-tight text-white">
                {COMPANY_CONFIG.name}
              </p>
              <p className="text-[11px] text-slate-400">
                {COMPANY_CONFIG.registrationNumber}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
            <a 
              href={`tel:${COMPANY_CONFIG.phone}`} 
              className="flex items-center gap-1.5 bg-[#182F49] hover:bg-[#203D5E] border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#18A6A6]" />
              <span>{COMPANY_CONFIG.phone}</span>
            </a>

            <a 
              href={`mailto:${COMPANY_CONFIG.email}`} 
              className="flex items-center gap-1.5 bg-[#182F49] hover:bg-[#203D5E] border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#18A6A6]" />
              <span>{COMPANY_CONFIG.email}</span>
            </a>

            {onOpenPortal && (
              <button
                onClick={onOpenPortal}
                className="flex items-center gap-1.5 bg-[#18A6A6] hover:bg-[#137F83] text-white px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>Field Force Portal</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Corporate Overview */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#18A6A6] pb-1.5 inline-block">
              About {COMPANY_CONFIG.shortName}
            </h4>
            <p className="text-slate-300 leading-relaxed text-xs">
              {COMPANY_CONFIG.subheadline}
            </p>
            <div className="flex items-center gap-1.5 text-teal-400 text-[11px] font-medium pt-1">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>WHO-GMP Quality Benchmark</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#18A6A6] pb-1.5 inline-block">
              Quick Links
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button 
                  onClick={() => onNavigate('home')} 
                  className="hover:text-[#18A6A6] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-[#18A6A6]" />
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('about')} 
                  className="hover:text-[#18A6A6] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-[#18A6A6]" />
                  <span>Corporate Factsheet</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('products')} 
                  className="hover:text-[#18A6A6] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-[#18A6A6]" />
                  <span>Formulation Directory</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('flipbook')} 
                  className="hover:text-[#18A6A6] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-[#18A6A6]" />
                  <span>Visual Aid Monograph</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('contact')} 
                  className="hover:text-[#18A6A6] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-[#18A6A6]" />
                  <span>Contact Dossier</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Product Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#18A6A6] pb-1.5 inline-block">
              Therapeutic Divisions
            </h4>
            <ul className="space-y-2 text-slate-300">
              {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                <li key={cat.id}>
                  <button 
                    onClick={() => handleCategoryClick(cat.label)} 
                    className="hover:text-[#18A6A6] transition-colors flex items-center gap-1 text-left cursor-pointer"
                  >
                    <ChevronRight className="w-3 h-3 text-[#18A6A6]" />
                    <span>{cat.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Registered Address & Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#18A6A6] pb-1.5 inline-block">
              Regional Depot & HQ
            </h4>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#18A6A6] flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{COMPANY_CONFIG.registeredAddress}</span>
              </div>
              <div className="pt-2 text-[11px] text-slate-400">
                Operating Schedule: {COMPANY_CONFIG.operatingHours}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-[#08131F] py-4 border-t border-[#182F49] text-center text-slate-400 text-[11px]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} {COMPANY_CONFIG.name}. All Rights Reserved.</p>
          <p className="text-slate-500">
            Formulations manufactured in compliance with Drugs & Cosmetics Act & IP Monographs.
          </p>
        </div>
      </div>

    </footer>
  );
};
