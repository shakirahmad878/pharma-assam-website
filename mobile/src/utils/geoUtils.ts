/**
 * RepPulse Field Telemetry & Geographic Utilities
 * -----------------------------------------------
 * Accurate Haversine distance, cardinal bearings, and temporal freshness ratings.
 */

export type LocationFreshness = 'LIVE' | 'RECENT' | 'DELAYED' | 'STALE';

/**
 * Calculates Great-Circle geographic distance between two points in Kilometers using Haversine formula.
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (lat1 === lat2 && lon1 === lon2) return 0;

  const R = 6371; // Earth's mean radius in kilometers
  const toRad = Math.PI / 180;
  const dLat = (lat2 - lat1) * toRad;
  const dLon = (lon2 - lon1) * toRad;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;

  return Math.round(dist * 10) / 10; // Round to 1 decimal place (e.g. 1.8 km)
}

/**
 * Converts degrees (0-360) into standard cardinal directions (North, North-East, etc.)
 */
export function getCardinalDirection(bearingDegrees: number | null | undefined): string {
  if (bearingDegrees === null || bearingDegrees === undefined || isNaN(bearingDegrees)) {
    return '';
  }

  const normalized = (bearingDegrees % 360 + 360) % 360;
  const directions = [
    'North',
    'North-East',
    'East',
    'South-East',
    'South',
    'South-West',
    'West',
    'North-West',
  ];
  const index = Math.round(normalized / 45) % 8;
  return directions[index];
}

/**
 * Determines exact location freshness tier and human-readable time elapsed.
 * Thresholds based on 15-minute standard telemetry:
 *  - 0 to 5 mins:   LIVE (🟢 Real-time fix)
 *  - 5 to 15 mins:  RECENT (🔵 Fresh standard telemetry)
 *  - 15 to 60 mins: DELAYED (🟡 Device background/Doze latency)
 *  - > 60 mins:     STALE / OFFLINE (⚪ Last known location)
 */
export function determineLocationFreshness(timestampIso: string | null | undefined): {
  status: LocationFreshness;
  diffMinutes: number;
  timeAgoText: string;
} {
  if (!timestampIso) {
    return { status: 'STALE', diffMinutes: Infinity, timeAgoText: 'No GPS fix today' };
  }

  const recordedTime = new Date(timestampIso).getTime();
  if (isNaN(recordedTime)) {
    return { status: 'STALE', diffMinutes: Infinity, timeAgoText: 'Invalid timestamp' };
  }

  const diffMs = Math.max(0, Date.now() - recordedTime);
  const diffSec = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  let timeAgoText = '';
  if (diffSec < 45) {
    timeAgoText = 'Just now';
  } else if (diffSec < 90) {
    timeAgoText = '1 min ago';
  } else if (diffMinutes < 60) {
    timeAgoText = `${diffMinutes} mins ago`;
  } else if (diffHours === 1) {
    timeAgoText = '1 hour ago';
  } else if (diffHours < 24) {
    timeAgoText = `${diffHours} hours ago`;
  } else if (diffDays === 1) {
    timeAgoText = 'Yesterday';
  } else {
    timeAgoText = `${diffDays} days ago`;
  }

  let status: LocationFreshness = 'STALE';
  if (diffMinutes <= 5) {
    status = 'LIVE';
  } else if (diffMinutes <= 15) {
    status = 'RECENT';
  } else if (diffMinutes <= 60) {
    status = 'DELAYED';
  } else {
    status = 'STALE';
  }

  return { status, diffMinutes, timeAgoText };
}
