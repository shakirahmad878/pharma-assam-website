import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import { OfflineSyncService } from '../../services/offlineSyncService';
import { Shield, Radio, Activity, Wifi, WifiOff, KeyRound, LogIn, LogOut, Sparkles, Database, Menu } from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  onRoleChange: (newRole: UserRole) => void;
  isSimulatingTelemetry: boolean;
  onTriggerTelemetryPing: () => void;
  onOpenDemoTour?: () => void;
  onOpenChangePassword?: () => void;
  onOpenLogin?: () => void;
  onOpenDatabaseSync?: () => void;
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
      // Sync flushed
      const { syncedCount } = OfflineSyncService.flushQueue();
      if (syncedCount > 0) {
        alert(`Network Restored! Flushed ${syncedCount} queued reports successfully.`);
      }
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Mobile Hamburger Menu Button & Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors shrink-0"
              aria-label="Toggle navigation drawer"
            >
              <Menu className="w-5 h-5 text-teal-400" />
            </button>
          )}

          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20 shrink-0">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm sm:text-base tracking-tight text-white">RepPulse</span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider bg-teal-500/20 text-teal-300 px-1 sm:px-1.5 py-0.5 rounded border border-teal-500/30">
                SFA
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden md:block">Intelligent Pharma SFA • Barak Division (Assam)</p>
          </div>
        </div>

        {/* Action Controls & Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Platform Guided Tour Modal Trigger */}
          {onOpenDemoTour && (
            <button
              onClick={onOpenDemoTour}
              className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-bold bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 transition-all shadow-sm cursor-pointer"
              title="Start Interactive Guided Tour"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span className="hidden md:inline">Guided Tour</span>
            </button>
          )}

          {/* Offline Mode Toggle Simulator */}
          <button
            onClick={handleToggleOnline}
            className={`flex items-center gap-1 p-1.5 sm:px-2 sm:py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isOnline 
                ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' 
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
            }`}
            title="Toggle online / offline field simulator"
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden lg:inline">{isOnline ? 'Online' : 'Offline'}</span>
            {pendingQueueCount > 0 && (
              <span className="bg-amber-500 text-slate-950 px-1 rounded-full font-bold text-[9px]">
                {pendingQueueCount}
              </span>
            )}
          </button>

          {/* Database Sync & Cloud Firestore Status */}
          {onOpenDatabaseSync && (
            <button
              onClick={onOpenDatabaseSync}
              className="flex items-center gap-1 p-1.5 sm:px-2 sm:py-1.5 rounded-lg text-xs font-semibold bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 transition-colors cursor-pointer"
              title="Database Backup, Restore & Cloud Firestore Sync"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <Database className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden md:inline">Cloud DB</span>
            </button>
          )}

          {/* Change Password Button */}
          {onOpenChangePassword && (
            <button
              onClick={onOpenChangePassword}
              className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title="Change Account Password"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Password</span>
            </button>
          )}

          {/* Switch User Button */}
          {onOpenLogin && (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1 p-1.5 sm:px-2 sm:py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
              title="Switch User Account"
            >
              <LogIn className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Switch</span>
            </button>
          )}

          {/* User Profile & Sign Out */}
          <div className="flex items-center gap-1.5 pl-1.5 sm:pl-2 border-l border-slate-800">
            <div className="text-right hidden xl:block">
              <span className="text-xs font-bold text-white block leading-tight">{currentUser.name}</span>
              <span className="text-[10px] text-teal-400 leading-tight block">
                {currentUser.role === 'SUPER_ADMIN' ? '👑 Super Admin' :
                 currentUser.role === 'ADMIN' ? '🏢 Company Admin' :
                 currentUser.role === 'MANAGER' ? '👔 Manager' : '🏃 Field MR'}
              </span>
            </div>
            
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-xs text-teal-300 shrink-0">
              {currentUser.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
            </div>

            {/* Prominent Sign Out Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1 p-1.5 sm:px-2 sm:py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer shrink-0"
                title="Sign Out / Lock Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-xs font-semibold">Sign Out</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
