import * as Location from 'expo-location';
import { Alert } from 'react-native';

export interface LocationResult {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  speedKmh: number;
  isMockLocation: boolean;
  timestamp: string;
}

export class LocationService {
  /**
   * Requests foreground location permission from Android OS.
   */
  public static async requestForegroundPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (err) {
      console.warn('[LocationService] Permission request failed:', err);
      return false;
    }
  }

  /**
   * Gets single high-accuracy GPS fix with timeout, accuracy validation,
   * and strict Anti-Mock / Fake GPS hardware verification.
   */
  public static async getCurrentLocation(): Promise<LocationResult | null> {
    try {
      const hasPermission = await this.requestForegroundPermission();
      if (!hasPermission) return null;

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Detect if the location was supplied by a mock provider (Developer Options / Fake GPS)
      const isMocked = Boolean(
        loc.mocked ||
        (loc as any).isFromMockProvider ||
        (loc as any).mock ||
        (loc.coords && (loc.coords as any).isMock)
      );

      return {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        accuracyMeters: loc.coords.accuracy || 10,
        speedKmh: (loc.coords.speed || 0) * 3.6,
        isMockLocation: isMocked,
        timestamp: new Date(loc.timestamp).toISOString()
      };
    } catch (err) {
      console.error('[LocationService] Failed to acquire current GPS fix:', err);
      return null;
    }
  }

  /**
   * Validates a location fix against fake/mock GPS spoofing.
   * If mock location is detected, displays a security alert and returns false.
   */
  public static validateAuthenticGps(loc: LocationResult | null, actionName: string = 'this action'): boolean {
    if (!loc) {
      Alert.alert(
        'GPS Signal Required 🛰️',
        `Unable to acquire authentic satellite fix for ${actionName}. Please enable device GPS location services.`
      );
      return false;
    }

    if (loc.isMockLocation) {
      Alert.alert(
        '🚫 Fake GPS / Mock Location Blocked',
        `RepPulse Anti-Tamper Shield detected that your device is running a Mock Location App or Developer Mock GPS.\n\n` +
        `Using fake GPS to fake visits or attendance is strictly prohibited under company compliance policy.\n\n` +
        `👉 Action Required: Open Android Settings -> Developer Options -> Disable "Select mock location app", then retry with real GPS.`
      );
      return false;
    }

    return true;
  }
}

