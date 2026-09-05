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
            Contact Progressive Molecules Pvt. Ltd.
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            For institutional orders, hospital formularies, and authorized regional franchise partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Official Contact Dossier (Exact from progressivemolecules.in) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
            
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-[#163e61] flex items-center gap-2">
                <Building className="w-5 h-5 text-[#c72828]" />
                Corporate & Registered Office
              </h3>
              <p className="text-xs text-slate-500">Official statutory registration details</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              
              {/* Contact Person */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-500 uppercase text-[11px]">
                  <User className="w-3.5 h-3.5 text-[#c72828]" />
                  <span>Contact Person</span>
                </div>
                <p className="text-sm font-bold text-slate-800">Mrs. Anupriya Deb / Sandeep Kumar Mollick</p>
                <p className="text-slate-500">Authorized Directors</p>
              </div>

              {/* Registered Address */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-500 uppercase text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-[#c72828]" />
                  <span>Registered Address</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                  {COMPANY_CONFIG.registeredAddress}
                </p>
              </div>

              {/* Regional Office */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-500 uppercase text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-[#163e61]" />
                  <span>Assam Regional Distribution Hub</span>
                </div>
                <p className="text-xs font-semibold text-slate-800">
                  Guwahati, Assam – 781001, India
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
                  <span>Call & WhatsApp</span>
                </div>
                <p className="text-sm font-bold text-[#c72828]">
                  <a href={`tel:${COMPANY_CONFIG.phone}`} className="hover:underline">
                    {COMPANY_CONFIG.phone}
                  </a>
                </p>
                <p className="text-slate-500">Landline: 08048406956</p>
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
                <p className="text-xs text-slate-600">info@progressivemolecules.in</p>
              </div>

            </div>

            {/* Official Web Links */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Globe className="w-4 h-4 text-[#163e61]" />
                <span>Web: <strong>https://www.progressivemolecules.in</strong></span>
              </div>
              <div className="bg-red-50 text-[#c72828] font-bold px-2.5 py-1 rounded">
                GST: {COMPANY_CONFIG.registrationNumber.replace('GST: ', '')}
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
                  Scan using your smartphone camera to instantly save Progressive Molecules Pvt. Ltd. contact details.
                </p>
              </div>
            </div>

            {/* Map Embed Card */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-md">
              <div className="bg-[#163e61] text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between">
                <span>Mumbai Headquarters & Registered Location</span>
                <span className="text-red-300">Bandra West</span>
              </div>
              <div className="h-48 bg-slate-200 relative">
                <iframe
                  title="Google Maps Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.439366304523!2d72.8273!3d19.0596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c919a3b836b7%3A0xb35a8166d1136b80!2sGopal%20Mansion%2C%20Gurunanak%20Rd%2C%20Bandra%20West%2C%20Mumbai%2C%20Maharashtra%20400050!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
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
