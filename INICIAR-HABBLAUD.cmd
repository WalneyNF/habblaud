@echo off
setlocal
cd /d "%~dp0"
title Habblaud AI Community
echo Abrindo Habblaud AI Community...
echo Laboratorio: http://127.0.0.1:4747/ia-lab
echo Pressione Ctrl+C para encerrar.
call npm run start:ai
if errorlevel 1 (
 echo.
 echo Falha ao iniciar. Execute INSTALAR-WINDOWS.cmd.
 pause
)
