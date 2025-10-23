import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const LockContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  background: 
    repeating-linear-gradient(
      0deg,
      rgba(139, 90, 43, 0.1) 0px,
      transparent 2px,
      transparent 4px,
      rgba(139, 90, 43, 0.1) 6px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(139, 90, 43, 0.1) 0px,
      transparent 2px,
      transparent 4px,
      rgba(139, 90, 43, 0.1) 6px
    ),
    linear-gradient(145deg, #3d2817 0%, #1a0f08 100%);
  color: #d4a574;
  height: 100%;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
`;

const CellarDoorTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #8b5a2b;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  letter-spacing: 2px;
`;

const PadlockSVG = styled.div`
  margin-bottom: 30px;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.7));
`;

const NumberDisplay = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
  justify-content: center;
`;

const NumberSlot = styled.div`
  width: 50px;
  height: 70px;
  background: linear-gradient(145deg, #1a1410 0%, #0d0a08 100%);
  border: 4px solid #3d2817;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: bold;
  color: #8b5a2b;
  font-family: 'Courier New', monospace;
  box-shadow: 
    inset 0 4px 8px rgba(0, 0, 0, 0.8),
    0 2px 4px rgba(0, 0, 0, 0.5);
  text-shadow: 0 0 10px rgba(139, 90, 43, 0.5);
`;

const KeypadGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 20px 0;
  max-width: 250px;
`;

const KeypadButton = styled.button<{ $disabled?: boolean }>`
  background: linear-gradient(145deg, #654321 0%, #4a2511 100%);
  color: #d4a574;
  border: 3px solid #3d2817;
  border-radius: 4px;
  padding: 18px;
  font-size: 24px;
  font-weight: 900;
  font-family: 'Courier New', monospace;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.15s ease;
  opacity: ${props => props.$disabled ? 0.5 : 1};
  box-shadow: 
    0 4px 0 #2a1810,
    0 6px 12px rgba(0, 0, 0, 0.5),
    inset 0 -2px 4px rgba(0, 0, 0, 0.3);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  
  &:hover:not(:disabled) {
    background: linear-gradient(145deg, #8b5a2b 0%, #654321 100%);
    transform: translateY(-1px);
    filter: brightness(1.1);
  }
  
  &:active:not(:disabled) {
    transform: translateY(2px);
    box-shadow: 
      0 2px 0 #2a1810,
      0 3px 6px rgba(0, 0, 0, 0.5);
  }
`;

const ActionButton = styled.button<{ $variant?: 'clear' | 'enter' | 'cancel' }>`
  background: ${props => 
    props.$variant === 'clear' ? 
      'linear-gradient(145deg, #cc7700 0%, #884400 100%)' :
    props.$variant === 'enter' ? 
      'linear-gradient(145deg, #4a7c59 0%, #2d5a3d 100%)' :
    props.$variant === 'cancel' ? 
      'linear-gradient(145deg, #666 0%, #333 100%)' :
      'linear-gradient(145deg, #654321 0%, #4a2511 100%)'
  };
  color: #fff;
  border: 3px solid ${props => 
    props.$variant === 'clear' ? '#884400' :
    props.$variant === 'enter' ? '#2d5a3d' :
    props.$variant === 'cancel' ? '#444' :
    '#3d2817'
  };
  border-radius: 4px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 900;
  font-family: 'Courier New', monospace;
  cursor: pointer;
  transition: all 0.15s ease;
  margin: 0 6px;
  box-shadow: 
    0 4px 0 #2a1810,
    0 6px 12px rgba(0, 0, 0, 0.5);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.1);
  }
  
  &:active {
    transform: translateY(2px);
    box-shadow: 
      0 2px 0 #2a1810,
      0 3px 6px rgba(0, 0, 0, 0.5);
  }
`;

interface CellarDoorDigitalLockProps {
  onUnlock: () => void;
  onCancel: () => void;
}

const CellarDoorDigitalLock: React.FC<CellarDoorDigitalLockProps> = ({ onUnlock, onCancel }) => {
  const [inputCode, setInputCode] = useState('');
  const [status, setStatus] = useState<'locked' | 'unlocked' | 'checking'>('locked');
  const [displayMessage, setDisplayMessage] = useState('ENTER CODE');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  // Get user authentication data
  const { walletAddress, user } = useAuth();

  // Cooldown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldownTime > 0) {
      interval = setInterval(() => {
        setCooldownTime(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            setDisplayMessage('ENTER CODE');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldownTime]);

  // Create beep sound
  const createBeep = (frequency: number, duration: number, type: 'success' | 'error') => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type === 'success' ? 'sine' : 'sawtooth';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
      // Audio failed, continue silently
    }
  };

  const handleKeyPress = (key: string) => {
    if (isLocked) return;

    if (key === '*' || key === '#') {
      createBeep(300, 0.2, 'error');
      return;
    }

    if (inputCode.length < 3) {
      setInputCode(prev => prev + key);
      createBeep(600, 0.1, 'success');
    }
  };

  const handleSubmit = () => {
    if (inputCode.length !== 3 || isLocked) return;

    setStatus('checking');
    setDisplayMessage('VERIFYING...');

    setTimeout(() => {
      // For now, no correct code - all attempts fail with ominous message
      setStatus('locked');
      createBeep(150, 0.8, 'error');
      
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts === 1) {
        setDisplayMessage('THE DOOR RESISTS...');
        setIsLocked(true);
        setCooldownTime(15);
      } else if (newAttempts === 2) {
        setDisplayMessage('SOMETHING STIRS BELOW...');
        setIsLocked(true);
        setCooldownTime(30);
      } else {
        setDisplayMessage('THE DARKNESS AWAKENS...');
        setIsLocked(true);
        setCooldownTime(60);
      }
      
      setInputCode('');
    }, 2000);
  };

  const clearCode = () => {
    setInputCode('');
    setDisplayMessage('ENTER CODE');
    setStatus('locked');
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    }
  };

  const keypadNumbers = [
    ['1', '2', '3'],
    ['4', '5', '6'], 
    ['7', '8', '9'],
    ['*', '0', '#']
  ];

  return (
    <LockContainer>
      <CellarDoorTitle>
        🚪 OLD FARMHOUSE CELLAR DOOR
      </CellarDoorTitle>
      
      {/* Vintage Padlock SVG */}
      <PadlockSVG>
        <svg width="180" height="200" viewBox="0 0 180 200">
          {/* Shackle (U-shaped top part) */}
          <rect x="55" y="20" width="70" height="50" rx="35" fill="none" stroke="#5a5a5a" strokeWidth="16"/>
          <rect x="55" y="20" width="70" height="35" fill="#3d2817"/>
          
          {/* Lock Body */}
          <rect x="30" y="60" width="120" height="130" rx="8" fill="url(#brassGradient)"/>
          <rect x="36" y="66" width="108" height="118" rx="6" fill="#8b7914" opacity="0.3"/>
          
          {/* Keyhole */}
          <circle cx="90" cy="120" r="12" fill="#2a1810"/>
          <rect x="84" y="120" width="12" height="30" fill="#2a1810"/>
          
          {/* Rivets */}
          <circle cx="50" cy="80" r="4" fill="#6b5d1a" stroke="#4a3d0a" strokeWidth="1"/>
          <circle cx="130" cy="80" r="4" fill="#6b5d1a" stroke="#4a3d0a" strokeWidth="1"/>
          <circle cx="50" cy="170" r="4" fill="#6b5d1a" stroke="#4a3d0a" strokeWidth="1"/>
          <circle cx="130" cy="170" r="4" fill="#6b5d1a" stroke="#4a3d0a" strokeWidth="1"/>
          
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="brassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c9b037"/>
              <stop offset="50%" stopColor="#b8a130"/>
              <stop offset="100%" stopColor="#8b7914"/>
            </linearGradient>
          </defs>
        </svg>
      </PadlockSVG>

      {/* Status Message */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '20px', 
        fontFamily: 'Courier New, monospace',
        fontSize: '14px',
        color: status === 'locked' ? '#ff6b6b' : status === 'unlocked' ? '#51cf66' : '#8b5a2b',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
        fontWeight: 'bold',
        letterSpacing: '1px'
      }}>
        {displayMessage}
      </div>

      {/* 3-Number Display */}
      <NumberDisplay>
        <NumberSlot>{inputCode[0] || '-'}</NumberSlot>
        <NumberSlot>{inputCode[1] || '-'}</NumberSlot>
        <NumberSlot>{inputCode[2] || '-'}</NumberSlot>
      </NumberDisplay>

      <KeypadGrid>
        {keypadNumbers.flat().map((key) => (
          <KeypadButton
            key={key}
            onClick={() => handleKeyPress(key)}
            $disabled={isLocked}
          >
            {key}
          </KeypadButton>
        ))}
      </KeypadGrid>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap', gap: '8px' }}>
        <ActionButton $variant="enter" onClick={handleSubmit} disabled={inputCode.length !== 3 || isLocked}>
          ✓ UNLOCK
        </ActionButton>
        <ActionButton $variant="clear" onClick={clearCode} disabled={isLocked}>
          ✗ CLEAR
        </ActionButton>
        <ActionButton $variant="cancel" onClick={onCancel}>
          ← BACK
        </ActionButton>
      </div>

      {isLocked && (
        <div style={{ 
          color: '#ff6666', 
          textAlign: 'center', 
          marginTop: '15px', 
          fontSize: '14px',
          textShadow: '0 0 8px currentColor',
          fontFamily: 'serif',
          fontStyle: 'italic'
        }}>
          LOCKOUT: {formatTime(cooldownTime)}
        </div>
      )}

      {attempts > 0 && !isLocked && (
        <div style={{ 
          color: '#ffaa33', 
          textAlign: 'center', 
          marginTop: '10px', 
          fontSize: '12px',
          textShadow: '0 0 5px currentColor'
        }}>
          Failed Attempts: {attempts}/3
        </div>
      )}
      
      <div style={{ 
        color: '#666', 
        textAlign: 'center', 
        marginTop: '20px', 
        fontSize: '10px',
        fontFamily: 'serif',
        fontStyle: 'italic'
      }}>
        "Some doors are meant to stay closed..."
      </div>
    </LockContainer>
  );
};

export default CellarDoorDigitalLock;
