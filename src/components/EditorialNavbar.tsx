import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Menu, 
  X, 
  MapPin, 
  FileSpreadsheet, 
  Handshake, 
  Phone, 
  ShieldCheck 
} from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyConfig';

interface EditorialNavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenSearch: () => void;
  onOpenEnquiry: (productName?: string) => void;
  rfqCount: number;
  onOpenRfqDrawer: () => void;
}

export const EditorialNavbar: React.FC<EditorialNavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenSearch,
  onOpenEnquiry,
  rfqCount,
  onOpenRfqDrawer
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Overview' },
    { id: 'about', label: 'Company' },
    { id: 'products', label: 'Products' },
    { id: 'calculator', label: 'Batch Studio' },
    { id: 'manufacturing', label: 'Manufacturing' },
    { id: 'quality', label: 'Quality & QC' },
    { id: 'regional-network', label: 'Assam Network' },
    { id: 'why-partner', label: 'Why Partner' },
    { id: 'contact', label: 'RFQ Portal' }
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full">
      
      {/* Top Corporate Credential Bar */}
      <div className="bg-[#0f2b48] text-slate-200 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="w-full max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          
          <div className="flex items-center space-x-3 sm:space-x-5 text-[11px] sm:text-xs">
            <span className="flex items-center text-teal-300 font-semibold whitespace-nowrap">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-teal-400 shrink-0" />
              <span>{COMPANY_CONFIG.registrationNumber}</span>
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline text-slate-300 truncate max-w-xs xl:max-w-md">
              <MapPin className="w-3 h-3 inline mr-1 text-teal-300" />
              {COMPANY_CONFIG.headquarters}
            </span>
            <span className="hidden lg:inline text-slate-500">•</span>
            <span className="hidden lg:inline text-emerald-300 font-mono font-bold whitespace-nowrap">
              WHO-GMP & CDSCO Standards
            </span>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <a 
              href={`tel:${COMPANY_CONFIG.phone}`} 
              className="flex items-center text-slate-200 hover:text-white transition-colors font-mono text-xs font-semibold whitespace-nowrap"
            >
              <Phone className="w-3 h-3 mr-1 text-teal-300 shrink-0" /> {COMPANY_CONFIG.phone}
            </a>

            <span className="hidden sm:inline text-slate-600">|</span>

            {/* Regional Badge */}
            <span className="inline-flex items-center space-x-1 text-slate-300 text-[11px] font-medium bg-white/10 px-2.5 py-0.5 rounded border border-white/15 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1" />
              <span>Assam & North-East Supply</span>
            </span>

          </div>

        </div>
      </div>

      {/* Main Bright Navigation Bar */}
      <div className={`bg-white transition-all duration-300 border-b ${
        isScrolled 
          ? 'shadow-md border-slate-200 py-2.5 sm:py-3' 
          : 'border-slate-200/80 py-3 sm:py-4'
      }`}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            
            {/* Brand Title */}
            <div 
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group select-none shrink-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0f2b48] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform border border-slate-700 shrink-0">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300" />
              </div>

              <div className="whitespace-nowrap">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <span className="text-sm sm:text-base lg:text-lg font-black tracking-tight text-[#0f2b48] group-hover:text-teal-700 transition-colors whitespace-nowrap">
                    {COMPANY_CONFIG.name}
                  </span>
                  <span className="hidden sm:inline-flex items-center text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 uppercase tracking-wider whitespace-nowrap">
                    Assam Pharma
                  </span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-wider whitespace-nowrap">
                  Pharmaceutical Manufacturer & Distributor
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden 2xl:flex items-center space-x-3 3xl:space-x-5 text-xs font-bold text-slate-700 shrink-0">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`py-1.5 px-1 transition-colors relative whitespace-nowrap ${
                      isActive
                        ? 'text-[#0f2b48] font-black'
                        : 'text-slate-600 hover:text-[#0f2b48]'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#0f2b48] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Action Tools */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              
              {/* Search Button */}
              <button
                onClick={onOpenSearch}
                className="p-2 sm:px-3 sm:py-2.5 rounded-xl text-slate-600 hover:text-[#0f2b48] bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center space-x-1.5 text-xs font-semibold whitespace-nowrap shrink-0"
                title="Search products (⌘K)"
              >
                <Search className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="hidden lg:inline text-slate-600">Search</span>
                <kbd className="hidden 2xl:inline bg-white text-slate-500 px-1.5 py-0.5 rounded text-[10px] font-mono border border-slate-200">⌘K</kbd>
              </button>

              {/* Requisition Cart Button */}
              <button
                onClick={onOpenRfqDrawer}
                className="relative px-3 py-2 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 transition-all flex items-center space-x-1.5 text-xs font-bold whitespace-nowrap shrink-0"
                title="View RFQ Requisition Cart"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#0f2b48] shrink-0" />
                <span className="hidden md:inline">RFQ Cart</span>
                {rfqCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#0f2b48] text-white text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                    {rfqCount}
                  </span>
                )}
              </button>

              {/* Partner CTA */}
              <button
                onClick={() => onOpenEnquiry('Assam PCD Franchise / Hospital Supply')}
                className="hidden md:flex bg-[#0f2b48] hover:bg-[#0a192f] text-white font-extrabold text-xs px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-md transition-all hover:scale-[1.02] items-center space-x-1.5 whitespace-nowrap shrink-0"
              >
                <Handshake className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                <span>Partner With Us</span>
              </button>

              {/* Responsive Menu Toggle (Visible on screens < 2xl) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="2xl:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 shrink-0 flex items-center justify-center"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>

          {/* Mobile/Tablet Adaptive Drawer */}
          {mobileMenuOpen && (
            <div className="2xl:hidden pt-4 pb-3 border-t border-slate-200 mt-3 space-y-1.5 animate-fadeIn">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pb-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`text-left py-2 px-3 rounded-xl text-xs font-bold transition-colors ${
                      activeSection === item.id
                        ? 'bg-slate-100 text-[#0f2b48]'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-100 flex sm:hidden">
                <button
                  onClick={() => {
                    onOpenEnquiry('Assam PCD Franchise / Hospital Supply');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-[#0f2b48] text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5"
                >
                  <Handshake className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Partner With Us</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

    </header>
  );
};
