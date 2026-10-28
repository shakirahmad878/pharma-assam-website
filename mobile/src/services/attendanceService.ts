import { AttendanceRecord } from '../types';
import { StorageService, STORAGE_KEYS } from './storageService';
import { SyncService } from './sync/syncService';
import { BackgroundTelemetryManager } from './location/backgroundTelemetry';
import { AuthService } from './authService';
import { RouteService } from './routeService';

export class AttendanceService {
  public static async getTodayAttendance(): Promise<{ isPunchedIn: boolean; record: AttendanceRecord | null; punchInTime: string | null }> {
    const records = await StorageService.getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE_LOCAL, []);
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = records.find(r => r.date === today && r.status === 'PUNCHED_IN');
    
    if (todayRecord) {
      const time = new Date(todayRecord.punchInTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return { isPunchedIn: true, record: todayRecord, punchInTime: time };
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
      employeeName: user?.name || 'Shakir Ahmad',
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

    // Start background telemetry
    await BackgroundTelemetryManager.startTracking();

    // Enqueue in cloud sync queue
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
        await SyncService.enqueue('ATTENDANCE', r);
      }
    }

    await StorageService.setItem(STORAGE_KEYS.ATTENDANCE_LOCAL, records);
    await BackgroundTelemetryManager.stopTracking();
  }
}
