@echo off
REM PaisaAds - Start Both Frontend and Backend (Windows)

echo.
echo ======================================
echo PaisaAds - Starting Full Stack
echo ======================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo XXXX Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo OK Node.js version: 
node --version

echo OK NPM version:
npm --version
echo.

echo Starting Backend on Port 3002...
echo Location: backend\
start "PaisaAds Backend" cmd /k "cd backend && npm run dev"

echo Waiting 3 seconds...
timeout /t 3 /nobreak

echo Starting Frontend on Port 3000...
echo Location: frontend\
start "PaisaAds Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ======================================
echo OK Both servers are starting!
echo ======================================
echo.
echo Services:
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:3002
echo.
echo Windows: Two new command windows have been opened
echo Close each window to stop that service
echo.
pause
