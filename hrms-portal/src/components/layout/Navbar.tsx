import React, { useState, useRef, useEffect } from 'react';
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
  Navigation,
  LogOut,
  Shield,
  UserCheck
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
  onLogout: () => void;
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
  onLogout,
  searchQuery,
  onSearchChange,
  onOpenAddEmployee,
  isDatabaseConnected = true,
  isServerConnected = false
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showAdminSwitcher, setShowAdminSwitcher] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isSuperAdminOrDirector = 
    currentUser.role === 'HR_SUPER_ADMIN' || 
    currentUser.employeeCode === 'NLCL-0001' || 
    currentUser.employeeCode === 'NLCL-0002';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

          {/* User Profile Menu */}
          <div className="relative ml-1" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen(prev => !prev)}
              className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Toggle user profile menu"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs border-2 border-white">
                {currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180 text-sky-600' : ''}`} />
            </button>

            {/* Profile Card & Session Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl py-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                
                {/* Active Employee Dossier Header */}
                <div className="px-4 pb-3 border-b border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                      {currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-900 text-xs truncate">{currentUser.name}</div>
                      <div className="text-[11px] font-mono text-sky-700 font-semibold">{currentUser.employeeCode}</div>
                      <div className="text-[10px] text-slate-500 truncate">{currentUser.designation}</div>
                    </div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-50 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-medium">Work Mode</span>
                    <span className="font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {currentUser.workMode === 'OFFICE_STAFF' ? 'Corporate Office' : 'Field Territory'}
                    </span>
                  </div>
                </div>

                {/* Navigation Shortcuts */}
                <div className="px-2 py-2 space-y-0.5 text-xs">
                  <button
                    onClick={() => {
                      onSelectModule('HRIS');
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>View Full HRIS Profile</span>
                    <span className="text-slate-400 text-[10px]">→</span>
                  </button>
                  <button
                    onClick={() => {
                      onSelectModule('PAYROLL');
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>My Payslips & Form 16</span>
                    <span className="text-slate-400 text-[10px]">→</span>
                  </button>
                  <button
                    onClick={() => {
                      onSelectModule('REIMBURSEMENT');
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>My Expense Claims</span>
                    <span className="text-slate-400 text-[10px]">→</span>
                  </button>
                </div>

                {/* Super Admin / Director Masquerade Switcher (Gated) */}
                {isSuperAdminOrDirector && (
                  <div className="px-3 pt-2 pb-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowAdminSwitcher(!showAdminSwitcher)}
                      className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50/80 px-2.5 py-1.5 rounded-lg border border-amber-200/60 cursor-pointer"
                    >
                      <span className="flex items-center gap-1">
                        <Shield className="w-3 h-3 text-amber-600" />
                        Super Admin View-As
                      </span>
                      <span>{showAdminSwitcher ? '▲' : '▼'}</span>
                    </button>

                    {showAdminSwitcher && (
                      <div className="mt-2 space-y-1 max-h-44 overflow-y-auto pr-1">
                        <p className="text-[9px] text-slate-400 mb-1 px-1">
                          Auditing mode: switch view to inspect another staff member's permissions.
                        </p>
                        {users.map(u => (
                          <button
                            key={u.id}
                            onClick={() => {
                              onSelectUser(u);
                              setIsProfileOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 text-[11px] rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                              u.id === currentUser.id 
                                ? 'bg-sky-50 text-sky-800 font-bold' 
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <div>
                              <span className="font-semibold block">{u.name}</span>
                              <span className="text-[9px] text-slate-400">{u.designation} ({u.employeeCode})</span>
                            </div>
                            {u.id === currentUser.id && (
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Add Employee (HR Only) */}
                {(currentUser.role === 'HR_SUPER_ADMIN' || currentUser.role === 'HR_MANAGER') && (
                  <div className="px-3 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        onOpenAddEmployee();
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 text-xs text-sky-600 hover:bg-sky-50 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Employee</span>
                    </button>
                  </div>
                )}

                {/* Sign Out Button */}
                <div className="px-3 pt-2 mt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-bold flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </span>
                    <span className="text-[10px] text-rose-400 font-normal">End Session</span>
                  </button>
                </div>

              </div>
            )}
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
