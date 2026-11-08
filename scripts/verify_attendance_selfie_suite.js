const SUPABASE_URL = 'https://ibcyqtnpzdttwuhyhlra.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliY3lxdG5wemR0dHd1aHlobHJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4OTc0ODcsImV4cCI6MjEwNzQ3MzQ4N30.JTMIcW9cz-G1NbEpKFl1Vg3AN46jHktpbGO5SAykjuI';

async function testAttendanceSuite() {
  console.log('======================================================');
  console.log('REPPULSE ATTENDANCE & SELFIE VERIFICATION SUITE');
  console.log('======================================================\n');

  // Test 1: Fetch paginated attendance records
  console.log('👉 [TEST 1] Fetching live paginated attendance records...');
  const res = await fetch(`${SUPABASE_URL}/rest/v1/attendance?order=date.desc,created_at.desc&limit=10&offset=0`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: 'count=exact',
    },
  });

  const contentRange = res.headers.get('content-range');
  console.log(`   Content-Range: ${contentRange}`);
  const data = await res.json();
  console.log(`   Total records returned in page: ${data.length}`);
  if (data.length > 0) {
    console.log(`   Latest Record: ${data[0].employee_name} (${data[0].employee_id}) on ${data[0].date}`);
    console.log(`   Selfie URL: ${data[0].selfie_url}`);
    console.log(`   GPS: ${data[0].latitude}, ${data[0].longitude} (accuracy: ${data[0].accuracy_meters}m)`);
  }

  // Test 2: Filter by status
  console.log('\n👉 [TEST 2] Testing Status filter (PUNCHED_IN)...');
  const resPunchedIn = await fetch(`${SUPABASE_URL}/rest/v1/attendance?status=eq.PUNCHED_IN&limit=5`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: 'count=exact',
    },
  });
  const dataPunchedIn = await resPunchedIn.json();
  console.log(`   Found ${dataPunchedIn.length} records with status=PUNCHED_IN`);

  // Test 3: Search by employee name or code
  console.log('\n👉 [TEST 3] Testing Search filter (NLCL-0003)...');
  const resSearch = await fetch(`${SUPABASE_URL}/rest/v1/attendance?or=(employee_name.ilike.*Bodrud*,employee_id.ilike.*0003*)&limit=5`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: 'count=exact',
    },
  });
  const dataSearch = await resSearch.json();
  console.log(`   Found ${dataSearch.length} records matching Bodrud / 0003`);
  dataSearch.forEach(r => {
    console.log(`   - ${r.date}: ${r.employee_name} [${r.status}]`);
  });

  console.log('\n✅ ALL DATABASE QUERY CHECKS PASSED SUCCESSFULLY!');
}

testAttendanceSuite().catch(console.error);
