/**
 * RepPulse — Firestore Full Data Export Script
 * Run: node mobile/scripts/exportFirestoreData.js
 * Output: mobile/scripts/backup/firestore_backup_<timestamp>.json
 */

const { initializeApp } = require('firebase/app');
const { initializeFirestore, collection, getDocs } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

const firebaseConfig = {
  apiKey: "AIzaSyCn5xwRvSFtpOnCFTrKCbTLSN6gWgmXPEM",
  authDomain: "reppulse-pharma.firebaseapp.com",
  projectId: "reppulse-pharma",
  storageBucket: "reppulse-pharma.firebasestorage.app",
  messagingSenderId: "181266998449",
  appId: "1:181266998449:web:2f6d9df48356ff2c04ee90",
};

const COLLECTIONS = [
  'employees',
  'doctors',
  'chemists',
  'firms',
  'products',
  'users',
  'territories',
  'visits',
  'doctor_deletion_requests',
  'monthly_tour_programmes',
  'location_telemetry',
  'attendance',
];

async function exportAll() {
  const app = initializeApp(firebaseConfig);
  const db = initializeFirestore(app, { experimentalForceLongPolling: true });

  const backup = {
    exportedAt: new Date().toISOString(),
    projectId: firebaseConfig.projectId,
    collections: {},
  };

  let totalRecords = 0;

  for (const colName of COLLECTIONS) {
    try {
      const snap = await getDocs(collection(db, colName));
      const records = [];
      snap.forEach((docSnap) => {
        records.push({ id: docSnap.id, ...docSnap.data() });
      });
      backup.collections[colName] = records;
      totalRecords += records.length;
      console.log(`  ✅ ${colName}: ${records.length} records`);
    } catch (err) {
      backup.collections[colName] = [];
      console.warn(`  ⚠️  ${colName}: skipped (${err.message})`);
    }
  }

  // Write output
  const outDir = path.join(__dirname, 'backup');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outFile = path.join(outDir, `firestore_backup_${timestamp}.json`);
  fs.writeFileSync(outFile, JSON.stringify(backup, null, 2), 'utf-8');

  console.log(`\n🎉 Export complete — ${totalRecords} total records`);
  console.log(`📁 Saved to: ${outFile}`);
  process.exit(0);
}

exportAll().catch((err) => {
  console.error('❌ Export failed:', err);
  process.exit(1);
});
