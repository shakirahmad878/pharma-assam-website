@echo off
TITLE ApexHRMS - Standalone HRMS & Payroll Portal Launcher
COLOR 0B

echo =======================================================================
echo          APEX HRMS - CENTRALIZED WORKFORCE & PAYROLL PORTAL
echo =======================================================================
echo.
echo [1/2] Starting ApexHRMS Standalone Vite Server on Port 5175...
start "ApexHRMS Standalone Portal" cmd /k "npm run dev"

echo.
echo [2/2] Opening ApexHRMS in your default browser...
timeout /t 3 /nobreak >nul
start http://localhost:5175

echo.
echo =======================================================================
echo  ApexHRMS is now running separately from APK and website!
echo  - Standalone Web Portal: http://localhost:5175
echo =======================================================================
pause
