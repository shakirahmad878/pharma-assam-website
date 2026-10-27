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
    accuracyMeters: number;
    isWithinRadius: boolean;
    accuracyAcceptable: boolean;
    canStartVisit: boolean;
    statusText: string;
  } {
    if (isMockLocation) {
      return {
        status: 'OUTSIDE_RADIUS',
        distanceMeters: 9999,
        accuracyMeters: currentAccuracyMeters,
        isWithinRadius: false,
        accuracyAcceptable: false,
        canStartVisit: false,
        statusText: '🚫 Fake GPS Blocked: Developer mock location detected. Turn off mock apps in settings.'
      };
    }

    const distance = this.calculateDistanceMeters(clinicLat, clinicLng, currentLat, currentLng);
    // Allow realistic indoor GPS satellite reception tolerance up to 100m for field clinics
    const accuracyAcceptable = currentAccuracyMeters <= 100.0;
    const isWithinRadius = distance <= radiusMeters;
    const canStartVisit = isWithinRadius && accuracyAcceptable;

    let status: GeofenceStatus = 'OUTSIDE_RADIUS';
    let statusText = `Outside Clinic Radius (${distance}m away / max ${radiusMeters}m)`;

    if (canStartVisit) {
      status = 'WITHIN_RADIUS';
      statusText = `Within Clinic Geofence (${distance}m away • GPS ±${Math.round(currentAccuracyMeters)}m). Verification Passed.`;
    } else if (isWithinRadius && !accuracyAcceptable) {
      status = 'LOCATION_ACCURACY_LOW';
      statusText = `Low GPS Accuracy (±${Math.round(currentAccuracyMeters)}m). Step near window for satellite fix...`;
    }

    return {
      status,
      distanceMeters: distance,
      accuracyMeters: currentAccuracyMeters,
      isWithinRadius,
      accuracyAcceptable,
      canStartVisit,
      statusText
    };
  }

  /**
   * Evaluates geofence across multiple registered clinics/chambers for a doctor.
   * Finds the closest chamber and passes if the rep is within radius of ANY registered chamber!
   */
  public static evaluateMultiClinicGeofence(
    clinics: { id?: string; name: string; latitude: number; longitude: number }[],
    currentLat: number,
    currentLng: number,
    currentAccuracyMeters: number,
    radiusMeters: number = 100,
    isMockLocation: boolean = false
  ): {
    status: GeofenceStatus;
    distanceMeters: number;
    accuracyMeters: number;
    isWithinRadius: boolean;
    accuracyAcceptable: boolean;
    canStartVisit: boolean;
    statusText: string;
    matchedClinicName: string;
  } {
    if (!clinics || clinics.length === 0) {
      return {
        ...this.evaluateGeofence(0, 0, currentLat, currentLng, currentAccuracyMeters, radiusMeters, isMockLocation),
        matchedClinicName: 'Primary Clinic',
      };
    }

    if (isMockLocation) {
      return {
        status: 'OUTSIDE_RADIUS',
        distanceMeters: 9999,
        accuracyMeters: currentAccuracyMeters,
        isWithinRadius: false,
        accuracyAcceptable: false,
        canStartVisit: false,
        statusText: '🚫 Fake GPS Blocked: Developer mock location detected. Turn off mock apps in settings.',
        matchedClinicName: clinics[0].name,
      };
    }

    const accuracyAcceptable = currentAccuracyMeters <= 100.0;

    // Calculate distance to each clinic
    const evaluations = clinics.map(c => {
      const dist = this.calculateDistanceMeters(c.latitude, c.longitude, currentLat, currentLng);
      return {
        clinic: c,
        distance: dist,
        isWithin: dist <= radiusMeters,
      };
    });

    // Check if any clinic is within radius
    const withinClinic = evaluations.find(e => e.isWithin);

    if (withinClinic) {
      const canStartVisit = accuracyAcceptable;
      return {
        status: canStartVisit ? 'WITHIN_RADIUS' : 'LOCATION_ACCURACY_LOW',
        distanceMeters: withinClinic.distance,
        accuracyMeters: currentAccuracyMeters,
        isWithinRadius: true,
        accuracyAcceptable,
        canStartVisit,
        statusText: canStartVisit
          ? `Within Geofence (${withinClinic.distance}m from ${withinClinic.clinic.name} • GPS ±${Math.round(currentAccuracyMeters)}m). Verification Passed.`
          : `Low GPS Accuracy (±${Math.round(currentAccuracyMeters)}m). Step near window for satellite fix...`,
        matchedClinicName: withinClinic.clinic.name,
      };
    }

    // Otherwise, find the closest clinic among all registered chambers
    evaluations.sort((a, b) => a.distance - b.distance);
    const closest = evaluations[0];

    return {
      status: 'OUTSIDE_RADIUS',
      distanceMeters: closest.distance,
      accuracyMeters: currentAccuracyMeters,
      isWithinRadius: false,
      accuracyAcceptable,
      canStartVisit: false,
      statusText: `Outside Clinic Radius (${closest.distance}m from ${closest.clinic.name} / max ${radiusMeters}m)`,
      matchedClinicName: closest.clinic.name,
    };
  }
}
