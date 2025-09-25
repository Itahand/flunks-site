import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';

interface CutsceneScene {
  id: string;
  image: string;
  lines: string[];
  music?: string;
  duration?: number; // Optional auto-advance timer
}

interface VCREffectsConfig {
  scanLinesEnabled: boolean;
  scanLinesOpacity: number;
  scanLinesSpeed: number;
  noiseEnabled: boolean;
  noiseOpacity: number;
  noiseSpeed: number;
  chromaticEnabled: boolean;
  chromaticIntensity: number;
  chromaticSpeed: number;
  staticEnabled: boolean;
  staticOpacity: number;
  staticMovement: number;
  vintageEnabled: boolean;
  vintageWarmth: number;
  vintageVignette: number;
}

interface CutscenePlayerProps {
  scenes: CutsceneScene[];
  onComplete?: () => void;
  onClose?: () => void;
  autoStart?: boolean;
  vcrEffects?: VCREffectsConfig;
  windowed?: boolean; // New prop to support windowed mode
}

const CutsceneContainer = styled.div<{ windowed?: boolean }>`
  position: ${props => props.windowed ? 'relative' : 'fixed'};
  inset: ${props => props.windowed ? 'auto' : '0'};
  width: ${props => props.windowed ? '100%' : '100vw'};
  height: ${props => props.windowed ? '100%' : '100vh'};
  min-height: ${props => props.windowed ? '400px' : 'auto'}; /* Ensure minimum height in windowed mode */
  background: #000;
  z-index: ${props => props.windowed ? 'auto' : '9999'};
  overflow: hidden;
  font-family: 'Courier New', monospace;

  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
  }
`;

const SceneImage = styled.img<{ visible: boolean }>`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 1200ms ease-in-out;
  z-index: 0; /* Ensure images are behind effects */
  background: #1a1008; /* Fallback color if image fails */
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

  @media (max-width: 768px) {
    height: 6vh;
  }
`;

const VCREffects = styled.div<{ config: VCREffectsConfig }>`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
  display: ${props => props.config.scanLinesEnabled ? 'block' : 'none'};
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      repeating-linear-gradient(
        0deg,
        transparent 0px,
        transparent 1px,
        rgba(255, 255, 255, ${props => props.config.scanLinesOpacity * 0.02}) 2px,
        rgba(255, 255, 255, ${props => props.config.scanLinesOpacity * 0.02}) 3px,
        transparent 4px
      );
    animation: scanlines ${props => props.config.scanLinesSpeed * 0.1}s linear infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.1) 100%),
      repeating-conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,${props => props.config.noiseOpacity * 0.0002}) 1deg, transparent 2deg);
    opacity: ${props => props.config.noiseOpacity * 0.02};
    animation: noise ${props => props.config.noiseSpeed * 0.1}s steps(8, end) infinite;
    display: ${props => props.config.noiseEnabled ? 'block' : 'none'};
  }
    animation: noise ${props => props.config.noiseSpeed * 0.1}s steps(8, end) infinite;
    display: ${props => props.config.noiseEnabled ? 'block' : 'none'};
  }
  
  @keyframes scanlines {
    0% { transform: translateY(0px); }
    100% { transform: translateY(4px); }
  }
  
  @keyframes noise {
    0%, 100% { opacity: ${props => (props.config.noiseOpacity - 20) * 0.01}; }
    50% { opacity: ${props => props.config.noiseOpacity * 0.01}; }
  }
`;

const ChromaticEffect = styled.div<{ config: VCREffectsConfig }>`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 4;
  mix-blend-mode: screen;
  display: ${props => props.config.chromaticEnabled ? 'block' : 'none'};
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, 
      rgba(255, 0, 0, ${props => props.config.chromaticIntensity * 0.01}) 0%, 
      transparent 33%,
      rgba(0, 255, 0, ${props => props.config.chromaticIntensity * 0.01}) 66%,
      rgba(0, 0, 255, ${props => props.config.chromaticIntensity * 0.01}) 100%
    );
    animation: chromatic ${props => props.config.chromaticSpeed * 0.1}s ease-in-out infinite alternate;
  }
  
  @keyframes chromatic {
    0% { transform: translateX(-${props => props.config.chromaticIntensity * 1}px); }
    100% { transform: translateX(${props => props.config.chromaticIntensity * 1}px); }
  }
`;

