import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Menu, X, ArrowRight, Pill } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { COMPANY_CONFIG } from '../data/companyConfig';
import { Product } from '../types';

interface PMHeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onSelectProduct: (product: Product) => void;
  onOpenEnquiry: (productName?: string) => void;
}

export const PMHeader: React.FC<PMHeaderProps> = ({
  activeSection,
  onNavigate,
  onSelectProduct,
  onOpenEnquiry
}) => {
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // Close search dropdown on click outside
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
    setIsMobileMenuOpen(false);
    setIsSearchDropdownOpen(false);
    onSelectProduct(product);
  };

  const handleNavClick = (sectionId: string) => {
    setIsProductsMenuOpen(false);
    setIsMobileMenuOpen(false);
    onNavigate(sectionId);
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Company Brand Logo & Title */}
          <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#c72828] to-[#163e61] flex items-center justify-center text-white shadow-md p-2">
              <Pill className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black tracking-tight text-[#163e61] leading-tight">
                {COMPANY_CONFIG.shortName} <span className="text-[#c72828] text-lg font-bold">Laboratories</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide uppercase">
                Assam Regional Formulations & Supply
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 font-semibold text-sm text-slate-700">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-2 rounded-md transition-colors ${
                activeSection === 'home' ? 'text-[#c72828] font-bold bg-red-50' : 'hover:text-[#c72828] hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`px-3.5 py-2 rounded-md transition-colors ${
                activeSection === 'about' ? 'text-[#c72828] font-bold bg-red-50' : 'hover:text-[#c72828] hover:bg-slate-50'
              }`}
            >
              About Us
            </button>

            {/* Products Mega Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsProductsMenuOpen(true)}
              onMouseLeave={() => setIsProductsMenuOpen(false)}
            >
              <button
                onClick={() => handleNavClick('products')}
                className={`px-3.5 py-2 rounded-md transition-colors flex items-center gap-1 ${
                  activeSection === 'products' ? 'text-[#c72828] font-bold bg-red-50' : 'hover:text-[#c72828] hover:bg-slate-50'
                }`}
              >
                <span>Products</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
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

            <button
              onClick={() => handleNavClick('flipbook')}
              className={`px-3.5 py-2 rounded-md transition-colors ${
                activeSection === 'flipbook' ? 'text-[#c72828] font-bold bg-red-50' : 'hover:text-[#c72828] hover:bg-slate-50'
              }`}
            >
              Flipbook
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`px-3.5 py-2 rounded-md transition-colors ${
                activeSection === 'contact' ? 'text-[#c72828] font-bold bg-red-50' : 'hover:text-[#c72828] hover:bg-slate-50'
              }`}
            >
              Contact Us
            </button>
          </nav>

          {/* Quick Search & Mobile Toggle */}
          <div className="flex items-center gap-2" ref={searchRef}>
            {/* Search Input Bar */}
            <div className="relative">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchDropdownOpen(true);
                  }}
                  onFocus={() => setIsSearchDropdownOpen(true)}
                  className="w-36 sm:w-48 md:w-60 px-3 py-1.5 text-xs rounded-l-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#163e61] focus:border-[#163e61]"
                />
                <button
                  onClick={() => {
                    if (searchQuery.trim()) {
                      setIsSearchDropdownOpen(true);
                    }
                  }}
                  className="bg-[#163e61] text-white px-3 py-1.5 text-xs font-bold rounded-r-md hover:bg-slate-800 transition-colors flex items-center justify-center"
                  title="Search"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Instant Search Results Dropdown */}
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
                              <p className="text-xs font-bold text-[#163e61] truncate">{product.name}</p>
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

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-slate-700 hover:text-[#c72828] hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2 shadow-xl animate-fadeIn">
          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-red-50 hover:text-[#c72828] rounded-md"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-red-50 hover:text-[#c72828] rounded-md"
          >
            About Us
          </button>
          <button
            onClick={() => handleNavClick('products')}
            className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-red-50 hover:text-[#c72828] rounded-md"
          >
            All Products (10 Formulations)
          </button>
          
          <div className="pl-4 space-y-1 text-xs text-slate-600 border-l-2 border-red-200 my-2">
            <p className="font-bold text-[#c72828] uppercase text-[10px] tracking-wider mb-1">Categories</p>
            <p onClick={() => handleNavClick('products')} className="cursor-pointer hover:text-[#c72828] py-1">• Pharmaceutical Capsules (3)</p>
            <p onClick={() => handleNavClick('products')} className="cursor-pointer hover:text-[#c72828] py-1">• Pharmaceutical Syrup (4)</p>
            <p onClick={() => handleNavClick('products')} className="cursor-pointer hover:text-[#c72828] py-1">• Pharmaceutical Tablets (2)</p>
            <p onClick={() => handleNavClick('products')} className="cursor-pointer hover:text-[#c72828] py-1">• Pharmaceutical Injectable (1)</p>
          </div>

          <button
            onClick={() => handleNavClick('flipbook')}
            className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-red-50 hover:text-[#c72828] rounded-md"
          >
            Flipbook / Visual Aid
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-red-50 hover:text-[#c72828] rounded-md"
          >
            Contact Us
          </button>

          <div className="pt-3 border-t border-slate-200">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenEnquiry();
              }}
              className="w-full bg-[#c72828] text-white py-2.5 rounded-lg text-xs font-bold shadow hover:bg-red-700 transition-colors"
            >
              Submit MOQ Enquiry
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
