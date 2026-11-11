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
   * Checks whether device-level location services / GPS is enabled.
   */
  public static async isLocationServicesEnabled(): Promise<boolean> {
    try {
      const status = await (Location as any).getProviderStatusAsync();
      return Boolean(status.locationServicesEnabled);
    } catch (err) {
      console.warn('[LocationService] Provider status check failed:', err);
      return true;
    }
  }

  /**
   * Requests foreground location permission from Android OS.
   * Checks status first to prevent Android 15/16/17 ActivityResultLauncher deadlock.
   */
  public static async requestForegroundPermission(): Promise<boolean> {
    try {
      const existing = await Location.getForegroundPermissionsAsync();
      if (existing && existing.status === 'granted') {
        return true;
      }
      const reqPromise = Location.requestForegroundPermissionsAsync();
      const timeoutPromise = new Promise<{ status: string }>((res) =>
        setTimeout(() => res({ status: 'denied' }), 6000)
      );
      const { status } = await Promise.race([reqPromise, timeoutPromise]);
      return status === 'granted';
    } catch (err) {
      console.warn('[LocationService] Permission request failed:', err);
      return false;
    }
  }

  /**
   * Gets single GPS fix with timeout, accuracy validation,
   * modern Android fallback, and strict Anti-Mock / Fake GPS hardware verification.
   */
  public static async getCurrentLocation(options?: { timeoutMs?: number }): Promise<LocationResult | null> {
    try {
      console.log('[LOCATION_REQUEST_STARTED] Checking permissions & services...');
      const hasPermission = await this.requestForegroundPermission();
      console.log('[LOCATION_PERMISSION_STATUS]', hasPermission ? 'GRANTED' : 'DENIED');
      if (!hasPermission) return null;

      const servicesEnabled = await this.isLocationServicesEnabled();
      console.log('[LOCATION_SERVICES_STATUS]', servicesEnabled ? 'ENABLED' : 'DISABLED');
      if (!servicesEnabled) {
        console.warn('[LocationService] Device location services are turned off.');
        return null;
      }

      const timeoutMs = options?.timeoutMs || 8000;

      // Wrap getCurrentPositionAsync with a timeout
      const getHighAccuracyPos = Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs));

      let loc: Location.LocationObject | null = await Promise.race([getHighAccuracyPos, timeoutPromise]);

      if (!loc) {
        console.warn(`[LocationService] High accuracy position timed out after ${timeoutMs}ms, attempting fallback...`);
        // Fallback 1: Last known position within recent 2 minutes
        try {
          loc = await (Location as any).getLastKnownPositionAsync({ maxAge: 120000 });
        } catch (e) {
          console.warn('[LocationService] getLastKnownPositionAsync failed:', e);
        }

        // Fallback 2: Balanced accuracy
        if (!loc) {
          try {
            console.log('[LocationService] Attempting Balanced accuracy fallback...');
            loc = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
          } catch (e) {
            console.warn('[LocationService] Balanced accuracy fallback failed:', e);
          }
        }
      }

      if (!loc) {
        console.error('[LOCATION_RESULT] Failed: No location fix available.');
        return null;
      }

      // Detect if the location was supplied by a mock provider (Developer Options / Fake GPS)
      const isMocked = Boolean(
        loc.mocked ||
        (loc as any).isFromMockProvider ||
        (loc as any).mock ||
        (loc.coords && (loc.coords as any).isMock)
      );

      const result: LocationResult = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        accuracyMeters: loc.coords.accuracy || 10,
        speedKmh: (loc.coords.speed || 0) * 3.6,
        isMockLocation: isMocked,
        timestamp: new Date(loc.timestamp).toISOString()
      };

      console.log('[LOCATION_RESULT] SUCCESS:', {
        lat: result.latitude,
        lng: result.longitude,
        accuracy: result.accuracyMeters,
        isMock: result.isMockLocation
      });
      console.log('[LOCATION_ACCURACY]', `±${result.accuracyMeters}m`);

      return result;
    } catch (err) {
      console.error('[LOCATION_RESULT] Failed to acquire current GPS fix:', err);
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
    // 1. Primary Engine: Device Native Google Play Geocoder
    try {
      const addresses = await (Location as any).reverseGeocodeAsync({ latitude, longitude });
      if (addresses && addresses.length > 0) {
        const addr = addresses[0];

        // If Android Google geocoder provided a full formatted address, use it cleaned up
        if (addr.formattedAddress && typeof addr.formattedAddress === 'string') {
          const cleaned = addr.formattedAddress.replace(/,?\s*India\s*$/i, '').trim();
          if (cleaned.length > 5) {
            return cleaned;
          }
        }

        // Assemble Google Maps address components:
        // [Street / Road], [Area / Locality], [City], [State], [PIN]
        const street = addr.street || addr.name || '';
        const locality = addr.subregion || addr.district || '';
        const city = addr.city || '';
        const state = addr.region || '';
        const pin = addr.postalCode || '';

        const parts: string[] = [];

        if (street) parts.push(street);
        if (locality && locality !== street && locality !== city) parts.push(locality);
        if (city && !parts.includes(city)) parts.push(city);
        if (state && !parts.includes(state)) parts.push(state);
        if (pin && !parts.includes(pin)) parts.push(pin);

        if (parts.length >= 2) {
          return parts.join(', ');
        }
      }
    } catch (err) {
      console.warn('[LocationService] Native Google reverse geocode attempt:', err);
    }

    // 2. Secondary Engine: OpenStreetMap / Nominatim fallback
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'RepPulse-Pharma-SFA/1.7' },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const address = data.address || {};
        const road = address.road || address.pedestrian || address.residential || '';
        const area = address.suburb || address.neighbourhood || '';
        const city = address.city || address.town || address.county || '';
        const state = address.state || '';
        const pin = address.postcode || '';

        const parts: string[] = [];
        if (road) parts.push(road);
        if (area && area !== road && area !== city) parts.push(area);
        if (city && !parts.includes(city)) parts.push(city);
        if (state && !parts.includes(state)) parts.push(state);
        if (pin && !parts.includes(pin)) parts.push(pin);

        if (parts.length >= 2) {
          return parts.join(', ');
        }
      }
    } catch (netErr) {
      console.warn('[LocationService] Network reverse geocode fallback:', netErr);
    }

    return `Area near ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`;
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

