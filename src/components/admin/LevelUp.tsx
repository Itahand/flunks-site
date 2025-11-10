import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useUnifiedWallet } from '../../contexts/UnifiedWalletContext';
import * as fcl from '@onflow/fcl';

// Retro 8-bit arcade animations
const pixelateIn = keyframes`
  0% {
    transform: scale(0.3) rotate(-180deg);
    filter: brightness(2) blur(10px);
    opacity: 0;
  }
  40% {
    transform: scale(1.2) rotate(10deg);
    filter: brightness(1.5) blur(3px);
    opacity: 1;
  }
  60% {
    transform: scale(1.1) rotate(-5deg);
    filter: brightness(1.2) blur(1px);
  }
  80% {
    transform: scale(1.05) rotate(2deg);
    filter: brightness(1.1) blur(0px);
  }
  100% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1) blur(0px);
    opacity: 1;
  }
`;

const arcadeBlink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;

const scanlines = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(10px); }
`;

const fullscreenReveal = keyframes`
  0% {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.3) rotate(-180deg);
    width: 50vw;
    max-width: 50vw;
    height: auto;
    z-index: 9999;
    filter: brightness(2) blur(10px);
    opacity: 0;
  }
  40% {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1) rotate(10deg);
    width: 50vw;
    max-width: 50vw;
    z-index: 9999;
    filter: brightness(1.5) blur(3px);
    opacity: 1;
  }
  70% {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1.05) rotate(-5deg);
    width: 50vw;
    max-width: 50vw;
    z-index: 9999;
    filter: brightness(1.2) blur(1px);
    opacity: 1;
  }
  85% {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.8) rotate(0deg);
    width: 40vw;
    max-width: 40vw;
    z-index: 9999;
    filter: brightness(1.1) blur(0px);
    opacity: 1;
  }
  100% {
    position: relative;
    top: auto;
    left: auto;
    transform: translate(0, 0) scale(1) rotate(0deg);
    width: 50%;
    max-width: 175px;
    z-index: 1;
    filter: brightness(1) blur(0px);
    opacity: 1;
  }
`;

const glowPulse = keyframes`
  0%, 100% { 
    text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff;
  }
  50% { 
    text-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px #00ffff;
  }
`;

// Main container with CRT monitor effect
const ArcadeContainer = styled.div`
  padding: 20px;
  background: 
    linear-gradient(rgba(0, 255, 0, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 0, 0.03) 1px, transparent 1px),
    #000000;
  background-size: 4px 4px;
  min-height: 100vh;
  height: 100%;
  position: relative;
  font-family: 'Press Start 2P', 'Courier New', monospace;
  overflow: auto;
  
  /* CRT scanline effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 255, 0, 0.05) 0px,
      transparent 1px,
      transparent 2px,
      rgba(0, 255, 0, 0.05) 3px
    );
    pointer-events: none;
    animation: ${scanlines} 10s linear infinite;
  }
  
  /* CRT screen curve */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle, transparent 60%, rgba(0, 0, 0, 0.5) 100%);
    pointer-events: none;
  }
`;

const ArcadeFrame = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  border: 8px solid #ff0000;
  border-radius: 20px;
  background: #000000;
  box-shadow: 
    0 0 0 4px #ffff00,
    0 0 0 8px #00ff00,
    0 0 30px rgba(255, 0, 255, 0.5),
    inset 0 0 50px rgba(0, 255, 255, 0.1);
  padding: 20px;
  position: relative;
  z-index: 1;
`;

