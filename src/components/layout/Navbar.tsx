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
    <header className="bg-[#090907]/95 backdrop-blur-md border-b border-[#282319] text-[#F2ECE1] sticky top-0 z-40 shadow-[0_4px_16px_rgba(4,4,3,0.7)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Mobile Hamburger Menu Button & Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-xl neu-btn shrink-0"
              aria-label="Toggle navigation drawer"
            >
              <Menu className="w-5 h-5 text-[#B99D73]" />
            </button>
          )}

          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#8A7049] via-[#6C5636] to-[#4A3B24] border border-[#B99D73]/40 flex items-center justify-center shadow-[2px_2px_8px_#040403,-2px_-2px_6px_#1c1a14] shrink-0">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-[#090907] stroke-[2.8]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm sm:text-base tracking-tight text-[#F2ECE1]">RepPulse</span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider bg-[#6C5636]/30 text-[#B99D73] px-1.5 py-0.5 rounded-md border border-[#6C5636]/50 shadow-[inset_1px_1px_3px_#040403]">
                SFA
              </span>
            </div>
            <p className="text-[10px] text-[#B99D73]/70 hidden md:block">Intelligent Pharma SFA • Barak Division (Assam)</p>
          </div>
        </div>

        {/* Action Controls & Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Platform Guided Tour Modal Trigger */}
          {onOpenDemoTour && (
            <button
              onClick={onOpenDemoTour}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold neu-btn hover:text-[#B99D73] transition-all cursor-pointer"
              title="Start Interactive Guided Tour"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B99D73] animate-pulse" />
              <span className="hidden md:inline text-[#B99D73]">Guided Tour</span>
            </button>
          )}

          {/* Offline Mode Toggle Simulator */}
          <button
            onClick={handleToggleOnline}
            className={`flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isOnline 
                ? 'neu-btn text-[#D4BD95]' 
                : 'bg-[#6C5636]/30 text-[#B99D73] border border-[#B99D73]/50 shadow-[inset_2px_2px_5px_#040403] animate-pulse'
            }`}
            title="Toggle online / offline field simulator"
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-[#B99D73]" /> : <WifiOff className="w-3.5 h-3.5 text-[#857866]" />}
            <span className="hidden lg:inline">{isOnline ? 'Online' : 'Offline'}</span>
            {pendingQueueCount > 0 && (
              <span className="bg-[#B99D73] text-[#090907] px-1.5 rounded-full font-bold text-[9px]">
                {pendingQueueCount}
              </span>
            )}
          </button>

          {/* Database Sync & Cloud Firestore Status */}
          {onOpenDatabaseSync && (
            <button
              onClick={onOpenDatabaseSync}
              className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-semibold neu-btn text-[#B99D73] hover:text-[#D4BD95] transition-all cursor-pointer"
              title="Database Backup, Restore & Cloud Firestore Sync"
            >
              <span className="w-2 h-2 rounded-full bg-[#B99D73] animate-pulse"></span>
              <Database className="w-3.5 h-3.5 text-[#B99D73]" />
              <span className="hidden md:inline">Cloud DB</span>
            </button>
          )}

          {/* Change Password Button */}
          {onOpenChangePassword && (
            <button
              onClick={onOpenChangePassword}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold neu-btn text-[#F2ECE1] transition-all cursor-pointer"
              title="Change Account Password"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#B99D73]" />
              <span className="hidden md:inline">Password</span>
            </button>
          )}

          {/* Switch User Button */}
          {onOpenLogin && (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-medium neu-btn text-[#B99D73] hover:text-[#D4BD95] transition-all cursor-pointer"
              title="Switch User Account"
            >
              <LogIn className="w-3.5 h-3.5 text-[#B99D73]" />
              <span className="hidden sm:inline font-semibold">Switch</span>
            </button>
          )}

          {/* User Profile & Sign Out */}
          <div className="flex items-center gap-1.5 pl-1.5 sm:pl-2.5 border-l border-[#282319]">
            <div className="text-right hidden xl:block">
              <span className="text-xs font-bold text-[#F2ECE1] block leading-tight">{currentUser.name}</span>
              <span className="text-[10px] text-[#B99D73] leading-tight block">
                {currentUser.role === 'SUPER_ADMIN' ? '👑 Super Admin' :
                 currentUser.role === 'ADMIN' ? '🏢 Company Admin' :
                 currentUser.role === 'MANAGER' ? '👔 Manager' : '🏃 Field MR'}
              </span>
            </div>
            
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#161510] border border-[#6C5636]/60 shadow-[inset_1px_1px_3px_#040403,1px_1px_4px_#181711] flex items-center justify-center font-bold text-xs text-[#B99D73] shrink-0">
              {currentUser.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
            </div>

            {/* Prominent Sign Out Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl neu-btn text-[#df7a7a] hover:text-[#ff9292] hover:border-[#df7a7a]/40 transition-colors cursor-pointer shrink-0"
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
