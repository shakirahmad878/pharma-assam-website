import React, { useState } from 'react';
import { 
  User, 
  UserRole, 
  Doctor, 
  Chemist, 
  Product, 
  Territory,
  Company,
  AuditLogEntry,
  LocationTelemetryPoint, 
  DCRRecord, 
  TourPlanItem 
} from './types';
import { 
  INITIAL_USERS, 
  INITIAL_COMPANIES,
  INITIAL_AUDIT_LOGS,
  INITIAL_DOCTORS, 
  INITIAL_CHEMISTS, 
  INITIAL_PRODUCTS, 
  INITIAL_TERRITORIES, 
  INITIAL_TELEMETRY_LOGS, 
  INITIAL_DCR_LOGS 
} from './data/mockData';
import { AuthService } from './services/authService';
import { TelemetryService } from './services/telemetryService';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { AdminPortal } from './components/admin/AdminPortal';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { LiveFleetMap } from './components/maps/LiveFleetMap';
import { DoctorDirectory } from './components/doctors/DoctorDirectory';
import { ChemistDirectory } from './components/chemists/ChemistDirectory';
import { ProductCatalog } from './components/products/ProductCatalog';
import { TerritoryStaffView } from './components/territory/TerritoryStaffView';
import { DCRView } from './components/dcr/DCRView';
import { TourPlanner } from './components/tour/TourPlanner';
import { POBOrderBooking } from './components/orders/POBOrderBooking';
import { RCPAAuditView } from './components/rcpa/RCPAAuditView';
import { GeoAttendanceView } from './components/hrms/GeoAttendanceView';
import { ExpenseClaimsView } from './components/expenses/ExpenseClaimsView';
import { MISReportsView } from './components/reports/MISReportsView';
import { GuidedDemoModal } from './components/demo/GuidedDemoModal';
import { LoginPage } from './components/auth/LoginPage';
import { LoginModal } from './components/auth/LoginModal';
import { ChangePasswordModal } from './components/auth/ChangePasswordModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => AuthService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<NavTab>(() => {
    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    if (hash === 'admin' || hash === 'admin_portal' || hash === 'admin-portal') return 'admin_portal';
    if (hash === 'dashboard' || hash === 'manager') return 'dashboard';
    if (hash === 'doctors') return 'doctors';
    if (hash === 'chemists') return 'chemists';
    if (hash === 'products') return 'products';
    if (hash === 'territories') return 'territories';
    if (hash === 'dcr') return 'dcr';
    if (hash === 'tour_plans' || hash === 'tour') return 'tour_plans';
    if (hash === 'orders') return 'orders';
    if (hash === 'rcpa') return 'rcpa';
    if (hash === 'attendance') return 'attendance';
    if (hash === 'expenses') return 'expenses';
    if (hash === 'mis_reports' || hash === 'reports') return 'mis_reports';
    if (hash === 'fleet_tracking' || hash === 'fleet') return 'fleet_tracking';
    return 'admin_portal';
  });
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  
  // Master Multi-Tenant State
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [chemists, setChemists] = useState<Chemist[]>(INITIAL_CHEMISTS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [territories, setTerritories] = useState<Territory[]>(INITIAL_TERRITORIES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Field Telemetry & Reports State
  const [telemetryLogs, setTelemetryLogs] = useState<LocationTelemetryPoint[]>(INITIAL_TELEMETRY_LOGS);
  const [dcrLogs, setDcrLogs] = useState<DCRRecord[]>(INITIAL_DCR_LOGS);

  // Tour Plans State
  const [tourPlans, setTourPlans] = useState<TourPlanItem[]>([
    {
      id: 'tp-01',
      userId: 'usr-mr-01',
      userName: 'Shakir Ahmad',
      date: '2026-09-29',
      territoryId: 'terr-cachar-01',
      territoryName: 'Silchar Central & Hospital Road',
      routeTitle: 'Hospital Road Cardiac & Diab Beat',
      plannedDoctorsCount: 2,
      plannedChemistsCount: 1,
      doctorIds: ['doc-01', 'doc-02'],
      chemistIds: ['chem-01'],
      status: 'APPROVED',
      approvalComments: 'Approved by ASM G Solanki. Focus on CardioPulse-AM.',
    }
  ]);
  
  const [isSimulatingPing, setIsSimulatingPing] = useState(false);

  // Sync tab with URL Hash
  React.useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (hash === 'admin' || hash === 'admin_portal' || hash === 'admin-portal') {
        setActiveTab('admin_portal');
      } else if (hash === 'dashboard' || hash === 'manager') {
        setActiveTab('dashboard');
      } else if (hash === 'doctors') {
        setActiveTab('doctors');
      } else if (hash === 'chemists') {
        setActiveTab('chemists');
      } else if (hash === 'products') {
        setActiveTab('products');
      } else if (hash === 'territories') {
        setActiveTab('territories');
      } else if (hash === 'dcr') {
        setActiveTab('dcr');
      } else if (hash === 'tour_plans' || hash === 'tour') {
        setActiveTab('tour_plans');
      } else if (hash === 'orders') {
        setActiveTab('orders');
      } else if (hash === 'rcpa') {
        setActiveTab('rcpa');
      } else if (hash === 'attendance') {
        setActiveTab('attendance');
      } else if (hash === 'expenses') {
        setActiveTab('expenses');
      } else if (hash === 'mis_reports' || hash === 'reports') {
        setActiveTab('mis_reports');
      } else if (hash === 'fleet_tracking' || hash === 'fleet') {
        setActiveTab('fleet_tracking');
      }
    };

    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    window.location.hash = tab === 'admin_portal' ? 'admin' : tab;
  };

  // Helper to log audit entries automatically
  const logAudit = (
    action: AuditLogEntry['action'],
    entityType: AuditLogEntry['entityType'],
    entityId: string,
    entityName: string,
    details: string
  ) => {
    if (!currentUser) return;
    const entry: AuditLogEntry = {
      id: `aud-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action,
      entityType,
      entityId,
      entityName,
      companyId: currentUser.companyId,
      companyName: currentUser.companyName,
      details,
    };
    setAuditLogs(prev => [entry, ...prev]);
  };

  // Login handler
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    AuthService.setCurrentUser(user);
    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    if (hash && hash !== '') {
      // keep requested tab from hash
    } else if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
      setActiveTab('admin_portal');
      window.location.hash = 'admin';
    } else {
      setActiveTab('dashboard');
      window.location.hash = 'dashboard';
    }
  };

  // Logout handler
  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
  };

  // Switch role handler for testing RBAC
  const handleRoleChange = (newRole: UserRole) => {
    if (!currentUser) return;
    const matchingUser = users.find(u => u.role === newRole) || {
      ...currentUser,
      role: newRole,
    };
    AuthService.switchUser(matchingUser);
    setCurrentUser(matchingUser);
  };

  // Switch to specific user account directly
  const handleSwitchUser = (user: User) => {
    AuthService.switchUser(user);
    setCurrentUser(user);
  };

  // User CRUD Handlers
  const handleAddUser = (newUser: User) => {
    setUsers(prev => [newUser, ...prev]);
    logAudit('CREATE', 'USER', newUser.id, newUser.name, `Created user account with role ${newUser.role} in ${newUser.companyName || 'company'}`);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser && updatedUser.id === currentUser.id) {
      setCurrentUser(updatedUser);
      AuthService.setCurrentUser(updatedUser);
    }
    logAudit('UPDATE', 'USER', updatedUser.id, updatedUser.name, `Updated user details and permissions for ${updatedUser.name}`);
  };

  const handleDeleteUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
    if (target) {
      logAudit('DELETE', 'USER', userId, target.name, `Removed user account ${target.name} (${target.employeeCode})`);
    }
  };

  // Company CRUD Handlers
  const handleAddCompany = (newCompany: Company) => {
    setCompanies(prev => [newCompany, ...prev]);
    logAudit('CREATE', 'COMPANY', newCompany.id, newCompany.name, `Provisioned new multi-tenant organization (${newCompany.code}) with ${newCompany.subscriptionPlan} plan`);
  };

  const handleUpdateCompany = (updatedCompany: Company) => {
    setCompanies(prev => prev.map(c => c.id === updatedCompany.id ? updatedCompany : c));
    logAudit('UPDATE', 'COMPANY', updatedCompany.id, updatedCompany.name, `Updated company profile / status to ${updatedCompany.status}`);
  };

  const handleDeleteCompany = (companyId: string) => {
    const target = companies.find(c => c.id === companyId);
    setCompanies(prev => prev.filter(c => c.id !== companyId));
    if (target) {
      logAudit('DELETE', 'COMPANY', companyId, target.name, `Deleted company tenant ${target.name}`);
    }
  };

  // Doctor CRUD Handlers
  const handleAddDoctor = (newDoc: Doctor) => {
    setDoctors(prev => [newDoc, ...prev]);
    logAudit('CREATE', 'DOCTOR', newDoc.id, newDoc.name, `Added Doctor to Master DB (${newDoc.specialty}, Tier ${newDoc.tier})`);
  };

  const handleUpdateDoctor = (updatedDoc: Doctor) => {
    setDoctors(prev => prev.map(d => d.id === updatedDoc.id ? updatedDoc : d));
    logAudit('UPDATE', 'DOCTOR', updatedDoc.id, updatedDoc.name, `Updated Doctor record (${updatedDoc.clinicName})`);
  };

  const handleDeleteDoctor = (docId: string) => {
    const target = doctors.find(d => d.id === docId);
    setDoctors(prev => prev.filter(d => d.id !== docId));
    if (target) {
      logAudit('DELETE', 'DOCTOR', docId, target.name, `Deleted Doctor from Master DB: ${target.name}`);
    }
  };

  // Chemist CRUD Handlers
  const handleAddChemist = (newChem: Chemist) => {
    setChemists(prev => [newChem, ...prev]);
    logAudit('CREATE', 'CHEMIST', newChem.id, newChem.shopName, `Registered Chemist / Pharmacy in Master DB (${newChem.drugLicenseNumber})`);
  };

  const handleUpdateChemist = (updatedChem: Chemist) => {
    setChemists(prev => prev.map(c => c.id === updatedChem.id ? updatedChem : c));
    logAudit('UPDATE', 'CHEMIST', updatedChem.id, updatedChem.shopName, `Updated Chemist profile ${updatedChem.shopName}`);
  };

  const handleDeleteChemist = (chemId: string) => {
    const target = chemists.find(c => c.id === chemId);
    setChemists(prev => prev.filter(c => c.id !== chemId));
    if (target) {
      logAudit('DELETE', 'CHEMIST', chemId, target.shopName, `Removed Chemist from Master DB: ${target.shopName}`);
    }
  };

  // Product CRUD Handlers
  const handleAddProduct = (newProd: Product) => {
    setProducts(prev => [newProd, ...prev]);
    logAudit('CREATE', 'PRODUCT', newProd.id, newProd.name, `Added Product SKU ${newProd.name} (MRP ₹${newProd.mrp})`);
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
    logAudit('UPDATE', 'PRODUCT', updatedProd.id, updatedProd.name, `Updated Product pricing and details for ${updatedProd.name}`);
  };

  const handleDeleteProduct = (prodId: string) => {
    const target = products.find(p => p.id === prodId);
    setProducts(prev => prev.filter(p => p.id !== prodId));
    if (target) {
      logAudit('DELETE', 'PRODUCT', prodId, target.name, `Removed Product SKU: ${target.name}`);
    }
  };

  // Territory CRUD Handlers
  const handleAddTerritory = (newTerr: Territory) => {
    setTerritories(prev => [newTerr, ...prev]);
    logAudit('CREATE', 'TERRITORY', newTerr.id, newTerr.name, `Created Territory ${newTerr.name} (${newTerr.code})`);
  };

  const handleUpdateTerritory = (updatedTerr: Territory) => {
    setTerritories(prev => prev.map(t => t.id === updatedTerr.id ? updatedTerr : t));
    logAudit('UPDATE', 'TERRITORY', updatedTerr.id, updatedTerr.name, `Updated Territory alignment ${updatedTerr.name}`);
  };

  const handleDeleteTerritory = (terrId: string) => {
    const target = territories.find(t => t.id === terrId);
    setTerritories(prev => prev.filter(t => t.id !== terrId));
    if (target) {
      logAudit('DELETE', 'TERRITORY', terrId, target.name, `Deleted Territory: ${target.name}`);
    }
  };

  // Add new DCR handler
  const handleAddDCR = (newDcr: DCRRecord) => {
    setDcrLogs(prev => [newDcr, ...prev]);
  };

  // Add new Tour Plan
  const handleAddTourPlan = (newPlan: TourPlanItem) => {
    setTourPlans(prev => [newPlan, ...prev]);
  };

  // Tour plan status update
  const handleUpdateTourPlanStatus = (id: string, newStatus: 'APPROVED' | 'REJECTED', comments?: string) => {
    setTourPlans(prev => prev.map(tp => tp.id === id ? { ...tp, status: newStatus, approvalComments: comments } : tp));
  };

  // 15-Minute Background Telemetry Simulator
  const handleTriggerTelemetryPing = () => {
    setIsSimulatingPing(true);
    setTimeout(() => {
      const nextLat = 24.8146 + (Math.random() - 0.5) * 0.0004;
      const nextLng = 92.8037 + (Math.random() - 0.5) * 0.0004;
      
      const newPoint = TelemetryService.ingest15MinPing({
        userId: currentUser?.id || 'usr-mr-01',
        userName: currentUser ? `${currentUser.name} (${currentUser.role})` : 'Field Rep',
        userRole: currentUser?.role || 'MEDICAL_REP',
        territoryName: 'Silchar Central & Hospital Road',
        latitude: nextLat,
        longitude: nextLng,
        accuracyMeters: 5.5,
        speedKmh: Math.floor(Math.random() * 5),
        batteryPercentage: Math.max(10, (telemetryLogs[telemetryLogs.length - 1]?.batteryPercentage || 90) - 1),
        isMockLocation: false,
        isCharging: false,
      });

      setTelemetryLogs(prev => [...prev, newPoint]);
      setIsSimulatingPing(false);
    }, 600);
  };

  // If user is not authenticated, render dedicated Login Page
  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        users={users}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        isSimulatingTelemetry={isSimulatingPing}
        onTriggerTelemetryPing={handleTriggerTelemetryPing}
        onOpenDemoTour={() => setIsDemoTourOpen(true)}
        onOpenChangePassword={() => setIsChangePasswordModalOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={handleTabChange}
          userRole={currentUser.role}
        />

        {/* Dynamic Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto max-w-5xl">
          {/* Admin Control Center Portal */}
          {activeTab === 'admin_portal' && (
            <AdminPortal
              currentUser={currentUser}
              companies={companies}
              users={users}
              doctors={doctors}
              chemists={chemists}
              products={products}
              territories={territories}
              auditLogs={auditLogs}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              onAddCompany={handleAddCompany}
              onUpdateCompany={handleUpdateCompany}
              onDeleteCompany={handleDeleteCompany}
              onAddDoctor={handleAddDoctor}
              onUpdateDoctor={handleUpdateDoctor}
              onDeleteDoctor={handleDeleteDoctor}
              onAddChemist={handleAddChemist}
              onUpdateChemist={handleUpdateChemist}
              onDeleteChemist={handleDeleteChemist}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onAddTerritory={handleAddTerritory}
              onUpdateTerritory={handleUpdateTerritory}
              onDeleteTerritory={handleDeleteTerritory}
              onSwitchUser={handleSwitchUser}
            />
          )}

          {activeTab === 'dashboard' && (
            <ExecutiveDashboard
              doctors={doctors}
              chemists={chemists}
              products={products}
              telemetryLogs={telemetryLogs}
              dcrLogs={dcrLogs}
              userRole={currentUser.role}
              onNavigateToTab={handleTabChange}
            />
          )}

          {activeTab === 'fleet_tracking' && (
            <LiveFleetMap
              userRole={currentUser.role}
              telemetryLogs={telemetryLogs}
            />
          )}

          {activeTab === 'dcr' && (
            <DCRView
              dcrLogs={dcrLogs}
              doctors={doctors}
              products={products}
              currentUser={currentUser}
              onAddDCR={handleAddDCR}
            />
          )}

          {activeTab === 'tour_plans' && (
            <TourPlanner
              tourPlans={tourPlans}
              doctors={doctors}
              chemists={chemists}
              currentUser={currentUser}
              onAddTourPlan={handleAddTourPlan}
              onUpdateStatus={handleUpdateTourPlanStatus}
            />
          )}

          {activeTab === 'orders' && (
            <POBOrderBooking
              products={products}
              chemists={chemists}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'rcpa' && (
            <RCPAAuditView
              doctors={doctors}
              chemists={chemists}
            />
          )}

          {activeTab === 'attendance' && (
            <GeoAttendanceView
              currentUser={currentUser}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpenseClaimsView
              currentUser={currentUser}
            />
          )}

          {activeTab === 'mis_reports' && (
            <MISReportsView
              doctors={doctors}
              chemists={chemists}
              products={products}
              dcrLogs={dcrLogs}
            />
          )}

          {activeTab === 'doctors' && (
            <DoctorDirectory
              doctors={doctors}
              currentUser={currentUser}
              onAddDoctor={handleAddDoctor}
              onUpdateDoctor={handleUpdateDoctor}
              onDeleteDoctor={handleDeleteDoctor}
            />
          )}

          {activeTab === 'chemists' && (
            <ChemistDirectory
              chemists={chemists}
              currentUser={currentUser}
              onAddChemist={handleAddChemist}
              onUpdateChemist={handleUpdateChemist}
              onDeleteChemist={handleDeleteChemist}
            />
          )}

          {activeTab === 'products' && (
            <ProductCatalog
              products={products}
              currentUser={currentUser}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {activeTab === 'territories' && (
            <TerritoryStaffView
              territories={territories}
              users={users}
            />
          )}
        </main>

      </div>

      {/* Authentication Login Modal (For switching accounts while in session) */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        users={users}
        onLoginSuccess={(user) => {
          handleLoginSuccess(user);
          logAudit('ROLE_CHANGE', 'USER', user.id, user.name, `User ${user.name} switched account successfully`);
        }}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        currentUser={currentUser}
        users={users}
        onPasswordChanged={(updatedUser) => {
          setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
          setCurrentUser(updatedUser);
          logAudit('UPDATE', 'USER', updatedUser.id, updatedUser.name, `User ${updatedUser.name} updated account password`);
        }}
      />

      {/* Interactive Guided Demo Simulator Modal */}
      <GuidedDemoModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onNavigateTab={(tab) => {
          if (tab === 'live-tracking' || tab === 'fleet_tracking') setActiveTab('fleet_tracking');
          else if (tab === 'tour_plans' || tab === 'tour') setActiveTab('tour_plans');
          else setActiveTab(tab as any);
        }}
        onSetRole={(role) => handleRoleChange(role)}
      />

    </div>
  );
}
