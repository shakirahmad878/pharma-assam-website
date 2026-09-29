import React from 'react';
import { UserRole } from '../../types';
import { 
  LayoutDashboard, 
  MapPin, 
  Stethoscope, 
  Store, 
  Pill, 
  Map, 
  FileText, 
  Calendar, 
  Lock,
  ShoppingCart,
  FileSpreadsheet,
  UserCheck,
  Receipt,
  BarChart3,
  ShieldCheck
} from 'lucide-react';

export type NavTab = 
  | 'admin_portal'
  | 'dashboard' 
  | 'fleet_tracking' 
  | 'dcr' 
  | 'tour_plans' 
  | 'orders' 
  | 'rcpa' 
  | 'attendance'
  | 'expenses'
  | 'mis_reports'
  | 'doctors' 
  | 'chemists' 
  | 'products' 
  | 'territories';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  userRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, userRole }) => {
  const isSuperAdmin = userRole === 'SUPER_ADMIN';
  const isAdmin = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN';
  const canAccessAdminPage = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN' || userRole === 'MANAGER' || userRole === 'AREA_MANAGER' || userRole === 'REGIONAL_MANAGER';

  const menuItems = [
    { 
      id: 'admin_portal' as NavTab, 
      label: 'Admin Control Center', 
      icon: ShieldCheck, 
      badge: 'RBAC Studio',
      isHighlight: true,
      restricted: !canAccessAdminPage
    },
    { id: 'dashboard' as NavTab, label: 'Overview', icon: LayoutDashboard },
    { 
      id: 'fleet_tracking' as NavTab, 
      label: 'Admin Live Fleet Map', 
      icon: MapPin, 
      adminOnly: true,
      badge: '15-Min GPS'
    },
    { id: 'dcr' as NavTab, label: 'Daily Call Reports (DCR)', icon: FileText, badge: 'Geofenced' },
    { id: 'tour_plans' as NavTab, label: 'Tour Planning (TP)', icon: Calendar },
    { id: 'orders' as NavTab, label: 'Product Order Booking (POB)', icon: ShoppingCart },
    { id: 'rcpa' as NavTab, label: 'RCPA Competitor Audit', icon: FileSpreadsheet },
    { id: 'attendance' as NavTab, label: 'Geo-Attendance', icon: UserCheck },
    { id: 'expenses' as NavTab, label: 'Mileage & Expenses', icon: Receipt },
    { id: 'mis_reports' as NavTab, label: 'Executive MIS Analytics', icon: BarChart3 },
    { id: 'doctors' as NavTab, label: 'Doctor Master', icon: Stethoscope },
    { id: 'chemists' as NavTab, label: 'Chemists & Stockists', icon: Store },
    { id: 'products' as NavTab, label: 'Product Catalog', icon: Pill },
    { id: 'territories' as NavTab, label: 'Territories & Staff', icon: Map },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-4 space-y-4 overflow-y-auto">
        
        {/* Navigation Items */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Field SFA & Intelligence</p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isRestricted = (item.adminOnly && !isSuperAdmin) || ((item as any).restricted);

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                    : (item as any).isHighlight
                    ? 'text-teal-300 bg-teal-950/40 hover:bg-teal-900/40 border border-teal-500/20'
                    : isRestricted
                    ? 'text-slate-500 hover:text-slate-400 hover:bg-slate-800/40'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : (item as any).isHighlight ? 'text-teal-400' : isRestricted ? 'text-slate-500' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.adminOnly && (
                  <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <Lock className="w-2.5 h-2.5" />
                    Admin
                  </span>
                )}
                {item.badge && !item.adminOnly && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    (item as any).isHighlight 
                      ? 'bg-teal-500/30 text-teal-200 border border-teal-500/40 font-bold' 
                      : 'bg-teal-500/20 text-teal-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Security Notice */}
        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300">
            <Lock className="w-3.5 h-3.5 text-teal-400" />
            <span>Strict RBAC Active</span>
          </div>
          <p className="leading-relaxed text-[10px]">
            {isSuperAdmin 
              ? '👑 Super Admin: Full multi-tenant database & telemetry root access.' 
              : isAdmin
              ? '🏢 Company Admin: Company database CRUD & staff management.'
              : canAccessAdminPage
              ? '👔 Manager: Operational approvals & delegated company data.'
              : '🔒 Field Rep: Field calls and reporting active.'}
          </p>
        </div>

      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>RepPulse Enterprise</span>
        <span className="text-teal-400 font-mono">Phase 4</span>
      </div>
    </aside>
  );
};
