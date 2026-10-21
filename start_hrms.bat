@echo off
TITLE Pappu Da Company HRMS - Live Connected Portal Launcher
COLOR 0B

echo =======================================================================
echo          PAPPU DA COMPANY - ENTERPRISE HRMS & PAYROLL PORTAL
echo =======================================================================
echo.
echo  [1/2] Connecting to Supabase Cloud PostgreSQL:
echo        Database: https://ibcyqtnpzdttwuhyhlra.supabase.co
echo        Tables:   employees, attendance, doctors, firms
echo.
echo  [2/2] Launching HRMS Standalone Portal on Port 5175...
start "Pappu Da HRMS Portal" cmd /k "cd hrms-portal && npm run dev"

timeout /t 3 /nobreak >nul
start http://localhost:5175

echo.
echo =======================================================================
echo  Pappu Da HRMS is now live and connected!
echo  - Web Portal:   http://localhost:5175
echo  - Cloud DB:     Supabase Live Sync (Employees & Attendance)
echo =======================================================================
pause
