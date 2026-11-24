import React from 'react';
import { Pill, FlaskConical, Sparkles, Heart, ShieldCheck, ArrowRight } from 'lucide-react';
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
      title: 'Nutritional Support',
      categoryKey: 'Nutritional Support' as ProductCategory,
      count: '2 Formulations',
      description: 'High-potency antioxidant carotenoids, essential amino acids & maternal vital micronutrients.',
      productsList: ['Lyco-KR Syrup (200ml)', 'NL-Nine Granules (10x5g)'],
      icon: FlaskConical,
    },
    {
      title: 'Omega-3 Essentials',
      categoryKey: 'Omega-3 Range' as ProductCategory,
      count: '3 Formulations',
      description: 'Molecularly distilled EPA & DHA in Softgels, Liquid Syrup & Pediatric Dropper Bottles.',
      productsList: ['Life-KR Softgel (1300mg)', 'Life-KR Syrup (150ml)', 'Life-KR Drops (30ml)'],
      icon: Pill,
    },
    {
      title: 'Digestive Wellness',
      categoryKey: 'Digestive Wellness' as ProductCategory,
      count: '4 Formulations',
      description: 'Proteolytic enzymes, alginate anti-reflux raft barrier, enteric PPI & H2 acid suppressors.',
      productsList: ['Zymocare Syrup (200ml)', 'Lifekr-Raft Oral Suspension', 'Esomax D40', 'Ran-Life Solution'],
      icon: ShieldCheck,
    },
    {
      title: 'Skin Radiance & Energy',
      categoryKey: 'Skin Brightening' as ProductCategory,
      count: '4 Formulations',
      description: 'Master antioxidant L-Glutathione brightening, mitochondrial CoQ10 & intimate health.',
      productsList: ['Glutavia-250', 'Glutavia-500', 'Myo-Q10 Syrup', 'Borifemina Vaginal Tabs'],
      icon: Sparkles,
    }
  ];

  const handleCategoryClick = (catKey: ProductCategory) => {
    onSelectCategory(catKey);
    onNavigate('products');
  };

  return (
    <section className="py-12 md:py-16 bg-[#F5F8FA] border-b border-[#DCE4EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#137F83] uppercase tracking-widest bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200">
            Therapeutic Divisions
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#10243A] tracking-tight">
            Our Core Product Portfolio
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#64748B]">
            Formulations manufactured strictly to IP/BP/USP pharmacopoeial monographs and WHO-GMP quality assurance guidelines.
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
                className="bg-white hover:bg-white rounded-xl border border-[#DCE4EB] hover:border-[#18A6A6] p-6 flex flex-col justify-between transition-all duration-300 shadow-2xs hover:shadow-md cursor-pointer group"
              >
                <div>
                  {/* Category Icon & Count */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#10243A] group-hover:bg-[#18A6A6] text-white flex items-center justify-center shadow-xs transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-[#64748B] bg-[#F1F6F8] border border-[#DCE4EB] px-2.5 py-0.5 rounded-full">
                      {cat.count}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-[#10243A] group-hover:text-[#18A6A6] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#64748B] leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Product Bullets */}
                  <div className="mt-4 pt-4 border-t border-[#F1F6F8] space-y-1.5">
                    {cat.productsList.map((prod, pIdx) => (
                      <div key={pIdx} className="flex items-center gap-1.5 text-xs text-[#1E293B] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#18A6A6] flex-shrink-0"></span>
                        <span className="truncate">{prod}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer Link */}
                <div className="mt-6 pt-3 border-t border-[#F1F6F8] flex items-center justify-between text-xs font-bold text-[#18A6A6] group-hover:text-[#137F83]">
                  <span>Explore Division</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
