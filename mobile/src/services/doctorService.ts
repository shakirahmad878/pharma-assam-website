import { Doctor } from '../types';
import { StorageService, STORAGE_KEYS } from './storageService';
import { FirestoreDbService, DoctorDeletionRequest } from './firebase/firestoreDbService';

export class DoctorService {
  public static async getDoctors(): Promise<Doctor[]> {
    return await FirestoreDbService.fetchDoctors();
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
      const updates: Partial<Doctor> = {
        todayVisitStatus: status,
      };
      if (status === 'COMPLETED') {
        updates.completedVisitsThisMonth = (doc.completedVisitsThisMonth || 0) + 1;
        updates.lastVisitDate = new Date().toISOString().split('T')[0];
      }
      await FirestoreDbService.updateDoctor(id, updates);
    }
  }

  public static async addDoctor(newDoc: Partial<Doctor>): Promise<Doctor> {
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
    await FirestoreDbService.addDoctor(doc);
    return doc;
  }

  public static async updateDoctorTier(id: string, tier: Doctor['tier']): Promise<void> {
    await FirestoreDbService.updateDoctor(id, { tier });
  }

  public static async updateDoctor(id: string, updatedFields: Partial<Doctor>): Promise<Doctor | null> {
    const doctors = await this.getDoctors();
    const current = doctors.find(d => d.id === id);
    if (!current) return null;

    const updated: Doctor = {
      ...current,
      ...updatedFields,
    };
    await FirestoreDbService.updateDoctor(id, updatedFields);
    return updated;
  }

  public static async deleteDoctor(id: string): Promise<boolean> {
    await FirestoreDbService.deleteDoctor(id);
    return true;
  }

  public static async requestDoctorDeletion(
    doctorId: string,
    doctorName: string,
    reason: string,
    mrName = 'Pranjal Malakar (MR)'
  ): Promise<{ success: boolean; requestId: string }> {
    const requestId = await FirestoreDbService.submitDeletionRequest({
      doctorId,
      doctorName,
      reason: reason.trim() || 'Duplicate / Wrong entry',
      requestedBy: mrName,
    });
    return { success: true, requestId };
  }

  public static async getPendingDeletionRequests(): Promise<DoctorDeletionRequest[]> {
    return await FirestoreDbService.getPendingDeletionRequests();
  }

  public static async approveDoctorDeletion(
    requestId: string,
    doctorId: string,
    managerName = 'Bodrud Jaman Sadiol (RSM)'
  ): Promise<void> {
    await FirestoreDbService.approveDeletionRequest(requestId, doctorId, managerName);
  }
}
