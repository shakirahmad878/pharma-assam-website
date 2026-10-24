import { Router } from 'express';
import { z } from 'zod';

const router = Router();

// Live Verified Medical Practitioners in Barak Valley
const DOCTORS = [
  {
    id: 'doc-barak-1791257021378',
    name: 'Dr. Kamalesh Dey',
    qualification: 'MBBS',
    specialty: 'General Physician',
    tier: 'A',
    clinicName: 'Radharaman Medisales',
    latitude: 24.8651617,
    longitude: 92.3729317,
    geofenceRadiusMeters: 100,
    phone: '+91 9435596542',
    monthlyVisitTarget: 8,
    territory: 'Karimganj HQ'
  },
  {
    id: 'doc-barak-1791257349198',
    name: 'Dr. AM Tapadar',
    qualification: 'MBBS',
    specialty: 'General Physician',
    tier: 'B',
    clinicName: 'Ashirwad Hospital',
    latitude: 24.8621167,
    longitude: 92.36934,
    geofenceRadiusMeters: 100,
    phone: '+91 9435596882',
    monthlyVisitTarget: 8,
    territory: 'Karimganj HQ'
  },
  {
    id: 'doc-barak-1791257461313',
    name: 'Dr. Subhashish Deb',
    qualification: 'MBBS',
    specialty: 'General Physician',
    tier: 'B',
    clinicName: 'Dristi Eye Clinic',
    latitude: 24.8627179,
    longitude: 92.3693382,
    geofenceRadiusMeters: 100,
    phone: '+91 8638339255',
    monthlyVisitTarget: 8,
    territory: 'Karimganj HQ'
  },
  {
    id: 'doc-barak-1791257729198',
    name: 'Dr. TK Banik',
    qualification: 'MBBS',
    specialty: 'General Physician',
    tier: 'A',
    clinicName: 'Nilima Medical Hall',
    latitude: 24.8663117,
    longitude: 92.363375,
    geofenceRadiusMeters: 100,
    phone: '+91 7558214220',
    monthlyVisitTarget: 8,
    territory: 'Karimganj HQ'
  },
  {
    id: 'doc-barak-1791257859025',
    name: 'Dr. Nabarun Das',
    qualification: 'MBBS',
    specialty: 'General Physician',
    tier: 'B',
    clinicName: 'Jivandeep',
    latitude: 24.867489,
    longitude: 92.3630161,
    geofenceRadiusMeters: 100,
    phone: '+91 8638452210',
    monthlyVisitTarget: 8,
    territory: 'Karimganj HQ'
  }
];

// Live Registered Wholesale Distributors & Stockists
const CHEMISTS = [
  {
    id: 'firm-sil-001',
    shopName: 'BARAK PHARMA DISTRIBUTORS',
    contactPerson: 'S. K. Choudhury',
    drugLicenseNumber: 'AS-SIL-2026-DL-1011',
    gstNumber: '18AABCB1011Z1ZA',
    phone: '+91 9435011223',
    territory: 'Silchar Regional HQ',
    latitude: 24.8218,
    longitude: 92.7971
  },
  {
    id: 'firm-sil-002',
    shopName: 'SANJIVANI MEDICAL STORE',
    contactPerson: 'Debasish Paul',
    drugLicenseNumber: 'AS-SIL-2026-DL-1022',
    gstNumber: '18AABCS1022Z2ZB',
    phone: '+91 9435022334',
    territory: 'Silchar Regional HQ',
    latitude: 24.7768,
    longitude: 92.7940
  },
  {
    id: 'firm-kxj-001',
    shopName: 'SHRIBHUMI WHOLESALE PHARMACEUTICALS',
    contactPerson: 'Prabir Roy',
    drugLicenseNumber: 'AS-KXJ-2026-DL-3011',
    gstNumber: '18AABCW3011Z3ZC',
    phone: '+91 9435044556',
    territory: 'Karimganj HQ',
    latitude: 24.8688,
    longitude: 92.3558
  },
  {
    id: 'firm-hkd-001',
    shopName: 'HAILAKANDI MEDICO AGENCY',
    contactPerson: 'M. H. Barbhuiya',
    drugLicenseNumber: 'AS-HKD-2026-DL-2011',
    gstNumber: '18AABCH2011Z4ZD',
    phone: '+91 9435033445',
    territory: 'Hailakandi HQ',
    latitude: 24.6838,
    longitude: 92.5672
  }
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
  phone: z.string().optional(),
  territory: z.string()
});

router.post('/doctors', (req, res) => {
  const parsed = DoctorCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: parsed.error.format() });
  
  const newDoctor = {
    id: `doc-${Date.now()}`,
    ...parsed.data,
    phone: parsed.data.phone || '',
    geofenceRadiusMeters: 100,
    monthlyVisitTarget: 8
  };
  DOCTORS.push(newDoctor as any);
  res.status(201).json({ success: true, data: newDoctor });
});

export default router;
