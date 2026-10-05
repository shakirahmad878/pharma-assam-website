import { LocationTelemetryPoint, Doctor, UserRole } from '../types';
import { INITIAL_TELEMETRY_LOGS, INITIAL_DOCTORS } from '../data/mockData';
import { AuthService } from './authService';

export class TelemetryService {
  private static logs: LocationTelemetryPoint[] = [...INITIAL_TELEMETRY_LOGS];

  // Calculate Haversine distance in meters
  static calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  // Check if coordinates fall within doctor geofence (100m)
  static checkDoctorGeofence(lat: number, lon: number, doctor: Doctor): { isWithin: boolean; distanceMeters: number } {
    const dist = this.calculateDistanceMeters(
      lat,
      lon,
      doctor.clinicLocation?.latitude || 24.8146,
      doctor.clinicLocation?.longitude || 92.8037
    );
    return {
      isWithin: dist <= doctor.geofenceRadiusMeters,
      distanceMeters: Math.round(dist),
    };
  }

  // Get telemetry logs - PROTECTED BY STRICT RBAC (ADMIN ONLY)
  static getTelemetryLogs(requestingUserRole: UserRole): { success: boolean; data?: LocationTelemetryPoint[]; error?: string } {
    if (requestingUserRole !== 'SUPER_ADMIN') {
      return {
        success: false,
        error: 'ACCESS_DENIED: Employee real-time location telemetry is strictly confidential and restricted to Super Admin only.',
      };
    }
    return {
      success: true,
      data: this.logs,
    };
  }

  // Ingest automated 15-minute background location ping
  static ingest15MinPing(point: Omit<LocationTelemetryPoint, 'id' | 'capturedAt'>): LocationTelemetryPoint {
    // Correlate with doctors for geofencing
    let nearbyDocId: string | undefined;
    let isWithinGeofence = false;

    for (const doc of INITIAL_DOCTORS) {
      const { isWithin } = this.checkDoctorGeofence(point.latitude, point.longitude, doc);
      if (isWithin) {
        nearbyDocId = doc.id;
        isWithinGeofence = true;
        break;
      }
    }

    const newLog: LocationTelemetryPoint = {
      ...point,
      id: `tel-${Date.now()}`,
      capturedAt: new Date().toISOString(),
      nearbyDoctorId: nearbyDocId,
      isWithinDoctorGeofence: isWithinGeofence,
    };

    this.logs.push(newLog);
    return newLog;
  }
}
