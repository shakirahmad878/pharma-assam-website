/**
 * RepPulse Supabase Database Synchronization Service (Web Edition)
 * -----------------------------------------------------------------
 * Seamlessly connects the Web Portal and Mobile APK with live Supabase PostgreSQL.
 * Handles:
 * - Doctors Directory (live geofence GPS, tiers, targets, specialties)
 * - Chemists & Stockists / Firms Directory (Distributors, Retailers, Stockists)
 * - Employees & Team Management (Division isolation, PINs, Roles)
 * - Visits / DCR Records
 * - Doctor Deletion Requests & Field Approvals
 */

import { SUPABASE_CONFIG, isSupabaseConfigured } from '../config/supabase';
import {
  Doctor,
  Chemist,
  Product,
  User,
  Company,
  Territory,
  DCRRecord,
  MedicalSpecialty,
  DoctorTier,
  UserRole,
} from '../types';

export interface DoctorDeletionRequest {
  id: string;
  doctorId: string;
  doctorName: string;
  reason: string;
  requestedBy: string;
  requestedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewComment?: string;
}

export function normalizeDoctor(raw: any): Doctor {
  if (!raw) {
    return {
      id: `doc-${Date.now()}`,
      name: 'Dr. Physician',
      qualification: 'MBBS',
      specialty: 'General Medicine',
      tier: 'A',
      clinicName: 'Clinic Chamber',
      clinicLocation: { latitude: 24.8146, longitude: 92.8037, address: 'Silchar, Assam' },
      geofenceRadiusMeters: 100,
      territoryId: 'route-cachar-01',
      territoryName: 'Silchar Central',
      phone: '+91 9435000000',
      visitingHours: '10:00 AM - 02:00 PM, 05:00 PM - 08:30 PM',
      preferredVisitDays: ['Mon', 'Wed', 'Fri'],
      averagePatientsPerDay: 35,
      potentialScore: 85,
      monthlyVisitTarget: 8,
      monthlyVisitsCompleted: 0,
      companyId: 'comp-01',
      companyName: 'Pharma Assam Healthcare Pvt Ltd',
    };
  }

  const lat = typeof raw.clinicLocation?.latitude === 'number'
    ? raw.clinicLocation.latitude
    : typeof raw.latitude === 'number'
    ? raw.latitude
    : 24.8146;

  const lng = typeof raw.clinicLocation?.longitude === 'number'
    ? raw.clinicLocation.longitude
    : typeof raw.longitude === 'number'
    ? raw.longitude
    : 92.8037;

  const address = raw.clinicLocation?.address || raw.clinic_address || raw.clinicAddress || raw.area || raw.address || 'Silchar, Assam';

  // Normalize tier format
  let tierVal: DoctorTier = 'A';
  const rawTier = String(raw.tier || '').toUpperCase();
  if (rawTier === 'A_PLUS' || rawTier === 'A+') tierVal = 'A_PLUS';
  else if (rawTier === 'B') tierVal = 'B';
  else if (rawTier === 'C') tierVal = 'C';
  else tierVal = 'A';

  return {
    id: String(raw.id || `doc-${Date.now()}`),
    name: raw.name || 'Doctor',
    qualification: raw.qualification || 'MBBS',
    specialty: (raw.specialty || 'General Medicine') as MedicalSpecialty,
    tier: tierVal,
    clinicName: raw.clinic_name || raw.clinicName || 'Clinic Chamber',
    clinicLocation: {
      latitude: lat,
      longitude: lng,
      address: address,
    },
    geofenceRadiusMeters: typeof raw.geofence_radius_meters === 'number' 
      ? raw.geofence_radius_meters 
      : (typeof raw.geofenceRadiusMeters === 'number' ? raw.geofenceRadiusMeters : 100),
    territoryId: raw.route_id || raw.routeId || raw.territoryId || 'route-cachar-01',
    territoryName: raw.area || raw.territoryName || raw.district || 'Silchar Central',
    phone: raw.phone || '+91 9435000000',
    email: raw.email || '',
    visitingHours: raw.visitingHours || '10:00 AM - 02:00 PM, 05:00 PM - 08:30 PM',
    preferredVisitDays: Array.isArray(raw.preferredVisitDays) ? raw.preferredVisitDays : ['Mon', 'Wed', 'Fri'],
    averagePatientsPerDay: typeof raw.averagePatientsPerDay === 'number' ? raw.averagePatientsPerDay : 35,
    potentialScore: typeof raw.potentialScore === 'number' ? raw.potentialScore : 85,
    lastVisitedDate: raw.last_visit_date || raw.lastVisitedDate || raw.lastVisitDate,
    monthlyVisitTarget: typeof raw.monthly_visit_target === 'number' 
      ? raw.monthly_visit_target 
      : (typeof raw.monthlyVisitTarget === 'number' ? raw.monthlyVisitTarget : 8),
    monthlyVisitsCompleted: typeof raw.completed_visits_this_month === 'number'
      ? raw.completed_visits_this_month
      : (typeof raw.monthlyVisitsCompleted === 'number' ? raw.monthlyVisitsCompleted : 0),
    companyId: raw.companyId || 'comp-01',
    companyName: raw.companyName || 'Pharma Assam Healthcare Pvt Ltd',
  };
}

