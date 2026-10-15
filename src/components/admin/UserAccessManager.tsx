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
      <div className="neu-card p-6 border border-[#DCE4EB]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-[#137F83] flex items-center justify-center font-bold shadow-xs">
                <ShieldCheck className="w-5 h-5 text-[#137F83]" />
              </div>
              <h2 className="text-xl font-bold text-[#10243A] tracking-tight">User & Access Management</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-teal-50 text-[#137F83] border border-teal-200 px-2.5 py-0.5 rounded-full">
                {isSuperAdmin ? 'Global Root Scope' : isAdmin ? `Company Admin (${currentUser.companyName || 'Pharma Assam'})` : 'Manager Scope'}
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-1.5">
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
              className="neu-btn-gold flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer shrink-0"
            >
              <UserPlus className="w-4 h-4 stroke-[2.5]" />
              <span>Add New User / Staff</span>
            </button>
          )}
        </div>

        {/* Quick User Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-[#DCE4EB] text-xs">
          <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#DCE4EB]">
            <span className="text-[#64748B] font-medium">Total Scoped Users</span>
            <p className="text-lg font-bold text-[#10243A] mt-0.5">{scopedUsers.length}</p>
          </div>
          <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#DCE4EB]">
            <span className="text-[#64748B] font-medium">Company Admins</span>
            <p className="text-lg font-bold text-[#137F83] mt-0.5">
              {scopedUsers.filter(u => u.role === 'ADMIN').length}
            </p>
          </div>
          <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#DCE4EB]">
            <span className="text-[#64748B] font-medium">Managers</span>
            <p className="text-lg font-bold text-[#10243A] mt-0.5">
              {scopedUsers.filter(u => AuthService.isManager(u)).length}
            </p>
          </div>
          <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#DCE4EB]">
            <span className="text-[#64748B] font-medium">Active Field MRs</span>
            <p className="text-lg font-bold text-[#137F83] mt-0.5">
              {scopedUsers.filter(u => u.role === 'MEDICAL_REP').length}
            </p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="neu-card p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search user, username, emp ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="neu-input w-full pl-9 pr-3 py-2 text-xs"
            />
          </div>

          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="neu-input px-3 py-2 text-xs appearance-none bg-white text-[#10243A] font-medium cursor-pointer"
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
              className="neu-input px-3 py-2 text-xs appearance-none bg-white text-[#10243A] font-medium cursor-pointer"
            >
              <option value="ALL">All Companies</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        </div>

        <div className="text-xs text-[#64748B] font-medium">
          Showing <span className="text-[#10243A] font-bold">{filteredUsers.length}</span> of {scopedUsers.length} authorized users
        </div>
      </div>

      {/* Users Table */}
      <div className="neu-card overflow-hidden border border-[#DCE4EB]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F1F6F8] border-b border-[#DCE4EB] text-[#64748B] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">User & Credentials</th>
                <th className="py-3.5 px-4">Role & Privilege</th>
                <th className="py-3.5 px-4">Company & Territory</th>
                <th className="py-3.5 px-4">Permissions</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE4EB] font-medium text-[#10243A]">
              {filteredUsers.map((user) => {
                const isSuper = user.role === 'SUPER_ADMIN';
                const isCompAdmin = user.role === 'ADMIN';
                const isMgr = AuthService.isManager(user);
                const isCurrent = user.id === currentUser.id;

                return (
                  <tr key={user.id} className="hover:bg-[#F8FAFC] transition-colors">
                    {/* User info & Username */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs border ${
                          isSuper 
                            ? 'bg-teal-50 text-[#137F83] border-teal-200' 
                            : isCompAdmin 
                            ? 'bg-blue-50 text-blue-700 border-blue-200' 
                            : isMgr 
                            ? 'bg-slate-100 text-[#10243A] border-slate-200' 
                            : 'bg-[#F1F6F8] text-[#64748B] border-[#DCE4EB]'
                        }`}>
                          {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-[#10243A]">
                            <span>{user.name}</span>
                            {isCurrent && (
                              <span className="text-[10px] bg-teal-50 text-[#137F83] border border-teal-200 px-1.5 py-0.2 rounded font-bold">
                                (You)
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-[#64748B] mt-0.5">
                            <span className="font-mono bg-[#F1F6F8] border border-[#DCE4EB] text-[#10243A] px-1.5 py-0.2 rounded font-semibold">
                              user: {user.username || user.employeeCode}
                            </span>
                            <span>•</span>
                            <span className="font-mono text-[#94A3B8]">pass: ••••</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      {isSuper && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-[#137F83] border border-teal-200">
                          <Shield className="w-3 h-3 text-[#137F83]" />
                          Super Admin
                        </span>
                      )}
                      {isCompAdmin && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <Building2 className="w-3 h-3 text-blue-700" />
                          Company Admin
                        </span>
                      )}
                      {isMgr && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-[#10243A] border border-slate-200">
                          <Users className="w-3 h-3 text-[#64748B]" />
                          Manager
                        </span>
                      )}
                      {!isSuper && !isCompAdmin && !isMgr && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F1F6F8] text-[#64748B] border border-[#DCE4EB]">
                          Field Rep (MR)
                        </span>
                      )}
                    </td>

                    {/* Company & Territory */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#10243A] truncate max-w-[180px]">
                        {user.companyName || 'Global Platform'}
                      </div>
                      <div className="text-[11px] text-[#64748B] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#18A6A6] shrink-0" />
                        <span className="truncate">{user.territoryName}</span>
                      </div>
                    </td>

                    {/* Permissions summary */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                        {isSuper || isCompAdmin ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-teal-50 text-[#137F83] border border-teal-200">
                            Full DB & Management
                          </span>
                        ) : (
                          <>
                            {user.permissions?.canApproveDCR && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#F1F6F8] text-[#64748B] border border-[#DCE4EB] font-medium">
                                DCR Approver
                              </span>
                            )}
                            {user.permissions?.canManageDoctors && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#F1F6F8] text-[#64748B] border border-[#DCE4EB] font-medium">
                                Doctor Master
                              </span>
                            )}
                            {user.permissions?.canModifyDatabase && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-50 text-[#137F83] border border-teal-200 font-bold">
                                DB Studio
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleActiveStatus(user)}
                        disabled={isSuper && !isSuperAdmin}
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold transition-all cursor-pointer ${
                          user.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Suspended'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Reset Password Button */}
                        {(isSuperAdmin || (isAdmin && !isSuper)) && (
                          <button
                            onClick={() => handleOpenResetPasswordModal(user)}
                            className="neu-btn p-1.5 text-[#10243A] hover:border-[#18A6A6] cursor-pointer"
                            title="Reset Staff Password"
                          >
                            <Key className="w-3.5 h-3.5 text-[#18A6A6]" />
                          </button>
                        )}

                        {/* Switch / Impersonate for Testing */}
                        {onSwitchUser && (
                          <button
                            onClick={() => onSwitchUser(user)}
                            className="neu-btn p-1.5 text-[#10243A] hover:border-[#18A6A6] cursor-pointer"
                            title="Sign in as this User"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-[#10243A]" />
                          </button>
                        )}

                        {/* Edit User */}
                        {(isSuperAdmin || (isAdmin && !isSuper)) && (
                          <button
                            onClick={() => handleOpenEditModal(user)}
                            className="neu-btn p-1.5 text-[#10243A] hover:border-[#18A6A6] cursor-pointer"
                            title="Edit User Information"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#18A6A6]" />
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
                            className="neu-btn p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 cursor-pointer"
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
        <div className="fixed inset-0 bg-[#10243A]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="neu-card max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#DCE4EB] shadow-xl animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-[#DCE4EB] flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#137F83]">
                  <UserPlus className="w-4 h-4 text-[#137F83]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#10243A] text-sm">
                    {editingUser ? 'Edit User / Staff Member' : 'Add New User / Staff Member'}
                  </h3>
                  <p className="text-[11px] text-[#64748B]">Configure role assignment, username and password</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="neu-btn p-1.5 rounded-xl text-[#64748B] hover:text-[#10243A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#10243A] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shakir Ahmad"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="neu-input w-full px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#10243A] mb-1">Employee Code / ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EMP-ABM-102"
                    value={employeeCode}
                    onChange={(e) => {
                      setEmployeeCode(e.target.value);
                      if (!editingUser) setUsername(e.target.value);
                    }}
                    className="neu-input w-full px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Login Username & Initial Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F8FAFC] p-3.5 rounded-xl border border-[#DCE4EB]">
                <div>
                  <label className="block font-semibold text-[#10243A] mb-1">Login Username *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. shakir878 or EMP ID"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="neu-input w-full px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#10243A] mb-1">Password (Default: 1234) *</label>
                  <input
                    type="text"
                    required
                    placeholder="1234"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="neu-input w-full px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#10243A] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. user@pharmaassam.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="neu-input w-full px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#10243A] mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 8448440654"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="neu-input w-full px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#10243A] mb-1">Role & Privilege Level *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="neu-input w-full px-3 py-2 text-xs appearance-none bg-white text-[#10243A] font-semibold cursor-pointer"
                  >
                    {isSuperAdmin && <option value="SUPER_ADMIN">👑 Super Admin (Global Platform)</option>}
                    <option value="ADMIN">🏢 Company Admin (Full Company DB Access)</option>
                    <option value="MANAGER">👔 Manager (Team & Territory Scope)</option>
                    <option value="MEDICAL_REP">🏃 Field Medical Representative (Field Beat)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#10243A] mb-1">Company / Organization *</label>
                  <select
                    value={companyId}
                    disabled={!isSuperAdmin}
                    onChange={(e) => setCompanyId(e.target.value)}
                    className="neu-input w-full px-3 py-2 text-xs appearance-none bg-white text-[#10243A] cursor-pointer disabled:opacity-60"
                  >
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#10243A] mb-1">Territory / Headquarters *</label>
                <select
                  value={territoryId}
                  onChange={(e) => setTerritoryId(e.target.value)}
                  className="neu-input w-full px-3 py-2 text-xs appearance-none bg-white text-[#10243A] cursor-pointer"
                >
                  {territories.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-[#DCE4EB] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="neu-btn px-4 py-2 text-xs text-[#64748B] hover:text-[#10243A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neu-btn-gold px-4 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
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
        <div className="fixed inset-0 bg-[#10243A]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="neu-card max-w-sm w-full border border-[#DCE4EB] shadow-xl animate-in fade-in zoom-in-95 overflow-hidden">
            <div className="p-5 bg-white border-b border-[#DCE4EB] text-[#10243A] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-[#18A6A6]" />
                <h3 className="font-bold text-sm">Reset Staff Password</h3>
              </div>
              <button
                onClick={() => setIsResetPasswordModalOpen(false)}
                className="neu-btn p-1.5 rounded-xl text-[#64748B] hover:text-[#10243A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#DCE4EB]">
                <span className="text-[#64748B] block">Resetting password for:</span>
                <span className="font-bold text-[#10243A] text-sm">{userToResetPassword.name}</span>
                <span className="block font-mono text-[11px] text-[#137F83] mt-0.5">
                  Username: {userToResetPassword.username || userToResetPassword.employeeCode}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-[#10243A] mb-1">Set New Password *</label>
                <input
                  type="text"
                  required
                  value={adminNewPassword}
                  onChange={(e) => setAdminNewPassword(e.target.value)}
                  className="neu-input w-full px-3 py-2 font-mono text-sm font-bold text-[#10243A]"
                />
              </div>

              <div className="pt-3.5 border-t border-[#DCE4EB] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsResetPasswordModalOpen(false)}
                  className="neu-btn px-3 py-1.5 text-xs text-[#64748B] hover:text-[#10243A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecutePasswordReset}
                  className="neu-btn-gold px-4 py-1.5 text-xs font-bold cursor-pointer"
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
        <div className="fixed inset-0 bg-[#10243A]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="neu-card max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#DCE4EB] shadow-xl animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-[#DCE4EB] flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#137F83]">
                  <Key className="w-4 h-4 text-[#137F83]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#10243A] text-sm">
                    Granular Access Control: {selectedUserForPermissions.name}
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    Role: <span className="font-semibold text-[#137F83]">{selectedUserForPermissions.role}</span> • {selectedUserForPermissions.companyName || 'Company'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPermissionsModalOpen(false)}
                className="neu-btn p-1.5 rounded-xl text-[#64748B] hover:text-[#10243A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-[#64748B] leading-relaxed bg-[#F8FAFC] p-3.5 rounded-xl border border-[#DCE4EB]">
                Grant or revoke module-level edit, add, remove, and approval permissions for this user.
              </p>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-xl border border-[#DCE4EB] bg-[#F8FAFC] hover:border-[#18A6A6] cursor-pointer">
                  <div>
                    <span className="font-bold text-[#10243A] block">Manage Master Database (CRUD)</span>
                    <span className="text-[11px] text-[#64748B]">Add, edit, remove doctors, chemists, products, and territories in DB</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={permissions.canModifyDatabase}
                    onChange={(e) => setPermissions({ ...permissions, canModifyDatabase: e.target.checked })}
                    className="w-4 h-4 text-[#18A6A6] rounded border-[#DCE4EB] focus:ring-[#18A6A6] accent-[#18A6A6]"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-[#DCE4EB] bg-[#F8FAFC] hover:border-[#18A6A6] cursor-pointer">
                  <div>
                    <span className="font-bold text-[#10243A] block">Manage Doctors Master</span>
                    <span className="text-[11px] text-[#64748B]">Add and update doctor profiles, tiers, and GPS geofences</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={permissions.canManageDoctors}
                    onChange={(e) => setPermissions({ ...permissions, canManageDoctors: e.target.checked })}
                    className="w-4 h-4 text-[#18A6A6] rounded border-[#DCE4EB] focus:ring-[#18A6A6] accent-[#18A6A6]"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-[#DCE4EB] bg-[#F8FAFC] hover:border-[#18A6A6] cursor-pointer">
                  <div>
                    <span className="font-bold text-[#10243A] block">Manage Chemists & Stockists</span>
                    <span className="text-[11px] text-[#64748B]">Add and update pharmacy licenses, GSTIN, and retail touchpoints</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={permissions.canManageChemists}
                    onChange={(e) => setPermissions({ ...permissions, canManageChemists: e.target.checked })}
                    className="w-4 h-4 text-[#18A6A6] rounded border-[#DCE4EB] focus:ring-[#18A6A6] accent-[#18A6A6]"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-[#DCE4EB] bg-[#F8FAFC] hover:border-[#18A6A6] cursor-pointer">
                  <div>
                    <span className="font-bold text-[#10243A] block">Manage Product Catalog & Pricing</span>
                    <span className="text-[11px] text-[#64748B]">Add new SKUs, update MRP, PTR, PTS, and compositions</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={permissions.canManageProducts}
                    onChange={(e) => setPermissions({ ...permissions, canManageProducts: e.target.checked })}
                    className="w-4 h-4 text-[#18A6A6] rounded border-[#DCE4EB] focus:ring-[#18A6A6] accent-[#18A6A6]"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-[#DCE4EB] bg-[#F8FAFC] hover:border-[#18A6A6] cursor-pointer">
                  <div>
                    <span className="font-bold text-[#10243A] block">Approve DCRs & Tour Plans</span>
                    <span className="text-[11px] text-[#64748B]">Verify geofenced field call submissions and monthly tour itineraries</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={permissions.canApproveDCR}
                    onChange={(e) => setPermissions({ ...permissions, canApproveDCR: e.target.checked, canApproveTourPlans: e.target.checked })}
                    className="w-4 h-4 text-[#18A6A6] rounded border-[#DCE4EB] focus:ring-[#18A6A6] accent-[#18A6A6]"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-[#DCE4EB] bg-[#F8FAFC] hover:border-[#18A6A6] cursor-pointer">
                  <div>
                    <span className="font-bold text-[#10243A] block">Approve Travel Expenses & Mileage</span>
                    <span className="text-[11px] text-[#64748B]">Audit ₹7.50/km verified GPS claims and daily allowances</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={permissions.canApproveExpenses}
                    onChange={(e) => setPermissions({ ...permissions, canApproveExpenses: e.target.checked })}
                    className="w-4 h-4 text-[#18A6A6] rounded border-[#DCE4EB] focus:ring-[#18A6A6] accent-[#18A6A6]"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-[#DCE4EB] bg-[#F8FAFC] hover:border-[#18A6A6] cursor-pointer">
                  <div>
                    <span className="font-bold text-[#10243A] block">Export MIS Reports & Data</span>
                    <span className="text-[11px] text-[#64748B]">Download Excel/CSV field audit summaries and POB orders</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={permissions.canExportData}
                    onChange={(e) => setPermissions({ ...permissions, canExportData: e.target.checked })}
                    className="w-4 h-4 text-[#18A6A6] rounded border-[#DCE4EB] focus:ring-[#18A6A6] accent-[#18A6A6]"
                  />
                </label>
              </div>

              <div className="pt-4 border-t border-[#DCE4EB] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPermissionsModalOpen(false)}
                  className="neu-btn px-4 py-2 text-xs text-[#64748B] hover:text-[#10243A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePermissions}
                  className="neu-btn-gold px-4 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
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

