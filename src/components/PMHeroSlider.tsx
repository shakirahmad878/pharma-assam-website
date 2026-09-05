import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShieldCheck, Award, ArrowRight, Send } from 'lucide-react';
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
  // We showcase 5 featured products from the catalog
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

  // Auto slide rotation every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  const current = slides[currentSlide];

  return (
    <div className="relative bg-gradient-to-b from-slate-50 via-white to-slate-100 border-b border-slate-200 overflow-hidden">
      
      {/* Background Decorative Graphic */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#163e61]"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#c72828]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[420px]">
          
          {/* Left Column: Product Information */}
          <div className="lg:col-span-7 space-y-5 animate-fadeIn">
            
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-red-100 text-[#c72828] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" />
                Featured Formulation
              </span>
              <span className="inline-flex items-center gap-1 bg-blue-100 text-[#163e61] text-xs font-semibold px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                {current.category}
              </span>
              <span className="text-xs font-medium text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-full shadow-sm">
                Origin: {current.countryOfOrigin || 'India'}
              </span>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#163e61] tracking-tight leading-tight">
                {current.name}
              </h1>
              <p className="mt-2 text-base sm:text-lg font-medium text-slate-700 leading-relaxed border-l-4 border-[#c72828] pl-3">
                {current.genericComposition}
              </p>
            </div>

            {/* Key Specs Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Dosage Form</p>
                <p className="text-sm font-bold text-slate-800">{current.dosageForm}</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Packaging Size</p>
                <p className="text-sm font-bold text-slate-800">{current.packagingSize || current.packaging}</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Standard</p>
                <p className="text-sm font-bold text-slate-800">{current.pharmacopoeiaStandard} Monograph</p>
              </div>
            </div>

            {/* Indication / Therapeutic Use */}
            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
              <span className="font-semibold text-slate-800">Therapeutic Focus: </span>
              {current.indication}
            </p>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenEnquiry(current.name)}
                className="bg-[#c72828] hover:bg-red-700 text-white font-bold text-sm px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Enquiry Now</span>
              </button>

              <button
                onClick={() => onSelectProduct(current)}
                className="bg-[#163e61] hover:bg-slate-800 text-white font-bold text-sm px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>View Full Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('products')}
                className="text-slate-700 hover:text-[#c72828] font-semibold text-sm px-4 py-3 rounded-lg border border-slate-300 hover:border-red-300 bg-white transition-all"
              >
                Explore All Products
              </button>
            </div>

          </div>

          {/* Right Column: High-Resolution Product Visual Showcase */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            
            {/* Backdrop glow */}
            <div className="absolute w-72 h-72 rounded-full bg-red-100/60 blur-3xl -z-10"></div>

            {/* Product Card Showcase Box */}
            <div 
              onClick={() => onSelectProduct(current)}
              className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 flex flex-col items-center justify-center cursor-pointer group hover:shadow-2xl transition-all duration-300 max-w-sm w-full"
            >
              <div className="relative w-full h-64 sm:h-72 flex items-center justify-center p-2 overflow-hidden">
                <img
                  src={current.imageUrl}
                  alt={current.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 filter drop-shadow-md"
                />
              </div>

              {/* Card Label */}
              <div className="w-full mt-4 pt-3 border-t border-slate-100 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{current.category}</p>
                <p className="text-base font-extrabold text-[#163e61] group-hover:text-[#c72828] transition-colors">{current.name}</p>
                <p className="text-xs text-slate-500 mt-1">{current.packaging}</p>
              </div>
            </div>

          </div>

        </div>

        {/* Carousel Slider Controls (Left/Right & Indicators) */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-200/60 pt-4">
          
          {/* Slide Indicator Dots & Titles */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                  idx === currentSlide
                    ? 'bg-[#163e61] text-white font-bold shadow'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200 font-medium'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${idx === currentSlide ? 'bg-red-400' : 'bg-slate-400'}`}></span>
                <span>{s.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-white border border-slate-300 text-slate-700 hover:bg-[#c72828] hover:text-white hover:border-[#c72828] transition-colors shadow-sm"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-white border border-slate-300 text-slate-700 hover:bg-[#c72828] hover:text-white hover:border-[#c72828] transition-colors shadow-sm"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
