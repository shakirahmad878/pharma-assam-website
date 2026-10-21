/**
 * Haversine formula to calculate the great-circle distance between two GPS coordinates in meters.
 */
export function calculateHaversineDistance(
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
  return R * c; // In meters
}

/**
 * Validates whether an MR check-in point is within the 100-meter clinic geofence.
 */
export function isWithinDoctorGeofence(
  doctorLat: number,
  doctorLng: number,
  checkInLat: number,
  checkInLng: number,
  radiusMeters: number = 100
): { isInside: boolean; distanceMeters: number } {
  const dist = calculateHaversineDistance(doctorLat, doctorLng, checkInLat, checkInLng);
  return {
    isInside: dist <= radiusMeters,
    distanceMeters: Math.round(dist * 10) / 10
  };
}