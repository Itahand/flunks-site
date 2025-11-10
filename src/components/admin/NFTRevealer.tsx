import React, { useState, useEffect } from 'react';
import * as fcl from '@onflow/fcl';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
`;

const Section = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  border: 2px solid rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.9);
  color: #333;
  font-size: 14px;
  margin-bottom: 10px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  border: 2px solid rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.9);
  color: #333;
  font-size: 14px;
  margin-bottom: 10px;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'danger' }>`
  padding: 12px 24px;
  border-radius: 6px;
  border: none;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  
  ${props => props.variant === 'danger' ? `
    background: #e74c3c;
    color: white;
    &:hover { background: #c0392b; }
  ` : `
    background: #2ecc71;
    color: white;
    &:hover { background: #27ae60; }
  `}
  
  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
`;

const NFTList = styled.div`
  display: grid;
  gap: 15px;
  margin-top: 20px;
`;

const NFTCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  padding: 15px;
  border-radius: 8px;
  display: flex;
  gap: 15px;
  align-items: center;
`;

const NFTImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 6px;
  object-fit: cover;
`;

const NFTInfo = styled.div`
  flex: 1;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 14px;
`;

interface NFT {
  id: string;
  metadata: { [key: string]: string };
}

const NFTRevealer: React.FC = () => {
  const { primaryWallet } = useDynamicContext();
  const [walletAddress, setWalletAddress] = useState('');
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [message, setMessage] = useState('');

  // Reveal form data
  const [revealData, setRevealData] = useState({
    name: '',
    description: '',
    image: '',
    achievement: '',
    revealed: 'true'
  });

  const checkNFTs = async () => {
    if (!walletAddress) {
      setMessage('Please enter a wallet address');
      return;
    }

    setLoading(true);
    setMessage('Checking NFTs...');

    try {
      const script = `
        import SemesterZero from 0x807c3d470888cc48
        import NonFungibleToken from 0x1d7e57aa55817448
        
        access(all) fun main(address: Address): [{String: String}] {
          let account = getAccount(address)
          
          let collectionRef = account.capabilities
            .borrow<&SemesterZero.Chapter5Collection>(
              SemesterZero.Chapter5CollectionPublicPath
            ) ?? panic("No collection found")
          
          let nftIDs = collectionRef.getIDs()
          let nftData: [{String: String}] = []
          
          for id in nftIDs {
            if let nft = collectionRef.borrowChapter5NFT(id: id) {
              var data = nft.getMetadata()
              data["id"] = id.toString()
              nftData.append(data)
            }
          }
          
          return nftData
        }
      `;

      const result = await fcl.query({
        cadence: script,
        args: (arg: any, t: any) => [arg(walletAddress, t.Address)]
      });

      const nftList = result.map((data: any) => ({
        id: data.id,
        metadata: data
      }));

      setNfts(nftList);
      setMessage(`Found ${nftList.length} NFT(s)`);
    } catch (error) {
      console.error('Error checking NFTs:', error);
      setMessage(`Error: ${error}`);
      setNfts([]);
    } finally {
      setLoading(false);
    }
  };

  const revealNFT = async () => {
    if (!walletAddress || revealing) return;

    setRevealing(true);
    setMessage('Revealing NFT...');

    try {
      // Call backend API to trigger admin transaction
      const response = await fetch('/api/reveal-chapter5-nft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: walletAddress,
          metadata: revealData
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ NFT revealed successfully!');
        // Refresh NFT list
        await checkNFTs();
      } else {
        setMessage(`❌ ${data.message || 'Reveal failed'}`);
      }
    } catch (error) {
      console.error('Error revealing NFT:', error);
      setMessage(`❌ Error: ${error}`);
    } finally {
      setRevealing(false);
    }
  };

  return (
    <Container>
      <Title>🎭 NFT Revealer</Title>

      <Section>
        <Label>Wallet Address</Label>
        <Input
          type="text"
          placeholder="0x..."
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
        />
        <Button onClick={checkNFTs} disabled={loading || !walletAddress}>
          {loading ? '🔍 Checking...' : '🔍 Check NFTs'}
        </Button>
      </Section>

      {message && (
        <Section style={{ background: 'rgba(255,255,255,0.2)' }}>
          <div style={{ textAlign: 'center', fontWeight: 'bold' }}>{message}</div>
        </Section>
      )}

      {nfts.length > 0 && (
        <Section>
          <h3>Current NFTs</h3>
          <NFTList>
            {nfts.map((nft) => (
              <NFTCard key={nft.id}>
                <NFTImage src={nft.metadata.image} alt={nft.metadata.name} />
                <NFTInfo>
                  <div><strong>ID:</strong> {nft.id}</div>
                  <div><strong>Name:</strong> {nft.metadata.name}</div>
                  <div><strong>Revealed:</strong> {nft.metadata.revealed || 'false'}</div>
                  {nft.metadata.achievement && (
                    <div><strong>Achievement:</strong> {nft.metadata.achievement}</div>
                  )}
                </NFTInfo>
              </NFTCard>
            ))}
          </NFTList>
        </Section>
      )}

      {nfts.length > 0 && (
        <Section>
          <h3>🎨 Reveal NFT (Update Metadata)</h3>
          
          <Label>Name</Label>
          <Input
            type="text"
            placeholder="Paradise Motel - Revealed"
            value={revealData.name}
            onChange={(e) => setRevealData({ ...revealData, name: e.target.value })}
          />

          <Label>Description</Label>
          <TextArea
            placeholder="A fully revealed Paradise Motel NFT..."
            value={revealData.description}
            onChange={(e) => setRevealData({ ...revealData, description: e.target.value })}
          />

          <Label>New Image URL</Label>
          <Input
            type="text"
            placeholder="https://..."
            value={revealData.image}
            onChange={(e) => setRevealData({ ...revealData, image: e.target.value })}
          />

          <Label>Achievement</Label>
          <Input
            type="text"
            placeholder="SLACKER_AND_OVERACHIEVER"
            value={revealData.achievement}
            onChange={(e) => setRevealData({ ...revealData, achievement: e.target.value })}
          />

          <Button 
            onClick={revealNFT} 
            disabled={revealing || !revealData.image || !revealData.name}
            style={{ marginTop: '15px', width: '100%' }}
          >
            {revealing ? '✨ Revealing...' : '✨ Reveal NFT'}
          </Button>
        </Section>
      )}
    </Container>
  );
};

export default NFTRevealer;
