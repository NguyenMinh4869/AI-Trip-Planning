@echo off
echo ========================================
echo    AI Trip Planning Database Setup
echo ========================================
echo.

echo Checking PostgreSQL installation...
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: PostgreSQL is not installed or not in PATH
    echo Please install PostgreSQL first and add it to PATH
    echo Download from: https://www.postgresql.org/download/windows/
    pause
    exit /b 1
)

echo PostgreSQL found!
echo.

echo Please enter your PostgreSQL password for user 'postgres':
set /p POSTGRES_PASSWORD=

echo.
echo Creating database 'ai_trip_planning'...
psql -U postgres -c "CREATE DATABASE ai_trip_planning;" 2>nul
if %errorlevel% neq 0 (
    echo Database might already exist, continuing...
)

echo.
echo Creating database schema...
psql -U postgres -d ai_trip_planning -f database_schema.sql
if %errorlevel% neq 0 (
    echo ERROR: Failed to create database schema
    pause
    exit /b 1
)

echo.
echo ========================================
echo    Database setup completed!
echo ========================================
echo.
echo Database: ai_trip_planning
echo Host: localhost
echo Port: 5432
echo User: postgres
echo.
echo You can now connect to the database using:
echo psql -U postgres -d ai_trip_planning
echo.
pause
