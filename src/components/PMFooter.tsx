import React from 'react';
import { Pill, Phone, Mail, MapPin, Globe, ChevronRight } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyConfig';
import { CATEGORIES } from '../data/products';
import { ProductCategory } from '../types';

interface PMFooterProps {
  onNavigate: (sectionId: string) => void;
  onSelectCategory: (category: ProductCategory | 'All Products') => void;
}

export const PMFooter: React.FC<PMFooterProps> = ({
  onNavigate,
  onSelectCategory
}) => {
  const handleCategoryClick = (categoryLabel: string) => {
    onSelectCategory(categoryLabel as ProductCategory | 'All Products');
    onNavigate('products');
  };

  return (
    <footer className="bg-[#102436] text-white text-xs border-t-4 border-[#c72828]">
      
      {/* Top Footer Strip */}
      <div className="bg-[#0b1723] py-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#c72828] flex items-center justify-center text-white">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <p className="text-base font-bold tracking-tight text-white">
                Progressive Molecules Pvt. Ltd.
              </p>
              <p className="text-[11px] text-slate-400">
                GST NO. : {COMPANY_CONFIG.registrationNumber.replace('GST: ', '')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <a 
              href={`tel:${COMPANY_CONFIG.phone}`} 
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-[#c72828] px-3 py-1.5 rounded transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-red-400" />
              <span>{COMPANY_CONFIG.phone}</span>
            </a>

            <a 
              href={`mailto:${COMPANY_CONFIG.email}`} 
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-[#c72828] px-3 py-1.5 rounded transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-red-400" />
              <span>{COMPANY_CONFIG.email}</span>
            </a>

            <div className="bg-slate-800/80 px-3 py-1.5 rounded text-slate-400 font-mono text-[11px]">
              Visitor No. : 162,747
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Corporate Overview */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-red-500 pb-1.5 inline-block">
              About Progressive Molecules
            </h4>
            <p className="text-slate-300 leading-relaxed text-xs">
              Progressive Molecules Pvt. Ltd. is a thriving manufacturer and supplier of pharmaceutical capsules, syrups, tablets, and injectables conforming strictly to IP/USP pharmacopoeial monographs and WHO-GMP standards.
            </p>
            <p className="text-slate-400 text-[11px]">
              Distributing across Assam, North-East, Maharashtra, and Pan-India.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-red-500 pb-1.5 inline-block">
              Quick Links
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button 
                  onClick={() => onNavigate('home')} 
                  className="hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-red-400" />
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('about')} 
                  className="hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-red-400" />
                  <span>About Us</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('products')} 
                  className="hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-red-400" />
                  <span>Products Directory</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('flipbook')} 
                  className="hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-red-400" />
                  <span>Flipbook / Visual Aid</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('contact')} 
                  className="hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-red-400" />
                  <span>Contact Us</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Product Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-red-500 pb-1.5 inline-block">
              Product Categories
            </h4>
            <ul className="space-y-2 text-slate-300">
              {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                <li key={cat.id}>
                  <button 
                    onClick={() => handleCategoryClick(cat.label)} 
                    className="hover:text-red-400 transition-colors flex items-center gap-1 text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-red-400" />
                    <span>{cat.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Registered Address & Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-red-500 pb-1.5 inline-block">
              Contact Address
            </h4>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{COMPANY_CONFIG.registeredAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-red-400 flex-shrink-0" />
                <a href="https://www.progressivemolecules.in" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  www.progressivemolecules.in
                </a>
              </div>
              <div className="pt-2 text-[11px] text-slate-400">
                Authorized Directors: Mrs. Anupriya Deb, Sandeep Kumar Mollick, Priya Banik
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-[#070e17] py-4 border-t border-slate-800 text-center text-slate-400 text-[11px]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Progressive Molecules Pvt. Ltd. All Rights Reserved.</p>
          <p className="text-slate-500">
            Compliant with Drugs & Cosmetics Act and Indian Pharmacopoeia Standards.
          </p>
        </div>
      </div>

    </footer>
  );
};
