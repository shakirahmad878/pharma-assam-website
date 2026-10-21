import { Router } from 'express';
import { z } from 'zod';

const router = Router();

const DOCTORS = [
  { id: 'doc-01', name: 'Dr. Alok Verma', qualification: 'MD, DM (Cardio)', specialty: 'Cardiology', tier: 'A_PLUS', clinicName: 'Lilavati Hospital & Research Centre', latitude: 19.0596, longitude: 72.8295, geofenceRadiusMeters: 100, phone: '+91 98201 23456', monthlyVisitTarget: 3, territory: 'Bandra West' },
  { id: 'doc-02', name: 'Dr. Meera Kulkarni', qualification: 'MBBS, MD (Medicine)', specialty: 'Diabetology', tier: 'A', clinicName: 'Apex Diabetes Care', latitude: 19.0645, longitude: 72.8355, geofenceRadiusMeters: 100, phone: '+91 98202 34567', monthlyVisitTarget: 2, territory: 'Khar West' },
  { id: 'doc-03', name: 'Dr. Rajesh Patel', qualification: 'MD (Pediatrics)', specialty: 'Pediatrics', tier: 'B', clinicName: 'Little Angels Clinic', latitude: 19.0720, longitude: 72.8410, geofenceRadiusMeters: 100, phone: '+91 98203 45678', monthlyVisitTarget: 2, territory: 'Santacruz' },
  { id: 'doc-04', name: 'Dr. Ananya Roy', qualification: 'MS (Orthopedics)', specialty: 'Orthopedics', tier: 'A_PLUS', clinicName: 'Bone & Joint Speciality', latitude: 19.0510, longitude: 72.8240, geofenceRadiusMeters: 100, phone: '+91 98204 56789', monthlyVisitTarget: 3, territory: 'Bandra South' },
  { id: 'doc-05', name: 'Dr. Farhan Qureshi', qualification: 'MD (Chest)', specialty: 'Pulmonology', tier: 'B', clinicName: 'BreathEasy Chest Clinic', latitude: 19.0800, longitude: 72.8450, geofenceRadiusMeters: 100, phone: '+91 98205 67890', monthlyVisitTarget: 1, territory: 'Vile Parle' }
];

const CHEMISTS = [
  { id: 'chm-01', shopName: 'Apollo Pharmacy Bandra', contactPerson: 'Ramesh Gupta', drugLicenseNumber: 'MH-MZ4-184920', gstNumber: '27AAAAA0000A1Z5', phone: '+91 98111 22233', territory: 'Bandra West', latitude: 19.0598, longitude: 72.8290 },
  { id: 'chm-02', shopName: 'Wellness Forever Khar', contactPerson: 'Ashok Shah', drugLicenseNumber: 'MH-MZ4-192837', gstNumber: '27BBBBB1111B1Z2', phone: '+91 98222 33344', territory: 'Khar West', latitude: 19.0640, longitude: 72.8360 },
  { id: 'chm-03', shopName: 'Noble Chemist Santacruz', contactPerson: 'Pravin Jain', drugLicenseNumber: 'MH-MZ4-203948', gstNumber: '27CCCCC2222C1Z9', phone: '+91 98333 44455', territory: 'Santacruz', latitude: 19.0715, longitude: 72.8415 }
];

const PRODUCTS = [
  { id: 'prd-01', brandName: 'CardioSafe-AM', genericName: 'Telmisartan 40mg + Amlodipine 5mg', category: 'Cardiology', dosageForm: 'Tablet (Strip of 10)', mrp: 145.00, ptr: 103.57, pts: 93.21, gstRate: 12 },
  { id: 'prd-02', brandName: 'GlycoControl-M', genericName: 'Metformin 500mg (SR) + Glimepiride 2mg', category: 'Diabetology', dosageForm: 'Tablet (Strip of 15)', mrp: 180.00, ptr: 128.57, pts: 115.71, gstRate: 12 },
  { id: 'prd-03', brandName: 'CefaStar-CV 625', genericName: 'Amoxicillin 500mg + Potassium Clavulanate 125mg', category: 'Anti-Infective', dosageForm: 'Tablet (Strip of 6)', mrp: 210.00, ptr: 150.00, pts: 135.00, gstRate: 12 },
  { id: 'prd-04', brandName: 'OsteoCal-D3 Max', genericName: 'Calcium Carbonate 1250mg + Vit D3 2000 IU + Zinc', category: 'Orthopedics', dosageForm: 'Tablet (Bottle of 30)', mrp: 320.00, ptr: 228.57, pts: 205.71, gstRate: 12 },
  { id: 'prd-05', brandName: 'Respira-Mont LC', genericName: 'Montelukast 10mg + Levocetirizine 5mg', category: 'Respiratory', dosageForm: 'Tablet (Strip of 10)', mrp: 165.00, ptr: 117.85, pts: 106.07, gstRate: 12 }
];

router.get('/doctors', (req, res) => res.json({ success: true, count: DOCTORS.length, data: DOCTORS }));
router.get('/chemists', (req, res) => res.json({ success: true, count: CHEMISTS.length, data: CHEMISTS }));
router.get('/products', (req, res) => res.json({ success: true, count: PRODUCTS.length, data: PRODUCTS }));

const DoctorCreateSchema = z.object({
  name: z.string().min(2),
  qualification: z.string(),
  specialty: z.string(),
  tier: z.enum(['A_PLUS', 'A', 'B', 'C']),
  clinicName: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  phone: z.string(),
  territory: z.string()
});

router.post('/doctors', (req, res) => {
  const parsed = DoctorCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: parsed.error.format() });
  
  const newDoctor = {
    id: `doc-${Date.now()}`,
    ...parsed.data,
    geofenceRadiusMeters: 100,
    monthlyVisitTarget: 2
  };
  DOCTORS.push(newDoctor);
  res.status(201).json({ success: true, data: newDoctor });
});

export default router;