import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from 'contexts/AuthContext';

const NotificationOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 40, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  animation: fadeIn 0.3s ease-in;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const NotificationCard = styled.div`
  background: linear-gradient(180deg, 
    #ff6b35 0%,
    #ff8c42 15%,
    #ffa552 30%,
    #00b8d4 70%,
    #0091ad 100%
  );
  border: 8px solid #fff;
  box-shadow: 
    0 0 0 4px #ff6b35,
    0 0 0 8px #00b8d4,
    0 20px 60px rgba(255, 107, 53, 0.4),
    inset 0 0 40px rgba(255, 255, 255, 0.1);
  padding: 40px;
  max-width: 650px;
  width: 90%;
  animation: slideUp 0.4s ease-out;
  position: relative;
  image-rendering: pixelated;
  
  @keyframes slideUp {
    from {
      transform: translateY(50px) scale(0.9);
      opacity: 0;
    }
    to {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(255, 255, 255, 0.03) 2px,
        rgba(255, 255, 255, 0.03) 4px
      );
    pointer-events: none;
  }
`;

const PixelBorder = styled.div`
  position: absolute;
  inset: -4px;
  background: repeating-linear-gradient(
    90deg,
    #ff6b35 0px,
    #ff6b35 4px,
    #00b8d4 4px,
    #00b8d4 8px
  );
  z-index: -1;
  animation: borderMove 1s linear infinite;
  
  @keyframes borderMove {
    0% { background-position: 0 0; }
    100% { background-position: 8px 0; }
  }
`;

const PalmTreeDecor = styled.div`
  position: absolute;
  font-size: 48px;
  animation: sway 3s ease-in-out infinite;
  
  @keyframes sway {
    0%, 100% { transform: rotate(-5deg); }
    50% { transform: rotate(5deg); }
  }
  
  &.left {
    left: 20px;
    top: 20px;
  }
  
  &.right {
    right: 20px;
    top: 20px;
    animation-delay: 1.5s;
  }
`;

const Title = styled.h2`
  font-family: 'Press Start 2P', 'Courier New', monospace;
  font-size: 20px;
  color: #fff;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 
    3px 3px 0 #ff6b35,
    -1px -1px 0 #00b8d4,
    2px 2px 8px rgba(0, 0, 0, 0.5);
  letter-spacing: 2px;
  line-height: 1.4;
  animation: titleFloat 2s ease-in-out infinite;
  
  @keyframes titleFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
`;

const Message = styled.p`
  font-family: 'Press Start 2P', monospace;
  font-size: 12px;
  line-height: 1.8;
  color: #fff;
  margin: 20px 0;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
`;

const NFTBadge = styled.div`
  background: linear-gradient(135deg, 
    #ff6b35 0%, 
    #ffa552 50%, 
    #00b8d4 100%
  );
  padding: 24px;
  margin: 24px 0;
  text-align: center;
  box-shadow: 
    0 8px 0 #ff4500,
    0 8px 0 4px #00b8d4,
    0 12px 30px rgba(255, 107, 53, 0.6);
  position: relative;
  
  &::before,
  &::after {
    content: '🌴';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 32px;
    animation: spin 4s linear infinite;
  }
  
  &::before {
    left: 10px;
  }
  
  &::after {
    right: 10px;
    animation-delay: 2s;
  }
  
  @keyframes spin {
    0%, 100% { transform: translateY(-50%) rotate(0deg); }
    50% { transform: translateY(-50%) rotate(180deg); }
  }
`;

const BadgeTitle = styled.div`
  font-family: 'Press Start 2P', monospace;
  font-size: 16px;
  color: #fff;
  margin-bottom: 12px;
  text-shadow: 
    3px 3px 0 #ff6b35,
    -1px -1px 0 #00b8d4,
    2px 2px 8px rgba(0, 0, 0, 0.8);
  letter-spacing: 1px;
`;

const BadgeSubtitle = styled.div`
  font-family: 'Press Start 2P', monospace;
  font-size: 11px;
  color: #ffeb3b;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;
`;

const Button = styled.button<{ primary?: boolean }>`
  flex: 1;
  padding: 16px 24px;
  font-family: 'Press Start 2P', monospace;
  font-size: 11px;
  color: #fff;
  background: ${props => props.primary 
    ? 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)'
    : 'linear-gradient(135deg, #00b8d4 0%, #0091ad 100%)'};
  border: 4px solid #fff;
  box-shadow: ${props => props.primary 
    ? '0 6px 0 #cc4400, 0 6px 0 4px #fff'
    : '0 6px 0 #006b7d, 0 6px 0 4px #fff'};
  cursor: pointer;
  transition: all 0.1s ease;
  text-transform: uppercase;
  position: relative;
  image-rendering: pixelated;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.primary 
      ? '0 8px 0 #cc4400, 0 8px 0 4px #fff, 0 12px 30px rgba(255, 107, 53, 0.6)'
      : '0 8px 0 #006b7d, 0 8px 0 4px #fff, 0 12px 30px rgba(0, 184, 212, 0.6)'};
  }
  
  &:active {
    transform: translateY(4px);
    box-shadow: ${props => props.primary 
      ? '0 2px 0 #cc4400, 0 2px 0 4px #fff'
      : '0 2px 0 #006b7d, 0 2px 0 4px #fff'};
  }
`;

