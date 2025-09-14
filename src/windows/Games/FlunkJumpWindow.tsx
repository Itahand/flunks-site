import React, { useEffect } from 'react';
import * as fcl from '@onflow/fcl';
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
  font-family: 'Orbitron', monospace;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin: 0;
  text-shadow: 
    0 0 10px #00ffff,
    0 0 20px #00ffff,
    0 0 30px #00ffff;
  letter-spacing: 2px;
  z-index: 1;
`;

const GameFrame = styled.div`
  flex: 1;
  margin: 15px;
  border-radius: 15px;
  overflow: hidden;
  background: #000;
  box-shadow: 
    inset 0 0 20px rgba(0, 0, 0, 0.8),
    0 0 10px rgba(0, 255, 255, 0.3);
  border: 3px solid #333;
  position: relative;
`;

const GameIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  background: #000;
`;

const ControlPanel = styled.div`
  height: 80px;
  background: linear-gradient(180deg, #333 0%, #1a1a1a 100%);
  border-radius: 0 0 8px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 0 20px;
`;

const ArcadeButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid #666;
  background: linear-gradient(135deg, #ff4757 0%, #c44569 100%);
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.1s ease;
  
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
      inset 0 2px 4px rgba(0, 0, 0, 0.3);
  }
`;

const JoystickArea = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const InstructionText = styled.div`
  color: #00ffff;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  text-align: center;
  margin: 10px 0;
  text-shadow: 0 0 5px #00ffff;
`;

const FlunkJumpWindow = () => {
  useEffect(() => {
    // Score submission handler for Flunk Jump
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'FLUNK_JUMP_SCORE') {
        const score = event.data.score;
        console.log('🦘 Flunk Jump score received:', score);
        
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
          
          console.log('📮 Submitting Flunk Jump score to database:', { wallet: wallet.substring(0, 10) + '...', score });
          
          // TODO: Create API endpoint for Flunk Jump scores
          // For now, we'll just log it
          console.log('🚧 Flunk Jump scoring system - Coming Soon!');
          
          /*
          fetch('/api/flunkjump-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wallet, score }),
          })
          .then(response => {
            console.log('📊 Flunk Jump score submission response status:', response.status);
            if (!response.ok) {
              return response.text().then(text => {
                throw new Error(`Score API Error ${response.status}: ${text}`);
              });
            }
            return response.json();
          })
          .then(data => {
            console.log('✅ Flunk Jump score submitted successfully to leaderboard:', data);
          })
          .catch(error => {
            console.error('❌ Flunk Jump score submission failed:', error);
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

  useEffect(() => {
    // Any initialization logic for Flunk Jump can go here
    console.log('🦘 Flunk Jump arcade machine powered on!');
  }, []);

  const handleButtonClick = () => {
    // Could be used to send commands to the game iframe
    console.log('🎮 Arcade button pressed!');
  };

  return (
    <ArcadeMachine>
      <ArcadeTop>
        <ArcadeTitle>FLUNK JUMP</ArcadeTitle>
      </ArcadeTop>
      
      <GameFrame>
        <GameIframe 
          src="/Games/Flunk Jump/index.html"
          title="Flunk Jump Game"
        />
      </GameFrame>
      
      <InstructionText>
        DESKTOP: ARROW KEYS • MOBILE: TILT PHONE OR TAP SIDES
      </InstructionText>
      
      <ControlPanel>
        <JoystickArea>
          <ArcadeButton onClick={handleButtonClick} />
          <div style={{ color: '#00ffff', fontSize: '10px', fontFamily: 'monospace' }}>
            JUMP
          </div>
          <ArcadeButton onClick={handleButtonClick} />
        </JoystickArea>
      </ControlPanel>
    </ArcadeMachine>
  );
};

export default FlunkJumpWindow;