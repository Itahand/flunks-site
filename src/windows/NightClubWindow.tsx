import React from 'react';
import { Button, Frame } from 'react95';
import styled from 'styled-components';
import { useTimeBasedAccess, TIME_RULES } from 'hooks/useTimeBasedAccess';

const NightClubContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
  color: white;
  position: relative;
  overflow: hidden;
`;

const AccessDeniedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 40px;
`;

const ClubContent = styled.div`
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const DiscoLights = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(90deg, 
    rgba(255, 0, 150, 0.3) 0%, 
    rgba(0, 255, 255, 0.3) 25%, 
    rgba(255, 255, 0, 0.3) 50%, 
    rgba(150, 0, 255, 0.3) 75%, 
    rgba(255, 0, 150, 0.3) 100%
  );
  animation: disco 2s ease-in-out infinite alternate;
  
  @keyframes disco {
    from { opacity: 0.3; }
    to { opacity: 0.7; }
  }
`;

const DanceFloor = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin: 20px 0;
  max-width: 300px;
`;

const DanceSquare = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(45deg, #ff006e, #fb5607, #ffbe0b, #8338ec);
  border-radius: 8px;
  animation: pulse 1s ease-in-out infinite alternate;
  
  @keyframes pulse {
    from { transform: scale(1); opacity: 0.7; }
    to { transform: scale(1.1); opacity: 1; }
  }
`;

interface NightClubWindowProps {
  onClose?: () => void;
}

const NightClubWindow: React.FC<NightClubWindowProps> = ({ onClose }) => {
  const {
    isLocationOpen,
    getTimeUntilOpen,
    formatTime,
    currentTime
  } = useTimeBasedAccess();

  const isOpen = isLocationOpen(TIME_RULES.NIGHT_CLUB);

  if (!isOpen) {
    const timeUntilOpen = getTimeUntilOpen(TIME_RULES.NIGHT_CLUB);
    
    return (
      <NightClubContainer>
        <AccessDeniedContainer>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>🌙</div>
          <h1 style={{ fontSize: '28px', marginBottom: '16px', color: '#ff006e' }}>
            Night Club is Closed
          </h1>
          <p style={{ fontSize: '18px', marginBottom: '20px', lineHeight: '1.5' }}>
            The club is only open during nighttime hours!
          </p>
          <Frame variant="well" style={{ padding: '20px', background: 'rgba(0,0,0,0.5)', color: 'white' }}>
            <p><strong>Club Hours:</strong> 9:00 PM - 3:00 AM</p>
            <p><strong>Current Time:</strong> {formatTime(currentTime)}</p>
            <p><strong>Status:</strong> {timeUntilOpen}</p>
          </Frame>
          <div style={{ marginTop: '30px', fontSize: '60px' }}>🕘</div>
          <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '10px' }}>
            Come back when the sun goes down for the best nightlife experience!
          </p>
          {onClose && (
            <Button 
              onClick={onClose} 
              style={{ marginTop: '20px', background: '#ff006e', color: 'white' }}
            >
              Close
            </Button>
          )}
        </AccessDeniedContainer>
      </NightClubContainer>
    );
  }

  return (
    <NightClubContainer>
      <DiscoLights />
      
      <ClubContent>
        <div style={{ textAlign: 'center', marginTop: '80px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '10px', color: '#ff006e' }}>
            🌃 Welcome to Club Midnight 🌃
          </h1>
          <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: '30px' }}>
            The hottest spot in town - Open {formatTime(currentTime)}
          </p>
        </div>

        <DanceFloor>
          {[...Array(16)].map((_, i) => (
            <DanceSquare key={i} style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </DanceFloor>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>🎵 Now Playing 🎵</h2>
          <p style={{ fontSize: '18px', color: '#ffbe0b' }}>Electronic Dance Mix</p>
          <div style={{ margin: '20px 0', fontSize: '40px' }}>🎧 🕺 💃 🎶</div>
        </div>

        <Frame variant="well" style={{ 
          padding: '15px', 
          background: 'rgba(255, 255, 255, 0.1)', 
          color: 'white',
          textAlign: 'center',
          marginTop: '20px'
        }}>
          <p><strong>🎉 Exclusive Night Access!</strong></p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>
            This location is only accessible between 9 PM and 3 AM.<br/>
            You're part of the exclusive night owls club!
          </p>
        </Frame>

        {onClose && (
          <Button 
            onClick={onClose} 
            style={{ 
              marginTop: '20px', 
              background: '#8338ec', 
              color: 'white',
              border: 'none'
            }}
          >
            Leave Club
          </Button>
        )}
      </ClubContent>
    </NightClubContainer>
  );
};

export default NightClubWindow;
