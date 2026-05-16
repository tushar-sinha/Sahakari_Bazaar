@echo off
title Sahakari Bazaar - Cooperative Grocery Platform
color 0A

echo.
echo ========================================================
echo   SAHAKARI BAZAAR - Cooperative Grocery Platform
echo ========================================================
echo.

:: Move to script directory
cd /d "%~dp0"

:: ------------------------------------------------
:: STEP 0 - Check Node.js
:: ------------------------------------------------
echo [CHECK] Looking for Node.js...

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo Node.js is not installed.
    echo.

    if exist "%~dp0node-v24.14.0-x64.msi" (
        echo Installing Node.js...
        start "" msiexec /i "%~dp0node-v24.14.0-x64.msi"
        echo.
        echo After installation CLOSE this window and run again.
        pause
        exit /b
    ) else (
        echo Node installer not found.
        echo Download from https://nodejs.org
        pause
        exit /b
    )
)

echo Node found:
node -v
call npm -v
echo.

:: ------------------------------------------------
:: STEP 1 - Install / verify dependencies
:: ------------------------------------------------
if not exist node_modules (
    echo [STEP 1/7] Installing dependencies...
    call npm.cmd install
    if %errorlevel% neq 0 (
        echo.
        echo ERROR: npm install failed. Check your internet connection.
        pause
        exit /b
    )
) else (
    echo [STEP 1/7] Dependencies already installed
)

echo.

:: ------------------------------------------------
:: STEP 2 - Free port 3000
:: ------------------------------------------------
echo [STEP 2/7] Freeing port 3000...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING 2^>nul') do (
    taskkill /PID %%a /F >nul 2>&1
)

timeout /t 1 >nul
echo.

:: ------------------------------------------------
:: STEP 3 - Clear Turbopack / Next.js build cache
::   Prevents "junction point not empty" crashes on
::   Windows when a previous run was killed mid-flight.
:: ------------------------------------------------
echo [STEP 3/7] Clearing build cache...

if exist ".next" (
    rmdir /s /q ".next" 2>nul
    if exist ".next" (
        echo   WARNING: Could not fully clear .next cache. Try running as Administrator.
    ) else (
        echo   Cache cleared.
    )
) else (
    echo   Cache already clean.
)

echo.

:: ------------------------------------------------
:: STEP 4 - Generate Prisma client
:: ------------------------------------------------
echo [STEP 4/7] Generating database client...
call npx prisma generate

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Prisma generate failed.
    pause
    exit /b
)

echo.

:: ------------------------------------------------
:: STEP 5 - Sync database schema
:: ------------------------------------------------
echo [STEP 5/7] Syncing database schema...
call npx prisma db push

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Database sync failed.
    pause
    exit /b
)

echo.

:: ------------------------------------------------
:: STEP 6 - Seed database (first run only)
::   Uses a .seeded marker file so demo data is only
::   loaded once and not overwritten on every restart.
:: ------------------------------------------------
if not exist "prisma\.seeded" (
    echo [STEP 6/7] Loading demo data into database...
    call npx tsx prisma/seed.ts
    if %errorlevel% neq 0 (
        echo   WARNING: Seeding failed. App will still start but may show empty data.
    ) else (
        echo. > "prisma\.seeded"
        echo   Demo data loaded.
    )
) else (
    echo [STEP 6/7] Database already seeded, skipping.
)

echo.

:: ------------------------------------------------
:: STEP 7 - Start dev server
:: ------------------------------------------------
echo [STEP 7/7] Starting server...
echo.
echo   App will open at http://localhost:3000
echo   Press Ctrl+C to stop.
echo.

start "" cmd /c "timeout /t 10 >nul & start "" http://localhost:3000"

call npm run dev

echo.
echo Server stopped.
echo.
pause