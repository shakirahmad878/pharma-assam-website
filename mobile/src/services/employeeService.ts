import { UserProfile, UserRole } from '../types';
import { StorageService, STORAGE_KEYS } from './storageService';
import { ALL_APP_USERS } from '../constants/mockData';
import { FirestoreDbService } from './firebase/firestoreDbService';
import { db, isFirebaseConfigured } from '../config/firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

export class EmployeeService {
  private static EMPLOYEES_STORAGE_KEY = '@REPPULSE_ALL_EMPLOYEES_V2';

  public static async getEmployees(): Promise<UserProfile[]> {
    // 1. Check Cloud Firestore if connected
    if (isFirebaseConfigured() && db) {
      try {
        const colRef = collection(db, 'employees');
        const snap = await getDocs(colRef);
        if (!snap.empty) {
          const list: UserProfile[] = [];
          snap.forEach((d) => {
            const data = d.data() as UserProfile;
            list.push({ ...data, id: d.id });
          });
          await StorageService.setItem(this.EMPLOYEES_STORAGE_KEY, list);
          return list;
        }
      } catch (e) {
        console.warn('[EmployeeService] Firestore fetch error, falling back to cache:', e);
      }
    }

    // 2. Check local storage cache
    const cached = await StorageService.getItem<UserProfile[]>(this.EMPLOYEES_STORAGE_KEY, []);
    if (cached && cached.length > 0) {
      return cached;
    }

    // 3. Fallback to default mock users and seed cache
    await StorageService.setItem(this.EMPLOYEES_STORAGE_KEY, ALL_APP_USERS);
    return ALL_APP_USERS;
  }

  public static async getEmployeeById(id: string): Promise<UserProfile | null> {
    const list = await this.getEmployees();
    return list.find((e) => e.id === id || e.employeeCode === id) || null;
  }

  public static async addEmployee(emp: {
    name: string;
    email?: string;
    role: UserRole;
    employeeCode: string;
    phone: string;
    territory: string;
    headquarter: string;
    assignedRouteIds?: string[];
  }): Promise<UserProfile> {
    const cleanDigits = emp.phone.replace(/\D/g, '').slice(0, 10);
    const id = `usr-${emp.role.toLowerCase()}-${emp.employeeCode}`;

    const newEmp: UserProfile = {
      id,
      name: emp.name.trim(),
      email: emp.email || `${emp.name.toLowerCase().replace(/\s+/g, '.')}@reppulse.com`,
      role: emp.role,
      employeeCode: emp.employeeCode.trim(),
      phone: cleanDigits,
      territory: emp.territory.trim(),
      headquarter: emp.headquarter.trim(),
      assignedRouteIds: emp.assignedRouteIds || ['route-cachar-01'],
      activeRouteId: (emp.assignedRouteIds && emp.assignedRouteIds[0]) || 'route-cachar-01',
    };

    // 1. Update Local Storage Cache
    const existing = await this.getEmployees();
    const updated = [newEmp, ...existing.filter((e) => e.employeeCode !== newEmp.employeeCode && e.id !== newEmp.id)];
    await StorageService.setItem(this.EMPLOYEES_STORAGE_KEY, updated);

    // 2. Set default PIN for this user
    await StorageService.setItem(`@REPPULSE_USER_PIN_${newEmp.employeeCode}`, '1234');
    if (cleanDigits) {
      await StorageService.setItem(`@REPPULSE_USER_PIN_${cleanDigits}`, '1234');
    }

    // 3. Sync to Cloud Firestore if connected
    if (isFirebaseConfigured() && db) {
      try {
        const docRef = doc(db, 'employees', newEmp.id);
        await setDoc(docRef, {
          ...newEmp,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn('[EmployeeService] Cloud sync error on addEmployee:', err);
      }
    }

    return newEmp;
  }

  public static async updateEmployee(id: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const list = await this.getEmployees();
    const idx = list.findIndex((e) => e.id === id || e.employeeCode === id);
    if (idx === -1) return null;

    const merged: UserProfile = {
      ...list[idx],
      ...updates,
    };
    list[idx] = merged;

    await StorageService.setItem(this.EMPLOYEES_STORAGE_KEY, list);

    // Sync to Cloud Firestore if connected
    if (isFirebaseConfigured() && db) {
      try {
        const docRef = doc(db, 'employees', list[idx].id);
        await updateDoc(docRef, {
          ...updates,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn('[EmployeeService] Cloud sync error on updateEmployee:', err);
      }
    }

    return merged;
  }

  public static async deleteEmployee(id: string): Promise<boolean> {
    const list = await this.getEmployees();
    const filtered = list.filter((e) => e.id !== id && e.employeeCode !== id);
    await StorageService.setItem(this.EMPLOYEES_STORAGE_KEY, filtered);

    if (isFirebaseConfigured() && db) {
      try {
        const docRef = doc(db, 'employees', id);
        await deleteDoc(docRef);
      } catch (err) {
        console.warn('[EmployeeService] Cloud delete error:', err);
      }
    }

    return true;
  }
}