export function normalizeChemist(raw: any): Chemist {
  if (!raw) {
    return {
      id: `chem-${Date.now()}`,
      name: 'Chemist Proprietor',
      shopName: 'Pharmacy Store',
      drugLicenseNumber: 'DL-18/AS',
      gstNumber: '18AABCS1234D1Z2',
      phone: '+91 9435000000',
      contactPerson: 'Chemist',
      associatedDoctors: [],
      location: { latitude: 24.8162, longitude: 92.8015, address: 'Silchar, Assam' },
      averageMonthlyTurnover: 450000,
      territoryId: 'TER-01',
      territoryName: 'Silchar Central',
      companyId: 'comp-01',
      companyName: 'Pharma Assam Healthcare Pvt Ltd',
    };
  }

  const lat = typeof raw.location?.latitude === 'number'
    ? raw.location.latitude
    : typeof raw.latitude === 'number'
    ? raw.latitude
    : 24.8162;

  const lng = typeof raw.location?.longitude === 'number'
    ? raw.location.longitude
    : typeof raw.longitude === 'number'
    ? raw.longitude
    : 92.8015;

  const address = raw.location?.address || raw.address || raw.firmAddress || (raw.area ? `${raw.area}, ${raw.district || ''}` : 'Silchar, Assam');

  return {
    id: String(raw.id || `chem-${Date.now()}`),
    name: raw.contact_person || raw.name || raw.contactPerson || 'Proprietor',
    shopName: raw.name || raw.shopName || raw.firmName || 'Pharmacy Store',
    drugLicenseNumber: raw.dl_number || raw.drugLicenseNumber || raw.dlNumber || 'DL-18/AS',
    gstNumber: raw.gstNumber || '18AABCS1234D1Z2',
    phone: raw.phone || '+91 9435000000',
    contactPerson: raw.contact_person || raw.contactPerson || raw.name || 'Pharmacist',
    associatedDoctors: Array.isArray(raw.associatedDoctors) ? raw.associatedDoctors : [],
    location: {
      latitude: lat,
      longitude: lng,
      address: address,
    },
    averageMonthlyTurnover: typeof raw.averageMonthlyTurnover === 'number' ? raw.averageMonthlyTurnover : 450000,
    territoryId: raw.route_id || raw.routeId || raw.territoryId || 'TER-01',
    territoryName: raw.area || raw.territoryName || raw.district || 'Silchar Central',
    companyId: raw.companyId || 'comp-01',
    companyName: raw.companyName || 'Pharma Assam Healthcare Pvt Ltd',
  };
}

export class SupabaseService {
  private static getHeaders() {
    return {
      apikey: SUPABASE_CONFIG.apiKey,
      Authorization: `Bearer ${SUPABASE_CONFIG.apiKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    };
  }

  public static isConnected(): boolean {
    return isSupabaseConfigured();
  }

  // ==========================================
  // 1. DOCTORS DIRECTORY
  // ==========================================

  public static async fetchDoctors(): Promise<Doctor[]> {
    if (!this.isConnected()) return [];
    try {
      const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/doctors?order=name.asc`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (!res.ok) {
        throw new Error(`Supabase error: ${res.status} ${await res.text()}`);
      }
      const raw = await res.json();
      return raw.map((d: any) => normalizeDoctor(d));
    } catch (err) {
      console.warn('[SupabaseService] fetchDoctors error:', err);
      return [];
    }
  }

