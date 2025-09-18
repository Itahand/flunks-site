import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled components for the DeLorean tracker
const Container = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: white;
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
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
  justify-content: center;
  color: white;
  font-weight: bold;
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
  const [walletAddress, setWalletAddress] = useState('');
  const [targetGoal, setTargetGoal] = useState(88000); // 88k FLOW for the DeLorean!
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);

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

  const progressPercentage = walletData ? (walletData.balance / targetGoal) * 100 : 0;
  const canAffordDelorean = walletData && walletData.balance >= targetGoal;

  return (
    <Container>
      <Header>
        <Title>🚗 DeLorean Fund</Title>
        <Subtitle>Time Travel Fund Tracker</Subtitle>
      </Header>

      <WalletSection>
        <Label>Flow Wallet Address:</Label>
        <Input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="Enter wallet address (e.g., 0x1234567890abcdef...)"
          disabled={loading}
        />
        
        <Label>Target Goal (FLOW):</Label>
        <Input
          type="number"
          value={targetGoal}
          onChange={(e) => setTargetGoal(Number(e.target.value))}
          placeholder="88000"
          disabled={loading}
        />

        <Button onClick={() => handleTrackWallet()} disabled={loading || !walletAddress.trim()}>
          {loading ? 'Tracking...' : 'Track Wallet'}
        </Button>
        
        {walletData && (
          <div style={{ marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Button onClick={() => handleTrackWallet()} disabled={loading}>
              🔄 Refresh
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
        )}
      </WalletSection>

      {loading && <LoadingSpinner />}
      
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {walletData && (
        <>
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
                  {(targetGoal - walletData.balance).toFixed(2)} FLOW remaining until we can afford the flux capacitor!
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
    </Container>
  );
};

export default BuyMeADeloreanWindow;