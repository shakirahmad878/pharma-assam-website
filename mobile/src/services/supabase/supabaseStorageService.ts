/**
 * RepPulse Supabase Cloud Storage Engine (Mobile Edition)
 * -------------------------------------------------------
 * Handles secure multipart upload of geotagged attendance selfies
 * directly to the Supabase Cloud Storage bucket 'attendance-selfies'.
 */

import { SUPABASE_CONFIG, isSupabaseConfigured } from '../../config/supabase';

export interface SelfieUploadResult {
  success: boolean;
  publicUrl?: string;
  error?: string;
  isLocalFallback?: boolean;
}

export class SupabaseStorageService {
  /**
   * Uploads an attendance front-camera selfie to Supabase Storage
   * @param params localUri, employeeCode, date
   */
  public static async uploadAttendanceSelfie(params: {
    localUri: string;
    employeeCode: string;
    date: string;
  }): Promise<SelfieUploadResult> {
    try {
      if (!params.localUri) {
        return { success: false, error: 'No selfie image provided' };
      }

      // If already a remote URL, return as-is
      if (params.localUri.startsWith('http://') || params.localUri.startsWith('https://')) {
        return { success: true, publicUrl: params.localUri };
      }

      if (!isSupabaseConfigured()) {
        console.warn('[SupabaseStorageService] Supabase not configured. Keeping local URI.');
        return { success: false, publicUrl: params.localUri, isLocalFallback: true, error: 'Cloud offline' };
      }

      const cleanCode = (params.employeeCode || 'MR').replace(/[^a-zA-Z0-9_-]/g, '_');
      const timestamp = Date.now();
      const filename = `${cleanCode}_${params.date}_${timestamp}.jpg`;
      const objectPath = `${cleanCode}/${filename}`;

      console.log(`[SupabaseStorageService] Uploading attendance selfie to attendance-selfies/${objectPath}...`);

      // Prepare standard React Native FormData
      const formData = new FormData();
      formData.append('file', {
        uri: params.localUri,
        name: filename,
        type: 'image/jpeg',
      } as any);

      const res = await fetch(
        `${SUPABASE_CONFIG.url}/storage/v1/object/attendance-selfies/${objectPath}`,
        {
          method: 'POST',
          headers: {
            apikey: SUPABASE_CONFIG.apiKey,
            Authorization: `Bearer ${SUPABASE_CONFIG.apiKey}`,
            // Let the engine set multipart boundary automatically
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`[SupabaseStorageService] Upload HTTP ${res.status}: ${errText}`);
        return {
          success: false,
          publicUrl: params.localUri,
          isLocalFallback: true,
          error: `HTTP ${res.status}: ${errText}`,
        };
      }

      // Supabase public URL format
      const publicUrl = `${SUPABASE_CONFIG.url}/storage/v1/object/public/attendance-selfies/${objectPath}`;
      console.log('[SupabaseStorageService] Selfie successfully uploaded:', publicUrl);
      return { success: true, publicUrl };
    } catch (err: any) {
      console.warn('[SupabaseStorageService] Upload exception:', err);
      return {
        success: false,
        publicUrl: params.localUri,
        isLocalFallback: true,
        error: err?.message || 'Network failure',
      };
    }
  }
}
