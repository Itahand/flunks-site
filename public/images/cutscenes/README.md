# Cutscene Assets Directory

This directory contains image and audio assets for the Flunks cutscene system.

## Structure:
- `/images/cutscenes/` - Scene background images
- `/sounds/` - Background music and audio files (already exists)

## Required Assets for Current Implementation:

### Season Zero Intro Cutscene:
- `season-zero-intro-1.jpg` - First scene background
- `season-zero-intro-2.jpg` - Second scene background  
- `/sounds/season-zero-theme.mp3` - Background music

### Chapter Thumbnails (for Story Manual):
- `chapter1-thumb.jpg` - Chapter 1 thumbnail
- `chapter2-thumb.jpg` - Chapter 2 thumbnail

### Scene Images (for Story Manual chapters):
- `school-entrance.jpg` - School entrance scene
- `hallway-first-day.jpg` - First day hallway scene  
- `cafeteria-drama.jpg` - Cafeteria social dynamics scene

## Notes:
- Images should be 1920x1080 or similar 16:9 aspect ratio for best results
- Music files should be MP3 format, ideally loopable
- Keep file sizes reasonable for web loading
- Use descriptive filenames for easy asset management

## Fallback:
If images are missing, the system will show placeholder text instead of failing.