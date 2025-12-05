#!/bin/bash
# Create a DMG installer for Mac

APP_NAME="FlashcardApp"
DMG_NAME="FlashcardApp-Installer"

# Create temporary directory
mkdir -p dist/dmg
cp -r "dist/${APP_NAME}.app" dist/dmg/

# Create DMG
hdiutil create -volname "${APP_NAME}" \
  -srcfolder dist/dmg \
  -ov -format UDZO \
  "dist/${DMG_NAME}.dmg"

# Cleanup
rm -rf dist/dmg

echo "✅ DMG created: dist/${DMG_NAME}.dmg"
