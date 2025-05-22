@echo off
REM This script starts both the backend and frontend servers for your Todo Summary Assistant.

echo Starting Backend Server...
REM Navigate to the backend directory and start the Node.js server
start cmd /k "cd backend && node index.js"
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to launch backend. Check your backend directory.
    pause
    exit /b %errorlevel%
)

timeout /t 5 >nul
echo Starting Frontend Server...
REM Navigate to the frontend directory and start the React app
start cmd /k "cd frontend && npm start"
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to launch frontend. Check your frontend directory.
    pause
    exit /b %errorlevel%
)

echo.
echo Both servers are attempting to start. Check the new terminal windows for output.
echo If no new windows appeared, an error occurred in this script.
echo Press any key to close this window.
pause
exit