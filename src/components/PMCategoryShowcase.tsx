import React from 'react';
import { Pill, FlaskConical, Layers, Syringe, ArrowRight } from 'lucide-react';
import { ProductCategory } from '../types';

interface PMCategoryShowcaseProps {
  onSelectCategory: (category: ProductCategory | 'All Products') => void;
  onNavigate: (sectionId: string) => void;
}

export const PMCategoryShowcase: React.FC<PMCategoryShowcaseProps> = ({
  onSelectCategory,
  onNavigate
}) => {
  const categories = [
    {
      title: 'Pharmaceutical Capsules',
      categoryKey: 'Pharmaceutical Capsules' as ProductCategory,
      count: '3 Products',
      description: 'Advanced softgel lipid carriers & multi-pellet sustained release formulations.',
      productsList: ['Calcibone D3 Softgels', 'PRO-L Q10 Capsules', 'Rabefill DSR Capsules'],
      icon: Pill,
      color: 'from-red-500 to-rose-600',
      borderAccent: 'hover:border-red-500'
    },
    {
      title: 'Pharmaceutical Syrup',
      categoryKey: 'Pharmaceutical Syrup' as ProductCategory,
      count: '4 Products',
      description: 'Stabilized digestive enzymes, lycopene antioxidants & neuro-nutritional suspensions.',
      productsList: ['Lycoreach Syrup', 'Mytro Q10 Syrup', 'Peptin Gold Syrup', 'PRO Carnoshine Syrup'],
      icon: FlaskConical,
      color: 'from-blue-600 to-indigo-700',
      borderAccent: 'hover:border-blue-600'
    },
    {
      title: 'Pharmaceutical Tablets',
      categoryKey: 'Pharmaceutical Tablets' as ProductCategory,
      count: '2 Products',
      description: 'Precision compressed film-coated tablets for metabolic & hepatoprotective care.',
      productsList: ['Ovamain Tablets', 'Ursocure 300 Tablets'],
      icon: Layers,
      color: 'from-amber-500 to-orange-600',
      borderAccent: 'hover:border-amber-500'
    },
    {
      title: 'Pharmaceutical Injectable',
      categoryKey: 'Pharmaceutical Injectable' as ProductCategory,
      count: '1 Product',
      description: 'Sterile lyophilized hospital injectables manufactured in Grade-A cleanrooms.',
      productsList: ['20mg Rabefill IV Injection'],
      icon: Syringe,
      color: 'from-teal-600 to-emerald-700',
      borderAccent: 'hover:border-teal-600'
    }
  ];

  const handleCategoryClick = (catKey: ProductCategory) => {
    onSelectCategory(catKey);
    onNavigate('products');
  };

  return (
    <section className="py-12 md:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#c72828] uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-100">
            Formulation Matrix
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-black text-[#163e61] tracking-tight">
            Our Pharmaceutical Range
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Comprehensive therapeutic formulations strictly manufactured to IP/USP pharmacopoeial monographs and WHO-GMP guidelines.
          </p>
        </div>

        {/* 4 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                onClick={() => handleCategoryClick(cat.categoryKey)}
                className={`bg-slate-50 hover:bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer group ${cat.borderAccent}`}
              >
                <div>
                  {/* Category Icon & Count */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-full">
                      {cat.count}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-[#163e61] group-hover:text-[#c72828] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Product Bullets */}
                  <div className="mt-4 pt-4 border-t border-slate-200/80 space-y-1.5">
                    {cat.productsList.map((item, pIdx) => (
                      <p key={pIdx} className="text-xs text-slate-700 font-medium flex items-center gap-1.5 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c72828]"></span>
                        <span>{item}</span>
                      </p>
                    ))}
                  </div>
                </div>

                {/* View Category Link */}
                <div className="mt-6 pt-3 flex items-center justify-between text-xs font-bold text-[#163e61] group-hover:text-[#c72828] transition-colors">
                  <span>Explore Formulations</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
