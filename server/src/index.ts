import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import telemetryRoutes from './routes/telemetryRoutes.js';
import masterRoutes from './routes/masterRoutes.js';
import fieldRoutes from './routes/fieldRoutes.js';
import hrmsRoutes from './routes/hrmsRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';
import { authenticateToken } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global Authentication parser
app.use(authenticateToken as any);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'SefMed Enterprise Pharma SFA & Telemetry API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    invariants: {
      telemetryIntervalMinutes: 15,
      geofenceRadiusMeters: 100,
      trackingPrivacyGate: 'SUPER_ADMIN_ONLY',
      mileageRatePerKm: 7.50
    }
  });
});

// Mounted Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/telemetry', telemetryRoutes);
app.use('/api/v1/masters', masterRoutes);
app.use('/api/v1/field', fieldRoutes);
app.use('/api/v1/hrms', hrmsRoutes);
app.use('/api/v1/reports', reportsRoutes);

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 SefMed Pharma SFA Enterprise API`);
  console.log(`📡 Server listening on http://localhost:${PORT}`);
  console.log(`🔒 Strict Telemetry RBAC: SUPER_ADMIN ONLY`);
  console.log(`=================================================`);
});

export default app;