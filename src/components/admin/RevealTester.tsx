import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
  min-height: 100vh;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 10px;
  font-size: 36px;
  text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
`;

const Subtitle = styled.p`
  text-align: center;
  color: rgba(255,255,255,0.8);
  margin-bottom: 30px;
  font-size: 14px;
  font-style: italic;
`;

const Grid = styled.div<{ revealing?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
  
  ${props => props.revealing && `
    > *:first-child {
      animation: fadeOutLeft 2s ease-out;
    }
    > *:last-child {
      animation: glowIntense 2s ease-out;
    }
  `}
  
  @keyframes fadeOutLeft {
    0% { opacity: 1; transform: translateX(0); }
    50% { opacity: 0.3; transform: translateX(-20px); }
    100% { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes glowIntense {
    0% { filter: brightness(1); box-shadow: none; }
    50% { 
      filter: brightness(1.5); 
      box-shadow: 0 0 50px rgba(255, 215, 0, 0.8), 0 0 100px rgba(255, 215, 0, 0.4);
    }
    100% { filter: brightness(1); box-shadow: none; }
  }
`;

const Card = styled.div<{ revealing?: boolean }>`
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 25px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255,255,255,0.2);
  position: relative;
  overflow: hidden;
  
  ${props => props.revealing && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent);
      animation: shimmer 0.8s ease-in-out 3;
      z-index: 10;
    }
    
    @keyframes shimmer {
      0% { left: -100%; }
      100% { left: 100%; }
    }
  `}
