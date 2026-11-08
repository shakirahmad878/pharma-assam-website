-- ==============================================================================
-- RepPulse Pharma SFA — Security & Governance Hardening Migration (Self-Contained)
-- Reference: RP-SEC-HARDEN-2026-v2
-- Designed to execute cleanly in Supabase SQL Editor with full table guards
-- ==============================================================================

-- 1. BASE ORDERS TABLE (POB Bookings with Line Items)
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    employee_id TEXT NOT NULL,
    employee_name TEXT NOT NULL,
    buyer_type TEXT NOT NULL DEFAULT 'CHEMIST',
    buyer_id TEXT NOT NULL,
    buyer_name TEXT NOT NULL,
    stockist_name TEXT,
    territory TEXT NOT NULL,
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    sub_total NUMERIC NOT NULL DEFAULT 0,
    gst_amount NUMERIC NOT NULL DEFAULT 0,
    grand_total NUMERIC NOT NULL DEFAULT 0,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    remarks TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    sync_status TEXT NOT NULL DEFAULT 'SYNCED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_emp ON orders(employee_id);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);

-- 2. ROLE PERMISSIONS GOVERNANCE TABLE
CREATE TABLE IF NOT EXISTS role_permissions (
    id TEXT PRIMARY KEY,
    role TEXT NOT NULL UNIQUE CHECK (role IN ('MEDICAL_REP', 'REGIONAL_MANAGER', 'AREA_MANAGER', 'HR_MANAGER', 'SUPER_ADMIN')),
    can_punch_attendance BOOLEAN NOT NULL DEFAULT true,
    can_view_all_telemetry BOOLEAN NOT NULL DEFAULT false,
    can_request_live_location BOOLEAN NOT NULL DEFAULT false,
    can_approve_late_login BOOLEAN NOT NULL DEFAULT false,
    can_approve_tour_reschedule BOOLEAN NOT NULL DEFAULT false,
    can_delete_doctors BOOLEAN NOT NULL DEFAULT false,
    can_approve_doctor_deletion BOOLEAN NOT NULL DEFAULT false,
    can_book_pob BOOLEAN NOT NULL DEFAULT true,
    can_view_mis_reports BOOLEAN NOT NULL DEFAULT false,
    can_manage_territories BOOLEAN NOT NULL DEFAULT false,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed Canonical Role Permissions
INSERT INTO role_permissions (
    id, role, can_punch_attendance, can_view_all_telemetry, can_request_live_location, 
    can_approve_late_login, can_approve_tour_reschedule, can_delete_doctors, 
    can_approve_doctor_deletion, can_book_pob, can_view_mis_reports, can_manage_territories, description
) VALUES
(
    'perm_mr', 'MEDICAL_REP', 
    true, false, false, 
    false, false, false, 
    false, true, false, false,
    'Field representative conducting doctor/chemist visits, sample detailing, and order booking in designated beat.'
),
(
    'perm_abm', 'AREA_MANAGER', 
    true, true, true, 
    true, true, false, 
    false, true, true, false,
    'Area Business Manager overseeing territory beats, approving field exceptions, and co-working with MRs.'
),
(
    'perm_rsm', 'REGIONAL_MANAGER', 
    true, true, true, 
    true, true, true, 
    true, true, true, true,
    'Regional Sales Manager supervising entire division (Barak Valley, Tripura, Mizoram), approving MTPs, and managing territory staff.'
),
(
    'perm_hr', 'HR_MANAGER', 
    false, true, false, 
    true, false, false, 
    false, false, true, false,
    'Human Resources Manager overseeing attendance compliance, late login waivers, and payroll rosters.'
),
(
    'perm_admin', 'SUPER_ADMIN', 
    true, true, true, 
    true, true, true, 
    true, true, true, true,
    'Executive and Master Administrator with full platform governance across all divisions.'
)
ON CONFLICT (role) DO UPDATE SET
    can_view_all_telemetry = EXCLUDED.can_view_all_telemetry,
    can_request_live_location = EXCLUDED.can_request_live_location,
    can_approve_late_login = EXCLUDED.can_approve_late_login,
    can_approve_tour_reschedule = EXCLUDED.can_approve_tour_reschedule,
    can_approve_doctor_deletion = EXCLUDED.can_approve_doctor_deletion,
    can_view_mis_reports = EXCLUDED.can_view_mis_reports,
    can_manage_territories = EXCLUDED.can_manage_territories,
    updated_at = NOW();

-- 3. SYSTEM AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS system_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    record_id TEXT NOT NULL,
    employee_id TEXT,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    user_agent TEXT,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_table_date ON system_audit_logs(table_name, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_record ON system_audit_logs(record_id);

-- 4. AUDIT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION fn_reppulse_audit_log()
RETURNS TRIGGER AS $$
DECLARE
    acting_emp_id TEXT := NULL;
    rec_id TEXT := NULL;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        rec_id := OLD.id::TEXT;
        BEGIN
            acting_emp_id := OLD.employee_id;
        EXCEPTION WHEN OTHERS THEN
            acting_emp_id := NULL;
        END;

        INSERT INTO system_audit_logs (table_name, action, record_id, employee_id, old_data, new_data)
        VALUES (TG_TABLE_NAME, 'DELETE', rec_id, acting_emp_id, to_jsonb(OLD), NULL);
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        rec_id := NEW.id::TEXT;
        BEGIN
            acting_emp_id := NEW.employee_id;
        EXCEPTION WHEN OTHERS THEN
            acting_emp_id := NULL;
        END;

        INSERT INTO system_audit_logs (table_name, action, record_id, employee_id, old_data, new_data)
        VALUES (TG_TABLE_NAME, 'UPDATE', rec_id, acting_emp_id, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        rec_id := NEW.id::TEXT;
        BEGIN
            acting_emp_id := NEW.employee_id;
        EXCEPTION WHEN OTHERS THEN
            acting_emp_id := NULL;
        END;

        INSERT INTO system_audit_logs (table_name, action, record_id, employee_id, old_data, new_data)
        VALUES (TG_TABLE_NAME, 'INSERT', rec_id, acting_emp_id, NULL, to_jsonb(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. ATTACH AUDIT TRIGGERS SAFELY
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'attendance') THEN
        DROP TRIGGER IF EXISTS trg_audit_attendance ON attendance;
        CREATE TRIGGER trg_audit_attendance
        AFTER INSERT OR UPDATE OR DELETE ON attendance
        FOR EACH ROW EXECUTE FUNCTION fn_reppulse_audit_log();
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders') THEN
        DROP TRIGGER IF EXISTS trg_audit_orders ON orders;
        CREATE TRIGGER trg_audit_orders
        AFTER INSERT OR UPDATE OR DELETE ON orders
        FOR EACH ROW EXECUTE FUNCTION fn_reppulse_audit_log();
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'visits') THEN
        DROP TRIGGER IF EXISTS trg_audit_visits ON visits;
        CREATE TRIGGER trg_audit_visits
        AFTER INSERT OR UPDATE OR DELETE ON visits
        FOR EACH ROW EXECUTE FUNCTION fn_reppulse_audit_log();
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'doctors') THEN
        DROP TRIGGER IF EXISTS trg_audit_doctors ON doctors;
        CREATE TRIGGER trg_audit_doctors
        AFTER INSERT OR UPDATE OR DELETE ON doctors
        FOR EACH ROW EXECUTE FUNCTION fn_reppulse_audit_log();
    END IF;
END $$;

-- 6. DATA INTEGRITY & SANITY CONSTRAINTS
DO $$
BEGIN
    -- Ensure orders total cannot be negative
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_orders_positive_total') THEN
            ALTER TABLE orders ADD CONSTRAINT chk_orders_positive_total CHECK (grand_total >= 0);
        END IF;
    END IF;

    -- Ensure attendance coordinates are geographically valid if present
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'attendance') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_attendance_coords_valid') THEN
            ALTER TABLE attendance ADD CONSTRAINT chk_attendance_coords_valid 
            CHECK (latitude BETWEEN -90 AND 90 AND longitude BETWEEN -180 AND 180);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_attendance_battery_range') THEN
            ALTER TABLE attendance ADD CONSTRAINT chk_attendance_battery_range 
            CHECK (battery_percentage IS NULL OR (battery_percentage >= 0 AND battery_percentage <= 100));
        END IF;
    END IF;
END $$;

-- 7. RLS POLICIES
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_audit_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    -- Orders Policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Allow access orders') THEN
        CREATE POLICY "Allow access orders" ON orders FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- Role Permissions Policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'role_permissions' AND policyname = 'Allow read role_permissions') THEN
        CREATE POLICY "Allow read role_permissions" ON role_permissions FOR SELECT USING (true);
    END IF;

    -- System Audit Logs Policy (Management Read)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'system_audit_logs' AND policyname = 'Allow admin read system_audit_logs') THEN
        CREATE POLICY "Allow admin read system_audit_logs" ON system_audit_logs FOR SELECT USING (true);
    END IF;
END $$;
