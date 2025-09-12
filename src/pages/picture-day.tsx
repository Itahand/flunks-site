import React, { useState, useEffect } from 'react';
import { Button } from 'react95';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { getCurrentBuildMode, isFeatureEnabled } from '../utils/buildMode';

// Clique configurations with 90s colors
const CLIQUES = [
  { 
    id: 'preps', 
    name: 'The Preps', 
    primaryColor: '#7CB342', // More green color
    secondaryColor: '#8BC34A',
    accentColor: '#AED581',
    pattern: 'plaid'
  },
  { 
    id: 'jocks', 
    name: 'The Jocks', 
    primaryColor: '#FF6B6B', // Keep the red color
    secondaryColor: '#FF8E8E',
    accentColor: '#FFB3B3',
    pattern: 'letterman'
  },
  { 
    id: 'geeks', 
    name: 'The Geeks', 
    primaryColor: '#4ECDC4', // Keep the light color
    secondaryColor: '#7FDDD6',
    accentColor: '#B3F0ED',
    pattern: 'calculator'
  },
  { 
    id: 'freaks', 
    name: 'The Freaks', 
    primaryColor: '#BA68C8', // Pastel purple
    secondaryColor: '#CE93D8',
    accentColor: '#E1BEE7',
    pattern: 'grunge'
  }
];

const PictureDayContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-image: url('/images/backdrops/picture-day-bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  padding: 20px;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  
  /* Dimming overlay to make text readable */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(102, 126, 234, 0.7); /* Purple overlay with transparency */
    z-index: 1;
    pointer-events: none;
  }
  
  /* Ensure all content is above the overlay */
  > * {
    position: relative;
    z-index: 2;
  }
`;

const HomeButton = styled.button`
  background: #c0c0c0;
  border: 2px outset #c0c0c0;
  padding: 8px 16px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  color: black;
  border-radius: 4px;
  
  &:hover {
    background: #d0d0d0;
  }
  
  &:active {
    border: 2px inset #c0c0c0;
  }
`;

const BottomHomeButton = styled.button`
  background: #c0c0c0;
  border: 2px outset #c0c0c0;
  padding: 12px 24px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  color: black;
  border-radius: 4px;
  margin-top: 40px;
  position: relative;
  z-index: 2;
  
  &:hover {
    background: #d0d0d0;
  }
  
  &:active {
    border: 2px inset #c0c0c0;
  }
`;

const YearbookHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const MainTitle = styled.h1`
  font-size: 6rem;
  color: #FFD700;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
  font-family: 'Times New Roman', serif;
  font-weight: bold;
  margin: 0;
  transform: rotate(-2deg);
  background: linear-gradient(45deg, #FFD700, #FFA500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 4rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #FFFFFF;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  margin: 10px 0;
  font-style: italic;
`;

const CliqueGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  justify-items: center;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
    max-width: 400px;
  }
`;

const CliqueCard = styled.div<{ 
  primaryColor: string; 
  secondaryColor: string; 
  accentColor: string;
  cliqueid: string;
}>`
  background: ${props => `linear-gradient(145deg, ${props.primaryColor}, ${props.secondaryColor})`};
  border: 4px solid ${props => props.accentColor};
  border-radius: 15px;
  padding: 25px 20px;
  text-align: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  transform: rotate(${Math.random() * 4 - 2}deg);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    transform: scale(1.05) rotate(0deg);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    ${props => {
      switch (props.cliqueid) {
        case 'preps':
          return `
            background: repeating-linear-gradient(
              45deg,
              transparent,
              transparent 15px,
              rgba(255, 255, 255, 0.15) 15px,
              rgba(255, 255, 255, 0.15) 30px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 15px,
              rgba(255, 255, 255, 0.1) 15px,
              rgba(255, 255, 255, 0.1) 30px
            );
          `;
        case 'jocks':
          return `
            background: radial-gradient(
              circle at 25% 25%, rgba(255, 255, 255, 0.2) 2px, transparent 2px
            ),
            radial-gradient(
              circle at 75% 75%, rgba(255, 255, 255, 0.15) 3px, transparent 3px
            );
            background-size: 40px 40px, 60px 60px;
          `;
        case 'geeks':
          return `
            background: 
              linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.1) 25%, rgba(255, 255, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.1) 75%, rgba(255, 255, 255, 0.1) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.1) 25%, rgba(255, 255, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.1) 75%, rgba(255, 255, 255, 0.1) 76%, transparent 77%, transparent);
            background-size: 30px 30px;
          `;
        case 'freaks':
          return `
            background: 
              repeating-conic-gradient(
                from 0deg at 50% 50%,
                transparent 0deg 60deg,
                rgba(255, 255, 255, 0.1) 60deg 120deg
              );
            background-size: 50px 50px;
          `;
        default:
          return `
            background: repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255, 255, 255, 0.1) 10px,
              rgba(255, 255, 255, 0.1) 20px
            );
          `;
      }
    }}
    pointer-events: none;
  }
`;

const CliqueName = styled.h2<{ cliqueid: string }>`
  color: #FFFFFF;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  font-size: 1.8rem;
  margin-bottom: 15px;
  position: relative;
  z-index: 1;
  font-family: ${props => {
    switch (props.cliqueid) {
      case 'preps':
        return "'Georgia', 'Times New Roman', serif";
      case 'jocks':
        return "'Impact', 'Arial Black', sans-serif";
      case 'geeks':
        return "'Courier New', 'Monaco', monospace";
      case 'freaks':
        return "'Brush Script MT', cursive, sans-serif";
      default:
        return "'Comic Sans MS', cursive, sans-serif";
    }
  }};
  ${props => {
    switch (props.cliqueid) {
      case 'preps':
        return 'font-style: italic; letter-spacing: 1px;';
      case 'jocks':
        return 'text-transform: uppercase; font-weight: 900; letter-spacing: 2px;';
      case 'geeks':
        return 'font-weight: normal; letter-spacing: 0.5px;';
      case 'freaks':
        return 'transform: rotate(-1deg); font-size: 2rem;';
      default:
        return '';
    }
  }}
`;

