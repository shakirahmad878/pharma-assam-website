import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShieldCheck, Award, ArrowRight, Send, PackageCheck, CheckCircle2 } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';

interface PMHeroSliderProps {
  onSelectProduct: (product: Product) => void;
  onOpenEnquiry: (productName: string) => void;
  onNavigate: (sectionId: string) => void;
}

export const PMHeroSlider: React.FC<PMHeroSliderProps> = ({
  onSelectProduct,
  onOpenEnquiry,
  onNavigate
}) => {
  // We showcase 6 featured formulations from the catalog
  const featuredIds = [
    'rabefill-dsr-capsules',
    'lycoreach-syrup',
    'ovamain-tablets',
    '20mg-rabefill-iv-injection',
    'calcibone-d3-softgel-capsules',
    'pro-l-q10-capsules'
  ];

  const slides = PRODUCTS.filter(p => featuredIds.includes(p.id));
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide rotation every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  const current = slides[currentSlide] || slides[0];

  return (
    <div className="relative bg-gradient-to-b from-[#F5F8FA] via-white to-[#F1F6F8] border-b border-[#DCE4EB] overflow-hidden">
      
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#18A6A6]/20 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#10243A]/10 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[460px]">
          
          {/* Left Column: Formulation Information */}
          <div className="lg:col-span-7 space-y-5 animate-fadeIn">
            
            {/* Top Clinical Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-[#E8EEF4] text-[#10243A] border border-[#DCE4EB] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-[#18A6A6]" />
                WHO-GMP Certified Formulation
              </span>
              <span className="inline-flex items-center gap-1.5 bg-teal-50 text-[#137F83] border border-teal-200 text-xs font-medium px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-[#18A6A6]" />
                {current.category}
              </span>
              <span className="text-xs font-medium text-[#64748B] bg-white border border-[#DCE4EB] px-2.5 py-1 rounded-full shadow-2xs">
                Pharmacopoeia: {current.pharmacopoeiaStandard}
              </span>
            </div>

            {/* Product Title & Composition */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#10243A] tracking-tight leading-tight">
                {current.name}
              </h1>
              <p className="mt-3 text-base sm:text-lg font-medium text-[#1E293B] leading-relaxed border-l-4 border-[#18A6A6] pl-3.5 bg-white/60 py-1 rounded-r">
                {current.genericComposition}
              </p>
            </div>

            {/* Key Specs Matrix with Packaging & Standard MOQ */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-white p-3.5 rounded-xl border border-[#DCE4EB] shadow-2xs">
                <p className="text-[10.5px] uppercase tracking-wider text-[#64748B] font-bold">Packaging Standard</p>
                <p className="text-sm font-bold text-[#10243A] mt-0.5">{current.packagingSize || current.packaging}</p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-[#DCE4EB] shadow-2xs">
                <p className="text-[10.5px] uppercase tracking-wider text-[#64748B] font-bold">Minimum Order Qty</p>
                <p className="text-sm font-bold text-[#18A6A6] mt-0.5 flex items-center gap-1">
                  <PackageCheck className="w-3.5 h-3.5" />
                  {current.moq}
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-[#DCE4EB] shadow-2xs col-span-2 sm:col-span-1">
                <p className="text-[10.5px] uppercase tracking-wider text-[#64748B] font-bold">Storage / Stability</p>
                <p className="text-sm font-bold text-[#10243A] mt-0.5">{current.storageCondition || 'Store below 25°C'}</p>
              </div>
            </div>

            {/* Indication / Therapeutic Use */}
            <p className="text-xs sm:text-sm text-[#64748B] line-clamp-2 leading-relaxed">
              <span className="font-semibold text-[#1E293B]">Therapeutic Indication: </span>
              {current.indication}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenEnquiry(current.name)}
                className="bg-[#18A6A6] hover:bg-[#137F83] text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Inquire B2B MOQ & Quote</span>
              </button>

              <button
                onClick={() => onSelectProduct(current)}
                className="bg-[#10243A] hover:bg-[#182F49] text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>View Full Formulation Dossier</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('products')}
                className="text-[#10243A] hover:text-[#18A6A6] hover:bg-white font-semibold text-sm px-4 py-2.5 rounded-xl border border-[#DCE4EB] bg-[#F1F6F8] transition-all cursor-pointer"
              >
                Browse All Formulations
              </button>
            </div>

          </div>

          {/* Right Column: High-Resolution Product Visual Showcase */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            
            {/* Backdrop clinical card */}
            <div 
              onClick={() => onSelectProduct(current)}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-[#DCE4EB] hover:border-[#18A6A6] p-6 flex flex-col items-center justify-center cursor-pointer group transition-all duration-300 max-w-sm w-full relative"
            >
              {/* Product Badge Pill */}
              <div className="w-full flex items-center justify-between pb-3 border-b border-[#DCE4EB] mb-2">
                <span className="text-[10px] font-bold text-[#137F83] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 uppercase">
                  Batch Tested
                </span>
                <span className="text-[10.5px] font-medium text-[#64748B]">
                  Origin: {current.countryOfOrigin || 'India'}
                </span>
              </div>

              {/* Product Image */}
              <div className="relative w-full h-64 sm:h-72 flex items-center justify-center p-3 overflow-hidden bg-[#F5F8FA] rounded-xl border border-[#E8EEF4]">
                <img
                  src={current.imageUrl}
                  alt={current.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 filter drop-shadow-sm"
                />
              </div>

              {/* Card Label */}
              <div className="w-full mt-4 text-center">
                <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">{current.category}</p>
                <p className="text-base font-bold text-[#10243A] group-hover:text-[#18A6A6] transition-colors mt-0.5">{current.name}</p>
                <div className="flex items-center justify-center gap-1.5 mt-2 text-xs font-semibold text-[#18A6A6]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Pharmacopoeial Grade</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Carousel Slider Controls */}
        <div className="mt-8 flex items-center justify-between border-t border-[#DCE4EB] pt-4">
          
          {/* Slide Indicator Dots & Titles */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap cursor-pointer ${
                  idx === currentSlide
                    ? 'bg-[#10243A] text-white font-semibold shadow-xs'
                    : 'bg-white text-[#64748B] hover:bg-[#E8EEF4] border border-[#DCE4EB] font-medium'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${idx === currentSlide ? 'bg-[#18A6A6]' : 'bg-[#CBD5E1]'}`}></span>
                <span>{s.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-lg bg-white border border-[#DCE4EB] text-[#1E293B] hover:bg-[#18A6A6] hover:text-white hover:border-[#18A6A6] transition-colors shadow-2xs cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-lg bg-white border border-[#DCE4EB] text-[#1E293B] hover:bg-[#18A6A6] hover:text-white hover:border-[#18A6A6] transition-colors shadow-2xs cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