const VHSStatic = styled.div<{ config: VCREffectsConfig }>`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  display: ${props => props.config.staticEnabled ? 'block' : 'none'};
  background: 
    url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='${props => props.config.staticOpacity * 0.02}'/%3E%3C/svg%3E");
  animation: staticShift ${props => props.config.staticMovement * 0.1}s steps(1, end) infinite;
  
  @keyframes staticShift {
    0% { transform: translate(0px, 0px); }
    25% { transform: translate(-${props => props.config.staticMovement * 2}px, ${props => props.config.staticMovement * 2}px); }
    50% { transform: translate(${props => props.config.staticMovement * 2}px, -${props => props.config.staticMovement * 2}px); }
    75% { transform: translate(-${props => props.config.staticMovement * 2}px, -${props => props.config.staticMovement * 2}px); }
    100% { transform: translate(${props => props.config.staticMovement * 2}px, ${props => props.config.staticMovement * 2}px); }
  }
`;

const VintageFilter = styled.div<{ config: VCREffectsConfig }>`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  display: ${props => props.config.vintageEnabled ? 'block' : 'none'};
  background: 
    radial-gradient(circle at 50% 50%, 
      rgba(255, 215, 175, ${props => props.config.vintageWarmth * 0.01}) 0%, 
      rgba(139, 69, 19, ${props => props.config.vintageVignette * 0.01}) 100%
    );
  mix-blend-mode: overlay;
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

  @media (max-width: 768px) {
    height: 6vh;
  }
`;

const TextBox = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 10vh;
  width: min(900px, 92vw);
  padding: 16px 20px;
  background: rgba(10, 10, 14, 0.85);
  border: 5px solid #f5a2d3;
  color: #fff;
  border-radius: 8px;
  z-index: 10;
  box-shadow: 0 0 0 8px rgba(245, 162, 211, 0.25);

  @media (max-width: 768px) {
    width: min(95vw, 400px);
    padding: 12px 16px;
    bottom: 8vh;
    border-width: 3px;
    font-size: 14px;
  }
`;

const TextContent = styled.p`
  min-height: 4em;
  letter-spacing: 0.4px;
  line-height: 1.5;
  margin: 0 0 12px 0;
  font-size: clamp(16px, 2.4vw, 22px);
  white-space: pre-wrap;

  @media (max-width: 768px) {
    font-size: clamp(14px, 3.5vw, 18px);
    min-height: 3em;
    line-height: 1.4;
    margin: 0 0 8px 0;
  }
