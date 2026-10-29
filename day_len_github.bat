@echo off
chcp 65001 >nul
title Dang tai ma nguon len GitHub...
color 0b

echo ========================================================
echo   BAT DAU DAY TOAN BO DU AN LEN GITHUB REPOSITORY
echo   Repo: https://github.com/HeroHehehe/Hskchotoi.git
echo ========================================================
echo.

set "GIT_EXE=git"
where git >nul 2>&1
if %errorlevel% neq 0 (
    if exist "C:\Program Files\Git\cmd\git.exe" (
        set "GIT_EXE=C:\Program Files\Git\cmd\git.exe"
    ) else if exist "C:\Users\Admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe" (
        set "GIT_EXE=C:\Users\Admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe"
    ) else (
        echo [LOI] Khong tim thay Git tren may tinh!
        pause
        exit /b
    )
)

echo [1/3] Kiem tra trang thai commit...
"%GIT_EXE%" status

echo.
echo [2/3] Dang day len nhanh 'main' cua GitHub...
echo (Luu y: Trinh duyet se mo ra de ban bam 'Sign in with your browser' neu day la lan dau day)
echo.

"%GIT_EXE%" push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo ========================================================
    echo   CO THE CO XUNG DOT HOAC CHUA DANG NHAP GITHUB.
    echo   Thu day cuong buc (force) de dong bo hoan toan:
    echo ========================================================
    "%GIT_EXE%" push -u origin main --force
)

echo.
echo ========================================================
echo   DA HOAN TAT!
echo   Hay quay lai GitHub vao: Settings -^> Pages de bat web nhe!
echo ========================================================
echo.
pause
