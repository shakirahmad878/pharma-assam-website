import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  FlaskConical, 
  MapPin, 
  PackageCheck, 
  FileCheck 
} from 'lucide-react';

export const CleanTrustStrip: React.FC = () => {
  const trustItems = [
    {
      icon: ShieldCheck,
      title: 'Revised Schedule M',
      subtitle: 'Validated cleanrooms',
      color: 'text-emerald-700',
      bg: 'bg-emerald-50 border-emerald-200'
    },
    {
      icon: Award,
      title: 'WHO-GMP Compliant',
      subtitle: 'Standardized systems',
      color: 'text-teal-700',
      bg: 'bg-teal-50 border-teal-200'
    },
    {
      icon: FlaskConical,
      title: 'ISO 9001:2015',
      subtitle: 'QMS quality framework',
      color: 'text-blue-700',
      bg: 'bg-blue-50 border-blue-200'
    },
    {
      icon: FileCheck,
      title: 'IP/BP Monographs',
      subtitle: '100% In-house assays',
      color: 'text-indigo-700',
      bg: 'bg-indigo-50 border-indigo-200'
    },
    {
      icon: ShieldCheck,
      title: 'Assam State DCA',
      subtitle: 'Form 25/28 approved',
      color: 'text-teal-700',
      bg: 'bg-teal-50 border-teal-200'
    },
    {
      icon: MapPin,
      title: 'Assam & NE Supply',
      subtitle: 'All 35 districts covered',
      color: 'text-slate-700',
      bg: 'bg-slate-100 border-slate-300'
    }
  ];

  return (
    <div className="bg-white border-b border-slate-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 items-center">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className={`p-3.5 rounded-2xl border ${item.bg} flex items-center space-x-3 transition-transform hover:scale-[1.02] shadow-2xs`}
              >
                <div className={`p-2 rounded-xl bg-white shadow-xs shrink-0 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-slate-900 truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono truncate">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
