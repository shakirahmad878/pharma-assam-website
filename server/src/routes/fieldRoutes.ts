import { Router } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { isWithinDoctorGeofence } from '../utils/geoUtils.js';

const router = Router();

// In-memory repositories
const DCR_RECORDS: any[] = [];
const TOUR_PLANS: any[] = [];
const POB_ORDERS: any[] = [];
const RCPA_AUDITS: any[] = [];

// 1. DCR Entry with Live Geofence Check
const DCREntrySchema = z.object({
  doctorId: z.string(),
  doctorName: z.string(),
  checkInLat: z.number(),
  checkInLng: z.number(),
  clinicLat: z.number(),
  clinicLng: z.number(),
  productsPromoted: z.array(z.string()),
  samplesDistributed: z.number(),
  doctorFeedback: z.string(),
  pobAmount: z.number().optional()
});

router.post('/dcr', (req: AuthRequest, res) => {
  const parsed = DCREntrySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: parsed.error.format() });

  const data = parsed.data;
  const geofence = isWithinDoctorGeofence(data.clinicLat, data.clinicLng, data.checkInLat, data.checkInLng, 100);

  const record = {
    id: `dcr-${Date.now()}`,
    userId: req.user?.id || 'usr-mr-01',
    repName: req.user?.name || 'Vikram Mehta',
    date: new Date().toISOString().split('T')[0],
    ...data,
    isGeofenceVerified: geofence.isInside,
    distanceFromClinicMeters: geofence.distanceMeters,
    status: geofence.isInside ? 'VERIFIED' : 'GEOFENCE_VIOLATION_FLAGGED',
    createdAt: new Date().toISOString()
  };

  DCR_RECORDS.unshift(record);

  return res.status(201).json({
    success: true,
    message: geofence.isInside ? 'DCR visit logged and geofence verified' : 'DCR logged with geofence distance warning',
    data: record
  });
});

router.get('/dcr', (req, res) => res.json({ success: true, count: DCR_RECORDS.length, data: DCR_RECORDS }));

// 2. Secondary Sales POB Orders
const POBOrderSchema = z.object({
  chemistId: z.string(),
  chemistName: z.string(),
  stockistName: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    brandName: z.string(),
    quantity: z.number().min(1),
    freeQuantity: z.number().default(0),
    ptr: z.number(),
    gstRate: z.number()
  })),
  remarks: z.string().optional()
});

router.post('/orders', (req: AuthRequest, res) => {
  const parsed = POBOrderSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: parsed.error.format() });

  const data = parsed.data;
  let subtotal = 0;
  let totalGst = 0;

  data.items.forEach(item => {
    const itemTotal = item.quantity * item.ptr;
    subtotal += itemTotal;
    totalGst += (itemTotal * item.gstRate) / 100;
  });

  const grandTotal = subtotal + totalGst;

  const order = {
    id: `POB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    repId: req.user?.id || 'usr-mr-01',
    repName: req.user?.name || 'Vikram Mehta',
    date: new Date().toISOString(),
    ...data,
    subtotal: Math.round(subtotal * 100) / 100,
    totalGst: Math.round(totalGst * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100,
    status: 'BOOKED_CONFIRMED'
  };

  POB_ORDERS.unshift(order);
  return res.status(201).json({ success: true, message: 'POB Order booked successfully', data: order });
});

router.get('/orders', (req, res) => res.json({ success: true, count: POB_ORDERS.length, data: POB_ORDERS }));

// 3. Tour Plans
router.get('/tour-plans', (req, res) => res.json({ success: true, data: TOUR_PLANS }));
router.post('/tour-plans', (req: AuthRequest, res) => {
  const plan = {
    id: `tp-${Date.now()}`,
    userId: req.user?.id || 'usr-mr-01',
    repName: req.user?.name || 'Vikram Mehta',
    month: req.body.month || 'Current Month',
    days: req.body.days || [],
    status: 'PENDING_APPROVAL',
    submittedAt: new Date().toISOString()
  };
  TOUR_PLANS.unshift(plan);
  res.status(201).json({ success: true, data: plan });
});

router.patch('/tour-plans/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const plan = TOUR_PLANS.find(p => p.id === id);
  if (plan) plan.status = status;
  res.json({ success: true, data: plan });
});

export default router;