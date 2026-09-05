import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Menu, ArrowRight, Building2, Grid } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { COMPANY_CONFIG } from '../data/companyConfig';
import { Product } from '../types';

interface PMHeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onSelectProduct: (product: Product) => void;
  onOpenEnquiry: (productName?: string) => void;
  onOpenSidebar: () => void;
}

export const PMHeader: React.FC<PMHeaderProps> = ({
  activeSection,
  onNavigate,
  onSelectProduct,
  onOpenEnquiry,
  onOpenSidebar
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
    <header className="sticky top-0 z-40 bg-white shadow-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Header Row */}
        <div className="flex items-center justify-between h-20 gap-3 sm:gap-6">
          
          {/* Company Brand Logo & Title */}
          <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="w-11 h-11 rounded-xl bg-[#0b1e33] flex items-center justify-center text-[#00e5c9] shadow-md flex-shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg md:text-xl font-black tracking-tight text-[#0b1e33] whitespace-nowrap">
                  {COMPANY_CONFIG.name}
                </span>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded tracking-wider uppercase whitespace-nowrap hidden sm:inline-block">
                  ASSAM REGIONAL
                </span>
              </div>
              <p className="text-[10px] sm:text-[10.5px] text-slate-500 font-bold tracking-wider uppercase mt-0.5 whitespace-nowrap">
                PHARMACEUTICAL MANUFACTURER & DISTRIBUTOR
              </p>
            </div>
          </div>

          {/* Clean Horizontal Navigation Menu */}
          <nav className="hidden xl:flex items-center gap-1.5 font-bold text-[13.5px] text-slate-700 flex-shrink-0">
            
            {/* Home */}
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-2 rounded-md transition-all whitespace-nowrap ${
                activeSection === 'home'
                  ? 'text-[#c72828] font-extrabold bg-red-50 shadow-sm border border-red-100'
                  : 'hover:text-[#c72828] hover:bg-slate-100'
              }`}
            >
              Home
            </button>

            {/* About Us */}
            <button
              onClick={() => handleNavClick('about')}
              className={`px-3.5 py-2 rounded-md transition-all whitespace-nowrap ${
                activeSection === 'about'
                  ? 'text-[#c72828] font-extrabold bg-red-50 shadow-sm border border-red-100'
                  : 'hover:text-[#c72828] hover:bg-slate-100'
              }`}
            >
              About Us
            </button>

            {/* Products Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsProductsMenuOpen(true)}
              onMouseLeave={() => setIsProductsMenuOpen(false)}
            >
              <button
                onClick={() => handleNavClick('products')}
                className={`px-3.5 py-2 rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeSection === 'products'
                    ? 'text-[#c72828] font-extrabold bg-red-50 shadow-sm border border-red-100'
                    : 'hover:text-[#c72828] hover:bg-slate-100'
                }`}
              >
                <span>Products</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProductsMenuOpen ? 'rotate-180 text-[#c72828]' : 'text-slate-500'}`} />
              </button>

              {/* Mega Dropdown Box */}
              {isProductsMenuOpen && (
                <div className="absolute top-full left-0 w-[680px] bg-white rounded-xl shadow-2xl border border-slate-200 p-6 z-50 grid grid-cols-2 gap-6 animate-fadeIn">
                  
                  {/* Category 1: Capsules */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-red-100 pb-1.5">
                      <span className="font-bold text-[#c72828] text-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#c72828]"></span>
                        Pharmaceutical Capsules
                      </span>
                    </div>
                    <ul className="space-y-1 text-xs">
                      {capsules.map(p => (
                        <li key={p.id}>
                          <button
                            onClick={() => handleProductClick(p)}
                            className="w-full text-left py-1 px-2 rounded hover:bg-red-50 hover:text-[#c72828] text-slate-700 transition-colors flex items-center justify-between group"
                          >
                            <span className="font-medium group-hover:font-semibold">{p.name}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-[#c72828]" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Category 2: Syrups */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-red-100 pb-1.5">
                      <span className="font-bold text-[#c72828] text-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#c72828]"></span>
                        Pharmaceutical Syrup
                      </span>
                    </div>
                    <ul className="space-y-1 text-xs">
                      {syrups.map(p => (
                        <li key={p.id}>
                          <button
                            onClick={() => handleProductClick(p)}
                            className="w-full text-left py-1 px-2 rounded hover:bg-red-50 hover:text-[#c72828] text-slate-700 transition-colors flex items-center justify-between group"
                          >
                            <span className="font-medium group-hover:font-semibold">{p.name}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-[#c72828]" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Category 3: Tablets */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-red-100 pb-1.5">
                      <span className="font-bold text-[#c72828] text-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#c72828]"></span>
                        Pharmaceutical Tablets
                      </span>
                    </div>
                    <ul className="space-y-1 text-xs">
                      {tablets.map(p => (
                        <li key={p.id}>
                          <button
                            onClick={() => handleProductClick(p)}
                            className="w-full text-left py-1 px-2 rounded hover:bg-red-50 hover:text-[#c72828] text-slate-700 transition-colors flex items-center justify-between group"
                          >
                            <span className="font-medium group-hover:font-semibold">{p.name}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-[#c72828]" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Category 4: Injectables */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-red-100 pb-1.5">
                      <span className="font-bold text-[#c72828] text-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#c72828]"></span>
                        Pharmaceutical Injectable
                      </span>
                    </div>
                    <ul className="space-y-1 text-xs">
                      {injectables.map(p => (
                        <li key={p.id}>
                          <button
                            onClick={() => handleProductClick(p)}
                            className="w-full text-left py-1 px-2 rounded hover:bg-red-50 hover:text-[#c72828] text-slate-700 transition-colors flex items-center justify-between group"
                          >
                            <span className="font-medium group-hover:font-semibold">{p.name}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-[#c72828]" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Dropdown Footer CTA */}
                  <div className="col-span-2 pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50 p-2.5 rounded-lg">
                    <span className="text-xs text-slate-500 font-medium">
                      All formulations manufactured in WHO-GMP compliant facilities
                    </span>
                    <button
                      onClick={() => handleNavClick('products')}
                      className="text-xs font-bold text-[#c72828] hover:underline flex items-center gap-1"
                    >
                      <span>View All 10 Formulations</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                </div>
              )}
            </div>

            {/* Flipbook */}
            <button
              onClick={() => handleNavClick('flipbook')}
              className={`px-3.5 py-2 rounded-md transition-all whitespace-nowrap ${
                activeSection === 'flipbook'
                  ? 'text-[#c72828] font-extrabold bg-red-50 shadow-sm border border-red-100'
                  : 'hover:text-[#c72828] hover:bg-slate-100'
              }`}
            >
              Flipbook
            </button>

            {/* Contact Us */}
            <button
              onClick={() => handleNavClick('contact')}
              className={`px-3.5 py-2 rounded-md transition-all whitespace-nowrap ${
                activeSection === 'contact'
                  ? 'text-[#c72828] font-extrabold bg-red-50 shadow-sm border border-red-100'
                  : 'hover:text-[#c72828] hover:bg-slate-100'
              }`}
            >
              Contact Us
            </button>
          </nav>

          {/* Quick Search & Sidebar Navigation Trigger Button */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0" ref={searchRef}>
            
            {/* Search Box */}
            <div className="relative">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchDropdownOpen(true);
                  }}
                  onFocus={() => setIsSearchDropdownOpen(true)}
                  className="w-24 sm:w-36 md:w-44 px-3 py-1.5 text-xs rounded-l-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0b1e33] focus:border-[#0b1e33]"
                />
                <button
                  onClick={() => {
                    if (searchQuery.trim()) {
                      setIsSearchDropdownOpen(true);
                    }
                  }}
                  className="bg-[#0b1e33] text-white px-2.5 py-1.5 text-xs font-bold rounded-r-md hover:bg-slate-800 transition-colors flex items-center justify-center"
                  title="Search"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Search Dropdown */}
              {isSearchDropdownOpen && searchQuery.trim() !== '' && (
                <div className="absolute right-0 top-full mt-1.5 w-72 sm:w-80 bg-white rounded-lg shadow-xl border border-slate-200 p-2 z-50 max-h-80 overflow-y-auto">
                  <div className="text-[11px] font-bold uppercase text-slate-400 px-2 py-1 border-b border-slate-100">
                    Search Results ({filteredSearchResults.length})
                  </div>
                  {filteredSearchResults.length === 0 ? (
                    <div className="text-xs text-slate-500 py-3 text-center">
                      No matching products found.
                    </div>
                  ) : (
                    <ul className="divide-y divide-slate-100">
                      {filteredSearchResults.map(product => (
                        <li key={product.id}>
                          <button
                            onClick={() => handleProductClick(product)}
                            className="w-full text-left p-2 hover:bg-red-50 rounded transition-colors flex items-center gap-2.5"
                          >
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-9 h-9 object-contain bg-white border border-slate-200 rounded p-0.5 flex-shrink-0"
                            />
                            <div className="flex-grow min-w-0">
                              <p className="text-xs font-bold text-[#0b1e33] truncate">{product.name}</p>
                              <p className="text-[11px] text-slate-500 truncate">{product.category}</p>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar Navigation Button (Opens the requested Sidebar Modal) */}
            <button
              onClick={onOpenSidebar}
              className="flex items-center gap-1.5 bg-[#0b1e33] hover:bg-[#163e61] text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm transition-all"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4 text-[#00e5c9]" />
              <span className="hidden sm:inline">Menu</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
