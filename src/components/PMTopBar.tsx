import React from 'react';
import { Phone, Mail, FileText, Send, MessageCircle } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyConfig';

interface PMTopBarProps {
  onOpenEnquiry: () => void;
}

export const PMTopBar: React.FC<PMTopBarProps> = ({ onOpenEnquiry }) => {
  return (
    <div className="bg-[#c72828] text-white text-xs py-2 px-4 border-b border-red-700 select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: GST & ISO Info */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 font-bold tracking-wider uppercase bg-red-800/60 px-2.5 py-1 rounded">
            <FileText className="w-3.5 h-3.5 text-red-200" />
            <span>GST NO. : {COMPANY_CONFIG.registrationNumber.replace('GST: ', '')}</span>
          </div>
          <span className="hidden sm:inline-block text-red-200 font-medium">
            Manufacturer & Supplier of Quality Pharmaceuticals
          </span>
        </div>

        {/* Right: Phone, Email, Instant Enquiry & WhatsApp */}
        <div className="flex items-center gap-4 flex-wrap">
          <a 
            href={`tel:${COMPANY_CONFIG.phone}`} 
            className="flex items-center gap-1.5 hover:text-red-100 transition-colors font-semibold"
            title="Call Progressive Molecules"
          >
            <Phone className="w-3.5 h-3.5 fill-current text-white" />
            <span>{COMPANY_CONFIG.phone}</span>
          </a>

          <span className="hidden md:inline text-red-300">|</span>

          <a 
            href={`mailto:${COMPANY_CONFIG.email}`} 
            className="hidden md:flex items-center gap-1.5 hover:text-red-100 transition-colors"
            title="Email Progressive Molecules"
          >
            <Mail className="w-3.5 h-3.5 text-white" />
            <span>{COMPANY_CONFIG.email}</span>
          </a>

          <span className="hidden md:inline text-red-300">|</span>

          <button
            onClick={onOpenEnquiry}
            className="flex items-center gap-1 bg-white text-[#c72828] font-bold px-2.5 py-1 rounded shadow-sm hover:bg-slate-100 transition-colors"
          >
            <Send className="w-3 h-3" />
            <span>Send Enquiry</span>
          </button>

          <a
            href={`https://wa.me/916001137678?text=${encodeURIComponent('Hello Progressive Molecules Pvt. Ltd., I would like to inquire about your pharmaceutical products.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded shadow-sm transition-colors"
          >
            <MessageCircle className="w-3 h-3" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
