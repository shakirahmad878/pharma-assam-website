-- ==============================================================================
-- RepPulse Pharma SFA — Approvals Schema (Late Login & Tour Plan Reschedule)
-- ==============================================================================

-- 1. LATE LOGIN REQUESTS TABLE
CREATE TABLE IF NOT EXISTS late_login_requests (
    id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL,
    employee_name TEXT NOT NULL,
    employee_code TEXT NOT NULL,
    date DATE NOT NULL,
    attempted_time TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_late_login_emp_date ON late_login_requests(employee_code, date);
CREATE INDEX IF NOT EXISTS idx_late_login_status ON late_login_requests(status);

-- 2. TOUR PLAN RESCHEDULE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS tour_plan_reschedule_requests (
    id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL,
    employee_name TEXT NOT NULL,
    employee_code TEXT NOT NULL,
    original_date DATE NOT NULL,
    new_date DATE NOT NULL,
    route_or_city TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reschedule_emp ON tour_plan_reschedule_requests(employee_code);
CREATE INDEX IF NOT EXISTS idx_reschedule_status ON tour_plan_reschedule_requests(status);

-- 3. ENABLE ROW-LEVEL SECURITY (RLS)
ALTER TABLE late_login_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_plan_reschedule_requests ENABLE ROW LEVEL SECURITY;

-- 4. POLICIES
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'late_login_requests' AND policyname = 'Allow full access late_login_requests'
    ) THEN
        CREATE POLICY "Allow full access late_login_requests" ON late_login_requests FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'tour_plan_reschedule_requests' AND policyname = 'Allow full access tour_plan_reschedule_requests'
    ) THEN
        CREATE POLICY "Allow full access tour_plan_reschedule_requests" ON tour_plan_reschedule_requests FOR ALL USING (true) WITH CHECK (true);
    END IF;
END
$$;
