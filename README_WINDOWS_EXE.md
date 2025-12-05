# Flashcard App - Windows Executable

A standalone Windows application for studying flashcards. No Python installation required!

## 🚀 Quick Start

### For Users (Running the App)

1. Download `FlashcardApp.exe`
2. Double-click to run
3. Browser opens automatically
4. Start studying!

**That's it!** No installation, no setup, no Python required.

### For Developers (Building the Exe)

**Easiest Method:**
```cmd
# Just double-click:
build_windows.bat
```

**Alternative Methods:**
```powershell
# PowerShell:
.\build_windows.ps1

# Command line:
python build_exe.py
```

**Output:** `dist\FlashcardApp.exe`

## 📋 Features

- ✅ **Standalone executable** - No dependencies
- ✅ **Auto-opens browser** - Launches automatically
- ✅ **Upload CSV files** - Add your own flashcard decks
- ✅ **Offline capable** - Works without internet
- ✅ **Keyboard shortcuts** - Fast navigation
- ✅ **Responsive design** - Works on any screen size

## 📁 CSV File Format

Create flashcards using CSV files:

```csv
question,answer
What is the capital of France?,Paris
What is 2+2?,4
Who wrote Hamlet?,William Shakespeare
```

### Requirements:
- First row must be: `question,answer`
- UTF-8 encoding
- One flashcard per line

## 🎮 How to Use

### Loading Flashcards
1. **Select from dropdown** - Choose existing CSV file
2. **Upload new file** - Click "Upload" button to add your own

### Studying
- **Click card** or press **Space/Enter** to flip
- **Arrow keys** (← →) to navigate
- **S** to shuffle deck
- **R** to restart from beginning

### Adding Your Own Flashcards
1. Create a CSV file with your questions and answers
2. Click "Upload" button in the app
3. Select your CSV file
4. Start studying immediately!

## 🔧 Building from Source

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Build Steps

1. **Clone or download** the repository

2. **Install dependencies:**
   ```cmd
   pip install -r requirements.txt
   ```

3. **Build executable:**
   ```cmd
   python build_exe.py
   ```
   
   Or use the automated script:
   ```cmd
   build_windows.bat
   ```

4. **Find your executable:**
   ```
   dist\FlashcardApp.exe
   ```

### Build Time
- First build: 2-3 minutes
- Subsequent builds: 1-2 minutes

### File Size
- Approximately 20-50 MB
- Includes Python runtime and all dependencies

## 📦 Distribution

### Sharing the App

The `FlashcardApp.exe` file is completely standalone:
- ✅ Share via email, USB, cloud storage
- ✅ No installation required
- ✅ Works on any Windows computer
- ✅ No Python needed

### Creating a Distribution Package

For a complete package:

```
FlashcardApp_Package/
├── FlashcardApp.exe          # The application
├── data/                      # Sample flashcard files
│   ├── sample1.csv
│   └── sample2.csv
└── README.txt                 # Usage instructions
```

Zip this folder and share!

## 🐛 Troubleshooting

### App Won't Start

**Antivirus/Windows Defender:**
- This is normal for PyInstaller executables
- Add exception for `FlashcardApp.exe`
- Or click "More info" → "Run anyway"

**Port 5000 in Use:**
- Close other applications using port 5000
- Or modify `app_desktop.py` to use a different port

### Browser Doesn't Open

**Manual Access:**
1. Start the app
2. Open your browser
3. Go to: `http://127.0.0.1:5000`

### Upload Not Working

**File Format:**
- Ensure CSV file is UTF-8 encoded
- Check first row is: `question,answer`
- Verify no empty lines

**File Size:**
- Maximum upload size: 16 MB
- For larger files, place directly in `data/` folder

### Build Fails

**PyInstaller Not Found:**
```cmd
pip install pyinstaller
```

**Import Errors:**
```cmd
pip install -r requirements.txt --upgrade
```

**Clean Build:**
```cmd
# Delete old build files
rmdir /s /q build dist
del FlashcardApp.spec

# Rebuild
python build_exe.py
```

## 🔒 Security Notes

### Antivirus Warnings

PyInstaller executables often trigger antivirus warnings because:
- They bundle Python interpreter
- They extract files at runtime
- They're not code-signed

**This is normal and safe** for self-built executables.

### For Distribution

If distributing widely:
1. Consider code signing with a certificate
2. Submit to antivirus vendors for whitelisting
3. Provide source code for verification

## 📝 Technical Details

### Technology Stack
- **Backend:** Flask (Python web framework)
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Packaging:** PyInstaller
- **Server:** Built-in Flask development server

### How It Works
1. Executable starts Flask server on localhost:5000
2. Opens default browser to the application
3. User interacts through web interface
4. Server runs until application is closed

### Included Components
- Python 3.x runtime
- Flask web framework
- Jinja2 templating engine
- Werkzeug utilities
- All application code
- Static assets (CSS, JS)
- HTML templates
- Sample CSV files

## 📚 Documentation

- **Quick Start:** [WINDOWS_EXE_QUICK_START.txt](WINDOWS_EXE_QUICK_START.txt)
- **Detailed Build Guide:** [BUILD_WINDOWS.md](BUILD_WINDOWS.md)
- **Complete Guide:** [BUILDING_EXECUTABLES.md](BUILDING_EXECUTABLES.md)
- **General Instructions:** [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md)

## 🆘 Getting Help

### Common Questions

**Q: Do I need Python installed to run the exe?**
A: No! The executable includes everything needed.

**Q: Can I use my own CSV files?**
A: Yes! Use the upload feature or place files in the `data/` folder.

**Q: Does it work offline?**
A: Yes! No internet connection required.

**Q: Can I share this with others?**
A: Yes! The exe is standalone and can be freely shared.

**Q: Why is the file so large?**
A: It includes Python runtime and all dependencies (~20-50 MB).

**Q: Is it safe?**
A: Yes! You can verify by building from source code.

### Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the documentation files
3. Verify you're using the latest version
4. Try a clean rebuild

## 📄 License

See the main project LICENSE file for details.

## 🎓 Use Cases

Perfect for:
- 📚 Students studying for exams
- 🌍 Language learners
- 🧠 Memory training
- 📖 Vocabulary building
- 🎯 Test preparation
- 👨‍🏫 Teachers creating study materials

## ✨ Features in Detail

### Flashcard Display
- Large, readable text
- Smooth flip animation
- Question in black serif font
- Answer in red sans-serif font
- Responsive design

### Navigation
- Previous/Next buttons
- Keyboard shortcuts
- Progress indicator
- Circular navigation (wraps around)

### Deck Management
- Load multiple CSV files
- Upload new files
- Shuffle cards
- Restart deck
- Track progress

### User Interface
- Clean, modern design
- Intuitive controls
- Keyboard hints
- Error messages
- Success notifications

## 🚀 Performance

- **Startup time:** 2-3 seconds
- **Memory usage:** ~50-100 MB
- **CPU usage:** Minimal (idle when not flipping)
- **Disk space:** ~20-50 MB

## 🔄 Updates

To update the application:
1. Download new version
2. Replace old `FlashcardApp.exe`
3. Your CSV files in `data/` folder are preserved

## 🎉 Enjoy Studying!

Happy learning with your new flashcard app! 📚✨
