@echo off
title Android Market - Local Runner
echo ========================================
echo   Starting Android Market Locally...
echo ========================================

echo.
echo [1/3] Starting Django Backend (Port 8000)...
start "Django Backend" cmd /k "cd backend && venv\Scripts\activate && python manage.py runserver"

echo.
echo [2/3] Starting Admin Dashboard (Port 5173)...
start "Admin Dashboard" cmd /k "cd admin && npm run dev"

echo.
echo [3/3] Starting Mobile App (Expo)...
start "Mobile App" cmd /k "cd mobile && npx expo start"

echo.
echo ========================================
echo  All services have been launched in
echo  separate terminal windows!
echo ========================================
pause