`;

const Controls = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  z-index: 15; /* Above all effects and text box */

  @media (max-width: 768px) {
    bottom: 15px;
    right: 15px;
    gap: 6px;
  }
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

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 12px;
  }

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
  autoStart = true,
  vcrEffects,
  windowed = false
}) => {
  // Default VCR effects config - set to "heavy" for dramatic retro feel
  const defaultEffects: VCREffectsConfig = {
    scanLinesEnabled: true,
    scanLinesOpacity: 8, // Heavy scan lines
    scanLinesSpeed: 2,
    noiseEnabled: true,
    noiseOpacity: 60, // Heavy noise/grain
    noiseSpeed: 3,
    chromaticEnabled: true,
    chromaticIntensity: 4, // Heavy chromatic aberration
    chromaticSpeed: 25,
    staticEnabled: true,
    staticOpacity: 6, // Heavy static
    staticMovement: 3,
    vintageEnabled: true,
    vintageWarmth: 8, // Heavy vintage warmth
    vintageVignette: 12, // Heavy vignette
  };
  
  const effectsConfig = vcrEffects || defaultEffects;
  const [currentScene, setCurrentScene] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showingA, setShowingA] = useState(true);
  const [muted, setMuted] = useState(false);
  
  const bgmRef = useRef<HTMLAudioElement>(null);
  const typeControllerRef = useRef<{ cancel: boolean }>({ cancel: false });

  // Simple image error handler
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    console.warn('🚨 Story Mode scene image failed to load:', img.src);
    img.src = '/images/backdrops/BLANK.png';
  }, []);

  // Image load success handler
  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    console.log('✅ Story Mode scene image loaded successfully:', img.src);
  }, []);

  // Preload images for smoother experience
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = scenes.map(scene => {
        return new Promise<void>((resolve) => {
          if (!scene.image) {
            resolve();
            return;
          }
          
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => {
            console.warn('Preload failed for:', scene.image);
            resolve(); // Don't block other images
          };
          img.src = scene.image;
        });
      });
      
      try {
        await Promise.allSettled(imagePromises);
        console.log('Story Mode image preloading completed');
      } catch (error) {
        console.warn('Some Story Mode images failed to preload:', error);
      }
    };

    if (scenes.length > 0) {
      preloadImages();
    }
  }, [scenes]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const typeText = useCallback(async (text: string, speed = 50) => {
    setIsTyping(true);
    typeControllerRef.current = { cancel: false };
    setDisplayText('');
    
    for (let i = 0; i < text.length; i++) {
      if (typeControllerRef.current.cancel) break;
      setDisplayText(text.substring(0, i + 1));
      await sleep(speed);
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

    // Try to enable audio on user interaction (helps with mobile)
    if (bgmRef.current && !muted && bgmRef.current.src && bgmRef.current.paused) {
      const playPromise = bgmRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Audio play failed, but don't interrupt the user experience
        });
      }
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
  }, [isTyping, scenes, currentScene, currentLine, stopTypingAndFill, onComplete, muted]);

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
        // Try to play audio when unmuting (helps with mobile)
        if (!newMuted && bgmRef.current.src) {
          const playPromise = bgmRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.warn('Audio play failed after unmuting:', error);
            });
          }
        }
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
      // For mobile, set up audio but don't auto-play unless user has interacted
      if (!muted) {
        const playPromise = bgmRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn('Audio autoplay was prevented:', error);
            // Audio autoplay was prevented, but don't show error to user
            // The mute/unmute button will work once user interacts
          });
        }
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
  
  // Debug logging
  console.log('🎬 Story Mode Debug:', {
    scenesLength: scenes.length,
    currentScene,
    currentSceneData,
    showingA,
    windowed,
    displayText
  });

  return (
    <CutsceneContainer windowed={windowed}>
      {/* Background layer with effects - separate from text */}
      <div style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0
      }}>
        {/* Background Images */}
        <SceneImage
          id="sceneA"
          src={showingA ? currentSceneData?.image || '' : scenes[Math.max(0, currentScene - 1)]?.image || ''}
          alt=""
          visible={showingA}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
        <SceneImage
          id="sceneB"
          src={!showingA ? currentSceneData?.image || '' : scenes[Math.min(scenes.length - 1, currentScene + 1)]?.image || ''}
          alt=""
          visible={!showingA}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />

        {/* VCR and Retro Effects - ONLY on background images */}
        <VintageFilter config={effectsConfig} />
        <VHSStatic config={effectsConfig} />
        <VCREffects config={effectsConfig} />
        <ChromaticEffect config={effectsConfig} />
      </div>

      {/* UI Layer - completely separate from effects */}
      <div style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 100,
        pointerEvents: 'none'
      }}>
        {/* Letterbox bars - only show in fullscreen mode */}
        {!windowed && <LetterboxTop />}
        {!windowed && <LetterboxBottom />}

        {/* Text box - adjust positioning for windowed mode */}
        <TextBox role="dialog" aria-live="polite" aria-atomic="true" style={{
          position: 'absolute',
          bottom: windowed ? '80px' : '10vh',
          left: '50%',
          transform: 'translateX(-50%)',
          width: windowed ? 'calc(100% - 40px)' : 'min(900px, 92vw)',
          maxWidth: windowed ? '800px' : 'min(900px, 92vw)',
          pointerEvents: 'auto',
          zIndex: 20
        }}>
          <TextContent>{displayText}</TextContent>
        </TextBox>

        {/* Controls positioned in bottom right - ensure visible in both modes */}
        <Controls style={{ 
          pointerEvents: 'auto',
          bottom: windowed ? '20px' : '20px',
          right: windowed ? '20px' : '20px',
          zIndex: 25,
          position: windowed ? 'absolute' : 'fixed'
        }}>
          <ControlButton onClick={next} aria-label="Next line (Enter)">
            Next ▶
          </ControlButton>
          <ControlButton onClick={toggleMute} aria-label="Toggle music (M)">
            {muted ? 'Unmute 🔊' : 'Mute 🔇'}
          </ControlButton>
        </Controls>
      </div>

      {/* Background music */}
      <audio ref={bgmRef} loop muted={muted} />
    </CutsceneContainer>
  );
};

export default CutscenePlayer;