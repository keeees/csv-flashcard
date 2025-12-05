# Building Desktop Executable

## Quick Start

### Windows
1. Double-click `build_windows.bat` OR
2. Run `build_windows.ps1` in PowerShell
3. Find executable in `dist/FlashcardApp.exe`

See [BUILD_WINDOWS.md](BUILD_WINDOWS.md) for detailed Windows instructions.

### macOS
```bash
./create_dmg.sh
```

### Linux / Manual Build
```bash
python build_exe.py
```

## Option 1: PyInstaller (Recommended)

### Install PyInstaller
```bash
pip install pyinstaller
```

### Build the executable
```bash
python build_exe.py
```

The script automatically detects your platform and uses the correct path separators.

### Find your executable
- Windows: `dist/FlashcardApp.exe`
- Mac: `dist/FlashcardApp.app`
- Linux: `dist/FlashcardApp`

### How it works
1. Double-click the executable
2. Flask server starts in background
3. Browser opens automatically to the app
4. Close browser when done (server stops)

---

## Option 2: Electron (Better Desktop Experience)

For a true desktop app with native UI:

### Install Electron
```bash
npm install electron electron-builder
```

### Create Electron wrapper
Would need to:
- Wrap Flask backend
- Create native window (no browser chrome)
- Add system tray icon
- Better offline experience

**More complex but professional result.**

---

## Comparison

| Feature | PyInstaller | Electron | Web (Railway) |
|---------|-------------|----------|---------------|
| File size | ~50-100MB | ~150-200MB | N/A |
| Offline | ✅ Yes | ✅ Yes | ❌ No |
| Cross-platform | Build per OS | Build per OS | ✅ Works everywhere |
| Updates | Manual download | Auto-update possible | ✅ Instant |
| Setup time | 5 min | 30 min | 5 min |

---

## Recommendation

- **For personal use:** PyInstaller (simple, works offline)
- **For distribution:** Web deployment (Railway/Render)
- **For professional desktop app:** Electron (more work, better UX)

Most users prefer web apps nowadays - no installation, works on mobile, easy updates.
