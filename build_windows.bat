@echo off
echo ========================================
echo Building Flashcard App for Windows
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

echo Installing/Updating dependencies...
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

echo.
echo Building executable...
python build_exe.py

if errorlevel 1 (
    echo.
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build completed successfully!
echo ========================================
echo.
echo The executable can be found in the 'dist' folder:
echo   dist\FlashcardApp.exe
echo.
echo You can now run the application by double-clicking FlashcardApp.exe
echo.
pause
