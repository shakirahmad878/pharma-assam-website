import { VisitRecord, VisitStatus } from '../types';
import { StorageService, STORAGE_KEYS } from './storageService';
import { SyncService } from './sync/syncService';
import { DoctorService } from './doctorService';
import { SupabaseDbService } from './supabase/supabaseDbService';

export class VisitService {
  /**
   * Returns all locally cached visits, sorted with newest first.
   */
  public static async getVisits(): Promise<VisitRecord[]> {
    return await StorageService.getItem<VisitRecord[]>(STORAGE_KEYS.VISITS_LOCAL, []);
  }

  /**
   * Returns visits matching today's date (YYYY-MM-DD).
   */
  public static async getTodayVisits(): Promise<VisitRecord[]> {
    const today = new Date().toISOString().split('T')[0];
    const all = await this.getVisits();
    return all.filter(v => {
      const vDate = v.date || (v.checkInTimestamp ? v.checkInTimestamp.split('T')[0] : '');
      return vDate === today;
    });
  }

  /**
   * Returns past visits for a specific customer (Doctor or Chemist/Firm)
   */
  public static async getVisitsForCustomer(customerId: string): Promise<VisitRecord[]> {
    const all = await this.getVisits();
    return all.filter(v => v.doctorId === customerId || v.chemistId === customerId);
  }

  /**
   * Creates a new visit record, stores it locally, updates customer status,
   * and enqueues for background sync.
   */
  public static async createVisit(visit: Omit<VisitRecord, 'id' | 'syncStatus'>): Promise<VisitRecord> {
    const newId = 'vis_' + Date.now().toString() + '_' + Math.random().toString(36).substring(7);
    const newVisit: VisitRecord = {
      ...visit,
      id: newId,
      syncStatus: 'PENDING',
    };

    const visits = await this.getVisits();
    visits.unshift(newVisit);
    await StorageService.setItem(STORAGE_KEYS.VISITS_LOCAL, visits);

    // Update doctor's visit count and today status if doctor
    if (visit.doctorId) {
      await DoctorService.updateDoctorTodayStatus(visit.doctorId, 'COMPLETED');
    }

    // Queue for background cloud sync
    await SyncService.enqueue('VISIT', newVisit);

    return newVisit;
  }

  public static async recordVisit(visit: Omit<VisitRecord, 'id' | 'syncStatus'>): Promise<VisitRecord> {
    return this.createVisit(visit);
  }

  /**
   * Updates an existing visit's status (e.g. IN_PROGRESS, SKIPPED, MISSED, COMPLETED).
   */
  public static async updateVisitStatus(visitId: string, status: VisitStatus): Promise<boolean> {
    const visits = await this.getVisits();
    const idx = visits.findIndex(v => v.id === visitId);
    if (idx >= 0) {
      visits[idx].status = status;
      visits[idx].syncStatus = 'PENDING';
      await StorageService.setItem(STORAGE_KEYS.VISITS_LOCAL, visits);
      await SyncService.enqueue('VISIT', visits[idx]);
      return true;
    }
    return false;
  }

  /**
   * Fetches latest visits from Supabase cloud and merges them into local storage.
   */
  public static async syncFromCloud(employeeId?: string): Promise<VisitRecord[]> {
    try {
      if (!SupabaseDbService.isConnected()) {
        return await this.getVisits();
      }

      const cloudVisits = await SupabaseDbService.fetchVisits(employeeId);
      if (!cloudVisits || !Array.isArray(cloudVisits) || cloudVisits.length === 0) {
        return await this.getVisits();
      }

      const localVisits = await this.getVisits();
      const localMap = new Map<string, VisitRecord>();
      localVisits.forEach(v => localMap.set(v.id, v));

      cloudVisits.forEach((cv: any) => {
        const id = cv.id || `vis_cloud_${cv.created_at}`;
        const existing = localMap.get(id);

        // Do not overwrite un-synced local changes
        if (existing && existing.syncStatus === 'PENDING') {
          return;
        }

        const mapped: VisitRecord = {
          id: cv.id,
          serverId: cv.id,
          customerType: cv.customer_type || (cv.chemist_id ? 'CHEMIST' : 'DOCTOR'),
          doctorId: cv.doctor_id || '',
          doctorName: cv.doctor_name || '',
          clinicName: cv.clinic_name || cv.doctor_name || '',
          chemistId: cv.chemist_id || undefined,
          chemistName: cv.chemist_name || undefined,
          employeeId: cv.employee_id,
          employeeName: cv.employee_name,
          date: cv.visit_date || (cv.timestamp ? cv.timestamp.split('T')[0] : ''),
          checkInTimestamp: cv.start_time || cv.timestamp || new Date().toISOString(),
          checkInLatitude: cv.latitude || 0,
          checkInLongitude: cv.longitude || 0,
          checkInAccuracyMeters: 10,
          checkInDistanceMeters: cv.distance_meters || 0,
          isGeofenceVerified: cv.is_geofence_verified ?? true,
          checkOutTimestamp: cv.end_time || undefined,
          visitDurationMinutes: cv.duration_minutes || 0,
          visitObjective: cv.visit_objective || undefined,
          accompaniedBy: cv.accompanied_by || undefined,
          discussionNotes: cv.notes || '',
          productsDiscussed: Array.isArray(cv.products_discussed) ? cv.products_discussed : [],
          samplesDistributed: Array.isArray(cv.samples_given) ? cv.samples_given : [],
          doctorFeedback: cv.feedback || cv.notes || '',
          nextFollowUpDate: cv.next_visit_date || undefined,
          pobAmount: cv.pob_amount ? Number(cv.pob_amount) : 0,
          isUnplanned: cv.is_unplanned ?? false,
          status: cv.status || 'COMPLETED',
          syncStatus: 'SYNCED',
        };

        localMap.set(id, mapped);
      });

      const merged = Array.from(localMap.values()).sort((a, b) => {
        const tA = new Date(a.checkInTimestamp || a.date).getTime();
        const tB = new Date(b.checkInTimestamp || b.date).getTime();
        return tB - tA;
      });

      await StorageService.setItem(STORAGE_KEYS.VISITS_LOCAL, merged);
      return merged;
    } catch (err) {
      console.warn('[VisitService] syncFromCloud error:', err);
      return await this.getVisits();
    }
  }
}
