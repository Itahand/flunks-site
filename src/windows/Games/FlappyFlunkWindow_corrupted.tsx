import React, { useEffect } from 'react';
import * as fcl from '@onflow/fcl';
import { useWindowsContext } from 'contexts/WindowsContext';
import { WINDOW_IDS } from 'fixed';
import DraggableResizeableWindow from 'components/DraggableResizeableWindow';
import FlappyLeaderboardWindow from './FlappyLeaderboardWindow';
import { getCurrentBuildMode } from 'utils/buildMode';
import styled from 'styled-components';

import React, { useEffect } from 'react';
import * as fcl from '@onflow/fcl';
import { useWindowsContext } from 'contexts/WindowsContext';
import { WINDOW_IDS } from 'fixed';
import DraggableResizeableWindow from 'components/DraggableResizeableWindow';
import FlappyLeaderboardWindow from './FlappyLeaderboardWindow';
import { getCurrentBuildMode } from 'utils/buildMode';
import styled from 'styled-components';

// Styled components for the arcade machine
const ArcadeMachine = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%);
  border-radius: 20px 20px 8px 8px;
  box-shadow: 
    0 0 30px rgba(0, 0, 0, 0.8),
    inset 0 2px 10px rgba(255, 255, 255, 0.1),
    inset 0 -2px 10px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
`;

const ArcadeTop = styled.div`
  height: 60px;
  background: linear-gradient(180deg, #4a4a4a 0%, #2c2c2c 100%);
  border-radius: 20px 20px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 20px;
    right: 20px;
    height: 4px;
    background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7);
    border-radius: 2px;
    animation: neonPulse 3s ease-in-out infinite alternate;
  }
  
  @keyframes neonPulse {
    0% { opacity: 0.7; transform: scaleX(0.95); }
    100% { opacity: 1; transform: scaleX(1); }
  }
`;

const ArcadeTitle = styled.h2`
  color: #ffffff;
  font-family: 'Courier New', monospace;
  font-size: 18px;
  font-weight: bold;
  text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;
  margin: 0;
  letter-spacing: 2px;
  animation: titleGlow 2s ease-in-out infinite alternate;
  
  @keyframes titleGlow {
    0% { text-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff; }
    100% { text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff; }
  }
`;

const ScreenBezel = styled.div`
  flex: 1;
  margin: 20px;
  background: #000000;
  border-radius: 15px;
  border: 8px solid #333333;
  box-shadow: 
    inset 0 0 20px rgba(0, 0, 0, 0.9),
    inset 0 0 40px rgba(0, 0, 0, 0.7),
    0 0 10px rgba(0, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      transparent 48%,
      rgba(255, 255, 255, 0.02) 49%,
      rgba(255, 255, 255, 0.02) 51%,
      transparent 52%
    );
    pointer-events: none;
    z-index: 10;
  }
`;

const GameScreen = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
`;

const ControlPanel = styled.div`
  height: 80px;
  background: linear-gradient(180deg, #404040 0%, #2c2c2c 50%, #1a1a1a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 0 30px;
  border-top: 2px solid #555555;
`;

const ArcadeButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 4px solid #666666;
  background: linear-gradient(135deg, #ff6b6b 0%, #cc5555 100%);
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.1s ease;
  font-size: 12px;
  color: white;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 6px 12px rgba(0, 0, 0, 0.4),
      inset 0 2px 4px rgba(255, 255, 255, 0.3);
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.3),
      inset 0 1px 2px rgba(0, 0, 0, 0.2);
  }
`;

const CoinSlot = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 8px;
  background: #000000;
  border: 2px solid #444444;
  border-radius: 4px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.8);
  
  &::after {
    content: 'INSERT COIN';
    position: absolute;
    top: -25px;
    right: -10px;
    font-size: 8px;
    color: #888888;
    font-family: 'Courier New', monospace;
    white-space: nowrap;
  }
`;

const SpeakerGrill = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  height: 15px;
  background: #1a1a1a;
  border: 1px solid #444444;
  border-radius: 8px;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 10px;
    right: 10px;
    height: 1px;
    background: repeating-linear-gradient(
      90deg,
      #666666 0px,
      #666666 3px,
      transparent 3px,
      transparent 6px
    );
    transform: translateY(-50%);
  }
`;

const FlappyFlunkWindow: React.FC = () => {
  const { openWindow, closeWindow } = useWindowsContext();
  const isBuilMode = getCurrentBuildMode() === 'build';

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'FLAPPY_SCORE') {
        const score = event.data.score;
        fcl.currentUser().snapshot().then((user: any) => {
          const wallet = user?.addr;
          if (!wallet) return;
          fetch('/api/flappyflunk-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wallet, score }),
          });
        });
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const openLeaderboard = () => {
    openWindow({
      key: WINDOW_IDS.FLAPPY_FLUNK_LEADERBOARD,
      window: (
        <DraggableResizeableWindow
          windowsId={WINDOW_IDS.FLAPPY_FLUNK_LEADERBOARD}
          onClose={() => closeWindow(WINDOW_IDS.FLAPPY_FLUNK_LEADERBOARD)}
          headerTitle="Leaderboard"
          initialWidth="320px"
          initialHeight="400px"
          headerIcon="/images/icons/flappyflunk.png"
        >
          <FlappyLeaderboardWindow />
        </DraggableResizeableWindow>
      ),
    });
  };

  // Regular display for public mode
  if (!isBuilMode) {
    return (
      <div className="flex flex-col h-full w-full">
        <iframe
          src="/Games/FlappyFlunk/index.html"
          title="Flappy Flunk"
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
        <button
          onClick={openLeaderboard}
          className="mt-2 px-2 py-1 bg-blue-500 text-white"
        >
          Leaderboard
        </button>
      </div>
    );
  }

  // Arcade machine display for build mode
  return (
    <ArcadeMachine>
      <CoinSlot />
      <SpeakerGrill />
      
      <ArcadeTop>
        <ArcadeTitle>FLAPPY FLUNK</ArcadeTitle>
      </ArcadeTop>
      
      <ScreenBezel>
        <GameScreen>
          <iframe
            src="/Games/FlappyFlunk/index.html"
            title="Flappy Flunk"
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px' }}
          />
        </GameScreen>
      </ScreenBezel>
      
      <ControlPanel>
        <ArcadeButton onClick={openLeaderboard} title="View Leaderboard">
          HIGH<br/>SCORES
        </ArcadeButton>
        <ArcadeButton 
          onClick={() => {
            const iframe = document.querySelector('iframe[title="Flappy Flunk"]') as HTMLIFrameElement;
            if (iframe && iframe.contentWindow) {
              iframe.contentWindow.postMessage({ type: 'RESTART_GAME' }, '*');
            }
          }}
          title="Restart Game"
        >
          START<br/>GAME
        </ArcadeButton>
        <ArcadeButton 
          onClick={() => {
            // Add sound toggle functionality if needed
            console.log('Sound toggle');
          }}
          title="Toggle Sound"
          style={{ background: 'linear-gradient(135deg, #4ecdc4 0%, #3ba99c 100%)' }}
        >
          SOUND<br/>ON/OFF
        </ArcadeButton>
      </ControlPanel>
    </ArcadeMachine>
  );
};

export default FlappyFlunkWindow;
