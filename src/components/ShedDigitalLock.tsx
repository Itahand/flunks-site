import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from 'contexts/AuthContext';

const LockContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #2c1810 0%, #1a1a1a 100%);
  color: #fff;
  height: 100%;
  overflow-y: auto;
  background-image: radial-gradient(circle at 20% 50%, rgba(120, 50, 50, 0.3) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(50, 120, 50, 0.3) 0%, transparent 50%),
                    radial-gradient(circle at 40% 80%, rgba(50, 50, 120, 0.3) 0%, transparent 50%);
  background-size: 30px 30px;
`;

const DoorFrame = styled.div`
  width: 100%;
  max-width: 350px;
  height: 200px;
  background: linear-gradient(180deg, #8B4513 0%, #654321 100%);
  border: 4px solid #333;
  border-radius: 8px;
  position: relative;
  margin-bottom: 20px;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
`;

const DoorHandle = styled.div`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 40px;
  background: linear-gradient(45deg, #FFD700 0%, #FFA500 100%);
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
`;

const LockPanel = styled.div`
  background: linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%);
  border: 2px solid #444;
  border-radius: 15px;
  padding: 20px;
  max-width: 300px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
`;

const Display = styled.div<{ $status: 'locked' | 'unlocked' | 'checking' }>`
  background: #000;
  color: ${props => 
    props.$status === 'locked' ? '#ff3333' :
    props.$status === 'unlocked' ? '#33ff33' : '#ffaa33'
  };
  padding: 15px 10px;
  text-align: center;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  font-weight: bold;
  border: 2px solid ${props => 
    props.$status === 'locked' ? '#ff3333' :
    props.$status === 'unlocked' ? '#33ff33' : '#ffaa33'
  };
  box-shadow: 0 0 10px currentColor;
  margin-bottom: 10px;
`;

const KeypadGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 15px 0;
`;

const KeypadButton = styled.button<{ $disabled?: boolean }>`
  background: linear-gradient(145deg, #444 0%, #222 100%);
  color: #fff;
  border: 2px solid #555;
  border-radius: 8px;
  padding: 15px;
  font-size: 18px;
  font-weight: bold;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  opacity: ${props => props.$disabled ? 0.5 : 1};

  &:hover {
    background: ${props => props.$disabled ? 'linear-gradient(145deg, #444 0%, #222 100%)' : 'linear-gradient(145deg, #555 0%, #333 100%)'};
    border-color: ${props => props.$disabled ? '#555' : '#777'};
    transform: ${props => props.$disabled ? 'none' : 'translateY(-2px)'};
  }

  &:active {
    transform: ${props => props.$disabled ? 'none' : 'translateY(0)'};
  }
`;

const ActionButton = styled.button<{ $variant?: 'clear' | 'cancel' }>`
  background: ${props => 
    props.$variant === 'clear' ? 'linear-gradient(145deg, #aa6600 0%, #884400 100%)' :
    props.$variant === 'cancel' ? 'linear-gradient(145deg, #666 0%, #444 100%)' :
    'linear-gradient(145deg, #006600 0%, #004400 100%)'
  };
  color: white;
  border: 2px solid ${props => 
    props.$variant === 'clear' ? '#cc7700' :
    props.$variant === 'cancel' ? '#777' :
    '#008800'
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

interface ShedDigitalLockProps {
  onCancel: () => void;
}

const ShedDigitalLock: React.FC<ShedDigitalLockProps> = ({ onCancel }) => {
  const [inputCode, setInputCode] = useState('');
  const [status, setStatus] = useState<'locked' | 'unlocked' | 'checking'>('locked');
  const [displayMessage, setDisplayMessage] = useState('ENTER ACCESS CODE');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0); // in seconds

  // Get user authentication data
  const { walletAddress, user } = useAuth();

  // No correct code yet - all attempts will fail
  const hasCorrectCode = false;

  // Load saved attempts and cooldown from localStorage
  useEffect(() => {
    if (!walletAddress) return;

    const savedAttempts = localStorage.getItem(`shed_attempts_${walletAddress}`);
    const savedCooldownEnd = localStorage.getItem(`shed_cooldown_${walletAddress}`);

    if (savedAttempts) {
      setAttempts(parseInt(savedAttempts));
    }

    if (savedCooldownEnd) {
      const cooldownEndTime = new Date(savedCooldownEnd);
      const now = new Date();
      
      if (cooldownEndTime > now) {
        const remainingSeconds = Math.ceil((cooldownEndTime.getTime() - now.getTime()) / 1000);
        setCooldownTime(remainingSeconds);
        setIsLocked(true);
        setDisplayMessage('SYSTEM LOCKED');
      }
    }
  }, [walletAddress]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldownTime <= 0) {
      setIsLocked(false);
      setDisplayMessage('ENTER ACCESS CODE');
      return;
    }

    const timer = setInterval(() => {
      setCooldownTime(prev => {
        if (prev <= 1) {
          setIsLocked(false);
          setDisplayMessage('ENTER ACCESS CODE');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownTime]);

  // Create audio context and sounds
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
      createBeep(400, 0.2, 'error');
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
    setDisplayMessage('CHECKING...');

    setTimeout(() => {
      // Since there's no correct code yet, all attempts fail
      setStatus('locked');
      createBeep(150, 0.5, 'error');
      
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      // Save attempts to localStorage
      if (walletAddress) {
        localStorage.setItem(`shed_attempts_${walletAddress}`, newAttempts.toString());
      }

      if (newAttempts === 1) {
        // First failed attempt: 10 second cooldown
        setDisplayMessage('ACCESS DENIED - 10s LOCKOUT');
        setIsLocked(true);
        setCooldownTime(10);
        
        if (walletAddress) {
          const cooldownEnd = new Date(Date.now() + 10 * 1000);
          localStorage.setItem(`shed_cooldown_${walletAddress}`, cooldownEnd.toISOString());
        }
      } else if (newAttempts >= 2) {
        // Second+ failed attempt: 1 hour cooldown
        setDisplayMessage('ACCESS DENIED - 1 HOUR LOCKOUT');
        setIsLocked(true);
        setCooldownTime(3600); // 1 hour in seconds
        
        if (walletAddress) {
          const cooldownEnd = new Date(Date.now() + 60 * 60 * 1000);
          localStorage.setItem(`shed_cooldown_${walletAddress}`, cooldownEnd.toISOString());
        }
      } else {
        setTimeout(() => {
          setDisplayMessage('ENTER ACCESS CODE');
        }, 2000);
      }
      
      setInputCode('');
    }, 1500);
  };

  const clearCode = () => {
    setInputCode('');
    setDisplayMessage('ENTER ACCESS CODE');
    setStatus('locked');
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
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
      <h2 style={{ color: '#ccc', marginBottom: '20px', textAlign: 'center' }}>
        🏚️ SHED - RESTRICTED ACCESS
      </h2>
      
      <DoorFrame>
        <DoorHandle />
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(0,0,0,0.7)',
          color: '#ff3333',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          ⚠️ SECURE AREA
        </div>
      </DoorFrame>

      <LockPanel>
        <Display $status={status}>
          {displayMessage}
        </Display>

        <div style={{ 
          textAlign: 'center', 
          marginBottom: '15px', 
          fontFamily: 'monospace',
          fontSize: '18px',
          color: '#00ff00',
          textShadow: '0 0 5px currentColor'
        }}>
          {'█'.repeat(inputCode.length)}{'▒'.repeat(4 - inputCode.length)}
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
            CANCEL
          </ActionButton>
        </div>

        {isLocked && (
          <div style={{ 
            color: '#ff3333', 
            textAlign: 'center', 
            marginTop: '10px', 
            fontSize: '12px',
            textShadow: '0 0 5px currentColor'
          }}>
            SYSTEM LOCKOUT: {formatTime(cooldownTime)}
          </div>
        )}

        {attempts > 0 && !isLocked && (
          <div style={{ 
            color: '#ffaa33', 
            textAlign: 'center', 
            marginTop: '10px', 
            fontSize: '12px'
          }}>
            Failed attempts: {attempts}/2
            {attempts === 1 && " (Next failure = 1 hour lockout)"}
          </div>
        )}
        
        <div style={{ 
          color: '#666', 
          textAlign: 'center', 
          marginTop: '15px', 
          fontSize: '10px' 
        }}>
          SHED SECURITY SYSTEM v1.0
        </div>

        <div style={{ 
          color: '#888', 
          textAlign: 'center', 
          marginTop: '10px', 
          fontSize: '9px',
          fontStyle: 'italic'
        }}>
          No access code has been set...
        </div>
      </LockPanel>
    </LockContainer>
  );
};

export default ShedDigitalLock;
