@echo off
chcp 65001 >nul
title Đang tải mã nguồn lên GitHub...
color 0b

echo ========================================================
echo   BẮT ĐẦU ĐẨY TOÀN BỘ DỰ ÁN LÊN GITHUB REPOSITORY
echo   Repo: https://github.com/HeroHehehe/Hskchotoi.git
echo ========================================================
echo.

set "GIT_EXE=C:\Program Files\Git\cmd\git.exe"

if not exist "%GIT_EXE%" (
    echo [LOI] Khong tim thay Git tai C:\Program Files\Git\cmd\git.exe
    pause
    exit /b
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
