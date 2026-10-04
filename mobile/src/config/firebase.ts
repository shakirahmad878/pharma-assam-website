/**
 * RepPulse Firebase & Cloud Firestore Configuration
 * ----------------------------------------------------
 * When you create your Firebase project at https://console.firebase.google.com:
 * 1. Create a Web App in your Firebase console.
 * 2. Copy the firebaseConfig object and replace the values below.
 * 3. The app will immediately start syncing Doctors, Visits, Attendance, and Orders in real-time!
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "reppulse-pharma-sfa.firebaseapp.com",
  projectId: "reppulse-pharma-sfa",
  storageBucket: "reppulse-pharma-sfa.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

export const isFirebaseConfigured = (): boolean => {
  return (
    Boolean(firebaseConfig.apiKey) &&
    firebaseConfig.apiKey !== "YOUR_API_KEY" &&
    Boolean(firebaseConfig.projectId) &&
    firebaseConfig.projectId !== "reppulse-pharma-sfa"
  );
};

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  try {
    db = getFirestore(app);
  } catch (firestoreErr) {
    console.warn('[Firebase] Firestore init notice:', firestoreErr);
    db = getFirestore(app);
  }

  try {
    auth = getAuth(app);
  } catch (authErr) {
    console.warn('[Firebase] Auth init notice:', authErr);
  }
} catch (err) {
  console.warn('[Firebase] Initialization skipped or pending config:', err);
}

export { app, db, auth };
