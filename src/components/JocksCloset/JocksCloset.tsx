import React, { useState } from 'react';
import styled from 'styled-components';

const JocksClosetContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: #000;
  overflow-y: auto;
  overflow-x: hidden;
`;

const ClosetImageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 120px; /* Space for buttons */
`;

const ClosetImage = styled.img`
  width: 100%;
  max-width: 800px;
  height: auto;
  min-height: 60vh;
  object-fit: contain;
  object-position: center;
  
  @media (max-width: 768px) {
    width: 100%;
    min-height: 50vh;
    object-fit: contain;
  }
`;

const ButtonsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  z-index: 10;
  width: calc(100% - 40px);
  max-width: 400px;
  
  @media (max-width: 768px) {
    bottom: 15px;
    gap: 10px;
    padding: 0 10px;
    width: calc(100% - 20px);
    max-width: 400px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    bottom: 10px;
  }
`;

const ClosetButton = styled.button<{ $active?: boolean }>`
  background: ${props => props.$active ? '#4CAF50' : 'rgba(0, 0, 0, 0.8)'};
  color: white;
  border: 2px solid ${props => props.$active ? '#4CAF50' : '#fff'};
  padding: 12px 16px;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  white-space: nowrap;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${props => props.$active ? '#45a049' : 'rgba(255, 255, 255, 0.1)'};
    border-color: ${props => props.$active ? '#45a049' : '#4CAF50'};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 12px;
    min-height: 44px;
  }
  
  @media (max-width: 480px) {
    padding: 8px 10px;
    font-size: 11px;
    min-height: 40px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 2px solid #fff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 768px) {
    top: 15px;
    right: 15px;
    width: 36px;
    height: 36px;
    font-size: 18px;
  }
`;

interface JocksClosetProps {
  onClose?: () => void;
}

const JocksCloset: React.FC<JocksClosetProps> = ({ onClose }) => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  
  const handleItemClick = (item: string) => {
    setActiveItem(activeItem === item ? null : item);
    
    // Add your interaction logic here
    switch (item) {
      case 'cassette':
        console.log('📼 Cassette Box clicked');
        // Add cassette box functionality
        break;
      case 'frame':
        console.log('🖼️ Picture Frame clicked');
        // Add picture frame functionality
        break;
      case 'backpack':
        console.log('🎒 Teddy Backpack clicked');
        // Add teddy backpack functionality
        break;
      case 'boombox':
        console.log('📻 Boombox clicked');
        // Add boombox functionality
        break;
    }
  };

  return (
    <JocksClosetContainer>
      <CloseButton onClick={onClose}>×</CloseButton>
      
      <ClosetImageContainer>
        <ClosetImage 
          src="/images/locations/jocks-closet.png" 
          alt="Jock's Closet"
        />
      </ClosetImageContainer>
      
      <ButtonsContainer>
        <ClosetButton 
          $active={activeItem === 'cassette'}
          onClick={() => handleItemClick('cassette')}
        >
          📼 Cassette Box
        </ClosetButton>
        
        <ClosetButton 
          $active={activeItem === 'frame'}
          onClick={() => handleItemClick('frame')}
        >
          🖼️ Picture Frame
        </ClosetButton>
        
        <ClosetButton 
          $active={activeItem === 'backpack'}
          onClick={() => handleItemClick('backpack')}
        >
          🎒 Teddy Backpack
        </ClosetButton>
        
        <ClosetButton 
          $active={activeItem === 'boombox'}
          onClick={() => handleItemClick('boombox')}
        >
          📻 Boombox
        </ClosetButton>
      </ButtonsContainer>
    </JocksClosetContainer>
  );
};

export default JocksCloset;
