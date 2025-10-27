import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

/**
 * Test Wallet Override Component
 * Only appears on flunks-build.vercel.app for testing
 * Allows simulating any wallet address without actually connecting
 */

const OverrideContainer = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 99999;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 3px solid #ffd700;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  font-family: 'Courier New', monospace;
  max-width: 320px;
`;

const Title = styled.div`
  color: #ffd700;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #ffd700;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  margin-bottom: 8px;
  
  &:focus {
    outline: none;
    border-color: #ffed4e;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 8px;
  background: ${props => props.variant === 'secondary' ? '#ff4444' : '#00ff00'};
  color: ${props => props.variant === 'secondary' ? 'white' : 'black'};
  border: 2px solid ${props => props.variant === 'secondary' ? '#cc0000' : '#00cc00'};
  border-radius: 6px;
  font-weight: bold;
  font-size: 12px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const StatusText = styled.div`
  color: white;
  font-size: 11px;
  margin-top: 8px;
  padding: 6px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  word-break: break-all;
`;

const QuickAddresses = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
`;

const QuickButton = styled.button`
  padding: 6px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: #ffd700;
  }
`;

export const TestWalletOverride: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [testAddress, setTestAddress] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Only show on flunks-build
    const isFlunksBuild = typeof window !== 'undefined' && 
      window.location.hostname === 'flunks-build.vercel.app';
    setIsVisible(isFlunksBuild);

    // Check if test mode is already active
    const storedAddress = localStorage.getItem('test_wallet_override');
    if (storedAddress) {
      setTestAddress(storedAddress);
      setIsActive(true);
    }
  }, []);

  const activateTestWallet = () => {
    if (!testAddress.trim()) return;
    
    localStorage.setItem('test_wallet_override', testAddress);
    setIsActive(true);
    
    // Trigger a storage event to notify other components
    window.dispatchEvent(new Event('test-wallet-changed'));
    
    // Reload to apply changes
    window.location.reload();
  };

  const deactivateTestWallet = () => {
    localStorage.removeItem('test_wallet_override');
    setIsActive(false);
    setTestAddress('');
    
    // Trigger a storage event
    window.dispatchEvent(new Event('test-wallet-changed'));
    
    // Reload to apply changes
    window.location.reload();
  };

  const useQuickAddress = (address: string) => {
    setTestAddress(address);
  };

  if (!isVisible) return null;

  return (
    <OverrideContainer>
      <Title>🧪 TEST WALLET MODE</Title>
      
      <Input
        type="text"
        placeholder="Enter test wallet address..."
        value={testAddress}
        onChange={(e) => setTestAddress(e.target.value)}
        disabled={isActive}
      />
      
      {!isActive && (
        <>
          <QuickAddresses>
            <QuickButton onClick={() => useQuickAddress('0x0000000000000001')}>
              🎯 Test Address 1
            </QuickButton>
            <QuickButton onClick={() => useQuickAddress('0x0000000000000002')}>
              🎯 Test Address 2
            </QuickButton>
            <QuickButton onClick={() => useQuickAddress('0x0000000000000003')}>
              🎯 Test Address 3
            </QuickButton>
          </QuickAddresses>
          
          <ButtonRow>
            <Button onClick={activateTestWallet}>
              ✅ Activate
            </Button>
          </ButtonRow>
        </>
      )}
      
      {isActive && (
        <>
          <StatusText>
            Active: {testAddress}
          </StatusText>
          <ButtonRow>
            <Button variant="secondary" onClick={deactivateTestWallet}>
              ❌ Deactivate
            </Button>
          </ButtonRow>
        </>
      )}
    </OverrideContainer>
  );
};

export default TestWalletOverride;
