import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  AUTH_SESSION: '@REPPULSE_AUTH_SESSION_V1',
  DOCTORS_CACHE: '@REPPULSE_DOCTORS_CACHE_V1',
  PRODUCTS_CACHE: '@REPPULSE_PRODUCTS_CACHE_V1',
  VISITS_LOCAL: '@REPPULSE_VISITS_LOCAL_V1',
  ATTENDANCE_LOCAL: '@REPPULSE_ATTENDANCE_LOCAL_V1',
  ORDERS_LOCAL: '@REPPULSE_ORDERS_LOCAL_V1',
  OFFLINE_SYNC_QUEUE: '@REPPULSE_SYNC_QUEUE_V1',
  TELEMETRY_QUEUE: '@REPPULSE_TELEMETRY_QUEUE_V1',
  LATE_LOGIN_APPROVAL: '@REPPULSE_LATE_LOGIN_APPROVAL_V1',
  MR_LOGIN_PIN: '@REPPULSE_MR_LOGIN_PIN_V1',
  FIRMS_CACHE: '@REPPULSE_FIRMS_CACHE_V1',
  SETTINGS: '@REPPULSE_SETTINGS_V1',
};

export class StorageService {
  public static async getItem<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : defaultValue;
    } catch (err) {
      console.warn(`[StorageService] Failed to read key: ${key}`, err);
      return defaultValue;
    }
  }

  public static async setItem<T>(key: string, value: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`[StorageService] Failed to write key: ${key}`, err);
      return false;
    }
  }

  public static async removeItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (err) {
      console.error(`[StorageService] Failed to delete key: ${key}`, err);
      return false;
    }
  }

  public static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (err) {
      console.error('[StorageService] Failed to clear storage', err);
    }
  }
}
