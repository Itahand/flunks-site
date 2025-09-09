import React, { useState, useEffect } from 'react';
import { Window, WindowContent, Button } from 'react95';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { getCurrentBuildMode, isFeatureEnabled } from '../utils/buildMode';
import '../styles/picture-day.css';

// Clique configurations with 90s colors
const CLIQUES = [
  { 
    id: 'preps', 
    name: 'The Preps', 
    primaryColor: '#96CEB4', 
    secondaryColor: '#B4DCC4',
    accentColor: '#D1EAD5',
    pattern: 'plaid'
  },
  { 
    id: 'jocks', 
    name: 'The Jocks', 
    primaryColor: '#FF6B6B', 
    secondaryColor: '#FF8E8E',
    accentColor: '#FFB3B3',
    pattern: 'letterman'
  },
  { 
    id: 'geeks', 
    name: 'The Geeks', 
    primaryColor: '#4ECDC4', 
    secondaryColor: '#7FDDD6',
    accentColor: '#B3F0ED',
    pattern: 'calculator'
  },
  { 
    id: 'freaks', 
    name: 'The Freaks', 
    primaryColor: '#45B7D1', 
    secondaryColor: '#6CC7DD',
    accentColor: '#A3DCE9',
    pattern: 'grunge'
  }
];

const PictureDayContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-attachment: fixed;
  padding: 20px;
  font-family: 'Comic Sans MS', cursive, sans-serif;
`;

const YearbookHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const MainTitle = styled.h1`
  font-size: 3rem;
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
    font-size: 2rem;
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const CliqueCard = styled.div<{ primaryColor: string; secondaryColor: string; accentColor: string }>`
  background: ${props => `linear-gradient(145deg, ${props.primaryColor}, ${props.secondaryColor})`};
  border: 4px solid ${props => props.accentColor};
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  transform: rotate(${Math.random() * 4 - 2}deg);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
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
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(255, 255, 255, 0.1) 10px,
      rgba(255, 255, 255, 0.1) 20px
    );
    pointer-events: none;
  }
`;

const CliqueName = styled.h2`
  color: #FFFFFF;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  font-size: 1.8rem;
  margin-bottom: 15px;
  position: relative;
  z-index: 1;
`;

const CliqueDescription = styled.p`
  color: #FFFFFF;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
  font-size: 1rem;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
`;

const VoteButton = styled(Button)<{ primaryColor: string }>`
  background: ${props => props.primaryColor} !important;
  color: white !important;
  font-weight: bold !important;
  font-size: 1.1rem !important;
  padding: 10px 20px !important;
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3) !important;
  position: relative;
  z-index: 1;
  
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
  const [stats, setStats] = useState<any>(null);

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

  useEffect(() => {
    if (isPictureDayEnabled) {
      // Load voting stats
      fetchVotingStats();
      
      // Set up real-time updates every 5 seconds
      const interval = setInterval(fetchVotingStats, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isPictureDayEnabled]);

  const fetchVotingStats = async () => {
    try {
      const response = await fetch('/api/picture-day/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch voting stats:', error);
    }
  };

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
      <YearbookHeader>
        <MainTitle className="picture-day-title">📸 Picture Day 1995 📸</MainTitle>
        <Subtitle>Choose Your Clique's Champion!</Subtitle>
        <Subtitle>Vote for the face that will represent your crew in the yearbook!</Subtitle>
      </YearbookHeader>
      
      <Window style={{ maxWidth: '1400px', margin: '0 auto', background: 'rgba(255, 255, 255, 0.9)' }}>
        <WindowContent>
          <CliqueGrid>
            {CLIQUES.map((clique) => (
              <CliqueCard
                key={clique.id}
                className="clique-card pattern-stripes"
                primaryColor={clique.primaryColor}
                secondaryColor={clique.secondaryColor}
                accentColor={clique.accentColor}
              >
                <DecorationStars className="sparkle-decoration">⭐✨</DecorationStars>
                <RetroPattern pattern={clique.pattern} />
                
                <CliqueName>{clique.name}</CliqueName>
                <CliqueDescription>
                  Click to vote for your favorite Flunk to represent {clique.name} in the yearbook!
                </CliqueDescription>
                
                {stats && stats[clique.id] && (
                  <div style={{ color: 'white', marginBottom: '15px', fontSize: '0.9rem' }}>
                    Total Votes: {stats[clique.id].totalVotes || 0}
                  </div>
                )}
                
                <VoteButton 
                  onClick={() => handleCliqueSelect(clique.id)}
                  primaryColor={clique.primaryColor}
                >
                  Enter Voting Booth
                </VoteButton>
              </CliqueCard>
            ))}
          </CliqueGrid>
        </WindowContent>
      </Window>
    </PictureDayContainer>
  );
};

export default PictureDay;
