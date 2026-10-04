import { Doctor, Chemist, Product, User, Territory, Company, DCRRecord, TourPlanItem, AuditLogEntry } from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_COMPANIES, 
  INITIAL_DOCTORS, 
  INITIAL_CHEMISTS, 
  INITIAL_PRODUCTS, 
  INITIAL_TERRITORIES, 
  INITIAL_DCR_LOGS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';

const STORAGE_KEYS = {
  DOCTORS: 'reppulse_master_doctors',
  CHEMISTS: 'reppulse_master_chemists',
  PRODUCTS: 'reppulse_master_products',
  USERS: 'reppulse_master_users',
  COMPANIES: 'reppulse_master_companies',
  TERRITORIES: 'reppulse_master_territories',
  DCR_LOGS: 'reppulse_master_dcr_logs',
  TOUR_PLANS: 'reppulse_master_tour_plans',
  AUDIT_LOGS: 'reppulse_master_audit_logs',
  PLANNED_VISITS: 'reppulse_today_planned_visits',
};

export class StorageService {
  // Safe generic getItem
  private static getItem<T>(key: string, fallback: T): T {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return fallback;
      return JSON.parse(stored) as T;
    } catch (e) {
      console.error(`Failed to parse storage key: ${key}`, e);
      return fallback;
    }
  }

  // Safe generic setItem
  private static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to save storage key: ${key}`, e);
    }
  }

  // Doctors
  static getDoctors(): Doctor[] {
    const doctors = this.getItem<Doctor[]>(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
    return Array.isArray(doctors) && doctors.length > 0 ? doctors : INITIAL_DOCTORS;
  }

  static saveDoctors(doctors: Doctor[]): void {
    this.setItem(STORAGE_KEYS.DOCTORS, doctors);
  }

  // Chemists
  static getChemists(): Chemist[] {
    const chemists = this.getItem<Chemist[]>(STORAGE_KEYS.CHEMISTS, INITIAL_CHEMISTS);
    return Array.isArray(chemists) && chemists.length > 0 ? chemists : INITIAL_CHEMISTS;
  }

  static saveChemists(chemists: Chemist[]): void {
    this.setItem(STORAGE_KEYS.CHEMISTS, chemists);
  }

  // Products
  static getProducts(): Product[] {
    const products = this.getItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    return Array.isArray(products) && products.length > 0 ? products : INITIAL_PRODUCTS;
  }

  static saveProducts(products: Product[]): void {
    this.setItem(STORAGE_KEYS.PRODUCTS, products);
  }

  // Users
  static getUsers(): User[] {
    const users = this.getItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    return Array.isArray(users) && users.length > 0 ? users : INITIAL_USERS;
  }

  static saveUsers(users: User[]): void {
    this.setItem(STORAGE_KEYS.USERS, users);
  }

  // Companies
  static getCompanies(): Company[] {
    const companies = this.getItem<Company[]>(STORAGE_KEYS.COMPANIES, INITIAL_COMPANIES);
    return Array.isArray(companies) && companies.length > 0 ? companies : INITIAL_COMPANIES;
  }

  static saveCompanies(companies: Company[]): void {
    this.setItem(STORAGE_KEYS.COMPANIES, companies);
  }

  // Territories
  static getTerritories(): Territory[] {
    const territories = this.getItem<Territory[]>(STORAGE_KEYS.TERRITORIES, INITIAL_TERRITORIES);
    return Array.isArray(territories) && territories.length > 0 ? territories : INITIAL_TERRITORIES;
  }

  static saveTerritories(territories: Territory[]): void {
    this.setItem(STORAGE_KEYS.TERRITORIES, territories);
  }

  // DCR Logs
  static getDCRLogs(): DCRRecord[] {
    const dcr = this.getItem<DCRRecord[]>(STORAGE_KEYS.DCR_LOGS, INITIAL_DCR_LOGS);
    return Array.isArray(dcr) ? dcr : INITIAL_DCR_LOGS;
  }

  static saveDCRLogs(logs: DCRRecord[]): void {
    this.setItem(STORAGE_KEYS.DCR_LOGS, logs);
  }

  // Tour Plans
  static getTourPlans(): TourPlanItem[] {
    const plans = this.getItem<TourPlanItem[]>(STORAGE_KEYS.TOUR_PLANS, [
      {
        id: 'tp-01',
        userId: 'usr-mr-01',
        userName: 'Shakir Ahmad',
        date: new Date().toISOString().split('T')[0],
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
    return Array.isArray(plans) ? plans : [];
  }

  static saveTourPlans(plans: TourPlanItem[]): void {
    this.setItem(STORAGE_KEYS.TOUR_PLANS, plans);
  }

  // Audit Logs
  static getAuditLogs(): AuditLogEntry[] {
    const logs = this.getItem<AuditLogEntry[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    return Array.isArray(logs) ? logs : INITIAL_AUDIT_LOGS;
  }

  static saveAuditLogs(logs: AuditLogEntry[]): void {
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, logs);
  }

  // Today's Planned Visits (The "Add to Visit" Queue)
  static getPlannedVisits(): string[] {
    const visits = this.getItem<string[]>(STORAGE_KEYS.PLANNED_VISITS, []);
    return Array.isArray(visits) ? visits : [];
  }

  static savePlannedVisits(doctorIds: string[]): void {
    this.setItem(STORAGE_KEYS.PLANNED_VISITS, doctorIds);
  }

  // Full Database Backup Export as JSON
  static exportFullDatabaseJSON(): string {
    const fullBackup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      doctors: this.getDoctors(),
      chemists: this.getChemists(),
      products: this.getProducts(),
      users: this.getUsers(),
      companies: this.getCompanies(),
      territories: this.getTerritories(),
      dcrLogs: this.getDCRLogs(),
      tourPlans: this.getTourPlans(),
      plannedVisits: this.getPlannedVisits(),
    };
    return JSON.stringify(fullBackup, null, 2);
  }

  // Full Database Import from JSON
  static importFullDatabaseJSON(jsonString: string): { success: boolean; message: string; counts?: any } {
    try {
      const data = JSON.parse(jsonString);
      if (!data) throw new Error('Invalid JSON format');

      if (Array.isArray(data.doctors)) this.saveDoctors(data.doctors);
      if (Array.isArray(data.chemists)) this.saveChemists(data.chemists);
      if (Array.isArray(data.products)) this.saveProducts(data.products);
      if (Array.isArray(data.users)) this.saveUsers(data.users);
      if (Array.isArray(data.companies)) this.saveCompanies(data.companies);
      if (Array.isArray(data.territories)) this.saveTerritories(data.territories);
      if (Array.isArray(data.dcrLogs)) this.saveDCRLogs(data.dcrLogs);
      if (Array.isArray(data.tourPlans)) this.saveTourPlans(data.tourPlans);
      if (Array.isArray(data.plannedVisits)) this.savePlannedVisits(data.plannedVisits);

      return {
        success: true,
        message: `Database restored successfully! (${data.doctors?.length || 0} Doctors, ${data.chemists?.length || 0} Chemists, ${data.products?.length || 0} Products)`,
        counts: {
          doctors: data.doctors?.length || 0,
          chemists: data.chemists?.length || 0,
          products: data.products?.length || 0,
          users: data.users?.length || 0,
        }
      };
    } catch (e: any) {
      return { success: false, message: e?.message || 'Failed to parse database file.' };
    }
  }
}
