import React, { useState, useRef, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useMusicContext } from '../contexts/MusicContext';
import { audioContextService } from '../services/audioContextService';

interface MusicPlayerProps {
  songTitle: string;
  artist: string;
  songFile: string;
  themeColor: string;
  autoplay?: boolean;
  startTime?: number; // Start time in seconds
}

const PlayerContainer = styled.div<{ themeColor: string }>`
  background: linear-gradient(to bottom, #f0f0f0, #d0d0d0);
  border: 2px outset #cccccc;
  padding: 8px;
  font-family: 'Arial', sans-serif;
  font-size: 9px;
  width: 100%;
  color: #000;
`;

const SongInfo = styled.div`
  margin-bottom: 8px;
  text-align: center;
`;

const SongTitle = styled.div`
  font-weight: bold;
  font-size: 10px;
  margin-bottom: 2px;
`;

const Artist = styled.div`
  font-size: 9px;
  color: #666;
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-bottom: 8px;
`;

const ControlButton = styled.button<{ themeColor: string }>`
  background: linear-gradient(to bottom, ${props => props.themeColor}, ${props => props.themeColor}dd);
  border: 1px outset #999;
  color: white;
  padding: 3px 6px;
  font-size: 8px;
  cursor: pointer;
  font-family: 'Arial', sans-serif;
  
  &:hover {
    background: linear-gradient(to bottom, ${props => props.themeColor}ee, ${props => props.themeColor}cc);
  }
  
  &:active {
    border: 1px inset #999;
  }
`;

const ProgressBar = styled.div`
  background: #000;
  border: 1px inset #ccc;
  height: 8px;
  position: relative;
  margin-bottom: 5px;
`;

const ProgressFill = styled.div<{ progress: number; themeColor: string }>`
  background: linear-gradient(to right, ${props => props.themeColor}, ${props => props.themeColor}aa);
  height: 100%;
  width: ${props => props.progress}%;
  transition: width 0.1s ease;
`;

const TimeDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 8px;
  color: #666;
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
`;

const VolumeSlider = styled.input`
  width: 60px;
  height: 4px;
`;

const MusicPlayer: React.FC<MusicPlayerProps> = ({ songTitle, artist, songFile, themeColor, autoplay = false, startTime = 0 }) => {
  const { stopAllMusic, playMusic, currentAudio } = useMusicContext();
  const [currentTime, setCurrentTime] = useState(startTime);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(autoplay ? 0.4 : 0.7);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Generate unique ID for this player instance
  const playerId = useMemo(() => `player_${songFile}_${Math.random()}`, [songFile]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const onEnded = () => {
      setIsPlaying(false);
      stopAllMusic();
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    // Autoplay if enabled
    if (autoplay) {
      const playAudio = async () => {
        try {
          // Try to resume shared audio context (helps with autoplay policies)
          if (typeof window !== 'undefined' && 'AudioContext' in window) {
            await audioContextService.getAudioContext();
          }
          
          // Set start time before playing
          if (startTime > 0) {
            audio.currentTime = startTime;
            setCurrentTime(startTime);
          }
          
          await audio.play();
          playMusic(audio, playerId);
        } catch (error) {
          console.log('Autoplay failed, user interaction required:', error);
          // Don't set isPlaying to true if autoplay failed
        }
      };
      
      // Small delay to ensure audio is loaded
      setTimeout(playAudio, 100);
    } else if (startTime > 0) {
      // Set start time even if not autoplaying
      const setInitialTime = () => {
        if (audio.readyState >= 1) { // HAVE_METADATA
          audio.currentTime = startTime;
          setCurrentTime(startTime);
        } else {
          audio.addEventListener('loadedmetadata', () => {
            audio.currentTime = startTime;
            setCurrentTime(startTime);
          }, { once: true });
        }
      };
      setTimeout(setInitialTime, 100);
    }

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [autoplay, startTime, playerId, playMusic, stopAllMusic]);

  // Cleanup effect to stop audio when component unmounts
  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        setIsPlaying(false);
      }
    };
  }, []);

  const handlePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      // Currently playing, so pause
      try {
        audio.pause();
        setIsPlaying(false);
      } catch (error) {
        console.log('Error pausing audio:', error);
        setIsPlaying(false);
      }
    } else {
      // Not playing, so play
      try {
        if (currentAudio && currentAudio !== audio) {
          // Different player is active - stop it first
          stopAllMusic();
        }
        
        // Ensure audio context is ready before playing
        await audioContextService.getAudioContext();
        
        await audio.play();
        setIsPlaying(true);
        playMusic(audio, playerId);
      } catch (error) {
        console.log('Audio play failed:', error);
        setIsPlaying(false);
      }
    }
  };

  const handleStop = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }
    stopAllMusic();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <PlayerContainer themeColor={themeColor}>
      <audio ref={audioRef} src={songFile} />
      
      <SongInfo>
        <SongTitle>♪ {songTitle}</SongTitle>
        <Artist>by {artist}</Artist>
      </SongInfo>

      <Controls>
        <ControlButton themeColor={themeColor} onClick={handlePlayPause}>
          {isPlaying ? '⏸️' : '▶️'}
        </ControlButton>
        <ControlButton themeColor={themeColor} onClick={handleStop}>
          ⏹️
        </ControlButton>
      </Controls>

      <ProgressBar>
        <ProgressFill progress={progress} themeColor={themeColor} />
      </ProgressBar>

      <TimeDisplay>
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </TimeDisplay>

      <VolumeControl>
        <span style={{ fontSize: '8px' }}>🔊</span>
        <VolumeSlider
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
        />
      </VolumeControl>
    </PlayerContainer>
  );
};

export default MusicPlayer;