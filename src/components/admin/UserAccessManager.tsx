import React, { useState } from 'react';
import { User, UserRole, UserPermissions, Company, Territory } from '../../types';
import { AuthService } from '../../services/authService';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Shield, 
  ShieldCheck, 
  Key, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Check, 
  X, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Lock,
  UserCheck
} from 'lucide-react';

interface UserAccessManagerProps {
  users: User[];
  companies: Company[];
  territories: Territory[];
  currentUser: User;
  onAddUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onSwitchUser?: (user: User) => void;
}

export const UserAccessManager: React.FC<UserAccessManagerProps> = ({
  users,
  companies,
  territories,
  currentUser,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onSwitchUser,
}) => {
  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';
  const isAdmin = currentUser.role === 'ADMIN';
  const isManager = AuthService.isManager(currentUser);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>(
    isSuperAdmin ? 'ALL' : (currentUser.companyId || 'comp-01')
  );

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUserForPermissions, setSelectedUserForPermissions] = useState<User | null>(null);
  const [userToResetPassword, setUserToResetPassword] = useState<User | null>(null);
  const [adminNewPassword, setAdminNewPassword] = useState('1234');

  // Form State
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('1234');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('MEDICAL_REP');
  const [companyId, setCompanyId] = useState<string>(
    currentUser.companyId || (companies[0]?.id || 'comp-01')
  );
  const [territoryId, setTerritoryId] = useState<string>(territories[0]?.id || '');
  const [employeeCode, setEmployeeCode] = useState('');

  // Permissions Form State for granular access
  const [permissions, setPermissions] = useState<UserPermissions>({
    canManageUsers: false,
    canManageDoctors: true,
    canManageChemists: true,
    canManageProducts: false,
    canManageTerritories: false,
    canApproveDCR: true,
    canApproveTourPlans: true,
    canApproveExpenses: true,
    canExportData: true,
    canModifyDatabase: false,
    canViewAuditLogs: false,
  });

  // Filter users based on RBAC scope
  const scopedUsers = users.filter(u => {
    // Super admin can see all
    if (isSuperAdmin) {
      if (selectedCompanyFilter !== 'ALL' && u.companyId && u.companyId !== selectedCompanyFilter) {
        return false;
      }
      return true;
    }

    // Company Admin: strictly see their own company users (and their sub-managers/reps)
    if (isAdmin) {
      return u.companyId === currentUser.companyId || (!u.companyId && u.role === 'SUPER_ADMIN');
    }

    // Manager: see themselves and their team members
    if (isManager) {
      return u.companyId === currentUser.companyId && (u.assignedManagerId === currentUser.id || u.id === currentUser.id);
    }

    return u.id === currentUser.id;
  });

  const filteredUsers = scopedUsers.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.username && u.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.territoryName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRoleFilter === 'ALL' || u.role === selectedRoleFilter;

    return matchesSearch && matchesRole;
  });

  const handleOpenAddModal = () => {
    const generatedEmpCode = `EMP-${Math.floor(Math.random() * 899 + 100)}`;
    setEditingUser(null);
    setName('');
    setUsername(generatedEmpCode);
    setPassword('1234');
    setEmail('');
    setPhone('+91 ');
    setRole(isSuperAdmin ? 'ADMIN' : 'MEDICAL_REP');
    setCompanyId(currentUser.companyId || companies[0]?.id || 'comp-01');
    setTerritoryId(territories[0]?.id || 'terr-cachar-01');
    setEmployeeCode(generatedEmpCode);
    setPermissions({
      canManageUsers: false,
      canManageDoctors: true,
      canManageChemists: true,
      canManageProducts: false,
      canManageTerritories: false,
      canApproveDCR: true,
      canApproveTourPlans: true,
      canApproveExpenses: true,
      canExportData: true,
      canModifyDatabase: false,
      canViewAuditLogs: false,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (u: User) => {
    setEditingUser(u);
    setName(u.name);
    setUsername(u.username || u.employeeCode);
    setPassword(u.password || '1234');
    setEmail(u.email);
    setPhone(u.phone);
    setRole(u.role);
    setCompanyId(u.companyId || companies[0]?.id || 'comp-01');
    setTerritoryId(u.territoryId);
    setEmployeeCode(u.employeeCode);
    setIsAddModalOpen(true);
  };

  const handleOpenResetPasswordModal = (u: User) => {
    setUserToResetPassword(u);
    setAdminNewPassword('1234');
    setIsResetPasswordModalOpen(true);
  };

  const handleExecutePasswordReset = () => {
    if (!userToResetPassword) return;
    const result = AuthService.resetPasswordByAdmin(userToResetPassword.id, adminNewPassword, users);
    if (result.success && result.updatedUser) {
      onUpdateUser(result.updatedUser);
      alert(`Password for ${userToResetPassword.name} (${userToResetPassword.username || userToResetPassword.employeeCode}) has been reset to: ${adminNewPassword}`);
    }
    setIsResetPasswordModalOpen(false);
  };

  const handleOpenPermissionsModal = (u: User) => {
    setSelectedUserForPermissions(u);
    setPermissions({
      canManageUsers: !!u.permissions?.canManageUsers,
      canManageDoctors: u.permissions?.canManageDoctors ?? (u.role !== 'MEDICAL_REP'),
      canManageChemists: u.permissions?.canManageChemists ?? (u.role !== 'MEDICAL_REP'),
      canManageProducts: !!u.permissions?.canManageProducts,
      canManageTerritories: !!u.permissions?.canManageTerritories,
      canApproveDCR: u.permissions?.canApproveDCR ?? (u.role !== 'MEDICAL_REP'),
      canApproveTourPlans: u.permissions?.canApproveTourPlans ?? (u.role !== 'MEDICAL_REP'),
      canApproveExpenses: u.permissions?.canApproveExpenses ?? (u.role !== 'MEDICAL_REP'),
      canExportData: u.permissions?.canExportData ?? true,
      canModifyDatabase: u.permissions?.canModifyDatabase ?? (u.role === 'SUPER_ADMIN' || u.role === 'ADMIN'),
      canViewAuditLogs: u.permissions?.canViewAuditLogs ?? (u.role !== 'MEDICAL_REP'),
    });
    setIsPermissionsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const assignedCompany = companies.find(c => c.id === companyId);
    const assignedTerritory = territories.find(t => t.id === territoryId);

    if (editingUser) {
      const updated: User = {
        ...editingUser,
        name,
        username: username || employeeCode,
        password: password || editingUser.password || '1234',
        email,
        phone,
        role,
        companyId: isSuperAdmin ? companyId : editingUser.companyId,
        companyName: assignedCompany?.name || editingUser.companyName,
        territoryId,
        territoryName: assignedTerritory?.name || editingUser.territoryName,
        employeeCode,
      };
      onUpdateUser(updated);
    } else {
      const newUser: User = {
        id: `usr-${Date.now().toString().slice(-4)}`,
        name,
        username: username || employeeCode,
        password: password || '1234',
        email,
        phone,
        role,
        companyId: isSuperAdmin ? companyId : (currentUser.companyId || 'comp-01'),
        companyName: assignedCompany?.name || 'Pharma Assam Healthcare Pvt Ltd',
        territoryId,
        territoryName: assignedTerritory?.name || 'Assam Regional HQ',
        employeeCode,
        isActive: true,
        permissions,
        assignedManagerId: role === 'MEDICAL_REP' ? currentUser.id : undefined,
      };
      onAddUser(newUser);
    }

    setIsAddModalOpen(false);
  };

  const handleSavePermissions = () => {
    if (!selectedUserForPermissions) return;
    const updated: User = {
      ...selectedUserForPermissions,
      permissions,
    };
    onUpdateUser(updated);
    setIsPermissionsModalOpen(false);
  };

  const handleToggleActiveStatus = (u: User) => {
    onUpdateUser({ ...u, isActive: !u.isActive });
  };

  return (
    <div className="space-y-6">
      {/* Control Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-teal-400" />
              <h2 className="text-xl font-bold text-white">User & Access Management</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded">
                {isSuperAdmin ? 'Global Root Scope' : isAdmin ? `Company Admin (${currentUser.companyName || 'Pharma Assam'})` : 'Manager Scope'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isSuperAdmin 
                ? 'Provision Super Admins, Company Admins, Managers, and Medical Reps across all tenant organizations.' 
                : isAdmin 
                ? `Manage personnel, assign territories, grant operational permissions and provide database access for ${currentUser.companyName || 'your company'}.` 
                : 'View your team and managed territory field representatives.'}
            </p>
          </div>

          {(isSuperAdmin || isAdmin) && (
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/30 transition-all shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New User / Staff</span>
            </button>
          )}
        </div>

        {/* Quick User Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-800 text-xs">
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
            <span className="text-slate-400">Total Scoped Users</span>
            <p className="text-lg font-bold text-white mt-0.5">{scopedUsers.length}</p>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
            <span className="text-slate-400">Company Admins</span>
            <p className="text-lg font-bold text-teal-400 mt-0.5">
              {scopedUsers.filter(u => u.role === 'ADMIN').length}
            </p>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
            <span className="text-slate-400">Managers</span>
            <p className="text-lg font-bold text-indigo-400 mt-0.5">
              {scopedUsers.filter(u => AuthService.isManager(u)).length}
            </p>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
            <span className="text-slate-400">Active Field MRs</span>
            <p className="text-lg font-bold text-amber-400 mt-0.5">
              {scopedUsers.filter(u => u.role === 'MEDICAL_REP').length}
            </p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search user, username, emp ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
            />
          </div>

          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-700"
          >
            <option value="ALL">All Roles</option>
            {isSuperAdmin && <option value="SUPER_ADMIN">👑 Super Admin</option>}
            <option value="ADMIN">🏢 Company Admin</option>
            <option value="MANAGER">👔 Manager</option>
            <option value="MEDICAL_REP">🏃 Medical Rep</option>
          </select>

          {isSuperAdmin && (
            <select
              value={selectedCompanyFilter}
              onChange={(e) => setSelectedCompanyFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-700"
            >
              <option value="ALL">All Companies</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing {filteredUsers.length} of {scopedUsers.length} authorized users
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">User & Credentials</th>
                <th className="py-3 px-4">Role & Privilege</th>
                <th className="py-3 px-4">Company & Territory</th>
                <th className="py-3 px-4">Permissions</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredUsers.map((user) => {
                const isSuper = user.role === 'SUPER_ADMIN';
                const isCompAdmin = user.role === 'ADMIN';
                const isMgr = AuthService.isManager(user);
                const isCurrent = user.id === currentUser.id;

                return (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    {/* User info & Username */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          isSuper 
                            ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                            : isCompAdmin 
                            ? 'bg-teal-100 text-teal-800 border border-teal-300' 
                            : isMgr 
                            ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' 
                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                        }`}>
                          {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-slate-900">
                            <span>{user.name}</span>
                            {isCurrent && (
                              <span className="text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded font-bold">
                                (You)
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span className="font-mono bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-bold">
                              user: {user.username || user.employeeCode}
                            </span>
                            <span>•</span>
                            <span className="font-mono text-slate-400">pass: ••••</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3 px-4">
                      {isSuper && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <Shield className="w-3 h-3 text-amber-600" />
                          Super Admin
                        </span>
                      )}
                      {isCompAdmin && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                          <Building2 className="w-3 h-3 text-teal-600" />
                          Company Admin
                        </span>
                      )}
                      {isMgr && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                          <Users className="w-3 h-3 text-indigo-600" />
                          Manager
                        </span>
                      )}
                      {!isSuper && !isCompAdmin && !isMgr && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          Field Rep (MR)
                        </span>
                      )}
                    </td>

                    {/* Company & Territory */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 truncate max-w-[180px]">
                        {user.companyName || 'Global Platform'}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{user.territoryName}</span>
                      </div>
                    </td>

                    {/* Permissions summary */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {isSuper || isCompAdmin ? (
                          <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Full DB & Management Access
                          </span>
                        ) : (
                          <>
                            {user.permissions?.canApproveDCR && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                                DCR Approver
                              </span>
                            )}
                            {user.permissions?.canManageDoctors && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                                Doctor Master
                              </span>
                            )}
                            {user.permissions?.canModifyDatabase && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 font-bold">
                                DB Studio
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleActiveStatus(user)}
                        disabled={isSuper && !isSuperAdmin}
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all ${
                          user.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Suspended'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Reset Password Button */}
                        {(isSuperAdmin || (isAdmin && !isSuper)) && (
                          <button
                            onClick={() => handleOpenResetPasswordModal(user)}
                            className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg border border-slate-200"
                            title="Reset Staff Password"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Switch / Impersonate for Testing */}
                        {onSwitchUser && (
                          <button
                            onClick={() => onSwitchUser(user)}
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg border border-slate-200"
                            title="Sign in as this User"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Edit User */}
                        {(isSuperAdmin || (isAdmin && !isSuper)) && (
                          <button
                            onClick={() => handleOpenEditModal(user)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200"
                            title="Edit User Information"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Delete User */}
                        {(isSuperAdmin || (isAdmin && !isSuper && user.id !== currentUser.id)) && (
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove user ${user.name}?`)) {
                                onDeleteUser(user.id);
                              }
                            }}
                            className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200"
                            title="Remove User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {editingUser ? 'Edit User / Staff Member' : 'Add New User / Staff Member'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Configure role assignment, username and password</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shakir Ahmad"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employee Code / ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EMP-ABM-102"
                    value={employeeCode}
                    onChange={(e) => {
                      setEmployeeCode(e.target.value);
                      if (!editingUser) setUsername(e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Login Username & Initial Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Login Username *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. shakir878 or EMP ID"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Password (Default: 1234) *</label>
                  <input
                    type="text"
                    required
                    placeholder="1234"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono text-slate-900 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. user@pharmaassam.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 8448440654"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role & Privilege Level *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white font-semibold"
                  >
                    {isSuperAdmin && <option value="SUPER_ADMIN">👑 Super Admin (Global Platform)</option>}
                    <option value="ADMIN">🏢 Company Admin (Full Company DB Access)</option>
                    <option value="MANAGER">👔 Manager (Team & Territory Scope)</option>
                    <option value="MEDICAL_REP">🏃 Field Medical Representative (Field Beat)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company / Organization *</label>
                  <select
                    value={companyId}
                    disabled={!isSuperAdmin}
                    onChange={(e) => setCompanyId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white font-medium disabled:bg-slate-100"
                  >
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Territory / Headquarters *</label>
                <select
                  value={territoryId}
                  onChange={(e) => setTerritoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white font-medium"
                >
                  {territories.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingUser ? 'Save Changes' : 'Create User'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Reset Password Modal */}
      {isResetPasswordModalOpen && userToResetPassword && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm">Reset Staff Password</h3>
              </div>
              <button
                onClick={() => setIsResetPasswordModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Resetting password for:</span>
                <span className="font-bold text-slate-900 text-sm">{userToResetPassword.name}</span>
                <span className="block font-mono text-[11px] text-slate-600 mt-0.5">
                  Username: {userToResetPassword.username || userToResetPassword.employeeCode}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Set New Password *</label>
                <input
                  type="text"
                  required
                  value={adminNewPassword}
                  onChange={(e) => setAdminNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono text-sm font-bold text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsResetPasswordModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecutePasswordReset}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow-sm"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage & Provide Granular Permissions Modal */}
      {isPermissionsModalOpen && selectedUserForPermissions && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Granular Access Control: {selectedUserForPermissions.name}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Role: <span className="font-semibold">{selectedUserForPermissions.role}</span> • {selectedUserForPermissions.companyName || 'Company'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPermissionsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                Grant or revoke module-level edit, add, remove, and approval permissions for this user.
              </p>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <span className="font-bold text-slate-900 block">Manage Master Database (CRUD)</span>
                    <span className="text-[11px] text-slate-500">Add, edit, remove doctors, chemists, products, and territories in DB</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={permissions.canModifyDatabase}
                    onChange={(e) => setPermissions({ ...permissions, canModifyDatabase: e.target.checked })}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <span className="font-bold text-slate-900 block">Manage Doctors Master</span>
                    <span className="text-[11px] text-slate-500">Add and update doctor profiles, tiers, and GPS geofences</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={permissions.canManageDoctors}
                    onChange={(e) => setPermissions({ ...permissions, canManageDoctors: e.target.checked })}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <span className="font-bold text-slate-900 block">Manage Chemists & Stockists</span>
                    <span className="text-[11px] text-slate-500">Add and update pharmacy licenses, GSTIN, and retail touchpoints</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={permissions.canManageChemists}
                    onChange={(e) => setPermissions({ ...permissions, canManageChemists: e.target.checked })}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <span className="font-bold text-slate-900 block">Manage Product Catalog & Pricing</span>
                    <span className="text-[11px] text-slate-500">Add new SKUs, update MRP, PTR, PTS, and compositions</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={permissions.canManageProducts}
                    onChange={(e) => setPermissions({ ...permissions, canManageProducts: e.target.checked })}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <span className="font-bold text-slate-900 block">Approve DCRs & Tour Plans</span>
                    <span className="text-[11px] text-slate-500">Verify geofenced field call submissions and monthly tour itineraries</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={permissions.canApproveDCR}
                    onChange={(e) => setPermissions({ ...permissions, canApproveDCR: e.target.checked, canApproveTourPlans: e.target.checked })}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <span className="font-bold text-slate-900 block">Approve Travel Expenses & Mileage</span>
                    <span className="text-[11px] text-slate-500">Audit ₹7.50/km verified GPS claims and daily allowances</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={permissions.canApproveExpenses}
                    onChange={(e) => setPermissions({ ...permissions, canApproveExpenses: e.target.checked })}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <span className="font-bold text-slate-900 block">Export MIS Reports & Data</span>
                    <span className="text-[11px] text-slate-500">Download Excel/CSV field audit summaries and POB orders</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={permissions.canExportData}
                    onChange={(e) => setPermissions({ ...permissions, canExportData: e.target.checked })}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPermissionsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePermissions}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Update Access Rights</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
