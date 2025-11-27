import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useUnifiedWallet } from '../../contexts/UnifiedWalletContext';
import { useGum } from '../../contexts/GumContext';
import * as fcl from '@onflow/fcl';

// Tier configuration
const TIERS = {
  Silver: {
    cost: 250,
    image: 'https://storage.googleapis.com/flunks_public/images/paradise-motel-pin-silver.png',
    color: '#C0C0C0',
    glow: 'rgba(192, 192, 192, 0.6)',
  },
  Gold: {
    cost: 500,
    image: 'https://storage.googleapis.com/flunks_public/images/paradise-motel-pin-gold.png',
    color: '#FFD700',
    glow: 'rgba(255, 215, 0, 0.6)',
  },
  'Special Edition': {
    cost: 1000,
    image: 'https://storage.googleapis.com/flunks_public/images/paradise-motel-pin-special.png',
    color: '#FF00FF',
    glow: 'rgba(255, 0, 255, 0.6)',
  },
} as const;

type TierName = keyof typeof TIERS;

// Sound effects
const playSound = (soundName: string) => {
  try {
    const audio = new Audio(`/sounds/${soundName}.mp3`);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch (e) {
    // Ignore audio errors
  }
};

// Demo mode mock NFTs (start with 3 unrevealed, they become revealed after evolution)
const createDemoNFTs = () => [
  {
    id: 1001,
    name: 'Paradise Motel Pin #1',
    image: '/images/test-nft-before.svg',
    serialNumber: 1,
    revealed: false,
    tier: '',
  },
  {
    id: 1002,
    name: 'Paradise Motel Pin #2',
    image: '/images/test-nft-before.svg',
    serialNumber: 2,
    revealed: false,
    tier: '',
  },
  {
    id: 1003,
    name: 'Paradise Motel Pin #3',
    image: '/images/test-nft-before.svg',
    serialNumber: 3,
    revealed: false,
    tier: '',
  },
];

// Animations
const arcadeBlink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;

const glowPulse = keyframes`
  0%, 100% { 
    box-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
  }
  50% { 
    box-shadow: 0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor;
  }
`;

const evolveAnimation = keyframes`
  0% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1);
  }
  25% {
    transform: scale(1.2) rotate(10deg);
    filter: brightness(1.5) hue-rotate(30deg);
  }
  50% {
    transform: scale(0.8) rotate(-10deg);
    filter: brightness(2) hue-rotate(60deg);
  }
  75% {
    transform: scale(1.3) rotate(5deg);
    filter: brightness(1.8) hue-rotate(90deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1);
  }
`;

// Styled Components
const Container = styled.div`
  padding: 20px;
  background: 
    linear-gradient(rgba(0, 255, 0, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 0, 0.03) 1px, transparent 1px),
    #000000;
  background-size: 4px 4px;
  min-height: 100%;
  overflow-y: auto;
`;

const ArcadeFrame = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  border: 6px solid #ff0000;
  border-radius: 20px;
  background: #000000;
  box-shadow: 
    0 0 0 3px #ffff00,
    0 0 0 6px #00ff00,
    0 0 30px rgba(255, 0, 255, 0.5),
    inset 0 0 50px rgba(0, 255, 255, 0.1);
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 28px;
  color: #ffff00;
  text-shadow: 
    3px 3px 0 #ff0000,
    6px 6px 0 #ff00ff;
  margin-bottom: 5px;
  letter-spacing: 3px;
  animation: ${arcadeBlink} 2s ease-in-out infinite;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const Subtitle = styled.div`
  text-align: center;
  color: #00ff00;
  font-size: 12px;
  margin-bottom: 20px;
`;

const GumDisplay = styled.div`
  text-align: center;
  background: rgba(255, 0, 255, 0.2);
  border: 3px solid #ff00ff;
  border-radius: 10px;
  padding: 10px 20px;
  margin-bottom: 20px;
  font-size: 16px;
  color: #ffff00;
  
  span {
    color: #00ff00;
    font-weight: bold;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  font-family: inherit;
  font-size: 12px;
  background: ${props => props.active ? '#ff00ff' : '#000000'};
  color: ${props => props.active ? '#ffff00' : '#00ff00'};
  border: 3px solid ${props => props.active ? '#ffff00' : '#00ff00'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #ff00ff;
    color: #ffff00;
    border-color: #ffff00;
  }
`;

const Section = styled.div`
  background: rgba(0, 255, 255, 0.1);
  border: 4px solid #00ffff;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  color: #ff00ff;
  font-size: 16px;
  margin-bottom: 15px;
  text-align: center;
  text-shadow: 2px 2px 0 #00ffff;
`;

const NFTGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
`;

const NFTCard = styled.div<{ selected?: boolean; evolving?: boolean }>`
  background: rgba(0, 0, 0, 0.8);
  border: 4px solid ${props => props.selected ? '#ffff00' : '#00ff00'};
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.selected && css`
    box-shadow: 0 0 20px #ffff00, 0 0 40px #ff00ff;
  `}
  
  ${props => props.evolving && css`
    animation: ${evolveAnimation} 2s ease-in-out infinite;
  `}
  
  &:hover {
    transform: scale(1.05);
    border-color: #ff00ff;
  }
  
  img {
    width: 100%;
    border-radius: 8px;
    margin-bottom: 8px;
  }
