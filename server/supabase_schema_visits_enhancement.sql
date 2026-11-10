-- ==============================================================================
-- REPPULSE — PRODUCTION VISIT MODULE WORKFLOW UPGRADE
-- File: server/supabase_schema_visits_enhancement.sql
-- Safe, Non-Destructive Schema Additions for Field Visits
-- ==============================================================================

-- 1. Safely add customer type and chemist support to visits table
ALTER TABLE visits ADD COLUMN IF NOT EXISTS customer_type TEXT NOT NULL DEFAULT 'DOCTOR';
ALTER TABLE visits ADD COLUMN IF NOT EXISTS chemist_id TEXT;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS chemist_name TEXT;

-- 2. Safely add visit workflow, objectives and timing columns
ALTER TABLE visits ADD COLUMN IF NOT EXISTS visit_objective TEXT;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS start_time TIMESTAMPTZ;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS end_time TIMESTAMPTZ;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 0;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS pob_amount NUMERIC DEFAULT 0;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS dcr_id TEXT;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS accompanied_by TEXT;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS feedback TEXT;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS next_visit_date DATE;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS is_unplanned BOOLEAN DEFAULT false;

-- 3. Make doctor_id and doctor_name nullable to gracefully allow Chemist/Stockist visits
ALTER TABLE visits ALTER COLUMN doctor_id DROP NOT NULL;
ALTER TABLE visits ALTER COLUMN doctor_name DROP NOT NULL;

-- 4. Safely update status check constraint to support full field visit lifecycle
--    (PLANNED, STARTED, IN_PROGRESS, COMPLETED, MISSED, SKIPPED)
DO $$
BEGIN
    ALTER TABLE visits DROP CONSTRAINT IF EXISTS visits_status_check;
    ALTER TABLE visits ADD CONSTRAINT visits_status_check 
        CHECK (status IN ('PLANNED', 'STARTED', 'IN_PROGRESS', 'COMPLETED', 'MISSED', 'SKIPPED'));
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Constraint update skipped or not applicable: %', SQLERRM;
END $$;

-- 5. High-performance indexes for field visit queries & administrative reporting
CREATE INDEX IF NOT EXISTS idx_visits_customer_type ON visits(customer_type);
CREATE INDEX IF NOT EXISTS idx_visits_chemist_id ON visits(chemist_id);
CREATE INDEX IF NOT EXISTS idx_visits_status ON visits(status);
CREATE INDEX IF NOT EXISTS idx_visits_emp_date ON visits(employee_id, visit_date);
CREATE INDEX IF NOT EXISTS idx_visits_created_at ON visits(created_at DESC);

-- 6. Ensure RLS policies allow authenticated read & insert/update for visits
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'visits' AND policyname = 'Authenticated full access on visits'
    ) THEN
        CREATE POLICY "Authenticated full access on visits" 
            ON visits FOR ALL 
            TO authenticated 
            USING (true) 
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'visits' AND policyname = 'Anon read access on visits'
    ) THEN
        CREATE POLICY "Anon read access on visits" 
            ON visits FOR SELECT 
            TO anon 
            USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'visits' AND policyname = 'Anon insert access on visits'
    ) THEN
        CREATE POLICY "Anon insert access on visits" 
            ON visits FOR INSERT 
            TO anon 
            WITH CHECK (true);
    END IF;
END $$;
