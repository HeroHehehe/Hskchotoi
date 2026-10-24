@echo off
chcp 65001 >nul
title Đang đồng bộ cập nhật lên GitHub...
color 0a

echo ========================================================
echo   TỰ ĐỘNG ĐỒNG BỘ CẬP NHẬT LÊN GITHUB (UPDATE WEB)
echo ========================================================
echo.

set "GIT_EXE=C:\Program Files\Git\cmd\git.exe"

if not exist "%GIT_EXE%" (
    echo [LOI] Khong tim thay Git tai C:\Program Files\Git\cmd\git.exe
    pause
    exit /b
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

echo.
echo ========================================================
echo   [HOAN TAT] Da day cap nhat len GitHub thanh cong!
echo   Web tren mang se tu dong cap nhat sau 30-60 giay.
echo ========================================================
echo.
pause
