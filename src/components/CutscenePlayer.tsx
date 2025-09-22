import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';

interface CutsceneScene {
  id: string;
  image: string;
  lines: string[];
  music?: string;
  duration?: number; // Optional auto-advance timer
}

interface CutscenePlayerProps {
  scenes: CutsceneScene[];
  onComplete?: () => void;
  onClose?: () => void;
  autoStart?: boolean;
}

const CutsceneContainer = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  z-index: 9999;
  overflow: hidden;
  font-family: 'Courier New', monospace;
`;

const SceneImage = styled.img<{ visible: boolean }>`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 1200ms ease-in-out;
`;

const LetterboxTop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8vh;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(2px);
  z-index: 5;
`;

const LetterboxBottom = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 8vh;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(2px);
  z-index: 5;
`;

const TextBox = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 10vh;
  width: min(900px, 92vw);
  padding: 16px 20px;
  background: rgba(10, 10, 14, 0.85);
  border: 2px solid #f5a2d3;
  color: #fff;
  border-radius: 8px;
  z-index: 10;
  box-shadow: 0 0 0 4px rgba(245, 162, 211, 0.15);
`;

const TextContent = styled.p`
  min-height: 4em;
  letter-spacing: 0.4px;
  line-height: 1.5;
  margin: 0 0 12px 0;
  font-size: clamp(16px, 2.4vw, 22px);
  white-space: pre-wrap;
`;

const Controls = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ControlButton = styled.button`
  cursor: pointer;
  background: #111;
  color: #fff;
  border: 1px solid #666;
  padding: 8px 12px;
  border-radius: 6px;
  font-family: inherit;
  font-size: 14px;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #f5a2d3;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 2px solid #f5a2d3;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  z-index: 11;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(245, 162, 211, 0.2);
  }
`;

const CutscenePlayer: React.FC<CutscenePlayerProps> = ({
  scenes,
  onComplete,
  onClose,
  autoStart = true
}) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showingA, setShowingA] = useState(true);
  const [muted, setMuted] = useState(false);
  
  const bgmRef = useRef<HTMLAudioElement>(null);
  const typeControllerRef = useRef<{ cancel: boolean }>({ cancel: false });

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const typeText = useCallback(async (text: string, speed = 24) => {
    setIsTyping(true);
    typeControllerRef.current = { cancel: false };
    setDisplayText('');
    
    for (let i = 0; i < text.length; i++) {
      if (typeControllerRef.current.cancel) break;
      setDisplayText(text.substring(0, i + 1));
      const jitter = Math.random() * 20 - 10;
      await sleep(Math.max(5, speed + jitter));
    }
    
    if (!typeControllerRef.current.cancel) {
      setDisplayText(text);
    }
    setIsTyping(false);
  }, []);

  const stopTypingAndFill = useCallback(() => {
    typeControllerRef.current.cancel = true;
    const scene = scenes[currentScene];
    if (scene && scene.lines[currentLine]) {
      setDisplayText(scene.lines[currentLine]);
    }
    setIsTyping(false);
  }, [scenes, currentScene, currentLine]);

  const playLine = useCallback(async () => {
    const scene = scenes[currentScene];
    if (scene && scene.lines[currentLine]) {
      await typeText(scene.lines[currentLine]);
    }
  }, [scenes, currentScene, currentLine, typeText]);

  const next = useCallback(async () => {
    if (isTyping) {
      stopTypingAndFill();
      return;
    }

    const scene = scenes[currentScene];
    if (!scene) return;

    // Check if there are more lines in current scene
    if (currentLine + 1 < scene.lines.length) {
      setCurrentLine(prev => prev + 1);
      return;
    }

    // Move to next scene
    if (currentScene + 1 < scenes.length) {
      setCurrentScene(prev => prev + 1);
      setCurrentLine(0);
      return;
    }

    // End of cutscene
    setDisplayText('The End.');
    setTimeout(() => {
      onComplete?.();
    }, 2000);
  }, [isTyping, scenes, currentScene, currentLine, stopTypingAndFill, onComplete]);

  const skip = useCallback(() => {
    if (isTyping) {
      stopTypingAndFill();
    } else {
      next();
    }
  }, [isTyping, stopTypingAndFill, next]);

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const newMuted = !prev;
      if (bgmRef.current) {
        bgmRef.current.muted = newMuted;
      }
      return newMuted;
    });
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') next();
      if (e.key === ' ') { e.preventDefault(); skip(); }
      if (e.key.toLowerCase() === 'm') toggleMute();
      if (e.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [next, skip, toggleMute, onClose]);

  // Scene change effect
  useEffect(() => {
    const scene = scenes[currentScene];
    if (!scene) return;

    // Handle music
    if (scene.music && bgmRef.current) {
      bgmRef.current.src = scene.music;
      if (!muted) {
        bgmRef.current.play().catch(() => {
          // Handle autoplay restrictions
        });
      }
    }

    // Play the current line after scene transition
    if (currentLine === 0) {
      setTimeout(() => {
        playLine();
      }, 500); // Small delay for scene transition
    }
  }, [currentScene, scenes, muted]);

  // Line change effect
  useEffect(() => {
    if (currentLine > 0) {
      playLine();
    }
  }, [currentLine, playLine]);

  // Initial start
  useEffect(() => {
    if (autoStart && scenes.length > 0) {
      setTimeout(() => {
        playLine();
      }, 300);
    }
  }, [autoStart, scenes, playLine]);

  if (scenes.length === 0) return null;

  const currentSceneData = scenes[currentScene];

  return (
    <CutsceneContainer>
      {/* Background Images */}
      <SceneImage
        id="sceneA"
        src={showingA ? currentSceneData?.image || '' : scenes[Math.max(0, currentScene - 1)]?.image || ''}
        alt=""
        visible={showingA}
      />
      <SceneImage
        id="sceneB"
        src={!showingA ? currentSceneData?.image || '' : scenes[Math.min(scenes.length - 1, currentScene + 1)]?.image || ''}
        alt=""
        visible={!showingA}
      />

      {/* Letterbox bars */}
      <LetterboxTop />
      <LetterboxBottom />

      {/* Close button */}
      {onClose && (
        <CloseButton onClick={onClose} aria-label="Close cutscene">
          ✕
        </CloseButton>
      )}

      {/* Text box */}
      <TextBox role="dialog" aria-live="polite" aria-atomic="true">
        <TextContent>{displayText}</TextContent>
        <Controls>
          <ControlButton onClick={next} aria-label="Next line (Enter)">
            Next ▶
          </ControlButton>
          <ControlButton onClick={skip} aria-label="Skip typing (Space)">
            Skip ⏭
          </ControlButton>
          <ControlButton onClick={toggleMute} aria-label="Toggle music (M)">
            {muted ? 'Unmute 🔊' : 'Mute 🔇'}
          </ControlButton>
          {onClose && (
            <ControlButton onClick={onClose} aria-label="Close (Esc)">
              Close ✕
            </ControlButton>
          )}
        </Controls>
      </TextBox>

      {/* Background music */}
      <audio ref={bgmRef} loop muted={muted} />
    </CutsceneContainer>
  );
};

export default CutscenePlayer;