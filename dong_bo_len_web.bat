@echo off
chcp 65001 >nul
title Dong bo cap nhat len GitHub...
color 0a

echo ========================================================
echo   TU DONG DONG BO CAP NHAT LEN GITHUB (UPDATE WEB)
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

echo [1/3] Quet cac thay doi moi nhat...
"%GIT_EXE%" add .

echo.
echo [2/3] Tao ban cap nhat (Commit)...
set datetime=%date% %time%
"%GIT_EXE%" commit -m "Cap nhat code moi luc: %datetime%"

echo.
echo [3/3] Day thang len GitHub...
"%GIT_EXE%" push origin main

if %errorlevel% neq 0 (
    echo.
    echo ========================================================
    echo   CO THE TRINH DUYET DANG CHO BAN XAC THUC GITHUB.
    echo   Neu trinh duyet mo ra, vui long bam 'Sign in with your browser'
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo   [HOAN TAT] Da day cap nhat len GitHub thanh cong!
    echo   Web tren mang se tu dong cap nhat sau 30-60 giay.
    echo ========================================================
)

echo.
pause
