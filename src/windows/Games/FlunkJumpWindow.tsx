import React, { useEffect, useState } from 'react';
import * as fcl from '@onflow/fcl';
import styled from 'styled-components';

const GameContainer = styled.div`
  width: 100%;
  height: 100%;
  background: #000;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const GameFrame = styled.div`
  flex: 1;
  width: 100%;
  background: #000;
  position: relative;
  overflow: hidden;
`;

const GameIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  background: #000;
`;

const StartScreen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  cursor: pointer;
  transition: opacity 0.3s ease;
`;

const StartTitle = styled.h1`
  color: #00ffff;
  font-family: 'Orbitron', monospace;
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 
    0 0 10px #00ffff,
    0 0 20px #00ffff,
    0 0 30px #00ffff;
  letter-spacing: 3px;
`;

const StartButton = styled.div`
  background: linear-gradient(135deg, #ff4757 0%, #c44569 100%);
  border: 3px solid #fff;
  border-radius: 15px;
  padding: 20px 40px;
  color: white;
  font-family: 'Orbitron', monospace;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  box-shadow: 
    0 8px 16px rgba(0,0,0,0.3),
    inset 0 2px 4px rgba(255,255,255,0.2);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 12px 24px rgba(0,0,0,0.4),
      inset 0 2px 4px rgba(255,255,255,0.3);
  }
  
  &:active {
    transform: translateY(0px);
  }
`;

const Instructions = styled.div`
  color: #00ffff;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  text-align: center;
  margin-top: 30px;
  text-shadow: 0 0 5px #00ffff;
  line-height: 1.5;
`;

const FlunkJumpWindow = () => {
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    // Score submission handler for Flunky Uppy
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'FLUNKY_UPPY_SCORE') {
        const score = event.data.score;
        console.log('🦘 Flunky Uppy score received:', score);
        
        fcl.currentUser().snapshot().then((user: any) => {
          console.log('👤 User authentication check:', { 
            hasUser: !!user, 
            hasAddr: !!user?.addr, 
            addr: user?.addr?.substring(0, 10) + '...' 
          });
          
          const wallet = user?.addr;
          if (!wallet) {
            console.warn('❌ No wallet connected - score not submitted for score:', score);
            return;
          }
          
          console.log('📮 Submitting Flunky Uppy score to database:', { wallet: wallet.substring(0, 10) + '...', score });
          
          // TODO: Create API endpoint for Flunky Uppy scores
          // For now, we'll just log it
          console.log('🚧 Flunky Uppy scoring system - Coming Soon!');
          
          /*
          fetch('/api/flunkjump-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wallet, score }),
          })
          .then(response => {
            console.log('📊 Flunky Uppy score submission response status:', response.status);
            if (!response.ok) {
              return response.text().then(text => {
                throw new Error(`Score API Error ${response.status}: ${text}`);
              });
            }
            return response.json();
          })
          .then(data => {
            console.log('✅ Flunky Uppy score submitted successfully to leaderboard:', data);
          })
          .catch(error => {
            console.error('❌ Flunky Uppy score submission failed:', error);
          });
          */
        }).catch(authError => {
          console.error('❌ Flow authentication error:', authError);
        });
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const startGame = () => {
    setGameStarted(true);
    console.log('🦘 Flunky Uppy game started - removing overlay!');
    
    // Also trigger the game start in the iframe (in case it didn't auto-start)
    setTimeout(() => {
      const iframe = document.querySelector('iframe[title="Flunky Uppy Game"]') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        try {
          // Focus the iframe so keyboard controls work immediately
          iframe.focus();
          console.log('🎯 Focused iframe for keyboard controls');
          
          // Try to call the game's start function
          (iframe.contentWindow as any).startFlunkJump?.();
          console.log('🎮 Called game start function');
        } catch (e) {
          console.log('Could not access iframe content:', e);
        }
      }
    }, 100);
  };

  return (
    <GameContainer>
      {!gameStarted && (
        <StartScreen onClick={startGame}>
          <StartTitle>FLUNKY UPPY</StartTitle>
          <StartButton>CLICK TO START</StartButton>
          <Instructions>
            Use ARROW KEYS to move<br />
            MOBILE: Tilt device or tap sides
          </Instructions>
        </StartScreen>
      )}
      
      <GameFrame>
        <GameIframe 
          src="/Games/Flunky Uppy/index.html"
          title="Flunky Uppy Game"
          tabIndex={0}
        />
      </GameFrame>
    </GameContainer>
  );
};

export default FlunkJumpWindow;