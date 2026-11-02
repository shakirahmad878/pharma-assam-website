import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { StorageService, STORAGE_KEYS } from '../storageService';
import { SupabaseDbService } from '../supabase/supabaseDbService';
import { UserProfile, TelemetryLogPoint } from '../../types';

export const REPPULSE_TELEMETRY_TASK_NAME = 'REPPULSE_BACKGROUND_15MIN_LOCATION_TASK';

// Register background location task handler
TaskManager.defineTask(REPPULSE_TELEMETRY_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('[Telemetry Task] Execution Error:', error.message);
    return;
  }
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    if (locations && locations.length > 0) {
      const loc = locations[0];
      const session = await StorageService.getItem<UserProfile | null>(STORAGE_KEYS.AUTH_SESSION, null);
      const authenticatedEmpId = session?.id || session?.employeeCode || 'usr-nlcl-0004';
      const timestampIso = new Date(loc.timestamp).toISOString();

      const point: TelemetryLogPoint = {
        id: `tel_${authenticatedEmpId}_${Date.now()}`,
        employeeId: authenticatedEmpId,
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        accuracyMeters: loc.coords.accuracy || 0,
        speedKmh: (loc.coords.speed || 0) * 3.6,
        batteryPercentage: 90,
        isMockLocation: loc.mocked || false,
        capturedAt: timestampIso,
        syncStatus: 'SYNCED'
      };

      console.log('[Telemetry Task] 15-min background ping for', authenticatedEmpId, ':', point);

      // 1. Maintain local offline queue
      const queue = await StorageService.getItem<TelemetryLogPoint[]>(STORAGE_KEYS.TELEMETRY_QUEUE, []);
      queue.push(point);
      // Keep queue bounded to last 100 points
      if (queue.length > 100) queue.shift();
      await StorageService.setItem(STORAGE_KEYS.TELEMETRY_QUEUE, queue);

      // 2. Real-time Append-only Cloud Telemetry to Supabase
      if (SupabaseDbService.isConnected()) {
        try {
          await SupabaseDbService.recordLocationTelemetry({
            employee_id: authenticatedEmpId,
            user_id: session?.id,
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            accuracy_meters: loc.coords.accuracy || 6,
            altitude_meters: (loc.coords as any).altitude ?? undefined,
            speed_mps: loc.coords.speed ?? undefined,
            bearing_degrees: (loc.coords as any).heading ?? undefined,
            battery_percentage: 90,
            provider: loc.mocked ? 'mock' : 'fused',
            source: 'SCHEDULED',
            recorded_at: timestampIso,
          });

          // 3. Fulfill any pending on-demand manager location requests
          const pending = await SupabaseDbService.getPendingLocationRequests(authenticatedEmpId);
          for (const req of pending) {
            if (req.id) {
              await SupabaseDbService.respondToLocationRequest(req.id);
            }
          }
        } catch (err) {
          console.warn('[Telemetry Task] Cloud telemetry push error:', err);
        }
      }
    }
  }
});

export class BackgroundTelemetryManager {
  private static pollInterval: any = null;

  public static async isRegistered(): Promise<boolean> {
    try {
      return await TaskManager.isTaskRegisteredAsync(REPPULSE_TELEMETRY_TASK_NAME);
    } catch {
      return false;
    }
  }

  public static async startTracking(): Promise<{ success: boolean; message: string }> {
    try {
      const { status: fg } = await Location.requestForegroundPermissionsAsync();
      if (fg !== 'granted') {
        return { success: false, message: 'Foreground location permission required for field tracking.' };
      }

      const { status: bg } = await Location.requestBackgroundPermissionsAsync();
      if (bg !== 'granted') {
        return { success: false, message: 'Background location permission (Allow all the time) is required for 15-minute field telemetry.' };
      }

      const registered = await this.isRegistered();
      if (!registered) {
        await Location.startLocationUpdatesAsync(REPPULSE_TELEMETRY_TASK_NAME, {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 15 * 60 * 1000, // 15-minute target telemetry
          distanceInterval: 50,         // 50m displacement
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationTitle: 'RepPulse Active Field Duty 🛰️',
            notificationBody: '15-minute background location telemetry active for field verification.',
            notificationColor: '#0D9488'
          }
        });
      }

      // Also start lightweight foreground poller for instant on-demand manager requests
      this.startOnDemandRequestListener();

      return { success: true, message: '15-Minute Background Telemetry successfully activated.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to start background telemetry.' };
    }
  }

  public static async stopTracking(): Promise<void> {
    try {
      if (this.pollInterval) {
        clearInterval(this.pollInterval);
        this.pollInterval = null;
      }
      const registered = await this.isRegistered();
      if (registered) {
        await Location.stopLocationUpdatesAsync(REPPULSE_TELEMETRY_TASK_NAME);
      }
    } catch (err) {
      console.warn('[Telemetry Task] Failed to stop tracking:', err);
    }
  }

  /**
   * Listens for on-demand fresh GPS requests dispatched by RSM/Managers.
   */
  public static startOnDemandRequestListener(): void {
    if (this.pollInterval) return;
    this.pollInterval = setInterval(async () => {
      try {
        const session = await StorageService.getItem<UserProfile | null>(STORAGE_KEYS.AUTH_SESSION, null);
        if (!session) return;
        const empId = session.id || session.employeeCode;
        const pending = await SupabaseDbService.getPendingLocationRequests(empId);
        if (pending.length > 0) {
          console.log(`[Telemetry Listener] Detected ${pending.length} on-demand location request(s) from Manager.`);
          const freshLoc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          const timestampIso = new Date(freshLoc.timestamp).toISOString();

          // Push fresh location
          await SupabaseDbService.recordLocationTelemetry({
            employee_id: empId,
            user_id: session.id,
            latitude: freshLoc.coords.latitude,
            longitude: freshLoc.coords.longitude,
            accuracy_meters: freshLoc.coords.accuracy || 6,
            altitude_meters: (freshLoc.coords as any).altitude ?? undefined,
            speed_mps: freshLoc.coords.speed ?? undefined,
            bearing_degrees: (freshLoc.coords as any).heading ?? undefined,
            battery_percentage: 90,
            provider: 'fused',
            source: 'MANAGER_REQUEST',
            recorded_at: timestampIso,
          });

          // Mark requests completed
          for (const req of pending) {
            if (req.id) {
              await SupabaseDbService.respondToLocationRequest(req.id);
            }
          }
        }
      } catch (err) {
        // Silent catch for background polling
      }
    }, 20000); // Check every 20 seconds
  }
}
