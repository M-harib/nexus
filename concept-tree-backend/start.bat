@echo off
REM Startup script for Windows

echo Starting Concept Dependency Tree Backend...
echo.

echo ================================================
echo Checking MongoDB connection...
mongosh --eval "db.version()" >nul 2>&1
if errorlevel 1 (
    echo WARNING: MongoDB is not running. Start MongoDB separately.
)
echo.

echo ================================================
echo Starting Flask backend on port 5000...
cd flask-backend
start "Flask Backend" python app.py
timeout /t 2
cd ..

echo.
echo ================================================
echo Starting Node.js server on port 3000...
cd node-server
start "Node.js Server" npm run dev
timeout /t 2
cd ..

echo.
echo ================================================
echo Concept Dependency Tree Backend Started
echo ================================================
echo.
echo Services:
echo   Flask (Python):    http://localhost:5000
echo   Node.js (Express): http://localhost:3000
echo   MongoDB:           mongodb://localhost:27017
echo.
echo All services are running in separate windows.
echo Close each window to stop the respective service.
echo.
pause
