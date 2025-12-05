"""Build script for creating executable"""
import PyInstaller.__main__
import sys
import os

# Determine the separator for --add-data based on platform
separator = ';' if sys.platform == 'win32' else ':'

# Build arguments
args = [
    'app_desktop.py',
    '--name=FlashcardApp',
    '--onefile',
    '--windowed',  # No console window
    f'--add-data=templates{separator}templates',
    f'--add-data=static{separator}static',
    f'--add-data=data{separator}data',
    f'--add-data=utils{separator}utils',
    f'--add-data=models{separator}models',
    '--hidden-import=flask',
    '--hidden-import=jinja2',
    '--hidden-import=werkzeug',
    '--hidden-import=werkzeug.utils',
    '--hidden-import=werkzeug.security',
    '--collect-all=flask',
    '--collect-all=jinja2',
    '--noconfirm',  # Overwrite output directory without asking
    # Remove --icon line or add your own .ico/.icns file path
]

print(f"Building for platform: {sys.platform}")
print(f"Using data separator: {separator}")
print("Starting PyInstaller build...")

PyInstaller.__main__.run(args)
