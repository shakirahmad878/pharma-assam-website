import React, { useState, useEffect } from 'react';
import { HrmsUser } from './types';
import { HrmsService } from './services/hrmsService';
import { Navbar, ActiveModule } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { HRISProfileView } from './components/hris/HRISProfileView';
import { LeaveView } from './components/leave/LeaveView';
import { AttendanceRosterView } from './components/attendance/AttendanceRosterView';
import { PayrollSlipsView } from './components/payroll/PayrollSlipsView';
import { ReimbursementView } from './components/reimbursement/ReimbursementView';
import { PerformanceGoalsView } from './components/performance/PerformanceGoalsView';
import { ExitView } from './components/exit/ExitView';
import { JinieAssistant } from './components/layout/JinieAssistant';
import { GeoSelfieModal } from './components/attendance/GeoSelfieModal';
import { EmployeeSetupModal } from './components/common/EmployeeSetupModal';
import { CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [users, setUsers] = useState<HrmsUser[]>(() => HrmsService.getUsers());
  const [currentUser, setCurrentUser] = useState<HrmsUser | null>(() => users.length > 0 ? users[0] : null);

  // Connectivity Status
  const [isDbConnected, setIsDbConnected] = useState(true);
  const [isServerConnected, setIsServerConnected] = useState(false);

  // Employee Setup Modal State
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);

  // Sidebar Rail Collapse/Expand State
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);

  // Global Search
  const [searchQuery, setSearchQuery] = useState('');

  // Geo-Selfie Camera Modal State
  const [isGeoSelfieOpen, setIsGeoSelfieOpen] = useState(false);
  const [geoPunchSuccessToast, setGeoPunchSuccessToast] = useState<string | null>(null);

  // Active Module State (Synced with window hash)
  const [activeModule, setActiveModule] = useState<ActiveModule>(() => {
    const hash = window.location.hash.replace(/^#\/?/, '').toUpperCase();
    if (hash === 'HRIS' || hash === 'PROFILE') return 'HRIS';
    if (hash === 'LEAVE' || hash === 'LEAVES') return 'LEAVE';
    if (hash === 'ATTENDANCE' || hash === 'ROSTER' || hash === 'GEO') return 'ATTENDANCE';
    if (hash === 'PAYROLL' || hash === 'SLIPS' || hash === 'FORM16') return 'PAYROLL';
    if (hash === 'REIMBURSEMENT' || hash === 'CLAIMS') return 'REIMBURSEMENT';
    if (hash === 'PERFORMANCE' || hash === 'GOALS') return 'PERFORMANCE';
    if (hash === 'EXIT' || hash === 'FNF') return 'EXIT';
    return 'HOME';
  });

  const handleSelectModule = (mod: ActiveModule) => {
    setActiveModule(mod);
    window.location.hash = mod.toLowerCase();
    setSearchQuery('');
  };

  useEffect(() => {
    // 1. Live Sync from Supabase PostgreSQL Database
    HrmsService.syncWithSupabase().then(liveUsers => {
      if (liveUsers && liveUsers.length > 0) {
        setUsers(liveUsers);
        setCurrentUser(prev => prev ? (liveUsers.find(u => u.id === prev.id) || liveUsers[0]) : liveUsers[0]);
      }
    });

    // 2. Sync Live Attendance Punches from Supabase
    HrmsService.syncAttendanceFromSupabase();

    // 3. Check Live Connectivity to Database & Server
    HrmsService.checkConnectivity().then(status => {
      setIsDbConnected(status.supabase);
      setIsServerConnected(status.server);
    });

    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').toUpperCase();
      if (['HOME', 'HRIS', 'LEAVE', 'ATTENDANCE', 'PAYROLL', 'REIMBURSEMENT', 'PERFORMANCE', 'EXIT'].includes(hash)) {
        setActiveModule(hash as ActiveModule);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleEmployeeCreated = (newUser: HrmsUser) => {
    const updatedUsers = HrmsService.getUsers();
    setUsers(updatedUsers);
    setCurrentUser(newUser);
    setIsSetupModalOpen(false);
  };

  const handleGeoSuccess = (msg: string) => {
    setGeoPunchSuccessToast(msg);
    setTimeout(() => setGeoPunchSuccessToast(null), 5000);
  };

  // If no user exists yet, display Initial Setup Form
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <EmployeeSetupModal
          isOpen={true}
          isFirstEmployee={true}
          onEmployeeCreated={handleEmployeeCreated}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans antialiased text-slate-900 selection:bg-sky-100 selection:text-sky-900">
      
      {/* 1. Darwinbox Signature Top Utility & Module Strip */}
      <Navbar
        currentUser={currentUser}
        users={users}
        activeModule={activeModule}
        onSelectModule={handleSelectModule}
        onSelectUser={setCurrentUser}
        searchQuery={searchQuery}
        onSearchChange={q => {
          setSearchQuery(q);
          const lower = q.toLowerCase();
          if (lower.includes('leave')) handleSelectModule('LEAVE');
          else if (lower.includes('attend') || lower.includes('geo') || lower.includes('selfie') || lower.includes('punch')) handleSelectModule('ATTENDANCE');
          else if (lower.includes('slip') || lower.includes('salary') || lower.includes('pay') || lower.includes('form 16')) handleSelectModule('PAYROLL');
          else if (lower.includes('reimb') || lower.includes('claim') || lower.includes('expense')) handleSelectModule('REIMBURSEMENT');
          else if (lower.includes('goal') || lower.includes('kpi') || lower.includes('appraisal')) handleSelectModule('PERFORMANCE');
          else if (lower.includes('exit') || lower.includes('fnf') || lower.includes('resig')) handleSelectModule('EXIT');
          else if (lower.includes('profile') || lower.includes('pan') || lower.includes('kyc') || lower.includes('bank')) handleSelectModule('HRIS');
        }}
        onOpenAddEmployee={() => setIsSetupModalOpen(true)}
        isDatabaseConnected={isDbConnected}
        isServerConnected={isServerConnected}
      />

      {/* Global Success Banner for Geo-Selfie Punches */}
      {geoPunchSuccessToast && (
        <div className="max-w-7xl mx-auto w-full px-4 pt-3">
          <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold shadow-md animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-200" />
              <span>{geoPunchSuccessToast}</span>
            </div>
            <button onClick={() => setGeoPunchSuccessToast(null)} className="text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex w-full">
        
        {/* Left Dark Icon Rail (#0B192C) */}
        <Sidebar
          activeModule={activeModule}
          onSelectModule={handleSelectModule}
          isExpanded={isSidebarExpanded}
          onToggleExpand={() => setIsSidebarExpanded(!isSidebarExpanded)}
        />

        {/* Dynamic Content Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeModule === 'HOME' && (
            <DashboardView
              currentUser={currentUser}
              onNavigateModule={handleSelectModule}
              onOpenGeoSelfie={() => setIsGeoSelfieOpen(true)}
            />
          )}

          {activeModule === 'HRIS' && (
            <HRISProfileView
              currentUser={currentUser}
            />
          )}

          {activeModule === 'LEAVE' && (
            <LeaveView
              currentUser={currentUser}
              onOpenRegularize={() => handleSelectModule('ATTENDANCE')}
            />
          )}

          {activeModule === 'ATTENDANCE' && (
            <AttendanceRosterView
              currentUser={currentUser}
              onOpenGeoSelfie={() => setIsGeoSelfieOpen(true)}
            />
          )}

          {activeModule === 'PAYROLL' && (
            <PayrollSlipsView
              currentUser={currentUser}
            />
          )}

          {activeModule === 'REIMBURSEMENT' && (
            <ReimbursementView
              currentUser={currentUser}
            />
          )}

          {activeModule === 'PERFORMANCE' && (
            <PerformanceGoalsView
              currentUser={currentUser}
            />
          )}

          {activeModule === 'EXIT' && (
            <ExitView
              currentUser={currentUser}
            />
          )}
        </main>

      </div>

      {/* 3. Floating Jinie AI Assistant (Darwinbox Screen 1 Bottom-Right) */}
      <JinieAssistant
        currentUser={currentUser}
        onNavigateModule={handleSelectModule}
        onTriggerGeoPunch={() => setIsGeoSelfieOpen(true)}
      />

      {/* 4. Live Geo-Selfie Camera & Geofenced Punch Engine */}
      <GeoSelfieModal
        currentUser={currentUser}
        isOpen={isGeoSelfieOpen}
        onClose={() => setIsGeoSelfieOpen(false)}
        onSuccess={handleGeoSuccess}
      />

      {/* 5. Add / Edit Employee Profile Modal */}
      <EmployeeSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        onEmployeeCreated={handleEmployeeCreated}
        isFirstEmployee={false}
      />

    </div>
  );
}
