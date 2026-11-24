import React from 'react';
import { SqueezeCarousel, SqueezeSlide } from './ui/carousel-squeeze';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { Sparkles, ShieldCheck, ArrowRight, Award, FlaskConical } from 'lucide-react';

interface PMSqueezeShowcaseProps {
  onSelectProduct: (product: Product) => void;
  onOpenEnquiry: (productName: string) => void;
  onNavigate: (sectionId: string) => void;
}

export const PMSqueezeShowcase: React.FC<PMSqueezeShowcaseProps> = ({
  onSelectProduct,
  onOpenEnquiry,
  onNavigate
}) => {
  // Helper to find full product by ID
  const getProduct = (id: string) => PRODUCTS.find(p => p.id === id);

  // A sleek floating clinical badge for the corner of the open panel
  const renderBadge = (category: string, code: string) => (
    <div className="flex flex-col gap-1 items-start">
      <span className="text-[10px] font-mono tracking-wider uppercase text-[#137F83] font-bold bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-teal-200/80 shadow-2xs">
        {category}
      </span>
      <span className="text-sm font-black text-[#10243A] tracking-tight bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-md shadow-2xs border border-slate-200/60">
        {code}
      </span>
    </div>
  );

  const slides: SqueezeSlide[] = [
    {
      id: 'lyco-kr-syrup',
      title: 'Lyco-KR Syrup: Sugar-Free Cellular Antioxidant & Convalescence Matrix',
      description: 'Lycopene 10% (2000 IU) + L-Lysine 200mg + Zinc + B-Complex. Defends against oxidative cellular damage and accelerates tissue healing without glycemic impact.',
      action: 'View Formulation Monograph',
      overlay: renderBadge('Nutritional Support', 'Lyco-KR Syrup (200ml)'),
      image: './images/products/lyco-kr-syrup.jpg',
      imageAlt: 'Lyco-KR Syrup 200ml Official Packshot',
      onAction: () => {
        const p = getProduct('lyco-kr-syrup');
        if (p) onSelectProduct(p);
      }
    },
    {
      id: 'life-kr-softgel',
      title: 'Life-KR 1300mg Softgels: Molecular-Distilled Marine Lipids (EPA 360mg + DHA 240mg)',
      description: 'Ultra-pure omega-3 marine fatty acids in bioavailable triglyceride form. Reduces arterial plaque formation, lowers serum triglycerides, and supports cognitive neuro-circuits.',
      action: 'Explore Lipid Profile',
      overlay: renderBadge('Omega-3 Essentials', 'Life-KR 1300mg Softgels'),
      image: './images/products/life-kr-softgel.jpg',
      imageAlt: 'Life-KR 1300mg Softgel Capsules Official Packshot',
      onAction: () => {
        const p = getProduct('life-kr-softgel');
        if (p) onSelectProduct(p);
      }
    },
    {
      id: 'nl-nine-granules',
      title: 'NL-Nine Granules: Utero-Placental Perfusion & Endothelial Nitric Oxide Matrix',
      description: 'L-Arginine 3g + DHA + Proanthocyanidin + Folic Acid + Zinc in 10x5g sachets. Clinically formulated for gestational vascular health and fetal growth restriction.',
      action: 'Inspect Clinical Specs',
      overlay: renderBadge('Nutritional Support', 'NL-Nine Granules (10x5g)'),
      image: './images/products/nl-nine-granules.jpg',
      imageAlt: 'NL-Nine Granules 10x5g Sachets Official Packshot',
      onAction: () => {
        const p = getProduct('nl-nine-granules');
        if (p) onSelectProduct(p);
      }
    },
    {
      id: 'lifekr-raft-suspension',
      title: 'Lifekr-Raft Oral Suspension: Instant 15-Second Mucosal Floating Raft Barrier',
      description: 'Sodium Alginate + Potassium Bicarbonate. Forms an inert physical raft floating on gastric contents within seconds, preventing reflux of acid and pepsin into the esophagus.',
      action: 'View Raft Kinetics',
      overlay: renderBadge('Digestive Wellness', 'Lifekr-Raft Suspension (200ml)'),
      image: './images/products/lifekr-raft-suspension.jpg',
      imageAlt: 'Lifekr-Raft Oral Suspension 200ml Official Packshot',
      onAction: () => {
        const p = getProduct('lifekr-raft-suspension');
        if (p) onSelectProduct(p);
      }
    },
    {
      id: 'glutavia-500',
      title: 'Glutavia-500 Tablets: Pharmaceutical-Grade Reduced L-Glutathione (500mg) + Vitamin C',
      description: 'Pure bio-active intracellular antioxidant promoting Phase-II hepatic detoxification, radical neutralization, and systemic cellular rejuvenation.',
      action: 'Inquire Batch MOQ',
      overlay: renderBadge('Skin Radiance & Energy', 'Glutavia-500 Tablets (30s)'),
      image: './images/products/glutavia-500.jpg',
      imageAlt: 'Glutavia-500 Tablets Official Packshot',
      onAction: () => {
        const p = getProduct('glutavia-500');
        if (p) onSelectProduct(p);
      }
    },
    {
      id: 'esomax-d40',
      title: 'Esomax D40 Capsules: Dual-Phase Enteric Micro-Pellet Acid-Peptic Technology',
      description: 'Esomeprazole 40mg (Delayed Release) + Domperidone 30mg (Sustained Release). Sustained 24-hour intragastric pH control coupled with synchronized prokinetic motility.',
      action: 'Explore Monograph',
      overlay: renderBadge('Digestive Wellness', 'Esomax D40 Capsules (10x15)'),
      image: './images/products/esomax-d40.jpg',
      imageAlt: 'Esomax D40 Capsules 10x15 Alu-Alu Official Packshot',
      onAction: () => {
        const p = getProduct('esomax-d40');
        if (p) onSelectProduct(p);
      }
    },
    {
      id: 'myo-q10-syrup',
      title: 'Myo-Q10 Syrup: Mitochondrial Bio-energetic Resynthesis (Co-Q10 + Myo-Inositol)',
      description: 'Ubiquinone + Myo-Inositol + L-Carnitine + Folic Acid in 225ml. Stimulates cellular ATP synthesis in high-demand cardiac and ovarian tissues while improving insulin receptor signaling.',
      action: 'Request Institutional Quote',
      overlay: renderBadge('Nutritional Support', 'Myo-Q10 Syrup (225ml)'),
      image: './images/products/myo-q10-syrup.jpg',
      imageAlt: 'Myo-Q10 Syrup 225ml Official Packshot',
      onAction: () => {
        const p = getProduct('myo-q10-syrup');
        if (p) onSelectProduct(p);
      }
    }
  ];

  return (
    <section className="relative bg-white py-14 sm:py-20 border-b border-[#DCE4EB] overflow-hidden">
      {/* Precision Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#18A6A6_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18A6A6]/10 border border-[#18A6A6]/20 text-[#137F83] text-xs font-bold tracking-wide uppercase">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Interactive Portfolio Navigator</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#10243A] tracking-tight">
              Flagship Formulations <span className="text-[#18A6A6]">& Delivery Systems</span>
            </h2>
            
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Explore NLCL's therapeutic breakthroughs across clinical nutrition, high-potency marine lipids, and targeted drug delivery. Click or hover any slat to inspect pharmacokinetics and batch dossiers.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('products')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#18A6A6] hover:text-[#137F83] transition-colors"
            >
              <span>View All 13 Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The 21st.dev Squeeze Carousel Component */}
        <div className="bg-slate-50/70 p-4 sm:p-6 lg:p-8 rounded-2xl border border-[#DCE4EB] shadow-xs">
          <SqueezeCarousel
            slides={slides}
            height="clamp(220px, 34cqi, 380px)"
            duration={850}
            gap={16}
            slatGap={8}
            slatWidth={10}
            radius={10}
            hoverGrow={true}
            autoplay={true}
            interval={6500}
            controls={true}
            accent="#18A6A6"
            accentForeground="#ffffff"
            label="NLCL Flagship Pharmaceutical Portfolio"
          />
        </div>

        {/* Trust verification pill */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>All 13 formulations manufactured under certified WHO-GMP & ISO standards</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#18A6A6]" />
            <span>Certificate of Analysis (CoA) & Batch Dossier available on request</span>
          </div>
        </div>

      </div>
    </section>
  );
};
