@echo off
setlocal
cd /d "%~dp0"
title Habblaud AI Community - Diagnostico
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\instalar-windows.ps1" -CheckOnly -NonInteractive
echo.
pause
