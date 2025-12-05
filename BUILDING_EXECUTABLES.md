# Building Executables - Complete Guide

This document provides comprehensive instructions for building standalone executables of the Flashcard App for different platforms.

## Table of Contents
- [Windows](#windows)
- [macOS](#macos)
- [Linux](#linux)
- [Cross-Platform](#cross-platform)
- [Troubleshooting](#troubleshooting)

---

## Windows

### Quick Build (Recommended)

**Method 1: Batch File**
```cmd
# Double-click this file:
build_windows.bat
```

**Method 2: PowerShell**
```powershell
# Right-click and select "Run with PowerShell":
build_windows.ps1
```

**Method 3: Command Line**
```cmd
python build_exe.py
```

### Output
- Location: `dist\FlashcardApp.exe`
- Size: ~20-50 MB
- Includes: Python runtime, Flask, all dependencies, templates, static files

### Distribution
The `.exe` file is standalone and can be shared with anyone. No Python installation required.

### Detailed Instructions
See [BUILD_WINDOWS.md](BUILD_WINDOWS.md) for comprehensive Windows build instructions.

---

## macOS

### Quick Build

```bash
./create_dmg.sh
```

Or manually:
```bash
python build_exe.py
```

### Output
- Location: `dist/FlashcardApp` or `dist/FlashcardApp.app`
- Size: ~30-60 MB

### Creating DMG (Disk Image)
The `create_dmg.sh` script creates a distributable `.dmg` file for easy installation.

### Distribution
Share the `.app` bundle or `.dmg` file. Users can drag it to Applications folder.

---

## Linux

### Quick Build

```bash
chmod +x build.sh
./build.sh
```

Or manually:
```bash
python3 build_exe.py
```

### Output
- Location: `dist/FlashcardApp`
- Size: ~25-55 MB

### Make Executable
```bash
chmod +x dist/FlashcardApp
```

### Distribution
Share the executable file. Users may need to mark it as executable.

---

## Cross-Platform

### Universal Build Script

For macOS/Linux:
```bash
./build.sh
```

For Windows:
```cmd
build_windows.bat
```

### Build Process

All platforms follow the same basic process:

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run Build Script**
   ```bash
   python build_exe.py
   ```

3. **Find Executable**
   - Windows: `dist/FlashcardApp.exe`
   - macOS: `dist/FlashcardApp.app`
   - Linux: `dist/FlashcardApp`

### What's Included

The executable bundles:
- ✅ Python runtime
- ✅ Flask web framework
- ✅ All Python dependencies
- ✅ HTML templates
- ✅ CSS stylesheets
- ✅ JavaScript files
- ✅ Sample CSV files
- ✅ Utility modules

### How It Works

1. User double-clicks the executable
2. Flask server starts on `localhost:5000`
3. Default browser opens automatically
4. User interacts with the web interface
5. Server runs until application is closed

---

## Build Configuration

### Customizing the Build

Edit `build_exe.py` to customize:

```python
# Change app name
'--name=FlashcardApp',

# Add icon (Windows: .ico, macOS: .icns)
'--icon=path/to/icon.ico',

# Include additional files
f'--add-data=myfiles{separator}myfiles',

# Hide console window (GUI mode)
'--windowed',

# Create single file (vs folder)
'--onefile',
```

### Build Options

| Option | Description | Default |
|--------|-------------|---------|
| `--onefile` | Single executable file | ✅ Enabled |
| `--windowed` | No console window | ✅ Enabled |
| `--noconfirm` | Overwrite without asking | ✅ Enabled |
| `--icon` | Application icon | ❌ Not set |

### Adding Custom Data

To include additional files:

```python
# Windows
f'--add-data=source{separator}destination',

# The separator is automatically set:
# Windows: ';'
# macOS/Linux: ':'
```

---

## File Size Optimization

### Current Size
- Windows: ~20-50 MB
- macOS: ~30-60 MB
- Linux: ~25-55 MB

### Why So Large?
The executable includes:
- Python interpreter (~15-20 MB)
- Flask and dependencies (~10-15 MB)
- Your application code (~1-5 MB)

### Reducing Size

1. **Use `--onefile`** (already enabled)
   - Creates single file instead of folder

2. **Exclude unnecessary modules**
   ```python
   '--exclude-module=matplotlib',
   '--exclude-module=numpy',
   ```

3. **Use UPX compression** (optional)
   ```python
   '--upx-dir=/path/to/upx',
   ```

4. **Remove debug symbols**
   ```python
   '--strip',
   ```

---

## Troubleshooting

### Common Issues

#### 1. "Python not found"
**Solution:**
- Install Python from [python.org](https://www.python.org/)
- Ensure Python is added to PATH
- Restart terminal/command prompt

#### 2. "PyInstaller not found"
**Solution:**
```bash
pip install pyinstaller
```

#### 3. Build fails with import errors
**Solution:**
```bash
pip install -r requirements.txt --upgrade
```

#### 4. Executable won't start
**Possible causes:**
- Antivirus blocking (add exception)
- Port 5000 already in use
- Missing dependencies

**Debug:**
Remove `--windowed` from `build_exe.py` to see console output

#### 5. Browser doesn't open
**Solution:**
Manually navigate to: `http://127.0.0.1:5000`

#### 6. "Permission denied" (macOS/Linux)
**Solution:**
```bash
chmod +x dist/FlashcardApp
```

#### 7. Large file size
**Normal:** PyInstaller bundles Python runtime and all dependencies
**Typical:** 20-60 MB depending on platform

### Platform-Specific Issues

#### Windows
- **Antivirus warnings:** Normal for PyInstaller builds
- **SmartScreen warning:** Click "More info" → "Run anyway"
- **Port conflicts:** Close apps using port 5000

#### macOS
- **"App is damaged":** Right-click → Open (first time only)
- **Gatekeeper warning:** System Preferences → Security → Allow
- **Code signing:** For distribution, sign with Apple Developer ID

#### Linux
- **Missing libraries:** Install system dependencies
- **Display issues:** Ensure X11/Wayland is running
- **Permission errors:** Run with appropriate user permissions

---

## Testing the Build

### Before Distribution

1. **Test the executable**
   ```bash
   # Navigate to dist folder
   cd dist
   
   # Run the executable
   ./FlashcardApp  # macOS/Linux
   FlashcardApp.exe  # Windows
   ```

2. **Verify functionality**
   - ✅ Application starts
   - ✅ Browser opens automatically
   - ✅ Can select CSV files
   - ✅ Can upload new CSV files
   - ✅ Cards display correctly
   - ✅ Flip animation works
   - ✅ Navigation works
   - ✅ Keyboard shortcuts work

3. **Test on clean system**
   - Test on computer without Python installed
   - Verify no dependencies required

---

## Distribution

### Creating a Release Package

#### Windows
```
FlashcardApp_Windows/
├── FlashcardApp.exe
├── data/
│   └── sample.csv
└── README.txt
```

#### macOS
```
FlashcardApp_macOS/
├── FlashcardApp.app
├── data/
│   └── sample.csv
└── README.txt
```

#### Linux
```
FlashcardApp_Linux/
├── FlashcardApp
├── data/
│   └── sample.csv
└── README.txt
```

### Compression

**Windows:**
```cmd
# Create ZIP
tar -a -c -f FlashcardApp_Windows.zip FlashcardApp_Windows/
```

**macOS/Linux:**
```bash
# Create tar.gz
tar -czf FlashcardApp.tar.gz FlashcardApp/

# Or create ZIP
zip -r FlashcardApp.zip FlashcardApp/
```

---

## Advanced Topics

### Code Signing

#### Windows
```bash
signtool sign /f certificate.pfx /p password FlashcardApp.exe
```

#### macOS
```bash
codesign --deep --force --verify --verbose --sign "Developer ID" FlashcardApp.app
```

### Auto-Updates

Consider implementing auto-update functionality:
- Check for updates on startup
- Download new version
- Replace executable
- Restart application

### Installer Creation

#### Windows
- Use Inno Setup or NSIS
- Create professional installer
- Add to Start Menu
- Create desktop shortcut

#### macOS
- Create DMG with background image
- Add Applications folder shortcut
- Include license agreement

#### Linux
- Create .deb package (Debian/Ubuntu)
- Create .rpm package (Fedora/RHEL)
- Create AppImage (universal)

---

## Resources

### Documentation
- [PyInstaller Manual](https://pyinstaller.org/en/stable/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Python Packaging Guide](https://packaging.python.org/)

### Tools
- [PyInstaller](https://pyinstaller.org/) - Create executables
- [UPX](https://upx.github.io/) - Compress executables
- [Inno Setup](https://jrsoftware.org/isinfo.php) - Windows installer
- [create-dmg](https://github.com/create-dmg/create-dmg) - macOS DMG creator

### Support
- Check [BUILD_WINDOWS.md](BUILD_WINDOWS.md) for Windows details
- See [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md) for quick reference
- Read [WINDOWS_EXE_QUICK_START.txt](WINDOWS_EXE_QUICK_START.txt) for quick start

---

## Summary

Building executables for the Flashcard App is straightforward:

1. **Install dependencies:** `pip install -r requirements.txt`
2. **Run build script:** Platform-specific script or `python build_exe.py`
3. **Find executable:** In `dist/` folder
4. **Test thoroughly:** Verify all functionality works
5. **Distribute:** Share the executable file

The process is automated and works across Windows, macOS, and Linux with minimal configuration required.
