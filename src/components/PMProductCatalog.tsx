import React, { useState } from 'react';
import { Send, Eye, Search, Filter, PackageCheck, ShieldCheck } from 'lucide-react';
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
    <section id="products" className="py-16 bg-white border-b border-[#DCE4EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#18A6A6] rounded-full"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#137F83]">
                Formulation Dossier & Directory
              </span>
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#10243A] tracking-tight">
              Commercial Pharmaceutical Formulations
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-2xl">
              Explore verified formulations manufactured under WHO-GMP compliance. Submit an MOQ inquiry for regional distribution and hospital supply pricing.
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search by molecule or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#DCE4EB] bg-[#F5F8FA] focus:bg-white text-[#1E293B] focus:outline-none focus:ring-1 focus:ring-[#18A6A6] focus:border-[#18A6A6] shadow-2xs transition-colors"
            />
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Category Tabs Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] mr-2 flex-shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#18A6A6]" />
            <span className="font-semibold">Therapeutic Class:</span>
          </div>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.label)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
                selectedCategory === cat.label
                  ? 'bg-[#10243A] text-white shadow-xs'
                  : 'bg-[#F5F8FA] text-[#64748B] hover:bg-[#E8EEF4] hover:text-[#10243A] border border-[#DCE4EB]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-[#F5F8FA] rounded-2xl p-12 text-center border border-[#DCE4EB] shadow-2xs max-w-lg mx-auto">
            <p className="text-base font-bold text-[#10243A]">No formulations found matching criteria.</p>
            <p className="text-xs text-[#64748B] mt-1">Try resetting the filter or searching for another molecule or therapeutic category.</p>
            <button
              onClick={() => {
                onSelectCategory('All Products');
                setSearchTerm('');
              }}
              className="mt-4 bg-[#10243A] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#182F49] transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-[#DCE4EB] hover:border-[#18A6A6] shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Top Half: Image & Badges */}
                <div>
                  {/* Image Container */}
                  <div 
                    onClick={() => onSelectProduct(product)}
                    className="relative w-full h-56 bg-[#F5F8FA] border-b border-[#E8EEF4] flex items-center justify-center p-4 cursor-pointer overflow-hidden group-hover:bg-[#E8EEF4]/60 transition-colors"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
                    />

                    {/* Category Label Pill */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs border border-[#DCE4EB] text-[#10243A] text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-2xs">
                      {product.category}
                    </div>

                    {/* Monograph Badge */}
                    <div className="absolute top-3 right-3 bg-[#10243A] text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-2xs">
                      {product.pharmacopoeiaStandard}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    {/* Title */}
                    <h3 
                      onClick={() => onSelectProduct(product)}
                      className="text-base font-bold text-[#10243A] group-hover:text-[#18A6A6] transition-colors cursor-pointer line-clamp-1 leading-snug"
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    {/* Structured Specs Table */}
                    <div className="space-y-1.5 text-xs border-t border-[#F1F6F8] pt-2.5">
                      <div className="grid grid-cols-12 gap-1 text-[11px]">
                        <span className="col-span-5 text-[#64748B] font-semibold">Active:</span>
                        <span className="col-span-7 font-medium text-[#1E293B] line-clamp-2" title={product.genericComposition}>
                          {product.genericComposition}
                        </span>
                      </div>

                      <div className="grid grid-cols-12 gap-1 text-[11px]">
                        <span className="col-span-5 text-[#64748B] font-semibold">Packaging:</span>
                        <span className="col-span-7 font-medium text-[#1E293B]">
                          {product.packagingSize || product.packaging}
                        </span>
                      </div>

                      <div className="grid grid-cols-12 gap-1 text-[11px]">
                        <span className="col-span-5 text-[#64748B] font-semibold">Standard MOQ:</span>
                        <span className="col-span-7 font-bold text-[#18A6A6]">
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
                    className="bg-[#18A6A6] hover:bg-[#137F83] text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Inquire MOQ</span>
                  </button>

                  <button
                    onClick={() => onSelectProduct(product)}
                    className="bg-[#10243A] hover:bg-[#182F49] text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
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
