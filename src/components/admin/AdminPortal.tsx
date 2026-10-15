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
      <div className="neu-card p-4 sm:p-6 border border-[#DCE4EB] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-2">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#10243A] text-white flex items-center justify-center font-black shadow-xs shrink-0">
                <Shield className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h1 className="text-base sm:text-xl font-extrabold tracking-tight text-[#10243A]">
                    RepPulse Admin & RBAC Studio
                  </h1>
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest bg-teal-50 text-[#137F83] px-2.5 py-0.5 rounded-full border border-teal-200">
                    Enterprise
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Centralized Multi-Tenant Authorization & Master Database Studio.
                </p>
              </div>
            </div>
          </div>

          {/* Current User Scope Badge */}
          <div className="flex items-center gap-3 bg-[#F8FAFC] p-3 rounded-xl border border-[#DCE4EB] shadow-xs self-start md:self-auto">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-xs font-bold text-[#10243A]">{currentUser.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                  isSuperAdmin ? 'bg-teal-50 text-[#137F83] border border-teal-200' :
                  isAdmin ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                  'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                  {isSuperAdmin ? '👑 Super Admin' : isAdmin ? '🏢 Company Admin' : '👔 Manager'}
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] mt-0.5 font-medium">
                {isSuperAdmin ? 'Full Multi-Tenant Access' : currentActiveCompany?.name}
              </p>
            </div>
          </div>
        </div>

        {/* Global Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-[#DCE4EB] overflow-x-auto">
          <button
            onClick={() => setActiveAdminTab('overview')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeAdminTab === 'overview'
                ? 'bg-[#10243A] text-white shadow-xs'
                : 'bg-[#F1F6F8] hover:bg-[#E8EEF4] text-[#64748B] hover:text-[#10243A] border border-[#DCE4EB]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Admin Overview</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('users')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeAdminTab === 'users'
                ? 'bg-[#10243A] text-white shadow-xs'
                : 'bg-[#F1F6F8] hover:bg-[#E8EEF4] text-[#64748B] hover:text-[#10243A] border border-[#DCE4EB]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User & Access Control</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
              activeAdminTab === 'users' ? 'bg-white/20 text-white' : 'bg-[#DCE4EB] text-[#10243A]'
            }`}>
              {scopedUsers.length}
            </span>
          </button>

          {isSuperAdmin && (
            <button
              onClick={() => setActiveAdminTab('companies')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeAdminTab === 'companies'
                  ? 'bg-[#10243A] text-white shadow-xs'
                  : 'bg-[#F1F6F8] hover:bg-[#E8EEF4] text-[#64748B] hover:text-[#10243A] border border-[#DCE4EB]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Multi-Tenant Companies</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                activeAdminTab === 'companies' ? 'bg-white/20 text-white' : 'bg-[#DCE4EB] text-[#10243A]'
              }`}>
                {companies.length}
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveAdminTab('database')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeAdminTab === 'database'
                ? 'bg-[#10243A] text-white shadow-xs'
                : 'bg-[#F1F6F8] hover:bg-[#E8EEF4] text-[#64748B] hover:text-[#10243A] border border-[#DCE4EB]'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Master Database Studio</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('matrix')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeAdminTab === 'matrix'
                ? 'bg-[#10243A] text-white shadow-xs'
                : 'bg-[#F1F6F8] hover:bg-[#E8EEF4] text-[#64748B] hover:text-[#10243A] border border-[#DCE4EB]'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>RBAC Matrix</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('audit')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeAdminTab === 'audit'
                ? 'bg-[#10243A] text-white shadow-xs'
                : 'bg-[#F1F6F8] hover:bg-[#E8EEF4] text-[#64748B] hover:text-[#10243A] border border-[#DCE4EB]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Security Audit Trail</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
              activeAdminTab === 'audit' ? 'bg-white/20 text-white' : 'bg-[#DCE4EB] text-[#10243A]'
            }`}>
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
            <div className="neu-card p-5 flex items-center justify-between border border-[#DCE4EB]">
              <div>
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  {isSuperAdmin ? 'Total Platform Users' : 'Company Staff'}
                </span>
                <p className="text-2xl font-black text-[#10243A] mt-1">{scopedUsers.length}</p>
                <span className="text-[11px] text-[#137F83] font-medium mt-1 block">
                  {scopedUsers.filter(u => u.isActive).length} Active Personnel
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200 text-[#137F83] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="neu-card p-5 flex items-center justify-between border border-[#DCE4EB]">
              <div>
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Doctor Master DB</span>
                <p className="text-2xl font-black text-[#10243A] mt-1">{scopedDoctors.length}</p>
                <span className="text-[11px] text-[#137F83] font-medium mt-1 block">
                  {scopedDoctors.filter(d => d.tier === 'A_PLUS').length} Tier A+ Specialists
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200 text-[#137F83] flex items-center justify-center">
                <Stethoscope className="w-5 h-5" />
              </div>
            </div>

            <div className="neu-card p-5 flex items-center justify-between border border-[#DCE4EB]">
              <div>
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Chemists & Retail</span>
                <p className="text-2xl font-black text-[#10243A] mt-1">{scopedChemists.length}</p>
                <span className="text-[11px] text-[#137F83] font-medium mt-1 block">
                  100% Geotagged Pharmacies
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200 text-[#137F83] flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
            </div>

            <div className="neu-card p-5 flex items-center justify-between border border-[#DCE4EB]">
              <div>
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Product Catalog</span>
                <p className="text-2xl font-black text-[#10243A] mt-1">{scopedProducts.length}</p>
                <span className="text-[11px] text-[#137F83] font-medium mt-1 block">
                  Active Pharma SKUs
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200 text-[#137F83] flex items-center justify-center">
                <Pill className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Quick Admin Actions & Feature Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Navigation Cards */}
            <div className="lg:col-span-2 neu-card p-6 space-y-4 border border-[#DCE4EB]">
              <div className="flex items-center justify-between pb-3 border-b border-[#DCE4EB]">
                <div>
                  <h3 className="font-bold text-[#10243A] text-sm">Administrative Action Suite</h3>
                  <p className="text-xs text-[#64748B]">Fast access to key database and security controls</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-50 text-[#137F83] border border-teal-200">
                  Ready
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => setActiveAdminTab('users')}
                  className="p-4 rounded-xl border border-[#DCE4EB] hover:border-[#18A6A6] transition-all text-left group bg-[#F8FAFC] hover:bg-white shadow-xs cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-[#137F83] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Users className="w-5 h-5 text-[#137F83]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#10243A] group-hover:text-[#18A6A6] transition-colors">Staff & Roles Management</h4>
                      <p className="text-[11px] text-[#64748B]">Create users, assign territories & roles</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveAdminTab('database')}
                  className="p-4 rounded-xl border border-[#DCE4EB] hover:border-[#18A6A6] transition-all text-left group bg-[#F8FAFC] hover:bg-white shadow-xs cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-[#137F83] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Database className="w-5 h-5 text-[#137F83]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#10243A] group-hover:text-[#18A6A6] transition-colors">Master Database Studio</h4>
                      <p className="text-[11px] text-[#64748B]">Add, edit, remove doctors, chemists, SKUs</p>
                    </div>
                  </div>
                </button>

                {isSuperAdmin && (
                  <button
                    onClick={() => setActiveAdminTab('companies')}
                    className="p-4 rounded-xl border border-[#DCE4EB] hover:border-[#18A6A6] transition-all text-left group bg-[#F8FAFC] hover:bg-white shadow-xs cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-[#137F83] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Building2 className="w-5 h-5 text-[#137F83]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-[#10243A] group-hover:text-[#18A6A6] transition-colors">Tenant Companies</h4>
                        <p className="text-[11px] text-[#64748B]">Provision pharma enterprise tenants</p>
                      </div>
                    </div>
                  </button>
                )}

                <button
                  onClick={() => setActiveAdminTab('audit')}
                  className="p-4 rounded-xl border border-[#DCE4EB] hover:border-[#18A6A6] transition-all text-left group bg-[#F8FAFC] hover:bg-white shadow-xs cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-[#137F83] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <History className="w-5 h-5 text-[#137F83]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#10243A] group-hover:text-[#18A6A6] transition-colors">Audit Trail & Logs</h4>
                      <p className="text-[11px] text-[#64748B]">Inspect system changes and access history</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Scope Summary Card */}
            <div className="neu-card p-6 border border-[#DCE4EB] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#18A6A6]" />
                  <h3 className="font-bold text-sm text-[#10243A]">Active Tenant Authorization</h3>
                </div>
                <div className="mt-4 p-3.5 bg-[#F8FAFC] rounded-xl border border-[#DCE4EB] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Authenticated Role:</span>
                    <span className="font-bold text-[#137F83]">{currentUser.role}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Company Assignment:</span>
                    <span className="font-bold text-[#10243A] truncate max-w-[140px]">
                      {currentUser.companyName || 'Platform Global'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Headquarters / HQ:</span>
                    <span className="text-[#10243A] font-semibold">{currentUser.territoryName}</span>
                  </div>
                </div>

                <div className="mt-4 text-xs text-[#64748B] space-y-2">
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#18A6A6] shrink-0" />
                    <span className="text-[#10243A] font-medium">Multi-tenant data isolation active</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#18A6A6] shrink-0" />
                    <span className="text-[#10243A] font-medium">Strict geofencing & 15-min GPS verification</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#18A6A6] shrink-0" />
                    <span className="text-[#10243A] font-medium">Real-time RepPulse SFA synchronization</span>
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#DCE4EB] text-center">
                <button
                  onClick={() => setActiveAdminTab('matrix')}
                  className="text-xs text-[#137F83] hover:text-[#18A6A6] font-semibold"
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
