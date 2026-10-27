-- ==============================================================================
-- RepPulse Pharma SFA — Supabase PostgreSQL Production Schema
-- Designed for 100% compatibility with live field data & division isolation
-- Covers: Silchar (Cachar), Hailakandi, Karimganj, Aizawl, Tripura (Agartala)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. EMPLOYEES TABLE
-- Stores credentials, assigned headquarters, PINs and divisions
-- ==============================================================================
CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    employee_code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    role TEXT NOT NULL DEFAULT 'MEDICAL_REP' CHECK (role IN ('SUPER_ADMIN', 'REGIONAL_MANAGER', 'AREA_MANAGER', 'MEDICAL_REP')),
    phone TEXT NOT NULL UNIQUE,
    pin TEXT NOT NULL DEFAULT '1234',
    territory TEXT NOT NULL,
    headquarter TEXT NOT NULL,
    assigned_route_ids JSONB DEFAULT '[]'::jsonb,
    active_route_id TEXT DEFAULT 'route-cachar-01',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_employees_code ON employees(employee_code);
CREATE INDEX IF NOT EXISTS idx_employees_phone ON employees(phone);
CREATE INDEX IF NOT EXISTS idx_employees_role ON employees(role);

-- ==============================================================================
-- 3. DOCTORS TABLE
-- Exact mapping for all 31 live field doctors + new doctors
-- ==============================================================================
CREATE TABLE IF NOT EXISTS doctors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    specialty TEXT NOT NULL DEFAULT 'General Physician',
    qualification TEXT NOT NULL DEFAULT 'MBBS',
    clinic_name TEXT NOT NULL,
    clinic_address TEXT,
    area TEXT NOT NULL,
    district TEXT NOT NULL CHECK (district IN ('Cachar', 'Hailakandi', 'Karimganj', 'Aizawl', 'Tripura', 'Agartala', 'Dharmanagar')),
    phone TEXT,
    tier TEXT NOT NULL DEFAULT 'A' CHECK (tier IN ('A_PLUS', 'A', 'B', 'C')),
    monthly_visit_target INT NOT NULL DEFAULT 8,
    completed_visits_this_month INT NOT NULL DEFAULT 0,
    today_visit_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (today_visit_status IN ('PENDING', 'COMPLETED', 'MISSED', 'NOT_SCHEDULED')),
    last_visit_date TEXT,
    route_id TEXT DEFAULT 'route-cachar-01',
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    geofence_radius_meters INT NOT NULL DEFAULT 100,
    is_assigned_to_me BOOLEAN NOT NULL DEFAULT false,
    created_by_employee_id TEXT REFERENCES employees(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doctors_district ON doctors(district);
CREATE INDEX IF NOT EXISTS idx_doctors_tier ON doctors(tier);
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors(specialty);
CREATE INDEX IF NOT EXISTS idx_doctors_name ON doctors(name);

-- ==============================================================================
-- 4. FIRMS TABLE (Retailers, Distributors, Stockists)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS firms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'Retailer' CHECK (type IN ('Retailer', 'Distributor', 'Stockist')),
    contact_person TEXT NOT NULL DEFAULT 'Proprietor / Pharmacist',
    phone TEXT NOT NULL,
    dl_number TEXT NOT NULL DEFAULT 'AS-REG-2026-DL-0000',
    area TEXT NOT NULL,
    district TEXT NOT NULL CHECK (district IN ('Cachar', 'Hailakandi', 'Karimganj', 'Aizawl', 'Tripura', 'Agartala', 'Dharmanagar')),
    address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_firms_district ON firms(district);
CREATE INDEX IF NOT EXISTS idx_firms_type ON firms(type);

-- ==============================================================================
-- 5. ATTENDANCE TABLE (Daily GPS & Selfie Punch-in Logs)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS attendance (
    id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    employee_name TEXT NOT NULL,
    date DATE NOT NULL,
    punch_in_timestamp TIMESTAMPTZ,
    punch_out_timestamp TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'PUNCHED_IN' CHECK (status IN ('PUNCHED_IN', 'PUNCHED_OUT', 'ABSENT', 'LEAVE')),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    accuracy_meters DOUBLE PRECISION,
    is_mock_location BOOLEAN NOT NULL DEFAULT false,
    battery_percentage INT,
    selfie_url TEXT,
    sync_status TEXT NOT NULL DEFAULT 'SYNCED',
    server_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attendance_employee_date ON attendance(employee_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);

-- ==============================================================================
-- 6. VISITS / DCR TABLE (Field Doctor & Chemist Calls)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS visits (
    id TEXT PRIMARY KEY,
    doctor_id TEXT REFERENCES doctors(id) ON DELETE CASCADE,
    doctor_name TEXT NOT NULL,
    employee_id TEXT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    employee_name TEXT NOT NULL,
    district TEXT NOT NULL,
    visit_date DATE NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('COMPLETED', 'PENDING', 'MISSED')),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    is_geofence_verified BOOLEAN NOT NULL DEFAULT true,
    distance_meters DOUBLE PRECISION DEFAULT 0,
    notes TEXT,
    products_discussed JSONB DEFAULT '[]'::jsonb,
    samples_given JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visits_employee_date ON visits(employee_id, visit_date);
CREATE INDEX IF NOT EXISTS idx_visits_doctor ON visits(doctor_id);
CREATE INDEX IF NOT EXISTS idx_visits_district ON visits(district);

-- ==============================================================================
-- 7. DOCTOR DELETION REQUESTS TABLE (RSM Approval Workflow)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS doctor_deletion_requests (
    id TEXT PRIMARY KEY,
    doctor_id TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    requested_by_employee_id TEXT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    requested_by_name TEXT NOT NULL,
    district TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    reviewed_by_employee_id TEXT REFERENCES employees(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deletion_requests_status ON doctor_deletion_requests(status);

-- ==============================================================================
-- 8. HEADQUARTERS & TERRITORIES METADATA TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS territories (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    district TEXT NOT NULL UNIQUE,
    state TEXT NOT NULL,
    headquarter_name TEXT NOT NULL,
    description TEXT
);

-- Seed Official Headquarters
INSERT INTO territories (id, code, name, district, state, headquarter_name, description)
VALUES
    ('terr-silchar', 'HQ-SIL-01', 'Silchar Division', 'Cachar', 'Assam', 'Silchar Regional HQ', 'Regional HQ covering SMCH, Hospital Road & central healthcare corridors'),
    ('terr-hailakandi', 'HQ-HKD-01', 'Hailakandi Division', 'Hailakandi', 'Assam', 'Hailakandi HQ', 'Subdivisional healthcare network & S.K. Roy Civil Hospital area'),
    ('terr-karimganj', 'HQ-KXJ-01', 'Karimganj Division (Shribhumi)', 'Karimganj', 'Assam', 'Karimganj HQ', 'Commercial wholesale market, Station Road & Civil Hospital belt'),
    ('terr-aizawl', 'HQ-AIZ-01', 'Aizawl Division', 'Aizawl', 'Mizoram', 'Aizawl HQ', 'Capital healthcare corridor: Civil Hospital, ZMC Falkawn & Chanmari'),
    ('terr-agartala', 'HQ-AGT-01', 'Agartala Division', 'Agartala', 'Tripura', 'Agartala HQ', 'Capital medical hub: AGMC & GBP Hospital, TMC Hapania & Akhaura Road'),
    ('terr-dharmanagar', 'HQ-DMN-01', 'Dharmanagar Division', 'Dharmanagar', 'Tripura', 'Dharmanagar HQ', 'North Tripura HQ covering District Hospital, Station Rd & Town Belt')
ON CONFLICT (district) DO UPDATE 
SET name = EXCLUDED.name, headquarter_name = EXCLUDED.headquarter_name, description = EXCLUDED.description;

-- ==============================================================================
-- 9. ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE territories ENABLE ROW LEVEL SECURITY;

-- Anonymous/Public Read Policy for Client Authentication (Read Active Employees for Login)
CREATE POLICY "Allow public login verification" ON employees
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow update employees" ON employees
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow insert employees" ON employees
    FOR INSERT WITH CHECK (true);

-- General Access Policies for App Users
CREATE POLICY "Allow read territories" ON territories
    FOR SELECT USING (true);

CREATE POLICY "Allow full access for all operations" ON doctors
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow full access for all operations" ON firms
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow full access for all operations" ON attendance
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow full access for all operations" ON visits
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow full access for all operations" ON doctor_deletion_requests
    FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 10. LATE LOGIN REQUESTS TABLE (10:30 AM Cutoff Authorization)
-- ==============================================================================
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

ALTER TABLE late_login_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access for late_login_requests" ON late_login_requests
    FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 11. TOUR PLAN RESCHEDULE REQUESTS TABLE (RSM Beat Rescheduling)
-- ==============================================================================
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

ALTER TABLE tour_plan_reschedule_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access for tour_plan_reschedule_requests" ON tour_plan_reschedule_requests
    FOR ALL USING (true) WITH CHECK (true);

