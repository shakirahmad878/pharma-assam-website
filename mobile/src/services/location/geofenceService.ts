import { GeofenceStatus } from '../../types';

export class GeofenceService {
  /**
   * Calculates the Haversine distance between two GPS coordinates in meters.
   */
  public static calculateDistanceMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Earth radius in meters
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    
    const phi1 = toRad(lat1);
    const phi2 = toRad(lat2);
    const deltaPhi = toRad(lat2 - lat1);
    const deltaLambda = toRad(lon2 - lon1);

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10; // Round to 1 decimal place
  }

  /**
   * Evaluates geofence status with location accuracy threshold gating
   * and strict mock location rejection.
   */
  public static evaluateGeofence(
    clinicLat: number,
    clinicLng: number,
    currentLat: number,
    currentLng: number,
    currentAccuracyMeters: number,
    radiusMeters: number = 100,
    isMockLocation: boolean = false
  ): {
    status: GeofenceStatus;
    distanceMeters: number;
    isWithinRadius: boolean;
    accuracyAcceptable: boolean;
    statusText: string;
  } {
    if (isMockLocation) {
      return {
        status: 'OUTSIDE_RADIUS',
        distanceMeters: 9999,
        isWithinRadius: false,
        accuracyAcceptable: false,
        statusText: '🚫 Fake GPS Blocked: Developer mock location detected. Turn off mock apps in settings.'
      };
    }

    const distance = this.calculateDistanceMeters(clinicLat, clinicLng, currentLat, currentLng);
    const accuracyAcceptable = currentAccuracyMeters <= 35.0; // Max allowable accuracy tolerance
    const isWithinRadius = distance <= radiusMeters;

    let status: GeofenceStatus = 'OUTSIDE_RADIUS';
    let statusText = `Outside Clinic Radius (${distance}m away / max ${radiusMeters}m)`;

    if (!accuracyAcceptable) {
      status = 'LOCATION_ACCURACY_LOW';
      statusText = `Low GPS Accuracy (±${currentAccuracyMeters}m). Waiting for stronger satellite fix...`;
    } else if (isWithinRadius) {
      status = 'WITHIN_RADIUS';
      statusText = `Within Clinic Geofence (${distance}m away). Verification Passed.`;
    }

    return {
      status,
      distanceMeters: distance,
      isWithinRadius: isWithinRadius && accuracyAcceptable,
      accuracyAcceptable,
      statusText
    };
  }
}
