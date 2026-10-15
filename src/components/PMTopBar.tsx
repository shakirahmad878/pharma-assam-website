import React from 'react';
import { ShieldCheck, MapPin, Send, MessageCircle, LogIn, Lock } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyConfig';

interface PMTopBarProps {
  onOpenEnquiry: () => void;
  onOpenPortal?: () => void;
}

export const PMTopBar: React.FC<PMTopBarProps> = ({ onOpenEnquiry, onOpenPortal }) => {
  return (
    <div className="bg-[#10243A] text-white text-xs py-2 px-4 border-b border-[#182F49] select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Regulatory Credentials & Geographic Depot */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 font-semibold text-[#18A6A6]">
            <ShieldCheck className="w-4 h-4 text-[#18A6A6] flex-shrink-0" />
            <span className="tracking-wide">DL / GSTIN: {COMPANY_CONFIG.registrationNumber}</span>
          </div>

          <span className="text-slate-500 font-bold hidden sm:inline">•</span>

          <div className="flex items-center gap-1.5 text-slate-300 font-medium hidden sm:flex">
            <MapPin className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
            <span>Guwahati, Assam [CENTRAL WAREHOUSE & DEPOT]</span>
          </div>
        </div>

        {/* Right: Quick Actions & Field Force Portal */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenEnquiry}
            className="flex items-center gap-1 bg-[#18A6A6] text-white font-semibold px-2.5 py-1 rounded shadow-sm hover:bg-[#137F83] transition-colors text-xs cursor-pointer"
          >
            <Send className="w-3 h-3" />
            <span>B2B MOQ Enquiry</span>
          </button>

          <a
            href="https://wa.me/?text=Hello,%20I%20would%20like%20to%20inquire%20about%20your%20pharmaceutical%20product%20MOQ."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-2.5 py-1 rounded shadow-sm transition-colors text-xs"
          >
            <MessageCircle className="w-3 h-3" />
            <span className="hidden sm:inline">WhatsApp Desk</span>
          </a>

          {onOpenPortal && (
            <button
              onClick={onOpenPortal}
              className="flex items-center gap-1.5 bg-[#182F49] hover:bg-[#203D5E] border border-slate-700 text-slate-200 font-semibold px-2.5 py-1 rounded text-xs transition-colors cursor-pointer"
            >
              <Lock className="w-3 h-3 text-[#18A6A6]" />
              <span>SFA Field Force Portal</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
