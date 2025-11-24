@echo off
title Shambala Frontend Deploy Script

echo ====================================
echo   SHAMBALA FRONTEND DEPLOY SCRIPT
echo ====================================
echo.

REM Check if we're in a git repository
if not exist ".git" (
    echo ERROR: Not a git repository!
    echo Please run this script from the project root.
    pause
    exit /b 1
)

REM Check git status
echo Checking git status...
git status --porcelain > nul
if errorlevel 1 (
    echo ERROR: Git command failed!
    pause
    exit /b 1
)

REM Show current status
echo.
echo Current git status:
git status --short
echo.

REM Ask for commit message
set /p commit_msg="Enter commit message: "

if "%commit_msg%"=="" (
    echo ERROR: Commit message cannot be empty!
    pause
    exit /b 1
)

echo.
echo Building project...
call npm run build

if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo Build successful! 
echo.

REM Add all changes
echo Adding files to git...
git add .

REM Commit with message
echo Committing changes...
git commit -m "%commit_msg%"

if errorlevel 1 (
    echo ERROR: Commit failed!
    pause
    exit /b 1
)

REM Push to repository
echo.
echo Pushing to GitHub...
git push origin main

if errorlevel 1 (
    echo ERROR: Push failed! Trying 'master' branch...
    git push origin master
    if errorlevel 1 (
        echo ERROR: Push to both 'main' and 'master' failed!
        echo Please check your remote repository settings.
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo   DEPLOYMENT COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Your site should be available at:
echo https://shivduttkarwa.github.io/shambala_latest/
echo.
echo Note: GitHub Pages may take a few minutes to update.
echo.
pause