const CliqueDescription = styled.p<{ cliqueid: string }>`
  color: #FFFFFF;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
  font-size: 1rem;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
  font-family: ${props => {
    switch (props.cliqueid) {
      case 'preps':
        return "'Georgia', 'Times New Roman', serif";
      case 'jocks':
        return "'Arial', 'Helvetica', sans-serif";
      case 'geeks':
        return "'Courier New', 'Monaco', monospace";
      case 'freaks':
        return "'Comic Sans MS', cursive, sans-serif";
      default:
        return "'Comic Sans MS', cursive, sans-serif";
    }
  }};
  ${props => {
    switch (props.cliqueid) {
      case 'preps':
        return 'font-style: italic; line-height: 1.4;';
      case 'jocks':
        return 'font-weight: bold; text-transform: uppercase; font-size: 0.9rem;';
      case 'geeks':
        return 'line-height: 1.3; font-size: 0.9rem;';
      case 'freaks':
        return 'transform: rotate(0.5deg); line-height: 1.5;';
      default:
        return '';
    }
  }}
`;

const VoteButton = styled(Button)<{ primaryColor: string }>`
  background: ${props => props.primaryColor} !important;
  color: white !important;
  font-weight: bold !important;
  font-size: 0.9rem !important;
  padding: 12px 8px !important;
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3) !important;
  width: 100% !important;
  max-width: 260px !important;
  margin: 10px auto 0 auto !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
  position: relative;
  z-index: 1;
  line-height: 1.2 !important;
  white-space: nowrap !important;
  
  &:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4) !important;
  }
`;

const DecorationStars = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  color: #FFD700;
  font-size: 1.5rem;
  z-index: 1;
`;

const RetroPattern = styled.div<{ pattern: string }>`
  position: absolute;
  bottom: 10px;
  left: 10px;
  width: 30px;
  height: 30px;
  opacity: 0.3;
  z-index: 1;
  
  ${props => props.pattern === 'letterman' && `
    background: repeating-linear-gradient(
      45deg,
      #FFFFFF,
      #FFFFFF 5px,
      transparent 5px,
      transparent 10px
    );
  `}
  
  ${props => props.pattern === 'calculator' && `
    background: #333;
    border-radius: 3px;
    &::after {
      content: '123';
      color: #0F0;
      font-size: 8px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  `}
  
  ${props => props.pattern === 'grunge' && `
    background: radial-gradient(circle, #000 20%, transparent 20%),
                radial-gradient(circle, #000 20%, transparent 20%);
    background-size: 6px 6px;
    background-position: 0 0, 3px 3px;
  `}
  
  ${props => props.pattern === 'plaid' && `
    background: repeating-linear-gradient(
      45deg,
      #FFF,
      #FFF 3px,
      transparent 3px,
      transparent 6px
    );
  `}
`;

const PictureDay: React.FC = () => {
  const router = useRouter();

  // Check if Picture Day is enabled in current build mode
  const isPictureDayEnabled = isFeatureEnabled('showPictureDay');
  
  // If not in build mode, redirect or show access denied
  useEffect(() => {
    if (!isPictureDayEnabled) {
      console.log('Picture Day is only available in build mode');
      router.push('/');
      return;
    }
  }, [isPictureDayEnabled, router]);

  const handleCliqueSelect = (cliqueId: string) => {
    router.push(`/picture-day/${cliqueId}`);
  };

  // Show loading or redirect if not in build mode
  if (!isPictureDayEnabled) {
    return (
      <PictureDayContainer>
        <div style={{ 
          textAlign: 'center', 
          color: 'white', 
          paddingTop: '200px',
          fontSize: '1.5rem'
        }}>
          🔒 Picture Day is currently only available in build mode...
        </div>
      </PictureDayContainer>
    );
  }

  return (
    <PictureDayContainer>
      {/* Main Title - Centered */}
      <YearbookHeader>
        <MainTitle className="picture-day-title">📸 Picture Day 📸</MainTitle>
      </YearbookHeader>
      
      <Subtitle>
        Vote for which Flunk you want to be the main characters in each clique!
      </Subtitle>
      
      <CliqueGrid>
        {CLIQUES.map((clique) => (
          <CliqueCard
            key={clique.id}
            className="clique-card pattern-stripes"
            primaryColor={clique.primaryColor}
            secondaryColor={clique.secondaryColor}
            accentColor={clique.accentColor}
            cliqueid={clique.id}
          >
            <DecorationStars className="sparkle-decoration">⭐✨</DecorationStars>
            <RetroPattern pattern={clique.pattern} />
            
            <div>
              <CliqueName cliqueid={clique.id}>{clique.name}</CliqueName>
              <CliqueDescription cliqueid={clique.id}>
                Click to vote for your favorite Flunk to be the main character for {clique.name}!
              </CliqueDescription>
            </div>
            
            <VoteButton 
              onClick={() => handleCliqueSelect(clique.id)}
              primaryColor={clique.primaryColor}
            >
              Vote Now
            </VoteButton>
          </CliqueCard>
        ))}
      </CliqueGrid>
      
      {/* Home Button - Centered at Bottom */}
      <BottomHomeButton onClick={() => router.push('/')}>
        homescreen
      </BottomHomeButton>
    </PictureDayContainer>
  );
};

export default PictureDay;
