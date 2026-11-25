# 04. Server-Side Geofence Distance & Verification

## Problem Statement
The mobile application previously calculated `isGeofenceVerified` and `distance_meters` on the device and sent those values in the JSON payload to Supabase. An attacker or modified client could intercept the request and send:
```json
{
  "is_geofence_verified": true,
  "distance_meters": 5
}
```
allowing visits to be logged from home or outside the 100m clinic perimeter.

## Server-Side Fix Implemented
In `server/migrations/security_hardening_001.sql`:
1. **Haversine Function in SQL**:
   ```sql
   CREATE OR REPLACE FUNCTION fn_haversine_distance_meters(
       lat1 DOUBLE PRECISION, lon1 DOUBLE PRECISION,
       lat2 DOUBLE PRECISION, lon2 DOUBLE PRECISION
   ) RETURNS DOUBLE PRECISION ...
   ```
2. **Visit Geofence Guard Trigger**:
   ```sql
   CREATE TRIGGER trg_verify_visit_geofence
   BEFORE INSERT OR UPDATE ON visits
   FOR EACH ROW EXECUTE FUNCTION trg_fn_verify_visit_geofence();
   ```
   - Looks up the doctor's registered primary clinic coordinates `(latitude, longitude)`.
   - Loops through multi-clinic chambers registered under `clinics` JSONB.
   - Calculates the minimum true distance to any registered chamber.
   - Overrides `NEW.distance_meters` with the server-calculated distance.
   - Sets `NEW.is_geofence_verified` to `true` ONLY if `v_min_dist <= v_radius` (default 100m).
3. **Mobile Client Adaptation**:
   In `supabaseDbService.ts:recordVisit`, client-computed flags are omitted or passed as unverified placeholders; the PostgreSQL database unconditionally overrides them with verified numbers.
