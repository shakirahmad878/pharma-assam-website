import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import { OfflineSyncService } from '../../services/offlineSyncService';
import { Shield, Radio, Activity, Wifi, WifiOff, KeyRound, LogIn, LogOut, Sparkles, Database } from 'lucide-react';

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
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Platform Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Activity className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">RepPulse</span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded border border-teal-500/30">
                Enterprise SFA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Intelligent Pharma SFA • Barak Division (Assam)</p>
          </div>
        </div>

        {/* Action Controls & Simulator Bar */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Platform Guided Tour Modal Trigger */}
          {onOpenDemoTour && (
            <button
              onClick={onOpenDemoTour}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 transition-all shadow-sm shadow-teal-500/20 cursor-pointer"
              title="Start Interactive Guided Tour"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span className="hidden md:inline">Guided Tour</span>
            </button>
          )}

          {/* Offline Mode Toggle Simulator */}
          <button
            onClick={handleToggleOnline}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isOnline 
                ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' 
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
            }`}
            title="Toggle online / offline field simulator"
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden lg:inline">{isOnline ? 'Online' : 'Offline Mode'}</span>
            {pendingQueueCount > 0 && (
              <span className="bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full font-bold text-[10px]">
                {pendingQueueCount}
              </span>
            )}
          </button>

          {/* 15-Min Telemetry Trigger Button */}
          <button
            onClick={onTriggerTelemetryPing}
            disabled={isSimulatingTelemetry}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 transition-colors shadow-sm cursor-pointer"
            title="Simulates an automatic 15-minute background GPS location ping from field MR"
          >
            <Radio className={`w-3.5 h-3.5 ${isSimulatingTelemetry ? 'animate-ping text-teal-400' : 'text-teal-400'}`} />
            <span className="hidden lg:inline">GPS Ping</span>
          </button>

          {/* Database Sync & Backup Button */}
          {onOpenDatabaseSync && (
            <button
              onClick={onOpenDatabaseSync}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 transition-colors cursor-pointer"
              title="Database Backup, Restore & Sync Across Devices"
            >
              <Database className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden md:inline">Sync Data</span>
            </button>
          )}

          {/* Change Password Button */}
          {onOpenChangePassword && (
            <button
              onClick={onOpenChangePassword}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
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
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
              title="Switch User Account"
            >
              <LogIn className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Switch</span>
            </button>
          )}

          {/* User Profile Pill & Sign Out */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="text-right hidden xl:block">
              <span className="text-xs font-bold text-white block leading-tight">{currentUser.name}</span>
              <span className="text-[10px] text-teal-400 leading-tight block">
                {currentUser.role === 'SUPER_ADMIN' ? '👑 Super Admin' :
                 currentUser.role === 'ADMIN' ? '🏢 Company Admin' :
                 currentUser.role === 'MANAGER' ? '👔 Manager' : '🏃 Field MR'}
              </span>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-xs text-teal-300">
              {currentUser.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
            </div>

            {/* Prominent Sign Out Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1 p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                title="Sign Out / Lock Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-xs font-semibold">Sign Out</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
