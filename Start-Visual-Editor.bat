@echo off
title Moody Designs Live Visual Editor
echo ======================================================
echo Starting Moody Designs Live Visual Editor...
echo ======================================================
echo.
echo Opening browser to http://localhost:3000/home.html ...
start http://localhost:3000/home.html
echo.
node editor-server.cjs
pause
