import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import { WINDOW_IDS } from "fixed";
import { useWindowsContext } from "contexts/WindowsContext";
import styled from "styled-components";
import { useEffect, useRef } from "react";

const FullScreenImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
`;

const FreaksTVWindow = () => {
  const { closeWindow } = useWindowsContext();
  const audioRef = useRef<HTMLAudioElement>(null);

  const audioPath = "/music/tvaudio.mp3";
  const imagePath = "/images/locations/freaks-bedroom-tv.png";

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
      initialWidth="800px"
      initialHeight="600px"
      resizable
    >
      <FullScreenImage src={imagePath} alt="TV" />
      
      {/* Hidden audio element that plays in the background */}
      <audio ref={audioRef} loop>
        <source src={audioPath} type="audio/mpeg" />
      </audio>
    </DraggableResizeableWindow>
  );
};

export default FreaksTVWindow;
