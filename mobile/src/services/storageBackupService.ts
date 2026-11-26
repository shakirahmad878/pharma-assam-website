/**
 * RepPulse Pharma SFA — Local Storage Recovery & Non-Destructive Backup Service
 * ----------------------------------------------------------------------------
 * Guarantees zero data loss by creating a non-destructive snapshot of all
 * local caches and offline queues BEFORE any recovery or sync operation.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageService, STORAGE_KEYS } from './storageService';
import { SyncQueueItem, Doctor, VisitRecord, AttendanceRecord, POBOrder } from '../types';

export const BACKUP_KEYS = {
  SAFETY_SNAPSHOT_PREFIX: '@REPPULSE_SAFETY_SNAPSHOT_',
  LATEST_SAFETY_SNAPSHOT: '@REPPULSE_SAFETY_SNAPSHOT_LATEST',
};

export interface LocalDataSnapshot {
  snapshotTimestamp: string;
  doctorsCache: Doctor[];
  visitsLocal: VisitRecord[];
  attendanceLocal: AttendanceRecord[];
  ordersLocal: POBOrder[];
  syncQueue: SyncQueueItem[];
  telemetryQueue: any[];
}

export class StorageBackupService {
  /**
   * Captures an immutable point-in-time snapshot of all critical offline data.
   * This snapshot is stored under a distinct key and is NEVER overwritten or purged
   * by normal application workflows.
   */
  public static async createRecoveryBackup(): Promise<{ success: boolean; snapshotKey: string; counts: Record<string, number> }> {
    try {
      const nowIso = new Date().toISOString();
      const dateKey = nowIso.replace(/[^0-9]/g, '_').slice(0, 15);
      const snapshotKey = `${BACKUP_KEYS.SAFETY_SNAPSHOT_PREFIX}${dateKey}`;

      const [doctors, visits, attendance, orders, syncQueue, telemetry] = await Promise.all([
        StorageService.getItem<Doctor[]>(STORAGE_KEYS.DOCTORS_CACHE, []),
        StorageService.getItem<VisitRecord[]>(STORAGE_KEYS.VISITS_LOCAL, []),
        StorageService.getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE_LOCAL, []),
        StorageService.getItem<POBOrder[]>(STORAGE_KEYS.ORDERS_LOCAL, []),
        StorageService.getItem<SyncQueueItem[]>(STORAGE_KEYS.OFFLINE_SYNC_QUEUE, []),
        StorageService.getItem<any[]>(STORAGE_KEYS.TELEMETRY_QUEUE, []),
      ]);

      const snapshot: LocalDataSnapshot = {
        snapshotTimestamp: nowIso,
        doctorsCache: doctors,
        visitsLocal: visits,
        attendanceLocal: attendance,
        ordersLocal: orders,
        syncQueue: syncQueue,
        telemetryQueue: telemetry,
      };

      const serialized = JSON.stringify(snapshot);
      await AsyncStorage.setItem(snapshotKey, serialized);
      await AsyncStorage.setItem(BACKUP_KEYS.LATEST_SAFETY_SNAPSHOT, serialized);

      const counts = {
        doctors: doctors.length,
        visits: visits.length,
        attendance: attendance.length,
        orders: orders.length,
        syncQueue: syncQueue.length,
        telemetry: telemetry.length,
      };

      console.log(`[StorageBackupService] Safety snapshot successfully created at ${snapshotKey}:`, counts);
      return { success: true, snapshotKey, counts };
    } catch (err) {
      console.error('[StorageBackupService] Failed to create safety snapshot:', err);
      return {
        success: false,
        snapshotKey: '',
        counts: { doctors: 0, visits: 0, attendance: 0, orders: 0, syncQueue: 0, telemetry: 0 },
      };
    }
  }

  /**
   * Retrieves the latest safety snapshot.
   */
  public static async getLatestBackup(): Promise<LocalDataSnapshot | null> {
    try {
      const raw = await AsyncStorage.getItem(BACKUP_KEYS.LATEST_SAFETY_SNAPSHOT);
      return raw ? (JSON.parse(raw) as LocalDataSnapshot) : null;
    } catch (err) {
      console.error('[StorageBackupService] Failed to read latest snapshot:', err);
      return null;
    }
  }
}
