@echo off
title AMT Exam App Server
cd /d "%~dp0"
echo ========================================================
echo   Ethiopian AMT Exam Master Local Server
echo ========================================================
echo Starting server on http://localhost:3000 ...
start http://localhost:3000
node server.js
pause
