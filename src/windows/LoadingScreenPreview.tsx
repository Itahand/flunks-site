import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import DraggableResizeableWindow from 'components/DraggableResizeableWindow';
import { useWindowsContext } from 'contexts/WindowsContext';
import { WINDOW_IDS } from 'fixed';

// VHS Static Effect
const staticNoise = keyframes`
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
`;

const scanLines = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
`;

// Neon Grid Effect
const neonPulse = keyframes`
  0%, 100% { 
    text-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 15px #ff00ff;
    opacity: 1;
  }
  50% { 
    text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff;
    opacity: 0.8;
  }
`;

const gridMove = keyframes`
  0% { background-position: 0 0, 0 0; }
  100% { background-position: 40px 40px, -40px 40px; }
`;

// Terminal Effect
const typing = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const blink = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

// Cassette Effect
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Progress Bar Effect
const progressFill = keyframes`
  0% { width: 0%; }
  100% { width: 100%; }
`;

// Matrix Rain Effect
const matrixRain = keyframes`
  0% { transform: translateY(-100vh); }
  100% { transform: translateY(100vh); }
`;

// Dial-up Modem Effect
const dialupBars = keyframes`
  0%, 20% { height: 10%; }
  40% { height: 60%; }
  60% { height: 30%; }
  80% { height: 80%; }
  100% { height: 45%; }
`;

// Floppy Disk Effect
const floppyInsert = keyframes`
  0% { transform: translateX(-100px) rotate(-5deg); }
  50% { transform: translateX(0) rotate(0deg); }
  100% { transform: translateX(0) rotate(0deg); }
`;

// DOS Boot Effect
const dosScroll = keyframes`
  0% { transform: translateY(100%); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-20px); opacity: 0.7; }
`;

// Windows 95 Progress Effect
const win95Progress = keyframes`
  0% { width: 0%; background-position: 0% 0%; }
  25% { width: 30%; background-position: 25% 0%; }
  50% { width: 60%; background-position: 50% 0%; }
  75% { width: 85%; background-position: 75% 0%; }
  100% { width: 100%; background-position: 100% 0%; }
`;

// Synthwave Grid
const synthwaveGrid = keyframes`
  0% { transform: perspective(500px) rotateX(60deg) translateZ(0px); }
  100% { transform: perspective(500px) rotateX(60deg) translateZ(-200px); }
`;

// Synthwave Grid Variations
const synthwaveGridFast = keyframes`
  0% { transform: perspective(800px) rotateX(65deg) translateZ(0px); }
  100% { transform: perspective(800px) rotateX(65deg) translateZ(-300px); }
`;

const synthwaveGridSlow = keyframes`
  0% { transform: perspective(400px) rotateX(55deg) translateZ(0px); }
  100% { transform: perspective(400px) rotateX(55deg) translateZ(-150px); }
`;

const synthwaveGridTilted = keyframes`
  0% { transform: perspective(600px) rotateX(70deg) rotateY(-5deg) translateZ(0px); }
  100% { transform: perspective(600px) rotateX(70deg) rotateY(-5deg) translateZ(-250px); }
