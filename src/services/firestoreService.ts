/**
 * RepPulse Cloud Firestore Synchronization Service (Web Edition)
 * -----------------------------------------------------------------
 * Provides two-way real-time data sync, CRUD operations, and local caching
 * between the Web Admin Portal, Mobile Rep App, and Google Cloud Firestore.
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import {
  Doctor,
  Chemist,
  Product,
  User,
  Company,
  Territory,
  DCRRecord,
  TourPlanItem,
  AuditLogEntry,
  LocationTelemetryPoint,
} from '../types';

export interface DoctorDeletionRequest {
  id: string;
  doctorId: string;
  doctorName: string;
  reason: string;
  requestedBy: string;
  requestedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewComment?: string;
}

export class FirestoreService {
  /**
   * Check if Cloud Firestore is active & configured
   */
  public static isConnected(): boolean {
    return isFirebaseConfigured() && db !== null;
  }

  // ==========================================
  // 1. DOCTORS DIRECTORY
  // ==========================================

  public static async fetchDoctors(): Promise<Doctor[]> {
    if (!this.isConnected() || !db) return [];
    try {
      const colRef = collection(db, 'doctors');
      const snap = await getDocs(colRef);
      const list: Doctor[] = [];
      snap.forEach((d) => {
        const data = d.data() as Doctor;
        list.push({ ...data, id: d.id });
      });
      return list;
    } catch (err) {
      console.warn('[Firestore] fetchDoctors error:', err);
      return [];
    }
  }

  public static subscribeDoctors(onUpdate: (doctors: Doctor[]) => void): () => void {
    if (!this.isConnected() || !db) return () => {};
    try {
      const colRef = collection(db, 'doctors');
      return onSnapshot(
        colRef,
        (snap) => {
          const docs: Doctor[] = [];
          snap.forEach((d) => docs.push({ ...(d.data() as Doctor), id: d.id }));
          onUpdate(docs);
        },
        (err) => {
          console.warn('[Firestore] Doctors subscription notice:', err);
        }
      );
    } catch (e) {
      return () => {};
    }
  }

  public static async saveDoctor(doctor: Doctor): Promise<void> {
    if (!this.isConnected() || !db) return;
    try {
      const docRef = doc(db, 'doctors', doctor.id);
      await setDoc(docRef, {
        ...doctor,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (err) {
      console.warn('[Firestore] saveDoctor error:', err);
    }
  }

  public static async updateDoctor(id: string, updates: Partial<Doctor>): Promise<void> {
    if (!this.isConnected() || !db) return;
    try {
      const docRef = doc(db, 'doctors', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('[Firestore] updateDoctor error:', err);
    }
  }

  public static async deleteDoctor(id: string): Promise<void> {
    if (!this.isConnected() || !db) return;
    try {
      const docRef = doc(db, 'doctors', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('[Firestore] deleteDoctor error:', err);
    }
  }

  // ==========================================
  // 2. CHEMISTS & STOCKISTS
  // ==========================================

  public static async fetchChemists(): Promise<Chemist[]> {
    if (!this.isConnected() || !db) return [];
    try {
      const colRef = collection(db, 'chemists');
      const snap = await getDocs(colRef);
      const list: Chemist[] = [];
      snap.forEach((d) => {
        const data = d.data() as Chemist;
        list.push({ ...data, id: d.id });
      });
      return list;
    } catch (err) {
      console.warn('[Firestore] fetchChemists error:', err);
      return [];
    }
  }

  public static subscribeChemists(onUpdate: (chemists: Chemist[]) => void): () => void {
    if (!this.isConnected() || !db) return () => {};
    try {
      const colRef = collection(db, 'chemists');
      return onSnapshot(
        colRef,
        (snap) => {
          const list: Chemist[] = [];
          snap.forEach((d) => list.push({ ...(d.data() as Chemist), id: d.id }));
          onUpdate(list);
        },
        (err) => {
          console.warn('[Firestore] Chemists subscription notice:', err);
        }
      );
    } catch (e) {
      return () => {};
    }
  }

  public static async saveChemist(chemist: Chemist): Promise<void> {
    if (!this.isConnected() || !db) return;
    try {
      const docRef = doc(db, 'chemists', chemist.id);
      await setDoc(docRef, {
        ...chemist,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (err) {
      console.warn('[Firestore] saveChemist error:', err);
    }
  }

  public static async updateChemist(id: string, updates: Partial<Chemist>): Promise<void> {
    if (!this.isConnected() || !db) return;
    try {
      const docRef = doc(db, 'chemists', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('[Firestore] updateChemist error:', err);
    }
  }

  public static async deleteChemist(id: string): Promise<void> {
    if (!this.isConnected() || !db) return;
    try {
      const docRef = doc(db, 'chemists', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('[Firestore] deleteChemist error:', err);
    }
  }

  // ==========================================
  // 3. PRODUCTS & FORMULATIONS
  // ==========================================

  public static async fetchProducts(): Promise<Product[]> {
    if (!this.isConnected() || !db) return [];
    try {
      const colRef = collection(db, 'products');
      const snap = await getDocs(colRef);
      const list: Product[] = [];
      snap.forEach((d) => {
        const data = d.data() as Product;
        list.push({ ...data, id: d.id });
      });
      return list;
    } catch (err) {
      console.warn('[Firestore] fetchProducts error:', err);
      return [];
    }
  }

  public static subscribeProducts(onUpdate: (products: Product[]) => void): () => void {
    if (!this.isConnected() || !db) return () => {};
    try {
      const colRef = collection(db, 'products');
      return onSnapshot(
        colRef,
        (snap) => {
          const list: Product[] = [];
          snap.forEach((d) => list.push({ ...(d.data() as Product), id: d.id }));
          onUpdate(list);
        },
        (err) => {
          console.warn('[Firestore] Products subscription notice:', err);
        }
      );
    } catch (e) {
      return () => {};
    }
  }

  public static async saveProduct(product: Product): Promise<void> {
    if (!this.isConnected() || !db) return;
    try {
      const docRef = doc(db, 'products', product.id);
      await setDoc(docRef, {
        ...product,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (err) {
      console.warn('[Firestore] saveProduct error:', err);
    }
  }

  public static async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    if (!this.isConnected() || !db) return;
    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('[Firestore] updateProduct error:', err);
    }
  }

  public static async deleteProduct(id: string): Promise<void> {
    if (!this.isConnected() || !db) return;
    try {
      const docRef = doc(db, 'products', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('[Firestore] deleteProduct error:', err);
    }
  }

  // ==========================================
  // 4. USERS & ROLES
  // ==========================================

  public static async fetchUsers(): Promise<User[]> {
    if (!this.isConnected() || !db) return [];
    try {
      const colRef = collection(db, 'users');
      const snap = await getDocs(colRef);
      const list: User[] = [];
      snap.forEach((d) => {
        const data = d.data() as User;
        list.push({ ...data, id: d.id });
      });
      return list;
    } catch (err) {
      console.warn('[Firestore] fetchUsers error:', err);
      return [];
    }
  }

  public static subscribeUsers(onUpdate: (users: User[]) => void): () => void {
    if (!this.isConnected() || !db) return () => {};
    try {
      const colRef = collection(db, 'users');
      return onSnapshot(
        colRef,
        (snap) => {
          const list: User[] = [];
          snap.forEach((d) => list.push({ ...(d.data() as User), id: d.id }));
          onUpdate(list);
        },
        (err) => {
          console.warn('[Firestore] Users subscription notice:', err);
        }
      );
    } catch (e) {
      return () => {};
    }
  }

  public static async saveUser(user: User): Promise<void> {
    if (!this.isConnected() || !db) return;
    try {
      const docRef = doc(db, 'users', user.id);
      await setDoc(docRef, {
        ...user,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (err) {
      console.warn('[Firestore] saveUser error:', err);
    }
  }

  public static async updateUser(id: string, updates: Partial<User>): Promise<void> {
    if (!this.isConnected() || !db) return;
    try {
      const docRef = doc(db, 'users', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('[Firestore] updateUser error:', err);
    }
  }

  public static async deleteUser(id: string): Promise<void> {
    if (!this.isConnected() || !db) return;
    try {
      const docRef = doc(db, 'users', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('[Firestore] deleteUser error:', err);
    }
  }

  // ==========================================
  // 5. TERRITORIES
  // ==========================================

  public static async fetchTerritories(): Promise<Territory[]> {
    if (!this.isConnected() || !db) return [];
    try {
      const colRef = collection(db, 'territories');
      const snap = await getDocs(colRef);
      const list: Territory[] = [];
      snap.forEach((d) => {
        const data = d.data() as Territory;
        list.push({ ...data, id: d.id });
      });
      return list;
    } catch (err) {
      console.warn('[Firestore] fetchTerritories error:', err);
      return [];
    }
  }

  public static subscribeTerritories(onUpdate: (territories: Territory[]) => void): () => void {
    if (!this.isConnected() || !db) return () => {};
    try {
      const colRef = collection(db, 'territories');
      return onSnapshot(
        colRef,
        (snap) => {
          const list: Territory[] = [];
          snap.forEach((d) => list.push({ ...(d.data() as Territory), id: d.id }));
          onUpdate(list);
        },
        (err) => {
          console.warn('[Firestore] Territories subscription notice:', err);
        }
      );
    } catch (e) {
      return () => {};
    }
  }

  public static async saveTerritory(terr: Territory): Promise<void> {
    if (!this.isConnected() || !db) return;
    try {
      const docRef = doc(db, 'territories', terr.id);
      await setDoc(docRef, {
        ...terr,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (err) {
      console.warn('[Firestore] saveTerritory error:', err);
    }
  }

  public static async updateTerritory(id: string, updates: Partial<Territory>): Promise<void> {
    if (!this.isConnected() || !db) return;
    try {
      const docRef = doc(db, 'territories', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('[Firestore] updateTerritory error:', err);
    }
  }

  public static async deleteTerritory(id: string): Promise<void> {
    if (!this.isConnected() || !db) return;
    try {
      const docRef = doc(db, 'territories', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('[Firestore] deleteTerritory error:', err);
    }
  }

  // ==========================================
  // 6. DCR LOGS & FIELD VISITS
  // ==========================================

  public static async fetchDCRLogs(): Promise<DCRRecord[]> {
    if (!this.isConnected() || !db) return [];
    try {
      const colRef = collection(db, 'visits');
      const snap = await getDocs(colRef);
      const list: DCRRecord[] = [];
      snap.forEach((d) => {
        const data = d.data() as DCRRecord;
        list.push({ ...data, id: d.id });
      });
      return list;
    } catch (err) {
      console.warn('[Firestore] fetchDCRLogs error:', err);
      return [];
    }
  }

  public static subscribeDCRLogs(onUpdate: (logs: DCRRecord[]) => void): () => void {
    if (!this.isConnected() || !db) return () => {};
    try {
      const colRef = collection(db, 'visits');
      return onSnapshot(
        colRef,
        (snap) => {
          const list: DCRRecord[] = [];
          snap.forEach((d) => list.push({ ...(d.data() as DCRRecord), id: d.id }));
          onUpdate(list);
        },
        (err) => {
          console.warn('[Firestore] DCR Logs subscription notice:', err);
        }
      );
    } catch (e) {
      return () => {};
    }
  }

  public static async saveDCRLog(log: DCRRecord): Promise<void> {
    if (!this.isConnected() || !db) return;
    try {
      const docRef = doc(db, 'visits', log.id);
      await setDoc(docRef, {
        ...log,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (err) {
      console.warn('[Firestore] saveDCRLog error:', err);
    }
  }

  // ==========================================
  // 7. DOCTOR DELETION REQUESTS (APPROVAL WORKFLOW)
  // ==========================================

  public static async fetchDeletionRequests(): Promise<DoctorDeletionRequest[]> {
    if (!this.isConnected() || !db) return [];
    try {
      const colRef = collection(db, 'doctor_deletion_requests');
      const snap = await getDocs(colRef);
      const list: DoctorDeletionRequest[] = [];
      snap.forEach((d) => {
        const data = d.data() as DoctorDeletionRequest;
        list.push({ ...data, id: d.id });
      });
      return list;
    } catch (err) {
      console.warn('[Firestore] fetchDeletionRequests error:', err);
      return [];
    }
  }

  public static subscribeDeletionRequests(onUpdate: (requests: DoctorDeletionRequest[]) => void): () => void {
    if (!this.isConnected() || !db) return () => {};
    try {
      const colRef = collection(db, 'doctor_deletion_requests');
      return onSnapshot(
        colRef,
        (snap) => {
          const list: DoctorDeletionRequest[] = [];
          snap.forEach((d) => list.push({ ...(d.data() as DoctorDeletionRequest), id: d.id }));
          onUpdate(list);
        },
        (err) => {
          console.warn('[Firestore] Deletion requests subscription notice:', err);
        }
      );
    } catch (e) {
      return () => {};
    }
  }

  public static async approveDeletionRequest(requestId: string, doctorId: string, reviewerName: string): Promise<void> {
    if (!this.isConnected() || !db) return;
    try {
      // 1. Delete doctor
      await this.deleteDoctor(doctorId);

      // 2. Mark request as APPROVED
      const reqRef = doc(db, 'doctor_deletion_requests', requestId);
      await updateDoc(reqRef, {
        status: 'APPROVED',
        reviewedBy: reviewerName,
        reviewedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('[Firestore] approveDeletionRequest error:', err);
    }
  }

  public static async rejectDeletionRequest(requestId: string, reviewerName: string, comment: string): Promise<void> {
    if (!this.isConnected() || !db) return;
    try {
      const reqRef = doc(db, 'doctor_deletion_requests', requestId);
      await updateDoc(reqRef, {
        status: 'REJECTED',
        reviewedBy: reviewerName,
        reviewedAt: new Date().toISOString(),
        reviewComment: comment,
      });
    } catch (err) {
      console.warn('[Firestore] rejectDeletionRequest error:', err);
    }
  }

  // ==========================================
  // 8. ONE-CLICK MASS SEED / SYNC ALL TO CLOUD
  // ==========================================

  public static async syncAllLocalToCloud(data: {
    doctors: Doctor[];
    chemists: Chemist[];
    products: Product[];
    users: User[];
    companies: Company[];
    territories: Territory[];
    dcrLogs: DCRRecord[];
  }): Promise<{ success: boolean; message: string }> {
    if (!this.isConnected() || !db) {
      return { success: false, message: 'Cloud Firestore is not connected.' };
    }

    try {
      // Sync Doctors
      for (const d of data.doctors) {
        await setDoc(doc(db, 'doctors', d.id), { ...d, updatedAt: serverTimestamp() }, { merge: true });
      }
      // Sync Chemists
      for (const c of data.chemists) {
        await setDoc(doc(db, 'chemists', c.id), { ...c, updatedAt: serverTimestamp() }, { merge: true });
      }
      // Sync Products
      for (const p of data.products) {
        await setDoc(doc(db, 'products', p.id), { ...p, updatedAt: serverTimestamp() }, { merge: true });
      }
      // Sync Territories
      for (const t of data.territories) {
        await setDoc(doc(db, 'territories', t.id), { ...t, updatedAt: serverTimestamp() }, { merge: true });
      }
      // Sync Users
      for (const u of data.users) {
        await setDoc(doc(db, 'users', u.id), { ...u, updatedAt: serverTimestamp() }, { merge: true });
      }

      return {
        success: true,
        message: `Successfully synchronized ${data.doctors.length} Doctors, ${data.chemists.length} Chemists, and ${data.products.length} Products to Cloud Firestore!`,
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Cloud sync error: ${err?.message || 'Failed to upload records'}`,
      };
    }
  }
}
