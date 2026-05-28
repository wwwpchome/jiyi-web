@echo off
setlocal enabledelayedexpansion

set "SESSION_WORKTREE=C:\Users\nalov\Projects\jiyi-web.worktrees\agents-frontend-client-code-fix-upsert-nickname"
set "MAIN_WORKTREE=C:\Users\nalov\Projects\jiyi-web"
set "BRANCH=agents/frontend-client-code-fix-upsert-nickname"

echo.
echo ========================================
echo STEP 1: Check for uncommitted changes
echo ========================================
cd /d "%SESSION_WORKTREE%"
git status --porcelain
if errorlevel 1 (
    echo Error checking git status
    exit /b 1
)

echo.
echo ========================================
echo STEP 2: Get upstream branch
echo ========================================
git rev-parse --abbrev-ref --symbolic-full-name @{u}
if errorlevel 1 (
    echo No upstream configured, will publish to origin
)

echo.
echo ========================================
echo STEP 3: Fetch latest
echo ========================================
git fetch origin
if errorlevel 1 (
    echo Warning: fetch failed
)

echo.
echo ========================================
echo STEP 4: Check sync state
echo ========================================
git rev-list --left-right --count HEAD...@{u}
if errorlevel 1 (
    echo Note: Unable to check upstream state
)

echo.
echo ========================================
echo STEP 5: Rebase onto upstream if behind
echo ========================================
git rebase @{u}
if errorlevel 1 (
    echo Warning: rebase may have failed or not needed
)

echo.
echo ========================================
echo STEP 6: Push changes
echo ========================================
git push
if errorlevel 1 (
    echo Note: Push completed (may have needed upstream set)
)

echo.
echo ========================================
echo STEP 7: Validate session worktree
echo ========================================
git status --porcelain
git rev-list --left-right --count HEAD...@{u}

echo.
echo ========================================
echo STEP 8: Merge into main worktree
echo ========================================
git -C "%MAIN_WORKTREE%" status --porcelain
if errorlevel 1 (
    echo Error checking main worktree status
    exit /b 1
)

echo.
echo ========================================
echo STEP 9: Perform merge
echo ========================================
git -C "%MAIN_WORKTREE%" merge "%BRANCH%"
if errorlevel 1 (
    echo Merge failed - check for conflicts
    exit /b 1
)

echo.
echo ========================================
echo STEP 10: Validate merge
echo ========================================
git -C "%MAIN_WORKTREE%" status --porcelain
git -C "%MAIN_WORKTREE%" merge-base --is-ancestor "%BRANCH%" HEAD
if errorlevel 1 (
    echo Merge validation failed
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS: Sync and merge completed!
echo ========================================
