import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

interface AchievementNotificationProps {
  show: boolean;
  title: string;
  description: string;
  gumAmount?: number;
  onComplete?: () => void;
}

const slideIn = keyframes`
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  10% {
    transform: translateX(0);
    opacity: 1;
  }
  90% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 10px rgba(0, 255, 0, 0.5); }
  50% { box-shadow: 0 0 20px rgba(0, 255, 0, 0.8); }
`;

const AchievementContainer = styled.div<{ show: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 350px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border: 3px solid #00ff00;
  border-radius: 8px;
  padding: 16px;
  z-index: 9999;
  font-family: 'Courier New', monospace;
  color: #00ff00;
  animation: ${props => props.show ? slideIn : 'none'} 4s ease-in-out;
  animation: ${glow} 2s ease-in-out infinite;
  box-shadow: 
    inset 2px 2px 4px rgba(255, 255, 255, 0.1),
    inset -2px -2px 4px rgba(0, 0, 0, 0.5),
    0 4px 20px rgba(0, 0, 0, 0.7);
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #00ff00, #ffff00, #00ff00);
    border-radius: 8px;
    z-index: -1;
    animation: ${glow} 2s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    width: calc(100vw - 40px);
    top: 10px;
    right: 10px;
    left: 10px;
    width: auto;
  }
`;

const AchievementHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-weight: bold;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const AchievementIcon = styled.div`
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, #ffff00 0%, #ffa500 100%);
  border-radius: 50%;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: #000;
  border: 2px solid #00ff00;
  box-shadow: 0 0 10px rgba(255, 255, 0, 0.5);
`;

const AchievementTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: #ffff00;
  text-shadow: 0 0 5px rgba(255, 255, 0, 0.7);
`;

const AchievementDescription = styled.p`
  margin: 8px 0 0 52px;
  font-size: 12px;
  line-height: 1.4;
  opacity: 0.9;
`;

const GumReward = styled.div`
  margin: 8px 0 0 52px;
  font-size: 14px;
  font-weight: bold;
  color: #ffff00;
  text-shadow: 0 0 5px rgba(255, 255, 0, 0.7);
`;

const RetroScanlines = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent 0px,
    transparent 1px,
    rgba(0, 255, 0, 0.1) 2px,
    rgba(0, 255, 0, 0.1) 3px
  );
  pointer-events: none;
  border-radius: 6px;
`;

const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  show,
  title,
  description,
  gumAmount,
  onComplete
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) {
          setTimeout(onComplete, 500); // Allow fade out animation
        }
      }, 4000); // Show for 4 seconds

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show && !isVisible) return null;

  return (
    <AchievementContainer show={isVisible}>
      <RetroScanlines />
      <AchievementHeader>
        <AchievementIcon>🏆</AchievementIcon>
        <AchievementTitle>{title}</AchievementTitle>
      </AchievementHeader>
      <AchievementDescription>{description}</AchievementDescription>
      {gumAmount && (
        <GumReward>Reward: +{gumAmount} GUM</GumReward>
      )}
    </AchievementContainer>
  );
};

export default AchievementNotification;