`;

const TransformOverlay = styled.div<{ show: boolean; animStyle: AnimationStyle }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: ${props => props.show ? 'flex' : 'none'};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 20;
  border-radius: 12px;
  animation: ${props => props.show ? 'overlayFadeIn 0.5s ease-out' : 'none'};
  
  /* VHS Style - Scan lines and tracking issues */
  ${props => props.animStyle === 'vhs' && `
    background: 
      repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.15),
        rgba(0, 0, 0, 0.15) 1px,
        transparent 1px,
        transparent 2px
      ),
      radial-gradient(circle at center, 
        rgba(139, 69, 19, 0.95) 0%, 
        rgba(0, 0, 0, 0.95) 100%
      );
    animation: vhsGlitch 0.3s infinite, overlayFadeIn 0.5s ease-out;
    
    @keyframes vhsGlitch {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-3px); }
      40% { transform: translateX(3px); }
      60% { transform: translateX(-2px); }
      80% { transform: translateX(2px); }
    }
  `}
  
  /* Vintage Photo Style - Sepia grain */
  ${props => props.animStyle === 'vintage' && `
    background: 
      url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9"/></filter><rect width="200" height="200" filter="url(%23noise)" opacity="0.3"/></svg>'),
      radial-gradient(circle at center, 
        rgba(112, 66, 20, 0.95) 0%, 
        rgba(61, 35, 10, 0.95) 100%
      );
    filter: sepia(80%);
    animation: vintageFlicker 0.2s infinite, overlayFadeIn 0.5s ease-out;
    
    @keyframes vintageFlicker {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.85; }
    }
  `}
  
  /* Neon 80s Style - Synthwave colors */
  ${props => props.animStyle === 'neon' && `
    background: 
      linear-gradient(45deg, 
        rgba(255, 0, 255, 0.3) 0%,
        rgba(0, 255, 255, 0.3) 50%,
        rgba(255, 0, 255, 0.3) 100%
      ),
      radial-gradient(circle at center, 
        rgba(138, 43, 226, 0.95) 0%, 
        rgba(0, 0, 0, 0.95) 100%
      );
    box-shadow: 
      inset 0 0 50px rgba(255, 0, 255, 0.8),
      inset 0 0 100px rgba(0, 255, 255, 0.5);
    animation: neonPulse 0.8s ease-in-out infinite, overlayFadeIn 0.5s ease-out;
    
    @keyframes neonPulse {
      0%, 100% { filter: hue-rotate(0deg) brightness(1.2); }
      50% { filter: hue-rotate(180deg) brightness(1.5); }
    }
  `}
  
  /* Power Up Style - Energy burst */
  ${props => props.animStyle === 'powerup' && `
    background: 
      radial-gradient(circle at center, 
        rgba(255, 215, 0, 0.95) 0%,
        rgba(255, 140, 0, 0.9) 40%,
        rgba(138, 43, 226, 0.95) 100%
      );
    animation: powerBurst 0.5s ease-out infinite, overlayFadeIn 0.5s ease-out;
    
    @keyframes powerBurst {
      0% { transform: scale(1); filter: brightness(1); }
      50% { transform: scale(1.1); filter: brightness(2); }
      100% { transform: scale(1); filter: brightness(1); }
    }
  `}
  
  /* Morph Style - Liquid transformation */
  ${props => props.animStyle === 'morph' && `
    background: 
      radial-gradient(circle at center, 
        rgba(138, 43, 226, 0.95) 0%, 
        rgba(75, 0, 130, 0.9) 50%,
        rgba(0, 0, 0, 0.95) 100%
      );
    animation: liquidMorph 1s ease-in-out infinite, overlayFadeIn 0.5s ease-out;
    filter: blur(5px);
    
    @keyframes liquidMorph {
      0%, 100% { border-radius: 12px; }
      25% { border-radius: 50% 12px 50% 12px; }
      50% { border-radius: 12px 50% 12px 50%; }
      75% { border-radius: 50% 12px 12px 50%; }
    }
  `}
  
  /* Glitch Style - Digital corruption */
  ${props => props.animStyle === 'glitch' && `
    background: 
      radial-gradient(circle at center, 
        rgba(0, 255, 0, 0.95) 0%, 
        rgba(0, 128, 0, 0.9) 50%,
        rgba(0, 0, 0, 0.95) 100%
      );
    animation: digitalGlitch 0.1s infinite, overlayFadeIn 0.5s ease-out;
    
    @keyframes digitalGlitch {
      0% { transform: translate(0, 0); filter: hue-rotate(0deg); }
      20% { transform: translate(-5px, 5px); filter: hue-rotate(90deg); }
      40% { transform: translate(5px, -5px); filter: hue-rotate(180deg); }
      60% { transform: translate(-5px, -5px); filter: hue-rotate(270deg); }
      80% { transform: translate(5px, 5px); filter: hue-rotate(360deg); }
      100% { transform: translate(0, 0); filter: hue-rotate(0deg); }
    }
  `}
  
  /* Default/Simple Style */
  ${props => props.animStyle === 'simple' && `
    background: radial-gradient(circle at center, 
      rgba(138, 43, 226, 0.95) 0%, 
      rgba(75, 0, 130, 0.9) 50%,
      rgba(0, 0, 0, 0.95) 100%
    );
  `}
  
  &::before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
    animation: pulse 1.5s ease-in-out infinite;
  }
  
  @keyframes overlayFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(0.8); opacity: 0.5; }
    50% { transform: scale(1.2); opacity: 1; }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const CardTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  color: #FFD700;
`;

const NFTImage = styled.img<{ revealing?: boolean; isRevealed?: boolean }>`
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 12px;
  margin: 0 auto 20px;
  display: block;
  box-shadow: 0 10px 40px rgba(0,0,0,0.4);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  ${props => props.revealing && !props.isRevealed && `
    animation: fadeOutShrink 1s ease-out forwards;
  `}
  
  ${props => props.revealing && props.isRevealed && `
    animation: fadeInGrow 1s ease-out 1s forwards;
    opacity: 0;
  `}
  
  @keyframes fadeOutShrink {
    0% { 
      opacity: 1; 
      transform: scale(1) rotate(0deg);
      filter: brightness(1);
    }
    50% { 
      opacity: 0.5; 
      transform: scale(0.7) rotate(5deg);
      filter: brightness(1.5);
    }
    100% { 
      opacity: 0; 
      transform: scale(0.3) rotate(10deg);
      filter: brightness(2);
    }
  }
  
  @keyframes fadeInGrow {
    0% { 
      opacity: 0; 
      transform: scale(0.3) rotate(-10deg);
      filter: brightness(2) saturate(2);
    }
    50% { 
      opacity: 0.5; 
      transform: scale(1.2) rotate(-5deg);
      filter: brightness(1.5) saturate(1.5);
    }
    100% { 
      opacity: 1; 
      transform: scale(1) rotate(0deg);
      filter: brightness(1) saturate(1);
    }
  }
`;

