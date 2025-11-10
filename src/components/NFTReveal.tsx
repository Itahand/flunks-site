import React, { useState, useEffect } from 'react';
import * as fcl from '@onflow/fcl';
import { useUnifiedWallet } from '../contexts/UnifiedWalletContext';
import styled from 'styled-components';

const Container = styled.div`
  padding: 30px;
  max-width: 600px;
  margin: 0 auto;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border-radius: 16px;
  color: white;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 10px;
  font-size: 32px;
  text-shadow: 2px 2px 8px rgba(0,0,0,0.5);
`;

const Subtitle = styled.p`
  text-align: center;
  color: rgba(255,255,255,0.7);
  margin-bottom: 30px;
  font-size: 14px;
`;

const NFTDisplay = styled.div`
  background: rgba(255,255,255,0.05);
  border: 2px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
`;

const NFTImage = styled.img`
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 8px;
  margin: 0 auto;
  display: block;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
`;

const NFTInfo = styled.div`
  margin-top: 15px;
  padding: 15px;
  background: rgba(0,0,0,0.2);
  border-radius: 8px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  
  strong {
    color: rgba(255,255,255,0.7);
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  border: none;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  
  ${props => props.variant === 'secondary' ? `
    background: rgba(255,255,255,0.1);
    color: white;
    border: 2px solid rgba(255,255,255,0.3);
    &:hover { 
      background: rgba(255,255,255,0.2);
      border-color: rgba(255,255,255,0.5);
    }
  ` : `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    &:hover { 
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
  `}
  
  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Message = styled.div<{ type?: 'error' | 'success' | 'info' }>`
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
  
  ${props => {
    switch(props.type) {
      case 'error':
        return 'background: rgba(231, 76, 60, 0.2); border: 2px solid #e74c3c;';
      case 'success':
        return 'background: rgba(46, 204, 113, 0.2); border: 2px solid #2ecc71;';
      default:
        return 'background: rgba(52, 152, 219, 0.2); border: 2px solid #3498db;';
    }
  }}
`;

const LoadingSpinner = styled.div`
  text-align: center;
  font-size: 40px;
  animation: spin 2s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

interface NFTRevealProps {
  onClose?: () => void;
}

export const NFTReveal: React.FC<NFTRevealProps> = ({ onClose }) => {
  const { address } = useUnifiedWallet();
  const [nft, setNft] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success' | 'info'>('info');

  useEffect(() => {
    if (address) {
      loadNFT();
    }
  }, [address]);

  const loadNFT = async () => {
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
          
          if nftIDs.length == 0 {
            return nil
          }
          
          if let nft = collectionRef!.borrowChapter5NFT(id: nftIDs[0]) {
            var data = nft.getMetadata()
            data["id"] = nftIDs[0].toString()
            return data
          }
          
          return nil
        }
      `;

      const result = await fcl.query({
        cadence: script,
        args: (arg: any, t: any) => [arg(address, t.Address)]
      });

      if (result) {
        setNft(result);
      } else {
        setMessage('No NFTs found in your collection');
        setMessageType('info');
      }
    } catch (error) {
      console.error('Error loading NFT:', error);
      setMessage('Error loading NFT data');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const revealNFT = async () => {
    if (!address || revealing) return;

    setRevealing(true);
    setMessage('Requesting reveal...');
    setMessageType('info');

    try {
      // Call backend to request reveal
      const response = await fetch('/api/request-nft-reveal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address })
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✨ Reveal requested! Your NFT will be updated shortly.');
        setMessageType('success');
        
        // Refresh NFT after a delay
        setTimeout(() => {
          loadNFT();
        }, 3000);
      } else {
        setMessage(data.message || 'Reveal request failed');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error revealing NFT:', error);
      setMessage('Error requesting reveal');
      setMessageType('error');
    } finally {
      setRevealing(false);
    }
  };

  const isRevealed = nft && nft.revealed === 'true';

  if (!address) {
    return (
      <Container>
        <Title>🎭 NFT Reveal</Title>
        <Message type="info">
          Please connect your wallet to reveal your NFT
        </Message>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <Title>🎭 NFT Reveal</Title>
        <LoadingSpinner>⏳</LoadingSpinner>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading your NFT...</p>
      </Container>
    );
  }

  return (
    <Container>
      <Title>🎭 NFT Reveal</Title>
      <Subtitle>Transform your NFT to unlock its true form</Subtitle>

      {message && <Message type={messageType}>{message}</Message>}

      {nft ? (
        <>
          <NFTDisplay>
            <NFTImage src={nft.image} alt={nft.name} />
            <NFTInfo>
              <InfoRow>
                <strong>Name:</strong>
                <span>{nft.name}</span>
              </InfoRow>
              <InfoRow>
                <strong>ID:</strong>
                <span>#{nft.id}</span>
              </InfoRow>
              <InfoRow>
                <strong>Status:</strong>
                <span>{isRevealed ? '✨ Revealed' : '🔒 Unrevealed'}</span>
              </InfoRow>
              {nft.achievement && (
                <InfoRow>
                  <strong>Achievement:</strong>
                  <span>{nft.achievement}</span>
                </InfoRow>
              )}
            </NFTInfo>
          </NFTDisplay>

          {!isRevealed ? (
            <Button onClick={revealNFT} disabled={revealing}>
              {revealing ? '✨ Revealing...' : '✨ Click to Reveal NFT'}
            </Button>
          ) : (
            <Message type="success">
              🎉 Your NFT has been revealed!
            </Message>
          )}

          {onClose && (
            <Button variant="secondary" onClick={onClose} style={{ marginTop: '10px' }}>
              Close
            </Button>
          )}
        </>
      ) : (
        <Message type="info">
          No NFTs found in your collection. Complete Chapter 5 objectives to earn one!
        </Message>
      )}
    </Container>
  );
};

export default NFTReveal;
