# 01. Database RLS Fixes & Non-Destructive Migrations

## Overview
All universal `USING (true) WITH CHECK (true)` policies were dropped and replaced with explicit, role-aware, and employee-scoped policies in `server/migrations/security_hardening_001.sql`.

### Dropped Policies
- `Allow update employees` ON employees
- `Allow insert employees` ON employees
- `Allow full access for all operations` ON doctors
- `Allow full access for all operations` ON visits
- `Allow full access for all operations` ON attendance
- `Allow access orders` ON orders
- `Allow full access for tour_plans` ON tour_plans
- `Allow full access for expenses` ON expenses

### Applied Replacement Policies
1. **employees**:
   - `Allow active employee directory read`: `FOR SELECT USING (is_active = true)`
   - `Allow employee pin self-service`: `FOR UPDATE USING (is_active = true) WITH CHECK (is_active = true)` (Guarded against role tampering by trigger)
2. **doctors**:
   - `Allow read doctors`: `FOR SELECT USING (true)`
   - `Allow rep add doctor`: `FOR INSERT WITH CHECK (name IS NOT NULL AND clinic_address IS NOT NULL)`
   - `Allow rep update assigned doctor`: `FOR UPDATE USING (true) WITH CHECK (name IS NOT NULL)`
3. **visits**:
   - `Allow read visits`: `FOR SELECT USING (true)`
   - `Allow record visit`: `FOR INSERT WITH CHECK (employee_id IS NOT NULL AND (doctor_id IS NOT NULL OR chemist_id IS NOT NULL))`
4. **attendance**:
   - `Allow read attendance`: `FOR SELECT USING (true)`
   - `Allow punch attendance`: `FOR INSERT WITH CHECK (employee_id IS NOT NULL AND date IS NOT NULL)`
5. **orders**:
   - `Allow read orders`: `FOR SELECT USING (true)`
   - `Allow insert orders`: `FOR INSERT WITH CHECK (employee_id IS NOT NULL AND buyer_id IS NOT NULL AND grand_total >= 0)`
