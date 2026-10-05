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

const EMPLOYEES = [
  {
    id: 'usr-rsm-0001',
    name: 'Bodrud Jaman Sadiol',
    email: 'bodrud.rsm@reppulse.com',
    role: 'REGIONAL_MANAGER',
    employeeCode: '0001',
    territory: 'Barak Valley Division (All: Silchar, Hailakandi, Karimganj)',
    headquarter: 'Silchar Regional HQ',
    phone: '9435000001',
    assignedRouteIds: [
      'route-cachar-01',
      'route-cachar-02',
      'route-cachar-03',
      'route-karimganj-01',
      'route-karimganj-02',
      'route-hailakandi-01',
    ],
    activeRouteId: 'route-cachar-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr-mr-0002',
    name: 'Pranjal Malakar',
    email: 'pranjal.mr@reppulse.com',
    role: 'MEDICAL_REP',
    employeeCode: '0002',
    territory: 'Silchar Division (Cachar)',
    headquarter: 'Silchar HQ',
    phone: '9435000002',
    assignedRouteIds: ['route-cachar-01', 'route-cachar-02', 'route-cachar-03'],
    activeRouteId: 'route-cachar-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr-mr-0003',
    name: 'Rahul Das',
    email: 'rahul.mr@reppulse.com',
    role: 'MEDICAL_REP',
    employeeCode: '0003',
    territory: 'Hailakandi Division',
    headquarter: 'Hailakandi HQ',
    phone: '9435000003',
    assignedRouteIds: ['route-hailakandi-01'],
    activeRouteId: 'route-hailakandi-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr-mr-0004',
    name: 'Bikash Paul',
    email: 'bikash.mr@reppulse.com',
    role: 'MEDICAL_REP',
    employeeCode: '0004',
    territory: 'Karimganj Division (Shribhumi)',
    headquarter: 'Karimganj HQ',
    phone: '9435000004',
    assignedRouteIds: ['route-karimganj-01', 'route-karimganj-02'],
    activeRouteId: 'route-karimganj-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function seed() {
  console.log('Seeding employees to Cloud Firestore...');
  for (const emp of EMPLOYEES) {
    const docRef = doc(db, 'employees', emp.id);
    await setDoc(docRef, emp, { merge: true });
    console.log(`✅ Seeded employee: ${emp.name} (${emp.role} - ID ${emp.employeeCode}) in collection 'employees'`);
  }
  console.log('🎉 Successfully created and seeded employees collection in Cloud Firestore!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Error seeding employees:', err);
  process.exit(1);
});
