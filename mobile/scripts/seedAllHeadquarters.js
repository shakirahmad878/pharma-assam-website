/**
 * RepPulse — Master Seed Script for all Headquarters & Divisions
 * Seeds:
 * 1. Employees: Bodrud (RSM), Pranjal (Silchar), Rahul (Hailakandi), Bikash (Karimganj), Lalremruata (Aizawl), Debabrata (Tripura)
 * 2. Firms: Silchar, Hailakandi, Karimganj, Aizawl, and Tripura (Agartala)
 * 3. Doctors: Initial doctors for Aizawl and Tripura (preserves existing 31 doctors with merge: true)
 *
 * Run: node mobile/scripts/seedAllHeadquarters.js
 */

const { initializeApp } = require('firebase/app');
const { initializeFirestore, doc, setDoc, getDocs, collection } = require('firebase/firestore');

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
const db = initializeFirestore(app, { experimentalForceLongPolling: true });

// 1. ALL EMPLOYEES ACROSS 5 HEADQUARTERS
const EMPLOYEES = [
  {
    id: 'usr-rsm-0001',
    name: 'Bodrud Jaman Sadiol',
    email: 'bodrud.rsm@reppulse.com',
    role: 'REGIONAL_MANAGER',
    employeeCode: '0001',
    territory: 'Barak Valley & Extended Divisions (Silchar, Hailakandi, Karimganj, Aizawl, Tripura)',
    headquarter: 'Silchar Regional HQ',
    phone: '9435000001',
    assignedRouteIds: [
      'route-cachar-01',
      'route-cachar-02',
      'route-cachar-03',
      'route-karimganj-01',
      'route-karimganj-02',
      'route-hailakandi-01',
      'route-aizawl-01',
      'route-tripura-01',
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
  {
    id: 'usr-mr-0005',
    name: 'Lalremruata Chhangte',
    email: 'lalremruata.mr@reppulse.com',
    role: 'MEDICAL_REP',
    employeeCode: '0005',
    territory: 'Aizawl Division (Mizoram)',
    headquarter: 'Aizawl HQ',
    phone: '9435000005',
    assignedRouteIds: ['route-aizawl-01'],
    activeRouteId: 'route-aizawl-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr-mr-0006',
    name: 'Debabrata Debnath',
    email: 'debabrata.mr@reppulse.com',
    role: 'MEDICAL_REP',
    employeeCode: '0006',
    territory: 'Tripura Division (Agartala)',
    headquarter: 'Agartala HQ',
    phone: '9435000006',
    assignedRouteIds: ['route-tripura-01'],
    activeRouteId: 'route-tripura-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// 2. FIRMS ACROSS ALL 5 HEADQUARTERS
const FIRMS = [
  // Silchar
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
  // Hailakandi
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
  // Karimganj
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
  // Aizawl (Mizoram)
  {
    id: 'firm-aiz-001',
    name: 'MIZORAM CENTRAL PHARMA',
    type: 'Stockist',
    contactPerson: 'Lalthangliana Sailo',
    phone: '+91 9436141201',
    dlNumber: 'MZ-AIZ-2026-DL-4011',
    area: 'Bawngkawn Main Market',
    district: 'Aizawl',
    address: 'Bawngkawn, Aizawl, Mizoram 796014',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'firm-aiz-002',
    name: 'ZORAM MEDICARE & SURGICALS',
    type: 'Distributor',
    contactPerson: 'Vanlalruata',
    phone: '+91 9436141202',
    dlNumber: 'MZ-AIZ-2026-DL-4022',
    area: 'Chanmari Commercial Hub',
    district: 'Aizawl',
    address: 'Chanmari, Aizawl, Mizoram 796007',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'firm-aiz-003',
    name: 'FALKAWN LIFE PHARMACY',
    type: 'Retailer',
    contactPerson: 'Zodinpuia',
    phone: '+91 9436141203',
    dlNumber: 'MZ-AIZ-2026-DL-4033',
    area: 'ZMC Hospital Gate, Falkawn',
    district: 'Aizawl',
    address: 'Near ZMC, Falkawn, Aizawl, Mizoram 796005',
    createdAt: new Date().toISOString(),
  },
  // Tripura (Agartala)
  {
    id: 'firm-tri-001',
    name: 'TRIPURA MEDICO DISTRIBUTORS',
    type: 'Stockist',
    contactPerson: 'Subrata Bhowmik',
    phone: '+91 9436122301',
    dlNumber: 'TR-AGT-2026-DL-5011',
    area: 'Akhaura Road, Banamalipur',
    district: 'Tripura',
    address: 'Akhaura Road, Agartala, Tripura 799001',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'firm-tri-002',
    name: 'AGARTALA DRUG HOUSE',
    type: 'Distributor',
    contactPerson: 'Biplab Saha',
    phone: '+91 9436122302',
    dlNumber: 'TR-AGT-2026-DL-5022',
    area: 'GBP Hospital Road, Kunjaban',
    district: 'Tripura',
    address: 'GBP Road, Kunjaban, Agartala, Tripura 799006',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'firm-tri-003',
    name: 'TRIPURA PHARMA CARE',
    type: 'Retailer',
    contactPerson: 'Pradip Chakraborty',
    phone: '+91 9436122303',
    dlNumber: 'TR-AGT-2026-DL-5033',
    area: 'Hapania TMC Market',
    district: 'Tripura',
    address: 'Near TMC Hospital, Hapania, Agartala, Tripura 799014',
    createdAt: new Date().toISOString(),
  },
];

// 3. INITIAL DOCTORS FOR AIZAWL & TRIPURA
const NEW_DOCTORS = [
  // Aizawl (Mizoram)
  {
    id: 'doc-aiz-001',
    name: 'Dr. Lalhmingliana',
    specialty: 'Cardiologist',
    qualification: 'MBBS, MD (Cardio)',
    clinicName: 'ZMC Cardiology OPD',
    clinicAddress: 'Zoram Medical College & Hospital, Falkawn, Aizawl, Mizoram 796005',
    district: 'Aizawl',
    area: 'Falkawn, Aizawl',
    phone: '+91 9436141111',
    tier: 'A_PLUS',
    monthlyVisitTarget: 12,
    completedVisitsThisMonth: 0,
    todayVisitStatus: 'NOT_SCHEDULED',
    latitude: 23.6394,
    longitude: 92.7092,
    geofenceRadiusMeters: 150,
    isKeyOpinionLeader: true,
    focusProducts: ['CardioPulse 50', 'TeneliPulse 20'],
    lastVisitDate: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-aiz-002',
    name: 'Dr. C. Zoramthanga',
    specialty: 'Orthopedic',
    qualification: 'MBBS, MS (Ortho)',
    clinicName: 'Aizawl Bone & Joint Clinic',
    clinicAddress: 'Chanmari Commercial Building, Aizawl, Mizoram 796007',
    district: 'Aizawl',
    area: 'Chanmari, Aizawl',
    phone: '+91 9436141222',
    tier: 'A',
    monthlyVisitTarget: 8,
    completedVisitsThisMonth: 0,
    todayVisitStatus: 'NOT_SCHEDULED',
    latitude: 23.7380,
    longitude: 92.7188,
    geofenceRadiusMeters: 150,
    isKeyOpinionLeader: false,
    focusProducts: ['FlexiPulse D3', 'OrthoPulse Gel'],
    lastVisitDate: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-aiz-003',
    name: 'Dr. Lalrinawmi',
    specialty: 'Gynecologist',
    qualification: 'MBBS, DGO, MD',
    clinicName: 'Civil Hospital OPD Chamber',
    clinicAddress: 'Dawrpui Main Road, Aizawl, Mizoram 796001',
    district: 'Aizawl',
    area: 'Dawrpui, Aizawl',
    phone: '+91 9436141333',
    tier: 'B',
    monthlyVisitTarget: 4,
    completedVisitsThisMonth: 0,
    todayVisitStatus: 'NOT_SCHEDULED',
    latitude: 23.7271,
    longitude: 92.7176,
    geofenceRadiusMeters: 150,
    isKeyOpinionLeader: false,
    focusProducts: ['FemPulse Iron', 'CalciPulse HD'],
    lastVisitDate: null,
    createdAt: new Date().toISOString(),
  },
  // Tripura (Agartala)
  {
    id: 'doc-tri-001',
    name: 'Dr. Samarjit Choudhury',
    specialty: 'Cardiologist',
    qualification: 'MBBS, MD, DM (Cardio)',
    clinicName: 'AGMC & GBP Hospital Chamber',
    clinicAddress: 'GBP Hospital Complex, Kunjaban, Agartala, Tripura 799006',
    district: 'Tripura',
    area: 'Kunjaban, Agartala',
    phone: '+91 9436122111',
    tier: 'A_PLUS',
    monthlyVisitTarget: 12,
    completedVisitsThisMonth: 0,
    todayVisitStatus: 'NOT_SCHEDULED',
    latitude: 23.8566,
    longitude: 91.2868,
    geofenceRadiusMeters: 150,
    isKeyOpinionLeader: true,
    focusProducts: ['CardioPulse 50', 'TeneliPulse 20'],
    lastVisitDate: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-tri-002',
    name: 'Dr. Tanmoy Majumder',
    specialty: 'Pediatrician',
    qualification: 'MBBS, DCH, MD (Pediatrics)',
    clinicName: 'Tripura Child Care Chamber',
    clinicAddress: 'Akhaura Road, Banamalipur, Agartala, Tripura 799001',
    district: 'Tripura',
    area: 'Akhaura Road, Agartala',
    phone: '+91 9436122222',
    tier: 'A',
    monthlyVisitTarget: 8,
    completedVisitsThisMonth: 0,
    todayVisitStatus: 'NOT_SCHEDULED',
    latitude: 23.8315,
    longitude: 91.2868,
    geofenceRadiusMeters: 150,
    isKeyOpinionLeader: false,
    focusProducts: ['ZincoPulse Drop', 'PedPulse Suspension'],
    lastVisitDate: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-tri-003',
    name: 'Dr. Moumita Dasgupta',
    specialty: 'Diabetologist',
    qualification: 'MBBS, C.Diab',
    clinicName: 'TMC & BRAM Hospital OPD',
    clinicAddress: 'Hapania, Agartala, Tripura 799014',
    district: 'Tripura',
    area: 'Hapania, Agartala',
    phone: '+91 9436122333',
    tier: 'B',
    monthlyVisitTarget: 4,
    completedVisitsThisMonth: 0,
    todayVisitStatus: 'NOT_SCHEDULED',
    latitude: 23.7937,
    longitude: 91.2647,
    geofenceRadiusMeters: 150,
    isKeyOpinionLeader: false,
    focusProducts: ['GlycoPulse M500', 'TeneliPulse 20'],
    lastVisitDate: null,
    createdAt: new Date().toISOString(),
  },
];

async function seedAll() {
  console.log('🚀 Starting Master Seeding for all Headquarters...\n');

  // 1. Seed Employees
  console.log('--- 1. Seeding Employees (5 Headquarters) ---');
  for (const emp of EMPLOYEES) {
    const docRef = doc(db, 'employees', emp.id);
    await setDoc(docRef, emp, { merge: true });
    console.log(`  👤 [${emp.employeeCode}] ${emp.name} — ${emp.headquarter} (${emp.role})`);
  }

  // 2. Seed Firms
  console.log('\n--- 2. Seeding Firms (5 Headquarters) ---');
  for (const firm of FIRMS) {
    const docRef = doc(db, 'firms', firm.id);
    await setDoc(docRef, firm, { merge: true });
    console.log(`  🏢 [${firm.district}] ${firm.name} (${firm.type})`);
  }

  // 3. Seed Doctors for Aizawl & Tripura
  console.log('\n--- 3. Seeding Doctors for Aizawl & Tripura ---');
  for (const docItem of NEW_DOCTORS) {
    const docRef = doc(db, 'doctors', docItem.id);
    await setDoc(docRef, docItem, { merge: true });
    console.log(`  🩺 [${docItem.district}] ${docItem.name} (${docItem.specialty} - Tier ${docItem.tier})`);
  }

  // 4. Verify Final Counts
  console.log('\n--- 4. Verifying Firestore Collection Totals ---');
  const empSnap = await getDocs(collection(db, 'employees'));
  const firmSnap = await getDocs(collection(db, 'firms'));
  const docSnap = await getDocs(collection(db, 'doctors'));

  console.log(`  ✅ employees collection: ${empSnap.size} total employees`);
  console.log(`  ✅ firms collection:     ${firmSnap.size} total firms`);
  console.log(`  ✅ doctors collection:   ${docSnap.size} total doctors`);

  console.log('\n🎉 ALL HEADQUARTERS & DIVISIONS SUCCESSFULLY SEEDED IN CLOUD FIRESTORE!');
  process.exit(0);
}

seedAll().catch((err) => {
  console.error('❌ Master Seeding Failed:', err);
  process.exit(1);
});
