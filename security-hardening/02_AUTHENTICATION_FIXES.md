# 02. Authentication & OTP Hardening

## Problem Statement
1. `AuthService.sendOtp` previously returned the generated OTP directly in the API response:
   ```typescript
   return { success: true, otp, message: ... };
   ```
2. `LoginScreen.tsx` displayed the OTP in an alert banner and auto-filled it into the input field.
3. If an unknown mobile number was used, `verifyOtp` automatically defaulted to `USER_PRANJAL_MR`, assigning full representative privileges to any arbitrary phone number.

## Remediation Implemented
1. **Roster Verification First**:
   In `mobile/src/services/authService.ts`: Before generating an OTP, the system verifies that the mobile number is registered in the company employee directory (`employees`). If unregistered, it rejects the request:
   ```typescript
   if (!isRegistered) {
     return { success: false, error: 'Unauthorized: Mobile number is not registered with RepPulse. Contact HR.' };
   }
   ```
2. **Zero Client Leakage**:
   The OTP is kept exclusively in service/server memory for 10 minutes. The client response contains ONLY:
   ```typescript
   return {
     success: true,
     message: `OTP has been dispatched to your registered number ending in ${cleanDigits.slice(-4)}.`,
   };
   ```
3. **No Insecure Identity Fallback**:
   If an employee record is not found during `verifyOtp`, the login fails with an explicit unauthorized error. No dummy user or Pranjal Malakar profile is assigned.
4. **Clean UI**:
   In `mobile/src/screens/auth/LoginScreen.tsx`: All hint banners and autofill logic have been removed. The user must receive and enter the 6-digit code legitimately.
