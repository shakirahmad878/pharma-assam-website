import { SyncQueueItem, SyncEntityType, VisitRecord, POBOrder, AttendanceRecord } from '../../types';
import { StorageService, STORAGE_KEYS } from '../storageService';

export interface SyncStats {
  pending: number;
  syncing: number;
  synced: number;
  failed: number;
  total: number;
  lastSyncTime: string | null;
}

type SyncListener = (stats: SyncStats) => void;

const LAST_SYNC_KEY = '@REPPULSE_LAST_SYNC_TIMESTAMP';

export class SyncService {
  private static isSyncing = false;
  private static listeners: SyncListener[] = [];

  public static async enqueue(entityType: SyncEntityType, payload: any): Promise<string> {
    const queue = await StorageService.getItem<SyncQueueItem[]>(STORAGE_KEYS.OFFLINE_SYNC_QUEUE, []);
    
    // Idempotency: Prevent duplicate pending records for same local ID
    const localId = payload.id || `loc_${Date.now()}`;
    const existingIndex = queue.findIndex(item => item.payload?.id === localId && item.status !== 'SYNCED');

    const queueItem: SyncQueueItem = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      entityType,
      payload,
      createdAt: new Date().toISOString(),
      retryCount: 0,
      maxRetries: 3,
      status: 'PENDING'
    };

    if (existingIndex >= 0) {
      queue[existingIndex] = queueItem;
    } else {
      queue.unshift(queueItem);
    }

    await StorageService.setItem(STORAGE_KEYS.OFFLINE_SYNC_QUEUE, queue);
    this.notifyListeners();
    return queueItem.id;
  }

  public static async getQueue(): Promise<SyncQueueItem[]> {
    return await StorageService.getItem<SyncQueueItem[]>(STORAGE_KEYS.OFFLINE_SYNC_QUEUE, []);
  }

  public static async getLastSyncTime(): Promise<string | null> {
    return await StorageService.getItem<string | null>(LAST_SYNC_KEY, null);
  }

  public static async setLastSyncTime(timeIso: string): Promise<void> {
    await StorageService.setItem(LAST_SYNC_KEY, timeIso);
  }

  public static async getStats(): Promise<SyncStats> {
    const queue = await this.getQueue();
    const lastSync = await this.getLastSyncTime();
    const pending = queue.filter(q => q.status === 'PENDING').length;
    const syncing = queue.filter(q => q.status === 'SYNCING').length;
    const synced = queue.filter(q => q.status === 'SYNCED').length;
    const failed = queue.filter(q => q.status === 'FAILED').length;

    return {
      pending,
      syncing,
      synced,
      failed,
      total: queue.length,
      lastSyncTime: lastSync,
    };
  }

  public static async syncAll(): Promise<{ success: boolean; processedCount: number; failedCount: number; message: string }> {
    const res = await this.processQueue();
    const msg = res.failedCount === 0
      ? `Successfully synchronized ${res.processedCount} record${res.processedCount === 1 ? '' : 's'} with cloud.`
      : `Synchronized ${res.processedCount} records, but ${res.failedCount} record${res.failedCount === 1 ? '' : 's'} failed. Tap to retry.`;
    return {
      success: res.failedCount === 0,
      processedCount: res.processedCount,
      failedCount: res.failedCount,
      message: msg,
    };
  }

  public static async processQueue(): Promise<{ processedCount: number; failedCount: number }> {
    if (this.isSyncing) return { processedCount: 0, failedCount: 0 };
    this.isSyncing = true;

    const queue = await this.getQueue();
    let processedCount = 0;
    let failedCount = 0;

    for (const item of queue) {
      if (item.status === 'SYNCED') continue;

      item.status = 'SYNCING';
      this.notifyListeners();

      try {
        // Simulate controlled cloud upload with latency
        await new Promise(resolve => setTimeout(resolve, 350));

        // Mark item as synced
        item.status = 'SYNCED';
        const serverId = `srv_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        item.payload.serverId = serverId;
        item.payload.syncStatus = 'SYNCED';
        processedCount++;

        // Update corresponding local caches
        await this.updateLocalEntityStatus(item.entityType, item.payload.id, serverId);
      } catch (err: any) {
        item.retryCount += 1;
        item.lastError = err?.message || 'Network dispatch timeout';
        item.status = item.retryCount >= item.maxRetries ? 'FAILED' : 'PENDING';
        failedCount++;
      }
    }

    await StorageService.setItem(STORAGE_KEYS.OFFLINE_SYNC_QUEUE, queue);
    const nowIso = new Date().toISOString();
    await this.setLastSyncTime(nowIso);

    this.isSyncing = false;
    this.notifyListeners();

    return { processedCount, failedCount };
  }

  private static async updateLocalEntityStatus(entityType: SyncEntityType, localId: string, serverId: string): Promise<void> {
    try {
      if (entityType === 'VISIT') {
        const visits = await StorageService.getItem<VisitRecord[]>(STORAGE_KEYS.VISITS_LOCAL, []);
        const idx = visits.findIndex(v => v.id === localId);
        if (idx >= 0) {
          visits[idx].syncStatus = 'SYNCED';
          visits[idx].serverId = serverId;
          await StorageService.setItem(STORAGE_KEYS.VISITS_LOCAL, visits);
        }
      } else if (entityType === 'POB_ORDER') {
        const orders = await StorageService.getItem<POBOrder[]>(STORAGE_KEYS.ORDERS_LOCAL, []);
        const idx = orders.findIndex(o => o.id === localId);
        if (idx >= 0) {
          orders[idx].syncStatus = 'SYNCED';
          orders[idx].serverId = serverId;
          await StorageService.setItem(STORAGE_KEYS.ORDERS_LOCAL, orders);
        }
      } else if (entityType === 'ATTENDANCE') {
        const atts = await StorageService.getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE_LOCAL, []);
        const idx = atts.findIndex(a => a.id === localId);
        if (idx >= 0) {
          atts[idx].syncStatus = 'SYNCED';
          atts[idx].serverId = serverId;
          await StorageService.setItem(STORAGE_KEYS.ATTENDANCE_LOCAL, atts);
        }
      }
    } catch (e) {
      console.warn('[SyncService] Failed updating local entity syncStatus', e);
    }
  }

  public static async clearSynced(): Promise<void> {
    const queue = await this.getQueue();
    const remaining = queue.filter(q => q.status !== 'SYNCED');
    await StorageService.setItem(STORAGE_KEYS.OFFLINE_SYNC_QUEUE, remaining);
    this.notifyListeners();
  }

  public static async retryFailed(): Promise<{ processedCount: number; failedCount: number }> {
    const queue = await this.getQueue();
    queue.forEach(item => {
      if (item.status === 'FAILED') {
        item.status = 'PENDING';
        item.retryCount = 0;
        item.lastError = undefined;
      }
    });
    await StorageService.setItem(STORAGE_KEYS.OFFLINE_SYNC_QUEUE, queue);
    return await this.processQueue();
  }

  public static subscribe(listener: SyncListener): () => void {
    this.listeners.push(listener);
    this.getStats().then(s => listener(s));
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private static notifyListeners(): void {
    this.getStats().then(stats => {
      this.listeners.forEach(l => l(stats));
    });
  }
}
