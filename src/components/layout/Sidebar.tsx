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
  Users,
  ShieldCheck,
  X,
  Activity
} from 'lucide-react';

export type NavTab = 
  | 'admin_portal'
  | 'dashboard' 
  | 'staff'
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
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onSelectTab, 
  userRole,
  isMobileOpen = false,
  onCloseMobile
}) => {
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
    { 
      id: 'staff' as NavTab, 
      label: 'Staff & Team Access', 
      icon: Users, 
      badge: 'Add / Edit MRs',
      isHighlight: false,
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
    { id: 'territories' as NavTab, label: 'Territories & Beats', icon: Map },
  ];

  const renderNavContent = () => (
    <div className="p-3.5 space-y-4 overflow-y-auto flex-1">
      {/* Navigation Items */}
      <div className="space-y-1.5">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#B99D73]/60 mb-2">Field SFA & Intelligence</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isRestricted = (item.adminOnly && !isSuperAdmin) || ((item as any).restricted);

          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#7A623E] to-[#6C5636] text-[#090907] font-bold shadow-[4px_4px_10px_#040403,-2px_-2px_7px_#1c1a14] border border-[#B99D73]'
                  : (item as any).isHighlight
                  ? 'text-[#B99D73] bg-[#14130e] hover:bg-[#1a1812] border border-[#6C5636]/60 shadow-[3px_3px_8px_#040403,-2px_-2px_6px_#181711]'
                  : isRestricted
                  ? 'text-[#857866]/50 hover:text-[#857866] hover:bg-[#11110e]'
                  : 'text-[#D4BD95] hover:text-[#F2ECE1] hover:bg-[#161510] border border-transparent hover:border-[#282319] hover:shadow-[3px_3px_8px_#040403]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#090907]' : (item as any).isHighlight ? 'text-[#B99D73]' : isRestricted ? 'text-[#857866]/50' : 'text-[#B99D73]'}`} />
                <span className="truncate text-left">{item.label}</span>
              </div>

              {item.adminOnly && (
                <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold bg-[#6C5636]/30 text-[#B99D73] border border-[#6C5636]/50 shadow-[inset_1px_1px_3px_#040403] shrink-0 ml-1">
                  <Lock className="w-2.5 h-2.5" />
                  Admin
                </span>
              )}
              {item.badge && !item.adminOnly && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium shrink-0 ml-1 ${
                  isActive
                    ? 'bg-[#090907]/20 text-[#090907] font-bold'
                    : (item as any).isHighlight 
                    ? 'bg-[#6C5636]/40 text-[#D4BD95] border border-[#B99D73]/40 font-bold shadow-[inset_1px_1px_3px_#040403]' 
                    : 'bg-[#181712] text-[#B99D73] border border-[#282319]'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Security Notice */}
      <div className="p-3 bg-[#0d0d0a] rounded-xl border border-[#282319] shadow-[inset_3px_3px_6px_#040403,inset_-3px_-3px_6px_#181711] text-[11px] text-[#B99D73]/80 space-y-1">
        <div className="flex items-center gap-1.5 font-semibold text-[#D4BD95]">
          <Lock className="w-3.5 h-3.5 text-[#B99D73]" />
          <span>Strict RBAC Active</span>
        </div>
        <p className="leading-relaxed text-[10px] text-[#857866]">
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
  );

  return (
    <>
      {/* Desktop Sticky Sidebar (Visible on lg screens and wider) */}
      <aside className="hidden lg:flex w-64 bg-[#0e0e0b] border-r border-[#282319] flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 shadow-[4px_0_15px_rgba(4,4,3,0.6)]">
        {renderNavContent()}
        {/* Footer Info */}
        <div className="p-4 border-t border-[#282319] text-[11px] text-[#857866] flex items-center justify-between shrink-0">
          <span>RepPulse Enterprise</span>
          <span className="text-[#B99D73] font-mono">Phase 4</span>
        </div>
      </aside>

      {/* Mobile Slide-Over Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-[#090907]/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          
          {/* Drawer Container */}
          <div className="relative w-full max-w-xs bg-[#0e0e0b] border-r border-[#282319] shadow-[8px_0_25px_rgba(4,4,3,0.9)] flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="p-4 border-b border-[#282319] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8A7049] via-[#6C5636] to-[#4A3B24] border border-[#B99D73]/40 flex items-center justify-center text-[#090907] shadow-md">
                  <Activity className="w-4 h-4 stroke-[2.8]" />
                </div>
                <div>
                  <span className="font-bold text-sm text-[#F2ECE1] block leading-tight">RepPulse SFA</span>
                  <span className="text-[10px] text-[#B99D73]">Navigation Menu</span>
                </div>
              </div>
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-xl neu-btn text-[#B99D73] hover:text-[#F2ECE1] transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu items */}
            {renderNavContent()}

            {/* Footer */}
            <div className="p-4 border-t border-[#282319] text-[11px] text-[#857866] flex items-center justify-between shrink-0">
              <span>RepPulse Mobile</span>
              <span className="text-[#B99D73] font-mono">Assam HQ</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
