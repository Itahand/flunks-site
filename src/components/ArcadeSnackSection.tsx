import React, { useState, useRef } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { awardGum, checkGumCooldown } from '../utils/gumAPI';
import styled, { keyframes } from 'styled-components';

// Animations for the floating gum button
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-5px) rotate(1deg); }
  50% { transform: translateY(-3px) rotate(-1deg); }
  75% { transform: translateY(-7px) rotate(0.5deg); }
`;

const glow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 15px #ff6b6b, 0 0 30px #ff6b6b, 0 0 45px #ff6b6b;
  }
  50% { 
    box-shadow: 0 0 20px #4ecdc4, 0 0 40px #4ecdc4, 0 0 60px #4ecdc4;
  }
`;

const FloatingGumButton = styled.button<{ $isDisabled: boolean }>`
  position: absolute;
  top: 40%;
  right: 20%;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #ff6b6b;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 50%, #ff3838 100%);
  color: white;
  font-size: 24px;
  font-weight: bold;
  cursor: ${props => props.$isDisabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  animation: ${props => props.$isDisabled ? 'none' : float} 3s ease-in-out infinite;
  z-index: 100;
  
  ${props => !props.$isDisabled && `
    &:hover {
      animation: ${glow} 2s ease-in-out infinite, ${float} 3s ease-in-out infinite;
      transform: scale(1.1);
    }
  `}
  
  ${props => props.$isDisabled && `
    background: linear-gradient(135deg, #666 0%, #444 50%, #333 100%);
    border-color: #666;
    opacity: 0.6;
  `}
  
  &:active {
    transform: ${props => props.$isDisabled ? 'none' : 'scale(0.95)'};
  }
`;

const CooldownDisplay = styled.div`
  position: absolute;
  top: -10px;
  right: -20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
`;

const BackgroundUploadArea = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px;
  border-radius: 8px;
  font-size: 12px;
`;

interface ArcadeSnackSectionProps {
  onClose: () => void;
}

const ArcadeSnackSection: React.FC<ArcadeSnackSectionProps> = ({ onClose }) => {
  const { user } = useDynamicContext();
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownInfo, setCooldownInfo] = useState<any>(null);
  const [backgroundImage, setBackgroundImage] = useState('/images/locations/arcade/snack-section.png');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const walletAddress = user?.verifiedCredentials?.[0]?.address;

  // Check cooldown on component mount
  React.useEffect(() => {
    const checkCooldown = async () => {
      if (walletAddress) {
        const cooldown = await checkGumCooldown(walletAddress, 'arcade_snack');
        setCooldownInfo(cooldown);
      }
    };
    checkCooldown();
  }, [walletAddress]);

  const handleGumClick = async () => {
    if (!walletAddress) {
      alert('Please connect your wallet first!');
      return;
    }

    if (cooldownInfo && cooldownInfo.on_cooldown) {
      alert(`You must wait ${Math.ceil(cooldownInfo.cooldown_remaining_minutes / 60)} hours before collecting gum again!`);
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await awardGum(walletAddress, 'arcade_snack', {
        location: 'arcade_snack_section',
        timestamp: new Date().toISOString()
      });

      if (result.success) {
        alert(`🍿 Snack attack! You found ${result.earned} gum! Come back tomorrow for more!`);
        // Refresh cooldown info
        const cooldown = await checkGumCooldown(walletAddress, 'arcade_snack');
        setCooldownInfo(cooldown);
      } else {
        alert(`❌ ${result.error || 'Failed to collect gum. Try again later.'}`);
      }
    } catch (error) {
      console.error('Error collecting arcade snack gum:', error);
      alert('❌ Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real implementation, you'd upload to your server/storage
      // For now, we'll create a local URL for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      alert('Background uploaded! In production, this would be saved to your server.');
    }
  };

  const formatCooldownTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const isOnCooldown = cooldownInfo && cooldownInfo.on_cooldown;
  const cooldownRemaining = cooldownInfo?.cooldown_remaining_minutes || 0;

  return (
    <div className="relative w-full h-full bg-black text-white overflow-hidden">
      {/* Background Image */}
      <img
        src={backgroundImage}
        alt="Arcade Snack Section"
        className="absolute inset-0 w-full h-full object-cover z-0"
        onError={(e) => {
          e.currentTarget.src = "/images/backdrops/BLANK.png";
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10" />
      
      {/* Background Upload Controls */}
      <BackgroundUploadArea>
        <div className="mb-2 font-bold">🖼️ Custom Background</div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleBackgroundUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
        >
          Upload Image
        </button>
        <div className="mt-1 text-xs text-gray-300">
          Same size as cafeteria (800x600)
        </div>
      </BackgroundUploadArea>

      {/* Floating Gum Button */}
      <FloatingGumButton
        $isDisabled={isOnCooldown || isLoading}
        onClick={handleGumClick}
        disabled={isOnCooldown || isLoading || !walletAddress}
        title={
          !walletAddress 
            ? 'Connect wallet to collect gum!' 
            : isOnCooldown 
              ? `On cooldown: ${formatCooldownTime(cooldownRemaining)} remaining`
              : 'Click to collect 20 gum! (Once per day)'
        }
      >
        {isLoading ? '⏳' : '🍬'}
        
        {isOnCooldown && (
          <CooldownDisplay>
            {formatCooldownTime(cooldownRemaining)}
          </CooldownDisplay>
        )}
      </FloatingGumButton>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-20 p-6 flex flex-col justify-between">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 text-yellow-300">🍿 Snack Corner</h1>
          <p className="text-lg text-gray-200">
            The popcorn machine hums softly in the dark, dispensing treats and secrets.
          </p>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="bg-black bg-opacity-60 p-6 rounded-lg">
              <h2 className="text-xl mb-4">🎮 Arcade Treats</h2>
              <p className="text-gray-300 mb-4">
                Old vending machines line the wall, their lights flickering with promises of sugary rewards. 
                The air smells of buttered popcorn and childhood dreams.
              </p>
              
              {walletAddress ? (
                <div className="text-sm text-green-300">
                  💡 Look for the floating gum button to collect your daily reward!
                </div>
              ) : (
                <div className="text-sm text-yellow-300">
                  🔒 Connect your wallet to unlock special rewards!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            🚪 Leave Snack Corner
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArcadeSnackSection;