`;

const NFTLabel = styled.div`
  font-size: 10px;
  color: #00ff00;
  text-align: center;
  
  strong {
    color: #ffff00;
    display: block;
    margin-bottom: 3px;
  }
`;

const TierGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TierCard = styled.div<{ tierColor: string; disabled?: boolean; selected?: boolean }>`
  background: rgba(0, 0, 0, 0.9);
  border: 4px solid ${props => props.tierColor};
  border-radius: 15px;
  padding: 15px;
  text-align: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all 0.3s ease;
  color: ${props => props.tierColor};
  
  ${props => props.selected && css`
    animation: ${glowPulse} 1.5s ease-in-out infinite;
    transform: scale(1.05);
  `}
  
  ${props => !props.disabled && !props.selected && css`
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 0 30px ${props.tierColor};
    }
  `}
`;

const TierName = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  text-shadow: 2px 2px 0 #000;
`;

const TierCost = styled.div`
  font-size: 24px;
  margin-bottom: 10px;
  
  span {
    font-size: 14px;
  }
`;

const TierImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin: 10px auto;
  display: block;
`;

const EvolveButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: 15px;
  font-family: inherit;
  font-size: 16px;
  background: ${props => props.disabled ? '#333' : '#ff0000'};
  color: #ffff00;
  border: 4px solid ${props => props.disabled ? '#666' : '#ffff00'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  margin-top: 20px;
  text-shadow: 2px 2px 0 #ff00ff;
  
  ${props => !props.disabled && css`
    &:hover {
      background: #ff00ff;
      transform: scale(1.02);
      box-shadow: 0 0 40px #ff00ff;
    }
  `}
`;

const Message = styled.div<{ type?: 'error' | 'success' | 'info' }>`
  text-align: center;
  padding: 15px;
  margin: 15px 0;
  border-radius: 10px;
  font-size: 14px;
  
  ${props => props.type === 'error' && css`
    background: rgba(255, 0, 0, 0.2);
    border: 2px solid #ff0000;
    color: #ff6666;
  `}
  
  ${props => props.type === 'success' && css`
    background: rgba(0, 255, 0, 0.2);
    border: 2px solid #00ff00;
    color: #00ff00;
  `}
  
  ${props => props.type === 'info' && css`
    background: rgba(0, 255, 255, 0.2);
    border: 2px solid #00ffff;
    color: #00ffff;
  `}
`;

const EvolvedDisplay = styled.div`
  text-align: center;
  padding: 20px;
  
  img {
    max-width: 200px;
    border: 4px solid #ffff00;
    border-radius: 15px;
    box-shadow: 0 0 30px #ffff00, 0 0 60px #ff00ff;
    margin-bottom: 15px;
  }
  
  h3 {
    color: #ffff00;
    font-size: 20px;
    margin-bottom: 10px;
  }
  
  a {
    color: #00ffff;
    text-decoration: none;
    font-size: 12px;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 40px;
  color: #00ff00;
  font-size: 14px;
  
  &::before {
    content: '⏳';
    display: block;
    font-size: 32px;
    margin-bottom: 10px;
    animation: ${arcadeBlink} 0.5s ease-in-out infinite;
  }
`;

const ConnectPrompt = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #ff00ff;
  
  h2 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #ffff00;
  }
  
  p {
    font-size: 14px;
    color: #00ff00;
  }
