# 09. Security Test Results

## Test Suite Executed

| Test ID | Test Scenario | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :---: |
| **TEST-01** | Client requests OTP for unregistered phone `9999999999` | Request rejected with "Unauthorized: Mobile number not registered" | Request rejected with 401/error; no OTP generated | ✅ PASS |
| **TEST-02** | Client inspects `sendOtp` response for registered phone | Response contains message only; zero OTP value exposed | `{ success: true, message: "..." }`; no OTP field | ✅ PASS |
| **TEST-03** | Rep attempts to spoof `is_geofence_verified: true` 500m away | Server trigger `trg_verify_visit_geofence` calculates true distance and overrides flag | Overwritten to `is_geofence_verified: false`, distance: 500m | ✅ PASS |
| **TEST-04** | Client sends order with `grand_total: 1` | Server trigger `trg_validate_order_totals` recalculates grand_total from `products` catalog | Recalculated and corrected to true product master total | ✅ PASS |
| **TEST-05** | User attempts `UPDATE employees SET role = 'SUPER_ADMIN'` | Trigger `trg_guard_employee_changes` blocks elevation | Old role preserved; escalation rejected | ✅ PASS |
| **TEST-06** | MR attempts to insert tour plan with `status: 'APPROVED'` | Trigger `trg_guard_tour_plan_status` guards status | Status forced to `'PENDING'` without manager endorsement | ✅ PASS |
| **TEST-07** | Baseline data preservation check across 10 core tables | All row counts must remain equal to or greater than baseline | 64 doctors, 5 employees, 8 visits, 36 attendance, 22 tour plans, 8 products preserved (0 deleted) | ✅ PASS |
| **TEST-08** | TypeScript compiler check across mobile code | Zero compilation errors | `npx tsc --noEmit` exited with code 0 | ✅ PASS |
