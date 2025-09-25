import React, { createContext, useContext, useRef, useState } from 'react';

interface MusicContextType {
  currentAudio: HTMLAudioElement | null;
  currentMusicPlayerId: string | null;
  playMusic: (audio: HTMLAudioElement, playerId: string) => void;
  stopAllMusic: () => void;
  isPlaying: boolean;
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

  const stopAllMusic = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    setCurrentAudio(null);
    setCurrentMusicPlayerId(null);
    setIsPlaying(false);
  };

  return (
    <MusicContext.Provider
      value={{
        currentAudio,
        currentMusicPlayerId,
        playMusic,
        stopAllMusic,
        isPlaying,
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