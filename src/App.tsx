import React, { useState, useEffect } from 'react';
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
  INITIAL_TELEMETRY_LOGS 
} from './data/mockData';
import { AuthService } from './services/authService';
import { StorageService } from './services/storageService';
import { FirestoreService } from './services/firestoreService';
import { TelemetryService } from './services/telemetryService';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { AdminPortal } from './components/admin/AdminPortal';
import { UserAccessManager } from './components/admin/UserAccessManager';
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
import { DatabaseSyncModal } from './components/common/DatabaseSyncModal';
import { ShieldCheck, Users, Stethoscope, FileText, LayoutDashboard, Menu } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => AuthService.getCurrentUser());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>(() => {
    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    if (hash === 'admin' || hash === 'admin_portal' || hash === 'admin-portal') return 'admin_portal';
    if (hash === 'staff' || hash === 'users' || hash === 'employees' || hash === 'team') return 'staff';
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
  const [isDatabaseSyncModalOpen, setIsDatabaseSyncModalOpen] = useState(false);
  
  // Master Multi-Tenant State - Initialized from Persistent StorageService
  const [companies, setCompanies] = useState<Company[]>(() => StorageService.getCompanies());
  const [users, setUsers] = useState<User[]>(() => StorageService.getUsers());
  const [doctors, setDoctors] = useState<Doctor[]>(() => StorageService.getDoctors());
  const [chemists, setChemists] = useState<Chemist[]>(() => StorageService.getChemists());
  const [products, setProducts] = useState<Product[]>(() => StorageService.getProducts());
  const [territories, setTerritories] = useState<Territory[]>(() => StorageService.getTerritories());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => StorageService.getAuditLogs());

  // Field Telemetry & Reports State
  const [telemetryLogs, setTelemetryLogs] = useState<LocationTelemetryPoint[]>(INITIAL_TELEMETRY_LOGS);
  const [dcrLogs, setDcrLogs] = useState<DCRRecord[]>(() => StorageService.getDCRLogs());

  // Tour Plans & Planned Visits State
  const [tourPlans, setTourPlans] = useState<TourPlanItem[]>(() => StorageService.getTourPlans());
  const [plannedVisits, setPlannedVisits] = useState<string[]>(() => StorageService.getPlannedVisits());
  
  const [isSimulatingPing, setIsSimulatingPing] = useState(false);

  // Sync tab with URL Hash
  useEffect(() => {
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
      } else if (hash === 'staff' || hash === 'users' || hash === 'employees' || hash === 'team') {
        setActiveTab('staff');
      }
    };

    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  // Real-time Two-Way Sync with Google Cloud Firestore
  useEffect(() => {
    if (!FirestoreService.isConnected()) return;

    // 1. Subscribe to live Doctor updates from Cloud
    const unsubDoctors = FirestoreService.subscribeDoctors((cloudDocs) => {
      if (cloudDocs && cloudDocs.length > 0) {
        setDoctors(cloudDocs);
        StorageService.saveDoctors(cloudDocs);
      }
    });

    // 2. Subscribe to live Chemists updates from Cloud
    const unsubChemists = FirestoreService.subscribeChemists((cloudChems) => {
      if (cloudChems && cloudChems.length > 0) {
        setChemists(cloudChems);
        StorageService.saveChemists(cloudChems);
      }
    });

    // 3. Subscribe to live Products updates from Cloud
    const unsubProducts = FirestoreService.subscribeProducts((cloudProds) => {
      if (cloudProds && cloudProds.length > 0) {
        setProducts(cloudProds);
        StorageService.saveProducts(cloudProds);
      }
    });

    // 4. Subscribe to live Territories updates from Cloud
    const unsubTerritories = FirestoreService.subscribeTerritories((cloudTerrs) => {
      if (cloudTerrs && cloudTerrs.length > 0) {
        setTerritories(cloudTerrs);
        StorageService.saveTerritories(cloudTerrs);
      }
    });

    // 5. Subscribe to live Users updates from Cloud
    const unsubUsers = FirestoreService.subscribeUsers((cloudUsers) => {
      if (cloudUsers && cloudUsers.length > 0) {
        setUsers(cloudUsers);
        StorageService.saveUsers(cloudUsers);
      }
    });

    // 6. Subscribe to live Field Visits / DCR from Cloud
    const unsubDCR = FirestoreService.subscribeDCRLogs((cloudDcr) => {
      if (cloudDcr && cloudDcr.length > 0) {
        setDcrLogs(cloudDcr);
        StorageService.saveDCRLogs(cloudDcr);
      }
    });

    // Initial check: if cloud has no doctors, seed local baseline to cloud
    FirestoreService.fetchDoctors().then((existingCloudDocs) => {
      if (!existingCloudDocs || existingCloudDocs.length === 0) {
        const localDocs = StorageService.getDoctors();
        const localChems = StorageService.getChemists();
        const localProds = StorageService.getProducts();
        if (localDocs.length > 0 || localChems.length > 0) {
          FirestoreService.syncAllLocalToCloud({
            doctors: localDocs,
            chemists: localChems,
            products: localProds,
            users: StorageService.getUsers(),
            companies: StorageService.getCompanies(),
            territories: StorageService.getTerritories(),
            dcrLogs: StorageService.getDCRLogs(),
          }).catch((err) => console.warn('[Firestore] Initial auto-seed error:', err));
        }
      }
    });

    return () => {
      unsubDoctors();
      unsubChemists();
      unsubProducts();
      unsubTerritories();
      unsubUsers();
      unsubDCR();
    };
  }, []);

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    window.location.hash = tab === 'admin_portal' ? 'admin' : tab;
  };

  // Reload state from StorageService (e.g. after JSON backup import)
  const handleDatabaseUpdated = () => {
    setCompanies(StorageService.getCompanies());
    setUsers(StorageService.getUsers());
    setDoctors(StorageService.getDoctors());
    setChemists(StorageService.getChemists());
    setProducts(StorageService.getProducts());
    setTerritories(StorageService.getTerritories());
    setDcrLogs(StorageService.getDCRLogs());
    setTourPlans(StorageService.getTourPlans());
    setPlannedVisits(StorageService.getPlannedVisits());
    setAuditLogs(StorageService.getAuditLogs());
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
    setAuditLogs(prev => {
      const updated = [entry, ...prev];
      StorageService.saveAuditLogs(updated);
      return updated;
    });
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
    setUsers(prev => {
      const updated = [newUser, ...prev];
      StorageService.saveUsers(updated);
      return updated;
    });
    logAudit('CREATE', 'USER', newUser.id, newUser.name, `Created user account with role ${newUser.role} in ${newUser.companyName || 'company'}`);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => {
      const updated = prev.map(u => u.id === updatedUser.id ? updatedUser : u);
      StorageService.saveUsers(updated);
      return updated;
    });
    if (currentUser && updatedUser.id === currentUser.id) {
      setCurrentUser(updatedUser);
      AuthService.setCurrentUser(updatedUser);
    }
    logAudit('UPDATE', 'USER', updatedUser.id, updatedUser.name, `Updated user details and permissions for ${updatedUser.name}`);
  };

  const handleDeleteUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    setUsers(prev => {
      const updated = prev.filter(u => u.id !== userId);
      StorageService.saveUsers(updated);
      return updated;
    });
    if (target) {
      logAudit('DELETE', 'USER', userId, target.name, `Removed user account ${target.name} (${target.employeeCode})`);
    }
  };

  // Company CRUD Handlers
  const handleAddCompany = (newCompany: Company) => {
    setCompanies(prev => {
      const updated = [newCompany, ...prev];
      StorageService.saveCompanies(updated);
      return updated;
    });
    logAudit('CREATE', 'COMPANY', newCompany.id, newCompany.name, `Provisioned new multi-tenant organization (${newCompany.code}) with ${newCompany.subscriptionPlan} plan`);
  };

  const handleUpdateCompany = (updatedCompany: Company) => {
    setCompanies(prev => {
      const updated = prev.map(c => c.id === updatedCompany.id ? updatedCompany : c);
      StorageService.saveCompanies(updated);
      return updated;
    });
    logAudit('UPDATE', 'COMPANY', updatedCompany.id, updatedCompany.name, `Updated company profile / status to ${updatedCompany.status}`);
  };

  const handleDeleteCompany = (companyId: string) => {
    const target = companies.find(c => c.id === companyId);
    setCompanies(prev => {
      const updated = prev.filter(c => c.id !== companyId);
      StorageService.saveCompanies(updated);
      return updated;
    });
    if (target) {
      logAudit('DELETE', 'COMPANY', companyId, target.name, `Deleted company tenant ${target.name}`);
    }
  };

  // Doctor CRUD Handlers with LocalStorage Persistence
  const handleAddDoctor = (newDoc: Doctor) => {
    setDoctors(prev => {
      const updated = [newDoc, ...prev];
      StorageService.saveDoctors(updated);
      return updated;
    });
    logAudit('CREATE', 'DOCTOR', newDoc.id, newDoc.name, `Added Doctor to Master DB (${newDoc.specialty}, Tier ${newDoc.tier})`);
  };

  const handleUpdateDoctor = (updatedDoc: Doctor) => {
    setDoctors(prev => {
      const updated = prev.map(d => d.id === updatedDoc.id ? updatedDoc : d);
      StorageService.saveDoctors(updated);
      return updated;
    });
    logAudit('UPDATE', 'DOCTOR', updatedDoc.id, updatedDoc.name, `Updated Doctor record (${updatedDoc.clinicName})`);
  };

  const handleDeleteDoctor = (docId: string) => {
    const target = doctors.find(d => d.id === docId);
    setDoctors(prev => {
      const updated = prev.filter(d => d.id !== docId);
      StorageService.saveDoctors(updated);
      return updated;
    });
    setPlannedVisits(prev => {
      const updated = prev.filter(id => id !== docId);
      StorageService.savePlannedVisits(updated);
      return updated;
    });
    if (target) {
      logAudit('DELETE', 'DOCTOR', docId, target.name, `Deleted Doctor from Master DB: ${target.name}`);
    }
  };

  // "Add to Visit" Planning Queue Handlers
  const handleTogglePlanVisit = (doctorId: string) => {
    setPlannedVisits(prev => {
      const exists = prev.includes(doctorId);
      const updated = exists ? prev.filter(id => id !== doctorId) : [...prev, doctorId];
      StorageService.savePlannedVisits(updated);
      return updated;
    });
  };

  const handleBatchAddPlannedVisits = (doctorIds: string[]) => {
    setPlannedVisits(prev => {
      const set = new Set([...prev, ...doctorIds]);
      const updated = Array.from(set);
      StorageService.savePlannedVisits(updated);
      return updated;
    });
  };

  const handleRemovePlannedDoctor = (doctorId: string) => {
    setPlannedVisits(prev => {
      const updated = prev.filter(id => id !== doctorId);
      StorageService.savePlannedVisits(updated);
      return updated;
    });
  };

  const handleClearPlannedDoctors = () => {
    setPlannedVisits([]);
    StorageService.savePlannedVisits([]);
  };

  // Chemist CRUD Handlers
  const handleAddChemist = (newChem: Chemist) => {
    setChemists(prev => {
      const updated = [newChem, ...prev];
      StorageService.saveChemists(updated);
      return updated;
    });
    logAudit('CREATE', 'CHEMIST', newChem.id, newChem.shopName, `Registered Chemist / Pharmacy in Master DB (${newChem.drugLicenseNumber})`);
  };

  const handleUpdateChemist = (updatedChem: Chemist) => {
    setChemists(prev => {
      const updated = prev.map(c => c.id === updatedChem.id ? updatedChem : c);
      StorageService.saveChemists(updated);
      return updated;
    });
    logAudit('UPDATE', 'CHEMIST', updatedChem.id, updatedChem.shopName, `Updated Chemist profile ${updatedChem.shopName}`);
  };

  const handleDeleteChemist = (chemId: string) => {
    const target = chemists.find(c => c.id === chemId);
    setChemists(prev => {
      const updated = prev.filter(c => c.id !== chemId);
      StorageService.saveChemists(updated);
      return updated;
    });
    if (target) {
      logAudit('DELETE', 'CHEMIST', chemId, target.shopName, `Removed Chemist from Master DB: ${target.shopName}`);
    }
  };

  // Product CRUD Handlers
  const handleAddProduct = (newProd: Product) => {
    setProducts(prev => {
      const updated = [newProd, ...prev];
      StorageService.saveProducts(updated);
      return updated;
    });
    logAudit('CREATE', 'PRODUCT', newProd.id, newProd.name, `Added Product SKU ${newProd.name} (MRP ₹${newProd.mrp})`);
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    setProducts(prev => {
      const updated = prev.map(p => p.id === updatedProd.id ? updatedProd : p);
      StorageService.saveProducts(updated);
      return updated;
    });
    logAudit('UPDATE', 'PRODUCT', updatedProd.id, updatedProd.name, `Updated Product pricing and details for ${updatedProd.name}`);
  };

  const handleDeleteProduct = (prodId: string) => {
    const target = products.find(p => p.id === prodId);
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== prodId);
      StorageService.saveProducts(updated);
      return updated;
    });
    if (target) {
      logAudit('DELETE', 'PRODUCT', prodId, target.name, `Removed Product SKU: ${target.name}`);
    }
  };

  // Territory CRUD Handlers
  const handleAddTerritory = (newTerr: Territory) => {
    setTerritories(prev => {
      const updated = [newTerr, ...prev];
      StorageService.saveTerritories(updated);
      return updated;
    });
    logAudit('CREATE', 'TERRITORY', newTerr.id, newTerr.name, `Created Territory ${newTerr.name} (${newTerr.code})`);
  };

  const handleUpdateTerritory = (updatedTerr: Territory) => {
    setTerritories(prev => {
      const updated = prev.map(t => t.id === updatedTerr.id ? updatedTerr : t);
      StorageService.saveTerritories(updated);
      return updated;
    });
    logAudit('UPDATE', 'TERRITORY', updatedTerr.id, updatedTerr.name, `Updated Territory alignment ${updatedTerr.name}`);
  };

  const handleDeleteTerritory = (terrId: string) => {
    const target = territories.find(t => t.id === terrId);
    setTerritories(prev => {
      const updated = prev.filter(t => t.id !== terrId);
      StorageService.saveTerritories(updated);
      return updated;
    });
    if (target) {
      logAudit('DELETE', 'TERRITORY', terrId, target.name, `Deleted Territory: ${target.name}`);
    }
  };

  // Add new DCR handler
  const handleAddDCR = (newDcr: DCRRecord) => {
    setDcrLogs(prev => {
      const updated = [newDcr, ...prev];
      StorageService.saveDCRLogs(updated);
      return updated;
    });
  };

  // Add new Tour Plan
  const handleAddTourPlan = (newPlan: TourPlanItem) => {
    setTourPlans(prev => {
      const updated = [newPlan, ...prev];
      StorageService.saveTourPlans(updated);
      return updated;
    });
  };

  // Tour plan status update
  const handleUpdateTourPlanStatus = (id: string, newStatus: 'APPROVED' | 'REJECTED', comments?: string) => {
    setTourPlans(prev => {
      const updated = prev.map(tp => tp.id === id ? { ...tp, status: newStatus, approvalComments: comments } : tp);
      StorageService.saveTourPlans(updated);
      return updated;
    });
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
        onOpenDatabaseSync={() => setIsDatabaseSyncModalOpen(true)}
        onLogout={handleLogout}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto relative min-w-0 pb-16 lg:pb-0">
        
        {/* Left Navigation Sidebar (Desktop sticky + Mobile slide-over drawer) */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={handleTabChange}
          userRole={currentUser.role}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Dynamic Main Content Area */}
        <main className="flex-1 p-3 sm:p-5 md:p-6 overflow-y-auto max-w-full lg:max-w-5xl w-full min-w-0">
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
              doctors={doctors}
              dcrLogs={dcrLogs}
            />
          )}

          {activeTab === 'dcr' && (
            <DCRView
              dcrLogs={dcrLogs}
              doctors={doctors}
              products={products}
              currentUser={currentUser}
              plannedDoctorIds={plannedVisits}
              onRemovePlannedDoctor={handleRemovePlannedDoctor}
              onClearPlannedDoctors={handleClearPlannedDoctors}
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
              plannedVisitDoctorIds={plannedVisits}
              onTogglePlanVisit={handleTogglePlanVisit}
              onBatchAddPlannedVisits={handleBatchAddPlannedVisits}
              onNavigateToVisits={() => handleTabChange('dcr')}
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

          {activeTab === 'staff' && (
            <UserAccessManager
              users={users}
              companies={companies}
              territories={territories}
              currentUser={currentUser}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              onSwitchUser={handleSwitchUser}
            />
          )}
        </main>

      </div>

      {/* Modern App-Like Mobile Bottom Navigation Bar (Visible on < lg screens) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around py-2 px-1 shadow-2xl safe-area-inset-bottom">
        {/* Admin / Staff Tab */}
        <button
          onClick={() => handleTabChange(AuthService.canAccessAdminPortal(currentUser) ? 'admin_portal' : 'staff')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all ${
            activeTab === 'admin_portal' || activeTab === 'staff'
              ? 'text-teal-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Admin</span>
        </button>

        {/* Doctors Tab */}
        <button
          onClick={() => handleTabChange('doctors')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all ${
            activeTab === 'doctors'
              ? 'text-teal-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Stethoscope className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Doctors</span>
        </button>

        {/* DCR Visits Tab */}
        <button
          onClick={() => handleTabChange('dcr')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all ${
            activeTab === 'dcr'
              ? 'text-teal-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">DCR Calls</span>
        </button>

        {/* Overview Tab */}
        <button
          onClick={() => handleTabChange('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all ${
            activeTab === 'dashboard'
              ? 'text-teal-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Overview</span>
        </button>

        {/* All Menus Drawer Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-lg text-slate-400 hover:text-teal-300 transition-all"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">All Menus</span>
        </button>
      </nav>

      {/* Database Backup / Restore & Cross-Device Sync Modal */}
      <DatabaseSyncModal
        isOpen={isDatabaseSyncModalOpen}
        onClose={() => setIsDatabaseSyncModalOpen(false)}
        onDatabaseUpdated={handleDatabaseUpdated}
      />

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
          setUsers(prev => {
            const updated = prev.map(u => u.id === updatedUser.id ? updatedUser : u);
            StorageService.saveUsers(updated);
            return updated;
          });
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
