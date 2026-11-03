@echo off
setlocal
cd /d "%~dp0"
title Habblaud AI Community - Instalador
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\instalar-windows.ps1"
if errorlevel 1 (
 echo.
 echo Instalacao interrompida. Leia a mensagem de erro acima.
)
echo.
pause
