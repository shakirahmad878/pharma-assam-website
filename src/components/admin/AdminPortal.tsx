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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        {/* Background glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-teal-500/30">
                <Shield className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold tracking-tight text-white">
                    RepPulse Admin & RBAC Control Studio
                  </h1>
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-500/40">
                    Phase 4 Enterprise
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Centralized Multi-Tenant Authorization, Master Database Studio, and User Access Hub.
                </p>
              </div>
            </div>
          </div>

          {/* Current User Scope Badge */}
          <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 backdrop-blur-sm self-start md:self-auto">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-xs font-bold text-white">{currentUser.name}</span>
                <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                  isSuperAdmin ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  isAdmin ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' :
                  'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                }`}>
                  {isSuperAdmin ? '👑 Super Admin' : isAdmin ? '🏢 Company Admin' : '👔 Manager'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isSuperAdmin ? 'Full Multi-Tenant Access' : currentActiveCompany?.name}
              </p>
            </div>
          </div>
        </div>

        {/* Global Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveAdminTab('overview')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
              activeAdminTab === 'overview'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Admin Overview</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('users')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
              activeAdminTab === 'users'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User & Access Control</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-slate-950/40">
              {scopedUsers.length}
            </span>
          </button>

          {isSuperAdmin && (
            <button
              onClick={() => setActiveAdminTab('companies')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeAdminTab === 'companies'
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Multi-Tenant Companies</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-slate-950/40">
                {companies.length}
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveAdminTab('database')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
              activeAdminTab === 'database'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Master Database Studio</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('matrix')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
              activeAdminTab === 'matrix'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>RBAC Matrix</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('audit')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
              activeAdminTab === 'audit'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Security Audit Trail</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-slate-950/40">
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
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {isSuperAdmin ? 'Total Platform Users' : 'Company Staff'}
                </span>
                <p className="text-2xl font-bold text-slate-900 mt-1">{scopedUsers.length}</p>
                <span className="text-[11px] text-teal-600 font-medium mt-1 block">
                  {scopedUsers.filter(u => u.isActive).length} Active Personnel
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Doctor Master DB</span>
                <p className="text-2xl font-bold text-slate-900 mt-1">{scopedDoctors.length}</p>
                <span className="text-[11px] text-purple-600 font-medium mt-1 block">
                  {scopedDoctors.filter(d => d.tier === 'A_PLUS').length} Tier A+ Specialists
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                <Stethoscope className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Chemists & Retail</span>
                <p className="text-2xl font-bold text-slate-900 mt-1">{scopedChemists.length}</p>
                <span className="text-[11px] text-amber-600 font-medium mt-1 block">
                  100% Geotagged Pharmacies
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <Store className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Product Catalog</span>
                <p className="text-2xl font-bold text-slate-900 mt-1">{scopedProducts.length}</p>
                <span className="text-[11px] text-indigo-600 font-medium mt-1 block">
                  Active Pharma SKUs
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Pill className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Quick Admin Actions & Feature Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Navigation Cards */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Administrative Action Suite</h3>
                  <p className="text-xs text-slate-500">Fast access to key database and security controls</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-teal-50 text-teal-700 border border-teal-200">
                  Ready
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setActiveAdminTab('users')}
                  className="p-4 rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-sm transition-all text-left group bg-slate-50/50 hover:bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-teal-600">Staff & Roles Management</h4>
                      <p className="text-[11px] text-slate-500">Create users, assign territories & roles</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveAdminTab('database')}
                  className="p-4 rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-sm transition-all text-left group bg-slate-50/50 hover:bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-teal-600">Master Database Studio</h4>
                      <p className="text-[11px] text-slate-500">Add, edit, remove doctors, chemists, SKUs</p>
                    </div>
                  </div>
                </button>

                {isSuperAdmin && (
                  <button
                    onClick={() => setActiveAdminTab('companies')}
                    className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:shadow-sm transition-all text-left group bg-slate-50/50 hover:bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 group-hover:text-indigo-600">Tenant Companies</h4>
                        <p className="text-[11px] text-slate-500">Provision pharma enterprise tenants</p>
                      </div>
                    </div>
                  </button>
                )}

                <button
                  onClick={() => setActiveAdminTab('audit')}
                  className="p-4 rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-sm transition-all text-left group bg-slate-50/50 hover:bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <History className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-teal-600">Audit Trail & Logs</h4>
                      <p className="text-[11px] text-slate-500">Inspect system changes and access history</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Scope Summary Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-6 border border-slate-700 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-400" />
                  <h3 className="font-bold text-sm text-white">Active Tenant Authorization</h3>
                </div>
                <div className="mt-4 p-3 bg-slate-800/80 rounded-lg border border-slate-700 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Authenticated Role:</span>
                    <span className="font-bold text-teal-400">{currentUser.role}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Company Assignment:</span>
                    <span className="font-bold text-white truncate max-w-[140px]">
                      {currentUser.companyName || 'Platform Global'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Headquarters / HQ:</span>
                    <span className="text-slate-300">{currentUser.territoryName}</span>
                  </div>
                </div>

                <div className="mt-4 text-xs text-slate-300 space-y-1.5">
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Multi-tenant data isolation active</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Strict geofencing & 15-min GPS verification</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Real-time RepPulse SFA synchronization</span>
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
