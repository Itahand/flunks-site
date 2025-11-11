import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import * as fcl from '@onflow/fcl';
import { useUnifiedWallet } from '../../contexts/UnifiedWalletContext';

const BurnNFT: React.FC = () => {
  const { address } = useUnifiedWallet();
  const [nfts, setNfts] = useState<any[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<string>('');
  const [burning, setBurning] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (address) {
      fetchNFTs();
    }
  }, [address]);

  const fetchNFTs = async () => {
    if (!address) return;
    
    setLoading(true);
    try {
      const script = `
        import SemesterZero from 0xce9dd43888d99574
        import NonFungibleToken from 0x1d7e57aa55817448
        
        access(all) fun main(address: Address): [AnyStruct] {
          let account = getAccount(address)
          
          let collectionRef = account.capabilities
            .borrow<&SemesterZero.Chapter5Collection>(
              SemesterZero.Chapter5CollectionPublicPath
            )
          
          if collectionRef == nil {
            return []
          }
          
          let nftIDs = collectionRef!.getIDs()
          let nftData: [AnyStruct] = []
          
          for id in nftIDs {
            if let nft = collectionRef!.borrowChapter5NFT(id: id) {
              nftData.append({
                "id": id,
                "name": nft.name,
                "image": nft.image,
                "rarity": nft.rarity,
                "nftType": nft.nftType
              })
            }
          }
          
          return nftData
        }
      `;
      
      const result = await fcl.query({
        cadence: script,
        args: (arg: any, t: any) => [arg(address, t.Address)]
      });
      
      setNfts(result || []);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      setMessage('Failed to load NFTs');
    } finally {
      setLoading(false);
    }
  };

  const burnNFT = async () => {
    if (!selectedNFT || !address) return;
    
    const confirmed = window.confirm(
      `⚠️ WARNING: You are about to PERMANENTLY DESTROY NFT #${selectedNFT}.\n\n` +
      `This action is IRREVERSIBLE. The NFT will be gone forever.\n\n` +
      `Are you absolutely sure you want to continue?`
    );
    
    if (!confirmed) return;
    
    setBurning(true);
    setMessage('Burning NFT...');
    
    try {
      const transaction = `
        import SemesterZero from 0xce9dd43888d99574
        import NonFungibleToken from 0x1d7e57aa55817448
        
        transaction(nftID: UInt64) {
          let admin: &SemesterZero.Admin
          let collection: auth(NonFungibleToken.Withdraw) &SemesterZero.Chapter5Collection
          
          prepare(signer: auth(BorrowValue, Storage) &Account) {
            self.admin = signer.storage.borrow<&SemesterZero.Admin>(
              from: SemesterZero.AdminStoragePath
            ) ?? panic("Could not borrow admin reference - must be signed by admin")
            
            self.collection = signer.storage.borrow<auth(NonFungibleToken.Withdraw) &SemesterZero.Chapter5Collection>(
              from: SemesterZero.Chapter5CollectionStoragePath
            ) ?? panic("Could not borrow collection reference")
          }
          
          execute {
            self.admin.burnNFTFromOwner(ownerAuth: self.collection, nftID: nftID)
            log("🔥 NFT BURNED: ".concat(nftID.toString()))
          }
        }
      `;
      
      const txId = await fcl.mutate({
        cadence: transaction,
        args: (arg: any, t: any) => [arg(selectedNFT, t.UInt64)],
        proposer: fcl.authz,
        payer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 9999
      });
      
      setMessage(`Transaction submitted: ${txId}`);
      
      await fcl.tx(txId).onceSealed();
      
      setMessage(`✅ NFT #${selectedNFT} burned successfully!`);
      setSelectedNFT('');
      
      // Refresh NFT list
      setTimeout(() => {
        fetchNFTs();
        setMessage('');
      }, 2000);
      
    } catch (error: any) {
      console.error('Error burning NFT:', error);
      setMessage(`❌ Error: ${error.message || 'Failed to burn NFT'}`);
    } finally {
      setBurning(false);
    }
  };

  return (
    <Container>
      <Title>🔥 Burn NFT (DANGER ZONE)</Title>
      <Warning>
        ⚠️ WARNING: This will PERMANENTLY DESTROY the selected NFT. This action cannot be undone!
      </Warning>
      
      {!address ? (
        <Message>Please connect your wallet to continue</Message>
      ) : (
        <>
          {loading ? (
            <Message>Loading NFTs...</Message>
          ) : nfts.length === 0 ? (
            <Message>No NFTs found in your collection</Message>
          ) : (
            <>
              <Section>
                <Label>Select NFT to Burn:</Label>
                <Select 
                  value={selectedNFT} 
                  onChange={(e) => setSelectedNFT(e.target.value)}
                  disabled={burning}
                >
                  <option value="">-- Select an NFT --</option>
                  {nfts.map((nft) => (
                    <option key={nft.id} value={nft.id}>
                      #{nft.id} - {nft.name} ({nft.nftType})
                    </option>
                  ))}
                </Select>
              </Section>
              
              {selectedNFT && (
                <NFTPreview>
                  {nfts.find(n => n.id.toString() === selectedNFT)?.image && (
                    <NFTImage 
                      src={nfts.find(n => n.id.toString() === selectedNFT)?.image} 
                      alt="NFT to burn"
                    />
                  )}
                  <NFTInfo>
                    <strong>NFT #{selectedNFT}</strong>
                    <div>{nfts.find(n => n.id.toString() === selectedNFT)?.name}</div>
                    <div>Type: {nfts.find(n => n.id.toString() === selectedNFT)?.nftType}</div>
                    <div>Rarity: {nfts.find(n => n.id.toString() === selectedNFT)?.rarity}</div>
                  </NFTInfo>
                </NFTPreview>
              )}
              
              <BurnButton 
                onClick={burnNFT} 
                disabled={!selectedNFT || burning}
              >
                {burning ? '🔥 BURNING...' : '🔥 BURN NFT (PERMANENT)'}
              </BurnButton>
            </>
          )}
          
          {message && <Message error={message.includes('❌')}>{message}</Message>}
        </>
      )}
      
      <Footer>
        <div>Connected: {address ? address.slice(0, 8) + '...' + address.slice(-6) : 'Not Connected'}</div>
        <div>🚨 LOCALHOST + FLUNKS-BUILD ONLY 🚨</div>
      </Footer>
    </Container>
  );
};

