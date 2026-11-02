-- ==============================================================================
-- RepPulse Pharma SFA — Production GPS Telemetry & Manager Location Requests
-- Schema Migration: location_telemetry & location_requests
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/ibcyqtnpzdttwuhyhlra/sql
-- ==============================================================================

-- 1. LOCATION TELEMETRY TABLE (Append-only 15-min Breadcrumb History)
CREATE TABLE IF NOT EXISTS location_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id TEXT NOT NULL,
    user_id TEXT,
    tracking_session_id TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    accuracy_meters DOUBLE PRECISION NOT NULL DEFAULT 0,
    altitude_meters DOUBLE PRECISION,
    speed_mps DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    battery_percentage INTEGER,
    provider TEXT DEFAULT 'fused',
    source TEXT NOT NULL DEFAULT 'SCHEDULED' CHECK (source IN ('SCHEDULED', 'MANAGER_REQUEST', 'MANUAL')),
    recorded_at TIMESTAMPTZ NOT NULL,
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_status TEXT NOT NULL DEFAULT 'SYNCED'
);

-- High-performance indexes for historical lookup and session tracking
CREATE INDEX IF NOT EXISTS idx_loc_tel_emp_rec ON location_telemetry(employee_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_loc_tel_session ON location_telemetry(tracking_session_id);
CREATE INDEX IF NOT EXISTS idx_loc_tel_received ON location_telemetry(received_at DESC);

-- Enable RLS and idempotent policies
ALTER TABLE location_telemetry ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow full access location_telemetry" ON location_telemetry;
CREATE POLICY "Allow full access location_telemetry" ON location_telemetry FOR ALL USING (true) WITH CHECK (true);

-- 2. LOCATION REQUESTS TABLE (On-Demand Manager Live Ping)
CREATE TABLE IF NOT EXISTS location_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id TEXT NOT NULL,
    requested_by TEXT NOT NULL,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'DELIVERED', 'PROCESSING', 'COMPLETED', 'FAILED', 'EXPIRED')),
    response_location_id UUID REFERENCES location_telemetry(id) ON DELETE SET NULL,
    responded_at TIMESTAMPTZ,
    error_message TEXT,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '5 minutes')
);

CREATE INDEX IF NOT EXISTS idx_loc_req_emp_status ON location_requests(employee_id, status);
CREATE INDEX IF NOT EXISTS idx_loc_req_created ON location_requests(requested_at DESC);

-- Enable RLS and idempotent policies
ALTER TABLE location_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow full access location_requests" ON location_requests;
CREATE POLICY "Allow full access location_requests" ON location_requests FOR ALL USING (true) WITH CHECK (true);

-- 3. ENABLE SUPABASE REALTIME REPLICATION (Safe idempotent addition)
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE location_requests;
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE location_telemetry;
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
END
$$;
