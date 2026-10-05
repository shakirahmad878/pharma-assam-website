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
import { FirestoreService } from './firestoreService';

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

// Known mock IDs to purge if found in old cache
const MOCK_DOC_IDS = new Set(['doc-01', 'doc-02', 'doc-03', 'doc-04', 'doc-05', 'doc-06', 'doc-07', 'doc-08', 'doc-09', 'doc-10', 'doc-11']);
const MOCK_CHEM_IDS = new Set(['chem-01', 'chem-02', 'chem-03', 'chem-04']);
const MOCK_PROD_IDS = new Set(['prod-01', 'prod-02', 'prod-03', 'prod-04']);
const MOCK_COMP_IDS = new Set(['comp-02', 'comp-03']);
const MOCK_USER_IDS = new Set(['usr-admin-comp-02', 'usr-mgr-01', 'usr-mgr-02', 'usr-mr-01', 'usr-mr-02', 'usr-mr-03']);
const MOCK_AUDIT_IDS = new Set(['aud-01', 'aud-02', 'aud-03', 'aud-04', 'aud-05']);
const MOCK_TP_IDS = new Set(['tp-01']);

export class StorageService {
  // Safe generic getItem
  public static getItem<T>(key: string, fallback: T): T {
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
  public static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to save storage key: ${key}`, e);
    }
  }

  // Doctors
  static getDoctors(): Doctor[] {
    const doctors = this.getItem<Doctor[]>(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
    if (!Array.isArray(doctors)) return [];
    return doctors.filter(d => !MOCK_DOC_IDS.has(d.id));
  }

  static saveDoctors(doctors: Doctor[]): void {
    const clean = doctors.filter(d => !MOCK_DOC_IDS.has(d.id));
    this.setItem(STORAGE_KEYS.DOCTORS, clean);
  }

  static async addOrUpdateDoctor(doc: Doctor): Promise<void> {
    const current = this.getDoctors();
    const updated = [doc, ...current.filter(d => d.id !== doc.id)];
    this.saveDoctors(updated);
    if (FirestoreService.isConnected()) {
      await FirestoreService.saveDoctor(doc);
    }
  }

  static async deleteDoctor(docId: string): Promise<void> {
    const current = this.getDoctors();
    const updated = current.filter(d => d.id !== docId);
    this.saveDoctors(updated);
    if (FirestoreService.isConnected()) {
      await FirestoreService.deleteDoctor(docId);
    }
  }

  // Chemists
  static getChemists(): Chemist[] {
    const chemists = this.getItem<Chemist[]>(STORAGE_KEYS.CHEMISTS, INITIAL_CHEMISTS);
    if (!Array.isArray(chemists)) return [];
    return chemists.filter(c => !MOCK_CHEM_IDS.has(c.id));
  }

  static saveChemists(chemists: Chemist[]): void {
    const clean = chemists.filter(c => !MOCK_CHEM_IDS.has(c.id));
    this.setItem(STORAGE_KEYS.CHEMISTS, clean);
  }

  static async addOrUpdateChemist(chem: Chemist): Promise<void> {
    const current = this.getChemists();
    const updated = [chem, ...current.filter(c => c.id !== chem.id)];
    this.saveChemists(updated);
    if (FirestoreService.isConnected()) {
      await FirestoreService.saveChemist(chem);
    }
  }

  static async deleteChemist(chemId: string): Promise<void> {
    const current = this.getChemists();
    const updated = current.filter(c => c.id !== chemId);
    this.saveChemists(updated);
    if (FirestoreService.isConnected()) {
      await FirestoreService.deleteChemist(chemId);
    }
  }

  // Products
  static getProducts(): Product[] {
    const products = this.getItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    if (!Array.isArray(products)) return [];
    return products.filter(p => !MOCK_PROD_IDS.has(p.id));
  }

  static saveProducts(products: Product[]): void {
    const clean = products.filter(p => !MOCK_PROD_IDS.has(p.id));
    this.setItem(STORAGE_KEYS.PRODUCTS, clean);
  }

  static async addOrUpdateProduct(prod: Product): Promise<void> {
    const current = this.getProducts();
    const updated = [prod, ...current.filter(p => p.id !== prod.id)];
    this.saveProducts(updated);
    if (FirestoreService.isConnected()) {
      await FirestoreService.saveProduct(prod);
    }
  }

  static async deleteProduct(prodId: string): Promise<void> {
    const current = this.getProducts();
    const updated = current.filter(p => p.id !== prodId);
    this.saveProducts(updated);
    if (FirestoreService.isConnected()) {
      await FirestoreService.deleteProduct(prodId);
    }
  }

  // Users
  static getUsers(): User[] {
    const users = this.getItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    if (!Array.isArray(users) || users.length === 0) return INITIAL_USERS;
    const filtered = users.filter(u => !MOCK_USER_IDS.has(u.id));
    return filtered.length > 0 ? filtered : INITIAL_USERS;
  }

  static saveUsers(users: User[]): void {
    this.setItem(STORAGE_KEYS.USERS, users);
  }

  static async addOrUpdateUser(user: User): Promise<void> {
    const current = this.getUsers();
    const updated = [user, ...current.filter(u => u.id !== user.id)];
    this.saveUsers(updated);
    if (FirestoreService.isConnected()) {
      await FirestoreService.saveUser(user);
    }
  }

  static async deleteUser(userId: string): Promise<void> {
    const current = this.getUsers();
    const updated = current.filter(u => u.id !== userId);
    this.saveUsers(updated);
    if (FirestoreService.isConnected()) {
      await FirestoreService.deleteUser(userId);
    }
  }

  // Companies
  static getCompanies(): Company[] {
    const companies = this.getItem<Company[]>(STORAGE_KEYS.COMPANIES, INITIAL_COMPANIES);
    if (!Array.isArray(companies) || companies.length === 0) return INITIAL_COMPANIES;
    const filtered = companies.filter(c => !MOCK_COMP_IDS.has(c.id));
    return filtered.length > 0 ? filtered : INITIAL_COMPANIES;
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

  static async addOrUpdateTerritory(terr: Territory): Promise<void> {
    const current = this.getTerritories();
    const updated = [terr, ...current.filter(t => t.id !== terr.id)];
    this.saveTerritories(updated);
    if (FirestoreService.isConnected()) {
      await FirestoreService.saveTerritory(terr);
    }
  }

  static async deleteTerritory(terrId: string): Promise<void> {
    const current = this.getTerritories();
    const updated = current.filter(t => t.id !== terrId);
    this.saveTerritories(updated);
    if (FirestoreService.isConnected()) {
      await FirestoreService.deleteTerritory(terrId);
    }
  }

  // DCR Logs
  static getDCRLogs(): DCRRecord[] {
    const dcr = this.getItem<DCRRecord[]>(STORAGE_KEYS.DCR_LOGS, []);
    return Array.isArray(dcr) ? dcr.filter(d => d.id !== 'dcr-01') : [];
  }

  static saveDCRLogs(logs: DCRRecord[]): void {
    this.setItem(STORAGE_KEYS.DCR_LOGS, logs);
  }

  static async addDCRLog(log: DCRRecord): Promise<void> {
    const current = this.getDCRLogs();
    const updated = [log, ...current.filter(l => l.id !== log.id)];
    this.saveDCRLogs(updated);
    if (FirestoreService.isConnected()) {
      await FirestoreService.saveDCRLog(log);
    }
  }

  // Tour Plans
  static getTourPlans(): TourPlanItem[] {
    const plans = this.getItem<TourPlanItem[]>(STORAGE_KEYS.TOUR_PLANS, []);
    return Array.isArray(plans) ? plans.filter(p => !MOCK_TP_IDS.has(p.id)) : [];
  }

  static saveTourPlans(plans: TourPlanItem[]): void {
    this.setItem(STORAGE_KEYS.TOUR_PLANS, plans);
  }

  // Audit Logs
  static getAuditLogs(): AuditLogEntry[] {
    const logs = this.getItem<AuditLogEntry[]>(STORAGE_KEYS.AUDIT_LOGS, []);
    if (!Array.isArray(logs)) return [];
    return logs.filter(l => !MOCK_AUDIT_IDS.has(l.id));
  }

  static saveAuditLogs(logs: AuditLogEntry[]): void {
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, logs);
  }

  // Today's Planned Visits (The "Add to Visit" Queue)
  static getPlannedVisits(): string[] {
    const visits = this.getItem<string[]>(STORAGE_KEYS.PLANNED_VISITS, []);
    return Array.isArray(visits) ? visits.filter(id => !MOCK_DOC_IDS.has(id)) : [];
  }

  static savePlannedVisits(doctorIds: string[]): void {
    this.setItem(STORAGE_KEYS.PLANNED_VISITS, doctorIds);
  }

  // Full Database Backup Export as JSON
  static exportFullDatabaseJSON(): string {
    const fullBackup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      database: 'Google Cloud Firestore (reppulse-pharma)',
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

      // Also trigger cloud sync if connected
      if (FirestoreService.isConnected()) {
        FirestoreService.syncAllLocalToCloud({
          doctors: this.getDoctors(),
          chemists: this.getChemists(),
          products: this.getProducts(),
          users: this.getUsers(),
          companies: this.getCompanies(),
          territories: this.getTerritories(),
          dcrLogs: this.getDCRLogs(),
        }).catch(err => console.warn('[Firestore] Auto-sync on import error:', err));
      }

      return {
        success: true,
        message: `Database restored and synced to Cloud Firestore! (${data.doctors?.length || 0} Doctors, ${data.chemists?.length || 0} Chemists, ${data.products?.length || 0} Products)`,
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
