import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const LockContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #2d1b3d 0%, #0d0d0d 100%);
  color: #fff;
  height: 100%;
  overflow-y: auto;
  background-image: radial-gradient(circle at 20% 50%, rgba(120, 50, 120, 0.3) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(80, 20, 80, 0.3) 0%, transparent 50%),
                    radial-gradient(circle at 40% 80%, rgba(60, 10, 60, 0.3) 0%, transparent 50%);
  background-size: 30px 30px;
`;

const PadlockFrame = styled.div`
  width: 200px;
  height: 150px;
  background: linear-gradient(145deg, #c9b037 0%, #8b7914 100%);
  border: 4px solid #333;
  border-radius: 12px;
  position: relative;
  margin-bottom: 30px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.5), inset 0 0 30px rgba(0,0,0,0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 30px;
    border: 8px solid #888;
    border-bottom: none;
    border-radius: 30px 30px 0 0;
    background: transparent;
  }
`;

const LockDisplay = styled.div<{ $status?: 'locked' | 'unlocked' | 'checking' }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #000;
  color: ${props => 
    props.$status === 'locked' ? '#ff6666' :
    props.$status === 'unlocked' ? '#66ff66' : '#ffaa66'
  };
  padding: 8px 12px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  border: 2px solid ${props => 
    props.$status === 'locked' ? '#ff3333' :
    props.$status === 'unlocked' ? '#33ff33' : '#ffaa33'
  };
  box-shadow: 0 0 10px currentColor;
  min-width: 100px;
`;

const KeypadGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 15px 0;
`;

const KeypadButton = styled.button<{ $disabled?: boolean }>`
  background: linear-gradient(145deg, #4a1a4a 0%, #2a0a2a 100%);
  color: #fff;
  border: 2px solid #6a2a6a;
  border-radius: 8px;
  padding: 15px;
  font-size: 18px;
  font-weight: bold;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  opacity: ${props => props.$disabled ? 0.5 : 1};
  
  &:hover:not(:disabled) {
    background: linear-gradient(145deg, #5a2a5a 0%, #3a1a3a 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(120, 50, 120, 0.3);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const ActionButton = styled.button<{ $variant?: 'clear' | 'cancel' }>`
  background: ${props => 
    props.$variant === 'clear' ? 
      'linear-gradient(145deg, #cc7700 0%, #884400 100%)' :
    props.$variant === 'cancel' ? 
      'linear-gradient(145deg, #666 0%, #333 100%)' :
      'linear-gradient(145deg, #4a1a4a 0%, #2a0a2a 100%)'
  };
  color: white;
  border: 2px solid ${props => 
    props.$variant === 'clear' ? '#cc7700' :
    props.$variant === 'cancel' ? '#777' :
    '#6a2a6a'
  };
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 5px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
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

    if (inputCode.length < 4) {
      setInputCode(prev => prev + key);
      createBeep(600, 0.1, 'success');
    }
  };

  const handleSubmit = () => {
    if (inputCode.length !== 4 || isLocked) return;

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
      <h2 style={{ 
        color: '#b377d9', 
        marginBottom: '20px', 
        textAlign: 'center',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        fontFamily: 'serif',
        letterSpacing: '2px'
      }}>
        🚪 CELLAR DOOR - FORBIDDEN ACCESS
      </h2>
      
      <PadlockFrame>
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: '#b377d9',
          padding: '3px 8px',
          borderRadius: '4px',
          fontSize: '10px',
          fontWeight: 'bold'
        }}>
          ⚠️ CURSED SEAL
        </div>
        
        <LockDisplay $status={status}>
          {displayMessage}
        </LockDisplay>
      </PadlockFrame>

      <div style={{ 
        textAlign: 'center', 
        marginBottom: '15px', 
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#b377d9',
        textShadow: '0 0 8px currentColor'
      }}>
        {'●'.repeat(inputCode.length)}{'○'.repeat(4 - inputCode.length)}
      </div>

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

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
        <ActionButton onClick={handleSubmit} disabled={inputCode.length !== 4 || isLocked}>
          SUBMIT
        </ActionButton>
        <ActionButton $variant="clear" onClick={clearCode} disabled={isLocked}>
          CLEAR
        </ActionButton>
        <ActionButton $variant="cancel" onClick={onCancel}>
          ESCAPE
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