`;

// MyPlace Color Pulses
const myplacePulse = keyframes`
  0% { 
    background: linear-gradient(180deg, rgba(120, 119, 198, 0.8) 0%, #1a1a2e 30%, #16213e 70%, #000000 100%);
  }
  33% {
    background: linear-gradient(180deg, rgba(255, 119, 198, 0.8) 0%, #1a1a2e 30%, #16213e 70%, #000000 100%);
  }
  66% {
    background: linear-gradient(180deg, rgba(120, 200, 255, 0.8) 0%, #1a1a2e 30%, #16213e 70%, #000000 100%);
  }
  100% { 
    background: linear-gradient(180deg, rgba(120, 119, 198, 0.8) 0%, #1a1a2e 30%, #16213e 70%, #000000 100%);
  }
`;

// Horizon Glow
const horizonGlow = keyframes`
  0% { 
    box-shadow: 0 -100px 200px rgba(120, 119, 198, 0.3);
    border-color: rgba(120, 119, 198, 0.6);
  }
  33% {
    box-shadow: 0 -100px 200px rgba(255, 119, 198, 0.3);
    border-color: rgba(255, 119, 198, 0.6);
  }
  66% {
    box-shadow: 0 -100px 200px rgba(120, 200, 255, 0.3);
    border-color: rgba(120, 200, 255, 0.6);
  }
  100% { 
    box-shadow: 0 -100px 200px rgba(120, 119, 198, 0.3);
    border-color: rgba(120, 119, 198, 0.6);
  }
`;

// Star Field Animations
const starsTwinkle = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
`;

const starsMove = keyframes`
  0% { transform: translateY(0px) translateX(0px); }
  25% { transform: translateY(-20px) translateX(-10px); }
  50% { transform: translateY(-40px) translateX(5px); }
  75% { transform: translateY(-20px) translateX(10px); }
  100% { transform: translateY(0px) translateX(0px); }
`;

const starsMoveFast = keyframes`
  0% { transform: translateY(0px) translateX(0px); }
  25% { transform: translateY(-50px) translateX(-25px); }
  50% { transform: translateY(-100px) translateX(15px); }
  75% { transform: translateY(-50px) translateX(25px); }
  100% { transform: translateY(0px) translateX(0px); }
`;

const starsMoveSlow = keyframes`
  0% { transform: translateY(0px) translateX(0px); }
  25% { transform: translateY(-10px) translateX(-5px); }
  50% { transform: translateY(-20px) translateX(2px); }
  75% { transform: translateY(-10px) translateX(5px); }
  100% { transform: translateY(0px) translateX(0px); }
`;

const starsMoveTilted = keyframes`
  0% { transform: translateY(0px) translateX(0px) rotateZ(0deg); }
  25% { transform: translateY(-30px) translateX(-15px) rotateZ(-2deg); }
  50% { transform: translateY(-60px) translateX(8px) rotateZ(2deg); }
  75% { transform: translateY(-30px) translateX(15px) rotateZ(-1deg); }
  100% { transform: translateY(0px) translateX(0px) rotateZ(0deg); }
`;

// Retro Equalizer
const equalizerBounce = keyframes`
  0%, 100% { transform: scaleY(0.3); }
  50% { transform: scaleY(1); }
`;

// Star Field Components
const StarField = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 2;
`;

const Star = styled.div<{ 
  size: number; 
  left: number; 
  top: number; 
  delay: number;
  color: string;
  animationType: 'normal' | 'fast' | 'slow' | 'tilted';
}>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.color};
  border-radius: 50%;
  left: ${props => props.left}%;
  top: ${props => props.top}%;
  animation: 
    ${starsTwinkle} ${props => 2 + Math.random() * 2}s ease-in-out infinite ${props => props.delay}s,
    ${props => {
      switch (props.animationType) {
        case 'fast': return starsMoveFast;
        case 'slow': return starsMoveSlow;
        case 'tilted': return starsMoveTilted;
        default: return starsMove;
      }
    }} ${props => 8 + Math.random() * 4}s ease-in-out infinite ${props => props.delay * 0.5}s;
  box-shadow: 0 0 ${props => props.size * 2}px ${props => props.color};
`;

const generateStars = (count: number, colors: string[], animationType: 'normal' | 'fast' | 'slow' | 'tilted') => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const size = Math.random() * 3 + 1;
    const left = Math.random() * 100;
    const top = Math.random() * 60; // Keep stars in upper portion
    const delay = Math.random() * 4;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    stars.push(
      <Star
        key={i}
        size={size}
        left={left}
        top={top}
        delay={delay}
        color={color}
        animationType={animationType}
      />
    );
  }
  return stars;
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: 'Press Start 2P', monospace;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  box-sizing: border-box;
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const LoadingPreview = styled.div`
  border: 2px solid #333;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: #000;
  height: 200px;
  min-height: 200px;
  
  &:hover {
    border-color: #ff00ff;
    box-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
  }
`;

const PreviewTitle = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  color: #00ffff;
  font-size: 8px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.8);
  padding: 4px 8px;
  border-radius: 4px;
`;

// VHS Static Style
const VHSContainer = styled.div`
  width: 100%;
  height: 100%;
  background: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(255, 255, 255, 0.03) 2px,
      rgba(255, 255, 255, 0.03) 4px
    ),
    radial-gradient(circle, #111 0%, #000 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 2px,
        rgba(255, 255, 255, 0.05) 2px,
        rgba(255, 255, 255, 0.05) 4px
      );
    animation: ${staticNoise} 0.1s infinite linear;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: 0;
    right: 0;
    height: 200%;
    background: linear-gradient(transparent 40%, rgba(255, 255, 255, 0.1) 50%, transparent 60%);
    animation: ${scanLines} 2s infinite linear;
  }