const MetadataBox = styled.div`
  background: rgba(0,0,0,0.3);
  padding: 15px;
  border-radius: 8px;
  margin-top: 15px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  max-height: 400px;
  overflow-y: auto;
`;

const MetadataRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 5px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  
  strong {
    color: #FFD700;
    margin-right: 10px;
  }
  
  span {
    color: #fff;
    text-align: right;
    word-break: break-word;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  width: 100%;
  padding: 15px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 15px;
  
  ${props => {
    switch(props.variant) {
      case 'danger':
        return `
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
          color: white;
          &:hover { background: linear-gradient(135deg, #c0392b 0%, #e74c3c 100%); }
        `;
      case 'secondary':
        return `
          background: rgba(255,255,255,0.2);
          color: white;
          border: 2px solid rgba(255,255,255,0.4);
          &:hover { background: rgba(255,255,255,0.3); }
        `;
      default:
        return `
          background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
          color: white;
          &:hover { 
            background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
            transform: translateY(-2px);
          }
        `;
    }
  }}
`;

const PresetButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
`;

const PresetButton = styled.button`
  padding: 12px;
  border-radius: 8px;
  border: 2px solid rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.1);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255,255,255,0.2);
    border-color: rgba(255,255,255,0.5);
    transform: translateY(-2px);
  }
`;

const AnimationContainer = styled.div<{ revealing: boolean }>`
  position: relative;
  
  ${props => props.revealing && `
    animation: revealPulse 2s ease-in-out;
    
    &::before {
      content: '';
      position: absolute;
      top: -10px;
      left: -10px;
      right: -10px;
      bottom: -10px;
      background: radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, transparent 70%);
      border-radius: 12px;
      animation: glowPulse 1s ease-in-out infinite;
      z-index: -1;
    }
    
    &::after {
      content: '✨';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 100px;
      animation: sparkleExplode 2s ease-out;
      pointer-events: none;
    }
  `}
  
  @keyframes revealPulse {
    0% { transform: scale(1) rotate(0deg); filter: brightness(1); }
    10% { transform: scale(0.95) rotate(-3deg); filter: brightness(0.8); }
    20% { transform: scale(1.08) rotate(3deg); filter: brightness(1.3); }
    30% { transform: scale(0.92) rotate(-2deg); filter: brightness(0.9); }
    40% { transform: scale(1.05) rotate(2deg); filter: brightness(1.2); }
    50% { transform: scale(0.98) rotate(-1deg); filter: brightness(1.1); }
    60% { transform: scale(1.03) rotate(1deg); filter: brightness(1.15); }
    70% { transform: scale(0.97) rotate(-0.5deg); filter: brightness(1.05); }
    80% { transform: scale(1.02) rotate(0.5deg); filter: brightness(1.1); }
    90% { transform: scale(0.99) rotate(-0.2deg); filter: brightness(1.02); }
    100% { transform: scale(1) rotate(0deg); filter: brightness(1); }
  }
  
  @keyframes glowPulse {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
  }
  
  @keyframes sparkleExplode {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
    50% { opacity: 1; transform: translate(-50%, -50%) scale(2); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(3); }
  }
`;

