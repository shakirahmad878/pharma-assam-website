/**
 * RepPulse Firebase & Cloud Firestore Live Configuration
 * --------------------------------------------------------
 * Status: DISCONNECTED
 * Primary Backend: Supabase Serverless PostgreSQL
 */

import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

export const isFirebaseConfigured = (): boolean => {
  return false; // Cloud Firestore disconnected
};

export { app, db, auth };