`;

const VHSText = styled.div`
  color: #ff00ff;
  font-size: 12px;
  text-align: center;
  z-index: 5;
  text-shadow: 2px 0 #ff0000, -2px 0 #00ffff;
`;

// Neon Grid Style
const NeonContainer = styled.div`
  width: 100%;
  height: 100%;
  background: 
    linear-gradient(45deg, transparent 48%, rgba(0, 255, 255, 0.1) 49%, rgba(0, 255, 255, 0.1) 51%, transparent 52%),
    linear-gradient(-45deg, transparent 48%, rgba(255, 0, 255, 0.1) 49%, rgba(255, 0, 255, 0.1) 51%, transparent 52%),
    radial-gradient(circle at center, #001122 0%, #000 70%);
  background-size: 40px 40px, 40px 40px, 100% 100%;
  animation: ${gridMove} 4s linear infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const NeonText = styled.div`
  color: #ff00ff;
  font-size: 14px;
  text-align: center;
  animation: ${neonPulse} 1.5s ease-in-out infinite;
`;

// Terminal Style
const TerminalContainer = styled.div`
  width: 100%;
  height: 100%;
  background: #001100;
  padding: 20px;
  box-sizing: border-box;
  color: #00ff00;
  font-size: 10px;
  line-height: 1.4;
`;

const TerminalLine = styled.div<{ delay?: number }>`
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid #00ff00;
  animation: 
    ${typing} 1s steps(40) ${props => (props.delay || 0) * 0.5}s both,
    ${blink} 0.75s step-end infinite;
`;

// Cassette Style
const CassetteContainer = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2a1810 0%, #1a1010 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ffaa44;
`;

const CassetteReel = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #ffaa44;
  border-radius: 50%;
  margin: 10px;
  position: relative;
  animation: ${spin} 2s linear infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    background: #ffaa44;
    border-radius: 50%;
  }
`;

const CassetteText = styled.div`
  font-size: 10px;
  text-align: center;
  margin-top: 10px;
`;

// Progress Bar Style
const ProgressContainer = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #000033 0%, #000066 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ffffff;
`;

const ProgressBar = styled.div`
  width: 80%;
  height: 20px;
  background: #333;
  border-radius: 10px;
  overflow: hidden;
  margin: 20px 0;
  position: relative;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #ff00ff, #00ffff);
  animation: ${progressFill} 3s ease-in-out infinite;
  border-radius: 10px;
`;

const ProgressText = styled.div`
  font-size: 12px;
  text-align: center;
`;

// Matrix Style
const MatrixContainer = styled.div`
  width: 100%;
  height: 100%;
  background: #000;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MatrixColumn = styled.div<{ delay: number }>`
  position: absolute;
  top: 0;
  width: 20px;
  height: 100%;
  color: #00ff00;
  font-family: monospace;
  font-size: 14px;
  animation: ${matrixRain} 3s linear infinite ${props => props.delay}s;
  opacity: 0.7;
`;

const MatrixText = styled.div`
  color: #00ff00;
  font-size: 16px;
  z-index: 10;
  text-align: center;
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border: 1px solid #00ff00;
`;

// Dial-up Modem Style
const DialupContainer = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #000080 0%, #000040 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ffff00;
`;

const DialupVisualizer = styled.div`
  display: flex;
  gap: 2px;
  margin: 20px 0;
`;

const DialupBar = styled.div<{ delay: number }>`
  width: 4px;
  background: #ffff00;
  animation: ${dialupBars} 1s ease-in-out infinite ${props => props.delay * 0.1}s;
`;

const DialupText = styled.div`
  font-size: 10px;
  text-align: center;
  margin: 5px 0;
`;

// Floppy Disk Style
const FloppyContainer = styled.div`
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, #2a2a2a 0%, #1a1a1a 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #00ffff;
`;

const FloppyDisk = styled.div`
  width: 60px;
  height: 60px;
  background: #000;
  border: 2px solid #888;
  border-radius: 4px;
  position: relative;
  animation: ${floppyInsert} 2s ease-in-out infinite;
  margin: 20px;
  
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
    height: 8px;
    background: #888;
    border-radius: 2px;
  }
  
  &::after {
    content: 'MyPlace';
    position: absolute;
    bottom: 4px;
    left: 4px;
    font-size: 4px;
    color: #fff;
  }
`;

// DOS Boot Style
const DOSContainer = styled.div`
  width: 100%;
  height: 100%;
  background: #000;
  padding: 10px;
  box-sizing: border-box;
  color: #ffffff;
  font-family: 'Courier New', monospace;
  font-size: 8px;
  overflow: hidden;
  position: relative;
`;

const DOSLine = styled.div<{ delay: number }>`
  margin: 2px 0;
  animation: ${dosScroll} 4s ease-out ${props => props.delay * 0.3}s both;
`;

// Windows 95 Style
const Win95Container = styled.div`
  width: 100%;
  height: 100%;
  background: #c0c0c0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Win95Dialog = styled.div`
  background: #c0c0c0;
  border: 2px outset #c0c0c0;
  padding: 20px;
  width: 80%;
  max-width: 300px;
`;

const Win95Title = styled.div`
  background: #000080;
  color: white;
  padding: 4px 8px;
  margin: -20px -20px 15px -20px;
  font-size: 10px;
`;

const Win95ProgressBar = styled.div`
  width: 100%;
  height: 20px;
  border: 2px inset #c0c0c0;
  background: #ffffff;
  overflow: hidden;
`;

const Win95ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #0000ff 0%, #0080ff 50%, #0000ff 100%);
  background-size: 20px 20px;
  animation: ${win95Progress} 4s ease-in-out infinite;
`;

// Synthwave Style
const SynthwaveContainer = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #ff00ff 0%, #000040 30%, #000000 100%);
  perspective: 500px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const SynthwaveGrid = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 200%;
  height: 200%;
  background-image: 
    linear-gradient(rgba(255, 0, 255, 0.3) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 0, 255, 0.3) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: ${synthwaveGrid} 2s linear infinite;
`;

const SynthwaveText = styled.div`
  color: #ff00ff;
  font-size: 14px;
  text-shadow: 0 0 20px #ff00ff;
  z-index: 10;
  text-align: center;
`;

// MyPlace Synthwave Style - Matches app colors
const MyPlaceSynthContainer = styled.div`
  width: 100%;
  height: 100%;
  animation: ${myplacePulse} 4s ease-in-out infinite;
  perspective: 600px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const MyPlaceSynthGrid = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 250%;
  height: 250%;
  background-image: 
    linear-gradient(rgba(120, 119, 198, 0.4) 1px, transparent 1px),
    linear-gradient(90deg, rgba(120, 200, 255, 0.4) 1px, transparent 1px);
  background-size: 35px 35px;
  animation: ${synthwaveGrid} 3s linear infinite;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30%;
    background: linear-gradient(
      to top,
      rgba(255, 119, 198, 0.2) 0%,
      rgba(120, 200, 255, 0.1) 50%,
      transparent 100%
    );
    animation: ${horizonGlow} 4s ease-in-out infinite;
    border-top: 2px solid;
  }
