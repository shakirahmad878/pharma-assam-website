import { Doctor } from '../types';
import { StorageService, STORAGE_KEYS } from './storageService';
import { MOCK_DOCTORS } from '../constants/mockData';

export class DoctorService {
  public static async getDoctors(): Promise<Doctor[]> {
    const cached = await StorageService.getItem<Doctor[]>(STORAGE_KEYS.DOCTORS_CACHE, []);
    return cached || [];
  }

  public static async clearAllDoctors(): Promise<void> {
    await StorageService.setItem(STORAGE_KEYS.DOCTORS_CACHE, []);
  }

  public static async getDoctorById(id: string): Promise<Doctor | null> {
    const doctors = await this.getDoctors();
    return doctors.find(d => d.id === id) || null;
  }

  public static async getDoctorsByRoute(routeId: string): Promise<Doctor[]> {
    const doctors = await this.getDoctors();
    return doctors.filter(d => d.routeId === routeId);
  }

  public static async updateDoctorTodayStatus(id: string, status: Doctor['todayVisitStatus']): Promise<void> {
    const doctors = await this.getDoctors();
    const doc = doctors.find(d => d.id === id);
    if (doc) {
      doc.todayVisitStatus = status;
      if (status === 'COMPLETED') {
        doc.completedVisitsThisMonth += 1;
        doc.lastVisitDate = new Date().toISOString().split('T')[0];
      }
      await StorageService.setItem(STORAGE_KEYS.DOCTORS_CACHE, doctors);
    }
  }

  public static async addDoctor(newDoc: Partial<Doctor>): Promise<Doctor> {
    const doctors = await this.getDoctors();
    const doc: Doctor = {
      id: 'doc-barak-' + Date.now(),
      name: newDoc.name || 'New Doctor',
      qualification: newDoc.qualification || 'MBBS',
      specialty: newDoc.specialty || 'General Practitioner',
      tier: newDoc.tier || 'B',
      clinicName: newDoc.clinicName || 'Clinic Chamber',
      clinicAddress: newDoc.clinicAddress || 'Silchar, Assam',
      district: newDoc.district || 'Cachar',
      area: newDoc.area || 'Hospital Road',
      routeId: newDoc.routeId || 'route-cachar-01',
      latitude: newDoc.latitude || 24.8215,
      longitude: newDoc.longitude || 92.7970,
      geofenceRadiusMeters: 100,
      phone: newDoc.phone || '+91 9435000000',
      monthlyVisitTarget: 8,
      completedVisitsThisMonth: 0,
      todayVisitStatus: 'PENDING',
      isAssignedToMe: true,
    };
    const updated = [doc, ...doctors];
    await StorageService.setItem(STORAGE_KEYS.DOCTORS_CACHE, updated);
    return doc;
  }

  public static async updateDoctorTier(id: string, tier: Doctor['tier']): Promise<void> {
    const doctors = await this.getDoctors();
    const doc = doctors.find(d => d.id === id);
    if (doc) {
      doc.tier = tier;
      await StorageService.setItem(STORAGE_KEYS.DOCTORS_CACHE, doctors);
    }
  }

  public static async updateDoctor(id: string, updatedFields: Partial<Doctor>): Promise<Doctor | null> {
    const doctors = await this.getDoctors();
    const index = doctors.findIndex(d => d.id === id);
    if (index === -1) return null;

    const current = doctors[index];
    const updated: Doctor = {
      ...current,
      ...updatedFields,
    };
    doctors[index] = updated;
    await StorageService.setItem(STORAGE_KEYS.DOCTORS_CACHE, doctors);
    return updated;
  }

  public static async deleteDoctor(id: string): Promise<boolean> {
    const doctors = await this.getDoctors();
    const filtered = doctors.filter(d => d.id !== id);
    await StorageService.setItem(STORAGE_KEYS.DOCTORS_CACHE, filtered);
    return true;
  }

  public static async requestDoctorDeletion(
    doctorId: string,
    doctorName: string,
    reason: string,
    mrName = 'Pranjal Malakar (MR)'
  ): Promise<{ success: boolean; requestId: string }> {
    const existing = await StorageService.getItem<any[]>(STORAGE_KEYS.DOCTOR_DELETE_REQUESTS, []);
    const request = {
      id: 'del-req-' + Date.now(),
      doctorId,
      doctorName,
      reason: reason.trim() || 'Duplicate / Wrong entry',
      requestedBy: mrName,
      requestedAt: new Date().toISOString(),
      status: 'PENDING',
    };
    await StorageService.setItem(STORAGE_KEYS.DOCTOR_DELETE_REQUESTS, [request, ...existing]);
    return { success: true, requestId: request.id };
  }

  public static async getPendingDeletionRequests(): Promise<any[]> {
    return await StorageService.getItem<any[]>(STORAGE_KEYS.DOCTOR_DELETE_REQUESTS, []);
  }
}
