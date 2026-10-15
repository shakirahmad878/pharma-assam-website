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
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-2">Field SFA & Intelligence</p>
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
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#10243A] text-white font-bold shadow-xs'
                  : (item as any).isHighlight
                  ? 'text-[#10243A] bg-[#F1F6F8] hover:bg-[#E8EEF4] border border-[#DCE4EB]'
                  : isRestricted
                  ? 'text-[#94A3B8] hover:text-[#64748B] hover:bg-[#F5F8FA]'
                  : 'text-[#1E293B] hover:text-[#10243A] hover:bg-[#F1F6F8]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#18A6A6]' : (item as any).isHighlight ? 'text-[#10243A]' : isRestricted ? 'text-[#94A3B8]' : 'text-[#64748B]'}`} />
                <span className="truncate text-left">{item.label}</span>
              </div>

              {item.adminOnly && (
                <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold bg-[#E8EEF4] text-[#10243A] border border-[#DCE4EB] shrink-0 ml-1">
                  <Lock className="w-2.5 h-2.5" />
                  Admin
                </span>
              )}
              {item.badge && !item.adminOnly && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium shrink-0 ml-1 ${
                  isActive
                    ? 'bg-[#18A6A6] text-white font-bold'
                    : (item as any).isHighlight 
                    ? 'bg-teal-50 text-[#137F83] border border-teal-200 font-semibold' 
                    : 'bg-[#F1F6F8] text-[#64748B] border border-[#DCE4EB]'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Security Notice */}
      <div className="p-3 bg-[#F1F6F8] rounded-xl border border-[#DCE4EB] text-[11px] text-[#64748B] space-y-1">
        <div className="flex items-center gap-1.5 font-semibold text-[#10243A]">
          <Lock className="w-3.5 h-3.5 text-[#18A6A6]" />
          <span>Strict RBAC Active</span>
        </div>
        <p className="leading-relaxed text-[10px] text-[#64748B]">
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
      <aside className="hidden lg:flex w-64 bg-white border-r border-[#DCE4EB] flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 shadow-2xs">
        {renderNavContent()}
        {/* Footer Info */}
        <div className="p-4 border-t border-[#DCE4EB] text-[11px] text-[#64748B] flex items-center justify-between shrink-0 bg-[#F5F8FA]">
          <span>RepPulse Enterprise</span>
          <span className="text-[#18A6A6] font-mono font-semibold">PostgreSQL</span>
        </div>
      </aside>

      {/* Mobile Slide-Over Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-[#10243A]/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          
          {/* Drawer Container */}
          <div className="relative w-full max-w-xs bg-white border-r border-[#DCE4EB] shadow-xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="p-4 border-b border-[#DCE4EB] flex items-center justify-between shrink-0 bg-[#10243A] text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#182F49] border border-slate-700 flex items-center justify-center text-[#18A6A6] shadow-2xs">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-sm text-white block leading-tight">RepPulse SFA</span>
                  <span className="text-[10px] text-teal-300">Navigation Menu</span>
                </div>
              </div>
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#182F49] transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu items */}
            {renderNavContent()}

            {/* Footer */}
            <div className="p-4 border-t border-[#DCE4EB] text-[11px] text-[#64748B] flex items-center justify-between shrink-0 bg-[#F5F8FA]">
              <span>RepPulse Mobile</span>
              <span className="text-[#18A6A6] font-mono font-semibold">Assam Hub</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