`;

const MyPlaceSynthText = styled.div`
  color: rgba(120, 200, 255, 1);
  font-size: 16px;
  text-shadow: 
    0 0 10px rgba(120, 200, 255, 0.8),
    0 0 20px rgba(255, 119, 198, 0.6),
    0 0 30px rgba(120, 119, 198, 0.4);
  z-index: 10;
  text-align: center;
  animation: ${neonPulse} 2s ease-in-out infinite;
`;

// Fast Synthwave Variant
const FastSynthContainer = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(120, 200, 255, 0.9) 0%, #16213e 40%, #1a1a2e 70%, #000000 100%);
  perspective: 800px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const FastSynthGrid = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 300%;
  height: 300%;
  background-image: 
    linear-gradient(rgba(120, 200, 255, 0.5) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 119, 198, 0.3) 1px, transparent 1px);
  background-size: 25px 25px;
  animation: ${synthwaveGridFast} 1.5s linear infinite;
`;

// Slow Synthwave Variant
const SlowSynthContainer = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(255, 119, 198, 0.8) 0%, #1a1a2e 50%, #000000 100%);
  perspective: 400px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const SlowSynthGrid = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 180%;
  height: 180%;
  background-image: 
    linear-gradient(rgba(255, 119, 198, 0.4) 2px, transparent 2px),
    linear-gradient(90deg, rgba(120, 119, 198, 0.4) 2px, transparent 2px);
  background-size: 50px 50px;
  animation: ${synthwaveGridSlow} 4s linear infinite;
