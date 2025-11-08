import React, { useState, useEffect } from 'react';
import * as fcl from "@onflow/fcl";
import styled from 'styled-components';

/**
 * Admin NFT Burner
 * Allows admin to burn NFTs from their connected wallet
 * Access: /admin/burn-nfts
 * 
 * Uses global FCL config from src/config/fcl.ts
 */

interface NFT {
  id: number;
  name: string;
  image: string;
  collection: string;
}

export const NFTBurner: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [burning, setBurning] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');

  // Check wallet NFTs
  const loadNFTs = async (address: string) => {
    setLoading(true);
    setMessage('');
    
    try {
      console.log('🔍 Loading NFTs for address:', address);
      
      const script = `
        import SemesterZero from 0xce9dd43888d99574
        import NonFungibleToken from 0x1d7e57aa55817448
        
        access(all) fun main(address: Address): [UInt64] {
          let account = getAccount(address)
          
          // Borrow using the standard NonFungibleToken interface
          let collectionRef = account.capabilities
            .borrow<&{NonFungibleToken.Collection}>(
              SemesterZero.Chapter5CollectionPublicPath
            )
          
          if collectionRef == nil {
            return []
          }
          
          return collectionRef!.getIDs()
        }
      `;
      
      const nftIds = await fcl.query({
        cadence: script,
        args: (arg: any, t: any) => [arg(address, t.Address)]
      });
      
      console.log('✅ NFT IDs found:', nftIds);
      
      // Map IDs to NFT objects
      const nftList = nftIds.map((id: number) => ({
        id,
        name: id === 0 ? 'Genesis #0 (Test NFT)' : id === 1 ? 'Genesis #1 (Test NFT)' : `Chapter 5 NFT #${id}`,
        image: 'https://storage.googleapis.com/flunks_public/images/1.png',
        collection: 'SemesterZero'
      }));
      
      setNfts(nftList);
      setMessage(`Found ${nftList.length} NFT(s) in ${address}`);
    } catch (error: any) {
      console.error('❌ Error loading NFTs:', error);
      setMessage(`Error: ${error.message || 'Failed to load NFTs'}`);
      setNfts([]);
    } finally {
      setLoading(false);
    }
  };

  // Burn NFT
  const burnNFT = async (nftId: number) => {
    if (!user?.addr) {
      setMessage('Please connect your wallet first');
      return;
    }
    
    const confirmed = window.confirm(
      `⚠️ WARNING: Permanently destroy NFT #${nftId}?\n\n` +
      `This action CANNOT be undone. The NFT will be gone forever.\n\n` +
      `Type "BURN" in the next prompt to confirm.`
    );
    
    if (!confirmed) return;
    
    const finalConfirm = window.prompt('Type BURN to confirm:');
    if (finalConfirm !== 'BURN') {
      setMessage('Burn cancelled');
      return;
    }
    
    setBurning(nftId);
    setMessage(`Burning NFT #${nftId}...`);
    
    try {
      // Simple burn: just withdraw and destroy (no admin function needed)
      const transaction = `
        import SemesterZero from 0xce9dd43888d99574
        import NonFungibleToken from 0x1d7e57aa55817448
        
        transaction(nftID: UInt64) {
          let collection: auth(NonFungibleToken.Withdraw) &SemesterZero.Chapter5Collection
          
          prepare(signer: auth(BorrowValue, Storage) &Account) {
            // Borrow owner's collection with withdraw authorization
            self.collection = signer.storage.borrow<auth(NonFungibleToken.Withdraw) &SemesterZero.Chapter5Collection>(
              from: SemesterZero.Chapter5CollectionStoragePath
            ) ?? panic("Could not borrow collection reference")
          }
          
          execute {
            // Withdraw the NFT
            let nft <- self.collection.withdraw(withdrawID: nftID)
            
            // Destroy it (permanent!)
            destroy nft
            
            log("🔥 NFT DESTROYED: ".concat(nftID.toString()))
          }
        }
      `;
      
      const txId = await fcl.mutate({
        cadence: transaction,
        args: (arg: any, t: any) => [
          arg(nftId.toString(), t.UInt64)
        ],
        proposer: fcl.currentUser,
        payer: fcl.currentUser,
        authorizations: [fcl.currentUser],
        limit: 9999
      });
      
      setMessage(`Transaction submitted: ${txId}. Waiting for confirmation...`);
      
      // Wait for transaction to be sealed
      const result = await fcl.tx(txId).onceSealed();
      
      setMessage(`✅ NFT #${nftId} burned successfully! Transaction: ${txId}`);
      
      // Reload NFTs
      await loadNFTs(user.addr);
      
    } catch (error: any) {
      console.error('Burn failed:', error);
      setMessage(`❌ Burn failed: ${error.message}`);
    } finally {
      setBurning(null);
    }
  };

  // Connect/Disconnect wallet
  const handleAuth = async () => {
    if (user?.addr) {
      await fcl.unauthenticate();
      setUser(null);
      setNfts([]);
      setMessage('');
    } else {
      // Simple authentication - uses global config
      console.log('🔐 Starting authentication...');
      await fcl.authenticate();
    }
  };

  // Log configuration on mount for debugging
  useEffect(() => {
    const logConfig = async () => {
      const network = await fcl.config().get('flow.network');
      const accessNode = await fcl.config().get('accessNode.api');
      const discovery = await fcl.config().get('discovery.wallet');
      
      console.log('🔥 NFT Burner - FCL Config:', {
        network,
        accessNode,
        discovery
      });
    };
    
    logConfig();
  }, []);

  // Listen for auth changes
  useEffect(() => {
    const unsubscribe = fcl.currentUser.subscribe((currentUser: any) => {
      setUser(currentUser);
      if (currentUser?.addr) {
        loadNFTs(currentUser.addr);
      }
    });
    
    return () => unsubscribe();
  }, []);

  return (
    <Container>
            <Header>
        <Title>🔥 NFT Burner</Title>
        <Subtitle>Permanently destroy NFTs from your wallet</Subtitle>
      </Header>

      <WalletSection>
        <WalletButton onClick={handleAuth}>
          {user?.addr ? `Disconnect: ${user.addr}` : '🌊 Connect Flow Wallet'}
        </WalletButton>
        
        {user?.addr && (
          <RefreshButton onClick={() => loadNFTs(user.addr)} disabled={loading}>
            {loading ? 'Loading...' : '🔄 Refresh'}
          </RefreshButton>
        )}
      </WalletSection>

      {message && (
        <Message error={message.includes('Error') || message.includes('failed')}>
          {message}
        </Message>
      )}

      {nfts.length > 0 && (
        <NFTGrid>
          {nfts.map((nft) => (
            <NFTCard key={nft.id}>
              <NFTImage src={nft.image} alt={nft.name} />
              <NFTInfo>
                <NFTName>{nft.name}</NFTName>
                <NFTID>ID: {nft.id}</NFTID>
                <NFTCollection>{nft.collection}</NFTCollection>
              </NFTInfo>
              <BurnButton
                onClick={() => burnNFT(nft.id)}
                disabled={burning !== null}
              >
                {burning === nft.id ? '🔥 Burning...' : '🔥 Burn NFT'}
              </BurnButton>
            </NFTCard>
          ))}
        </NFTGrid>
      )}

      {user?.addr && nfts.length === 0 && !loading && (
        <EmptyState>
          <p>No SemesterZero NFTs found in this wallet</p>
        </EmptyState>
      )}

      <Warning>
        ⚠️ <strong>Warning:</strong> Burning is permanent and cannot be undone. 
        The NFT will be destroyed forever and removed from circulation.
      </Warning>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Press Start 2P', monospace;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  
  h1 {
    font-size: 32px;
    color: #ff4444;
    margin-bottom: 10px;
    text-shadow: 2px 2px 0px #000;
  }
  
  p {
    font-size: 12px;
    color: #999;
  }
`;

const Title = styled.h1`
  font-size: 32px;
  color: #ff4444;
  margin-bottom: 10px;
  text-shadow: 2px 2px 0px #000;
`;

const Subtitle = styled.p`
  font-size: 12px;
  color: #999;
`;

const WalletSection = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 30px;
`;

const WalletButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 12px;
  font-family: 'Press Start 2P', monospace;
  cursor: pointer;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const RefreshButton = styled.button`
  background: #333;
  color: white;
  border: 2px solid #555;
  padding: 15px 30px;
  font-size: 12px;
  font-family: 'Press Start 2P', monospace;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: #444;
    border-color: #777;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Message = styled.div<{ error?: boolean }>`
  background: ${props => props.error ? '#ff4444' : '#44ff44'};
  color: #000;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 30px;
  font-size: 10px;
  text-align: center;
  border: 3px solid ${props => props.error ? '#cc0000' : '#00cc00'};
`;

const NFTGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const NFTCard = styled.div`
  background: #1a1a1a;
  border: 3px solid #333;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
  
  &:hover {
    border-color: #ff4444;
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(255, 68, 68, 0.3);
  }
`;

const NFTImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-bottom: 3px solid #333;
`;

const NFTInfo = styled.div`
  padding: 15px;
`;

const NFTName = styled.div`
  font-size: 11px;
  color: #fff;
  margin-bottom: 8px;
`;

const NFTID = styled.div`
  font-size: 9px;
  color: #ff4444;
  margin-bottom: 4px;
`;

const NFTCollection = styled.div`
  font-size: 8px;
  color: #666;
`;

const BurnButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%);
  color: white;
  border: none;
  padding: 15px;
  font-size: 10px;
  font-family: 'Press Start 2P', monospace;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #ff6666 0%, #ff0000 100%);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 12px;
`;

const Warning = styled.div`
  background: rgba(255, 68, 68, 0.1);
  border: 2px solid #ff4444;
  border-radius: 8px;
  padding: 20px;
  font-size: 10px;
  color: #ff4444;
  text-align: center;
  
  strong {
    color: #ff6666;
  }
`;

const LilicoButton = styled.button`
  background: linear-gradient(135deg, #44ff44 0%, #00cc00 100%);
  color: #000;
  border: none;
  padding: 15px 30px;
  font-size: 12px;
  font-family: 'Press Start 2P', monospace;
  cursor: pointer;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 200, 0, 0.3);
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export default NFTBurner;
