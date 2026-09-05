import React from 'react';
import { ShieldCheck, MapPin, Send, MessageCircle } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyConfig';

interface PMTopBarProps {
  onOpenEnquiry: () => void;
}

export const PMTopBar: React.FC<PMTopBarProps> = ({ onOpenEnquiry }) => {
  return (
    <div className="bg-[#0b1e33] text-white text-xs py-2 px-4 border-b border-slate-800 select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Exact Style from Screenshot: ShieldCheck + DL/GST + Dot + Location */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-[#00e5c9]">
            <ShieldCheck className="w-4 h-4 text-[#00e5c9] flex-shrink-0" />
            <span>{COMPANY_CONFIG.registrationNumber}</span>
          </div>

          <span className="text-slate-500 font-bold hidden sm:inline">•</span>

          <div className="flex items-center gap-1.5 text-cyan-200 font-medium hidden sm:flex">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <span>Guwahati, Assam [CENTRAL DEPOT]</span>
          </div>
        </div>

        {/* Right: Quick Inquiries & WhatsApp */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={onOpenEnquiry}
            className="flex items-center gap-1 bg-[#00e5c9] text-[#0b1e33] font-bold px-2.5 py-1 rounded shadow-sm hover:bg-cyan-300 transition-colors text-xs"
          >
            <Send className="w-3 h-3" />
            <span>MOQ Enquiry</span>
          </button>

          <a
            href="https://wa.me/?text=Hello,%20I%20would%20like%20to%20inquire%20about%20your%20pharmaceutical%20product%20MOQ."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded shadow-sm transition-colors text-xs"
          >
            <MessageCircle className="w-3 h-3" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
};
