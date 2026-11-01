import { AttendanceRecord } from '../types';
import { StorageService, STORAGE_KEYS } from './storageService';
import { SyncService } from './sync/syncService';
import { BackgroundTelemetryManager } from './location/backgroundTelemetry';
import { AuthService } from './authService';
import { RouteService } from './routeService';
import { SupabaseDbService } from './supabase/supabaseDbService';

export class AttendanceService {
  public static async getTodayAttendance(): Promise<{ isPunchedIn: boolean; record: AttendanceRecord | null; punchInTime: string | null }> {
    const records = await StorageService.getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE_LOCAL, []);
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = records.find(r => r.date === today && r.status === 'PUNCHED_IN');
    
    if (todayRecord) {
      const time = new Date(todayRecord.punchInTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return { isPunchedIn: true, record: todayRecord, punchInTime: time };
    }

    // Cloud Fallback: check Supabase if local cache was cleared or freshly installed
    const user = AuthService.getCurrentUser();
    if (user?.id && SupabaseDbService.isConnected()) {
      try {
        const cloudAtt = await SupabaseDbService.getLatestEmployeeLocation(user.id);
        if (cloudAtt && cloudAtt.date === today && cloudAtt.status === 'PUNCHED_IN') {
          const restoredRecord: AttendanceRecord = {
            id: cloudAtt.id,
            employeeId: cloudAtt.employee_id,
            employeeName: cloudAtt.employee_name,
            date: cloudAtt.date,
            punchInTimestamp: cloudAtt.punch_in_timestamp,
            punchOutTimestamp: cloudAtt.punch_out_timestamp || undefined,
            status: 'PUNCHED_IN',
            routeId: cloudAtt.route_id || undefined,
            routeName: cloudAtt.route_name || undefined,
            latitude: cloudAtt.latitude,
            longitude: cloudAtt.longitude,
            accuracyMeters: cloudAtt.accuracy_meters || 6,
            selfieBase64OrUri: cloudAtt.selfie_url || '',
            isMockLocation: Boolean(cloudAtt.is_mock_location),
            batteryPercentage: cloudAtt.battery_percentage || 95,
            syncStatus: 'SYNCED',
            serverId: cloudAtt.server_id || cloudAtt.id
          };
          records.unshift(restoredRecord);
          await StorageService.setItem(STORAGE_KEYS.ATTENDANCE_LOCAL, records);
          const time = new Date(restoredRecord.punchInTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return { isPunchedIn: true, record: restoredRecord, punchInTime: time };
        }
      } catch (err) {
        console.warn('[AttendanceService] Cloud restore fallback check skipped:', err);
      }
    }

    return { isPunchedIn: false, record: null, punchInTime: null };
  }

  public static async punchIn(params: {
    latitude: number;
    longitude: number;
    accuracyMeters: number;
    selfieUri: string;
    isMockLocation: boolean;
    routeId?: string;
    routeName?: string;
  }): Promise<AttendanceRecord> {
    const user = AuthService.getCurrentUser();
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // If route was selected, set it active across the app & user session
    if (params.routeId) {
      await RouteService.setActiveRoute(params.routeId);
      await AuthService.updateUserProfile({ activeRouteId: params.routeId });
    }

    const newRecord: AttendanceRecord = {
      id: 'att_' + Date.now().toString(),
      employeeId: user?.id || 'usr-mr-barak-01',
      employeeName: user?.name || 'Field Representative',
      date: today,
      punchInTimestamp: now.toISOString(),
      routeId: params.routeId,
      routeName: params.routeName,
      latitude: params.latitude,
      longitude: params.longitude,
      accuracyMeters: params.accuracyMeters,
      selfieBase64OrUri: params.selfieUri,
      isMockLocation: params.isMockLocation,
      batteryPercentage: 94,
      status: 'PUNCHED_IN',
      syncStatus: 'PENDING'
    };

    const records = await StorageService.getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE_LOCAL, []);
    records.unshift(newRecord);
    await StorageService.setItem(STORAGE_KEYS.ATTENDANCE_LOCAL, records);

    // Direct real-time persistence to Supabase
    if (SupabaseDbService.isConnected()) {
      try {
        await SupabaseDbService.recordAttendance(newRecord);
        newRecord.syncStatus = 'SYNCED';
      } catch (e) {
        console.warn('[AttendanceService] Direct Supabase push failed, falling back to sync queue:', e);
      }
    }

    // Start background telemetry
    await BackgroundTelemetryManager.startTracking();

    // Enqueue in cloud sync queue for idempotency & offline resilience
    await SyncService.enqueue('ATTENDANCE', newRecord);

    return newRecord;
  }

  public static async punchOut(): Promise<void> {
    const records = await StorageService.getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE_LOCAL, []);
    const today = new Date().toISOString().split('T')[0];
    
    for (const r of records) {
      if (r.date === today && r.status === 'PUNCHED_IN') {
        r.status = 'PUNCHED_OUT';
        r.punchOutTimestamp = new Date().toISOString();
        r.syncStatus = 'PENDING';
        if (SupabaseDbService.isConnected()) {
          try {
            await SupabaseDbService.recordAttendance(r);
            r.syncStatus = 'SYNCED';
          } catch (e) {
            console.warn('[AttendanceService] punchOut Supabase update error:', e);
          }
        }
        await SyncService.enqueue('ATTENDANCE', r);
      }
    }

    await StorageService.setItem(STORAGE_KEYS.ATTENDANCE_LOCAL, records);
    await BackgroundTelemetryManager.stopTracking();
  }
}