const Instructions = styled.div`
  background: rgba(0, 50, 100, 0.6);
  border: 4px solid #fff;
  box-shadow: 
    0 0 0 2px #00b8d4,
    inset 0 0 20px rgba(0, 0, 0, 0.3);
  padding: 20px;
  margin-top: 20px;
`;

const InstructionStep = styled.div`
  font-family: 'Press Start 2P', monospace;
  font-size: 11px;
  color: #fff;
  margin: 12px 0;
  display: flex;
  align-items: start;
  gap: 12px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  line-height: 1.6;
`;

const StepNumber = styled.span`
  color: #ffeb3b;
  font-weight: bold;
  min-width: 24px;
  text-shadow: 2px 2px 0 #ff6b35;
`;

const WaveDecor = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: repeating-linear-gradient(
    90deg,
    #00b8d4 0px,
    #00b8d4 20px,
    #0091ad 20px,
    #0091ad 40px
  );
  animation: wave 2s linear infinite;
  
  @keyframes wave {
    0% { background-position: 0 0; }
    100% { background-position: 40px 0; }
  }
`;

// List of eligible wallet addresses (excluding tinkerbell test account)
const ELIGIBLE_WALLETS = [
  '0x4ab2327b5e1f3ca1', // roto_flow
  '0x6e5d12b1735caa83', // CityofDreams
  '0xc4ab4a06ade1fd0f', // Flunkster
  '0x807c3d470888cc48', // TEMP: Jeremy's wallet for testing popup locally
  '0xbfffec679fff3a94', // TEMP: Jeremy's other wallet for testing popup
];

const Chapter5NFTNotification: React.FC = () => {
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const [hasSeenNotification, setHasSeenNotification] = useState(false);

  useEffect(() => {
    // Check if user is eligible and hasn't seen the notification yet
    const checkEligibility = () => {
      if (!user?.walletAddress) {
        console.log('Chapter5NFT: No wallet address detected');
        return;
      }
      
      console.log('Chapter5NFT: Checking wallet:', user.walletAddress);
      const isEligible = ELIGIBLE_WALLETS.includes(user.walletAddress.toLowerCase());
      console.log('Chapter5NFT: Is eligible?', isEligible);
      
      const hasSeenKey = `chapter5_nft_notification_seen_${user.walletAddress}`;
      const hasSeen = localStorage.getItem(hasSeenKey) === 'true';
      console.log('Chapter5NFT: Has seen notification?', hasSeen);
      
      if (isEligible && !hasSeen) {
        console.log('Chapter5NFT: Showing notification!');
        // Small delay for smooth entrance
        setTimeout(() => setShow(true), 1000);
      }
    };

    checkEligibility();
  }, [user]);

  const handleClose = () => {
    if (user?.walletAddress) {
      const hasSeenKey = `chapter5_nft_notification_seen_${user.walletAddress}`;
      localStorage.setItem(hasSeenKey, 'true');
    }
    setShow(false);
  };

  const handleCheckWallet = () => {
    // Open Flowty collection page
    window.open('https://www.flowty.io/collection/0xce9dd43888d99574/FlunksSemesterZero', '_blank');
    handleClose();
  };

  const handleSetupCollection = () => {
    // Open Flowty and close notification
    window.open('https://www.flowty.io/collection/0xce9dd43888d99574/FlunksSemesterZero', '_blank');
    alert('Click "Enable Collection" on Flowty or visit the Paradise Motel in-game and click the 👁️ Flunks: Semester Zero Collection button!');
    handleClose();
  };

  if (!show) return null;

  return (
    <NotificationOverlay onClick={handleClose}>
      <NotificationCard onClick={(e) => e.stopPropagation()}>
        <PixelBorder />
        <PalmTreeDecor className="left">🌴</PalmTreeDecor>
        <PalmTreeDecor className="right">🌴</PalmTreeDecor>
        <WaveDecor />
        
        <Title>�️ PARADISE AWAITS! �️</Title>
        
        <Message>
          🌊 You survived Paradise Motel! 🌊
        </Message>
        
        <NFTBadge>
          <BadgeTitle>🏖️ CHAPTER 5 NFT 🏖️</BadgeTitle>
          <BadgeSubtitle>SEMESTER ZERO EDITION</BadgeSubtitle>
        </NFTBadge>
        
        <Message style={{ fontSize: '11px' }}>
          You've earned an exclusive Paradise NFT airdrop!
        </Message>
        
        <Instructions>
          <InstructionStep>
            <StepNumber>1.</StepNumber>
            <span>Enable the collection in your wallet (button below or visit Paradise Motel)</span>
          </InstructionStep>
          <InstructionStep>
            <StepNumber>2.</StepNumber>
            <span>Your NFT will be airdropped to your wallet</span>
          </InstructionStep>
          <InstructionStep>
            <StepNumber>3.</StepNumber>
            <span>View it on Flowty marketplace!</span>
          </InstructionStep>
        </Instructions>
        
        <ButtonContainer>
          <Button onClick={handleClose}>
            Maybe Later
          </Button>
          <Button primary onClick={handleSetupCollection}>
            Enable Collection
          </Button>
        </ButtonContainer>
      </NotificationCard>
    </NotificationOverlay>
  );
};

export default Chapter5NFTNotification;
