import React, { useState, useEffect } from 'react';
import * as fcl from '@onflow/fcl';
import { useUnifiedWallet } from '../contexts/UnifiedWalletContext';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 40px;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
`;

const KeyholeImage = styled.div<{ hasKey: boolean; unlocking: boolean }>`
  position: relative;
  width: 300px;
  height: 300px;
  margin: 0 auto 30px;
  background: radial-gradient(circle, #1a1a1a 0%, #000000 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    inset 0 0 30px rgba(0,0,0,0.8),
    0 10px 40px rgba(0,0,0,0.5);
  cursor: ${props => props.hasKey ? 'pointer' : 'default'};
  transition: all 0.3s ease;
  
  ${props => props.unlocking && `
    animation: pulse 1s ease-in-out infinite;
    box-shadow: 
      inset 0 0 30px rgba(255,215,0,0.5),
      0 0 60px rgba(255,215,0,0.5);
  `}
  
  &:hover {
    ${props => props.hasKey && `
      transform: scale(1.05);
      box-shadow: 
        inset 0 0 30px rgba(255,215,0,0.3),
        0 10px 50px rgba(0,0,0,0.6);
    `}
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

const KeyholeSVG = styled.svg<{ glowing: boolean }>`
  width: 100px;
  height: 150px;
  filter: ${props => props.glowing ? 'drop-shadow(0 0 20px gold)' : 'none'};
  transition: all 0.3s ease;
`;

const KeyIcon = styled.div<{ inserting: boolean }>`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%) ${props => props.inserting ? 'translateY(80px) rotate(0deg)' : 'translateY(0) rotate(-15deg)'};
  font-size: 60px;
  transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  filter: drop-shadow(0 5px 15px rgba(0,0,0,0.5));
`;

const UnlockButton = styled.button<{ disabled: boolean }>`
  width: 100%;
  padding: 20px;
  font-size: 20px;
  font-weight: bold;
  background: ${props => props.disabled ? 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)' : 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)'};
  color: white;
  border: none;
  border-radius: 12px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(0,0,0,0.3);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(243, 156, 18, 0.4);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const StatusMessage = styled.div<{ type: 'info' | 'success' | 'error' }>`
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
  
  ${props => {
    switch(props.type) {
      case 'success':
        return `
          background: rgba(46, 204, 113, 0.2);
          border: 2px solid #2ecc71;
          color: #2ecc71;
        `;
      case 'error':
        return `
          background: rgba(231, 76, 60, 0.2);
          border: 2px solid #e74c3c;
          color: #e74c3c;
        `;
      default:
        return `
          background: rgba(52, 152, 219, 0.2);
          border: 2px solid #3498db;
          color: #3498db;
        `;
    }
  }}
`;

const NFTPreview = styled.div`
  background: rgba(255,255,255,0.1);
  padding: 20px;
  border-radius: 12px;
  margin-top: 30px;
  text-align: center;
`;

const NFTImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 12px;
  margin: 0 auto;
  display: block;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
`;

interface KeyholeRevealProps {
  onUnlock?: () => void;
}

export const KeyholeReveal: React.FC<KeyholeRevealProps> = ({ onUnlock }) => {
  const { address } = useUnifiedWallet();
  const [hasKey, setHasKey] = useState(false);
  const [keyNFT, setKeyNFT] = useState<any>(null);
  const [unlocking, setUnlocking] = useState(false);
  const [inserting, setInserting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'info' | 'success' | 'error'>('info');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (address) {
      checkForKey();
    }
  }, [address]);

  const checkForKey = async () => {
    if (!address) return;

    setLoading(true);
    try {
      const script = `
        import SemesterZero from 0x807c3d470888cc48
        
        access(all) fun main(address: Address): {String: String}? {
          let account = getAccount(address)
          
          let collectionRef = account.capabilities
            .borrow<&SemesterZero.Chapter5Collection>(
              SemesterZero.Chapter5CollectionPublicPath
            )
          
          if collectionRef == nil {
            return nil
          }
          
          let nftIDs = collectionRef!.getIDs()
          
          // Look for unrevealed "key" type NFT
          for id in nftIDs {
            if let nft = collectionRef!.borrowChapter5NFT(id: id) {
              let metadata = nft.getMetadata()
              if metadata["type"] == "key" && metadata["revealed"] == "false" {
                var data = metadata
                data["id"] = id.toString()
                return data
              }
            }
          }
          
          return nil
        }
      `;

      const result = await fcl.query({
        cadence: script,
        args: (arg: any, t: any) => [arg(address, t.Address)]
      });

      if (result) {
        setHasKey(true);
        setKeyNFT(result);
        setMessage('🔑 You have a Paradise Motel Key! Click the keyhole to unlock...');
        setMessageType('info');
      } else {
        setHasKey(false);
        setMessage('🔒 You need a Paradise Motel Key to unlock this mystery...');
        setMessageType('info');
      }
    } catch (error) {
      console.error('Error checking for key:', error);
      setMessage('Error checking your collection');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const unlockWithKey = async () => {
    if (!address || !hasKey || unlocking) return;

    setUnlocking(true);
    setInserting(true);
    setMessage('🔑 Inserting key...');
    setMessageType('info');

    // Animation delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Call backend to reveal the NFT
      const response = await fetch('/api/unlock-key-nft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          walletAddress: address,
          nftId: keyNFT.id 
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✨ UNLOCKED! Your key has revealed its true form!');
        setMessageType('success');
        
        // Refresh to show new NFT
        setTimeout(() => {
          checkForKey();
          if (onUnlock) onUnlock();
        }, 2000);
      } else {
        setMessage(data.message || 'Failed to unlock');
        setMessageType('error');
        setInserting(false);
      }
    } catch (error) {
      console.error('Error unlocking:', error);
      setMessage('❌ Error during unlock');
      setMessageType('error');
      setInserting(false);
    } finally {
      setUnlocking(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', fontSize: '48px' }}>⏳</div>
        <p style={{ textAlign: 'center', color: 'white' }}>Checking your collection...</p>
      </Container>
    );
  }

  return (
    <Container>
      {message && <StatusMessage type={messageType}>{message}</StatusMessage>}

      <KeyholeImage 
        hasKey={hasKey} 
        unlocking={unlocking}
        onClick={hasKey && !unlocking ? unlockWithKey : undefined}
      >
        {hasKey && (
          <KeyIcon inserting={inserting}>
            🔑
          </KeyIcon>
        )}
        
        <KeyholeSVG glowing={hasKey} viewBox="0 0 100 150">
          {/* Keyhole shape */}
          <circle cx="50" cy="40" r="20" fill={hasKey ? '#FFD700' : '#4a4a4a'} />
          <rect x="42" y="45" width="16" height="50" rx="2" fill={hasKey ? '#FFD700' : '#4a4a4a'} />
          <path d="M 42 95 L 35 125 L 65 125 L 58 95 Z" fill={hasKey ? '#FFD700' : '#4a4a4a'} />
        </KeyholeSVG>
      </KeyholeImage>

      {hasKey && (
        <UnlockButton 
          onClick={unlockWithKey} 
          disabled={unlocking}
        >
          {unlocking ? '🔓 Unlocking...' : '🔑 Insert Key & Unlock'}
        </UnlockButton>
      )}

      {keyNFT && (
        <NFTPreview>
          <NFTImage src={keyNFT.image} alt={keyNFT.name} />
          <h3 style={{ color: 'white', marginTop: '15px' }}>{keyNFT.name}</h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
            {keyNFT.description}
          </p>
        </NFTPreview>
      )}

      {!hasKey && !loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px', 
          color: 'rgba(255,255,255,0.6)',
          fontSize: '14px'
        }}>
          Complete Paradise Motel objectives to earn your key...
        </div>
      )}
    </Container>
  );
};

export default KeyholeReveal;
