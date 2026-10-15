import React from 'react';
import { MapPin, Phone, Mail, Globe, QrCode, User, Building, Clock } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyConfig';

export const PMContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-16 bg-[#F5F8FA] border-b border-[#DCE4EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-[#137F83] uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Regional Logistics & HQ
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#10243A] tracking-tight">
            Contact & Depot Dossier
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#64748B]">
            Commercial distribution center, hospital rate contract office, and regional warehouse facility in Guwahati, Assam.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Official Contact Dossier */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-[#DCE4EB] shadow-xs space-y-6">
            
            <div className="border-b border-[#DCE4EB] pb-4">
              <h3 className="text-lg font-bold text-[#10243A] flex items-center gap-2">
                <Building className="w-5 h-5 text-[#18A6A6]" />
                Regional Distribution Center & Corporate Office
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">Licensed administrative headquarters and supply depot</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              
              {/* Contact Person */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#64748B] uppercase text-[11px]">
                  <User className="w-3.5 h-3.5 text-[#18A6A6]" />
                  <span>Trade Desk</span>
                </div>
                <p className="text-sm font-bold text-[#10243A]">Regional Distribution Desk</p>
                <p className="text-[#64748B]">Institutional & B2B Inquiries</p>
              </div>

              {/* Registered Address */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#64748B] uppercase text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-[#18A6A6]" />
                  <span>Central Depot & HQ</span>
                </div>
                <p className="text-xs font-semibold text-[#1E293B] leading-relaxed">
                  {COMPANY_CONFIG.registeredAddress}
                </p>
              </div>

              {/* Regional Office */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#64748B] uppercase text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-[#10243A]" />
                  <span>Territory Reach</span>
                </div>
                <p className="text-xs font-semibold text-[#1E293B]">
                  {COMPANY_CONFIG.marketsServed}
                </p>
                <p className="text-[#64748B]">Dedicated North-East Hubs</p>
              </div>

              {/* Operating Hours */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#64748B] uppercase text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-[#10243A]" />
                  <span>Operating Schedule</span>
                </div>
                <p className="text-xs font-semibold text-[#1E293B]">
                  {COMPANY_CONFIG.operatingHours}
                </p>
              </div>

              {/* Phone Contacts */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#64748B] uppercase text-[11px]">
                  <Phone className="w-3.5 h-3.5 text-[#18A6A6]" />
                  <span>Helpline / Order Desk</span>
                </div>
                <p className="text-sm font-bold text-[#10243A]">
                  <a href={`tel:${COMPANY_CONFIG.phone}`} className="hover:text-[#18A6A6] transition-colors">
                    {COMPANY_CONFIG.phone}
                  </a>
                </p>
                <p className="text-[#64748B]">Mon to Sat (Trade Hours)</p>
              </div>

              {/* Email Addresses */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#64748B] uppercase text-[11px]">
                  <Mail className="w-3.5 h-3.5 text-[#18A6A6]" />
                  <span>Official Communications</span>
                </div>
                <p className="text-xs font-bold text-[#10243A]">
                  <a href={`mailto:${COMPANY_CONFIG.email}`} className="hover:text-[#18A6A6] transition-colors">
                    {COMPANY_CONFIG.email}
                  </a>
                </p>
                <p className="text-xs text-[#64748B]">Commercial quotation response &lt; 24h</p>
              </div>

            </div>

            {/* Official Web Links */}
            <div className="pt-4 border-t border-[#DCE4EB] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-[#64748B]">
                <Globe className="w-4 h-4 text-[#10243A]" />
                <span>Regional Network: <strong className="text-[#10243A]">Assam & North-East Healthcare</strong></span>
              </div>
              <div className="bg-[#E8EEF4] text-[#10243A] font-semibold px-2.5 py-1 rounded-lg border border-[#DCE4EB]">
                {COMPANY_CONFIG.registrationNumber}
              </div>
            </div>

          </div>

          {/* Right Column: QR Code & Map Embed Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* QR Code Quick Card */}
            <div className="bg-white rounded-2xl p-6 border border-[#DCE4EB] shadow-xs flex items-center gap-5">
              <div className="w-24 h-24 bg-[#10243A] rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0 shadow-xs p-2">
                <QrCode className="w-16 h-16 text-[#18A6A6]" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#137F83]">Digital Contact Card</span>
                <h4 className="text-sm font-bold text-[#10243A]">Save Corporate Contact</h4>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  Scan via camera to instantly save {COMPANY_CONFIG.name} trade contacts into your address book.
                </p>
              </div>
            </div>

            {/* Map Embed Card for Guwahati Assam */}
            <div className="bg-white rounded-2xl overflow-hidden border border-[#DCE4EB] shadow-xs">
              <div className="bg-[#10243A] text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between">
                <span>Central Supply Depot</span>
                <span className="text-[#18A6A6]">Guwahati, Assam</span>
              </div>
              <div className="h-48 bg-slate-100 relative">
                <iframe
                  title="Google Maps Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114624.46788572455!2d91.6669!3d26.1445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375a5a287f9133ff%3A0x2bbd1332436bde32!2sGuwahati%2C%20Assam!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
