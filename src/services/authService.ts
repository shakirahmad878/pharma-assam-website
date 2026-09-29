import { User, UserRole, UserPermissions } from '../types';
import { INITIAL_USERS } from '../data/mockData';

const CURRENT_USER_KEY = 'pharma_sfa_current_user';

export class AuthService {
  static getCurrentUser(): User | null {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored user', e);
      }
    }
    return null;
  }

  static setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }

  static login(
    identifier: string,
    passwordAttempt: string,
    usersList: User[] = INITIAL_USERS
  ): { success: boolean; user?: User; error?: string } {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = passwordAttempt.trim();

    const user = usersList.find(
      u =>
        (u.username && u.username.toLowerCase() === cleanId) ||
        (u.employeeCode && u.employeeCode.toLowerCase() === cleanId) ||
        (u.email && u.email.toLowerCase() === cleanId)
    );

    if (!user) {
      return { success: false, error: 'User account or Employee ID not found.' };
    }

    if (!user.isActive) {
      return { success: false, error: 'This user account has been deactivated. Please contact Administrator.' };
    }

    // Check password (default fallback to '1234' for existing accounts without explicit password)
    const expectedPassword = user.password || (user.role === 'SUPER_ADMIN' ? '1280' : '1234');
    if (cleanPass !== expectedPassword) {
      return { success: false, error: 'Invalid password. Please verify credentials.' };
    }

    this.setCurrentUser(user);
    return { success: true, user };
  }

  static changePassword(
    userId: string,
    oldPasswordAttempt: string,
    newPassword: string,
    usersList: User[]
  ): { success: boolean; error?: string; updatedUser?: User } {
    const user = usersList.find(u => u.id === userId);
    if (!user) {
      return { success: false, error: 'User not found.' };
    }

    const currentPass = user.password || (user.role === 'SUPER_ADMIN' ? '1280' : '1234');
    if (oldPasswordAttempt.trim() !== currentPass) {
      return { success: false, error: 'Current password does not match.' };
    }

    if (!newPassword || newPassword.trim().length < 4) {
      return { success: false, error: 'New password must be at least 4 characters long.' };
    }

    const updatedUser: User = {
      ...user,
      password: newPassword.trim(),
    };

    const currentActive = this.getCurrentUser();
    if (currentActive && currentActive.id === userId) {
      this.setCurrentUser(updatedUser);
    }

    return { success: true, updatedUser };
  }

  static resetPasswordByAdmin(
    targetUserId: string,
    newPassword: string,
    usersList: User[]
  ): { success: boolean; error?: string; updatedUser?: User } {
    const user = usersList.find(u => u.id === targetUserId);
    if (!user) {
      return { success: false, error: 'User not found.' };
    }

    if (!newPassword || newPassword.trim().length < 4) {
      return { success: false, error: 'Password must be at least 4 characters long.' };
    }

    const updatedUser: User = {
      ...user,
      password: newPassword.trim(),
    };

    return { success: true, updatedUser };
  }

  static logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  static switchRole(role: UserRole): User {
    const user = INITIAL_USERS.find(u => u.role === role) || INITIAL_USERS[0];
    this.setCurrentUser(user);
    return user;
  }

  static switchUser(user: User): User {
    this.setCurrentUser(user);
    return user;
  }

  static isSuperAdmin(user?: User | null): boolean {
    const u = user !== undefined ? user : this.getCurrentUser();
    return !!u && u.role === 'SUPER_ADMIN';
  }

  static isAdmin(user?: User | null): boolean {
    const u = user !== undefined ? user : this.getCurrentUser();
    return !!u && u.role === 'ADMIN';
  }

  static isManager(user?: User | null): boolean {
    const u = user !== undefined ? user : this.getCurrentUser();
    return !!u && (u.role === 'MANAGER' || u.role === 'AREA_MANAGER' || u.role === 'REGIONAL_MANAGER');
  }

  static isMedicalRep(user?: User | null): boolean {
    const u = user !== undefined ? user : this.getCurrentUser();
    return !!u && u.role === 'MEDICAL_REP';
  }

  static canAccessAdminPortal(user?: User | null): boolean {
    const u = user !== undefined ? user : this.getCurrentUser();
    if (!u) return false;
    return u.role === 'SUPER_ADMIN' || u.role === 'ADMIN' || u.role === 'MANAGER' || u.role === 'AREA_MANAGER' || u.role === 'REGIONAL_MANAGER';
  }

  static canManageCompanies(user?: User | null): boolean {
    const u = user !== undefined ? user : this.getCurrentUser();
    return !!u && u.role === 'SUPER_ADMIN';
  }

  static canManageUsers(user?: User | null): boolean {
    const u = user !== undefined ? user : this.getCurrentUser();
    if (!u) return false;
    if (u.role === 'SUPER_ADMIN' || u.role === 'ADMIN') return true;
    return !!u.permissions?.canManageUsers;
  }

  static canModifyDatabase(user?: User | null): boolean {
    const u = user !== undefined ? user : this.getCurrentUser();
    if (!u) return false;
    if (u.role === 'SUPER_ADMIN' || u.role === 'ADMIN') return true;
    return !!u.permissions?.canModifyDatabase;
  }

  static canAccessTelemetry(user?: User | null): boolean {
    const u = user !== undefined ? user : this.getCurrentUser();
    if (!u) return false;
    return u.role === 'SUPER_ADMIN' || u.role === 'ADMIN';
  }

  static canManageMasterData(user?: User | null): boolean {
    const u = user !== undefined ? user : this.getCurrentUser();
    if (!u) return false;
    return u.role === 'SUPER_ADMIN' || u.role === 'ADMIN' || u.role === 'MANAGER' || u.role === 'AREA_MANAGER' || u.role === 'REGIONAL_MANAGER';
  }

  static hasPermission(key: keyof UserPermissions, user?: User | null): boolean {
    const u = user !== undefined ? user : this.getCurrentUser();
    if (!u) return false;
    if (u.role === 'SUPER_ADMIN') return true;
    if (u.role === 'ADMIN') {
      if (key === 'canManageUsers' || key === 'canManageDoctors' || key === 'canManageChemists' || 
          key === 'canManageProducts' || key === 'canManageTerritories' || key === 'canApproveDCR' || 
          key === 'canApproveTourPlans' || key === 'canApproveExpenses' || key === 'canExportData' || 
          key === 'canModifyDatabase' || key === 'canViewAuditLogs') {
        return true;
      }
    }
    return !!u.permissions?.[key];
  }

  static getCompanyScopedData<T extends { companyId?: string }>(items: T[], user?: User | null, selectedCompanyFilter?: string): T[] {
    const u = user !== undefined ? user : this.getCurrentUser();
    if (!u) return items;
    
    // Super Admin: Can view all, or filter by specific company if selected
    if (u.role === 'SUPER_ADMIN') {
      if (!selectedCompanyFilter || selectedCompanyFilter === 'ALL') {
        return items;
      }
      return items.filter(item => !item.companyId || item.companyId === selectedCompanyFilter);
    }

    // Company Admin: Strictly restricted to their own company's data
    if (u.role === 'ADMIN') {
      const targetCompany = u.companyId || 'comp-01';
      return items.filter(item => !item.companyId || item.companyId === targetCompany);
    }

    // Manager: Restricted to their company
    if (this.isManager(u)) {
      const targetCompany = u.companyId || 'comp-01';
      return items.filter(item => !item.companyId || item.companyId === targetCompany);
    }

    // Rep: Scoped to their company
    const targetCompany = u.companyId || 'comp-01';
    return items.filter(item => !item.companyId || item.companyId === targetCompany);
  }
}

