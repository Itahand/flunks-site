import React, { createContext, useContext, useRef, useState } from 'react';

interface MusicContextType {
  currentAudio: HTMLAudioElement | null;
  currentMusicPlayerId: string | null;
  playMusic: (audio: HTMLAudioElement, playerId: string) => void;
  pauseMusic: () => void;
  resumeMusic: () => void;
  stopAllMusic: () => void;
  isPlaying: boolean;
  isCurrentPlayer: (audio: HTMLAudioElement | null, playerId: string) => boolean;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [currentMusicPlayerId, setCurrentMusicPlayerId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playMusic = (audio: HTMLAudioElement, playerId: string) => {
    // Stop any currently playing music
    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    // Set the new audio as current
    setCurrentAudio(audio);
    setCurrentMusicPlayerId(playerId);
    setIsPlaying(true);
  };

  const pauseMusic = () => {
    setIsPlaying(false);
  };

  const resumeMusic = () => {
    setIsPlaying(true);
  };

  const stopAllMusic = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    setCurrentAudio(null);
    setCurrentMusicPlayerId(null);
    setIsPlaying(false);
  };

  const isCurrentPlayer = (audio: HTMLAudioElement | null, playerId: string) => {
    return currentAudio === audio && currentMusicPlayerId === playerId;
  };

  return (
    <MusicContext.Provider
      value={{
        currentAudio,
        currentMusicPlayerId,
        playMusic,
        pauseMusic,
        resumeMusic,
        stopAllMusic,
        isPlaying,
        isCurrentPlayer,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusicContext = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicContext must be used within a MusicProvider');
  }
  return context;
};