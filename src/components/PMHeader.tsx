import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Menu, ArrowRight } from 'lucide-react';
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

  const nutritional = PRODUCTS.filter(p => p.category === 'Nutritional Support');
  const omega3 = PRODUCTS.filter(p => p.category === 'Omega-3 Range');
  const digestive = PRODUCTS.filter(p => p.category === 'Digestive Wellness');
  const specialized = PRODUCTS.filter(p => p.category === 'Skin Brightening' || p.category === "Women's & Specialized Wellness" || p.category === 'Cardiovascular & Energy');

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-[#DCE4EB] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Header Row */}
        <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">
          
          {/* Sidebar Menu Trigger & Company Brand Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
            <button
              onClick={onOpenSidebar}
              className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-xl bg-slate-100/90 hover:bg-slate-200 text-slate-900 text-xs font-bold transition-all border border-slate-200 shadow-2xs cursor-pointer active:scale-95"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4 text-[#18A6A6]" />
              <span>Menu</span>
            </button>

            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleNavClick('home')}>
              <img 
                src="./images/nlcl-logo.jpg" 
                alt="NLCL Logo" 
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover shadow-sm flex-shrink-0 border border-slate-200" 
              />
              <div className="flex-shrink-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-lg sm:text-xl font-black tracking-tight text-[#10243A] whitespace-nowrap">
                    NLCL
                  </span>
                  <span className="text-xs font-semibold text-slate-700 whitespace-nowrap hidden 2xl:inline-block">
                    • {COMPANY_CONFIG.name}
                  </span>
                  <span className="text-[10px] font-bold text-[#137F83] bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded tracking-wider uppercase whitespace-nowrap">
                    nlcl.in
                  </span>
                </div>
                <p className="text-[10px] text-[#64748B] font-medium tracking-wide uppercase mt-0.5 whitespace-nowrap hidden sm:block">
                  Creating Health. Inspiring Life.
                </p>
              </div>
            </div>
          </div>

          {/* Compact Modern Navigation Bar (No horizontal overflow) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs backdrop-blur-xs flex-shrink-0">
            
            {/* Home */}
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                activeSection === 'home'
                  ? 'bg-white text-[#10243A] shadow-xs border border-slate-200/80 font-black'
                  : 'text-slate-600 hover:text-[#10243A] hover:bg-white/60'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full transition-opacity ${activeSection === 'home' ? 'bg-[#18A6A6] opacity-100' : 'opacity-0'}`}></span>
              <span>Home</span>
            </button>

            {/* About Us */}
            <button
              onClick={() => handleNavClick('about')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                activeSection === 'about'
                  ? 'bg-white text-[#10243A] shadow-xs border border-slate-200/80 font-black'
                  : 'text-slate-600 hover:text-[#10243A] hover:bg-white/60'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full transition-opacity ${activeSection === 'about' ? 'bg-[#18A6A6] opacity-100' : 'opacity-0'}`}></span>
              <span>About Us</span>
            </button>

            {/* Products Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsProductsMenuOpen(true)}
              onMouseLeave={() => setIsProductsMenuOpen(false)}
            >
              <button
                onClick={() => handleNavClick('products')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                  activeSection === 'products'
                    ? 'bg-white text-[#10243A] shadow-xs border border-slate-200/80 font-black'
                    : 'text-slate-600 hover:text-[#10243A] hover:bg-white/60'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full transition-opacity ${activeSection === 'products' ? 'bg-[#18A6A6] opacity-100' : 'opacity-0'}`}></span>
                <span>Products & Catalog</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isProductsMenuOpen ? 'rotate-180 text-[#18A6A6]' : 'text-slate-400'}`} />
              </button>

              {/* Mega Dropdown Box */}
              {isProductsMenuOpen && (
                <div className="absolute top-full left-0 w-[640px] bg-white rounded-xl shadow-xl border border-[#DCE4EB] p-5 z-50 grid grid-cols-2 gap-4 animate-fadeIn">
                  
                  {/* Category 1: Nutritional Support */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between border-b border-[#DCE4EB] pb-1">
                      <span className="font-bold text-[#10243A] text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#18A6A6]"></span>
                        Nutritional Support
                      </span>
                    </div>
                    <ul className="space-y-1 text-xs">
                      {nutritional.map(p => (
                        <li key={p.id}>
                          <button
                            onClick={() => handleProductClick(p)}
                            className="w-full text-left py-1 px-2 rounded-md hover:bg-[#F1F6F8] hover:text-[#18A6A6] text-[#1E293B] transition-colors flex items-center justify-between group"
                          >
                            <span className="font-medium group-hover:font-semibold">{p.name}</span>
                            <ArrowRight className="w-3 h-3 text-[#64748B] group-hover:text-[#18A6A6]" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Category 2: Omega-3 Range */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between border-b border-[#DCE4EB] pb-1">
                      <span className="font-bold text-[#10243A] text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#18A6A6]"></span>
                        Omega-3 Range
                      </span>
                    </div>
                    <ul className="space-y-1 text-xs">
                      {omega3.map(p => (
                        <li key={p.id}>
                          <button
                            onClick={() => handleProductClick(p)}
                            className="w-full text-left py-1 px-2 rounded-md hover:bg-[#F1F6F8] hover:text-[#18A6A6] text-[#1E293B] transition-colors flex items-center justify-between group"
                          >
                            <span className="font-medium group-hover:font-semibold">{p.name}</span>
                            <ArrowRight className="w-3 h-3 text-[#64748B] group-hover:text-[#18A6A6]" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Category 3: Digestive Wellness */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between border-b border-[#DCE4EB] pb-1">
                      <span className="font-bold text-[#10243A] text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#18A6A6]"></span>
                        Digestive Wellness
                      </span>
                    </div>
                    <ul className="space-y-1 text-xs">
                      {digestive.map(p => (
                        <li key={p.id}>
                          <button
                            onClick={() => handleProductClick(p)}
                            className="w-full text-left py-1 px-2 rounded-md hover:bg-[#F1F6F8] hover:text-[#18A6A6] text-[#1E293B] transition-colors flex items-center justify-between group"
                          >
                            <span className="font-medium group-hover:font-semibold">{p.name}</span>
                            <ArrowRight className="w-3 h-3 text-[#64748B] group-hover:text-[#18A6A6]" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Category 4: Specialized & Skin */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between border-b border-[#DCE4EB] pb-1">
                      <span className="font-bold text-[#10243A] text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#18A6A6]"></span>
                        Specialized & Skin Care
                      </span>
                    </div>
                    <ul className="space-y-1 text-xs">
                      {specialized.map(p => (
                        <li key={p.id}>
                          <button
                            onClick={() => handleProductClick(p)}
                            className="w-full text-left py-1 px-2 rounded-md hover:bg-[#F1F6F8] hover:text-[#18A6A6] text-[#1E293B] transition-colors flex items-center justify-between group"
                          >
                            <span className="font-medium group-hover:font-semibold">{p.name}</span>
                            <ArrowRight className="w-3 h-3 text-[#64748B] group-hover:text-[#18A6A6]" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Dropdown Footer CTA */}
                  <div className="col-span-2 pt-2.5 border-t border-[#DCE4EB] flex items-center justify-between bg-[#F1F6F8] p-2.5 rounded-lg">
                    <span className="text-[11px] text-[#64748B] font-medium">
                      All 13 formulations backed by Certificate of Analysis (CoA)
                    </span>
                    <button
                      onClick={() => handleNavClick('products')}
                      className="text-xs font-bold text-[#18A6A6] hover:text-[#137F83] flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All 13 Products</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              )}
            </div>

            {/* Visual Aid */}
            <button
              onClick={() => handleNavClick('flipbook')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                activeSection === 'flipbook'
                  ? 'bg-white text-[#10243A] shadow-xs border border-slate-200/80 font-black'
                  : 'text-slate-600 hover:text-[#10243A] hover:bg-white/60'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full transition-opacity ${activeSection === 'flipbook' ? 'bg-[#18A6A6] opacity-100' : 'opacity-0'}`}></span>
              <span>Visual Aid</span>
            </button>

            {/* Contact */}
            <button
              onClick={() => handleNavClick('contact')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                activeSection === 'contact'
                  ? 'bg-[#10243A] text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-[#10243A] hover:bg-white/60'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full transition-opacity ${activeSection === 'contact' ? 'bg-[#18A6A6] opacity-100' : 'opacity-0'}`}></span>
              <span>Contact</span>
            </button>
          </nav>

          {/* Quick Search Box */}
          <div className="flex items-center gap-2 flex-shrink-0" ref={searchRef}>
            
            {/* Search Box */}
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
                  className="w-28 sm:w-36 md:w-44 px-2.5 py-1.5 text-xs rounded-l-lg border border-[#DCE4EB] bg-white text-[#1E293B] focus:outline-none focus:ring-1 focus:ring-[#18A6A6] focus:border-[#18A6A6]"
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
                    Matching Products ({filteredSearchResults.length})
                  </div>
                  {filteredSearchResults.length === 0 ? (
                    <div className="text-xs text-[#64748B] py-3 text-center">
                      No matching products found.
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

            {/* Mobile Navigation Trigger Button */}
            <button
              onClick={onOpenSidebar}
              className="flex items-center gap-1.5 bg-[#F1F6F8] hover:bg-[#E8EEF4] text-[#10243A] border border-[#DCE4EB] text-xs font-semibold px-2.5 py-2 rounded-lg shadow-xs transition-all cursor-pointer lg:hidden"
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
