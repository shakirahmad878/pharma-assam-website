import React, { useState } from 'react';
import { 
  User, 
  Company, 
  Doctor, 
  Chemist, 
  Product, 
  Territory, 
  AuditLogEntry, 
  UserRole 
} from '../../types';
import { AuthService } from '../../services/authService';
import { UserAccessManager } from './UserAccessManager';
import { CompanyManager } from './CompanyManager';
import { DatabaseStudio } from './DatabaseStudio';
import { RolePermissionsMatrix } from './RolePermissionsMatrix';
import { AuditLogsView } from './AuditLogsView';
import { 
  Shield, 
  ShieldCheck, 
  Building2, 
  Users, 
  Database, 
  History, 
  Key, 
  LayoutDashboard, 
  Stethoscope, 
  Store, 
  Pill, 
  Map, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Layers,
  FileCheck
} from 'lucide-react';

export type AdminTab = 'overview' | 'users' | 'companies' | 'database' | 'matrix' | 'audit';

interface AdminPortalProps {
  currentUser: User;
  companies: Company[];
  users: User[];
  doctors: Doctor[];
  chemists: Chemist[];
  products: Product[];
  territories: Territory[];
  auditLogs: AuditLogEntry[];
  onAddUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onAddCompany: (company: Company) => void;
  onUpdateCompany: (company: Company) => void;
  onDeleteCompany: (companyId: string) => void;
  onAddDoctor: (doc: Doctor) => void;
  onUpdateDoctor: (doc: Doctor) => void;
  onDeleteDoctor: (docId: string) => void;
  onAddChemist: (chem: Chemist) => void;
  onUpdateChemist: (chem: Chemist) => void;
  onDeleteChemist: (chemId: string) => void;
  onAddProduct: (prod: Product) => void;
  onUpdateProduct: (prod: Product) => void;
  onDeleteProduct: (prodId: string) => void;
  onAddTerritory: (terr: Territory) => void;
  onUpdateTerritory: (terr: Territory) => void;
  onDeleteTerritory: (terrId: string) => void;
  onSwitchUser?: (user: User) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  companies,
  users,
  doctors,
  chemists,
  products,
  territories,
  auditLogs,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onAddCompany,
  onUpdateCompany,
  onDeleteCompany,
  onAddDoctor,
  onUpdateDoctor,
  onDeleteDoctor,
  onAddChemist,
  onUpdateChemist,
  onDeleteChemist,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddTerritory,
  onUpdateTerritory,
  onDeleteTerritory,
  onSwitchUser,
}) => {
  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';
  const isAdmin = currentUser.role === 'ADMIN';
  const isManager = AuthService.isManager(currentUser);

  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('overview');
  const [selectedCompanyScope, setSelectedCompanyScope] = useState<string>(
    isSuperAdmin ? 'ALL' : (currentUser.companyId || 'comp-01')
  );

  // Scoped Master Data Counts
  const scopedUsers = AuthService.getCompanyScopedData(users, currentUser, selectedCompanyScope);
  const scopedDoctors = AuthService.getCompanyScopedData(doctors, currentUser, selectedCompanyScope);
  const scopedChemists = AuthService.getCompanyScopedData(chemists, currentUser, selectedCompanyScope);
  const scopedProducts = AuthService.getCompanyScopedData(products, currentUser, selectedCompanyScope);
  const scopedTerritories = AuthService.getCompanyScopedData(territories, currentUser, selectedCompanyScope);

  const currentActiveCompany = companies.find(c => c.id === (currentUser.companyId || 'comp-01')) || companies[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="neu-card p-4 sm:p-6 text-[#F2ECE1] border border-[#282319] relative overflow-hidden">
        {/* Background glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#6C5636]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-2">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8A7049] via-[#6C5636] to-[#4A3B24] border border-[#B99D73]/40 flex items-center justify-center text-[#090907] font-black shadow-[3px_3px_8px_#040403,-2px_-2px_6px_#181711] shrink-0">
                <Shield className="w-5 h-5 stroke-[2.8]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h1 className="text-base sm:text-xl font-extrabold tracking-tight text-[#F2ECE1]">
                    RepPulse Admin & RBAC Studio
                  </h1>
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest bg-[#6C5636]/30 text-[#B99D73] px-2 py-0.5 rounded-md border border-[#6C5636]/50 shadow-[inset_1px_1px_3px_#040403]">
                    Enterprise
                  </span>
                </div>
                <p className="text-xs text-[#857866] mt-0.5">
                  Centralized Multi-Tenant Authorization & Master Database Studio.
                </p>
              </div>
            </div>
          </div>

          {/* Current User Scope Badge */}
          <div className="flex items-center gap-3 bg-[#0d0d0a] p-3 rounded-xl border border-[#221e16] shadow-[inset_2px_2px_5px_#040403,inset_-2px_-2px_5px_#181711] self-start md:self-auto">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-xs font-bold text-[#F2ECE1]">{currentUser.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                  isSuperAdmin ? 'bg-[#6C5636]/40 text-[#D4BD95] border border-[#B99D73]/40' :
                  isAdmin ? 'bg-[#181712] text-[#B99D73] border border-[#282319]' :
                  'bg-[#14130e] text-[#857866] border border-[#282319]'
                }`}>
                  {isSuperAdmin ? '👑 Super Admin' : isAdmin ? '🏢 Company Admin' : '👔 Manager'}
                </span>
              </div>
              <p className="text-[11px] text-[#857866] mt-0.5">
                {isSuperAdmin ? 'Full Multi-Tenant Access' : currentActiveCompany?.name}
              </p>
            </div>
          </div>
        </div>

        {/* Global Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-[#282319] overflow-x-auto">
          <button
            onClick={() => setActiveAdminTab('overview')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeAdminTab === 'overview'
                ? 'bg-gradient-to-r from-[#7A623E] to-[#6C5636] text-[#090907] shadow-[3px_3px_8px_#040403,-2px_-2px_6px_#1a1813] border border-[#B99D73]'
                : 'neu-btn text-[#857866] hover:text-[#B99D73]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Admin Overview</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('users')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeAdminTab === 'users'
                ? 'bg-gradient-to-r from-[#7A623E] to-[#6C5636] text-[#090907] shadow-[3px_3px_8px_#040403,-2px_-2px_6px_#1a1813] border border-[#B99D73]'
                : 'neu-btn text-[#857866] hover:text-[#B99D73]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User & Access Control</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-[#090907]/30 text-[#090907]">
              {scopedUsers.length}
            </span>
          </button>

          {isSuperAdmin && (
            <button
              onClick={() => setActiveAdminTab('companies')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeAdminTab === 'companies'
                  ? 'bg-gradient-to-r from-[#7A623E] to-[#6C5636] text-[#090907] shadow-[3px_3px_8px_#040403,-2px_-2px_6px_#1a1813] border border-[#B99D73]'
                  : 'neu-btn text-[#857866] hover:text-[#B99D73]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Multi-Tenant Companies</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-[#090907]/30 text-[#090907]">
                {companies.length}
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveAdminTab('database')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeAdminTab === 'database'
                ? 'bg-gradient-to-r from-[#7A623E] to-[#6C5636] text-[#090907] shadow-[3px_3px_8px_#040403,-2px_-2px_6px_#1a1813] border border-[#B99D73]'
                : 'neu-btn text-[#857866] hover:text-[#B99D73]'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Master Database Studio</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('matrix')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeAdminTab === 'matrix'
                ? 'bg-gradient-to-r from-[#7A623E] to-[#6C5636] text-[#090907] shadow-[3px_3px_8px_#040403,-2px_-2px_6px_#1a1813] border border-[#B99D73]'
                : 'neu-btn text-[#857866] hover:text-[#B99D73]'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>RBAC Matrix</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('audit')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeAdminTab === 'audit'
                ? 'bg-gradient-to-r from-[#7A623E] to-[#6C5636] text-[#090907] shadow-[3px_3px_8px_#040403,-2px_-2px_6px_#1a1813] border border-[#B99D73]'
                : 'neu-btn text-[#857866] hover:text-[#B99D73]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Security Audit Trail</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-[#090907]/30 text-[#090907]">
              {auditLogs.length}
            </span>
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          {/* Company Scope & KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="neu-card p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#B99D73] uppercase tracking-wider">
                  {isSuperAdmin ? 'Total Platform Users' : 'Company Staff'}
                </span>
                <p className="text-2xl font-black text-[#F2ECE1] mt-1">{scopedUsers.length}</p>
                <span className="text-[11px] text-[#D4BD95] font-medium mt-1 block">
                  {scopedUsers.filter(u => u.isActive).length} Active Personnel
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-[#0c0c09] border border-[#6C5636]/50 shadow-[inset_2px_2px_5px_#040403] flex items-center justify-center text-[#B99D73]">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="neu-card p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#B99D73] uppercase tracking-wider">Doctor Master DB</span>
                <p className="text-2xl font-black text-[#F2ECE1] mt-1">{scopedDoctors.length}</p>
                <span className="text-[11px] text-[#D4BD95] font-medium mt-1 block">
                  {scopedDoctors.filter(d => d.tier === 'A_PLUS').length} Tier A+ Specialists
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-[#0c0c09] border border-[#6C5636]/50 shadow-[inset_2px_2px_5px_#040403] flex items-center justify-center text-[#B99D73]">
                <Stethoscope className="w-5 h-5" />
              </div>
            </div>

            <div className="neu-card p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#B99D73] uppercase tracking-wider">Chemists & Retail</span>
                <p className="text-2xl font-black text-[#F2ECE1] mt-1">{scopedChemists.length}</p>
                <span className="text-[11px] text-[#D4BD95] font-medium mt-1 block">
                  100% Geotagged Pharmacies
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-[#0c0c09] border border-[#6C5636]/50 shadow-[inset_2px_2px_5px_#040403] flex items-center justify-center text-[#B99D73]">
                <Store className="w-5 h-5" />
              </div>
            </div>

            <div className="neu-card p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#B99D73] uppercase tracking-wider">Product Catalog</span>
                <p className="text-2xl font-black text-[#F2ECE1] mt-1">{scopedProducts.length}</p>
                <span className="text-[11px] text-[#D4BD95] font-medium mt-1 block">
                  Active Pharma SKUs
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-[#0c0c09] border border-[#6C5636]/50 shadow-[inset_2px_2px_5px_#040403] flex items-center justify-center text-[#B99D73]">
                <Pill className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Quick Admin Actions & Feature Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Navigation Cards */}
            <div className="lg:col-span-2 neu-card p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#282319]">
                <div>
                  <h3 className="font-bold text-[#F2ECE1] text-sm">Administrative Action Suite</h3>
                  <p className="text-xs text-[#857866]">Fast access to key database and security controls</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#6C5636]/30 text-[#B99D73] border border-[#6C5636]/50 shadow-[inset_1px_1px_3px_#040403]">
                  Ready
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setActiveAdminTab('users')}
                  className="p-4 rounded-xl border border-[#282319] hover:border-[#6C5636] transition-all text-left group bg-[#0d0d0a] shadow-[inset_2px_2px_5px_#040403,inset_-2px_-2px_5px_#181711] hover:shadow-[3px_3px_10px_#040403] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#181711] border border-[#6C5636]/60 text-[#B99D73] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#F2ECE1] group-hover:text-[#B99D73] transition-colors">Staff & Roles Management</h4>
                      <p className="text-[11px] text-[#857866]">Create users, assign territories & roles</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveAdminTab('database')}
                  className="p-4 rounded-xl border border-[#282319] hover:border-[#6C5636] transition-all text-left group bg-[#0d0d0a] shadow-[inset_2px_2px_5px_#040403,inset_-2px_-2px_5px_#181711] hover:shadow-[3px_3px_10px_#040403] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#181711] border border-[#6C5636]/60 text-[#B99D73] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#F2ECE1] group-hover:text-[#B99D73] transition-colors">Master Database Studio</h4>
                      <p className="text-[11px] text-[#857866]">Add, edit, remove doctors, chemists, SKUs</p>
                    </div>
                  </div>
                </button>

                {isSuperAdmin && (
                  <button
                    onClick={() => setActiveAdminTab('companies')}
                    className="p-4 rounded-xl border border-[#282319] hover:border-[#6C5636] transition-all text-left group bg-[#0d0d0a] shadow-[inset_2px_2px_5px_#040403,inset_-2px_-2px_5px_#181711] hover:shadow-[3px_3px_10px_#040403] cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#181711] border border-[#6C5636]/60 text-[#B99D73] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-[#F2ECE1] group-hover:text-[#B99D73] transition-colors">Tenant Companies</h4>
                        <p className="text-[11px] text-[#857866]">Provision pharma enterprise tenants</p>
                      </div>
                    </div>
                  </button>
                )}

                <button
                  onClick={() => setActiveAdminTab('audit')}
                  className="p-4 rounded-xl border border-[#282319] hover:border-[#6C5636] transition-all text-left group bg-[#0d0d0a] shadow-[inset_2px_2px_5px_#040403,inset_-2px_-2px_5px_#181711] hover:shadow-[3px_3px_10px_#040403] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#181711] border border-[#6C5636]/60 text-[#B99D73] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <History className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#F2ECE1] group-hover:text-[#B99D73] transition-colors">Audit Trail & Logs</h4>
                      <p className="text-[11px] text-[#857866]">Inspect system changes and access history</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Scope Summary Card */}
            <div className="neu-card p-6 border border-[#282319] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#B99D73]" />
                  <h3 className="font-bold text-sm text-[#F2ECE1]">Active Tenant Authorization</h3>
                </div>
                <div className="mt-4 p-3.5 bg-[#0d0d0a] rounded-xl border border-[#221e16] shadow-[inset_2px_2px_5px_#040403] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#857866]">Authenticated Role:</span>
                    <span className="font-bold text-[#B99D73]">{currentUser.role}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#857866]">Company Assignment:</span>
                    <span className="font-bold text-[#F2ECE1] truncate max-w-[140px]">
                      {currentUser.companyName || 'Platform Global'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#857866]">Headquarters / HQ:</span>
                    <span className="text-[#D4BD95]">{currentUser.territoryName}</span>
                  </div>
                </div>

                <div className="mt-4 text-xs text-[#857866] space-y-2">
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B99D73] shrink-0" />
                    <span className="text-[#F2ECE1]">Multi-tenant data isolation active</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B99D73] shrink-0" />
                    <span className="text-[#F2ECE1]">Strict geofencing & 15-min GPS verification</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B99D73] shrink-0" />
                    <span className="text-[#F2ECE1]">Real-time RepPulse SFA synchronization</span>
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700 text-center">
                <button
                  onClick={() => setActiveAdminTab('matrix')}
                  className="text-xs text-teal-400 hover:text-teal-300 font-semibold"
                >
                  View Full RBAC Matrix →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeAdminTab === 'users' && (
        <UserAccessManager
          users={users}
          companies={companies}
          territories={territories}
          currentUser={currentUser}
          onAddUser={onAddUser}
          onUpdateUser={onUpdateUser}
          onDeleteUser={onDeleteUser}
          onSwitchUser={onSwitchUser}
        />
      )}

      {/* COMPANIES TAB (Super Admin) */}
      {activeAdminTab === 'companies' && isSuperAdmin && (
        <CompanyManager
          companies={companies}
          currentUser={currentUser}
          onAddCompany={onAddCompany}
          onUpdateCompany={onUpdateCompany}
          onDeleteCompany={onDeleteCompany}
          onSelectActiveCompany={(id) => setSelectedCompanyScope(id)}
          selectedCompanyId={selectedCompanyScope}
        />
      )}

      {/* DATABASE STUDIO TAB */}
      {activeAdminTab === 'database' && (
        <DatabaseStudio
          currentUser={currentUser}
          companies={companies}
          doctors={doctors}
          chemists={chemists}
          products={products}
          territories={territories}
          onAddDoctor={onAddDoctor}
          onUpdateDoctor={onUpdateDoctor}
          onDeleteDoctor={onDeleteDoctor}
          onAddChemist={onAddChemist}
          onUpdateChemist={onUpdateChemist}
          onDeleteChemist={onDeleteChemist}
          onAddProduct={onAddProduct}
          onUpdateProduct={onUpdateProduct}
          onDeleteProduct={onDeleteProduct}
          onAddTerritory={onAddTerritory}
          onUpdateTerritory={onUpdateTerritory}
          onDeleteTerritory={onDeleteTerritory}
        />
      )}

      {/* RBAC MATRIX TAB */}
      {activeAdminTab === 'matrix' && (
        <RolePermissionsMatrix />
      )}

      {/* AUDIT LOGS TAB */}
      {activeAdminTab === 'audit' && (
        <AuditLogsView
          auditLogs={auditLogs}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};
