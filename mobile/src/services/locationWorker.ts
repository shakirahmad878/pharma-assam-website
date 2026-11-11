import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BACKGROUND_LOCATION_TASK = 'REPPULSE_BACKGROUND_15MIN_LOCATION_TASK';

// Register Background Location Task
TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error('[BACKGROUND_LOCATION_TASK] Error:', error.message);
    return;
  }
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    if (locations && locations.length > 0) {
      const location = locations[0];
      const ping = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracyMeters: location.coords.accuracy || 0,
        speedKmh: (location.coords.speed || 0) * 3.6,
        isMockLocation: location.mocked || false,
        capturedAt: new Date(location.timestamp).toISOString()
      };

      console.log('[15-MIN BACKGROUND LOCATION] Captured Ping:', ping);

      try {
        // Save locally in offline queue
        const stored = await AsyncStorage.getItem('OFFLINE_LOCATION_QUEUE');
        const queue = stored ? JSON.parse(stored) : [];
        queue.push(ping);
        await AsyncStorage.setItem('OFFLINE_LOCATION_QUEUE', JSON.stringify(queue));
      } catch (err) {
        console.error('Failed to store background location ping:', err);
      }
    }
  }
});

export class MobileLocationManager {
  public static async startBackgroundTracking(): Promise<boolean> {
    const existingFg = await Location.getForegroundPermissionsAsync();
    let foregroundGranted = existingFg && existingFg.status === 'granted';
    if (!foregroundGranted) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      foregroundGranted = status === 'granted';
    }
    if (!foregroundGranted) {
      console.warn('Foreground location permission denied');
      return false;
    }

    const existingBg = await Location.getBackgroundPermissionsAsync();
    let backgroundGranted = existingBg && existingBg.status === 'granted';
    if (!backgroundGranted) {
      const { status } = await Location.requestBackgroundPermissionsAsync();
      backgroundGranted = status === 'granted';
    }
    if (!backgroundGranted) {
      console.warn('Background location permission denied');
      return false;
    }

    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK);
    if (!isRegistered) {
      await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 15 * 60 * 1000, // Every 15 Minutes
        distanceInterval: 50,         // 50 meters displacement
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: 'RepPulse Active Duty',
          notificationBody: 'Logging 15-minute background compliance coordinates.',
          notificationColor: '#0F172A'
        }
      });
      console.log('15-Minute Background Location Tracking started successfully.');
    }
    return true;
  }

  public static async stopBackgroundTracking(): Promise<void> {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK);
    if (isRegistered) {
      await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
      console.log('Background Location Tracking stopped.');
    }
  }
}
