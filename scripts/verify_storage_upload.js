const SUPABASE_URL = 'https://ibcyqtnpzdttwuhyhlra.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliY3lxdG5wemR0dHd1aHlobHJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4OTc0ODcsImV4cCI6MjEwNzQ3MzQ4N30.JTMIcW9cz-G1NbEpKFl1Vg3AN46jHktpbGO5SAykjuI';

async function verifyStorage() {
  console.log('======================================================');
  console.log('REPPULSE SUPABASE STORAGE VERIFICATION');
  console.log('======================================================\n');

  console.log('👉 [1/2] Uploading verified test selfie image to attendance-selfies...');
  const sampleJpegBase64 = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
  const buffer = Buffer.from(sampleJpegBase64, 'base64');
  const filename = `TEST/test_selfie_${Date.now()}.jpg`;

  const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/attendance-selfies/${filename}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'image/jpeg',
    },
    body: buffer,
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    throw new Error(`Upload failed HTTP ${uploadRes.status}: ${err}`);
  }
  const uploadData = await uploadRes.json();
  console.log(`   ✅ HTTP 200: Successfully uploaded test selfie to Supabase Storage!`);
  console.log(`      Key: ${uploadData.Key}`);

  // 2. Test retrieving the public URL
  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/attendance-selfies/${filename}`;
  console.log(`\n👉 [2/2] Verifying public access to URL:\n   ${publicUrl}`);
  const fetchRes = await fetch(publicUrl);
  console.log(`   HTTP Status: ${fetchRes.status}`);
  if (fetchRes.status === 200) {
    console.log('   ✅ HTTP 200: Image is publicly viewable by Web Admin & HRMS portals!');
  } else {
    throw new Error(`Public read failed HTTP ${fetchRes.status}`);
  }

  console.log('\n🎉 CLOUD STORAGE ATTENDANCE SELFIES VERIFICATION COMPLETE — 100% SUCCESS!');
}

verifyStorage().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
