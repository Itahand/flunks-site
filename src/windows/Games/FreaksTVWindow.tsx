import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import { WINDOW_IDS } from "fixed";
import { useWindowsContext } from "contexts/WindowsContext";
import styled from "styled-components";
import { useEffect, useRef } from "react";

const TVShell = styled.div`
  background: linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%);
  border: 12px solid #3a3a3a;
  border-radius: 20px 20px 8px 8px;
  padding: 30px 40px 40px 40px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.8),
    inset 0 2px 4px rgba(255, 255, 255, 0.05);
  position: relative;
  max-width: 640px;
  margin: 0 auto;
`;

const Screen = styled.div`
  background: #000;
  border: 4px solid #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 4/3;
  position: relative;
  box-shadow: inset 0 0 50px rgba(0, 100, 255, 0.1);
  
  /* CRT scanlines effect */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.15) 0px,
      transparent 1px,
      transparent 2px,
      rgba(0, 0, 0, 0.15) 3px
    );
    pointer-events: none;
    z-index: 3;
  }
  
  /* CRT screen curve/glow */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      ellipse at center,
      transparent 0%,
      rgba(0, 0, 0, 0.3) 100%
    );
    pointer-events: none;
    z-index: 1;
  }
`;

const ScreenVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: contrast(1.1) brightness(0.95);
  z-index: 0;
`;

const TVFrame = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  z-index: 2;
`;

const TVControls = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
  justify-content: center;
`;

const Knob = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #4a4a4a, #2a2a2a);
  border: 2px solid #1a1a1a;
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.5),
    0 2px 4px rgba(255, 255, 255, 0.1);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 3px;
    height: 10px;
    background: #666;
    border-radius: 2px;
  }
`;

const FreaksTVWindow = () => {
  const { closeWindow } = useWindowsContext();
  const audioRef = useRef<HTMLAudioElement>(null);

  // Paths to your media files
  const videoPath = "/videos/tv/content.mp4";
  const audioPath = "/music/tvaudio.mp3";
  const framePath = "/images/freakbedroomtv.png"; // Transparent PNG frame overlay

  useEffect(() => {
    // Play audio when component mounts
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.log("Audio autoplay prevented:", err);
      });
    }

    // Cleanup: pause audio when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <DraggableResizeableWindow
      windowsId={WINDOW_IDS.FREAKS_TV}
      headerTitle="📺 Freak's TV"
      onClose={() => closeWindow(WINDOW_IDS.FREAKS_TV)}
      initialWidth="700px"
      initialHeight="600px"
      resizable
    >
      <TVShell>
        <Screen>
          <ScreenVideo 
            autoPlay 
            loop 
            muted 
            playsInline
          >
            <source src={videoPath} type="video/mp4" />
          </ScreenVideo>
          <TVFrame 
            src={framePath} 
            alt="TV Frame"
          />
        </Screen>
        
        {/* Hidden audio element that plays in the background */}
        <audio ref={audioRef} loop>
          <source src={audioPath} type="audio/mpeg" />
        </audio>
        
        <TVControls>
          <Knob title="Volume" />
          <Knob title="Channel" />
        </TVControls>
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: '15px', 
          fontSize: '11px', 
          color: '#666',
          fontFamily: 'monospace'
        }}>
          ZENITH • COLOR TV
        </div>
      </TVShell>
    </DraggableResizeableWindow>
  );
};

export default FreaksTVWindow;
