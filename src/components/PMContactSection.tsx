import React from 'react';
import { MapPin, Phone, Mail, Globe, QrCode, User, Building, Clock } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyConfig';

export const PMContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-[#c72828] uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-200">
            Get In Touch
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-black text-[#163e61] tracking-tight">
            Contact {COMPANY_CONFIG.name}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            For institutional MOQ inquiries, hospital formularies, and authorized regional franchise partnerships in Assam and the North-East.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Official Contact Dossier */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
            
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-[#163e61] flex items-center gap-2">
                <Building className="w-5 h-5 text-[#c72828]" />
                Regional Distribution & Office
              </h3>
              <p className="text-xs text-slate-500">Authorized administrative and supply depot</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              
              {/* Contact Person */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-500 uppercase text-[11px]">
                  <User className="w-3.5 h-3.5 text-[#c72828]" />
                  <span>Enquiry Desk</span>
                </div>
                <p className="text-sm font-bold text-slate-800">Regional Distribution Manager</p>
                <p className="text-slate-500">Commercial & Trade Inquiries</p>
              </div>

              {/* Registered Address */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-500 uppercase text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-[#c72828]" />
                  <span>Central Depot & Office</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                  {COMPANY_CONFIG.registeredAddress}
                </p>
              </div>

              {/* Regional Office */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-500 uppercase text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-[#163e61]" />
                  <span>Regional Coverage</span>
                </div>
                <p className="text-xs font-semibold text-slate-800">
                  {COMPANY_CONFIG.marketsServed}
                </p>
                <p className="text-slate-500">Dedicated North-East Logistics Depot</p>
              </div>

              {/* Operating Hours */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-500 uppercase text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-[#163e61]" />
                  <span>Business Hours</span>
                </div>
                <p className="text-xs font-semibold text-slate-800">
                  {COMPANY_CONFIG.operatingHours}
                </p>
              </div>

              {/* Phone Contacts */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-500 uppercase text-[11px]">
                  <Phone className="w-3.5 h-3.5 text-[#c72828]" />
                  <span>Helpline / Inquiries</span>
                </div>
                <p className="text-sm font-bold text-[#c72828]">
                  <a href={`tel:${COMPANY_CONFIG.phone}`} className="hover:underline">
                    {COMPANY_CONFIG.phone}
                  </a>
                </p>
                <p className="text-slate-500">Monday to Saturday (Trade Hours)</p>
              </div>

              {/* Email Addresses */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-500 uppercase text-[11px]">
                  <Mail className="w-3.5 h-3.5 text-[#c72828]" />
                  <span>Official Email</span>
                </div>
                <p className="text-xs font-bold text-slate-800">
                  <a href={`mailto:${COMPANY_CONFIG.email}`} className="hover:underline">
                    {COMPANY_CONFIG.email}
                  </a>
                </p>
                <p className="text-xs text-slate-600">Quick Response for Trade Enquiries</p>
              </div>

            </div>

            {/* Official Web Links */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Globe className="w-4 h-4 text-[#163e61]" />
                <span>Regional Portal: <strong>Assam & North-East Healthcare</strong></span>
              </div>
              <div className="bg-red-50 text-[#c72828] font-bold px-2.5 py-1 rounded">
                {COMPANY_CONFIG.registrationNumber}
              </div>
            </div>

          </div>

          {/* Right Column: QR Code & Map Embed Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* QR Code Quick Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md flex items-center gap-5">
              <div className="w-24 h-24 bg-slate-900 rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0 shadow p-2">
                <QrCode className="w-16 h-16 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#c72828]">Quick Contact QR</span>
                <h4 className="text-sm font-bold text-[#163e61]">Scan to Save Contact</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Scan using your smartphone camera to instantly save {COMPANY_CONFIG.name} contact details.
                </p>
              </div>
            </div>

            {/* Map Embed Card for Guwahati Assam */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-md">
              <div className="bg-[#163e61] text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between">
                <span>Regional Depot Location</span>
                <span className="text-red-300">Guwahati, Assam</span>
              </div>
              <div className="h-48 bg-slate-200 relative">
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
