import { Router } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/authMiddleware.js';

const router = Router();

const ATTENDANCE_LOGS: any[] = [];
const EXPENSE_CLAIMS: any[] = [];

// Punch In / Out
router.post('/attendance/punch', (req: AuthRequest, res) => {
  const { type, latitude, longitude, selfieBase64, isMockLocation } = req.body;
  
  const record = {
    id: `att-${Date.now()}`,
    userId: req.user?.id || 'usr-mr-01',
    repName: req.user?.name || 'Vikram Mehta',
    type: type || 'PUNCH_IN',
    timestamp: new Date().toISOString(),
    latitude,
    longitude,
    hasSelfie: !!selfieBase64,
    isMockLocation: !!isMockLocation,
    status: isMockLocation ? 'FLAGGED_SUSPICIOUS' : 'VERIFIED'
  };

  ATTENDANCE_LOGS.unshift(record);
  res.status(201).json({ success: true, message: `Successfully ${type === 'PUNCH_OUT' ? 'Punched Out' : 'Punched In'}`, data: record });
});

router.get('/attendance', (req, res) => res.json({ success: true, data: ATTENDANCE_LOGS }));

// Mileage & Expense Claim Calculation (@ ₹7.50 / km)
router.post('/expenses/claim', (req: AuthRequest, res) => {
  const { date, distanceKm, daCategory, daAmount, hotelAmount, fareAmount, miscellaneousAmount, remarks } = req.body;
  const ratePerKm = 7.50;
  const mileageAllowance = Math.round((distanceKm || 0) * ratePerKm * 100) / 100;
  const totalClaim = mileageAllowance + (daAmount || 0) + (hotelAmount || 0) + (fareAmount || 0) + (miscellaneousAmount || 0);

  const claim = {
    id: `EXP-${Date.now()}`,
    userId: req.user?.id || 'usr-mr-01',
    repName: req.user?.name || 'Vikram Mehta',
    date: date || new Date().toISOString().split('T')[0],
    distanceKm: distanceKm || 0,
    ratePerKm,
    mileageAllowance,
    daCategory: daCategory || 'HQ',
    daAmount: daAmount || 250,
    hotelAmount: hotelAmount || 0,
    fareAmount: fareAmount || 0,
    miscellaneousAmount: miscellaneousAmount || 0,
    totalClaimAmount: Math.round(totalClaim * 100) / 100,
    status: 'SUBMITTED',
    submittedAt: new Date().toISOString()
  };

  EXPENSE_CLAIMS.unshift(claim);
  res.status(201).json({ success: true, message: 'Expense claim calculated and submitted', data: claim });
});

router.get('/expenses', (req, res) => res.json({ success: true, data: EXPENSE_CLAIMS }));

router.patch('/expenses/:id/approve', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const claim = EXPENSE_CLAIMS.find(c => c.id === id);
  if (claim) claim.status = status || 'APPROVED';
  res.json({ success: true, data: claim });
});

export default router;