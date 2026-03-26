@echo off
title Frappe Permission Auditor - Proxy
echo =========================================
echo      Frappe Permission Auditor Proxy
echo =========================================
echo.
echo Iniciando el archivo en tu navegador...
start "" "%~dp0index.html"

echo.
echo Levantando servidor proxy en el puerto 8080...
echo [!] ATENCION: No cierres esta ventana negra mientras uses
echo la aplicacion, o la opcion "Use CORS Proxy" dejara de funcionar.
echo.
echo Para salir, presiona Ctrl+C o cierra esta ventana.
node "%~dp0proxy.js"
pause
