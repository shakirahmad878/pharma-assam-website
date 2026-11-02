/**
 * RepPulse Pharma SFA — Canonical Business Timezone & Date Utilities
 * Configured Business Timezone: Asia/Kolkata (IST: UTC+05:30)
 */

export const BUSINESS_TIMEZONE = 'Asia/Kolkata';

/**
 * Returns canonical business date string in YYYY-MM-DD format based on Asia/Kolkata.
 * This guarantees consistent date checks regardless of device locale or UTC offset.
 */
export function getBusinessDateStr(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: BUSINESS_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/**
 * Returns formatted 12-hour time string in Asia/Kolkata (e.g. "10:28 AM").
 */
export function getBusinessTimeStr(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: BUSINESS_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Returns whether current Asia/Kolkata time is past the morning cutoff (default 10:30 AM).
 */
export function isPastBusinessCutoff(cutoffHour: number = 10, cutoffMinute: number = 30, date: Date = new Date()): boolean {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: BUSINESS_TIMEZONE,
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(date);
  const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10);
  const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10);
  return hour > cutoffHour || (hour === cutoffHour && minute > cutoffMinute);
}

/**
 * Returns whether a given ISO timestamp belongs to today in Asia/Kolkata.
 */
export function isTodayInBusinessTz(isoTimestampOrDateStr: string): boolean {
  if (!isoTimestampOrDateStr) return false;
  const todayStr = getBusinessDateStr();
  if (isoTimestampOrDateStr.length === 10 && isoTimestampOrDateStr.includes('-')) {
    return isoTimestampOrDateStr === todayStr;
  }
  try {
    const d = new Date(isoTimestampOrDateStr);
    return getBusinessDateStr(d) === todayStr;
  } catch {
    return false;
  }
}

