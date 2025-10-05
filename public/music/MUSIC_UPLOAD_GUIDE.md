# 🎵 Music Upload Location

Upload music files to the `/public/music/` directory.

## 📂 Current Music Files Status:

### ✅ Homecoming Music (Ready!)
- `homecoming.mp3` (766 KB) - Background music for homecoming locations
- `homecomingstory.mp3` (1.8 MB) - Story music for homecoming cutscenes

### ✅ Other Music Files Available:
- `Flunko.mp3` - Flunko game music
- `arcade.mp3` - Arcade location music  
- `child.mp3` - Story cutscene music
- `enter.mp3` - Entrance/transition sounds
- `main-song.mp3` - Main theme music
- `paradisemotel.mp3` - Paradise Motel location music
- `the-freaks.mp3` - Freaks clique music
- `the-jocks.mp3` - Jocks clique music
- `the-nerds.mp3` - Nerds clique music
- `the-preps.mp3` - Preps clique music

## 🎯 Upload Instructions:
1. **Drag and drop** new music files into this folder
2. **Name files** using descriptive names (lowercase, no spaces)
3. **Format**: MP3 recommended for web compatibility
4. **Size**: Keep under 5MB per file when possible for faster loading

## 🔄 How Music Gets Used:
- Story cutscenes: Reference files in `/music/` directory
- Location backgrounds: Auto-loaded based on filename
- Game sounds: Loaded by specific game components

## 📍 File Paths in Code:
Music files are referenced as: `/music/filename.mp3`
Example: `/music/homecomingstory.mp3`