const ArcadeTitle = styled.h1`
  text-align: center;
  font-size: 36px;
  color: #ffff00;
  text-shadow: 
    3px 3px 0 #ff0000,
    6px 6px 0 #ff00ff,
    9px 9px 0 #00ffff;
  margin-bottom: 5px;
  letter-spacing: 4px;
  animation: ${arcadeBlink} 2s ease-in-out infinite;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Subtitle = styled.div`
  text-align: center;
  color: #00ff00;
  font-size: 10px;
  margin-bottom: 15px;
  animation: ${glowPulse} 3s ease-in-out infinite;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 40px;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 15px 30px;
  font-family: 'Press Start 2P', 'Courier New', monospace;
  font-size: 14px;
  background: ${props => props.active ? '#ff00ff' : '#000000'};
  color: ${props => props.active ? '#ffff00' : '#00ff00'};
  border: 4px solid ${props => props.active ? '#ffff00' : '#00ff00'};
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: ${props => props.active ? '2px 2px 0 #ff0000' : 'none'};
  box-shadow: ${props => props.active 
    ? '0 0 20px #ff00ff, inset 0 0 20px rgba(255, 255, 0, 0.3)' 
    : '0 0 10px #00ff00'};
  
  &:hover {
    background: #ff00ff;
    color: #ffff00;
    border-color: #ffff00;
    transform: scale(1.05);
    box-shadow: 0 0 30px #ff00ff;
  }
  
  @media (max-width: 768px) {
    padding: 10px 15px;
    font-size: 10px;
  }
