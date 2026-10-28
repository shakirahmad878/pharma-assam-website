/**
 * RepPulse Supabase Serverless PostgreSQL Database Service
 * -----------------------------------------------------------
 * High-performance, offline-resilient PostgreSQL driver for:
 * - Doctors Directory (with geofence GPS, tiers, targets)
 * - Employees & Team Management (with division isolation & PINs)
 * - Registered Firms & Stockists
 * - Attendance Logs & Selfie Verification
 * - Field Visits & DCR Reports
 */

import { SUPABASE_CONFIG, isSupabaseConfigured } from '../../config/supabase';
import { Doctor, UserProfile, AttendanceRecord, VisitRecord, LateLoginRequest, TourPlanRescheduleRequest } from '../../types';
import { StorageService, STORAGE_KEYS } from '../storageService';

export interface FirmRecord {
  id: string;
  name: string;
  type: 'Retailer' | 'Distributor' | 'Stockist';
  contactPerson?: string;
  phone?: string;
  dlNumber?: string;
  area: string;
  district: string;
  address?: string;
}

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

export class SupabaseDbService {
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
    if (!this.isConnected()) {
      return await StorageService.getItem<Doctor[]>(STORAGE_KEYS.DOCTORS_CACHE, []);
    }

    try {
      const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/doctors?order=name.asc`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!res.ok) {
        throw new Error(`Supabase error: ${res.status} ${await res.text()}`);
      }

      const raw = await res.json();
      const doctors: Doctor[] = raw.map((d: any) => ({
        id: d.id,
        name: d.name,
        specialty: d.specialty || 'General Physician',
        qualification: d.qualification || 'MBBS',
        clinicName: d.clinic_name || '',
        clinicAddress: d.clinic_address || '',
        area: d.area || '',
        district: d.district || 'Cachar',
        phone: d.phone || '',
        tier: d.tier || 'A',
        monthlyVisitTarget: d.monthly_visit_target ?? 8,
        completedVisitsThisMonth: d.completed_visits_this_month ?? 0,
        todayVisitStatus: d.today_visit_status || 'PENDING',
        lastVisitDate: d.last_visit_date || null,
        routeId: d.route_id || 'route-cachar-01',
        latitude: d.latitude || 24.8215,
        longitude: d.longitude || 92.7970,
        geofenceRadiusMeters: d.geofence_radius_meters || 100,
        isAssignedToMe: Boolean(d.is_assigned_to_me),
        assignedToEmployeeId: d.assigned_employee_id || undefined,
        assignedToEmployeeName: d.assigned_employee_name || undefined,
        clinics: d.clinics && Array.isArray(d.clinics) && d.clinics.length > 0
          ? d.clinics
          : (d.clinic_name ? [{
              id: 'clinic-primary',
              name: d.clinic_name,
              address: d.clinic_address || '',
              area: d.area || '',
              latitude: d.latitude || 24.8215,
              longitude: d.longitude || 92.7970,
              isPrimary: true
            }] : []),
      }));

      await StorageService.setItem(STORAGE_KEYS.DOCTORS_CACHE, doctors);
      return doctors;
    } catch (err) {
      console.warn('[Supabase] fetchDoctors error, using local cache:', err);
      return await StorageService.getItem<Doctor[]>(STORAGE_KEYS.DOCTORS_CACHE, []);
    }
  }

  public static async addDoctor(doc: Doctor): Promise<void> {
    const cached = await StorageService.getItem<Doctor[]>(STORAGE_KEYS.DOCTORS_CACHE, []);
    await StorageService.setItem(STORAGE_KEYS.DOCTORS_CACHE, [doc, ...cached.filter((d) => d.id !== doc.id)]);

    if (!this.isConnected()) return;

    try {
      await fetch(`${SUPABASE_CONFIG.url}/rest/v1/doctors`, {
        method: 'POST',
        headers: { ...this.getHeaders(), Prefer: 'resolution=merge-duplicates' },
        body: JSON.stringify({
          id: doc.id,
          name: doc.name,
          specialty: doc.specialty,
          qualification: doc.qualification,
          clinic_name: doc.clinicName,
          clinic_address: doc.clinicAddress,
          area: doc.area,
          district: doc.district,
          phone: doc.phone,
          tier: doc.tier,
          monthly_visit_target: doc.monthlyVisitTarget,
          completed_visits_this_month: doc.completedVisitsThisMonth || 0,
          today_visit_status: doc.todayVisitStatus || 'PENDING',
          last_visit_date: doc.lastVisitDate,
          route_id: doc.routeId,
          latitude: doc.latitude,
          longitude: doc.longitude,
          geofence_radius_meters: doc.geofenceRadiusMeters || 100,
          is_assigned_to_me: Boolean(doc.isAssignedToMe),
          assigned_employee_id: doc.assignedToEmployeeId || null,
          assigned_employee_name: doc.assignedToEmployeeName || null,
          clinics: doc.clinics || [],
          updated_at: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.warn('[Supabase] addDoctor error:', err);
    }
  }

  public static async updateDoctor(id: string, updates: Partial<Doctor>): Promise<void> {
    const cached = await StorageService.getItem<Doctor[]>(STORAGE_KEYS.DOCTORS_CACHE, []);
    const updated = cached.map((d) => (d.id === id ? { ...d, ...updates } : d));
    await StorageService.setItem(STORAGE_KEYS.DOCTORS_CACHE, updated);

    if (!this.isConnected()) return;

    const payload: any = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.specialty !== undefined) payload.specialty = updates.specialty;
    if (updates.qualification !== undefined) payload.qualification = updates.qualification;
    if (updates.clinicName !== undefined) payload.clinic_name = updates.clinicName;
    if (updates.clinicAddress !== undefined) payload.clinic_address = updates.clinicAddress;
    if (updates.area !== undefined) payload.area = updates.area;
    if (updates.district !== undefined) payload.district = updates.district;
    if (updates.phone !== undefined) payload.phone = updates.phone;
    if (updates.tier !== undefined) payload.tier = updates.tier;
    if (updates.monthlyVisitTarget !== undefined) payload.monthly_visit_target = updates.monthlyVisitTarget;
    if (updates.completedVisitsThisMonth !== undefined) payload.completed_visits_this_month = updates.completedVisitsThisMonth;
    if (updates.todayVisitStatus !== undefined) payload.today_visit_status = updates.todayVisitStatus;
    if (updates.lastVisitDate !== undefined) payload.last_visit_date = updates.lastVisitDate;
    if (updates.routeId !== undefined) payload.route_id = updates.routeId;
    if (updates.latitude !== undefined) payload.latitude = updates.latitude;
    if (updates.longitude !== undefined) payload.longitude = updates.longitude;
    if (updates.geofenceRadiusMeters !== undefined) payload.geofence_radius_meters = updates.geofenceRadiusMeters;
    if (updates.assignedToEmployeeId !== undefined) payload.assigned_employee_id = updates.assignedToEmployeeId;
    if (updates.assignedToEmployeeName !== undefined) payload.assigned_employee_name = updates.assignedToEmployeeName;
    if (updates.clinics !== undefined) payload.clinics = updates.clinics;

    try {
      await fetch(`${SUPABASE_CONFIG.url}/rest/v1/doctors?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('[Supabase] updateDoctor error:', err);
    }
  }

  public static async deleteDoctor(id: string): Promise<void> {
    const cached = await StorageService.getItem<Doctor[]>(STORAGE_KEYS.DOCTORS_CACHE, []);
    await StorageService.setItem(STORAGE_KEYS.DOCTORS_CACHE, cached.filter((d) => d.id !== id));

    if (!this.isConnected()) return;

    try {
      await fetch(`${SUPABASE_CONFIG.url}/rest/v1/doctors?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
    } catch (err) {
      console.warn('[Supabase] deleteDoctor error:', err);
    }
  }

  public static async submitDeletionRequest(req: {
    doctorId: string;
    doctorName: string;
    reason: string;
    requestedBy: string;
    district?: string;
  }): Promise<string> {
    const id = `del_req_${Date.now()}`;
    if (!this.isConnected()) return id;

    try {
      await fetch(`${SUPABASE_CONFIG.url}/rest/v1/doctor_deletion_requests`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          id,
          doctor_id: req.doctorId,
          doctor_name: req.doctorName,
          requested_by_employee_id: 'usr-nlcl-0004',
          requested_by_name: req.requestedBy,
          district: req.district || 'Cachar',
          reason: req.reason,
          status: 'PENDING',
        }),
      });
    } catch (err) {
      console.warn('[Supabase] submitDeletionRequest error:', err);
    }
    return id;
  }

  public static async getPendingDeletionRequests(): Promise<DoctorDeletionRequest[]> {
    const cached = await StorageService.getItem<DoctorDeletionRequest[]>(STORAGE_KEYS.DOCTOR_DELETE_REQUESTS, []);
    if (!this.isConnected()) return cached;

    try {
      const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/doctor_deletion_requests?status=eq.PENDING&order=requested_at.desc`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (res.ok) {
        const raw = await res.json();
        const reqs: DoctorDeletionRequest[] = raw.map((r: any) => ({
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
        await StorageService.setItem(STORAGE_KEYS.DOCTOR_DELETE_REQUESTS, reqs);
        return reqs;
      }
    } catch (err) {
      console.warn('[Supabase] getPendingDeletionRequests error:', err);
    }
    return cached;
  }

  public static async approveDeletionRequest(
    requestId: string,
    doctorId: string,
    managerName = 'Bodrud Jaman Sadiol (RSM)'
  ): Promise<void> {
    await this.deleteDoctor(doctorId);

    const cached = await StorageService.getItem<DoctorDeletionRequest[]>(STORAGE_KEYS.DOCTOR_DELETE_REQUESTS, []);
    const updated = cached.map((r) =>
      r.id === requestId
        ? { ...r, status: 'APPROVED' as const, reviewedBy: managerName, reviewedAt: new Date().toISOString() }
        : r
    );
    await StorageService.setItem(STORAGE_KEYS.DOCTOR_DELETE_REQUESTS, updated);

    if (!this.isConnected()) return;

    try {
      await fetch(`${SUPABASE_CONFIG.url}/rest/v1/doctor_deletion_requests?id=eq.${encodeURIComponent(requestId)}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({
          status: 'APPROVED',
          reviewed_by: managerName,
          reviewed_at: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.warn('[Supabase] approveDeletionRequest error:', err);
    }
  }

  public static async rejectDeletionRequest(
    requestId: string,
    managerName = 'Bodrud Jaman Sadiol (RSM)'
  ): Promise<void> {
    const cached = await StorageService.getItem<DoctorDeletionRequest[]>(STORAGE_KEYS.DOCTOR_DELETE_REQUESTS, []);
    const updated = cached.map((r) =>
      r.id === requestId
        ? { ...r, status: 'REJECTED' as const, reviewedBy: managerName, reviewedAt: new Date().toISOString() }
        : r
    );
    await StorageService.setItem(STORAGE_KEYS.DOCTOR_DELETE_REQUESTS, updated);

    if (!this.isConnected()) return;

    try {
      await fetch(`${SUPABASE_CONFIG.url}/rest/v1/doctor_deletion_requests?id=eq.${encodeURIComponent(requestId)}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({
          status: 'REJECTED',
          reviewed_by: managerName,
          reviewed_at: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.warn('[Supabase] rejectDeletionRequest error:', err);
    }
  }

  // ==========================================
  // 2. EMPLOYEES & TEAM DIRECTORY
  // ==========================================

  public static async fetchEmployees(): Promise<UserProfile[]> {
    const EMP_STORAGE_KEY = '@REPPULSE_ALL_EMPLOYEES_V2';
    if (!this.isConnected()) {
      return await StorageService.getItem<UserProfile[]>(EMP_STORAGE_KEY, []);
    }

    try {
      const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/employees?order=employee_code.asc`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!res.ok) {
        throw new Error(`Supabase error: ${res.status}`);
      }

      const raw = await res.json();
      const employees: UserProfile[] = raw.map((e: any) => {
        let normalizedRole = e.role;
        if (e.employee_code === 'NLCL-0001' || (e.name && e.name.toLowerCase().includes('samsuj'))) {
          normalizedRole = 'DIRECTOR';
        } else if (e.employee_code === 'NLCL-0002' || (e.name && e.name.toLowerCase().includes('shakir'))) {
          normalizedRole = 'HR_MANAGER';
        } else if (e.employee_code === 'NLCL-0003' || (e.name && e.name.toLowerCase().includes('bodrud'))) {
          normalizedRole = 'REGIONAL_MANAGER';
        }

        const territory = (e.territory || '').replace('Tripura', 'Agartala, Dharmanagar');

        return {
          id: e.id,
          employeeCode: e.employee_code,
          name: e.name,
          email: e.email,
          role: normalizedRole,
          phone: e.phone,
          pin: e.pin || '',
          territory: territory,
          headquarter: e.headquarter,
          assignedRouteIds: e.assigned_route_ids || [],
          activeRouteId: e.active_route_id || 'route-cachar-01',
        };
      });

      await StorageService.setItem(EMP_STORAGE_KEY, employees);
      return employees;
    } catch (err) {
      console.warn('[Supabase] fetchEmployees error, using cache:', err);
      return await StorageService.getItem<UserProfile[]>(EMP_STORAGE_KEY, []);
    }
  }

  public static async fetchServerTime(): Promise<Date> {
    if (!this.isConnected()) return new Date();
    try {
      const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/`, {
        method: 'HEAD',
        headers: { apikey: SUPABASE_CONFIG.apiKey },
      });
      const serverDateHeader = res.headers.get('date');
      if (serverDateHeader) {
        const parsed = new Date(serverDateHeader);
        if (!isNaN(parsed.getTime())) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('[Supabase] fetchServerTime error, using local fallback:', err);
    }
    return new Date();
  }

  public static async addEmployee(emp: UserProfile): Promise<void> {
    if (!this.isConnected()) return;

    try {
      await fetch(`${SUPABASE_CONFIG.url}/rest/v1/employees`, {
        method: 'POST',
        headers: { ...this.getHeaders(), Prefer: 'resolution=merge-duplicates' },
        body: JSON.stringify({
          id: emp.id,
          employee_code: emp.employeeCode,
          name: emp.name,
          email: emp.email,
          role: emp.role,
          phone: emp.phone,
          pin: emp.pin || '1234',
          territory: emp.territory,
          headquarter: emp.headquarter,
          assigned_route_ids: emp.assignedRouteIds || [],
          active_route_id: emp.activeRouteId || 'route-cachar-01',
          is_active: true,
          updated_at: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.warn('[Supabase] addEmployee error:', err);
    }
  }

  public static async updateEmployeePin(employeeCodeOrId: string, newPin: string): Promise<boolean> {
    const rawKey = (employeeCodeOrId || '').trim();
    if (!this.isConnected() || !rawKey) return false;
    try {
      const cleanDigits = rawKey.replace(/\D/g, '');
      const filter = cleanDigits.length === 10
        ? `or=(phone.eq.${cleanDigits},employee_code.ilike.${encodeURIComponent(rawKey)})`
        : `or=(employee_code.ilike.${encodeURIComponent(rawKey)},id.eq.${encodeURIComponent(rawKey)})`;

      const res = await fetch(
        `${SUPABASE_CONFIG.url}/rest/v1/employees?${filter}`,
        {
          method: 'PATCH',
          headers: this.getHeaders(),
          body: JSON.stringify({
            pin: newPin,
            updated_at: new Date().toISOString(),
          }),
        }
      );
      return res.ok;
    } catch (err) {
      console.warn('[Supabase] updateEmployeePin error:', err);
      return false;
    }
  }

  public static async updateEmployee(id: string, updates: Partial<UserProfile>): Promise<void> {
    if (!this.isConnected()) return;

    const payload: any = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.email !== undefined) payload.email = updates.email;
    if (updates.role !== undefined) payload.role = updates.role;
    if (updates.phone !== undefined) payload.phone = updates.phone;
    if (updates.pin !== undefined) payload.pin = updates.pin;
    if (updates.territory !== undefined) payload.territory = updates.territory;
    if (updates.headquarter !== undefined) payload.headquarter = updates.headquarter;
    if (updates.employeeCode !== undefined) payload.employee_code = updates.employeeCode;

    try {
      await fetch(`${SUPABASE_CONFIG.url}/rest/v1/employees?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('[Supabase] updateEmployee error:', err);
    }
  }

  public static async deleteEmployee(id: string): Promise<void> {
    if (!this.isConnected()) return;

    try {
      await fetch(`${SUPABASE_CONFIG.url}/rest/v1/employees?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
    } catch (err) {
      console.warn('[Supabase] deleteEmployee error:', err);
    }
  }

  // ==========================================
  // 3. FIRMS & STOCKISTS
  // ==========================================

  public static async fetchFirms(): Promise<FirmRecord[]> {
    if (!this.isConnected()) {
      return await StorageService.getItem<FirmRecord[]>(STORAGE_KEYS.FIRMS_CACHE, []);
    }

    try {
      const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/firms?order=name.asc`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!res.ok) {
        throw new Error(`Supabase error: ${res.status}`);
      }

      const raw = await res.json();
      const firms: FirmRecord[] = raw.map((f: any) => ({
        id: f.id,
        name: f.name,
        type: f.type,
        contactPerson: f.contact_person,
        phone: f.phone,
        dlNumber: f.dl_number,
        area: f.area,
        district: f.district,
        address: f.address,
      }));

      await StorageService.setItem(STORAGE_KEYS.FIRMS_CACHE, firms);
      return firms;
    } catch (err) {
      console.warn('[Supabase] fetchFirms error, using cache:', err);
      return await StorageService.getItem<FirmRecord[]>(STORAGE_KEYS.FIRMS_CACHE, []);
    }
  }

  public static async addFirm(firm: FirmRecord): Promise<void> {
    const cached = await StorageService.getItem<FirmRecord[]>(STORAGE_KEYS.FIRMS_CACHE, []);
    await StorageService.setItem(STORAGE_KEYS.FIRMS_CACHE, [firm, ...cached.filter((f) => f.id !== firm.id)]);

    if (!this.isConnected()) return;

    try {
      await fetch(`${SUPABASE_CONFIG.url}/rest/v1/firms`, {
        method: 'POST',
        headers: { ...this.getHeaders(), Prefer: 'resolution=merge-duplicates' },
        body: JSON.stringify({
          id: firm.id,
          name: firm.name,
          type: firm.type,
          contact_person: firm.contactPerson,
          phone: firm.phone,
          dl_number: firm.dlNumber,
          area: firm.area,
          district: firm.district,
          address: firm.address,
          updated_at: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.warn('[Supabase] addFirm error:', err);
    }
  }

  // ==========================================
  // 4. ATTENDANCE & PUNCH-IN LOGS
  // ==========================================

  public static async recordAttendance(att: AttendanceRecord): Promise<void> {
    const list = await StorageService.getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE_LOCAL, []);
    await StorageService.setItem(STORAGE_KEYS.ATTENDANCE_LOCAL, [att, ...list.filter((a) => a.id !== att.id)]);

    if (!this.isConnected()) return;

    try {
      await fetch(`${SUPABASE_CONFIG.url}/rest/v1/attendance`, {
        method: 'POST',
        headers: { ...this.getHeaders(), Prefer: 'resolution=merge-duplicates' },
        body: JSON.stringify({
          id: att.id,
          employee_id: att.employeeId,
          employee_name: att.employeeName,
          date: att.date,
          punch_in_timestamp: att.punchInTimestamp,
          punch_out_timestamp: att.punchOutTimestamp || null,
          status: att.status || 'PUNCHED_IN',
          route_id: att.routeId || null,
          route_name: att.routeName || null,
          latitude: att.latitude,
          longitude: att.longitude,
          accuracy_meters: att.accuracyMeters,
          is_mock_location: att.isMockLocation || false,
          battery_percentage: att.batteryPercentage || null,
          selfie_url: att.selfieBase64OrUri || null,
          sync_status: 'SYNCED',
          server_id: att.serverId || null,
        }),
      });
    } catch (err) {
      console.warn('[Supabase] recordAttendance error:', err);
    }
  }

  // ==========================================
  // 5. VISITS / DCR RECORDS
  // ==========================================

  public static async recordVisit(v: VisitRecord): Promise<void> {
    if (!this.isConnected()) return;

    try {
      const visitDate = v.date || (v.checkInTimestamp ? v.checkInTimestamp.split('T')[0] : new Date().toISOString().split('T')[0]);
      await fetch(`${SUPABASE_CONFIG.url}/rest/v1/visits`, {
        method: 'POST',
        headers: { ...this.getHeaders(), Prefer: 'resolution=merge-duplicates' },
        body: JSON.stringify({
          id: v.id,
          doctor_id: v.doctorId,
          doctor_name: v.doctorName,
          employee_id: v.employeeId || 'usr-nlcl-0004',
          employee_name: v.employeeName || 'Pranjal Malakar',
          district: 'Cachar',
          visit_date: visitDate,
          timestamp: v.checkInTimestamp || new Date().toISOString(),
          status: v.status || 'COMPLETED',
          latitude: v.checkInLatitude,
          longitude: v.checkInLongitude,
          is_geofence_verified: v.isGeofenceVerified ?? true,
          distance_meters: v.checkInDistanceMeters ?? 0,
          notes: v.doctorFeedback || v.discussionNotes || '',
          products_discussed: v.productsDiscussed || [],
          samples_given: v.samplesDistributed || [],
        }),
      });
    } catch (err) {
      console.warn('[Supabase] recordVisit error:', err);
    }
  }

  // ==========================================
  // 6. LATE LOGIN REQUESTS (10:30 AM Cutoff)
  // ==========================================

  public static async submitLateLoginRequest(req: LateLoginRequest): Promise<LateLoginRequest> {
    // 1. Save locally first for instant offline resilience
    const localList = await StorageService.getItem<LateLoginRequest[]>(STORAGE_KEYS.LATE_LOGIN_REQUESTS, []);
    const updated = [req, ...localList.filter(r => r.id !== req.id)];
    await StorageService.setItem(STORAGE_KEYS.LATE_LOGIN_REQUESTS, updated);

    // 2. Sync to Supabase
    if (this.isConnected()) {
      try {
        await fetch(`${SUPABASE_CONFIG.url}/rest/v1/late_login_requests`, {
          method: 'POST',
          headers: { ...this.getHeaders(), Prefer: 'resolution=merge-duplicates' },
          body: JSON.stringify({
            id: req.id,
            employee_id: req.employeeId,
            employee_name: req.employeeName,
            employee_code: req.employeeCode,
            date: req.date,
            attempted_time: req.attemptedTime,
            reason: req.reason,
            status: req.status,
            reviewed_by: req.reviewedBy || null,
            reviewed_at: req.reviewedAt || null,
            created_at: req.createdAt,
            updated_at: req.updatedAt,
          }),
        });
      } catch (err) {
        console.warn('[Supabase] submitLateLoginRequest error:', err);
      }
    }
    return req;
  }

  public static async getPendingLateLoginRequests(): Promise<LateLoginRequest[]> {
    let requests: LateLoginRequest[] = [];
    if (this.isConnected()) {
      try {
        const res = await fetch(
          `${SUPABASE_CONFIG.url}/rest/v1/late_login_requests?status=eq.PENDING&order=created_at.desc`,
          {
            method: 'GET',
            headers: this.getHeaders(),
          }
        );
        if (res.ok) {
          const raw = await res.json();
          requests = raw.map((r: any) => ({
            id: r.id,
            employeeId: r.employee_id,
            employeeName: r.employee_name,
            employeeCode: r.employee_code,
            date: r.date,
            attemptedTime: r.attempted_time,
            reason: r.reason,
            status: r.status,
            reviewedBy: r.reviewed_by,
            reviewedAt: r.reviewed_at,
            createdAt: r.created_at,
            updatedAt: r.updated_at,
          }));
        }
      } catch (err) {
        console.warn('[Supabase] getPendingLateLoginRequests error:', err);
      }
    }

    const localList = await StorageService.getItem<LateLoginRequest[]>(STORAGE_KEYS.LATE_LOGIN_REQUESTS, []);
    const mergedMap = new Map<string, LateLoginRequest>();
    localList.forEach(r => mergedMap.set(r.id, r));
    requests.forEach(r => mergedMap.set(r.id, r));
    const all = Array.from(mergedMap.values());
    await StorageService.setItem(STORAGE_KEYS.LATE_LOGIN_REQUESTS, all);
    return all.filter(r => r.status === 'PENDING');
  }

  public static async getAllLateLoginRequests(): Promise<LateLoginRequest[]> {
    let requests: LateLoginRequest[] = [];
    if (this.isConnected()) {
      try {
        const res = await fetch(
          `${SUPABASE_CONFIG.url}/rest/v1/late_login_requests?order=created_at.desc`,
          {
            method: 'GET',
            headers: this.getHeaders(),
          }
        );
        if (res.ok) {
          const raw = await res.json();
          requests = raw.map((r: any) => ({
            id: r.id,
            employeeId: r.employee_id,
            employeeName: r.employee_name,
            employeeCode: r.employee_code,
            date: r.date,
            attemptedTime: r.attempted_time,
            reason: r.reason,
            status: r.status,
            reviewedBy: r.reviewed_by,
            reviewedAt: r.reviewed_at,
            createdAt: r.created_at,
            updatedAt: r.updated_at,
          }));
        }
      } catch (err) {
        console.warn('[Supabase] getAllLateLoginRequests error:', err);
      }
    }

    const localList = await StorageService.getItem<LateLoginRequest[]>(STORAGE_KEYS.LATE_LOGIN_REQUESTS, []);
    const mergedMap = new Map<string, LateLoginRequest>();
    localList.forEach(r => mergedMap.set(r.id, r));
    requests.forEach(r => mergedMap.set(r.id, r));
    const all = Array.from(mergedMap.values());
    await StorageService.setItem(STORAGE_KEYS.LATE_LOGIN_REQUESTS, all);
    return all;
  }

  public static async updateLateLoginStatus(
    requestId: string,
    status: 'APPROVED' | 'REJECTED',
    reviewerName = 'Bodrud Jaman Sadiol (RSM)'
  ): Promise<boolean> {
    const reviewedAt = new Date().toISOString();
    // 1. Update local cache
    const localList = await StorageService.getItem<LateLoginRequest[]>(STORAGE_KEYS.LATE_LOGIN_REQUESTS, []);
    let updatedReq: LateLoginRequest | undefined;
    const updated = localList.map(r => {
      if (r.id === requestId) {
        updatedReq = { ...r, status, reviewedBy: reviewerName, reviewedAt, updatedAt: reviewedAt };
        return updatedReq;
      }
      return r;
    });
    await StorageService.setItem(STORAGE_KEYS.LATE_LOGIN_REQUESTS, updated);

    // If approved, also store in active late login approval key
    if (status === 'APPROVED' && updatedReq) {
      await StorageService.setItem(STORAGE_KEYS.LATE_LOGIN_APPROVAL, {
        date: updatedReq.date,
        isApproved: true,
        approvedBy: reviewerName,
        reason: updatedReq.reason,
        timestamp: reviewedAt,
      });
    }

    // 2. Supabase
    if (this.isConnected()) {
      try {
        await fetch(`${SUPABASE_CONFIG.url}/rest/v1/late_login_requests?id=eq.${encodeURIComponent(requestId)}`, {
          method: 'PATCH',
          headers: this.getHeaders(),
          body: JSON.stringify({
            status,
            reviewed_by: reviewerName,
            reviewed_at: reviewedAt,
            updated_at: reviewedAt,
          }),
        });
      } catch (err) {
        console.warn('[Supabase] updateLateLoginStatus error:', err);
      }
    }
    return true;
  }

  public static async checkTodayLateLoginApproval(
    employeeCode: string,
    dateStr: string
  ): Promise<LateLoginRequest | null> {
    const cleanCode = (employeeCode || '').trim().toLowerCase();

    // Check Supabase first if online
    if (this.isConnected()) {
      try {
        const res = await fetch(
          `${SUPABASE_CONFIG.url}/rest/v1/late_login_requests?employee_code=eq.${encodeURIComponent(cleanCode)}&date=eq.${encodeURIComponent(dateStr)}&status=eq.APPROVED&limit=1`,
          {
            method: 'GET',
            headers: this.getHeaders(),
          }
        );
        if (res.ok) {
          const raw = await res.json();
          if (raw && raw.length > 0) {
            const r = raw[0];
            const found: LateLoginRequest = {
              id: r.id,
              employeeId: r.employee_id,
              employeeName: r.employee_name,
              employeeCode: r.employee_code,
              date: r.date,
              attemptedTime: r.attempted_time,
              reason: r.reason,
              status: r.status,
              reviewedBy: r.reviewed_by,
              reviewedAt: r.reviewed_at,
              createdAt: r.created_at,
              updatedAt: r.updated_at,
            };
            return found;
          }
        }
      } catch (err) {
        console.warn('[Supabase] checkTodayLateLoginApproval error:', err);
      }
    }

    // Fallback to local storage
    const localList = await StorageService.getItem<LateLoginRequest[]>(STORAGE_KEYS.LATE_LOGIN_REQUESTS, []);
    const match = localList.find(
      r => r.employeeCode.toLowerCase() === cleanCode && r.date === dateStr && r.status === 'APPROVED'
    );
    return match || null;
  }

  // ==========================================
  // 7. TOUR PLAN RESCHEDULE REQUESTS
  // ==========================================

  public static async submitRescheduleRequest(
    req: TourPlanRescheduleRequest
  ): Promise<TourPlanRescheduleRequest> {
    // 1. Save locally
    const localList = await StorageService.getItem<TourPlanRescheduleRequest[]>(
      STORAGE_KEYS.TOUR_PLAN_RESCHEDULES,
      []
    );
    const updated = [req, ...localList.filter(r => r.id !== req.id)];
    await StorageService.setItem(STORAGE_KEYS.TOUR_PLAN_RESCHEDULES, updated);

    // 2. Supabase
    if (this.isConnected()) {
      try {
        await fetch(`${SUPABASE_CONFIG.url}/rest/v1/tour_plan_reschedule_requests`, {
          method: 'POST',
          headers: { ...this.getHeaders(), Prefer: 'resolution=merge-duplicates' },
          body: JSON.stringify({
            id: req.id,
            employee_id: req.employeeId,
            employee_name: req.employeeName,
            employee_code: req.employeeCode,
            original_date: req.originalDate,
            new_date: req.newDate,
            route_or_city: req.routeOrCity,
            reason: req.reason,
            status: req.status,
            reviewed_by: req.reviewedBy || null,
            reviewed_at: req.reviewedAt || null,
            created_at: req.createdAt,
            updated_at: req.updatedAt,
          }),
        });
      } catch (err) {
        console.warn('[Supabase] submitRescheduleRequest error:', err);
      }
    }
    return req;
  }

  public static async getPendingRescheduleRequests(): Promise<TourPlanRescheduleRequest[]> {
    let requests: TourPlanRescheduleRequest[] = [];
    if (this.isConnected()) {
      try {
        const res = await fetch(
          `${SUPABASE_CONFIG.url}/rest/v1/tour_plan_reschedule_requests?status=eq.PENDING&order=created_at.desc`,
          {
            method: 'GET',
            headers: this.getHeaders(),
          }
        );
        if (res.ok) {
          const raw = await res.json();
          requests = raw.map((r: any) => ({
            id: r.id,
            employeeId: r.employee_id,
            employeeName: r.employee_name,
            employeeCode: r.employee_code,
            originalDate: r.original_date,
            newDate: r.new_date,
            routeOrCity: r.route_or_city,
            reason: r.reason,
            status: r.status,
            reviewedBy: r.reviewed_by,
            reviewedAt: r.reviewed_at,
            createdAt: r.created_at,
            updatedAt: r.updated_at,
          }));
        }
      } catch (err) {
        console.warn('[Supabase] getPendingRescheduleRequests error:', err);
      }
    }

    const localList = await StorageService.getItem<TourPlanRescheduleRequest[]>(
      STORAGE_KEYS.TOUR_PLAN_RESCHEDULES,
      []
    );
    const mergedMap = new Map<string, TourPlanRescheduleRequest>();
    localList.forEach(r => mergedMap.set(r.id, r));
    requests.forEach(r => mergedMap.set(r.id, r));
    const all = Array.from(mergedMap.values());
    await StorageService.setItem(STORAGE_KEYS.TOUR_PLAN_RESCHEDULES, all);
    return all.filter(r => r.status === 'PENDING');
  }

  public static async getAllRescheduleRequests(): Promise<TourPlanRescheduleRequest[]> {
    let requests: TourPlanRescheduleRequest[] = [];
    if (this.isConnected()) {
      try {
        const res = await fetch(
          `${SUPABASE_CONFIG.url}/rest/v1/tour_plan_reschedule_requests?order=created_at.desc`,
          {
            method: 'GET',
            headers: this.getHeaders(),
          }
        );
        if (res.ok) {
          const raw = await res.json();
          requests = raw.map((r: any) => ({
            id: r.id,
            employeeId: r.employee_id,
            employeeName: r.employee_name,
            employeeCode: r.employee_code,
            originalDate: r.original_date,
            newDate: r.new_date,
            routeOrCity: r.route_or_city,
            reason: r.reason,
            status: r.status,
            reviewedBy: r.reviewed_by,
            reviewedAt: r.reviewed_at,
            createdAt: r.created_at,
            updatedAt: r.updated_at,
          }));
        }
      } catch (err) {
        console.warn('[Supabase] getAllRescheduleRequests error:', err);
      }
    }

    const localList = await StorageService.getItem<TourPlanRescheduleRequest[]>(
      STORAGE_KEYS.TOUR_PLAN_RESCHEDULES,
      []
    );
    const mergedMap = new Map<string, TourPlanRescheduleRequest>();
    localList.forEach(r => mergedMap.set(r.id, r));
    requests.forEach(r => mergedMap.set(r.id, r));
    const all = Array.from(mergedMap.values());
    await StorageService.setItem(STORAGE_KEYS.TOUR_PLAN_RESCHEDULES, all);
    return all;
  }

  public static async updateRescheduleStatus(
    requestId: string,
    status: 'APPROVED' | 'REJECTED',
    reviewerName = 'Bodrud Jaman Sadiol (RSM)'
  ): Promise<boolean> {
    const reviewedAt = new Date().toISOString();
    // 1. Update local cache
    const localList = await StorageService.getItem<TourPlanRescheduleRequest[]>(
      STORAGE_KEYS.TOUR_PLAN_RESCHEDULES,
      []
    );
    let targetReq: TourPlanRescheduleRequest | undefined;
    const updated = localList.map(r => {
      if (r.id === requestId) {
        targetReq = { ...r, status, reviewedBy: reviewerName, reviewedAt, updatedAt: reviewedAt };
        return targetReq;
      }
      return r;
    });
    await StorageService.setItem(STORAGE_KEYS.TOUR_PLAN_RESCHEDULES, updated);

    // 2. If approved, apply the reschedule to the tour plan!
    if (status === 'APPROVED' && targetReq) {
      await this.applyApprovedRescheduleToTourPlan(targetReq);
    }

    // 3. Supabase
    if (this.isConnected()) {
      try {
        await fetch(`${SUPABASE_CONFIG.url}/rest/v1/tour_plan_reschedule_requests?id=eq.${encodeURIComponent(requestId)}`, {
          method: 'PATCH',
          headers: this.getHeaders(),
          body: JSON.stringify({
            status,
            reviewed_by: reviewerName,
            reviewed_at: reviewedAt,
            updated_at: reviewedAt,
          }),
        });
      } catch (err) {
        console.warn('[Supabase] updateRescheduleStatus error:', err);
      }
    }
    return true;
  }

  public static async getEmployeeRescheduleRequests(
    employeeCode: string
  ): Promise<TourPlanRescheduleRequest[]> {
    const all = await this.getAllRescheduleRequests();
    const clean = (employeeCode || '').trim().toLowerCase();
    return all.filter(r => r.employeeCode.toLowerCase() === clean);
  }

  /**
   * When RSM approves a reschedule, actually move the beat from original_date to new_date!
   */
  private static async applyApprovedRescheduleToTourPlan(req: TourPlanRescheduleRequest): Promise<void> {
    try {
      const tourPlansKey = `${STORAGE_KEYS.TOUR_PLANS_CACHE}_${req.employeeCode}`;
      const savedPlans = await StorageService.getItem<Record<string, any>>(tourPlansKey, {});
      
      // Move beat:
      // Keep record of original beat before moving
      const originalBeat = savedPlans[req.originalDate] || { city: req.routeOrCity, type: 'TOUR' };
      
      // Update original date to show rescheduled/free or note
      savedPlans[req.originalDate] = {
        ...originalBeat,
        city: `${originalBeat.city || req.routeOrCity} (Rescheduled to ${req.newDate})`,
        type: 'RESCHEDULED',
        rescheduledTo: req.newDate,
      };

      // Set new date with the rescheduled beat
      savedPlans[req.newDate] = {
        city: req.routeOrCity,
        type: 'TOUR',
        rescheduledFrom: req.originalDate,
      };

      await StorageService.setItem(tourPlansKey, savedPlans);
    } catch (err) {
      console.warn('[Supabase] applyApprovedRescheduleToTourPlan error:', err);
    }
  }

  public static async getCustomTourPlans(employeeCode: string): Promise<Record<string, any>> {
    const clean = (employeeCode || 'NLCL-0004').trim().toLowerCase();
    const tourPlansKey = `${STORAGE_KEYS.TOUR_PLANS_CACHE}_${clean}`;
    return await StorageService.getItem<Record<string, any>>(tourPlansKey, {});
  }

  public static async saveCustomTourDayPlan(
    employeeCode: string,
    dateKey: string,
    plan: { city: string; type: string; notes?: string }
  ): Promise<void> {
    const clean = (employeeCode || 'NLCL-0004').trim().toLowerCase();
    const tourPlansKey = `${STORAGE_KEYS.TOUR_PLANS_CACHE}_${clean}`;
    const current = await StorageService.getItem<Record<string, any>>(tourPlansKey, {});
    current[dateKey] = plan;
    await StorageService.setItem(tourPlansKey, current);
  }
}

