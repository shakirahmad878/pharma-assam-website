-- ==============================================================================
-- REPPULSE — START WORKING ROUTE PLAN SELECTION UPDATE
-- File: server/supabase_schema_attendance_route_category.sql
-- Safe, Non-Destructive Schema Additions for Attendance Route Categories
-- ==============================================================================

-- 1. Safely add route category, identifiers, and remarks to attendance table
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS route_category TEXT;
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS route_id TEXT;
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS route_name TEXT;
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS hq_name TEXT;
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS route_remarks TEXT;

-- 2. Add check constraint for valid route categories if not already present
DO $$
BEGIN
    ALTER TABLE attendance DROP CONSTRAINT IF EXISTS chk_attendance_route_category;
    ALTER TABLE attendance ADD CONSTRAINT chk_attendance_route_category
        CHECK (route_category IS NULL OR route_category IN ('HQ', 'EXTENSION', 'OUTSTATION', 'OTHER'));
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Constraint check skipped: %', SQLERRM;
END $$;

-- 3. Helpful indices for reporting and attendance audits
CREATE INDEX IF NOT EXISTS idx_attendance_route_category ON attendance(route_category);
CREATE INDEX IF NOT EXISTS idx_attendance_hq_name ON attendance(hq_name);
