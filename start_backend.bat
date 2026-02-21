@echo off
echo Starting ENEMSIM Backend...
cd /d "%~dp0"
cd backend

IF EXIST node_modules (
    echo Node modules found.
) ELSE (
    echo Installing dependencies...
    call npm install
)

echo.
echo ==========================================
echo    Backend running on PORT 3002
echo ==========================================
echo.

node index.js
pause
