import { Doctor, Chemist, Stockist, Product, Territory, User, LocationTelemetryPoint, DCRRecord, RouteStopover, Company, AuditLogEntry, UserPermissions } from '../types';

export const DEFAULT_PERMISSIONS: UserPermissions = {
  canManageUsers: false,
  canManageDoctors: true,
  canManageChemists: true,
  canManageProducts: true,
  canManageTerritories: true,
  canApproveDCR: true,
  canApproveTourPlans: true,
  canApproveExpenses: true,
  canExportData: true,
  canModifyDatabase: false,
  canViewAuditLogs: false,
};

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp-01',
    name: 'Pharma Assam Healthcare Pvt Ltd',
    code: 'PAH-AS',
    registrationNumber: 'U24239AS2020PTC019842',
    gstNumber: '18AAACP1234F1Z8',
    contactEmail: 'contact@pharmaassam.in',
    contactPhone: '+91 3842 267890',
    headquarters: 'Silchar, Assam',
    state: 'Assam',
    subscriptionPlan: 'ENTERPRISE',
    maxUsers: 50,
    activeUsersCount: 2,
    activeDoctorsCount: 0,
    activeChemistsCount: 0,
    status: 'ACTIVE',
    createdAt: '2024-01-15',
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-01',
    name: 'Shakir Ahmad',
    username: 'shakir878',
    password: 'password123',
    email: 'shakirahmad878@gmail.com',
    role: 'SUPER_ADMIN',
    phone: '+91 8448440654',
    companyId: 'comp-01',
    companyName: 'Pharma Assam Healthcare Pvt Ltd',
    territoryId: 'terr-cachar-01',
    territoryName: 'Assam Regional HQ',
    employeeCode: 'EMP-HQ-001',
    isActive: true,
    permissions: {
      canManageUsers: true,
      canManageDoctors: true,
      canManageChemists: true,
      canManageProducts: true,
      canManageTerritories: true,
      canApproveDCR: true,
      canApproveTourPlans: true,
      canApproveExpenses: true,
      canExportData: true,
      canModifyDatabase: true,
      canViewAuditLogs: true,
    }
  },
  {
    id: 'usr-admin-comp-01',
    name: 'Bodrud Sadiol',
    username: 'bodrudsadiol',
    password: 'password123',
    email: 'bodrudsadiol@pharmaassam.in',
    role: 'ADMIN',
    phone: '+91 94350 11990',
    companyId: 'comp-01',
    companyName: 'Pharma Assam Healthcare Pvt Ltd',
    territoryId: 'terr-cachar-01',
    territoryName: 'Pharma Assam Barak Division',
    employeeCode: 'PAH-ADM-01',
    isActive: true,
    permissions: {
      canManageUsers: true,
      canManageDoctors: true,
      canManageChemists: true,
      canManageProducts: true,
      canManageTerritories: true,
      canApproveDCR: true,
      canApproveTourPlans: true,
      canApproveExpenses: true,
      canExportData: true,
      canModifyDatabase: true,
      canViewAuditLogs: true,
    }
  }
];

export const INITIAL_TERRITORIES: Territory[] = [
  {
    id: 'terr-cachar-01',
    code: 'SIL-01',
    name: 'Silchar Central & Hospital Road',
    zone: 'Barak Valley Zone',
    state: 'Assam',
    headquarter: 'Silchar HQ',
    assignedManagerId: 'usr-admin-comp-01',
    assignedMRIds: ['usr-admin-01'],
    doctorCount: 0,
    chemistCount: 0,
    companyId: 'comp-01',
    companyName: 'Pharma Assam Healthcare Pvt Ltd',
  },
  {
    id: 'terr-cachar-02',
    code: 'SIL-02',
    name: 'SMCH Ghungoor & Tarapur Beat',
    zone: 'Barak Valley Zone',
    state: 'Assam',
    headquarter: 'Silchar HQ',
    assignedManagerId: 'usr-admin-comp-01',
    assignedMRIds: ['usr-admin-01'],
    doctorCount: 0,
    chemistCount: 0,
    companyId: 'comp-01',
    companyName: 'Pharma Assam Healthcare Pvt Ltd',
  },
  {
    id: 'terr-karimganj-01',
    code: 'KGJ-01',
    name: 'Karimganj Town & Badarpur Beat',
    zone: 'Barak Valley Zone',
    state: 'Assam',
    headquarter: 'Karimganj (Shribhumi)',
    assignedManagerId: 'usr-admin-comp-01',
    assignedMRIds: ['usr-admin-01'],
    doctorCount: 0,
    chemistCount: 0,
    companyId: 'comp-01',
    companyName: 'Pharma Assam Healthcare Pvt Ltd',
  },
  {
    id: 'terr-hailakandi-01',
    code: 'HLK-01',
    name: 'Hailakandi Town & S.K. Roy Civil Hospital',
    zone: 'Barak Valley Zone',
    state: 'Assam',
    headquarter: 'Hailakandi HQ',
    assignedManagerId: 'usr-admin-comp-01',
    assignedMRIds: ['usr-admin-01'],
    doctorCount: 0,
    chemistCount: 0,
    companyId: 'comp-01',
    companyName: 'Pharma Assam Healthcare Pvt Ltd',
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [];
export const INITIAL_PRODUCTS: Product[] = [];
export const INITIAL_DOCTORS: Doctor[] = [];
export const INITIAL_CHEMISTS: Chemist[] = [];
export const INITIAL_STOCKISTS: Stockist[] = [];
export const INITIAL_STOPOVERS: RouteStopover[] = [];
export const INITIAL_TELEMETRY_LOGS: LocationTelemetryPoint[] = [];
export const INITIAL_DCR_LOGS: DCRRecord[] = [];