  public static subscribeDoctors(onUpdate: (doctors: Doctor[]) => void): () => void {
    if (!this.isConnected()) return () => {};
    // Initial fetch
    this.fetchDoctors().then(onUpdate).catch(() => {});
    // Periodic poll every 30 seconds for live sync with APK field inputs
    const interval = setInterval(async () => {
      const docs = await this.fetchDoctors();
      if (docs.length > 0) onUpdate(docs);
    }, 30000);
    return () => clearInterval(interval);
  }

  public static async saveDoctor(doctor: Doctor): Promise<void> {
    if (!this.isConnected()) return;
    try {
      const district = doctor.territoryName?.includes('Hailakandi') ? 'Hailakandi' :
                       doctor.territoryName?.includes('Karimganj') ? 'Karimganj' :
                       doctor.territoryName?.includes('Aizawl') ? 'Aizawl' :
                       doctor.territoryName?.includes('Tripura') ? 'Tripura' : 'Cachar';

      const payload = {
        id: doctor.id,
        name: doctor.name,
        specialty: doctor.specialty || 'General Physician',
        qualification: doctor.qualification || 'MBBS',
        clinic_name: doctor.clinicName,
        clinic_address: doctor.clinicLocation?.address || '',
        area: doctor.territoryName || 'Silchar',
        district: district,
        phone: doctor.phone || '',
        tier: doctor.tier === 'A_PLUS' ? 'A_PLUS' : (doctor.tier || 'A'),
        monthly_visit_target: doctor.monthlyVisitTarget || 8,
        completed_visits_this_month: doctor.monthlyVisitsCompleted || 0,
        today_visit_status: 'PENDING',
        last_visit_date: doctor.lastVisitedDate || null,
        route_id: doctor.territoryId || 'route-cachar-01',
        latitude: doctor.clinicLocation?.latitude || 24.8146,
        longitude: doctor.clinicLocation?.longitude || 92.8037,
        geofence_radius_meters: doctor.geofenceRadiusMeters || 100,
        is_assigned_to_me: false,
        updated_at: new Date().toISOString(),
      };

      await fetch(`${SUPABASE_CONFIG.url}/rest/v1/doctors`, {
        method: 'POST',
        headers: { ...this.getHeaders(), Prefer: 'resolution=merge-duplicates' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('[SupabaseService] saveDoctor error:', err);
    }
  }

  public static async updateDoctor(id: string, updates: Partial<Doctor>): Promise<void> {
    if (!this.isConnected()) return;
    try {
      const payload: any = { updated_at: new Date().toISOString() };
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.qualification !== undefined) payload.qualification = updates.qualification;
      if (updates.specialty !== undefined) payload.specialty = updates.specialty;
      if (updates.clinicName !== undefined) payload.clinic_name = updates.clinicName;
      if (updates.clinicLocation?.address !== undefined) payload.clinic_address = updates.clinicLocation.address;
      if (updates.phone !== undefined) payload.phone = updates.phone;
      if (updates.tier !== undefined) payload.tier = updates.tier === 'A_PLUS' ? 'A_PLUS' : updates.tier;
      if (updates.monthlyVisitTarget !== undefined) payload.monthly_visit_target = updates.monthlyVisitTarget;
      if (updates.monthlyVisitsCompleted !== undefined) payload.completed_visits_this_month = updates.monthlyVisitsCompleted;
      if (updates.lastVisitedDate !== undefined) payload.last_visit_date = updates.lastVisitedDate;
      if (updates.territoryId !== undefined) payload.route_id = updates.territoryId;
      if (updates.clinicLocation?.latitude !== undefined) payload.latitude = updates.clinicLocation.latitude;
      if (updates.clinicLocation?.longitude !== undefined) payload.longitude = updates.clinicLocation.longitude;
      if (updates.geofenceRadiusMeters !== undefined) payload.geofence_radius_meters = updates.geofenceRadiusMeters;

      await fetch(`${SUPABASE_CONFIG.url}/rest/v1/doctors?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('[SupabaseService] updateDoctor error:', err);
    }
  }

  public static async deleteDoctor(id: string): Promise<void> {
    if (!this.isConnected()) return;
    try {
      await fetch(`${SUPABASE_CONFIG.url}/rest/v1/doctors?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
    } catch (err) {
      console.warn('[SupabaseService] deleteDoctor error:', err);
    }
  }

  // ==========================================
  // 2. CHEMISTS & STOCKISTS / FIRMS
  // ==========================================

  public static async fetchChemists(): Promise<Chemist[]> {
    if (!this.isConnected()) return [];
    try {
      const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/firms?order=name.asc`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (!res.ok) {
        throw new Error(`Supabase error: ${res.status}`);
      }
      const raw = await res.json();
      return raw.map((f: any) => normalizeChemist(f));
    } catch (err) {
      console.warn('[SupabaseService] fetchChemists error:', err);
      return [];
    }
  }

  public static subscribeChemists(onUpdate: (chemists: Chemist[]) => void): () => void {
    if (!this.isConnected()) return () => {};
    this.fetchChemists().then(onUpdate).catch(() => {});
    const interval = setInterval(async () => {
      const chems = await this.fetchChemists();
      if (chems.length > 0) onUpdate(chems);
    }, 30000);
    return () => clearInterval(interval);
  }

  public static async saveChemist(chemist: Chemist): Promise<void> {
    if (!this.isConnected()) return;
    try {
      const district = chemist.territoryName?.includes('Hailakandi') ? 'Hailakandi' :
                       chemist.territoryName?.includes('Karimganj') ? 'Karimganj' :
                       chemist.territoryName?.includes('Aizawl') ? 'Aizawl' :
                       chemist.territoryName?.includes('Tripura') ? 'Tripura' : 'Cachar';

      const payload = {
        id: chemist.id,
        name: chemist.shopName,
        type: 'Retailer',
        contact_person: chemist.contactPerson || chemist.name,
        phone: chemist.phone,
        dl_number: chemist.drugLicenseNumber || 'AS-REG-2026-DL-0000',
        area: chemist.territoryName || 'Silchar',
        district: district,
        address: chemist.location?.address || 'Silchar, Assam',
        latitude: chemist.location?.latitude || null,
        longitude: chemist.location?.longitude || null,
        updated_at: new Date().toISOString(),
      };

      await fetch(`${SUPABASE_CONFIG.url}/rest/v1/firms`, {
        method: 'POST',
        headers: { ...this.getHeaders(), Prefer: 'resolution=merge-duplicates' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('[SupabaseService] saveChemist error:', err);
    }
  }

  public static async updateChemist(id: string, updates: Partial<Chemist>): Promise<void> {
    if (!this.isConnected()) return;
    try {
      const payload: any = { updated_at: new Date().toISOString() };
      if (updates.shopName !== undefined) payload.name = updates.shopName;
      if (updates.contactPerson !== undefined) payload.contact_person = updates.contactPerson;
      if (updates.phone !== undefined) payload.phone = updates.phone;
      if (updates.drugLicenseNumber !== undefined) payload.dl_number = updates.drugLicenseNumber;
      if (updates.location?.address !== undefined) payload.address = updates.location.address;

      await fetch(`${SUPABASE_CONFIG.url}/rest/v1/firms?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('[SupabaseService] updateChemist error:', err);
    }
  }

  public static async deleteChemist(id: string): Promise<void> {
    if (!this.isConnected()) return;
    try {
      await fetch(`${SUPABASE_CONFIG.url}/rest/v1/firms?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
    } catch (err) {
      console.warn('[SupabaseService] deleteChemist error:', err);
    }
  }

  // ==========================================
  // 3. PRODUCTS
  // ==========================================

  public static async fetchProducts(): Promise<Product[]> {
    // Note: If a 'products' table is later added to Supabase, this will fetch from it
    return [];
  }

  public static subscribeProducts(onUpdate: (products: Product[]) => void): () => void {
    return () => {};
  }

  public static async saveProduct(product: Product): Promise<void> {
    // Stored locally in StorageService
  }

  public static async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    // Stored locally in StorageService
  }

  public static async deleteProduct(id: string): Promise<void> {
    // Stored locally in StorageService
  }

  // ==========================================
  // 4. USERS & EMPLOYEES
  // ==========================================

  public static async fetchUsers(): Promise<User[]> {
    if (!this.isConnected()) return [];
    try {
      const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/employees?order=employee_code.asc`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (!res.ok) {
        throw new Error(`Supabase error: ${res.status}`);
      }
      const raw = await res.json();
      return raw.map((e: any) => ({
        id: e.id,
        name: e.name,
        email: e.email || `${e.employee_code?.toLowerCase()}@pharmaassam.com`,
        role: (e.employee_code === 'NLCL-0001' ? 'DIRECTOR' : (e.employee_code === 'NLCL-0002' ? 'HR_MANAGER' : (e.role || 'MEDICAL_REP'))) as UserRole,
        phone: e.phone,
        employeeCode: e.employee_code,
        territoryId: e.active_route_id || 'route-cachar-01',
        territoryName: (e.territory || e.headquarter || 'Silchar').replace(/\bTripura\b/g, 'Agartala, Dharmanagar'),
        isActive: Boolean(e.is_active ?? true),
        password: e.pin || '1234',
        companyId: 'comp-01',
        companyName: 'Pharma Assam Healthcare Pvt Ltd',
      }));
    } catch (err) {
      console.warn('[SupabaseService] fetchUsers error:', err);
      return [];
    }
  }

  public static subscribeUsers(onUpdate: (users: User[]) => void): () => void {
    if (!this.isConnected()) return () => {};
    this.fetchUsers().then(onUpdate).catch(() => {});
    const interval = setInterval(async () => {
      const users = await this.fetchUsers();
      if (users.length > 0) onUpdate(users);
    }, 30000);
    return () => clearInterval(interval);
  }

  public static async saveUser(user: User): Promise<void> {
    if (!this.isConnected()) return;
    try {
      const payload = {
        id: user.id,
        employee_code: user.employeeCode,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        pin: user.password || '1234',
        territory: user.territoryName,
        headquarter: user.territoryName,
        assigned_route_ids: [user.territoryId || 'route-cachar-01'],
        active_route_id: user.territoryId || 'route-cachar-01',
        is_active: user.isActive,
        updated_at: new Date().toISOString(),
      };

      await fetch(`${SUPABASE_CONFIG.url}/rest/v1/employees`, {
        method: 'POST',
        headers: { ...this.getHeaders(), Prefer: 'resolution=merge-duplicates' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('[SupabaseService] saveUser error:', err);
    }
  }

  public static async updateUser(id: string, updates: Partial<User>): Promise<void> {
    if (!this.isConnected()) return;
    try {
      const payload: any = { updated_at: new Date().toISOString() };
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.email !== undefined) payload.email = updates.email;
      if (updates.role !== undefined) payload.role = updates.role;
      if (updates.phone !== undefined) payload.phone = updates.phone;
      if (updates.password !== undefined) payload.pin = updates.password;
      if (updates.employeeCode !== undefined) payload.employee_code = updates.employeeCode;
      if (updates.territoryName !== undefined) {
        payload.territory = updates.territoryName;
        payload.headquarter = updates.territoryName;
      }
      if (updates.isActive !== undefined) payload.is_active = updates.isActive;

      await fetch(`${SUPABASE_CONFIG.url}/rest/v1/employees?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('[SupabaseService] updateUser error:', err);
    }
  }

  public static async deleteUser(id: string): Promise<void> {
    if (!this.isConnected()) return;
    try {
      await fetch(`${SUPABASE_CONFIG.url}/rest/v1/employees?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
    } catch (err) {
      console.warn('[SupabaseService] deleteUser error:', err);
    }
  }

  // ==========================================
  // 5. TERRITORIES
  // ==========================================

  public static async fetchTerritories(): Promise<Territory[]> {
    return [];
  }

  public static subscribeTerritories(onUpdate: (territories: Territory[]) => void): () => void {
    return () => {};
  }

  public static async saveTerritory(terr: Territory): Promise<void> {}
  public static async updateTerritory(id: string, updates: Partial<Territory>): Promise<void> {}
  public static async deleteTerritory(id: string): Promise<void> {}

  // ==========================================
  // 6. DCR LOGS & FIELD VISITS
  // ==========================================

  public static async fetchDCRLogs(): Promise<DCRRecord[]> {
    if (!this.isConnected()) return [];
    try {
      const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/visits?order=timestamp.desc`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (!res.ok) return [];
      const raw = await res.json();
      return raw.map((v: any) => ({
        id: v.id,
        userId: v.employee_id || 'usr-mr-0002',
        userName: v.employee_name || 'Medical Representative',
        date: v.visit_date || (v.timestamp ? v.timestamp.split('T')[0] : new Date().toISOString().split('T')[0]),
        doctorOrChemistId: v.doctor_id || '',
        clientType: 'DOCTOR' as const,
        clientName: v.doctor_name || 'Physician',
        visitType: 'PLANNED' as const,
        checkInTime: v.timestamp ? new Date(v.timestamp).toLocaleTimeString() : '10:00 AM',
        checkInLocation: {
          latitude: v.latitude || 24.8146,
          longitude: v.longitude || 92.8037,
          accuracyMeters: v.distance_meters || 10,
        },
        isGeofenceVerified: Boolean(v.is_geofence_verified),
        distanceFromClinicMeters: v.distance_meters || 0,
        productsDiscussed: [],
        samplesGiven: [],
        status: (v.status === 'APPROVED' ? 'APPROVED' : v.status === 'REJECTED' ? 'REJECTED' : 'SUBMITTED') as 'SUBMITTED' | 'APPROVED' | 'REJECTED',
      }));
    } catch (err) {
      console.warn('[SupabaseService] fetchDCRLogs error:', err);
      return [];
    }
  }

  public static subscribeDCRLogs(onUpdate: (logs: DCRRecord[]) => void): () => void {
    if (!this.isConnected()) return () => {};
    this.fetchDCRLogs().then(onUpdate).catch(() => {});
    const interval = setInterval(async () => {
      const logs = await this.fetchDCRLogs();
      if (logs.length > 0) onUpdate(logs);
    }, 30000);
    return () => clearInterval(interval);
  }

  public static async saveDCRLog(log: DCRRecord): Promise<void> {
    if (!this.isConnected()) return;
    try {
      const payload = {
        id: log.id,
        doctor_id: log.doctorOrChemistId,
        doctor_name: log.clientName,
        employee_id: log.userId || 'usr-mr-0002',
        employee_name: log.userName || 'Medical Representative',
        district: 'Cachar',
        visit_date: log.date,
        timestamp: new Date().toISOString(),
        status: log.status || 'SUBMITTED',
        latitude: log.checkInLocation?.latitude || 24.8146,
        longitude: log.checkInLocation?.longitude || 92.8037,
        is_geofence_verified: Boolean(log.isGeofenceVerified),
        distance_meters: log.distanceFromClinicMeters || 0,
      };

      await fetch(`${SUPABASE_CONFIG.url}/rest/v1/visits`, {
        method: 'POST',
        headers: { ...this.getHeaders(), Prefer: 'resolution=merge-duplicates' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('[SupabaseService] saveDCRLog error:', err);
    }
  }

  // ==========================================
  // 7. DOCTOR DELETION REQUESTS
  // ==========================================

  public static async fetchDeletionRequests(): Promise<DoctorDeletionRequest[]> {
    if (!this.isConnected()) return [];
    try {
      const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/doctor_deletion_requests?order=requested_at.desc`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (!res.ok) return [];
      const raw = await res.json();
      return raw.map((r: any) => ({
        id: r.id,
        doctorId: r.doctor_id,
        doctorName: r.doctor_name,
        reason: r.reason,
        requestedBy: r.requested_by_name || r.requested_by_employee_id,
        requestedAt: r.requested_at || r.created_at,
        status: r.status,
        reviewedBy: r.reviewed_by,
        reviewedAt: r.reviewed_at,
        reviewComment: r.review_comment,
      }));
    } catch (err) {
      console.warn('[SupabaseService] fetchDeletionRequests error:', err);
      return [];
    }
  }

  public static subscribeDeletionRequests(onUpdate: (requests: DoctorDeletionRequest[]) => void): () => void {
    if (!this.isConnected()) return () => {};
    this.fetchDeletionRequests().then(onUpdate).catch(() => {});
    const interval = setInterval(async () => {
      const reqs = await this.fetchDeletionRequests();
      onUpdate(reqs);
    }, 30000);
    return () => clearInterval(interval);
  }

  // ==========================================
  // 8. MASS SYNC
  // ==========================================

  public static async syncAllLocalToCloud(data: {
    doctors: Doctor[];
    chemists: Chemist[];
    products: Product[];
    users: User[];
    companies: Company[];
    territories: Territory[];
    dcrLogs: DCRRecord[];
  }): Promise<{ success: boolean; message: string }> {
    if (!this.isConnected()) {
      return { success: false, message: 'Supabase Database is not configured.' };
    }

    try {
      for (const d of data.doctors) {
        await this.saveDoctor(d);
      }
      for (const c of data.chemists) {
        await this.saveChemist(c);
      }
      for (const u of data.users) {
        await this.saveUser(u);
      }

      return {
        success: true,
        message: `Successfully synchronized ${data.doctors.length} Doctors, ${data.chemists.length} Firms/Chemists, and ${data.users.length} Users with Supabase Database!`,
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Supabase sync error: ${err?.message || 'Failed to upload records'}`,
      };
    }
  }
}

// Backward compatibility alias so existing components don't break during transition
export { SupabaseService as FirestoreService };
