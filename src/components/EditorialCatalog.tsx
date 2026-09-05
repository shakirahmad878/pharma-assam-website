import React, { useState, useMemo } from 'react';
import { 
  Pill, 
  Search, 
  FileText, 
  Plus, 
  CheckCircle2, 
  Send, 
  Sparkles 
} from 'lucide-react';
import { PRODUCTS, CATEGORIES, THERAPEUTIC_SEGMENTS } from '../data/products';
import { Product, TherapeuticSegment } from '../types';

interface EditorialCatalogProps {
  onOpenDetails: (product: Product) => void;
  onOpenEnquiry: (productName?: string) => void;
  onAddToRfq: (product: Product) => void;
}

export const EditorialCatalog: React.FC<EditorialCatalogProps> = ({
  onOpenDetails,
  onOpenEnquiry,
  onAddToRfq
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSegment, setSelectedSegment] = useState<TherapeuticSegment>('All Segments');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [addedNotification, setAddedNotification] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory = 
        selectedCategory === 'all' || 
        (selectedCategory === 'tablets' && product.category === 'Tablets') ||
        (selectedCategory === 'capsules' && product.category === 'Capsules') ||
        (selectedCategory === 'syrups' && product.category === 'Syrups & Suspensions') ||
        (selectedCategory === 'injectables' && product.category === 'Injectables') ||
        (selectedCategory === 'nutraceuticals' && product.category === 'Nutraceuticals & Specialty');

      const matchesSegment = 
        selectedSegment === 'All Segments' || product.therapeuticSegment === selectedSegment;

      const query = searchFilter.toLowerCase().trim();
      const matchesSearch = 
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.genericComposition.toLowerCase().includes(query) ||
        product.indication.toLowerCase().includes(query) ||
        product.dosageForm.toLowerCase().includes(query) ||
        product.activeMolecules.some(m => m.toLowerCase().includes(query));

      return matchesCategory && matchesSegment && matchesSearch;
    });
  }, [selectedCategory, selectedSegment, searchFilter]);

  const handleAdd = (product: Product) => {
    onAddToRfq(product);
    setAddedNotification(product.name);
    setTimeout(() => {
      setAddedNotification(null);
    }, 2500);
  };

  return (
    <section id="products" className="py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 bg-white text-[#0f2b48] px-4 py-1.5 rounded-full text-xs font-bold border border-slate-300 shadow-sm mb-3">
            <Pill className="w-4 h-4 text-teal-700" />
            <span>Standardized Formulation Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f2b48] tracking-tight">
            Pharmaceutical Product <span className="text-teal-700">Directory</span>
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            Browse our formulation directory spanning Tablets, Softgels, Capsules, Oral Liquids, and Sterile Injectables manufactured under strict pharmacopeial assay standards.
          </p>
        </div>

        {/* Multi-Dimensional Filter Control Bar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-300 shadow-sm mb-10 space-y-4">
          
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Category Filter Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#0f2b48] text-white shadow-sm font-black'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input Box */}
            <div className="relative w-full lg:w-80 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search active molecule (e.g. CoQ10, Rabeprazole)..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#0f2b48] text-slate-900 font-medium placeholder:text-slate-400"
              />
            </div>

          </div>

          {/* Secondary Filter: Therapeutic Segment Selector */}
          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 max-w-full">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] shrink-0 font-mono">
                Therapeutic Area:
              </span>
              {THERAPEUTIC_SEGMENTS.slice(0, 5).map((segment) => (
                <button
                  key={segment}
                  onClick={() => setSelectedSegment(segment)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 ${
                    selectedSegment === segment
                      ? 'bg-teal-100 text-teal-800 font-bold border border-teal-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {segment}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3 text-slate-500 text-[11px] font-mono">
              <span>Showing <strong>{filteredProducts.length}</strong> active formulations</span>
              {(searchFilter || selectedCategory !== 'all' || selectedSegment !== 'All Segments') && (
                <button
                  onClick={() => {
                    setSearchFilter('');
                    setSelectedCategory('all');
                    setSelectedSegment('All Segments');
                  }}
                  className="text-teal-700 font-bold hover:underline"
                >
                  Reset Filters
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Added Notification Toast */}
        {addedNotification && (
          <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono font-semibold flex items-center justify-between animate-fadeIn shadow-sm">
            <span className="flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
              Added <strong>"{addedNotification}"</strong> to your RFQ Requisition Cart.
            </span>
            <span className="text-[10px] text-slate-500 font-sans">Open RFQ Cart in header to submit</span>
          </div>
        )}

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-300 space-y-4">
            <Pill className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-700">No matching formulations found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We provide custom contract formulation and scalable manufacturing capabilities. Contact our team with your molecule requirements.
            </p>
            <button
              onClick={() => onOpenEnquiry('Custom Formulation Request')}
              className="bg-[#0f2b48] hover:bg-[#0a192f] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors"
            >
              Submit Custom Formulation Request
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-[#0f2b48]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Top & Body */}
                <div className="p-6 sm:p-7 space-y-4">
                  
                  {/* Category & Badges */}
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-[#0f2b48] border border-slate-200">
                      {product.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {product.pharmacopoeiaStandard} Standard
                    </span>
                  </div>

                  {/* Product Title */}
                  <h3 
                    onClick={() => onOpenDetails(product)}
                    className="text-lg font-bold text-[#0f2b48] group-hover:text-teal-700 cursor-pointer transition-colors leading-snug"
                  >
                    {product.name}
                  </h3>

                  <div className="text-xs text-slate-500 font-mono">
                    {product.therapeuticSegment}
                  </div>

                  {/* Generic Salt Composition Card */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1 font-mono">
                      Active Composition:
                    </span>
                    <p className="text-xs font-mono text-slate-800 leading-relaxed line-clamp-2 font-medium">
                      {product.genericComposition}
                    </p>
                  </div>

                  {/* Dosage & Packaging Metadata */}
                  <div className="space-y-1.5 text-xs text-slate-600 font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-sans">Dosage Form:</span>
                      <strong className="text-slate-800 font-bold">{product.dosageForm}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-sans">Packaging:</span>
                      <span className="text-slate-700 truncate max-w-[180px]">{product.packaging}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-sans">Batch MOQ:</span>
                      <span className="text-[#0f2b48] font-bold">{product.moq}</span>
                    </div>
                  </div>

                  {/* Indication Summary */}
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-2 border-t border-slate-100">
                    {product.indication}
                  </p>

                </div>

                {/* Card Bottom Actions */}
                <div className="p-5 pt-3 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onOpenDetails(product)}
                    className="flex-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center space-x-1 shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>View TDS</span>
                  </button>

                  <button
                    onClick={() => handleAdd(product)}
                    className="bg-slate-100 hover:bg-slate-200 text-[#0f2b48] border border-slate-300 text-xs font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center space-x-1"
                    title="Add to RFQ Requisition Cart"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to RFQ</span>
                  </button>

                  <button
                    onClick={() => onOpenEnquiry(product.name)}
                    className="bg-[#0f2b48] hover:bg-[#0a192f] text-white text-xs font-extrabold p-2.5 rounded-xl transition-all shadow-sm"
                    title="Instant Quote"
                  >
                    <Send className="w-4 h-4 text-cyan-300" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
