import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled components for the DeLorean tracker
const Container = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: white;
  height: 100%;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  position: relative;
`;

const LoadingScreen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/images/backgrounds/gif.gif') center center;
  background-size: cover;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingText = styled.div`
  background: rgba(0, 0, 0, 0.8);
  color: #00ffff;
  padding: 20px 40px;
  border-radius: 10px;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
  border: 2px solid #00ffff;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
`;

const StaticDeloreanImage = styled.div`
  width: 100%;
  height: 400px;
  background: url('/images/backgrounds/gif.gif') center center;
  background-size: cover;
  border-radius: 15px;
  margin-bottom: 30px;
  border: 3px solid #00ffff;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
`;

const ContentSection = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  border: 2px solid #00ffff;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin: 0 0 10px 0;
  background: linear-gradient(45deg, #00ffff, #ff6b6b, #4ecdc4);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 3s ease infinite;
  
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin: 0;
  color: #00ffff;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
`;

const WalletSection = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #333;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  color: #00ffff;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid #333;
  border-radius: 5px;
  color: white;
  font-family: 'Courier New', monospace;
  margin-bottom: 15px;
  
  &:focus {
    outline: none;
    border-color: #00ffff;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
  }
`;

const Button = styled.button`
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: none;
  padding: 12px 24px;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid #00ffff;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #00ffff;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #ccc;
  text-transform: uppercase;
`;

const ProgressBar = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  height: 30px;
  margin: 20px 0;
  overflow: hidden;
  border: 1px solid #333;
`;

const ProgressFill = styled.div<{ percentage: number }>`
  height: 100%;
  width: ${props => Math.min(props.percentage, 100)}%;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #00ffff);
  transition: width 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
`;

const TransactionList = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 20px;
  border: 1px solid #333;
  max-height: 300px;
  overflow-y: auto;
`;

const TransactionItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
`;

const DonationSection = styled.div`
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(76, 205, 196, 0.2));
  border: 2px solid #00ffff;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 25px;
  text-align: center;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.2);
`;

const DonationTitle = styled.h2`
  color: #00ffff;
  margin: 0 0 15px 0;
  font-size: 1.5rem;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
`;

const WalletAddressDisplay = styled.div`
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #333;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
  font-family: 'Courier New', monospace;
  word-break: break-all;
  position: relative;
`;

const CopyButton = styled.button`
  background: #4ecdc4;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #45b7aa;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const LoadingSpinner = styled.div`
  border: 3px solid rgba(0, 255, 255, 0.3);
  border-top: 3px solid #00ffff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: rgba(255, 107, 107, 0.2);
  border: 1px solid #ff6b6b;
  border-radius: 5px;
  padding: 15px;
  margin: 15px 0;
  color: #ff6b6b;