`;

// Tilted Synthwave Variant
const TiltedSynthContainer = styled.div`
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 200, 255, 0.2) 0%, transparent 50%),
    linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213e 100%);
  perspective: 600px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const TiltedSynthGrid = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 220%;
  height: 220%;
  background-image: 
    linear-gradient(rgba(120, 200, 255, 0.4) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 119, 198, 0.4) 1px, transparent 1px);
  background-size: 30px 30px;
  animation: ${synthwaveGridTilted} 2.5s linear infinite;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 20%;
    background: linear-gradient(
      135deg,
      rgba(120, 119, 198, 0.3) 0%,
      rgba(255, 119, 198, 0.2) 50%,
      rgba(120, 200, 255, 0.3) 100%
    );
    border-top: 1px solid rgba(120, 200, 255, 0.6);
  }
`;

// Retro Equalizer Style
const EqualizerContainer = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #1a1a2e 0%, #16213e 50%, #0f172a 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #00ff80;
`;

const EqualizerBars = styled.div`
  display: flex;
  gap: 4px;
  margin: 20px 0;
  align-items: flex-end;
  height: 60px;
`;

const EqualizerBar = styled.div<{ height: string; delay: number }>`
  width: 6px;
  background: linear-gradient(to top, #ff0080, #00ff80);
  animation: ${equalizerBounce} 1s ease-in-out infinite ${props => props.delay * 0.1}s;
  height: ${props => props.height};
`;

const EqualizerText = styled.div`
  font-size: 12px;
  text-align: center;
  margin-top: 10px;
`;

const FullScreenPreview = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: #ff00ff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-family: 'Press Start 2P', monospace;
  font-size: 8px;
  cursor: pointer;
  z-index: 1001;
  
  &:hover {
    background: #00ffff;
    color: #000;
  }
