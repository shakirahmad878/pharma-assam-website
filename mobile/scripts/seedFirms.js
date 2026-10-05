const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCn5xwRvSFtpOnCFTrKCbTLSN6gWgmXPEM",
  authDomain: "reppulse-pharma.firebaseapp.com",
  projectId: "reppulse-pharma",
  storageBucket: "reppulse-pharma.firebasestorage.app",
  messagingSenderId: "181266998449",
  appId: "1:181266998449:web:2f6d9df48356ff2c04ee90",
  measurementId: "G-EKG0GYXHD2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const FIRMS = [
  {
    id: 'firm-sil-001',
    name: 'BARAK PHARMA DISTRIBUTORS',
    type: 'Stockist',
    contactPerson: 'S. K. Choudhury',
    phone: '+91 9435011223',
    dlNumber: 'AS-SIL-2026-DL-1011',
    area: 'Hospital Road, Ambicapatty',
    district: 'Cachar',
    address: 'Hospital Road, Silchar, Cachar, Assam 788005',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'firm-sil-002',
    name: 'SANJIVANI MEDICAL STORE',
    type: 'Retailer',
    contactPerson: 'Debasish Paul',
    phone: '+91 9435022334',
    dlNumber: 'AS-SIL-2026-DL-1022',
    area: 'SMCH Gate, Ghungoor',
    district: 'Cachar',
    address: 'Ghungoor, Silchar, Cachar, Assam 788014',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'firm-hkd-001',
    name: 'HAILAKANDI MEDICO AGENCY',
    type: 'Distributor',
    contactPerson: 'M. H. Barbhuiya',
    phone: '+91 9435033445',
    dlNumber: 'AS-HKD-2026-DL-2011',
    area: 'S.K. Roy Road, Main Market',
    district: 'Hailakandi',
    address: 'S.K. Roy Hospital Road, Hailakandi, Assam 788151',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'firm-kxj-001',
    name: 'SHRIBHUMI WHOLESALE PHARMACEUTICALS',
    type: 'Stockist',
    contactPerson: 'Prabir Roy',
    phone: '+91 9435044556',
    dlNumber: 'AS-KXJ-2026-DL-3011',
    area: 'Station Road, Karimganj Town',
    district: 'Karimganj',
    address: 'Station Road, Karimganj, Assam 788710',
    createdAt: new Date().toISOString(),
  },
];

async function seedFirms() {
  console.log('Seeding firms to Cloud Firestore...');
  for (const firm of FIRMS) {
    const docRef = doc(db, 'firms', firm.id);
    await setDoc(docRef, firm, { merge: true });
    console.log(`✅ Seeded firm: ${firm.name} (${firm.type} - ${firm.district}) in collection 'firms'`);
  }
  console.log('🎉 Successfully created and seeded firms collection in Cloud Firestore!');
  process.exit(0);
}

seedFirms().catch((err) => {
  console.error('❌ Error seeding firms:', err);
  process.exit(1);
});
