-- ==============================================================================
-- RepPulse Pharma SFA — Complete Master Schema
-- Designed for 100% Single Source of Truth Alignment with Supabase PostgreSQL
-- Covers: Silchar (Cachar), Hailakandi, Karimganj, Aizawl, Tripura (Agartala, Dharmanagar)
-- ==============================================================================

-- 1. ORDERS TABLE (POB Booking with Real Firms & PTS/PTR Pricing)
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

-- 2. TOUR PLAN RESCHEDULE REQUESTS
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

-- 3. PRODUCTS TABLE (Official 14 Formulations)
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    brand_name TEXT NOT NULL,
    generic_name TEXT NOT NULL,
    category TEXT NOT NULL,
    pack_size TEXT NOT NULL,
    form TEXT NOT NULL,
    mrp NUMERIC NOT NULL,
    ptr NUMERIC NOT NULL,
    pts NUMERIC NOT NULL,
    gst_rate NUMERIC NOT NULL DEFAULT 5,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ENABLE RLS & GRANTS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_plan_reschedule_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Allow full access orders') THEN
        CREATE POLICY "Allow full access orders" ON orders FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tour_plan_reschedule_requests' AND policyname = 'Allow full access tour_plan_reschedule_requests') THEN
        CREATE POLICY "Allow full access tour_plan_reschedule_requests" ON tour_plan_reschedule_requests FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Allow full access products') THEN
        CREATE POLICY "Allow full access products" ON products FOR ALL USING (true) WITH CHECK (true);
    END IF;
END
$$;
