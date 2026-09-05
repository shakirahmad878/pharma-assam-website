import React, { useState } from 'react';
import { Send, Eye, Search, Filter, PackageCheck } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { Product, ProductCategory } from '../types';

interface PMProductCatalogProps {
  selectedCategory: ProductCategory | 'All Products';
  onSelectCategory: (category: ProductCategory | 'All Products') => void;
  onSelectProduct: (product: Product) => void;
  onOpenEnquiry: (productName: string) => void;
}

export const PMProductCatalog: React.FC<PMProductCatalogProps> = ({
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  onOpenEnquiry
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter products based on category and search query
  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = selectedCategory === 'All Products' || p.category === selectedCategory;
    const matchesSearch = searchTerm.trim() === '' || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.genericComposition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="products" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#c72828] rounded-full"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#c72828]">
                Standard Formulation Directory
              </span>
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl md:text-4xl font-black text-[#163e61] tracking-tight">
              Latest Products & Formulations
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Explore our verified pharmaceutical product portfolio. Submit an MOQ enquiry for batch supply and distribution pricing.
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search formulations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#163e61] focus:border-transparent shadow-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Category Tabs Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mr-2 flex-shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold">Categories:</span>
          </div>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.label)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 shadow-sm ${
                selectedCategory === cat.label
                  ? 'bg-[#163e61] text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto">
            <p className="text-base font-bold text-slate-700">No products found matching your search.</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting the filter or searching for another molecule name.</p>
            <button
              onClick={() => {
                onSelectCategory('All Products');
                setSearchTerm('');
              }}
              className="mt-4 bg-[#c72828] text-white text-xs font-bold px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-[#163e61]/40"
              >
                {/* Top Half: Image & Badges */}
                <div>
                  {/* Image Container with official styling */}
                  <div 
                    onClick={() => onSelectProduct(product)}
                    className="relative w-full h-56 bg-slate-50 border-b border-slate-100 flex items-center justify-center p-4 cursor-pointer overflow-hidden group-hover:bg-slate-100/60 transition-colors"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                    />

                    {/* Category Label Pill */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm border border-slate-200 text-[#163e61] text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                      {product.category}
                    </div>

                    {/* Monograph Badge */}
                    <div className="absolute top-3 right-3 bg-[#c72828] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                      {product.pharmacopoeiaStandard} Standard
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    {/* Title */}
                    <h3 
                      onClick={() => onSelectProduct(product)}
                      className="text-base font-extrabold text-[#163e61] group-hover:text-[#c72828] transition-colors cursor-pointer line-clamp-1 leading-snug"
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    {/* Structured Specs Table (Exact replica of progressivemolecules.in card table with explicit MOQ) */}
                    <div className="space-y-1.5 text-xs border-t border-slate-100 pt-2.5">
                      <div className="grid grid-cols-12 gap-1 text-[11px]">
                        <span className="col-span-5 text-slate-500 font-semibold">Composition:</span>
                        <span className="col-span-7 font-medium text-slate-800 line-clamp-2" title={product.genericComposition}>
                          {product.genericComposition}
                        </span>
                      </div>

                      <div className="grid grid-cols-12 gap-1 text-[11px]">
                        <span className="col-span-5 text-slate-500 font-semibold">Origin:</span>
                        <span className="col-span-7 font-medium text-slate-800">
                          {product.countryOfOrigin || 'Made In India'}
                        </span>
                      </div>

                      <div className="grid grid-cols-12 gap-1 text-[11px]">
                        <span className="col-span-5 text-slate-500 font-semibold">Packaging Size:</span>
                        <span className="col-span-7 font-medium text-slate-800">
                          {product.packagingSize || product.packaging}
                        </span>
                      </div>

                      <div className="grid grid-cols-12 gap-1 text-[11px]">
                        <span className="col-span-5 text-slate-500 font-semibold">Standard MOQ:</span>
                        <span className="col-span-7 font-bold text-[#c72828]">
                          {product.moq}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions Buttons */}
                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onOpenEnquiry(product.name)}
                    className="bg-[#c72828] hover:bg-red-700 text-white text-xs font-bold py-2 px-3 rounded-lg shadow-sm hover:shadow transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Inquire MOQ</span>
                  </button>

                  <button
                    onClick={() => onSelectProduct(product)}
                    className="bg-[#163e61] hover:bg-slate-800 text-white text-xs font-bold py-2 px-3 rounded-lg shadow-sm hover:shadow transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View More</span>
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