`;

// Interface for wallet data
interface WalletData {
  address: string;
  balance: number;
  transactions: Array<{
    id: string;
    amount: number;
    timestamp: string;
    type: string;
    from?: string;
    to?: string;
  }>;
  lastUpdated: string;
}

const BuyMeADeloreanWindow: React.FC = () => {
  // Skeremy's Flow wallet address for DeLorean Fund donations
  const SKEREMY_WALLET = '0xe327216d843357f1';
  const [walletAddress, setWalletAddress] = useState(SKEREMY_WALLET);
  const [targetGoal, setTargetGoal] = useState(88000); // 88k FLOW for the DeLorean!
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // Loading screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
      
      // Start Back to the Future theme after loading screen
      const deloreanAudio = new Audio('/sounds/bttf.mp3');
      deloreanAudio.volume = 0.4; // 40% volume - not too loud
      deloreanAudio.loop = true; // Loop the epic theme
      
      deloreanAudio.play().catch(err => {
        console.log('🎵 Audio autoplay blocked by browser - user interaction needed');
      });
      
      setAudio(deloreanAudio);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [audio]);

  // Auto-refresh on component mount to show current balance immediately
  useEffect(() => {
    if (SKEREMY_WALLET) {
      handleTrackWallet(true); // Silent initial load
    }
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoRefresh && walletData) {
      interval = setInterval(() => {
        handleTrackWallet(true); // Silent refresh
      }, 30000); // Refresh every 30 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, walletData]);

  // Fetch wallet data from our API
  const fetchWalletData = async (address: string): Promise<WalletData> => {
    const response = await fetch(`/api/wallet-tracker?address=${encodeURIComponent(address)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch wallet data: ${response.statusText}`);
    }
    
    return await response.json();
  };

  const handleTrackWallet = async (silent = false) => {
    if (!walletAddress.trim()) {
      setError('Please enter a valid wallet address');
      return;
    }

    if (!silent) {
      setLoading(true);
      setError('');
    }

    try {
      const data = await fetchWalletData(walletAddress);
      setWalletData(data);
    } catch (err) {
      setError('Failed to fetch wallet data. Please check the address and try again.');
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const progressPercentage = walletData ? (walletData.balance / targetGoal) * 100 : 0;
  const canAffordDelorean = walletData && walletData.balance >= targetGoal;

  // Show loading screen for 2 seconds
  if (showLoading) {
    return (
      <LoadingScreen>
        <LoadingText>
          🚗 Initializing Time Travel Protocols... ⚡️
        </LoadingText>
      </LoadingScreen>
    );
  }

  return (
    <Container>
      <ContentSection>
        <StaticDeloreanImage />
        
        <Header>
          <Title>🚗 DeLorean Fund</Title>
          <Subtitle>Help Skeremy Build a Time Machine!</Subtitle>
        </Header>

        <DonationSection>
          <DonationTitle>💰 Donate Flow Tokens</DonationTitle>
          <p style={{ margin: '0 0 15px 0', color: '#ccc' }}>
            Send FLOW tokens to help fund the DeLorean fund for Skeremy. Some people ask to buy them a coffee, he's taking it to another level. He's put countless free hours into rebuilding this website and trying to bring Flunks back to the main stage.
          </p>
          <WalletAddressDisplay>
            <div style={{ fontSize: '0.9rem', color: '#00ffff', marginBottom: '8px' }}>
              Skeremy's Flow Wallet:
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
              {SKEREMY_WALLET}
            </div>
            <CopyButton onClick={() => copyToClipboard(SKEREMY_WALLET)}>
              📋 Copy Address
            </CopyButton>
          </WalletAddressDisplay>
          <p style={{ margin: '15px 0 0 0', fontSize: '0.9rem', color: '#888' }}>
            When the goal is completed, he will livestream telling his wife that her car no longer can be parked in the garage. That alone is worth the donation as he may have to sleep in the DeLorean after he gets kicked out of his house! ⚡️
          </p>
        </DonationSection>

        {loading && <LoadingSpinner />}
        
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {walletData && (
          <>
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Button onClick={() => handleTrackWallet()} disabled={loading}>
                🔄 Refresh Balance
              </Button>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
                Auto-refresh (30s)
              </label>
            </div>

            <StatsGrid>
            <StatCard>
              <StatValue>{walletData.balance.toFixed(2)}</StatValue>
              <StatLabel>Current Balance (FLOW)</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatValue>{targetGoal.toLocaleString()}</StatValue>
              <StatLabel>DeLorean Goal (FLOW)</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatValue>{progressPercentage.toFixed(1)}%</StatValue>
              <StatLabel>Progress to Goal</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatValue>{walletData.transactions.length}</StatValue>
              <StatLabel>Recent Transactions</StatLabel>
            </StatCard>
          </StatsGrid>

          <div>
            <h3 style={{ color: '#00ffff', marginBottom: '10px' }}>Progress to Time Machine</h3>
            <ProgressBar>
              <ProgressFill percentage={progressPercentage}>
                {progressPercentage.toFixed(1)}% Complete
              </ProgressFill>
            </ProgressBar>
            <p style={{ textAlign: 'center', color: canAffordDelorean ? '#4ecdc4' : '#ccc' }}>
              {canAffordDelorean ? (
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                  🎉 GREAT SCOTT! You can afford the DeLorean! Time travel awaits! ⚡️
                </span>
              ) : (
                <>
                  {(targetGoal - walletData.balance).toFixed(2)} FLOW remaining until we can afford the flunks capacitor!
                </>
              )}
            </p>
          </div>

          <div>
            <h3 style={{ color: '#00ffff', marginBottom: '15px' }}>Recent Transactions</h3>
            <TransactionList>
              {walletData.transactions.map((tx) => (
                <TransactionItem key={tx.id}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: tx.type === 'received' ? '#4ecdc4' : '#ff6b6b' }}>
                      {tx.type === 'received' ? '+' : '-'}{tx.amount.toFixed(2)} FLOW
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#ccc' }}>
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#888' }}>
                    {tx.id}
                  </div>
                </TransactionItem>
              ))}
            </TransactionList>
          </div>

          <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(0, 255, 255, 0.1)', borderRadius: '5px' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#ccc' }}>
              Last updated: {new Date(walletData.lastUpdated).toLocaleString()}
            </p>
          </div>
        </>
      )}
      </ContentSection>
    </Container>
  );
};

export default BuyMeADeloreanWindow;