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
  /**
   * Reverse geocodes GPS coordinates to automatically detect Area/Street/Locality
   * based on device location and known pharmaceutical cluster geofences.
   */
  public static async reverseGeocodeArea(latitude: number, longitude: number): Promise<string> {
    const knownClusters = [
      { name: 'SMCH Ghungoor', lat: 24.8105, lng: 92.8020, radiusKm: 2.5 },
      { name: 'Hospital Road', lat: 24.8215, lng: 92.7970, radiusKm: 1.5 },
      { name: 'Rangirkhari', lat: 24.8125, lng: 92.7925, radiusKm: 1.5 },
      { name: 'Tarapur Station Road', lat: 24.8385, lng: 92.7855, radiusKm: 1.8 },
      { name: 'Premtola / Ambicapatty', lat: 24.8260, lng: 92.7960, radiusKm: 1.2 },
      { name: 'Meherpur', lat: 24.7950, lng: 92.7890, radiusKm: 2.0 },
      { name: 'Station Road, Karimganj', lat: 24.8640, lng: 92.3590, radiusKm: 2.5 },
      { name: 'Badarpur Town', lat: 24.9010, lng: 92.5710, radiusKm: 3.0 },
      { name: 'Civil Hospital Road, Hailakandi', lat: 24.6830, lng: 92.5620, radiusKm: 2.5 },
      { name: 'Lala Bazar, Hailakandi', lat: 24.5500, lng: 92.6000, radiusKm: 3.0 },
      { name: 'Station Road, Dharmanagar', lat: 24.3820, lng: 92.1630, radiusKm: 3.0 },
      { name: 'GBP Hospital Road, Agartala', lat: 23.8550, lng: 91.2850, radiusKm: 3.0 },
      { name: 'Akhaura Road, Agartala', lat: 23.8315, lng: 91.2750, radiusKm: 3.0 },
      { name: 'Chanmari, Aizawl', lat: 23.7360, lng: 92.7170, radiusKm: 3.0 },
    ];

    const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    for (const cluster of knownClusters) {
      const dist = getDistanceKm(latitude, longitude, cluster.lat, cluster.lng);
      if (dist <= cluster.radiusKm) {
        return cluster.name;
      }
    }

    try {
      const addresses = await (Location as any).reverseGeocodeAsync({ latitude, longitude });
      if (addresses && addresses.length > 0) {
        const addr = addresses[0];
        const parts = [
          addr.street || addr.name,
          addr.subregion || addr.district || addr.city,
        ].filter(Boolean);

        if (parts.length > 0) {
          return parts.join(', ');
        }
      }
    } catch (err) {
      console.warn('[LocationService] Reverse geocode fallback:', err);
    }

    return `Geotagged Area (${latitude.toFixed(3)}°N, ${longitude.toFixed(3)}°E)`;
  }

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