`;

// Main Component
const LevelUp: React.FC = () => {
  const { address } = useUnifiedWallet();
  const { balance, refreshBalance } = useGum();
  
  const [demoMode, setDemoMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'evolve' | 'collection'>('evolve');
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNFT, setSelectedNFT] = useState<any | null>(null);
  const [selectedTier, setSelectedTier] = useState<TierName | null>(null);
  const [evolving, setEvolving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' | 'info' } | null>(null);
  const [evolvedResult, setEvolvedResult] = useState<any | null>(null);
  const [demoBalance, setDemoBalance] = useState(5000); // Demo GUM balance

  // Use demo mode if no wallet connected
  const isDemo = demoMode || !address;
  const displayBalance = isDemo ? demoBalance : balance;

  // Fetch NFTs from wallet
  useEffect(() => {
    const fetchNFTs = async () => {
      // In demo mode, use mock NFTs
      if (isDemo) {
        setNfts(createDemoNFTs());
        setLoading(false);
        return;
      }
      
      if (!address) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await fcl.query({
          cadence: `
            import SemesterZero from 0xce9dd43888d99574

            access(all) fun main(address: Address): [NFTData] {
              let account = getAccount(address)
              
              let collectionRef = account.capabilities
                .borrow<&SemesterZero.Chapter5Collection>(SemesterZero.Chapter5CollectionPublicPath)
              
              if collectionRef == nil {
                return []
              }
              
              let collection = collectionRef!
              let ids = collection.getIDs()
              let nftData: [NFTData] = []
              
              for id in ids {
                if let nft = collection.borrowChapter5NFT(id: id) {
                  let revealedStatus = nft.metadata["revealed"] ?? "false"
                  let name = nft.metadata["name"] ?? "Paradise Motel Pin"
                  let image = nft.metadata["image"] ?? ""
                  let tier = nft.metadata["tier"] ?? ""
                  
                  nftData.append(NFTData(
                    id: id,
                    name: name,
                    image: image,
                    serialNumber: nft.serialNumber,
                    revealed: revealedStatus == "true",
                    tier: tier
                  ))
                }
              }
              
              return nftData
            }

            access(all) struct NFTData {
              access(all) let id: UInt64
              access(all) let name: String
              access(all) let image: String
              access(all) let serialNumber: UInt64
              access(all) let revealed: Bool
              access(all) let tier: String

              init(id: UInt64, name: String, image: String, serialNumber: UInt64, revealed: Bool, tier: String) {
                self.id = id
                self.name = name
                self.image = image
                self.serialNumber = serialNumber
                self.revealed = revealed
                self.tier = tier
              }
            }
          `,
          args: (arg: any, t: any) => [arg(address, t.Address)]
        });

        setNfts(result || []);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
        setNfts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [address, isDemo]);

  // Filter NFTs
  const unrevealedNFTs = nfts.filter(nft => !nft.revealed);
  const revealedNFTs = nfts.filter(nft => nft.revealed);

  // Handle evolution
  const handleEvolve = async () => {
    if (!selectedNFT || !selectedTier) return;
    if (!isDemo && !address) return;

    const tierConfig = TIERS[selectedTier];
    
    if (displayBalance < tierConfig.cost) {
      setMessage({ text: `Insufficient GUM! You need ${tierConfig.cost} but have ${displayBalance}.`, type: 'error' });
      return;
    }

    setEvolving(true);
    setMessage({ text: 'Evolving your NFT... Please wait...', type: 'info' });
    setEvolvedResult(null);
    
    // Play evolution start sound
    playSound('arcade');

    // Demo mode: simulate evolution
    if (isDemo) {
      await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate delay
      playSound('reveal'); // Play reveal sound
      setDemoBalance(prev => prev - tierConfig.cost);
      setMessage({ text: `🎉 Successfully evolved to ${selectedTier}!`, type: 'success' });
      playSound('success-gum-claim'); // Play success sound
      setEvolvedResult({
        tier: selectedTier,
        image: tierConfig.image,
        transactionId: 'demo-tx-' + Date.now(),
        explorerUrl: '#',
      });
      // Update demo NFTs
      setNfts(prev => prev.map(nft => 
        nft.id === selectedNFT.id 
          ? { ...nft, revealed: true, tier: selectedTier, image: tierConfig.image }
          : nft
      ));
      setSelectedNFT(null);
      setSelectedTier(null);
      setEvolving(false);
      return;
    }

    try {
      const response = await fetch('/api/level-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          nftId: selectedNFT.id,
          tier: selectedTier,
        }),
      });

      const result = await response.json();

      if (result.success) {
        playSound('reveal'); // Play reveal sound
        setMessage({ text: `🎉 Successfully evolved to ${selectedTier}!`, type: 'success' });
        playSound('success-gum-claim'); // Play success sound
        setEvolvedResult({
          tier: selectedTier,
          image: tierConfig.image,
          transactionId: result.transactionId,
          explorerUrl: result.explorerUrl,
        });
        
        // Refresh GUM balance
        refreshBalance();
        
        // Refresh NFT list after a delay
        setTimeout(async () => {
          const updatedNFTs = await fcl.query({
            cadence: `
              import SemesterZero from 0xce9dd43888d99574

              access(all) fun main(address: Address): [NFTData] {
                let account = getAccount(address)
                
                let collectionRef = account.capabilities
                  .borrow<&SemesterZero.Chapter5Collection>(SemesterZero.Chapter5CollectionPublicPath)
                
                if collectionRef == nil {
                  return []
                }
                
                let collection = collectionRef!
                let ids = collection.getIDs()
                let nftData: [NFTData] = []
                
                for id in ids {
                  if let nft = collection.borrowChapter5NFT(id: id) {
                    let revealedStatus = nft.metadata["revealed"] ?? "false"
                    let name = nft.metadata["name"] ?? "Paradise Motel Pin"
                    let image = nft.metadata["image"] ?? ""
                    let tier = nft.metadata["tier"] ?? ""
                    
                    nftData.append(NFTData(
                      id: id,
                      name: name,
                      image: image,
                      serialNumber: nft.serialNumber,
                      revealed: revealedStatus == "true",
                      tier: tier
                    ))
                  }
                }
                
                return nftData
              }

              access(all) struct NFTData {
                access(all) let id: UInt64
                access(all) let name: String
                access(all) let image: String
                access(all) let serialNumber: UInt64
                access(all) let revealed: Bool
                access(all) let tier: String

                init(id: UInt64, name: String, image: String, serialNumber: UInt64, revealed: Bool, tier: String) {
                  self.id = id
                  self.name = name
                  self.image = image
                  self.serialNumber = serialNumber
                  self.revealed = revealed
                  self.tier = tier
                }
              }
            `,
            args: (arg: any, t: any) => [arg(address, t.Address)]
          });
          setNfts(updatedNFTs || []);
        }, 3000);
        
        setSelectedNFT(null);
        setSelectedTier(null);
      } else {
        playSound('error');
        setMessage({ text: result.error || 'Evolution failed', type: 'error' });
      }
    } catch (error: any) {
      playSound('error');
      console.error('Evolution error:', error);
      setMessage({ text: error.message || 'Evolution failed', type: 'error' });
    } finally {
      setEvolving(false);
    }
  };

  // Render - always show the app (demo mode when not connected)
  return (
    <Container>
      <ArcadeFrame>
        <Title>⚡ LEVEL UP ⚡</Title>
        <Subtitle>◆ EVOLVE YOUR PARADISE MOTEL PINS ◆</Subtitle>
        
        {isDemo && (
          <div style={{ 
            background: 'rgba(255, 0, 255, 0.2)', 
            border: '2px dashed #ff00ff', 
            borderRadius: '10px', 
            padding: '10px 20px', 
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            <span style={{ color: '#ff00ff', fontSize: '12px' }}>
              🎮 DEMO MODE - Test the evolution flow without a wallet!
            </span>
          </div>
        )}

        <GumDisplay>
          🍬 YOUR GUM: <span>{displayBalance.toLocaleString()}</span>
          {isDemo && <span style={{ fontSize: '10px', color: '#ff00ff', marginLeft: '10px' }}>(DEMO)</span>}
        </GumDisplay>

        <TabContainer>
          <TabButton active={activeTab === 'evolve'} onClick={() => setActiveTab('evolve')}>
            🔮 EVOLVE
          </TabButton>
          <TabButton active={activeTab === 'collection'} onClick={() => setActiveTab('collection')}>
            📦 COLLECTION
          </TabButton>
        </TabContainer>

        {loading ? (
          <LoadingSpinner>Loading NFTs...</LoadingSpinner>
        ) : activeTab === 'evolve' ? (
          <>
            {/* Evolved Result Display */}
            {evolvedResult && (
              <Section>
                <EvolvedDisplay>
                  <img src={evolvedResult.image} alt={evolvedResult.tier} />
                  <h3>✨ Evolution Complete! ✨</h3>
                  <p style={{ color: '#00ff00', marginBottom: '10px' }}>
                    Your pin evolved to {evolvedResult.tier}!
                  </p>
                  <a href={evolvedResult.explorerUrl} target="_blank" rel="noopener noreferrer">
                    View on FlowScan →
                  </a>
                </EvolvedDisplay>
              </Section>
            )}

            {/* Select NFT Section */}
            <Section>
              <SectionTitle>🎯 SELECT NFT TO EVOLVE</SectionTitle>
              
              {unrevealedNFTs.length === 0 ? (
                <Message type="info">
                  No unrevealed Paradise Motel pins found. 
                  {nfts.length > 0 ? ' All your pins have been evolved!' : ' Complete Chapter 5 to earn one!'}
                </Message>
              ) : (
                <NFTGrid>
                  {unrevealedNFTs.map((nft) => (
                    <NFTCard
                      key={nft.id}
                      selected={selectedNFT?.id === nft.id}
                      evolving={evolving && selectedNFT?.id === nft.id}
                      onClick={() => {
                        if (!evolving) {
                          playSound('ding');
                          setSelectedNFT(nft);
                        }
                      }}
                    >
                      <img src={nft.image || 'https://storage.googleapis.com/flunks_public/images/capsule.png'} alt={nft.name} />
                      <NFTLabel>
                        <strong>{nft.name}</strong>
                        #{nft.serialNumber} • 🔒 Unrevealed
                      </NFTLabel>
                    </NFTCard>
                  ))}
                </NFTGrid>
              )}
            </Section>

            {/* Tier Selection */}
            {selectedNFT && (
              <Section>
                <SectionTitle>⚡ CHOOSE YOUR TIER</SectionTitle>
                
                <TierGrid>
                  {(Object.entries(TIERS) as [TierName, typeof TIERS[TierName]][]).map(([tierName, tierConfig]) => (
                    <TierCard
                      key={tierName}
                      tierColor={tierConfig.color}
                      disabled={displayBalance < tierConfig.cost}
                      selected={selectedTier === tierName}
                      onClick={() => {
                        if (displayBalance >= tierConfig.cost && !evolving) {
                          playSound('bubble');
                          setSelectedTier(tierName);
                        } else if (displayBalance < tierConfig.cost) {
                          playSound('error');
                        }
                      }}
                    >
                      <TierName>{tierName}</TierName>
                      <TierImage src={tierConfig.image} alt={tierName} />
                      <TierCost>
                        {tierConfig.cost} <span>GUM</span>
                      </TierCost>
                      {displayBalance < tierConfig.cost && (
                        <div style={{ fontSize: '10px', color: '#ff6666' }}>
                          Need {tierConfig.cost - displayBalance} more GUM
                        </div>
                      )}
                    </TierCard>
                  ))}
                </TierGrid>

                {message && <Message type={message.type}>{message.text}</Message>}

                <EvolveButton
                  disabled={!selectedTier || evolving}
                  onClick={handleEvolve}
                >
                  {evolving ? '⚡ EVOLVING... ⚡' : selectedTier ? `EVOLVE TO ${selectedTier.toUpperCase()}!` : 'SELECT A TIER'}
                </EvolveButton>
              </Section>
            )}
          </>
        ) : (
          /* Collection Tab */
          <Section>
            <SectionTitle>📦 YOUR EVOLVED PINS</SectionTitle>
            
            {revealedNFTs.length === 0 ? (
              <Message type="info">
                No evolved pins yet. Evolve your first one in the EVOLVE tab!
              </Message>
            ) : (
              <NFTGrid>
                {revealedNFTs.map((nft) => (
                  <NFTCard key={nft.id}>
                    <img src={nft.image} alt={nft.name} />
                    <NFTLabel>
                      <strong>{nft.name}</strong>
                      #{nft.serialNumber} • {nft.tier || 'Evolved'}
                    </NFTLabel>
                  </NFTCard>
                ))}
              </NFTGrid>
            )}
          </Section>
        )}

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '10px', color: '#666' }}>
          {address ? `Connected: ${address.slice(0, 8)}...${address.slice(-6)}` : '🎮 Demo Mode Active'}
        </div>
      </ArcadeFrame>
    </Container>
  );
};

export default LevelUp;
