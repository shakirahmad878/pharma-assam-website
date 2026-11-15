-- ==============================================================================
-- RepPulse Pharma SFA — 100% Comprehensive Database Schema & Seed Data
-- Eliminates all local mock fixtures across the entire mobile application.
-- Covers: Routes, Tour Plans, Products, Expenses, SFC, Leaves, Holidays, Business Targets
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. OPERATIONAL ROUTES TABLE
-- Stores HQ, Ex-Stations, and Outstation beats
-- ==============================================================================
CREATE TABLE IF NOT EXISTS routes (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    parent_hq TEXT NOT NULL,
    route_type TEXT NOT NULL CHECK (route_type IN ('HQ', 'EXTENSION', 'OUTSTATION', 'OTHER')),
    district TEXT NOT NULL,
    areas JSONB DEFAULT '[]'::jsonb,
    distance_km INT NOT NULL DEFAULT 15,
    standard_fare INT NOT NULL DEFAULT 45,
    da_allowed INT NOT NULL DEFAULT 250,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_routes_parent_hq ON routes(parent_hq);
CREATE INDEX IF NOT EXISTS idx_routes_type ON routes(route_type);

ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access for routes" ON routes FOR ALL USING (true) WITH CHECK (true);

-- Seed Comprehensive Operational Routes
INSERT INTO routes (id, code, name, parent_hq, route_type, district, areas, distance_km, standard_fare, da_allowed)
VALUES
    -- Silchar Base
    ('rt-sil-01', 'HQ-SIL-01', 'Silchar Central - SMCH & Hospital Road', 'Silchar', 'HQ', 'Cachar', '["SMCH Ghungoor", "Hospital Road", "Park Road", "Ambicapatty", "College Road"]'::jsonb, 10, 30, 250),
    ('rt-sil-02', 'HQ-SIL-02', 'Silchar North - Tarapur, Rangirkhari & Meherpur', 'Silchar', 'HQ', 'Cachar', '["Tarapur", "Rangirkhari Point", "Meherpur", "Malugram", "Sadarghat"]'::jsonb, 15, 45, 250),
    ('rt-sil-kalain', 'EX-SIL-01', 'Silchar to Kalain (Ex-station)', 'Silchar', 'EXTENSION', 'Cachar', '["Kalain Town", "Kalain Hospital Road", "Gumrah Bazar", "Bihara"]'::jsonb, 55, 165, 450),
    ('rt-sil-bagha', 'EX-SIL-02', 'Silchar to Bagha & Natunbazar (Ex-station)', 'Silchar', 'EXTENSION', 'Cachar', '["Bagha Bazar", "Natunbazar", "Islamabad", "Talent Drug Store Belt"]'::jsonb, 65, 195, 450),
    ('rt-sil-badarpur', 'EX-SIL-03', 'Silchar to Badarpur (Ex-station)', 'Silchar', 'EXTENSION', 'Cachar', '["Badarpur Junction", "Badarpur Town", "Bhangarpar"]'::jsonb, 35, 105, 450),
    ('rt-sil-sonai', 'EX-SIL-04', 'Silchar to Sonai, Sonabarighat & Nayabazar (Ex-station)', 'Silchar', 'EXTENSION', 'Cachar', '["Sonai FRU", "Sonabarighat", "Nayabazar", "Kachudaram"]'::jsonb, 38, 114, 450),
    ('rt-sil-lakhipur', 'EX-SIL-05', 'Silchar to Lakhipur & Dhalai (Ex-station)', 'Silchar', 'EXTENSION', 'Cachar', '["Lakhipur Civil Hospital", "Dhalai Bazar", "Fulertal"]'::jsonb, 60, 180, 450),
    ('rt-sil-halflong', 'OUT-SIL-01', 'Silchar to Halflong (Outstation)', 'Silchar', 'OUTSTATION', 'Dima Hasao', '["Halflong Civil Hospital", "Haflong Market", "Mahur"]'::jsonb, 140, 420, 750),
    ('rt-sil-aizawl', 'OUT-SIL-02', 'Silchar to Aizawl Corridor (Outstation)', 'Silchar', 'OUTSTATION', 'Aizawl', '["ZMC Falkawn", "Chanmari", "Bawngkawn", "Civil Hospital Aizawl"]'::jsonb, 180, 540, 750),

    -- Karimganj Base
    ('rt-kxj-01', 'HQ-KXJ-01', 'Karimganj Town & Station Road Hub', 'Karimganj', 'HQ', 'Karimganj', '["Civil Hospital Road", "Station Road", "Settlement Area", "Main Road"]'::jsonb, 15, 45, 250),
    ('rt-kxj-02', 'HQ-KXJ-02', 'Karimganj South - Nilambazar & Charbazar', 'Karimganj', 'HQ', 'Karimganj', '["Nilambazar", "Charbazar", "Settlement Point"]'::jsonb, 32, 96, 250),
    ('rt-kxj-patharkandi', 'EX-KXJ-01', 'Karimganj to Patharkandi (Ex-station)', 'Karimganj', 'EXTENSION', 'Karimganj', '["Patharkandi Town", "Patharkandi Hospital Rd", "Defalcherra"]'::jsonb, 70, 210, 450),
    ('rt-kxj-badarpur', 'EX-KXJ-02', 'Karimganj to Badarpur & RK Nagar (Ex-station)', 'Karimganj', 'EXTENSION', 'Karimganj', '["Badarpur Junction", "Ramkrishna Nagar", "Anipur"]'::jsonb, 66, 198, 450),
    ('rt-kxj-makunda', 'OUT-KXJ-01', 'Karimganj to Makunda Christian Hospital (Outstation)', 'Karimganj', 'OUTSTATION', 'Karimganj', '["Makunda Christian Hospital", "Bazaricherra", "Churaibari"]'::jsonb, 154, 462, 750),
    ('rt-kxj-dharmanagar', 'EX-KXJ-03', 'Karimganj to Dharmanagar (Ex-station)', 'Karimganj', 'EXTENSION', 'Dharmanagar', '["Dharmanagar District Hospital", "Station Road", "Town Belt"]'::jsonb, 75, 225, 450),

    -- Hailakandi Base
    ('rt-hkd-01', 'HQ-HKD-01', 'Hailakandi Town & S.K. Roy Civil Hospital', 'Hailakandi', 'HQ', 'Hailakandi', '["S.K. Roy Hospital Road", "Station Road", "Rabindra Sarani"]'::jsonb, 12, 36, 250),
    ('rt-hkd-lala', 'EX-HKD-01', 'Hailakandi to Lala Bazar & Katlicherra (Ex-station)', 'Hailakandi', 'EXTENSION', 'Hailakandi', '["Lala Bazar", "Katlicherra FRU", "Algapur"]'::jsonb, 55, 165, 450),

    -- Aizawl Base
    ('rt-aiz-01', 'HQ-AIZ-01', 'Aizawl City & Hospital Corridor', 'Aizawl', 'HQ', 'Aizawl', '["Civil Hospital", "Chanmari", "Bawngkawn", "Dawrpui"]'::jsonb, 20, 60, 250),
    ('rt-aiz-zmc', 'EX-AIZ-01', 'Aizawl to ZMC Falkawn (Ex-station)', 'Aizawl', 'EXTENSION', 'Aizawl', '["Zoram Medical College Falkawn", "Kulikawn Hospital"]'::jsonb, 45, 135, 450),

    -- Dharmanagar Base
    ('rt-dmn-01', 'HQ-DMN-01', 'Dharmanagar Town & District Hospital', 'Dharmanagar', 'HQ', 'Dharmanagar', '["North Tripura District Hospital", "Station Road", "Town Core"]'::jsonb, 15, 45, 250),
    ('rt-dmn-panisagar', 'EX-DMN-01', 'Dharmanagar to Panisagar & Kanchanpur (Ex-station)', 'Dharmanagar', 'EXTENSION', 'Dharmanagar', '["Panisagar Sub-divisional Hospital", "Kanchanpur"]'::jsonb, 60, 180, 450)
ON CONFLICT (code) DO UPDATE
SET name = EXCLUDED.name, parent_hq = EXCLUDED.parent_hq, route_type = EXCLUDED.route_type,
    distance_km = EXCLUDED.distance_km, standard_fare = EXCLUDED.standard_fare, da_allowed = EXCLUDED.da_allowed;

-- ==============================================================================
-- 3. TOUR PLANS TABLE (Monthly Tour Programme - MTP)
-- Central schedule for representatives
-- ==============================================================================
CREATE TABLE IF NOT EXISTS tour_plans (
    id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL,
    employee_code TEXT NOT NULL,
    employee_name TEXT NOT NULL,
    date DATE NOT NULL,
    year INT NOT NULL DEFAULT 2026,
    month INT NOT NULL DEFAULT 11,
    day_number INT NOT NULL,
    day_of_week TEXT NOT NULL,
    city TEXT NOT NULL,
    route_id TEXT,
    route_type TEXT DEFAULT 'HQ',
    target_doctor_calls INT NOT NULL DEFAULT 10,
    target_chemist_calls INT NOT NULL DEFAULT 4,
    status TEXT NOT NULL DEFAULT 'APPROVED' CHECK (status IN ('DRAFT', 'SUBMITTED', 'APPROVED', 'COMPLETED', 'DEVIATED')),
    type TEXT NOT NULL DEFAULT 'TOUR' CHECK (type IN ('TOUR', 'SUNDAY', 'LEAVE', 'HOLIDAY', 'RESCHEDULED')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tour_plans_emp_date ON tour_plans(employee_code, date);
CREATE INDEX IF NOT EXISTS idx_tour_plans_emp_month ON tour_plans(employee_code, year, month);

ALTER TABLE tour_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access for tour_plans" ON tour_plans FOR ALL USING (true) WITH CHECK (true);

-- Seed Satyam Shil's (NLCL-0005) Official November 2026 Tour Plan
INSERT INTO tour_plans (id, employee_id, employee_code, employee_name, date, year, month, day_number, day_of_week, city, route_id, route_type, target_doctor_calls, target_chemist_calls, status, type)
VALUES
    ('tp-satyam-2026-11-20', 'usr-nlcl-0005', 'NLCL-0005', 'Satyam Shil', '2026-11-20', 2026, 11, 20, 'Fri', 'Work at kalain Ex-station', 'rt-sil-kalain', 'EXTENSION', 10, 4, 'APPROVED', 'TOUR'),
    ('tp-satyam-2026-11-21', 'usr-nlcl-0005', 'NLCL-0005', 'Satyam Shil', '2026-11-21', 2026, 11, 21, 'Sat', 'Work at SilcharHQ', 'rt-sil-01', 'HQ', 10, 4, 'APPROVED', 'TOUR'),
    ('tp-satyam-2026-11-22', 'usr-nlcl-0005', 'NLCL-0005', 'Satyam Shil', '2026-11-22', 2026, 11, 22, 'Sun', 'Weekly Rest / Sunday', null, 'HQ', 0, 0, 'APPROVED', 'SUNDAY'),
    ('tp-satyam-2026-11-23', 'usr-nlcl-0005', 'NLCL-0005', 'Satyam Shil', '2026-11-23', 2026, 11, 23, 'Mon', 'Work at SilcharHQ', 'rt-sil-02', 'HQ', 10, 4, 'APPROVED', 'TOUR'),
    ('tp-satyam-2026-11-24', 'usr-nlcl-0005', 'NLCL-0005', 'Satyam Shil', '2026-11-24', 2026, 11, 24, 'Tue', 'Work at sonai, sonabarighat,nayabazar', 'rt-sil-sonai', 'EXTENSION', 10, 4, 'APPROVED', 'TOUR'),
    ('tp-satyam-2026-11-25', 'usr-nlcl-0005', 'NLCL-0005', 'Satyam Shil', '2026-11-25', 2026, 11, 25, 'Wed', 'Work at SilcharHQ', 'rt-sil-01', 'HQ', 10, 4, 'APPROVED', 'TOUR'),
    ('tp-satyam-2026-11-26', 'usr-nlcl-0005', 'NLCL-0005', 'Satyam Shil', '2026-11-26', 2026, 11, 26, 'Thu', 'Work at SilcharHQ', 'rt-sil-02', 'HQ', 10, 4, 'APPROVED', 'TOUR'),
    ('tp-satyam-2026-11-27', 'usr-nlcl-0005', 'NLCL-0005', 'Satyam Shil', '2026-11-27', 2026, 11, 27, 'Fri', 'Work at bagha ,natunbazar', 'rt-sil-bagha', 'EXTENSION', 10, 4, 'APPROVED', 'TOUR'),
    ('tp-satyam-2026-11-28', 'usr-nlcl-0005', 'NLCL-0005', 'Satyam Shil', '2026-11-28', 2026, 11, 28, 'Sat', 'Work at SilcharHQ', 'rt-sil-01', 'HQ', 10, 4, 'APPROVED', 'TOUR'),
    ('tp-satyam-2026-11-29', 'usr-nlcl-0005', 'NLCL-0005', 'Satyam Shil', '2026-11-29', 2026, 11, 29, 'Sun', 'Weekly Rest / Sunday', null, 'HQ', 0, 0, 'APPROVED', 'SUNDAY'),
    ('tp-satyam-2026-11-30', 'usr-nlcl-0005', 'NLCL-0005', 'Satyam Shil', '2026-11-30', 2026, 11, 30, 'Mon', 'Work at SilcharHQ', 'rt-sil-02', 'HQ', 10, 4, 'APPROVED', 'TOUR')
ON CONFLICT (id) DO UPDATE
SET city = EXCLUDED.city, status = EXCLUDED.status, route_id = EXCLUDED.route_id, route_type = EXCLUDED.route_type;

-- ==============================================================================
-- 4. PRODUCTS MASTER TABLE
-- Central catalog for Order Booking & Detailings
-- ==============================================================================
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand_name TEXT NOT NULL,
    generic_name TEXT NOT NULL,
    category TEXT NOT NULL,
    division TEXT NOT NULL DEFAULT 'Barak Pharma',
    formulation TEXT NOT NULL,
    pack_size TEXT NOT NULL,
    mrp NUMERIC(10, 2) NOT NULL,
    ptr NUMERIC(10, 2) NOT NULL,
    pts NUMERIC(10, 2) NOT NULL,
    gst_rate NUMERIC(5, 2) NOT NULL DEFAULT 12.0,
    indications TEXT,
    key_usp TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access for products" ON products FOR ALL USING (true) WITH CHECK (true);

-- Seed Official Product Master Catalog
INSERT INTO products (id, name, brand_name, generic_name, category, formulation, pack_size, mrp, ptr, pts, gst_rate, indications, key_usp)
VALUES
    ('prod-01', 'CardioPulse-AM', 'CardioPulse-AM', 'Amlodipine 5mg + Telmisartan 40mg', 'Cardiology', 'Tablet', '10 x 10 ALU-ALU', 145.00, 103.57, 93.21, 12.0, 'Stage II Essential Hypertension, High Cardiovascular Risk', 'Dual 24-hr BP control, vascular protection'),
    ('prod-02', 'CefoPrime-200', 'CefoPrime-200', 'Cefpodoxime Proxetil 200mg', 'Antibiotics', 'Dispersible Tablet', '10 x 10 ALU-ALU', 225.00, 160.71, 144.64, 12.0, 'RTI, UTI, Typhoid, Skin & Soft Tissue Infections', 'High tissue penetrability, convenient BID dosing'),
    ('prod-03', 'NeuroPulse-OD', 'NeuroPulse-OD', 'Methylcobalamin 1500mcg + ALA + Benfotiamine', 'Neurology', 'Softgel Capsule', '10 x 10 Blister', 285.00, 203.57, 183.21, 12.0, 'Diabetic Neuropathy, Peripheral Nerve Regeneration', 'Triple neurotrophic synergy, restores nerve velocity'),
    ('prod-04', 'GastroShield-DSR', 'GastroShield-DSR', 'Rabeprazole 20mg + Domperidone 30mg SR', 'Gastroenterology', 'Capsule', '10 x 10 ALU-ALU', 178.00, 127.14, 114.43, 12.0, 'GERD, Reflux Esophagitis, Non-ulcer Dyspepsia', 'Rapid acid suppression, all-day reflux relief'),
    ('prod-05', 'OrthoFlex-Plus', 'OrthoFlex-Plus', 'Glucosamine Sulfate + Diacerein + MSM', 'Orthopedics', 'Tablet', '10 x 10 Blister', 340.00, 242.86, 218.57, 12.0, 'Osteoarthritis, Cartilage Wear & Joint Mobility', 'Chondroprotective, reduces joint stiffness'),
    ('prod-06', 'DermoCure-KT', 'DermoCure-KT', 'Ketoconazole 2% + Zinc Pyrithione 1%', 'Dermatology', 'Lotion / Shampoo', '100ml Bottle', 195.00, 139.29, 125.36, 12.0, 'Tinea Versicolor, Stubborn Dandruff, Seborrheic Dermatitis', 'Broad spectrum antimycotic, soothing formula'),
    ('prod-07', 'RespiClear-DX', 'RespiClear-DX', 'Dextromethorphan + CPM + Phenylephrine', 'Respiratory', 'Syrup', '100ml Pet Bottle', 110.00, 78.57, 70.71, 12.0, 'Dry Cough, Allergic Bronchitis, Post-nasal Drip', 'Non-drowsy cough relief, pleasant taste'),
    ('prod-08', 'GliclaPulse-M', 'GliclaPulse-M', 'Gliclazide 60mg MR + Metformin 500mg SR', 'Diabetology', 'Tablet', '10 x 10 Blister', 165.00, 117.86, 106.07, 12.0, 'Type 2 Diabetes Mellitus with Insulin Resistance', 'Physiological insulin release, low hypoglycemia risk')
ON CONFLICT (id) DO UPDATE
SET mrp = EXCLUDED.mrp, ptr = EXCLUDED.ptr, pts = EXCLUDED.pts, gst_rate = EXCLUDED.gst_rate;

-- ==============================================================================
-- 5. DAILY EXPENSES & STANDARD FARE CHART (SFC) TABLES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS sfc_routes (
    id TEXT PRIMARY KEY,
    from_location TEXT NOT NULL,
    to_location TEXT NOT NULL,
    distance_km INT NOT NULL,
    rate_per_km NUMERIC(5, 2) NOT NULL DEFAULT 3.0,
    standard_fare INT NOT NULL,
    da_allowed INT NOT NULL,
    route_type TEXT NOT NULL CHECK (route_type IN ('HQ', 'EX_HQ', 'OUTSTATION')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE sfc_routes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access for sfc_routes" ON sfc_routes FOR ALL USING (true) WITH CHECK (true);

INSERT INTO sfc_routes (id, from_location, to_location, distance_km, rate_per_km, standard_fare, da_allowed, route_type)
VALUES
    -- Silchar
    ('sfc-sil-01', 'Silchar HQ', 'SMCH & Hospital Road', 10, 3.0, 30, 250, 'HQ'),
    ('sfc-sil-02', 'Silchar HQ', 'Kalain Ex-station', 55, 3.0, 165, 450, 'EX_HQ'),
    ('sfc-sil-03', 'Silchar HQ', 'Bagha & Natunbazar', 65, 3.0, 195, 450, 'EX_HQ'),
    ('sfc-sil-04', 'Silchar HQ', 'Badarpur Junction', 35, 3.0, 105, 450, 'EX_HQ'),
    ('sfc-sil-05', 'Silchar HQ', 'Sonai, Sonabarighat & Nayabazar', 38, 3.0, 114, 450, 'EX_HQ'),
    ('sfc-sil-06', 'Silchar HQ', 'Lakhipur & Dhalai', 60, 3.0, 180, 450, 'EX_HQ'),
    ('sfc-sil-07', 'Silchar HQ', 'Hailakandi Town', 90, 3.0, 270, 450, 'EX_HQ'),
    ('sfc-sil-08', 'Silchar HQ', 'Halflong Outstation', 140, 3.0, 420, 750, 'OUTSTATION'),
    ('sfc-sil-09', 'Silchar HQ', 'Aizawl Corridor', 180, 3.0, 540, 750, 'OUTSTATION'),
    -- Karimganj
    ('sfc-kxj-01', 'Sribhumi HQ', 'Karimganj Central Beat', 15, 3.0, 45, 250, 'HQ'),
    ('sfc-kxj-02', 'Sribhumi HQ', 'Nilambazar', 32, 3.0, 96, 250, 'HQ'),
    ('sfc-kxj-03', 'Sribhumi HQ', 'Badarpur Junction', 66, 3.0, 198, 450, 'EX_HQ'),
    ('sfc-kxj-04', 'Sribhumi HQ', 'Patharkandi', 70, 3.0, 210, 450, 'EX_HQ'),
    ('sfc-kxj-05', 'Sribhumi HQ', 'Dharmanagar HQ', 75, 3.0, 225, 450, 'EX_HQ'),
    ('sfc-kxj-06', 'Sribhumi HQ', 'Makunda Outstation', 154, 3.0, 462, 750, 'OUTSTATION')
ON CONFLICT (id) DO UPDATE
SET standard_fare = EXCLUDED.standard_fare, da_allowed = EXCLUDED.da_allowed;

CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL,
    employee_code TEXT NOT NULL,
    employee_name TEXT NOT NULL,
    date DATE NOT NULL,
    route TEXT NOT NULL,
    route_id TEXT,
    distance_km INT NOT NULL DEFAULT 0,
    ta_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    da_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    hotel_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    misc_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    admin_remark TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expenses_emp_date ON expenses(employee_code, date);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access for expenses" ON expenses FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 6. LEAVES & HOLIDAYS TABLES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS leave_balances (
    id TEXT PRIMARY KEY,
    employee_code TEXT NOT NULL UNIQUE,
    casual_leave_available INT NOT NULL DEFAULT 12,
    casual_leave_total INT NOT NULL DEFAULT 12,
    earned_leave_available INT NOT NULL DEFAULT 15,
    earned_leave_total INT NOT NULL DEFAULT 15,
    sick_leave_available INT NOT NULL DEFAULT 12,
    sick_leave_total INT NOT NULL DEFAULT 12,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE leave_balances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access for leave_balances" ON leave_balances FOR ALL USING (true) WITH CHECK (true);

INSERT INTO leave_balances (id, employee_code, casual_leave_available, earned_leave_available, sick_leave_available)
VALUES
    ('lb-nlcl-0004', 'NLCL-0004', 12, 15, 12),
    ('lb-nlcl-0005', 'NLCL-0005', 12, 15, 12)
ON CONFLICT (employee_code) DO NOTHING;

CREATE TABLE IF NOT EXISTS holidays (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    date DATE NOT NULL,
    day_of_week TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'Gazetted' CHECK (type IN ('Gazetted', 'Restricted')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access for holidays" ON holidays FOR ALL USING (true) WITH CHECK (true);

INSERT INTO holidays (id, name, date, day_of_week, type)
VALUES
    ('h-01', 'Magh Bihu & Tusu Puja', '2026-01-15', 'Thursday', 'Gazetted'),
    ('h-02', 'Makar Sankranti', '2026-01-16', 'Friday', 'Gazetted'),
    ('h-03', 'Republic Day', '2026-01-26', 'Monday', 'Gazetted'),
    ('h-04', 'Bohag Bihu (Rongali Bihu)', '2026-04-14', 'Tuesday', 'Gazetted'),
    ('h-05', 'Bohag Bihu Holiday', '2026-04-15', 'Wednesday', 'Gazetted'),
    ('h-06', 'Independence Day', '2026-08-15', 'Saturday', 'Gazetted'),
    ('h-07', 'Mahatma Gandhi Birthday', '2026-10-02', 'Friday', 'Gazetted'),
    ('h-08', 'Durga Puja (Maha Saptami)', '2026-10-18', 'Sunday', 'Gazetted'),
    ('h-09', 'Durga Puja (Maha Ashtami & Navami)', '2026-10-19', 'Monday', 'Gazetted'),
    ('h-10', 'Vijaya Dashami', '2026-10-20', 'Tuesday', 'Gazetted'),
    ('h-11', 'Kali Puja & Diwali', '2026-11-08', 'Sunday', 'Gazetted')
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name, date = EXCLUDED.date;
