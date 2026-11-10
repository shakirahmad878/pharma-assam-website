import { AttendanceRecord, WorkingRouteCategory } from '../types';
import { StorageService, STORAGE_KEYS } from './storageService';
import { SyncService } from './sync/syncService';
import { BackgroundTelemetryManager } from './location/backgroundTelemetry';
import { AuthService } from './authService';
import { RouteService } from './routeService';
import { SupabaseDbService } from './supabase/supabaseDbService';
import { SupabaseStorageService } from './supabase/supabaseStorageService';
import { getBusinessDateStr } from '../utils/dateUtils';

export class AttendanceService {
  public static async getTodayAttendance(): Promise<{ isPunchedIn: boolean; record: AttendanceRecord | null; punchInTime: string | null }> {
    const today = getBusinessDateStr();
    const user = AuthService.getCurrentUser();
    const currentEmpId = user?.id || '';
    const currentEmpCode = user?.employeeCode || '';

    // 1. Check local device storage
    const records = await StorageService.getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE_LOCAL, []);
    const todayRecord = records.find(
      r => r.date === today && (r.employeeId === currentEmpId || r.employeeId === currentEmpCode) && r.status === 'PUNCHED_IN'
    );
    
    if (todayRecord) {
      const time = new Date(todayRecord.punchInTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return { isPunchedIn: true, record: todayRecord, punchInTime: time };
    }

    // 2. Cloud Fallback: Check authoritative Supabase database
    if (user && (currentEmpId || currentEmpCode) && SupabaseDbService.isConnected()) {
      try {
        const cloudAtt = await SupabaseDbService.getLatestEmployeeLocation(currentEmpId || currentEmpCode);
        if (cloudAtt && cloudAtt.date === today && cloudAtt.status === 'PUNCHED_IN') {
          const restoredRecord: AttendanceRecord = {
            id: cloudAtt.id,
            employeeId: cloudAtt.employee_id,
            employeeName: cloudAtt.employee_name,
            date: cloudAtt.date,
            punchInTimestamp: cloudAtt.punch_in_timestamp,
            punchOutTimestamp: cloudAtt.punch_out_timestamp || undefined,
            status: 'PUNCHED_IN',
            latitude: cloudAtt.latitude,
            longitude: cloudAtt.longitude,
            accuracyMeters: cloudAtt.accuracy_meters || 6,
            selfieBase64OrUri: cloudAtt.selfie_url || '',
            isMockLocation: Boolean(cloudAtt.is_mock_location),
            batteryPercentage: cloudAtt.battery_percentage || 95,
            syncStatus: 'SYNCED',
            serverId: cloudAtt.server_id || cloudAtt.id
          };
          const filtered = records.filter(r => r.id !== restoredRecord.id && !(r.date === today && r.employeeId === currentEmpId));
          await StorageService.setItem(STORAGE_KEYS.ATTENDANCE_LOCAL, [restoredRecord, ...filtered]);
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
    routeCategory?: WorkingRouteCategory;
    routeId?: string;
    routeName?: string;
    hqName?: string;
    routeRemarks?: string;
  }): Promise<AttendanceRecord> {
    const user = AuthService.getCurrentUser();
    const now = new Date();
    const today = getBusinessDateStr(now);

    // If route was selected, set it active across the app & user session
    if (params.routeId) {
      await RouteService.setActiveRoute(params.routeId);
      await AuthService.updateUserProfile({ activeRouteId: params.routeId });
      if (user?.id && SupabaseDbService.isConnected()) {
        try {
          await SupabaseDbService.updateEmployee(user.id, { activeRouteId: params.routeId });
        } catch (e) {}
      }
    }

    const cleanCode = (user?.employeeCode || user?.id || 'MR').replace(/[^a-zA-Z0-9_-]/g, '_');
    // Deterministic collision-resistant ID per employee per business date
    const deterministicId = `att_in_${cleanCode}_${today}`;

    // Upload front selfie to Supabase Cloud Storage if online
    let resolvedSelfieUrl = params.selfieUri;
    try {
      if (SupabaseDbService.isConnected() && params.selfieUri && !params.selfieUri.startsWith('http')) {
        const uploadRes = await SupabaseStorageService.uploadAttendanceSelfie({
          localUri: params.selfieUri,
          employeeCode: cleanCode,
          date: today,
        });
        if (uploadRes.success && uploadRes.publicUrl) {
          resolvedSelfieUrl = uploadRes.publicUrl;
        }
      }
    } catch (uploadErr) {
      console.warn('[AttendanceService] Cloud selfie upload deferred to sync queue:', uploadErr);
    }

    const newRecord: AttendanceRecord = {
      id: deterministicId,
      employeeId: user?.id || `usr-${cleanCode.toLowerCase()}`,
      employeeName: user?.name || 'Field Representative',
      date: today,
      punchInTimestamp: now.toISOString(),
      routeCategory: params.routeCategory,
      routeId: params.routeId,
      routeName: params.routeName,
      hqName: params.hqName,
      routeRemarks: params.routeRemarks,
      latitude: params.latitude,
      longitude: params.longitude,
      accuracyMeters: params.accuracyMeters,
      selfieBase64OrUri: resolvedSelfieUrl,
      isMockLocation: params.isMockLocation,
      batteryPercentage: 94,
      status: 'PUNCHED_IN',
      syncStatus: 'PENDING'
    };

    // Update local storage without duplicates
    const records = await StorageService.getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE_LOCAL, []);
    const deduped = [newRecord, ...records.filter(r => r.id !== deterministicId && !(r.date === today && r.employeeId === newRecord.employeeId))];
    await StorageService.setItem(STORAGE_KEYS.ATTENDANCE_LOCAL, deduped);

    // Direct real-time persistence to Supabase
    if (SupabaseDbService.isConnected()) {
      try {
        await SupabaseDbService.recordAttendance(newRecord);
        newRecord.syncStatus = 'SYNCED';
        // Update local status as well
        deduped[0].syncStatus = 'SYNCED';
        await StorageService.setItem(STORAGE_KEYS.ATTENDANCE_LOCAL, deduped);
      } catch (e) {
        console.warn('[AttendanceService] Direct Supabase push failed, falling back to sync queue:', e);
        newRecord.syncStatus = 'PENDING';
      }
    }

    // Start background telemetry
    await BackgroundTelemetryManager.startTracking();

    // Enqueue in cloud sync queue with idempotency
    await SyncService.enqueue('ATTENDANCE', newRecord);

    return newRecord;
  }

  public static async punchOut(): Promise<void> {
    const today = getBusinessDateStr();
    const user = AuthService.getCurrentUser();
    const currentEmpId = user?.id || '';
    const records = await StorageService.getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE_LOCAL, []);
    
    for (const r of records) {
      if (r.date === today && (r.employeeId === currentEmpId || !currentEmpId) && r.status === 'PUNCHED_IN') {
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
