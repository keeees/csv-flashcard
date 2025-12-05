# Building Windows Executable

This guide explains how to build a standalone Windows executable (.exe) for the Flashcard App.

## Prerequisites

1. **Python 3.8 or higher** installed on Windows
   - Download from: https://www.python.org/downloads/
   - Make sure to check "Add Python to PATH" during installation

2. **Git** (optional, if cloning from repository)

## Quick Build (Recommended)

### Option 1: Using Batch File
1. Open the project folder
2. Double-click `build_windows.bat`
3. Wait for the build to complete
4. Find the executable in `dist\FlashcardApp.exe`

### Option 2: Using PowerShell
1. Right-click `build_windows.ps1`
2. Select "Run with PowerShell"
3. If you get an execution policy error, run PowerShell as Administrator and execute:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
4. Try again
5. Find the executable in `dist\FlashcardApp.exe`

## Manual Build

If you prefer to build manually or the automated scripts don't work:

### Step 1: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Run Build Script
```bash
python build_exe.py
```

### Step 3: Find Your Executable
The executable will be created in the `dist` folder:
```
dist/FlashcardApp.exe
```

## What Gets Built

The build process creates a single executable file that includes:
- The Flask web application
- All HTML templates
- CSS and JavaScript files
- Python dependencies
- Sample CSV files from the `data` folder

## Running the Executable

1. Navigate to the `dist` folder
2. Double-click `FlashcardApp.exe`
3. The application will:
   - Start a local web server
   - Automatically open your default browser
   - Display the flashcard application

## Distributing the Executable

You can share the `FlashcardApp.exe` file with others. They can:
- Run it without installing Python
- Use it on any Windows computer
- Add their own CSV files to the `data` folder (if you include it)

### Creating a Distribution Package

To create a complete package for distribution:

1. Create a new folder (e.g., `FlashcardApp_Windows`)
2. Copy `dist\FlashcardApp.exe` to this folder
3. Create a `data` subfolder
4. Add sample CSV files to the `data` folder
5. Optionally add a README.txt with instructions
6. Zip the folder for easy sharing

## Troubleshooting

### Build Fails with "PyInstaller not found"
```bash
pip install pyinstaller
```

### Executable doesn't start
- Check Windows Defender or antivirus (may flag the exe as suspicious)
- Try running as Administrator
- Check if port 5000 is already in use

### Browser doesn't open automatically
- Manually open your browser and go to: http://127.0.0.1:5000

### "Module not found" errors
Make sure all dependencies are installed:
```bash
pip install -r requirements.txt --upgrade
```

### Large file size
The executable includes Python and all dependencies. This is normal for PyInstaller builds (typically 20-50 MB).

## Build Configuration

The build is configured in `build_exe.py`. Key settings:

- `--onefile`: Creates a single executable file
- `--windowed`: No console window (GUI mode)
- `--add-data`: Includes templates, static files, and data
- `--hidden-import`: Ensures Flask and dependencies are included

## Advanced Options

### Adding an Icon
1. Create or download a `.ico` file
2. Edit `build_exe.py` and add:
   ```python
   '--icon=path/to/your/icon.ico',
   ```

### Changing the App Name
Edit `build_exe.py` and change:
```python
'--name=FlashcardApp',
```

### Debug Mode
To see console output for debugging, remove `--windowed` from `build_exe.py`:
```python
# '--windowed',  # Comment this out
```

## Platform Notes

This build process is specifically for Windows. For other platforms:
- **macOS**: Use `create_dmg.sh` (already included)
- **Linux**: PyInstaller can create Linux executables with similar commands

## File Structure After Build

```
project/
├── dist/
│   └── FlashcardApp.exe          # Your executable
├── build/                         # Temporary build files (can be deleted)
├── FlashcardApp.spec             # PyInstaller spec file (auto-generated)
└── ...
```

## Clean Build

To start fresh:
```bash
# Delete build artifacts
rmdir /s /q build dist
del FlashcardApp.spec

# Rebuild
python build_exe.py
```

## Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Ensure all prerequisites are installed
3. Try a clean build
4. Check the PyInstaller documentation: https://pyinstaller.org/
