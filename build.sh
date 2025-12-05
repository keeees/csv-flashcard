#!/bin/bash
# Cross-platform build script for Flashcard App

echo "========================================"
echo "Building Flashcard App"
echo "========================================"
echo ""

# Detect platform
if [[ "$OSTYPE" == "darwin"* ]]; then
    PLATFORM="macOS"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    PLATFORM="Linux"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    PLATFORM="Windows (Git Bash)"
else
    PLATFORM="Unknown"
fi

echo "Detected platform: $PLATFORM"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "ERROR: Python is not installed or not in PATH"
    echo "Please install Python from https://www.python.org/"
    exit 1
fi

# Use python3 if available, otherwise python
if command -v python3 &> /dev/null; then
    PYTHON=python3
else
    PYTHON=python
fi

echo "Using: $($PYTHON --version)"
echo ""

# Install/update dependencies
echo "Installing/Updating dependencies..."
$PYTHON -m pip install --upgrade pip
$PYTHON -m pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Failed to install dependencies!"
    exit 1
fi

echo ""
echo "Building executable..."
$PYTHON build_exe.py

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Build failed!"
    exit 1
fi

echo ""
echo "========================================"
echo "Build completed successfully!"
echo "========================================"
echo ""
echo "The executable can be found in the 'dist' folder"
echo ""

# Platform-specific instructions
if [[ "$PLATFORM" == "macOS" ]]; then
    echo "macOS: dist/FlashcardApp"
    echo ""
    echo "To create a DMG, run: ./create_dmg.sh"
elif [[ "$PLATFORM" == "Linux" ]]; then
    echo "Linux: dist/FlashcardApp"
    echo ""
    echo "Make it executable: chmod +x dist/FlashcardApp"
elif [[ "$PLATFORM" == "Windows (Git Bash)" ]]; then
    echo "Windows: dist/FlashcardApp.exe"
    echo ""
    echo "Note: For native Windows build, use build_windows.bat"
fi

echo ""
