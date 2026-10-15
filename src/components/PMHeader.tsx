import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Menu, ArrowRight, Building2, Lock, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { COMPANY_CONFIG } from '../data/companyConfig';
import { Product } from '../types';

interface PMHeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onSelectProduct: (product: Product) => void;
  onOpenEnquiry: (productName?: string) => void;
  onOpenSidebar: () => void;
  onOpenPortal?: () => void;
}

export const PMHeader: React.FC<PMHeaderProps> = ({
  activeSection,
  onNavigate,
  onSelectProduct,
  onOpenEnquiry,
  onOpenSidebar,
  onOpenPortal
}) => {
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const capsules = PRODUCTS.filter(p => p.category === 'Pharmaceutical Capsules');
  const syrups = PRODUCTS.filter(p => p.category === 'Pharmaceutical Syrup');
  const tablets = PRODUCTS.filter(p => p.category === 'Pharmaceutical Tablets');
  const injectables = PRODUCTS.filter(p => p.category === 'Pharmaceutical Injectable');

  const filteredSearchResults = searchQuery.trim() === '' ? [] : PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.genericComposition.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProductClick = (product: Product) => {
    setIsProductsMenuOpen(false);
    setIsSearchDropdownOpen(false);
    onSelectProduct(product);
  };

  const handleNavClick = (sectionId: string) => {
    setIsProductsMenuOpen(false);
    onNavigate(sectionId);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-[#DCE4EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Header Row */}
        <div className="flex items-center justify-between h-20 gap-3 sm:gap-6">
          
          {/* Company Brand Logo & Title */}
          <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="w-11 h-11 rounded-xl bg-[#10243A] flex items-center justify-center text-[#18A6A6] shadow-sm flex-shrink-0 border border-[#182F49]">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-[#10243A] whitespace-nowrap">
                  {COMPANY_CONFIG.name}
                </span>
                <span className="text-[10px] font-semibold text-[#137F83] bg-[#E8EEF4] border border-[#DCE4EB] px-2 py-0.5 rounded tracking-wider uppercase whitespace-nowrap hidden sm:inline-block">
                  PHARMACEUTICALS
                </span>
              </div>
              <p className="text-[10.5px] text-[#64748B] font-medium tracking-wide uppercase mt-0.5 whitespace-nowrap">
                WHO-GMP COMPLIANT FORMULATIONS & DISTRIBUTION
              </p>
            </div>
          </div>

          {/* Clean Horizontal Navigation Menu */}
          <nav className="hidden xl:flex items-center gap-1 font-semibold text-[13.5px] text-[#1E293B] flex-shrink-0">
            
            {/* Home */}
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeSection === 'home'
                  ? 'text-[#10243A] bg-[#F1F6F8] font-bold border-b-2 border-[#18A6A6]'
                  : 'hover:text-[#18A6A6] hover:bg-[#F5F8FA]'
              }`}
            >
              Home
            </button>

            {/* About Us */}
            <button
              onClick={() => handleNavClick('about')}
              className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeSection === 'about'
                  ? 'text-[#10243A] bg-[#F1F6F8] font-bold border-b-2 border-[#18A6A6]'
                  : 'hover:text-[#18A6A6] hover:bg-[#F5F8FA]'
              }`}
            >
              Corporate Factsheet
            </button>

            {/* Products Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsProductsMenuOpen(true)}
              onMouseLeave={() => setIsProductsMenuOpen(false)}
            >
              <button
                onClick={() => handleNavClick('products')}
                className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeSection === 'products'
                    ? 'text-[#10243A] bg-[#F1F6F8] font-bold border-b-2 border-[#18A6A6]'
                    : 'hover:text-[#18A6A6] hover:bg-[#F5F8FA]'
                }`}
              >
                <span>Therapeutic Formulations</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProductsMenuOpen ? 'rotate-180 text-[#18A6A6]' : 'text-[#64748B]'}`} />
              </button>

              {/* Mega Dropdown Box */}
              {isProductsMenuOpen && (
                <div className="absolute top-full left-0 w-[680px] bg-white rounded-xl shadow-xl border border-[#DCE4EB] p-6 z-50 grid grid-cols-2 gap-6 animate-fadeIn">
                  
                  {/* Category 1: Capsules */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-[#DCE4EB] pb-1.5">
                      <span className="font-bold text-[#10243A] text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#18A6A6]"></span>
                        Pharmaceutical Capsules
                      </span>
                    </div>
                    <ul className="space-y-1 text-xs">
                      {capsules.map(p => (
                        <li key={p.id}>
                          <button
                            onClick={() => handleProductClick(p)}
                            className="w-full text-left py-1.5 px-2 rounded-md hover:bg-[#F1F6F8] hover:text-[#18A6A6] text-[#1E293B] transition-colors flex items-center justify-between group"
                          >
                            <span className="font-medium group-hover:font-semibold">{p.name}</span>
                            <ArrowRight className="w-3 h-3 text-[#64748B] group-hover:text-[#18A6A6]" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Category 2: Syrups */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-[#DCE4EB] pb-1.5">
                      <span className="font-bold text-[#10243A] text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#18A6A6]"></span>
                        Pharmaceutical Syrup
                      </span>
                    </div>
                    <ul className="space-y-1 text-xs">
                      {syrups.map(p => (
                        <li key={p.id}>
                          <button
                            onClick={() => handleProductClick(p)}
                            className="w-full text-left py-1.5 px-2 rounded-md hover:bg-[#F1F6F8] hover:text-[#18A6A6] text-[#1E293B] transition-colors flex items-center justify-between group"
                          >
                            <span className="font-medium group-hover:font-semibold">{p.name}</span>
                            <ArrowRight className="w-3 h-3 text-[#64748B] group-hover:text-[#18A6A6]" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Category 3: Tablets */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-[#DCE4EB] pb-1.5">
                      <span className="font-bold text-[#10243A] text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#18A6A6]"></span>
                        Pharmaceutical Tablets
                      </span>
                    </div>
                    <ul className="space-y-1 text-xs">
                      {tablets.map(p => (
                        <li key={p.id}>
                          <button
                            onClick={() => handleProductClick(p)}
                            className="w-full text-left py-1.5 px-2 rounded-md hover:bg-[#F1F6F8] hover:text-[#18A6A6] text-[#1E293B] transition-colors flex items-center justify-between group"
                          >
                            <span className="font-medium group-hover:font-semibold">{p.name}</span>
                            <ArrowRight className="w-3 h-3 text-[#64748B] group-hover:text-[#18A6A6]" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Category 4: Injectables */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-[#DCE4EB] pb-1.5">
                      <span className="font-bold text-[#10243A] text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#18A6A6]"></span>
                        Pharmaceutical Injectable
                      </span>
                    </div>
                    <ul className="space-y-1 text-xs">
                      {injectables.map(p => (
                        <li key={p.id}>
                          <button
                            onClick={() => handleProductClick(p)}
                            className="w-full text-left py-1.5 px-2 rounded-md hover:bg-[#F1F6F8] hover:text-[#18A6A6] text-[#1E293B] transition-colors flex items-center justify-between group"
                          >
                            <span className="font-medium group-hover:font-semibold">{p.name}</span>
                            <ArrowRight className="w-3 h-3 text-[#64748B] group-hover:text-[#18A6A6]" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Dropdown Footer CTA */}
                  <div className="col-span-2 pt-3 border-t border-[#DCE4EB] flex items-center justify-between bg-[#F1F6F8] p-3 rounded-lg">
                    <span className="text-xs text-[#64748B] font-medium">
                      All 10 formulations backed by Certificate of Analysis (CoA)
                    </span>
                    <button
                      onClick={() => handleNavClick('products')}
                      className="text-xs font-bold text-[#18A6A6] hover:text-[#137F83] flex items-center gap-1 cursor-pointer"
                    >
                      <span>Explore Full Catalog</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              )}
            </div>

            {/* Flipbook / Visual Aid */}
            <button
              onClick={() => handleNavClick('flipbook')}
              className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeSection === 'flipbook'
                  ? 'text-[#10243A] bg-[#F1F6F8] font-bold border-b-2 border-[#18A6A6]'
                  : 'hover:text-[#18A6A6] hover:bg-[#F5F8FA]'
              }`}
            >
              Visual Aid Monograph
            </button>

            {/* Contact Us */}
            <button
              onClick={() => handleNavClick('contact')}
              className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeSection === 'contact'
                  ? 'text-[#10243A] bg-[#F1F6F8] font-bold border-b-2 border-[#18A6A6]'
                  : 'hover:text-[#18A6A6] hover:bg-[#F5F8FA]'
              }`}
            >
              Contact Dossier
            </button>
          </nav>

          {/* Quick Search & SFA Portal Action Button */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0" ref={searchRef}>
            
            {/* Search Box */}
            <div className="relative">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search formulations..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchDropdownOpen(true);
                  }}
                  onFocus={() => setIsSearchDropdownOpen(true)}
                  className="w-28 sm:w-40 md:w-48 px-3 py-1.5 text-xs rounded-l-lg border border-[#DCE4EB] bg-white text-[#1E293B] focus:outline-none focus:ring-1 focus:ring-[#18A6A6] focus:border-[#18A6A6]"
                />
                <button
                  onClick={() => {
                    if (searchQuery.trim()) {
                      setIsSearchDropdownOpen(true);
                    }
                  }}
                  className="bg-[#10243A] text-white px-2.5 py-1.5 text-xs font-semibold rounded-r-lg hover:bg-[#182F49] transition-colors flex items-center justify-center cursor-pointer"
                  title="Search"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Search Dropdown */}
              {isSearchDropdownOpen && searchQuery.trim() !== '' && (
                <div className="absolute right-0 top-full mt-1.5 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-[#DCE4EB] p-2 z-50 max-h-80 overflow-y-auto">
                  <div className="text-[11px] font-bold uppercase text-[#64748B] px-2 py-1 border-b border-[#DCE4EB]">
                    Matching Formulations ({filteredSearchResults.length})
                  </div>
                  {filteredSearchResults.length === 0 ? (
                    <div className="text-xs text-[#64748B] py-3 text-center">
                      No matching formulations found.
                    </div>
                  ) : (
                    <ul className="divide-y divide-[#DCE4EB]">
                      {filteredSearchResults.map(product => (
                        <li key={product.id}>
                          <button
                            onClick={() => handleProductClick(product)}
                            className="w-full text-left p-2 hover:bg-[#F1F6F8] rounded-lg transition-colors flex items-center gap-2.5"
                          >
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-9 h-9 object-contain bg-white border border-[#DCE4EB] rounded p-0.5 flex-shrink-0"
                            />
                            <div className="flex-grow min-w-0">
                              <p className="text-xs font-bold text-[#10243A] truncate">{product.name}</p>
                              <p className="text-[11px] text-[#64748B] truncate">{product.category}</p>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* SFA Portal Action Button */}
            {onOpenPortal && (
              <button
                onClick={onOpenPortal}
                className="hidden md:flex items-center gap-1.5 bg-[#10243A] hover:bg-[#182F49] text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-xs transition-all border border-[#182F49] cursor-pointer"
                title="Open SFA RepPulse Field Portal"
              >
                <Lock className="w-3.5 h-3.5 text-[#18A6A6]" />
                <span>Field Portal</span>
              </button>
            )}

            {/* Mobile Navigation Trigger Button */}
            <button
              onClick={onOpenSidebar}
              className="flex items-center gap-1.5 bg-[#F1F6F8] hover:bg-[#E8EEF4] text-[#10243A] border border-[#DCE4EB] text-xs font-semibold px-2.5 py-2 rounded-lg shadow-xs transition-all cursor-pointer xl:hidden"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4 text-[#18A6A6]" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
