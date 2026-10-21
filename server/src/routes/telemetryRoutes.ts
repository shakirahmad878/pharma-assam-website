import { Router } from 'express';
import { z } from 'zod';
import { AuthRequest, requireSuperAdmin } from '../middleware/authMiddleware.js';

const router = Router();

const TelemetryPingSchema = z.object({
  userId: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracyMeters: z.number(),
  speedKmh: z.number(),
  batteryPercentage: z.number().min(0).max(100),
  isMockLocation: z.boolean(),
  isCharging: z.boolean().optional(),
  capturedAt: z.string()
});

// In-memory telemetry repository for instant demonstration
const liveFleetState = new Map<string, any>([
  [
    'usr-mr-01',
    {
      userId: 'usr-mr-01',
      employeeCode: 'EMP-MUM-104',
      name: 'Vikram Mehta',
      role: 'MEDICAL_REP',
      territory: 'Bandra - Khar Medical Zone',
      currentLocation: {
        latitude: 19.0594,
        longitude: 72.8294,
        accuracy: 4.2,
        speedKmh: 14.5,
        batteryPercentage: 91,
        isCharging: false,
        isMockLocation: false,
        capturedAt: new Date().toISOString()
      },
      todayTrail: [
        { lat: 19.0540, lng: 72.8250, time: '09:30 AM', speed: 0, battery: 98, note: 'Punch In (HQ)' },
        { lat: 19.0570, lng: 72.8270, time: '09:45 AM', speed: 22, battery: 96, note: 'In Transit' },
        { lat: 19.0596, lng: 72.8295, time: '10:00 AM', speed: 0, battery: 94, note: 'Visit: Dr. Alok Verma (Geofence OK)' },
        { lat: 19.0620, lng: 72.8330, time: '10:15 AM', speed: 18, battery: 93, note: 'In Transit' },
        { lat: 19.0645, lng: 72.8355, time: '10:30 AM', speed: 0, battery: 91, note: 'Visit: Dr. Meera Kulkarni (Geofence OK)' }
      ]
    }
  ]
]);

// 1. Telemetry Ingestion (Called automatically every 15 mins by field rep devices)
router.post('/ping', (req: AuthRequest, res) => {
  const parsed = TelemetryPingSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: parsed.error.format() });
  }

  const ping = parsed.data;
  
  // Security logging for fake GPS / mocking
  if (ping.isMockLocation) {
    console.warn(`[SECURITY AUDIT] Mock GPS flagged for user ${ping.userId} at ${ping.capturedAt}`);
  }

  // Update in-memory live state
  const existing = liveFleetState.get(ping.userId) || {
    userId: ping.userId,
    name: req.user?.name || 'Field Representative',
    employeeCode: req.user?.employeeCode || 'EMP-REP',
    todayTrail: []
  };

  existing.currentLocation = {
    latitude: ping.latitude,
    longitude: ping.longitude,
    accuracy: ping.accuracyMeters,
    speedKmh: ping.speedKmh,
    batteryPercentage: ping.batteryPercentage,
    isCharging: ping.isCharging || false,
    isMockLocation: ping.isMockLocation,
    capturedAt: ping.capturedAt
  };

  existing.todayTrail.push({
    lat: ping.latitude,
    lng: ping.longitude,
    time: new Date(ping.capturedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    speed: ping.speedKmh,
    battery: ping.batteryPercentage,
    note: ping.isMockLocation ? 'WARNING: Mock GPS' : '15-min Telemetry Ping'
  });

  liveFleetState.set(ping.userId, existing);

  return res.status(201).json({
    success: true,
    message: '15-minute telemetry point recorded successfully',
    recordedAt: ping.capturedAt,
    isMockDetected: ping.isMockLocation
  });
});

// 2. Admin Live Fleet Map (STRICT ACCESS: Super Admin ONLY)
router.get('/live-fleet', requireSuperAdmin, (req: AuthRequest, res) => {
  const reps = Array.from(liveFleetState.values());
  return res.json({
    success: true,
    count: reps.length,
    timestamp: new Date().toISOString(),
    data: reps
  });
});

// 3. Admin Route Replay History (STRICT ACCESS: Super Admin ONLY)
router.get('/history/:userId', requireSuperAdmin, (req: AuthRequest, res) => {
  const { userId } = req.params;
  const rep = liveFleetState.get(userId);

  if (!rep) {
    return res.status(404).json({ success: false, error: 'No telemetry trail found for user' });
  }

  return res.json({
    success: true,
    userId,
    name: rep.name,
    totalDistanceKm: 14.8,
    totalPingsToday: rep.todayTrail.length,
    trail: rep.todayTrail
  });
});

export default router;