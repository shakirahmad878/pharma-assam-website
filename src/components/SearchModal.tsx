import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Pill, 
  ArrowRight
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { COMPANY_CONFIG } from '../data/companyConfig';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const searchResults = PRODUCTS.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.genericComposition.toLowerCase().includes(q) ||
      p.indication.toLowerCase().includes(q) ||
      p.dosageForm.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.therapeuticSegment.toLowerCase().includes(q) ||
      p.activeMolecules.some(m => m.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-start justify-center p-4 pt-16 sm:pt-24 animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 bg-white border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 ml-2 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search molecule (e.g. CoQ10, Rabeprazole, Lycopene) or indication..."
            className="w-full py-2 text-sm text-slate-900 focus:outline-none placeholder:text-slate-400 font-medium"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
          >
            Esc
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-2">
          {searchResults.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs space-y-2">
              <Pill className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No formulations found matching "{query}"</p>
              <p className="text-slate-400 text-[11px]">Try searching by active salt name or therapeutic segment</p>
            </div>
          ) : (
            searchResults.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="p-3.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="space-y-1 max-w-[85%]">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-tealbrand-700 uppercase font-mono">{product.dosageForm}</span>
                    <span className="text-xs text-slate-300">•</span>
                    <span className="text-[11px] text-slate-500">{product.category}</span>
                    <span className="text-xs text-slate-300">•</span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
                      {product.pharmacopoeiaStandard}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-pharma-900 group-hover:text-tealbrand-600 transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-xs text-slate-600 font-mono truncate">
                    {product.genericComposition}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-[11px] font-mono text-slate-400 group-hover:text-slate-600 hidden sm:inline">
                    View Specs
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-pharma-900 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Tag Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>{searchResults.length} Formulations in catalog</span>
          <span className="font-semibold text-pharma-900">{COMPANY_CONFIG.name}</span>
        </div>

      </div>
    </div>
  );
};
