#!/bin/bash
# Keep audio files local by accessing them periodically
find "$(dirname "$0")/public/music" "$(dirname "$0")/public/sounds" -name "*.mp3" -exec touch {} \;
echo "Audio files kept active: $(date)"
