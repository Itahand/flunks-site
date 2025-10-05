import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const StoryContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100vw - 40px);
  max-width: 600px;
  max-height: calc(100vh - 40px);
  background: rgba(0, 0, 0, 0.95);
  border: 2px solid #FFD700;
  border-radius: 12px;
  padding: 20px;
  color: white;
  font-family: 'Georgia', serif;
  z-index: 9999;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    width: calc(100vw - 20px);
    padding: 15px;
    border-radius: 8px;
    max-height: calc(100vh - 20px);
  }
`;

const StoryText = styled.div`
  font-size: 16px;
  line-height: 1.6;
  text-align: center;
  margin-bottom: 20px;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 1.5;
    min-height: 100px;
    margin-bottom: 15px;
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }
`;

const StoryButton = styled.button`
  background: linear-gradient(145deg, #FFD700, #FFA500);
  color: #000;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;
  
  &:hover {
    background: linear-gradient(145deg, #FFA500, #FFD700);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(255, 215, 0, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 12px;
    min-width: 70px;
  }
`;

const ProgressIndicator = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  
  @media (max-width: 768px) {
    gap: 6px;
    order: -1;
    width: 100%;
    justify-content: center;
    margin-bottom: 10px;
  }
`;

const ProgressDot = styled.div<{ active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.active ? '#FFD700' : 'rgba(255, 215, 0, 0.3)'};
  transition: all 0.2s ease;
  
  @media (max-width: 768px) {
    width: 8px;
    height: 8px;
  }
`;

const MuteButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 4px 6px;
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 0, 0, 0.9);
  color: white;
  border: 2px solid rgba(255, 0, 0, 1);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.2s ease;
  min-width: 60px;
  position: relative;
  z-index: 10000;
  touch-action: manipulation;
  
  &:hover {
    background: rgba(255, 0, 0, 1);
    transform: scale(1.05);
  }
  
  &:active {
    background: rgba(200, 0, 0, 1);
    transform: scale(0.98);
  }
  
  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 14px;
    min-width: 70px;
  }
`;

const TopCloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 0, 0, 0.9);
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  transition: all 0.2s ease;
  touch-action: manipulation;
  
  &:hover {
    background: rgba(255, 0, 0, 1);
    transform: scale(1.1);
  }
  
  &:active {
    background: rgba(200, 0, 0, 1);
    transform: scale(0.9);
  }
  
  @media (max-width: 768px) {
    top: 5px;
    right: 5px;
    width: 35px;
    height: 35px;
    font-size: 20px;
  }
`;

interface HomecomingStoryProps {
  onClose: () => void;
}

const HomecomingStory: React.FC<HomecomingStoryProps> = ({ onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize and play homecoming music
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/music/homecoming.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(err => {
        console.log('Audio autoplay prevented:', err);
      });
    }

    // Cleanup: stop music when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle mute toggle
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const storySlides = [
    "By Saturday morning, the gym was ready for a night to remember. Streamers hung from the rafters, disco balls cast dancing lights across the polished floor, and everything was perfect for homecoming.",
    
    "But by midday, the announcement came: the dance was off. No one gave a reason, just murmurs about a situation still unfolding. Nobody knew for sure what was happening — only that it wasn't good.",
    
    "The lights stayed on, the decorations hung in silence, and the dance floor never saw a single step. The mystery of what happened that day still echoes through these empty halls."
  ];

  const nextSlide = () => {
    if (currentSlide < storySlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 9998
        }}
        onClick={onClose}
      />
      
      <StoryContainer>
        <TopCloseButton 
          onClick={() => {
            console.log('Top close button clicked!');
            onClose();
          }}
        >
          ×
        </TopCloseButton>
        
        <StoryText>
          {storySlides[currentSlide]}
        </StoryText>
        
        <ControlsContainer>
          <StoryButton
            onClick={prevSlide}
            disabled={currentSlide === 0}
          >
            ← Back
          </StoryButton>
          
          <ProgressIndicator>
            {storySlides.map((_, index) => (
              <ProgressDot key={index} active={index === currentSlide} />
            ))}
          </ProgressIndicator>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <MuteButton onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}>
              {isMuted ? '🔇' : '🔊'}
            </MuteButton>
            
            {currentSlide < storySlides.length - 1 ? (
              <StoryButton onClick={nextSlide}>
                Next →
              </StoryButton>
            ) : (
              <CloseButton 
                onClick={() => {
                  console.log('Close button clicked!');
                  onClose();
                }}
              >
                Close
              </CloseButton>
            )}
          </div>
        </ControlsContainer>
      </StoryContainer>
    </>
  );
};

export default HomecomingStory;