`;

const KeyholeSection = styled.div`
  background: 
    radial-gradient(circle, #1a1a1a 0%, #000000 100%);
  border: 6px solid #00ffff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 
    0 0 30px rgba(0, 255, 255, 0.5),
    inset 0 0 50px rgba(255, 0, 255, 0.2);
`;

const KeyholeTitle = styled.h2`
  text-align: center;
  color: #ff00ff;
  font-size: 16px;
  margin-bottom: 10px;
  text-shadow: 2px 2px 0 #00ffff;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const KeyholeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const KeyholeCircle = styled.div<{ hasNFT: boolean; glowing?: boolean }>`
  width: 150px;
  height: 150px;
  margin: 0 auto 20px;
  background: radial-gradient(circle, #1a1a1a 0%, #000000 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    inset 0 0 50px rgba(0, 0, 0, 0.9),
    0 10px 40px rgba(0, 0, 0, 0.8),
    ${props => props.hasNFT ? '0 0 50px #ffff00, 0 0 100px #ff00ff' : 'none'};
  cursor: ${props => props.hasNFT ? 'pointer' : 'default'};
  transition: all 0.3s ease;
  border: 6px solid ${props => props.hasNFT ? '#ffff00' : '#333'};
  position: relative;
  
  ${props => props.glowing && css`
    animation: ${glowPulse} 1.5s ease-in-out infinite;
    border-color: #ff00ff;
  `}
  
  &:hover {
    ${props => props.hasNFT && css`
      transform: scale(1.1);
      box-shadow: 
        inset 0 0 50px rgba(255, 255, 0, 0.3),
        0 0 60px #ffff00,
        0 0 120px #ff00ff;
    `}
  }
`;

const NFTSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 10px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const NFTOption = styled.div<{ selected: boolean }>`
  padding: 8px;
  border: 3px solid ${props => props.selected ? '#ffff00' : '#00ff00'};
  background: ${props => props.selected ? 'rgba(255, 255, 0, 0.2)' : 'rgba(0, 255, 0, 0.1)'};
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  box-shadow: ${props => props.selected 
    ? '0 0 20px #ffff00, inset 0 0 20px rgba(255, 255, 0, 0.2)' 
    : '0 0 10px #00ff00'};
  
  &:hover {
    transform: scale(1.05);
    border-color: ${props => props.selected ? '#ffff00' : '#ff00ff'};
    box-shadow: 0 0 30px ${props => props.selected ? '#ffff00' : '#ff00ff'};
  }
  
  img {
    width: 45%;
    max-width: 120px;
    margin: 0 auto;
    display: block;
    border: 2px solid #00ffff;
    border-radius: 6px;
    margin-bottom: 5px;
    image-rendering: pixelated;
  }
`;

const NFTLabel = styled.div`
  font-size: 8px;
  color: #00ff00;
  text-align: center;
  margin-top: 3px;
  line-height: 1.3;
`;

const NFTCard = styled.div`
  background: rgba(0, 0, 0, 0.8);
  border: 6px solid #ff00ff;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 
    0 0 30px rgba(255, 0, 255, 0.5),
    inset 0 0 30px rgba(0, 255, 255, 0.1);
`;

const NFTImage = styled.img<{ revealing?: boolean; isRevealed?: boolean }>`
  width: 50%;
  max-width: 175px;
  height: auto;
  border: 4px solid #00ffff;
  border-radius: 12px;
  margin: 0 auto 15px;
  display: block;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
  image-rendering: pixelated;
  position: relative;
  
  ${props => props.revealing && props.isRevealed && css`
    animation: ${fullscreenReveal} 5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    opacity: 0;
  `}
`;

const ArcadeButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  width: 100%;
  padding: 12px;
  font-family: 'Press Start 2P', 'Courier New', monospace;
  font-size: 10px;
  background: ${props => props.variant === 'secondary' ? '#000000' : '#ff0000'};
  color: #ffff00;
  border: 3px solid #ffff00;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  text-shadow: 2px 2px 0 #ff00ff;
  box-shadow: 0 0 20px ${props => props.variant === 'secondary' ? '#00ff00' : '#ff0000'};
  
  &:hover {
    background: ${props => props.variant === 'secondary' ? '#00ff00' : '#ff00ff'};
    transform: scale(1.05);
    box-shadow: 0 0 40px ${props => props.variant === 'secondary' ? '#00ff00' : '#ff00ff'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    font-size: 8px;
    padding: 10px;
  }
`;

const MetadataBox = styled.div`
  background: rgba(0, 0, 0, 0.6);
  border: 3px solid #00ff00;
  border-radius: 10px;
  padding: 10px;
  margin-top: 10px;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
`;

const MetadataRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px solid rgba(0, 255, 0, 0.3);
  font-size: 9px;
  color: #00ff00;
  
  &:last-child {
    border-bottom: none;
  }
  
  strong {
    color: #00ffff;
  }
`;

const InsertCoin = styled.div`
  text-align: center;
  color: #ffff00;
  font-size: 14px;
  margin: 15px 0;
  animation: ${arcadeBlink} 1s ease-in-out infinite;
  text-shadow: 2px 2px 0 #ff0000;
`;

// Mock NFT data (replace with actual contract data)
const MOCK_NFTS = [
  {
    id: '1',
    name: 'Paradise Key',
    image: 'https://storage.googleapis.com/flunks_public/images/1.png',
    upgradedImage: 'https://storage.googleapis.com/flunks_public/images/testmedaddy.png',
    rarity: 'Common',
    level: 1
  },
  {
    id: '2',
    name: 'Flunks Genesis',
    image: 'https://storage.googleapis.com/flunks_public/images/testmedaddy.png',
    upgradedImage: 'https://storage.googleapis.com/flunks_public/images/1.png',
    rarity: 'Rare',
    level: 2
  },
  {
    id: '3',
    name: 'Mystery Pin',
    image: 'https://storage.googleapis.com/flunks_public/images/1.png',
    upgradedImage: 'https://storage.googleapis.com/flunks_public/images/testmedaddy.png',
    rarity: 'Epic',
    level: 5
  },
  {
    id: '4',
    name: 'Legend Badge',
    image: 'https://storage.googleapis.com/flunks_public/images/testmedaddy.png',
    upgradedImage: 'https://storage.googleapis.com/flunks_public/images/1.png',
    rarity: 'Legendary',
    level: 10
  }
];

const LevelUp: React.FC = () => {
  const { address } = useUnifiedWallet();
  const [selectedNFT, setSelectedNFT] = useState<typeof MOCK_NFTS[0] | null>(null);
  const [revealing, setRevealing] = useState(false);
  const [imageRevealed, setImageRevealed] = useState(false);
  const [revealSound] = useState('/sounds/reveal.mp3');
  const [upgradedNFT, setUpgradedNFT] = useState<typeof MOCK_NFTS[0] | null>(null);

  const handleSelectNFT = (nft: typeof MOCK_NFTS[0]) => {
    setSelectedNFT(nft);
    setRevealing(false);
    setImageRevealed(false);
    setUpgradedNFT(null);
  };

  const handleLevelUp = () => {
    if (!selectedNFT) return;
    
    // Calculate upgraded NFT immediately with new image
    const upgraded = {
      ...selectedNFT,
      image: selectedNFT.upgradedImage || selectedNFT.image,
      level: selectedNFT.level + 1,
      rarity: selectedNFT.level >= 5 ? 'Legendary' : selectedNFT.rarity
    };
    setUpgradedNFT(upgraded);
    
    setRevealing(true);
    setImageRevealed(false);

    // Play arcade sound if available
    if (revealSound) {
      const audio = new Audio(revealSound);
      audio.volume = 0.5;
      audio.play().catch(err => console.log('Audio play failed:', err));
      
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, 10000);
    }

    // Trigger key-style reveal at 5 seconds
    setTimeout(() => {
      setImageRevealed(true);
    }, 5000);

    // Complete animation at 10 seconds
    setTimeout(() => {
      setRevealing(false);
      setSelectedNFT(upgraded);
      setUpgradedNFT(null);
    }, 10000);
  };

  return (
    <ArcadeContainer>
      <ArcadeFrame>
        <ArcadeTitle>⚡ LEVEL UP ⚡</ArcadeTitle>
        <Subtitle>◆ UPGRADE YOUR NFTS ◆ ARCADE EDITION ◆</Subtitle>

        <InsertCoin>★ INSERT COIN TO CONTINUE ★</InsertCoin>

        <KeyholeSection>
          <KeyholeTitle>🔑 SELECT NFT TO UPGRADE 🔑</KeyholeTitle>

          {!selectedNFT ? (
            <NFTSelector>
              {MOCK_NFTS.map((nft) => (
                <NFTOption
                  key={nft.id}
                  selected={false}
                  onClick={() => handleSelectNFT(nft)}
                >
                  <img src={nft.image} alt={nft.name} />
                  <NFTLabel>
                    <strong>{nft.name}</strong>
                    <br />
                    LVL {nft.level} • {nft.rarity}
                  </NFTLabel>
                </NFTOption>
              ))}
            </NFTSelector>
          ) : (
            <KeyholeGrid>
              {/* Left: Keyhole */}
              <div>
                <KeyholeCircle hasNFT={true} glowing={revealing}>
                  <svg width="60" height="90" viewBox="0 0 100 150">
                    <circle 
                      cx="50" 
                      cy="40" 
                      r="35" 
                      fill="#ffff00" 
                      stroke="#ff00ff" 
                      strokeWidth="4"
                    />
                    <rect 
                      x="35" 
                      y="60" 
                      width="30" 
                      height="60" 
                      rx="5" 
                      fill="#ffff00" 
                      stroke="#ff00ff" 
                      strokeWidth="4"
                    />
                  </svg>
                </KeyholeCircle>

                <ArcadeButton onClick={handleLevelUp} disabled={revealing}>
                  {revealing ? '⚡ LEVELING UP... ⚡' : '⬆️ LEVEL UP! ⬆️'}
                </ArcadeButton>
                
                <ArcadeButton 
                  variant="secondary"
                  onClick={() => setSelectedNFT(null)}
                >
                  ← BACK TO SELECT
                </ArcadeButton>
              </div>

              {/* Right: NFT Card */}
              <NFTCard>
                <NFTImage 
                  src={(revealing && upgradedNFT) ? upgradedNFT.image : selectedNFT.image}
                  alt={(revealing && upgradedNFT) ? upgradedNFT.name : selectedNFT.name}
                  revealing={revealing}
                  isRevealed={imageRevealed}
                />
                <MetadataBox>
                  <MetadataRow>
                    <strong>NAME:</strong>
                    <span>{selectedNFT.name}</span>
                  </MetadataRow>
                  <MetadataRow>
                    <strong>LEVEL:</strong>
                    <span>⚡ {selectedNFT.level}</span>
                  </MetadataRow>
                  <MetadataRow>
                    <strong>RARITY:</strong>
                    <span>{selectedNFT.rarity}</span>
                  </MetadataRow>
                  <MetadataRow>
                    <strong>STATUS:</strong>
                    <span>{revealing ? 'UPGRADING...' : 'READY'}</span>
                  </MetadataRow>
                </MetadataBox>
              </NFTCard>
            </KeyholeGrid>
          )}
        </KeyholeSection>

        <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '8px', color: '#00ff00' }}>
          <p>★ CONNECTED: {address ? address.slice(0, 8) + '...' + address.slice(-6) : 'NOT CONNECTED'} ★</p>
          <p style={{ marginTop: '5px', color: '#ffff00' }}>
            ◆ LOCALHOST + FLUNKS-BUILD ONLY ◆
          </p>
        </div>
      </ArcadeFrame>
    </ArcadeContainer>
  );
};

export default LevelUp;
