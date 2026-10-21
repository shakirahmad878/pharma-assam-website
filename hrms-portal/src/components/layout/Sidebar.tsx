import React from 'react';
import { 
  Home, 
  FileText, 
  Target, 
  User, 
  Calendar, 
  Clock, 
  Receipt, 
  CreditCard, 
  Users, 
  ChevronRight, 
  ChevronsRight, 
  ChevronsLeft,
  Sparkles
} from 'lucide-react';
import { ActiveModule } from './Navbar';

interface SidebarProps {
  activeModule: ActiveModule;
  onSelectModule: (mod: ActiveModule) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeModule, 
  onSelectModule, 
  isExpanded, 
  onToggleExpand 
}) => {
  const iconItems: { id: ActiveModule; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'HOME', label: 'Dashboard', icon: Home },
    { id: 'HRIS', label: 'My Profile & HRIS', icon: User },
    { id: 'PERFORMANCE', label: 'Goals & Appraisals', icon: Target },
    { id: 'LEAVE', label: 'Leaves & Shifts', icon: Calendar },
    { id: 'ATTENDANCE', label: 'Geo Attendance', icon: Clock },
    { id: 'PAYROLL', label: 'Payslips & Form 16', icon: FileText },
    { id: 'REIMBURSEMENT', label: 'Reimbursements', icon: Receipt },
    { id: 'EXIT', label: 'Separation & Exit', icon: CreditCard },
  ];

  return (
    <aside className={`bg-[#0B192C] text-slate-300 min-h-[calc(100vh-3.5rem)] flex flex-col justify-between transition-all duration-300 z-30 shrink-0 ${
      isExpanded ? 'w-56' : 'w-14'
    }`}>
      
      {/* Upper Navigation Icons */}
      <div className="py-2.5">
        
        {/* Rail Expand / Collapse Toggle Button */}
        <div className="px-3 pb-2 mb-2 border-b border-slate-800 flex justify-end">
          <button
            onClick={onToggleExpand}
            title={isExpanded ? 'Collapse Navigation' : 'Expand Navigation'}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isExpanded ? (
              <ChevronsLeft className="w-4 h-4" />
            ) : (
              <ChevronsRight className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Icon Items */}
        <div className="space-y-1 px-1.5">
          {iconItems.map(item => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectModule(item.id)}
                title={item.label}
                className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {isExpanded && (
                  <span className="text-xs truncate tracking-tight">{item.label}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Footer Widget */}
      <div className="p-2 border-t border-slate-800 text-[10px] text-slate-500 text-center">
        {isExpanded ? (
          <div>
            <p className="font-bold text-slate-300">Pappu Da HRMS</p>
            <p className="text-slate-500 text-[9px] mt-0.5">Enterprise Workforce</p>
          </div>
        ) : (
          <span className="font-black text-slate-400 text-xs">HR</span>
        )}
      </div>

    </aside>
  );
};
