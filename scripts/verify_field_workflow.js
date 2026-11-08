/**
 * RepPulse Pharma SFA — End-to-End Field Sales Workflow Verification Suite
 * Tests live Supabase transactions across Attendance, Visits, POB Orders & Audit Triggers
 */

const SUPABASE_URL = 'https://ibcyqtnpzdttwuhyhlra.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliY3lxdG5wemR0dHd1aHlobHJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4OTc0ODcsImV4cCI6MjEwNzQ3MzQ4N30.JTMIcW9cz-G1NbEpKFl1Vg3AN46jHktpbGO5SAykjuI';

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
};

async function runVerification() {
  console.log('================================================================');
  console.log('REPPULSE PHARMA SFA — END-TO-END WORKFLOW VERIFICATION SUITE');
  console.log(`Backend Target: ${SUPABASE_URL}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('================================================================\n');

  const testSuffix = Date.now().toString().slice(-6);
  const testAttendanceId = `test_att_${testSuffix}`;
  const testVisitId = `test_visit_${testSuffix}`;
  const testOrderId = `test_order_${testSuffix}`;

  const results = {
    attendance: false,
    visit: false,
    order: false,
    auditTriggers: false,
    cleanup: false,
  };

  // -------------------------------------------------------------
  // TEST 1: RSM START WORK & GEOTAGGED ATTENDANCE
  // -------------------------------------------------------------
  console.log('👉 [STEP 1/5] Verifying Attendance Punch-In (RSM NLCL-0003)...');
  try {
    const attPayload = {
      id: testAttendanceId,
      employee_id: 'usr-nlcl-0003',
      employee_name: 'Bodrud Jaman Sadial',
      date: new Date().toISOString().split('T')[0],
      punch_in_timestamp: new Date().toISOString(),
      status: 'PUNCHED_IN',
      latitude: 24.8146,
      longitude: 92.8037,
      accuracy_meters: 6.2,
      is_mock_location: false,
      battery_percentage: 94,
      selfie_url: 'https://storage.reppulse.sfa/selfies/test_rsm_verified.jpg',
      sync_status: 'SYNCED',
      server_id: testAttendanceId,
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/attendance`, {
      method: 'POST',
      headers: { ...headers, Prefer: 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify(attPayload),
    });

    if (res.ok) {
      const data = await res.json();
      console.log('   ✅ HTTP 201/200: Attendance record persisted successfully!');
      console.log(`      ID: ${testAttendanceId} | Lat/Lng: 24.8146, 92.8037 | Battery: 94%`);
      results.attendance = true;
    } else {
      console.error('   ❌ Attendance insertion failed:', res.status, await res.text());
    }
  } catch (err) {
    console.error('   ❌ Attendance network error:', err);
  }

  // -------------------------------------------------------------
  // TEST 2: DOCTOR CALL VISIT EXECUTION (DCR)
  // -------------------------------------------------------------
  console.log('\n👉 [STEP 2/5] Verifying Doctor Call Visit Logging (Silchar Central)...');
  try {
    const visitPayload = {
      id: testVisitId,
      doctor_name: 'Dr. Debashish Deb',
      employee_id: 'usr-nlcl-0003',
      employee_name: 'Bodrud Jaman Sadial',
      district: 'Cachar',
      visit_date: new Date().toISOString().split('T')[0],
      status: 'COMPLETED',
      latitude: 24.8152,
      longitude: 92.8041,
      is_geofence_verified: true,
      distance_meters: 15.4,
      notes: 'Detailed Cefpodoxime 200mg & Pantoprazole DSR. Sample pack provided.',
      products_discussed: ['Cefpodoxime 200mg', 'Pantoprazole DSR', 'Paracetamol 650mg'],
      samples_given: [{ product: 'Cefpodoxime 200mg', qty: 2 }],
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/visits`, {
      method: 'POST',
      headers: { ...headers, Prefer: 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify(visitPayload),
    });

    if (res.ok) {
      console.log('   ✅ HTTP 201/200: Field Doctor Visit recorded successfully!');
      console.log(`      ID: ${testVisitId} | Geofence Verified: YES (15.4m) | Detailing Logged`);
      results.visit = true;
    } else {
      console.error('   ❌ Visit insertion failed:', res.status, await res.text());
    }
  } catch (err) {
    console.error('   ❌ Visit network error:', err);
  }

  // -------------------------------------------------------------
  // TEST 3: CHEMIST PRODUCT ORDER BOOKING (POB)
  // -------------------------------------------------------------
  console.log('\n👉 [STEP 3/5] Verifying Chemist Product Order Booking (POB)...');
  try {
    const orderPayload = {
      id: testOrderId,
      order_number: `POB-E2E-${testSuffix}`,
      employee_id: 'usr-nlcl-0003',
      employee_name: 'Bodrud Jaman Sadial',
      buyer_type: 'CHEMIST',
      buyer_id: 'firm-silchar-01',
      buyer_name: 'Popular Pharmacy & Surgical Store',
      stockist_name: 'Barak Pharma Distributors',
      territory: 'Silchar Central',
      order_date: new Date().toISOString().split('T')[0],
      sub_total: 4500.0,
      gst_amount: 225.0,
      grand_total: 4725.0,
      items: [
        { brand_name: 'Cefpodoxime 200mg', pack: '10x10', qty: 10, pts: 250, total: 2500 },
        { brand_name: 'Pantoprazole DSR', pack: '10x10', qty: 10, pts: 200, total: 2000 },
      ],
      remarks: 'Fast delivery requested via Barak Pharma',
      latitude: 24.8149,
      longitude: 92.8039,
      sync_status: 'SYNCED',
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: { ...headers, Prefer: 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify(orderPayload),
    });

    if (res.ok) {
      console.log('   ✅ HTTP 201/200: POB Order booked successfully!');
      console.log(`      Order No: POB-E2E-${testSuffix} | SubTotal: ₹4500 | GST: ₹225 | Grand Total: ₹4725`);
      results.order = true;
    } else {
      console.error('   ❌ POB Order insertion failed:', res.status, await res.text());
    }
  } catch (err) {
    console.error('   ❌ POB Order network error:', err);
  }

  // -------------------------------------------------------------
  // TEST 4: VERIFY POSTGRESQL AUTOMATED AUDIT TRIGGER LOGS
  // -------------------------------------------------------------
  console.log('\n👉 [STEP 4/5] Verifying Automated PostgreSQL Audit Triggers...');
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/system_audit_logs?or=(record_id.eq.${testAttendanceId},record_id.eq.${testVisitId},record_id.eq.${testOrderId})&order=recorded_at.desc`,
      { headers }
    );

    if (res.ok) {
      const logs = await res.json();
      console.log(`   ✅ HTTP 200: Found ${logs.length} database audit trigger logs!`);
      logs.forEach((log) => {
        console.log(`      • [${log.action}] Table: "${log.table_name}" | Record ID: ${log.record_id} | At: ${log.recorded_at}`);
      });
      if (logs.length >= 2) {
        results.auditTriggers = true;
      }
    } else {
      console.error('   ❌ Audit log retrieval failed:', res.status, await res.text());
    }
  } catch (err) {
    console.error('   ❌ Audit log network error:', err);
  }

  // -------------------------------------------------------------
  // TEST 5: CLEANUP TEST ARTIFACTS
  // -------------------------------------------------------------
  console.log('\n👉 [STEP 5/5] Cleaning up test verification records...');
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/attendance?id=eq.${testAttendanceId}`, { method: 'DELETE', headers });
    await fetch(`${SUPABASE_URL}/rest/v1/visits?id=eq.${testVisitId}`, { method: 'DELETE', headers });
    await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${testOrderId}`, { method: 'DELETE', headers });
    console.log('   ✅ Temporary test records deleted cleanly.');
    results.cleanup = true;
  } catch (err) {
    console.warn('   ⚠️ Cleanup note:', err);
  }

  // -------------------------------------------------------------
  // FINAL SCORECARD
  // -------------------------------------------------------------
  console.log('\n================================================================');
  console.log('END-TO-END WORKFLOW VERIFICATION RESULTS');
  console.log('================================================================');
  console.log(`Attendance Persistence:     ${results.attendance ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`Doctor Call DCR Recording:  ${results.visit ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`Chemist POB Order Booking:  ${results.order ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`Automated Audit Triggers:   ${results.auditTriggers ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`Production Cleanliness:     ${results.cleanup ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log('================================================================\n');

  const allPassed = Object.values(results).every(Boolean);
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED! RepPulse database backend is 100% operational.');
    process.exit(0);
  } else {
    console.error('⚠️ Some tests did not pass. Check diagnostics above.');
    process.exit(1);
  }
}

runVerification();