`;

const loadingScreens = [
  {
    id: 'vhs',
    title: 'VHS Static',
    sound: 'tv-static',
    component: (
      <VHSContainer>
        <VHSText>LOADING<br />MYPLACE</VHSText>
      </VHSContainer>
    )
  },
  {
    id: 'neon',
    title: 'Neon Grid',
    sound: 'synthwave',
    component: (
      <NeonContainer>
        <NeonText>◢ LOADING ◤<br />MyPlace.com</NeonText>
      </NeonContainer>
    )
  },
  {
    id: 'terminal',
    title: 'Terminal',
    sound: 'keyboard-typing',
    component: (
      <TerminalContainer>
        <TerminalLine delay={0}>$ CONNECTING TO MYPLACE...</TerminalLine>
        <TerminalLine delay={1}>$ LOADING USER DATA...</TerminalLine>
        <TerminalLine delay={2}>$ INITIALIZING PROFILES...</TerminalLine>
        <TerminalLine delay={3}>$ READY!</TerminalLine>
      </TerminalContainer>
    )
  },
  {
    id: 'cassette',
    title: 'Cassette Tape',
    sound: 'cassette-rewind',
    component: (
      <CassetteContainer>
        <div style={{ display: 'flex' }}>
          <CassetteReel />
          <CassetteReel />
        </div>
        <CassetteText>♪ LOADING MYPLACE ♪<br />Please Wait...</CassetteText>
      </CassetteContainer>
    )
  },
  {
    id: 'matrix',
    title: 'Matrix Rain',
    sound: 'digital-rain',
    component: (
      <MatrixContainer>
        {Array.from({ length: 15 }, (_, i) => (
          <MatrixColumn key={i} delay={i * 0.2} style={{ left: `${i * 6.66}%` }}>
            {Array.from({ length: 20 }, (_, j) => (
              <div key={j} style={{ margin: '2px 0' }}>
                {String.fromCharCode(65 + Math.random() * 26)}
              </div>
            ))}
          </MatrixColumn>
        ))}
        <MatrixText>ACCESSING<br />MYPLACE MATRIX</MatrixText>
      </MatrixContainer>
    )
  },
  {
    id: 'dialup',
    title: 'Dial-up Modem',
    sound: 'modem-connect',
    component: (
      <DialupContainer>
        <DialupText>🔗 CONNECTING TO MYPLACE 🔗</DialupText>
        <DialupVisualizer>
          {Array.from({ length: 20 }, (_, i) => (
            <DialupBar key={i} delay={i} />
          ))}
        </DialupVisualizer>
        <DialupText>Please wait while we establish connection...</DialupText>
      </DialupContainer>
    )
  },
  {
    id: 'floppy',
    title: 'Floppy Disk',
    sound: 'floppy-drive',
    component: (
      <FloppyContainer>
        <div style={{ fontSize: '12px', marginBottom: '10px' }}>INSERT DISK</div>
        <FloppyDisk />
        <div style={{ fontSize: '10px', textAlign: 'center' }}>
          Loading MyPlace from disk...<br />
          Please do not remove disk
        </div>
      </FloppyContainer>
    )
  },
  {
    id: 'dos',
    title: 'DOS Boot',
    sound: 'computer-startup',
    component: (
      <DOSContainer>
        <DOSLine delay={0}>C:\{'>'}  CD MYPLACE</DOSLine>
        <DOSLine delay={1}>C:\MYPLACE{'>'}  DIR</DOSLine>
        <DOSLine delay={2}> PROFILES    DIR     09-24-25  12:34a</DOSLine>
        <DOSLine delay={3}> FRIENDS     DIR     09-24-25  12:34a</DOSLine>
        <DOSLine delay={4}> MUSIC       DIR     09-24-25  12:34a</DOSLine>
        <DOSLine delay={5}> COMMENTS    DIR     09-24-25  12:34a</DOSLine>
        <DOSLine delay={6}>C:\MYPLACE{'>'}  MYPLACE.EXE</DOSLine>
        <DOSLine delay={7}>Loading MyPlace v2.0...</DOSLine>
        <DOSLine delay={8}>Initializing user interface...</DOSLine>
        <DOSLine delay={9}>Ready!</DOSLine>
      </DOSContainer>
    )
  },
  {
    id: 'win95',
    title: 'Windows 95',
    sound: 'windows-startup',
    component: (
      <Win95Container>
        <Win95Dialog>
          <Win95Title>MyPlace Setup</Win95Title>
          <div style={{ fontSize: '9px', margin: '10px 0' }}>
            Loading MyPlace components...
          </div>
          <Win95ProgressBar>
            <Win95ProgressFill />
          </Win95ProgressBar>
          <div style={{ fontSize: '8px', marginTop: '8px', textAlign: 'center' }}>
            Please wait while Setup configures MyPlace for your computer.
          </div>
        </Win95Dialog>
      </Win95Container>
    )
  },
  {
    id: 'synthwave',
    title: 'Synthwave Grid',
    sound: 'synthwave-bass',
    component: (
      <SynthwaveContainer>
        <StarField>
          {generateStars(25, ['rgba(255, 0, 255, 0.8)', 'rgba(0, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.9)'], 'normal')}
        </StarField>
        <SynthwaveGrid />
        <SynthwaveText>
          ◢◤ LOADING ◥◣<br />
          M Y P L A C E<br />
          ◣◥ 2 0 2 5 ◢◤
        </SynthwaveText>
      </SynthwaveContainer>
    )
  },
  {
    id: 'myplace-synth',
    title: 'MyPlace Synthwave',
    sound: 'synthwave-myplace',
    component: (
      <MyPlaceSynthContainer>
        <StarField>
          {generateStars(30, ['rgba(120, 119, 198, 0.9)', 'rgba(255, 119, 198, 0.8)', 'rgba(120, 200, 255, 0.9)', 'rgba(255, 255, 255, 0.7)'], 'normal')}
        </StarField>
        <MyPlaceSynthGrid />
        <MyPlaceSynthText>
          ◢◤ MYPLACE ◥◣<br />
          L O A D I N G<br />
          ◣◥ S Y S T E M ◢◤
        </MyPlaceSynthText>
      </MyPlaceSynthContainer>
    )
  },
  {
    id: 'fast-synth',
    title: 'Fast Synthwave',
    sound: 'synthwave-fast',
    component: (
      <FastSynthContainer>
        <StarField>
          {generateStars(35, ['rgba(120, 200, 255, 1)', 'rgba(255, 119, 198, 0.8)', 'rgba(255, 255, 255, 1)', 'rgba(120, 119, 198, 0.9)'], 'fast')}
        </StarField>
        <FastSynthGrid />
        <SynthwaveText style={{ color: 'rgba(120, 200, 255, 1)' }}>
          ◢ HYPERSPEED ◣<br />
          LOADING...
        </SynthwaveText>
      </FastSynthContainer>
    )
  },
  {
    id: 'slow-synth',
    title: 'Chill Synthwave',
    sound: 'synthwave-chill',
    component: (
      <SlowSynthContainer>
        <StarField>
          {generateStars(20, ['rgba(255, 119, 198, 0.9)', 'rgba(120, 119, 198, 0.7)', 'rgba(255, 255, 255, 0.6)', 'rgba(120, 200, 255, 0.5)'], 'slow')}
        </StarField>
        <SlowSynthGrid />
        <SynthwaveText style={{ color: 'rgba(255, 119, 198, 1)' }}>
          ◢◤ C H I L L ◥◣<br />
          L O A D I N G<br />
          ◣◥ V I B E S ◢◤
        </SynthwaveText>
      </SlowSynthContainer>
    )
  },
  {
    id: 'tilted-synth',
    title: 'Tilted Grid',
    sound: 'synthwave-tilted',
    component: (
      <TiltedSynthContainer>
        <StarField>
          {generateStars(28, ['rgba(120, 200, 255, 0.9)', 'rgba(255, 119, 198, 0.8)', 'rgba(120, 119, 198, 0.7)', 'rgba(255, 255, 255, 0.8)'], 'tilted')}
        </StarField>
        <TiltedSynthGrid />
        <MyPlaceSynthText>
          ◢ M Y P L A C E ◣<br />
          ↗ CONNECTING ↖<br />
          ◣ O N L I N E ◢
        </MyPlaceSynthText>
      </TiltedSynthContainer>
    )
  },
  {
    id: 'equalizer',
    title: 'Retro Equalizer',
    sound: 'retro-beep',
    component: (
      <EqualizerContainer>
        <div style={{ fontSize: '12px', marginBottom: '10px' }}>♪ AUDIO LOADING ♪</div>
        <EqualizerBars>
          {['30%', '60%', '40%', '80%', '50%', '70%', '35%', '90%', '45%', '65%'].map((height, i) => (
            <EqualizerBar key={i} height={height} delay={i} />
          ))}
        </EqualizerBars>
        <EqualizerText>MYPLACE SOUND SYSTEM<br />INITIALIZATION</EqualizerText>
      </EqualizerContainer>
    )
  }
];

interface LoadingScreenPreviewProps {}

const LoadingScreenPreview: React.FC<LoadingScreenPreviewProps> = () => {
  const { closeWindow } = useWindowsContext();
  const [selectedScreen, setSelectedScreen] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-close fullscreen preview after 4 seconds
  useEffect(() => {
    if (selectedScreen) {
      const timer = setTimeout(() => {
        setSelectedScreen(null);
        // Stop any playing audio
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [selectedScreen]);

  const playRetroSound = (soundType: string) => {
    // Create retro sound effects programmatically since we don't have audio files
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const playSequence = (frequencies: number[], durations: number[]) => {
      let startTime = audioContext.currentTime;
      
      frequencies.forEach((freq, i) => {
        if (freq > 0) {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(freq, startTime);
          gainNode.gain.setValueAtTime(0.1, startTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + durations[i]);
          
          oscillator.start(startTime);
          oscillator.stop(startTime + durations[i]);
        }
        startTime += durations[i];
      });
    };

    switch (soundType) {
      case 'tv-static':
        // White noise effect
        const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate);
        const noiseData = noiseBuffer.getChannelData(0);
        for (let i = 0; i < noiseData.length; i++) {
          noiseData[i] = Math.random() * 2 - 1;
        }
        const noiseSource = audioContext.createBufferSource();
        const noiseGain = audioContext.createGain();
        noiseSource.buffer = noiseBuffer;
        noiseSource.connect(noiseGain);
        noiseGain.connect(audioContext.destination);
        noiseGain.gain.setValueAtTime(0.05, audioContext.currentTime);
        noiseSource.start();
        setTimeout(() => noiseSource.stop(), 2000);
        break;
        
      case 'modem-connect':
        playSequence(
          [1200, 1800, 1200, 2400, 1200, 1800, 2400, 0],
          [0.3, 0.3, 0.3, 0.5, 0.3, 0.3, 0.5, 0.5]
        );
        break;
        
      case 'computer-startup':
        playSequence([400, 600, 800], [0.2, 0.2, 0.4]);
        break;
        
      case 'floppy-drive':
        playSequence([200, 150, 200, 150, 300], [0.1, 0.1, 0.1, 0.1, 0.2]);
        break;
        
      case 'windows-startup':
        playSequence([523, 659, 784, 1047], [0.3, 0.3, 0.3, 0.6]);
        break;
        
      case 'synthwave':
        playSequence([100, 150, 200, 150], [0.5, 0.5, 0.5, 1]);
        break;
        
      case 'synthwave-bass':
        playSequence([80, 120, 100, 160], [0.8, 0.8, 0.8, 1.2]);
        break;
        
      case 'synthwave-myplace':
        // MyPlace themed synthwave - using app's frequency palette
        playSequence([120, 180, 150, 200, 160], [0.6, 0.6, 0.6, 0.8, 1.0]);
        break;
        
      case 'synthwave-fast':
        // Fast synthwave - higher frequencies, shorter durations
        playSequence([200, 250, 300, 280, 320], [0.3, 0.3, 0.4, 0.3, 0.5]);
        break;
        
      case 'synthwave-chill':
        // Chill synthwave - lower frequencies, longer sustain
        playSequence([60, 90, 75, 110], [1.2, 1.2, 1.0, 1.5]);
        break;
        
      case 'synthwave-tilted':
        // Tilted synthwave - unique frequency pattern
        playSequence([140, 100, 180, 120, 200], [0.5, 0.4, 0.6, 0.5, 0.8]);
        break;
        
      case 'retro-beep':
        playSequence([800, 1000, 1200], [0.2, 0.2, 0.3]);
        break;
        
      case 'digital-rain':
        playSequence([300, 250, 350, 280], [0.4, 0.4, 0.4, 0.4]);
        break;
        
      case 'keyboard-typing':
        playSequence([400, 0, 450, 0, 380, 0, 420], [0.1, 0.05, 0.1, 0.05, 0.1, 0.05, 0.1]);
        break;
        
      case 'cassette-rewind':
        playSequence([150, 140, 160, 145], [0.6, 0.6, 0.6, 0.6]);
        break;
        
      default:
        playSequence([440, 880], [0.3, 0.3]);
    }
  };

  const handlePreviewClick = (screenId: string) => {
    const screen = loadingScreens.find(s => s.id === screenId);
    if (screen) {
      setSelectedScreen(screenId);
      // Play the sound for this screen
      if (screen.sound) {
        setTimeout(() => playRetroSound(screen.sound), 100);
      }
    }
  };

  const selectedComponent = loadingScreens.find(screen => screen.id === selectedScreen)?.component;

  return (
    <>
      <DraggableResizeableWindow
        windowsId={WINDOW_IDS.LOADING_PREVIEW}
        onClose={() => closeWindow(WINDOW_IDS.LOADING_PREVIEW)}
        initialWidth="80%"
        initialHeight="80%"
        headerTitle="Loading Screen Preview (Build Mode Only)"
        headerIcon="/images/icons/myplace.png"
        resizable={true}
      >
        <Container>
          <div style={{ 
            color: '#00ffff', 
            fontSize: '16px', 
            marginBottom: '20px', 
            textAlign: 'center',
            position: 'sticky',
            top: 0,
            background: '#000',
            padding: '10px 0',
            zIndex: 10
          }}>
            🎮 15 RETRO LOADING SCREENS 🎮<br />
            <span style={{ fontSize: '8px', color: '#ff00ff' }}>
              Click any preview for 4-second full screen version with sound!
            </span><br />
            <span style={{ fontSize: '7px', color: '#00ffff', marginTop: '5px', display: 'block' }}>
              🌊 5 Synthwave Variations with MyPlace Colors! 🌊
            </span>
          </div>
          
          <PreviewGrid>
            {loadingScreens.map((screen) => (
              <LoadingPreview 
                key={screen.id} 
                onClick={() => handlePreviewClick(screen.id)}
              >
                <PreviewTitle>{screen.title}</PreviewTitle>
                {screen.component}
              </LoadingPreview>
            ))}
          </PreviewGrid>
        </Container>
      </DraggableResizeableWindow>

      {/* Full Screen Preview */}
      {selectedScreen && (
        <FullScreenPreview>
          <CloseButton onClick={() => {
            setSelectedScreen(null);
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            }
          }}>
            CLOSE [ESC] - 4s AUTO-CLOSE
          </CloseButton>
          {selectedComponent}
        </FullScreenPreview>
      )}
    </>
  );
};

export default LoadingScreenPreview;