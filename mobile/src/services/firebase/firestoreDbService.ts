/**
 * RepPulse Cloud Firestore Database Service
 * --------------------------------------------
 * High-performance, offline-resilient Cloud Firestore driver
 * for Doctor directory, Firm stockists, Daily Visits, POB Orders,
 * Live GPS Telemetry, and Manager Deletion Approvals.
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../../config/firebase';
import {
  Doctor,
  StockistFirm,
  VisitRecord,
  POBOrder,
  AttendanceRecord,
  MonthlyTourProgramme,
} from '../../types';
import { StorageService, STORAGE_KEYS } from '../storageService';

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

export class FirestoreDbService {
  /**
   * Helper: Check if Cloud Firestore is active & configured
   */
  public static isConnected(): boolean {
    return isFirebaseConfigured() && db !== null;
  }

  // ==========================================
  // 1. DOCTOR DIRECTORY CLOUD OPERATIONS
  // ==========================================

  /**
   * Fetch all doctors from Cloud Firestore (with local cache fallback)
   */
  public static async fetchDoctors(): Promise<Doctor[]> {
    if (!this.isConnected() || !db) {
      return await StorageService.getItem<Doctor[]>(STORAGE_KEYS.DOCTORS_CACHE, []);
    }

    try {
      const colRef = collection(db, 'doctors');
      const snap = await getDocs(colRef);
      const doctors: Doctor[] = [];

      snap.forEach((d) => {
        const data = d.data() as Doctor;
        doctors.push({ ...data, id: d.id });
      });

      // Update local cache with cloud snapshot
      await StorageService.setItem(STORAGE_KEYS.DOCTORS_CACHE, doctors);
      return doctors;
    } catch (err) {
      console.warn('[Firestore] fetchDoctors error, using local cache:', err);
      return await StorageService.getItem<Doctor[]>(STORAGE_KEYS.DOCTORS_CACHE, []);
    }
  }

  /**
   * Real-time listener for Doctors collection
   */
  public static subscribeDoctors(onUpdate: (doctors: Doctor[]) => void): () => void {
    if (!this.isConnected() || !db) {
      return () => {};
    }

    try {
      const colRef = collection(db, 'doctors');
      return onSnapshot(
        colRef,
        (snap) => {
          const docs: Doctor[] = [];
          snap.forEach((d) => docs.push({ ...(d.data() as Doctor), id: d.id }));
          StorageService.setItem(STORAGE_KEYS.DOCTORS_CACHE, docs);
          onUpdate(docs);
        },
        (err) => {
          console.warn('[Firestore] Doctors subscription warning:', err);
        }
      );
    } catch (e) {
      return () => {};
    }
  }

  /**
   * Add new doctor to Cloud Firestore & Local Cache
   */
  public static async addDoctor(doctor: Doctor): Promise<void> {
    // 1. Save to local storage cache immediately
    const cached = await StorageService.getItem<Doctor[]>(STORAGE_KEYS.DOCTORS_CACHE, []);
    const updatedCache = [doctor, ...cached.filter((d) => d.id !== doctor.id)];
    await StorageService.setItem(STORAGE_KEYS.DOCTORS_CACHE, updatedCache);

    // 2. Sync to Cloud Firestore if connected
    if (this.isConnected() && db) {
      try {
        const docRef = doc(db, 'doctors', doctor.id);
        await setDoc(docRef, {
          ...doctor,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn('[Firestore] addDoctor cloud sync deferred:', err);
      }
    }
  }

  /**
   * Update doctor record in Cloud Firestore & Local Cache
   */
  public static async updateDoctor(id: string, updates: Partial<Doctor>): Promise<void> {
    // 1. Update local cache
    const cached = await StorageService.getItem<Doctor[]>(STORAGE_KEYS.DOCTORS_CACHE, []);
    const idx = cached.findIndex((d) => d.id === id);
    if (idx >= 0) {
      cached[idx] = { ...cached[idx], ...updates };
      await StorageService.setItem(STORAGE_KEYS.DOCTORS_CACHE, cached);
    }

    // 2. Sync to Cloud Firestore
    if (this.isConnected() && db) {
      try {
        const docRef = doc(db, 'doctors', id);
        await updateDoc(docRef, {
          ...updates,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn('[Firestore] updateDoctor cloud sync error:', err);
      }
    }
  }

  /**
   * Delete doctor from Cloud Firestore & Local Cache
   */
  public static async deleteDoctor(id: string): Promise<void> {
    // 1. Remove from local cache
    const cached = await StorageService.getItem<Doctor[]>(STORAGE_KEYS.DOCTORS_CACHE, []);
    const filtered = cached.filter((d) => d.id !== id);
    await StorageService.setItem(STORAGE_KEYS.DOCTORS_CACHE, filtered);

    // 2. Delete from Cloud Firestore
    if (this.isConnected() && db) {
      try {
        const docRef = doc(db, 'doctors', id);
        await deleteDoc(docRef);
      } catch (err) {
        console.warn('[Firestore] deleteDoctor cloud delete error:', err);
      }
    }
  }

  // ==========================================
  // 2. DOCTOR DELETION APPROVAL WORKFLOW
  // ==========================================

  /**
   * Submit doctor deletion request for Manager / RSM review
   */
  public static async submitDeletionRequest(req: Omit<DoctorDeletionRequest, 'id' | 'requestedAt' | 'status'>): Promise<string> {
    const id = 'del-req-' + Date.now();
    const fullReq: DoctorDeletionRequest = {
      ...req,
      id,
      requestedAt: new Date().toISOString(),
      status: 'PENDING',
    };

    // 1. Local Cache
    const existing = await StorageService.getItem<DoctorDeletionRequest[]>(STORAGE_KEYS.DOCTOR_DELETE_REQUESTS, []);
    await StorageService.setItem(STORAGE_KEYS.DOCTOR_DELETE_REQUESTS, [fullReq, ...existing]);

    // 2. Cloud Firestore
    if (this.isConnected() && db) {
      try {
        const docRef = doc(db, 'doctor_deletion_requests', id);
        await setDoc(docRef, {
          ...fullReq,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn('[Firestore] submitDeletionRequest error:', err);
      }
    }

    return id;
  }

  /**
   * Get pending doctor deletion requests
   */
  public static async getPendingDeletionRequests(): Promise<DoctorDeletionRequest[]> {
    if (!this.isConnected() || !db) {
      return await StorageService.getItem<DoctorDeletionRequest[]>(STORAGE_KEYS.DOCTOR_DELETE_REQUESTS, []);
    }

    try {
      const colRef = collection(db, 'doctor_deletion_requests');
      const snap = await getDocs(colRef);
      const requests: DoctorDeletionRequest[] = [];
      snap.forEach((d) => requests.push({ ...(d.data() as DoctorDeletionRequest), id: d.id }));
      await StorageService.setItem(STORAGE_KEYS.DOCTOR_DELETE_REQUESTS, requests);
      return requests;
    } catch (err) {
      return await StorageService.getItem<DoctorDeletionRequest[]>(STORAGE_KEYS.DOCTOR_DELETE_REQUESTS, []);
    }
  }

  /**
   * Approve Doctor Deletion (RSM / Manager action)
   */
  public static async approveDeletionRequest(requestId: string, doctorId: string, managerName: string): Promise<void> {
    // 1. Delete doctor record
    await this.deleteDoctor(doctorId);

    // 2. Mark request as APPROVED
    const cached = await StorageService.getItem<DoctorDeletionRequest[]>(STORAGE_KEYS.DOCTOR_DELETE_REQUESTS, []);
    const idx = cached.findIndex((r) => r.id === requestId);
    if (idx >= 0) {
      cached[idx].status = 'APPROVED';
      cached[idx].reviewedBy = managerName;
      cached[idx].reviewedAt = new Date().toISOString();
      await StorageService.setItem(STORAGE_KEYS.DOCTOR_DELETE_REQUESTS, cached);
    }

    if (this.isConnected() && db) {
      try {
        const reqRef = doc(db, 'doctor_deletion_requests', requestId);
        await updateDoc(reqRef, {
          status: 'APPROVED',
          reviewedBy: managerName,
          reviewedAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn('[Firestore] approveDeletionRequest error:', err);
      }
    }
  }

  // ==========================================
  // 3. STOCKISTS & CHEMIST FIRMS
  // ==========================================

  public static async fetchFirms(): Promise<StockistFirm[]> {
    if (!this.isConnected() || !db) {
      return await StorageService.getItem<StockistFirm[]>(STORAGE_KEYS.FIRMS_CACHE, []);
    }

    try {
      const colRef = collection(db, 'firms');
      const snap = await getDocs(colRef);
      const firms: StockistFirm[] = [];
      snap.forEach((d) => firms.push({ ...(d.data() as StockistFirm), id: d.id }));
      await StorageService.setItem(STORAGE_KEYS.FIRMS_CACHE, firms);
      return firms;
    } catch (err) {
      return await StorageService.getItem<StockistFirm[]>(STORAGE_KEYS.FIRMS_CACHE, []);
    }
  }

  public static async addFirm(firm: StockistFirm): Promise<void> {
    const cached = await StorageService.getItem<StockistFirm[]>(STORAGE_KEYS.FIRMS_CACHE, []);
    await StorageService.setItem(STORAGE_KEYS.FIRMS_CACHE, [firm, ...cached.filter((f) => f.id !== firm.id)]);

    if (this.isConnected() && db) {
      try {
        const docRef = doc(db, 'firms', firm.id);
        await setDoc(docRef, { ...firm, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      } catch (err) {
        console.warn('[Firestore] addFirm error:', err);
      }
    }
  }

  // ==========================================
  // 4. DAILY VISITS & DCR CALL REPORTS
  // ==========================================

  public static async recordVisit(visit: VisitRecord): Promise<void> {
    // 1. Local Cache
    const visits = await StorageService.getItem<VisitRecord[]>(STORAGE_KEYS.VISITS_LOCAL, []);
    const updated = [visit, ...visits.filter((v) => v.id !== visit.id)];
    await StorageService.setItem(STORAGE_KEYS.VISITS_LOCAL, updated);

    // 2. Cloud Firestore
    if (this.isConnected() && db) {
      try {
        const docRef = doc(db, 'visits', visit.id);
        await setDoc(docRef, {
          ...visit,
          syncStatus: 'SYNCED',
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn('[Firestore] recordVisit cloud sync error:', err);
      }
    }
  }

  public static async fetchVisits(): Promise<VisitRecord[]> {
    if (!this.isConnected() || !db) {
      return await StorageService.getItem<VisitRecord[]>(STORAGE_KEYS.VISITS_LOCAL, []);
    }

    try {
      const colRef = collection(db, 'visits');
      const snap = await getDocs(colRef);
      const visits: VisitRecord[] = [];
      snap.forEach((d) => visits.push({ ...(d.data() as VisitRecord), id: d.id }));
      await StorageService.setItem(STORAGE_KEYS.VISITS_LOCAL, visits);
      return visits;
    } catch (err) {
      return await StorageService.getItem<VisitRecord[]>(STORAGE_KEYS.VISITS_LOCAL, []);
    }
  }

  // ==========================================
  // 5. ATTENDANCE & REAL-TIME TELEMETRY
  // ==========================================

  public static async recordAttendance(att: AttendanceRecord): Promise<void> {
    const list = await StorageService.getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE_LOCAL, []);
    await StorageService.setItem(STORAGE_KEYS.ATTENDANCE_LOCAL, [att, ...list.filter((a) => a.id !== att.id)]);

    if (this.isConnected() && db) {
      try {
        const docRef = doc(db, 'attendance', att.id);
        await setDoc(docRef, {
          ...att,
          syncStatus: 'SYNCED',
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn('[Firestore] recordAttendance error:', err);
      }
    }
  }

  public static async pushLocationTelemetry(telemetry: {
    userId: string;
    userName: string;
    latitude: number;
    longitude: number;
    accuracyMeters: number;
    isMockGps: boolean;
    batteryLevel?: number;
    timestamp: string;
  }): Promise<void> {
    if (this.isConnected() && db) {
      try {
        const id = `telemetry_${telemetry.userId}_${Date.now()}`;
        const docRef = doc(db, 'location_telemetry', id);
        await setDoc(docRef, {
          ...telemetry,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn('[Firestore] pushLocationTelemetry error:', err);
      }
    }
  }

  // ==========================================
  // 6. MONTHLY TOUR PROGRAMME (MTP)
  // ==========================================

  public static async saveMonthlyTourProgramme(mtp: MonthlyTourProgramme): Promise<void> {
    const key = `@REPPULSE_MTP_${mtp.employeeId}_${mtp.year}_${mtp.month || mtp.monthIndex || 'current'}`;
    await StorageService.setItem(key, mtp);

    if (this.isConnected() && db) {
      try {
        const id = `mtp_${mtp.employeeId}_${mtp.year}_${mtp.month || mtp.monthIndex || '09'}`;
        const docRef = doc(db, 'monthly_tour_programmes', id);
        await setDoc(docRef, {
          ...mtp,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn('[Firestore] saveMonthlyTourProgramme error:', err);
      }
    }
  }
}
