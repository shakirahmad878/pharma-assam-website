import { Router } from 'express';

const router = Router();

router.get('/executive-summary', (req, res) => {
  res.json({
    success: true,
    data: {
      totalDoctorsListed: 148,
      doctorsCoveredThisMonth: 124,
      coveragePercentage: 83.7,
      totalSecondarySalesYTD: 2840500,
      monthlyTarget: 3200000,
      targetAchievementPct: 88.76,
      topPrescribingDoctors: [
        { name: 'Dr. Alok Verma', specialty: 'Cardiology', monthlyRxValue: 48500, visitsLogged: 3 },
        { name: 'Dr. Meera Kulkarni', specialty: 'Diabetology', monthlyRxValue: 42000, visitsLogged: 2 },
        { name: 'Dr. Ananya Roy', specialty: 'Orthopedics', monthlyRxValue: 39500, visitsLogged: 3 }
      ]
    }
  });
});

router.get('/export-csv', (req, res) => {
  const csvData = `Report Date,Representative,Doctor Name,Specialty,Tier,Geofence Status,POB Value (INR)\n` +
    `2026-09-05,Vikram Mehta,Dr. Alok Verma,Cardiology,A_PLUS,VERIFIED (15.3m),14500\n` +
    `2026-09-05,Vikram Mehta,Dr. Meera Kulkarni,Diabetology,A,VERIFIED (22.1m),8900\n` +
    `2026-09-05,Vikram Mehta,Dr. Rajesh Patel,Pediatrics,B,VERIFIED (44.0m),6200\n`;
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="sefmed_daily_mis_report.csv"');
  return res.send(csvData);
});

export default router;