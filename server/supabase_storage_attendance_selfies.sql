-- ==============================================================================
-- RepPulse Pharma SFA — Supabase Storage: Attendance Selfies Bucket & Policies
-- Reference: RP-STORAGE-SELFIES-2026-v1
-- Execute in Supabase Cloud Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Create or Update attendance-selfies Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'attendance-selfies', 
    'attendance-selfies', 
    true, 
    5242880, -- 5 MB max per selfie
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

-- 2. Storage Objects Row-Level Security Policies
-- Allow upload (INSERT) from field mobile apps (MR / RSM)
DROP POLICY IF EXISTS "Allow upload to attendance-selfies" ON storage.objects;
CREATE POLICY "Allow upload to attendance-selfies"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'attendance-selfies');

-- Allow viewing/retrieval (SELECT) for Web Admin Portal & HRMS
DROP POLICY IF EXISTS "Allow read from attendance-selfies" ON storage.objects;
CREATE POLICY "Allow read from attendance-selfies"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'attendance-selfies');

-- Allow update in case of retry/overwrite
DROP POLICY IF EXISTS "Allow update to attendance-selfies" ON storage.objects;
CREATE POLICY "Allow update to attendance-selfies"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'attendance-selfies')
WITH CHECK (bucket_id = 'attendance-selfies');

-- Allow delete if admin purges
DROP POLICY IF EXISTS "Allow delete from attendance-selfies" ON storage.objects;
CREATE POLICY "Allow delete from attendance-selfies"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'attendance-selfies');
