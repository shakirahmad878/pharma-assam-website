/**
 * RepPulse Firebase & Cloud Firestore Live Configuration
 * --------------------------------------------------------
 * Project: reppulse-pharma
 * Cloud Provider: Google Firebase & Cloud Firestore
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyCn5xwRvSFtpOnCFTrKCbTLSN6gWgmXPEM",
  authDomain: "reppulse-pharma.firebaseapp.com",
  projectId: "reppulse-pharma",
  storageBucket: "reppulse-pharma.firebasestorage.app",
  messagingSenderId: "181266998449",
  appId: "1:181266998449:web:2f6d9df48356ff2c04ee90",
  measurementId: "G-EKG0GYXHD2",
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

export const isFirebaseConfigured = (): boolean => {
  return (
    Boolean(firebaseConfig.apiKey) &&
    firebaseConfig.apiKey.startsWith("AIza") &&
    Boolean(firebaseConfig.projectId) &&
    firebaseConfig.projectId === "reppulse-pharma"
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
    console.warn('[Firebase Web] Firestore init notice:', firestoreErr);
  }

  try {
    auth = getAuth(app);
  } catch (authErr) {
    console.warn('[Firebase Web] Auth init notice:', authErr);
  }
} catch (err) {
  console.warn('[Firebase Web] Initialization error:', err);
}

export { app, db, auth };