const RevealOverlay = styled.div<{ show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(138, 43, 226, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%);
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeInPulse 0.4s ease-in-out, screenShake 0.6s ease-in-out;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300%;
    height: 300%;
    background: radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%);
    animation: explosionPulse 2s ease-out;
    transform: translate(-50%, -50%);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(255, 0, 255, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(0, 255, 255, 0.3) 0%, transparent 50%);
    animation: colorWave 1.5s ease-in-out infinite;
  }
  
  @keyframes fadeInPulse {
    0% { opacity: 0; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.05); }
    100% { opacity: 1; transform: scale(1); }
  }
  
  @keyframes screenShake {
    0%, 100% { transform: translate(0, 0); }
    10% { transform: translate(-10px, -10px); }
    20% { transform: translate(10px, 10px); }
    30% { transform: translate(-10px, 10px); }
    40% { transform: translate(10px, -10px); }
    50% { transform: translate(-5px, 5px); }
    60% { transform: translate(5px, -5px); }
    70% { transform: translate(-3px, 3px); }
    80% { transform: translate(3px, -3px); }
    90% { transform: translate(-1px, 1px); }
  }
  
  @keyframes explosionPulse {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
    50% { opacity: 0.8; }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
  }
  
  @keyframes colorWave {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
`;

const RevealContent = styled.div`
  text-align: center;
  animation: scaleInBounce 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  position: relative;
  z-index: 10;
  filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.8));
  
  @keyframes scaleInBounce {
    0% { 
      transform: scale(0.3) rotate(-180deg); 
      opacity: 0; 
    }
    50% {
      transform: scale(1.2) rotate(10deg);
      opacity: 1;
    }
    70% {
      transform: scale(0.9) rotate(-5deg);
    }
    85% {
      transform: scale(1.05) rotate(2deg);
    }
    100% { 
      transform: scale(1) rotate(0deg); 
      opacity: 1; 
    }
  }
`;

const SparkleEffect = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  
  &::before, &::after {
    content: '✨';
    position: absolute;
    font-size: 40px;
    animation: sparkleFloat 1.5s ease-in-out infinite;
  }
  
  &::before {
    top: 20%;
    left: 20%;
    animation-delay: 0s;
  }
  
  &::after {
    top: 70%;
    right: 20%;
    animation-delay: 0.5s;
  }
  
  @keyframes sparkleFloat {
    0%, 100% { transform: translateY(0px) scale(1); opacity: 0; }
    10% { opacity: 1; }
    50% { transform: translateY(-30px) scale(1.5); opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(-60px) scale(1); opacity: 0; }
  }
`;

