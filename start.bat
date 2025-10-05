@echo off
echo Starting Smart Health Dashboard...
echo.

REM Stop any existing Node.js processes
echo Stopping existing Node.js processes...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Start Backend Server
echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0backend && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start Frontend Server
echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo Both servers are starting up!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause >nul
