import React from 'react';
import { useUnifiedWallet } from '../contexts/UnifiedWalletContext';
import { Button } from 'react95';

interface WalletStatusBarProps {
  onDisconnect?: () => void;
  compact?: boolean;
}

const WalletStatusBar: React.FC<WalletStatusBarProps> = ({ onDisconnect, compact = false }) => {
  const { isConnected, address, walletType, disconnect } = useUnifiedWallet();

  if (!isConnected || !address) {
    return null;
  }

  const handleDisconnect = async () => {
    if (confirm('Disconnect wallet? You will need to reconnect to access your locker and other features.')) {
      await disconnect();
      if (onDisconnect) {
        onDisconnect();
      }
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: compact ? '8px' : '10px',
      background: 'rgba(0, 0, 0, 0.7)',
      padding: compact ? '6px 10px' : '8px 12px',
      borderRadius: '6px',
      fontSize: compact ? '11px' : '12px',
      color: 'white',
      fontFamily: 'w95fa, "Courier New", monospace'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: compact ? '14px' : '16px' }}>
          {walletType === 'dynamic' ? '💎' : '🌊'}
        </span>
        <span style={{ opacity: 0.9, fontSize: compact ? '10px' : '11px' }}>
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      </div>
      
      {compact ? (
        <button
          onClick={handleDisconnect}
          style={{
            background: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '3px 8px',
            borderRadius: '3px',
            fontSize: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontFamily: 'w95fa, "Courier New", monospace'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#c82333'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#dc3545'}
        >
          🚪
        </button>
      ) : (
        <Button
          onClick={handleDisconnect}
          size="sm"
          style={{
            fontSize: '10px',
            padding: '2px 8px',
            fontFamily: 'w95fa, "Courier New", monospace'
          }}
        >
          🚪 Disconnect
        </Button>
      )}
    </div>
  );
};

export default WalletStatusBar;
