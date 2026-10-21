import React from 'react';
import { HrmsUser } from '../../types';
import { 
  Search, 
  CheckSquare, 
  MessageSquare, 
  Bell, 
  Grid, 
  ChevronDown, 
  Download,
  Users,
  Plus,
  Navigation
} from 'lucide-react';

export type ActiveModule = 
  | 'HOME' 
  | 'HRIS' 
  | 'LEAVE' 
  | 'ATTENDANCE' 
  | 'PAYROLL' 
  | 'REIMBURSEMENT' 
  | 'PERFORMANCE' 
  | 'EXIT';

interface NavbarProps {
  currentUser: HrmsUser;
  users: HrmsUser[];
  activeModule: ActiveModule;
  onSelectModule: (mod: ActiveModule) => void;
  onSelectUser: (user: HrmsUser) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAddEmployee: () => void;
  isDatabaseConnected?: boolean;
  isServerConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentUser, 
  users, 
  activeModule, 
  onSelectModule, 
  onSelectUser,
  searchQuery,
  onSearchChange,
  onOpenAddEmployee,
  isDatabaseConnected = true,
  isServerConnected = false
}) => {
  const modules: { id: ActiveModule; label: string }[] = [
    { id: 'HOME', label: 'HOME' },
    { id: 'HRIS', label: 'HRIS' },
    { id: 'LEAVE', label: 'LEAVE' },
    { id: 'ATTENDANCE', label: 'ATTENDANCE' },
    { id: 'PAYROLL', label: 'PAYROLL' },
    { id: 'REIMBURSEMENT', label: 'REIMBURSEMENT' },
    { id: 'PERFORMANCE', label: 'PERFORMANCE' },
    { id: 'EXIT', label: 'EXIT' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        
        {/* Left: App Grid & Greeting */}
        <div className="flex items-center gap-3 shrink-0">
          <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
            <Grid className="w-5 h-5 text-slate-600" />
          </button>
          <div className="text-base font-black text-sky-600 tracking-tight flex items-center gap-2">
            <span>Hi {currentUser.name.split(' ')[0]}</span>
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Supabase DB Connected</span>
            </div>
            {isServerConnected && (
              <div className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-bold">
                <span>API: 5000</span>
              </div>
            )}
          </div>
        </div>

        {/* Center: Global Module Search */}
        <div className="flex-1 max-w-xl mx-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search by module name (e.g. Leave, Slips, Geo-Selfie, Goals)..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-3 shrink-0 text-xs text-slate-600">
          
          <button 
            onClick={() => onSelectModule('LEAVE')}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <CheckSquare className="w-4 h-4 text-slate-500" />
            <span>Tasks</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          <button 
            onClick={() => onSelectModule('REIMBURSEMENT')}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-slate-500" />
            <span>Workgroups</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          <button className="flex items-center gap-1 px-2.5 py-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer relative">
            <Bell className="w-4 h-4 text-slate-500" />
            <span>Alerts</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute top-1.5 right-1.5"></span>
          </button>

          {/* User Persona Switcher */}
          <div className="relative group ml-1">
            <div className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-slate-100 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs border-2 border-white">
                {currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Persona Switcher Dropdown */}
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 hidden group-hover:block z-50">
              <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
                <span>Active Profile</span>
                <span className="text-[9px] text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded font-mono">
                  {currentUser.workMode === 'OFFICE_STAFF' ? 'Office' : 'Field'}
                </span>
              </div>
              {users.map(u => (
                <button
                  key={u.id}
                  onClick={() => onSelectUser(u)}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-sky-50 transition-colors cursor-pointer ${
                    u.id === currentUser.id ? 'bg-sky-50/70 text-sky-700 font-bold' : 'text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-semibold">{u.name}</div>
                    <div className="text-[10px] text-slate-400">{u.designation} ({u.employeeCode})</div>
                  </div>
                  {u.id === currentUser.id && (
                    <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                  )}
                </button>
              ))}

              <div className="pt-1.5 mt-1 border-t border-slate-100 px-2">
                <button
                  onClick={onOpenAddEmployee}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-sky-600 hover:bg-sky-50 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Employee Profile</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Top Module Navigation Bar (Darwinbox Signature Strip) */}
      <div className="bg-slate-50/70 border-t border-slate-100 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
          {modules.map(mod => {
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => onSelectModule(mod.id)}
                className={`px-3.5 py-2 text-[11px] font-bold tracking-wide transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-sky-600 text-sky-700 bg-white rounded-t-lg shadow-2xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-lg'
                }`}
              >
                {mod.label}
              </button>
            );
          })}
        </div>
      </div>

    </header>
  );
};
