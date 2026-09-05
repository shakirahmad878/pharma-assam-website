import React from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowUp, 
  Handshake, 
  ShieldCheck 
} from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { COMPANY_CONFIG } from '../data/companyConfig';

interface EnterpriseFooterProps {
  onNavigate: (sectionId: string) => void;
}

export const EnterpriseFooter: React.FC<EnterpriseFooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { id: 'home', label: 'Overview' },
    { id: 'formulation-lab', label: 'Formulation Studio' },
    { id: 'products', label: 'Portfolio Directory' },
    { id: 'cleanroom-tour', label: 'Cleanroom Suites' },
    { id: 'qc-lab', label: 'Quality & Testing Lab' },
    { id: 'regional-network', label: 'Assam Distribution Network' },
    { id: 'why-partner', label: 'Why Partner With Us' },
    { id: 'visual-aid', label: 'Digital Visual Monograph' },
    { id: 'contact', label: 'B2B RFQ Portal' }
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-white/10">
      
      {/* Top Banner Callout */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 py-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-bold block mb-1">
                Corporate Creed
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                "Let's Build Better Healthcare Together."
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('contact')}
                className="bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-black px-6 py-3 rounded-xl transition-all shadow-md flex items-center space-x-2 text-xs"
              >
                <Handshake className="w-4 h-4" />
                <span>Request Commercial Proposal</span>
              </button>
              <button
                onClick={() => onNavigate('formulation-lab')}
                className="bg-white/10 hover:bg-white/15 text-white font-semibold px-5 py-3 rounded-xl border border-white/15 transition-all text-xs"
              >
                Configure Custom Batch
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Directory Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand & Corporate Overview */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-sm shadow-md">
                <Building2 className="w-5 h-5 text-slate-950" />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">
                {COMPANY_CONFIG.name}
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              {COMPANY_CONFIG.subheadline}
            </p>

            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-white/10 font-mono text-[11px] text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span>Registration ID:</span>
                <strong className="text-emerald-400">{COMPANY_CONFIG.registrationNumber}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Quality Systems:</span>
                <span className="text-cyan-300 font-bold">GMP & ISO Validated</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-mono">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              {navLinks.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className="hover:text-cyan-300 transition-colors flex items-center"
                  >
                    <span className="text-cyan-400 mr-2 font-bold">›</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-mono">
              Product Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.filter(c => c.id !== 'all').map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => onNavigate('products')}
                    className="hover:text-cyan-300 transition-colors flex items-center text-left"
                  >
                    <span className="text-teal-400 mr-2 font-bold">›</span>
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Corporate Headquarters */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-mono">
              Corporate Headquarters
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex items-start space-x-2 text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {COMPANY_CONFIG.registeredAddress}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${COMPANY_CONFIG.phone}`} className="text-slate-200 hover:text-white font-bold font-mono">
                  {COMPANY_CONFIG.phone}
                </a>
              </div>

              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a href={`mailto:${COMPANY_CONFIG.email}`} className="text-cyan-200 hover:underline font-mono">
                  {COMPANY_CONFIG.email}
                </a>
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className="mt-4 w-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white py-2.5 px-3 rounded-xl transition-all flex items-center justify-center space-x-1 font-semibold text-xs shadow-sm border border-white/10"
            >
              <ArrowUp className="w-3.5 h-3.5 mr-1 text-cyan-400" />
              <span>Back to Top</span>
            </button>
          </div>

        </div>

        {/* Regulatory Disclaimer & Legal Notice */}
        <div className="mt-12 pt-6 border-t border-white/10 text-[11px] text-slate-500 space-y-3 leading-relaxed">
          <p>
            <strong>Regulatory Notice:</strong> {COMPANY_CONFIG.name} is a specialized pharmaceutical manufacturing enterprise. All formulations, active ingredients, and packaging materials conform to relevant IP / BP / USP pharmacopoeial monographs. Schedule formulations are supplied to authorized distributors, hospitals, and institutional healthcare networks.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} {COMPANY_CONFIG.name}. All Rights Reserved.</p>
            <p className="font-mono text-slate-400">Assam & North-East B2B Pharmaceutical Manufacturer</p>
          </div>
        </div>

      </div>
    </footer>
  );
};
