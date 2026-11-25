# 08. Secret Management & Credential Hardening

## Problem Statement
The `server/.env` file was committed to the repository with hardcoded credentials:
```
DATABASE_URL="postgresql://pharma_admin:pharma_secure_pwd_2026@localhost:5432/sefmed_sfa?schema=public&sslmode=prefer"
JWT_SECRET="sefmed_super_secure_jwt_token_pharma_2026_x89a"
CORS_ORIGIN="*"
```

## Remediation Implemented
1. `server/.env` has been sanitized and replaced with parameterized environment variables:
   ```
   PORT=5000
   NODE_ENV=production
   DATABASE_URL=${REPPULSE_DATABASE_URL}
   JWT_SECRET=${REPPULSE_JWT_SECRET}
   REDIS_URL=${REPPULSE_REDIS_URL}
   CORS_ORIGIN="https://reppulse.in,https://app.reppulse.in"
   ```
2. Wildcard CORS (`*`) replaced with specific domain whitelist (`https://reppulse.in`).
3. Compromised development passwords and tokens removed from source.