const Container = styled.div`
  padding: 30px;
  max-width: 600px;
  margin: 0 auto;
  font-family: 'Courier New', monospace;
  background: #1a1a1a;
  color: #fff;
  min-height: 100%;
`;

const Title = styled.h1`
  color: #ff4444;
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(255, 0, 0, 0.5);
`;

const Warning = styled.div`
  background: #ff4444;
  color: #fff;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-weight: bold;
  text-align: center;
  border: 3px solid #ff0000;
  animation: pulse 2s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #aaa;
  font-size: 14px;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  background: #2a2a2a;
  color: #fff;
  border: 2px solid #444;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #ff4444;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NFTPreview = styled.div`
  background: #2a2a2a;
  border: 2px solid #ff4444;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
  align-items: center;
`;

const NFTImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #666;
`;

const NFTInfo = styled.div`
  flex: 1;
  
  strong {
    display: block;
    font-size: 18px;
    color: #ff4444;
    margin-bottom: 8px;
  }
  
  div {
    margin: 4px 0;
    color: #ccc;
    font-size: 13px;
  }
`;

const BurnButton = styled.button`
  width: 100%;
  padding: 15px;
  background: #ff0000;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: #cc0000;
    transform: scale(1.02);
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
  }
  
  &:disabled {
    background: #666;
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const Message = styled.div<{ error?: boolean }>`
  padding: 12px;
  background: ${props => props.error ? '#ff4444' : '#2a2a2a'};
  color: #fff;
  border-radius: 6px;
  margin-top: 15px;
  text-align: center;
  font-size: 14px;
  border: 2px solid ${props => props.error ? '#ff0000' : '#444'};
`;

const Footer = styled.div`
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #444;
  text-align: center;
  font-size: 12px;
  color: #888;
  
  div {
    margin: 5px 0;
  }
  
  div:last-child {
    color: #ff4444;
    font-weight: bold;
  }
`;

export default BurnNFT;
