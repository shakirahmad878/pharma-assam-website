import React, { useState, useRef } from 'react';
import { Product } from '../../types';
import { ShieldCheck, CheckCircle2, Sparkles, Award } from 'lucide-react';

interface ProductCard3DProps {
  product: Product;
  onClick?: () => void;
  className?: string;
}

export const ProductCard3D: React.FC<ProductCard3DProps> = ({
  product,
  onClick,
  className = '',
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [glarePos, setGlarePos] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 12; // Max 12deg tilt
    const rotY = ((x - centerX) / centerX) * 12;

    setRotateX(rotX);
    setRotateY(rotY);

    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.25,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      className={`relative select-none ${className}`}
      style={{ perspective: '1200px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* 3D Illuminated Floating Stage Card */}
      <div
        ref={cardRef}
        className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-[#DCE4EB] shadow-[0_20px_50px_-15px_rgba(16,36,58,0.18)] hover:shadow-[0_30px_70px_-15px_rgba(24,166,166,0.25)] transition-all duration-200 ease-out cursor-pointer relative overflow-hidden group"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Dynamic Specular Glare Overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-3xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 65%)`,
            opacity: glarePos.opacity,
          }}
        />

        {/* Ambient Top Glow Border */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#18A6A6] to-transparent opacity-80" />

        {/* Floating Top Z-Layer: Badges & Status */}
        <div
          className="flex items-center justify-between pb-3.5 border-b border-slate-100"
          style={{ transform: 'translateZ(30px)' }}
        >
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-black text-[#137F83] bg-teal-50 px-3 py-1 rounded-full border border-teal-200 uppercase tracking-wider shadow-2xs">
            <Award className="w-3.5 h-3.5 text-[#18A6A6]" />
            {product.badge || 'WHO-GMP Monograph'}
          </span>
          <span className="text-[11px] font-mono font-semibold text-slate-500">
            {product.pharmacopoeiaStandard || 'IP Grade'}
          </span>
        </div>

        {/* Center: 3D Product Visual with Illuminated Holographic Pedestal */}
        <div
          className="relative my-4 flex flex-col items-center justify-center min-h-[260px] sm:min-h-[290px]"
          style={{ transform: 'translateZ(45px)' }}
        >
          {/* 3D Cyan Ambient Glow Behind Box */}
          <div className="absolute w-48 h-48 rounded-full bg-[#18A6A6]/15 blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

          {/* Product Image with High-Res Floating Drop-Shadow */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="max-h-60 sm:max-h-64 max-w-full object-contain filter drop-shadow-[0_15px_25px_rgba(16,36,58,0.25)] group-hover:scale-108 group-hover:-translate-y-2 transition-all duration-300 relative z-10"
          />

          {/* 3D Illuminated Glass Pedestal / Platform Base */}
          <div className="w-44 sm:w-56 h-6 rounded-[100%] bg-gradient-to-r from-transparent via-[#18A6A6]/40 to-transparent blur-xs mt-2" />
          <div className="w-36 sm:w-44 h-3 rounded-[100%] bg-slate-900/15 blur-sm" />
        </div>

        {/* Bottom Floating Information Layer */}
        <div
          className="text-center pt-2 space-y-1.5"
          style={{ transform: 'translateZ(25px)' }}
        >
          <span className="text-[11px] font-bold text-[#18A6A6] uppercase tracking-widest block">
            {product.category}
          </span>
          <h3 className="text-xl font-black text-[#10243A] tracking-tight group-hover:text-[#18A6A6] transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Standard Packaging: {product.packagingSize || product.packaging}
          </p>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs font-bold text-emerald-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Standardized Pharmacopoeial Batch</span>
          </div>
        </div>

        {/* Interactive 3D Hint */}
        <div className="mt-3.5 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 font-medium">
            <Sparkles className="w-3 h-3 text-[#18A6A6]" />
            3D Tilt Enabled
          </span>
          <span className="font-semibold text-[#18A6A6] group-hover:underline">
            Click to View Dossier →
          </span>
        </div>
      </div>
    </div>
  );
};
