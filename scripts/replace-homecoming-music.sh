#!/bin/bash

# Script to replace homecoming music files safely
# This removes macOS extended attributes and file locks

echo "🎵 Homecoming Music File Replacement Helper"
echo "=========================================="
echo ""

cd "/Users/jeremy/top secret project/flunks-site/public/music"

echo "Current homecoming music files:"
ls -lh | grep homecoming
echo ""

echo "Which file do you want to replace?"
echo "1) homecoming.mp3 (used by Football Field location)"
echo "2) homecomingstory.mp3 (used by Story Mode - RECOMMENDED)"
echo ""
read -p "Enter 1 or 2: " choice

if [ "$choice" == "1" ]; then
    FILE="homecoming.mp3"
elif [ "$choice" == "2" ]; then
    FILE="homecomingstory.mp3"
else
    echo "❌ Invalid choice. Exiting."
    exit 1
fi

echo ""
echo "📋 Step 1: Backing up current file..."
cp "$FILE" "${FILE}.backup"
echo "✅ Backup created: ${FILE}.backup"

echo ""
echo "📋 Step 2: Removing extended attributes and locks..."
xattr -c "$FILE" 2>/dev/null
chflags nouchg "$FILE" 2>/dev/null
echo "✅ Attributes cleared"

echo ""
echo "📋 Step 3: Removing the file..."
rm -f "$FILE"
echo "✅ File removed"

echo ""
echo "✨ SUCCESS! You can now drag and drop your new $FILE file into:"
echo "   /public/music/"
echo ""
echo "💡 Your old file is backed up as: ${FILE}.backup"
echo ""
