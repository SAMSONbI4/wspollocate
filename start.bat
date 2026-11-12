@echo off
setlocal
title Szukam wspollokatora - local server
cd /d "%~dp0"

py -3 --version >nul 2>&1
if not errorlevel 1 (
    py -3 "%~dp0scripts\serve.py"
    goto finished
)

python --version >nul 2>&1
if not errorlevel 1 (
    python "%~dp0scripts\serve.py"
    goto finished
)

echo Python 3 is required. Install it and run this file again.
pause
exit /b 1

:finished
if errorlevel 1 (
    echo Server could not start. See the error above.
    pause
    exit /b 1
)
endlocal
