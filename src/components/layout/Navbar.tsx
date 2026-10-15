import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import { OfflineSyncService } from '../../services/offlineSyncService';
import { Shield, Radio, Activity, Wifi, WifiOff, KeyRound, LogIn, LogOut, Sparkles, Database, Menu, Globe, ExternalLink } from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  onRoleChange: (newRole: UserRole) => void;
  isSimulatingTelemetry: boolean;
  onTriggerTelemetryPing: () => void;
  onOpenDemoTour?: () => void;
  onOpenChangePassword?: () => void;
  onOpenLogin?: () => void;
  onOpenDatabaseSync?: () => void;
  onOpenPublicSite?: () => void;
  onLogout?: () => void;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onRoleChange,
  isSimulatingTelemetry,
  onTriggerTelemetryPing,
  onOpenDemoTour,
  onOpenChangePassword,
  onOpenLogin,
  onOpenDatabaseSync,
  onOpenPublicSite,
  onLogout,
  onToggleMobileMenu,
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingQueueCount, setPendingQueueCount] = useState(0);

  useEffect(() => {
    const unsub = OfflineSyncService.subscribe(setPendingQueueCount);
    return () => unsub();
  }, []);

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
    if (!isOnline) {
      const { syncedCount } = OfflineSyncService.flushQueue();
      if (syncedCount > 0) {
        alert(`Network Restored! Flushed ${syncedCount} queued reports successfully.`);
      }
    }
  };

  return (
    <header className="bg-[#10243A] border-b border-[#182F49] text-white sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Mobile Hamburger Menu Button & Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-lg bg-[#182F49] hover:bg-[#203D5E] text-slate-200 border border-slate-700 shrink-0 cursor-pointer"
              aria-label="Toggle navigation drawer"
            >
              <Menu className="w-5 h-5 text-[#18A6A6]" />
            </button>
          )}

          <div className="w-9 h-9 rounded-xl bg-[#182F49] border border-slate-700 flex items-center justify-center shadow-xs shrink-0">
            <Activity className="w-5 h-5 text-[#18A6A6]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm sm:text-base tracking-tight text-white">RepPulse</span>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-[#18A6A6]/20 text-[#18A6A6] px-1.5 py-0.5 rounded border border-[#18A6A6]/40">
                SFA
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden md:block">Field Intelligence & Administration System</p>
          </div>
        </div>

        {/* Action Controls & Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Switch to Public Corporate Site */}
          {onOpenPublicSite && (
            <button
              onClick={onOpenPublicSite}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#182F49] hover:bg-[#203D5E] border border-slate-700 text-slate-200 transition-all cursor-pointer"
              title="View Public Pharmaceutical Website"
            >
              <Globe className="w-3.5 h-3.5 text-[#18A6A6]" />
              <span className="hidden sm:inline">Public Website</span>
            </button>
          )}

          {/* Platform Guided Tour Modal Trigger */}
          {onOpenDemoTour && (
            <button
              onClick={onOpenDemoTour}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#182F49] hover:bg-[#203D5E] border border-slate-700 text-slate-200 transition-all cursor-pointer"
              title="Start Interactive Guided Tour"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#18A6A6]" />
              <span className="hidden md:inline">Tour</span>
            </button>
          )}

          {/* Offline Mode Toggle Simulator */}
          <button
            onClick={handleToggleOnline}
            className={`flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
              isOnline 
                ? 'bg-[#182F49] hover:bg-[#203D5E] text-slate-200 border-slate-700' 
                : 'bg-amber-950/40 text-amber-300 border-amber-700/50 animate-pulse'
            }`}
            title="Toggle online / offline field simulator"
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-[#18A6A6]" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden lg:inline">{isOnline ? 'Online' : 'Offline'}</span>
            {pendingQueueCount > 0 && (
              <span className="bg-[#18A6A6] text-white px-1.5 rounded-full font-bold text-[9px]">
                {pendingQueueCount}
              </span>
            )}
          </button>

          {/* Database Sync Status */}
          {onOpenDatabaseSync && (
            <button
              onClick={onOpenDatabaseSync}
              className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium bg-[#182F49] hover:bg-[#203D5E] border border-slate-700 text-slate-200 transition-all cursor-pointer"
              title="Supabase Database Status & Sync"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <Database className="w-3.5 h-3.5 text-[#18A6A6]" />
              <span className="hidden md:inline">DB Studio</span>
            </button>
          )}

          {/* Switch User Button */}
          {onOpenLogin && (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium bg-[#182F49] hover:bg-[#203D5E] border border-slate-700 text-slate-200 transition-all cursor-pointer"
              title="Switch User Account"
            >
              <LogIn className="w-3.5 h-3.5 text-[#18A6A6]" />
              <span className="hidden sm:inline">Switch</span>
            </button>
          )}

          {/* User Profile & Sign Out */}
          <div className="flex items-center gap-1.5 pl-1.5 sm:pl-2.5 border-l border-slate-700">
            <div className="text-right hidden xl:block">
              <span className="text-xs font-bold text-white block leading-tight">{currentUser.name}</span>
              <span className="text-[10px] text-[#18A6A6] leading-tight block font-medium">
                {currentUser.role === 'SUPER_ADMIN' ? '👑 Super Admin' :
                 currentUser.role === 'ADMIN' ? '🏢 Company Admin' :
                 currentUser.role === 'MANAGER' ? '👔 Manager' : '🏃 Field MR'}
              </span>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-[#182F49] border border-slate-700 flex items-center justify-center font-bold text-xs text-teal-300 shrink-0">
              {currentUser.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
            </div>

            {/* Sign Out Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#182F49] hover:bg-rose-950/60 border border-slate-700 hover:border-rose-800 text-rose-300 transition-colors cursor-pointer shrink-0"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-xs font-medium">Sign Out</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