const RevealText = styled.h2`
  font-size: 48px;
  color: #FFD700;
  margin-bottom: 20px;
  text-shadow: 
    0 0 10px rgba(255, 215, 0, 0.8),
    0 0 20px rgba(255, 215, 0, 0.6),
    0 0 30px rgba(255, 215, 0, 0.4);
  animation: textPulse 1s ease-in-out infinite;
  
  @keyframes textPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;

const UNREVEALED_IMAGE = 'https://storage.googleapis.com/flunks_public/images/1.png';
const REVEALED_IMAGE = 'https://storage.googleapis.com/flunks_public/images/testmedaddy.png';

interface Metadata {
  [key: string]: string;
}

const PRESETS = {
  simple: {
    name: 'Simple Reveal (Image Only)',
    unrevealed: {
      name: 'Paradise Motel',
      description: 'A mysterious placeholder NFT...',
      image: UNREVEALED_IMAGE,
      revealed: 'false',
      type: 'mystery',
      rarity: 'common'
    },
    revealed: {
      name: 'Paradise Motel',
      description: 'A mysterious placeholder NFT...',
      image: REVEALED_IMAGE,
      revealed: 'true',
      type: 'mystery',
      rarity: 'common'
    }
  },
  upgrade: {
    name: 'Rarity Upgrade',
    unrevealed: {
      name: 'Paradise Motel Key',
      description: 'A basic key...',
      image: UNREVEALED_IMAGE,
      revealed: 'false',
      type: 'key',
      rarity: 'common',
      power: '1'
    },
    revealed: {
      name: 'Paradise Motel Master Key',
      description: 'The legendary master key!',
      image: REVEALED_IMAGE,
      revealed: 'true',
      type: 'legendary_key',
      rarity: 'legendary',
      power: '10',
      special_ability: 'unlock_all_rooms',
      glow: 'golden'
    }
  },
  transform: {
    name: 'Complete Transformation',
    unrevealed: {
      name: 'Mystery Box',
      description: 'What could be inside?',
      image: UNREVEALED_IMAGE,
      revealed: 'false',
      type: 'mystery_box',
      rarity: 'unknown'
    },
    revealed: {
      name: 'Paradise Motel Legendary Patch',
      description: 'An exclusive legendary patch from the Paradise Motel!',
      image: REVEALED_IMAGE,
      revealed: 'true',
      type: 'patch',
      category: 'legendary',
      rarity: 'legendary',
      color: 'rainbow',
      special_edition: 'true',
      unlock_date: '2025-11-10',
      collector_rank: '5'
    }
  },
  achievement: {
    name: 'Achievement Unlock',
    unrevealed: {
      name: 'Locked Achievement',
      description: 'Complete objectives to unlock...',
      image: UNREVEALED_IMAGE,
      revealed: 'false',
      type: 'achievement',
      status: 'locked'
    },
    revealed: {
      name: 'Paradise Motel Champion',
      description: 'Awarded for mastering all Paradise Motel challenges!',
      image: REVEALED_IMAGE,
      revealed: 'true',
      type: 'achievement',
      status: 'unlocked',
      achievement: 'paradise_motel_master',
      completion_date: '2025-11-10',
      bonus_gum: '500',
      special_ability: 'motel_expert'
    }
  },
  retro90s: {
    name: '90s Retro VHS',
    unrevealed: {
      name: 'Mystery VHS Tape',
      description: 'Rewind and play...',
      image: UNREVEALED_IMAGE,
      revealed: 'false',
      type: 'tape',
      rarity: 'common',
      era: 'unknown'
    },
    revealed: {
      name: 'Flunks High: The Lost Episode',
      description: 'A legendary VHS recording from 1995! Features scan lines, tracking issues, and authentic VHS artifacts.',
      image: REVEALED_IMAGE,
      revealed: 'true',
      type: 'vhs_tape',
      rarity: 'legendary',
      era: '1995',
      format: 'VHS',
      quality: 'tracking_issues',
      aesthetic: 'scanlines',
      nostalgia_level: '9000',
      rewind: 'be_kind'
    }
  },
  vintage: {
    name: 'Vintage Photo',
    unrevealed: {
      name: 'Blank Polaroid',
      description: 'Waiting to develop...',
      image: UNREVEALED_IMAGE,
      revealed: 'false',
      type: 'photo',
      condition: 'undeveloped'
    },
    revealed: {
      name: 'Paradise Motel - Grand Opening 1962',
      description: 'A rare vintage photograph from the motel\'s grand opening. Authentic sepia tone, aged paper texture, slight coffee stain on corner.',
      image: REVEALED_IMAGE,
      revealed: 'true',
      type: 'vintage_photo',
      year: '1962',
      condition: 'aged',
      tone: 'sepia',
      rarity: 'antique',
      texture: 'faded_paper',
      historical_value: 'high',
      coffee_stain: 'authentic'
    }
  },
  neon80s: {
    name: 'Neon 80s Synthwave',
    unrevealed: {
      name: 'Encrypted Floppy Disk',
      description: 'Insert disk to boot...',
      image: UNREVEALED_IMAGE,
      revealed: 'false',
      type: 'disk',
      format: '3.5_floppy'
    },
    revealed: {
      name: 'Paradise Motel: Neon Nights',
      description: 'A synthwave masterpiece! Glowing pink and cyan neon lights, palm trees silhouette, retro sunset grid.',
      image: REVEALED_IMAGE,
      revealed: 'true',
      type: 'neon_art',
      aesthetic: 'synthwave',
      colors: 'pink_cyan_purple',
      vibe: 'outrun',
      decade: '1980s',
      glow: 'neon',
      soundtrack: 'synthpop',
      coolness: 'radical'
    }
  },
  basic1: {
    name: 'Basic - Subtle Upgrade',
    unrevealed: {
      name: 'Standard Access Pass',
      description: 'Basic tier access',
      image: UNREVEALED_IMAGE,
      revealed: 'false',
      type: 'pass',
      tier: 'standard'
    },
    revealed: {
      name: 'Standard Access Pass',
      description: 'Basic tier access - verified',
      image: REVEALED_IMAGE,
      revealed: 'true',
      type: 'pass',
      tier: 'standard',
      status: 'verified'
    }
  },
  basic2: {
    name: 'Basic - Color Variant',
    unrevealed: {
      name: 'Room Key',
      description: 'A simple room key',
      image: UNREVEALED_IMAGE,
      revealed: 'false',
      type: 'key',
      color: 'silver'
    },
    revealed: {
      name: 'Room Key',
      description: 'A simple room key',
      image: REVEALED_IMAGE,
      revealed: 'true',
      type: 'key',
      color: 'gold'
    }
  }
};

type AnimationStyle = 'simple' | 'vhs' | 'vintage' | 'neon' | 'powerup' | 'morph' | 'glitch';

export const RevealTester: React.FC = () => {
  const [unrevealedMetadata, setUnrevealedMetadata] = useState<Metadata>(PRESETS.simple.unrevealed);
  const [revealedMetadata, setRevealedMetadata] = useState<Metadata>(PRESETS.simple.revealed);
  const [revealing, setRevealing] = useState(false);
  const [showCardOverlay, setShowCardOverlay] = useState(false);
  const [animationStyle, setAnimationStyle] = useState<AnimationStyle>('simple');

  const loadPreset = (presetKey: keyof typeof PRESETS) => {
    const preset = PRESETS[presetKey];
    setUnrevealedMetadata(preset.unrevealed);
    setRevealedMetadata(preset.revealed);
    
    // Map presets to animation styles
    const styleMap: Record<string, AnimationStyle> = {
      'simple': 'simple',
      'retro90s': 'vhs',
      'vintage': 'vintage',
      'neon80s': 'neon',
      'upgrade': 'powerup',
      'transform': 'morph',
      'achievement': 'glitch',
      'basic1': 'simple',
      'basic2': 'simple'
    };
    
    setAnimationStyle(styleMap[presetKey] || 'simple');
  };

  const simulateReveal = () => {
    setRevealing(true);
    
    // Show in-card overlay immediately
    setShowCardOverlay(true);
    
    // Hide card overlay and stop animation after 2.5 seconds
    setTimeout(() => {
      setShowCardOverlay(false);
      setRevealing(false);
    }, 2500);
  };

  const renderMetadata = (metadata: Metadata) => {
    return Object.entries(metadata).map(([key, value]) => (
      <MetadataRow key={key}>
        <strong>{key}:</strong>
        <span>{value}</span>
      </MetadataRow>
    ));
  };

  return (
    <Container>
      <Title>🎭 NFT Reveal Tester</Title>
      <Subtitle>⚠️ flunks-build ONLY - Preview different reveal scenarios</Subtitle>

      <PresetButtons>
        <PresetButton onClick={() => loadPreset('simple')}>
          🎨 Simple Reveal
        </PresetButton>
        <PresetButton onClick={() => loadPreset('upgrade')}>
          ⬆️ Rarity Upgrade
        </PresetButton>
        <PresetButton onClick={() => loadPreset('transform')}>
          ✨ Full Transform
        </PresetButton>
        <PresetButton onClick={() => loadPreset('achievement')}>
          🏆 Achievement
        </PresetButton>
        <PresetButton onClick={() => loadPreset('retro90s')}>
          📼 90s VHS
        </PresetButton>
        <PresetButton onClick={() => loadPreset('vintage')}>
          📷 Vintage Photo
        </PresetButton>
        <PresetButton onClick={() => loadPreset('neon80s')}>
          🌴 80s Neon
        </PresetButton>
        <PresetButton onClick={() => loadPreset('basic1')}>
          ⚪ Basic Upgrade
        </PresetButton>
        <PresetButton onClick={() => loadPreset('basic2')}>
          🔑 Color Swap
        </PresetButton>
      </PresetButtons>

      <Grid revealing={revealing}>
        {/* BEFORE (Unrevealed) */}
        <Card revealing={revealing}>
          <CardTitle>BEFORE (Unrevealed)</CardTitle>
          <AnimationContainer revealing={false}>
            <NFTImage 
              src={unrevealedMetadata.image} 
              alt="Unrevealed" 
              revealing={revealing}
              isRevealed={false}
            />
          </AnimationContainer>
          <MetadataBox>
            {renderMetadata(unrevealedMetadata)}
          </MetadataBox>
          
          {/* In-card transformation overlay */}
          <TransformOverlay show={showCardOverlay} animStyle={animationStyle}>
            <div style={{ 
              fontSize: '80px', 
              animation: 'spin 1s linear infinite',
              marginBottom: '20px',
              position: 'relative',
              zIndex: 10
            }}>
              ✨
            </div>
            <div style={{ 
              color: '#FFD700', 
              fontSize: '24px', 
              fontWeight: 'bold',
              textShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
              position: 'relative',
              zIndex: 10
            }}>
              {animationStyle === 'vhs' && '📼 VHS TRACKING...'}
              {animationStyle === 'vintage' && '📷 DEVELOPING...'}
              {animationStyle === 'neon' && '🌴 NEON GLOW...'}
              {animationStyle === 'powerup' && '⚡ POWERING UP...'}
              {animationStyle === 'morph' && '🌀 MORPHING...'}
              {animationStyle === 'glitch' && '👾 GLITCHING...'}
              {animationStyle === 'simple' && 'TRANSFORMING...'}
            </div>
          </TransformOverlay>
        </Card>

        {/* AFTER (Revealed) */}
        <Card revealing={revealing}>
          <CardTitle>AFTER (Revealed)</CardTitle>
          <AnimationContainer revealing={revealing}>
            <NFTImage 
              src={revealedMetadata.image} 
              alt="Revealed" 
              revealing={revealing}
              isRevealed={true}
            />
          </AnimationContainer>
          <MetadataBox>
            {renderMetadata(revealedMetadata)}
          </MetadataBox>
          
          {/* In-card transformation overlay */}
          <TransformOverlay show={showCardOverlay} animStyle={animationStyle}>
            <div style={{ 
              fontSize: '80px', 
              animation: 'spin 1s linear infinite',
              marginBottom: '20px',
              position: 'relative',
              zIndex: 10
            }}>
              🎉
            </div>
            <div style={{ 
              color: '#FFD700', 
              fontSize: '24px', 
              fontWeight: 'bold',
              textShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
              position: 'relative',
              zIndex: 10
            }}>
              {animationStyle === 'vhs' && '📼 VHS REVEALED!'}
              {animationStyle === 'vintage' && '📷 PHOTO READY!'}
              {animationStyle === 'neon' && '🌴 NEON ACTIVE!'}
              {animationStyle === 'powerup' && '⚡ POWERED UP!'}
              {animationStyle === 'morph' && '🌀 TRANSFORMED!'}
              {animationStyle === 'glitch' && '👾 UNLOCKED!'}
              {animationStyle === 'simple' && 'REVEALING...'}
            </div>
          </TransformOverlay>
        </Card>
      </Grid>

      <Button onClick={simulateReveal}>
        ✨ Simulate Reveal Animation
      </Button>

      <Card style={{ marginTop: '30px' }}>
        <CardTitle>📝 How This Would Work</CardTitle>
        <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
          <p><strong>1. Mint unrevealed NFT</strong> with placeholder image (left)</p>
          <p><strong>2. User clicks reveal button</strong> on your website</p>
          <p><strong>3. Transaction updates metadata</strong> via contract's reveal() function</p>
          <p><strong>4. NFT transforms</strong> to revealed state (right)</p>
          <p><strong>5. Same NFT ID</strong> - just new image & traits!</p>
        </div>
      </Card>
    </Container>
  );
};

export default RevealTester;
