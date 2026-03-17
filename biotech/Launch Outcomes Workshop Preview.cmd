@echo off
setlocal

cd /d "%~dp0outcomes-workshop-react"

where npm >nul 2>nul
if errorlevel 1 (
  echo npm was not found on this machine.
  echo Install Node.js and npm first, then run this launcher again.
  pause
  exit /b 1
)

echo Building production preview...
call npm run build
if errorlevel 1 (
  echo.
  echo Build failed. Review the errors above.
  pause
  exit /b 1
)

echo.
echo Opening production preview at http://localhost:4173/
start "" http://localhost:4173/

echo.
echo Press Ctrl+C in this window to stop the preview server.
call npm run preview