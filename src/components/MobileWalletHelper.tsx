import React, { useEffect, useState } from 'react';
import { 
  isMobileDevice, 
  detectMobileWallets, 
  checkMobileWalletAvailability,
  getMobileWalletConnectionUrl 
} from '../utils/mobileWalletDetection';

interface MobileWalletHelperProps {
  onWalletSelected?: (walletType: string) => void;
  showDebugInfo?: boolean;
}

export const MobileWalletHelper: React.FC<MobileWalletHelperProps> = ({
  onWalletSelected,
  showDebugInfo = false
}) => {
  const [mobileInfo, setMobileInfo] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (isMobileDevice()) {
      const info = checkMobileWalletAvailability();
      setMobileInfo(info);
    }
  }, []);

  if (!isClient || !isMobileDevice()) return null;

  // Hide component if wallet is already available
  if (mobileInfo?.available) return null;

  const handleWalletDownload = (walletType: string) => {
    const urls = {
      'lilico': 'https://apps.apple.com/app/lilico/id1644110320', // iOS App Store
      'blocto': 'https://apps.apple.com/app/blocto/id1481181682',
      'dapper': 'https://accounts.meetdapper.com/'
    };

    const url = urls[walletType as keyof typeof urls];
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(45deg, #1e1e1e, #2d2d30, #1e1e1e)',
      border: '2px solid #00ffff',
      borderRadius: '4px',
      padding: '12px',
      margin: '10px 0',
      fontSize: '14px',
      fontFamily: "'Press Start 2P', 'MS Sans Serif', monospace",
      boxShadow: '0 0 20px rgba(0, 255, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      position: 'relative'
    }}>
      {/* Retro scanlines effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'repeating-linear-gradient(0deg, rgba(0, 255, 255, 0.05) 0px, rgba(0, 255, 255, 0.05) 1px, transparent 1px, transparent 2px)',
        pointerEvents: 'none',
        borderRadius: '4px'
      }} />

      <div style={{ 
        fontWeight: 'bold', 
        marginBottom: '12px',
        color: '#00ffff',
        textShadow: '0 0 10px rgba(0, 255, 255, 0.7), 2px 2px 0px #000',
        fontSize: '12px',
        textAlign: 'center',
        letterSpacing: '1px',
        position: 'relative',
        zIndex: 1
      }}>
        📱 MOBILE WALLET
      </div>
      
      {mobileInfo && !mobileInfo.available && (
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ 
            margin: '0 0 12px 0', 
            color: '#ff00ff',
            textShadow: '0 0 5px rgba(255, 0, 255, 0.5)',
            fontSize: '10px',
            lineHeight: '16px',
            textAlign: 'center'
          }}>
            NO WALLET DETECTED
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => handleWalletDownload('blocto')}
              style={{
                background: 'linear-gradient(180deg, #00ffff 0%, #0088ff 100%)',
                color: '#000',
                border: '2px solid #fff',
                padding: '10px 12px',
                borderRadius: '4px',
                fontSize: '10px',
                fontFamily: "'Press Start 2P', monospace",
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 4px 0 #004488, 0 0 10px rgba(0, 255, 255, 0.5)',
                textShadow: '1px 1px 0px rgba(255, 255, 255, 0.5)',
                transition: 'all 0.1s',
                position: 'relative'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(2px)';
                e.currentTarget.style.boxShadow = '0 2px 0 #004488, 0 0 10px rgba(0, 255, 255, 0.5)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 0 #004488, 0 0 10px rgba(0, 255, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 0 #004488, 0 0 10px rgba(0, 255, 255, 0.5)';
              }}
            >
              📲 BLOCTO WALLET
            </button>
            
            <button
              onClick={() => handleWalletDownload('lilico')}
              style={{
                background: 'linear-gradient(180deg, #00ff88 0%, #00aa55 100%)',
                color: '#000',
                border: '2px solid #fff',
                padding: '10px 12px',
                borderRadius: '4px',
                fontSize: '10px',
                fontFamily: "'Press Start 2P', monospace",
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 4px 0 #006633, 0 0 10px rgba(0, 255, 136, 0.5)',
                textShadow: '1px 1px 0px rgba(255, 255, 255, 0.5)',
                transition: 'all 0.1s',
                position: 'relative'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(2px)';
                e.currentTarget.style.boxShadow = '0 2px 0 #006633, 0 0 10px rgba(0, 255, 136, 0.5)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 0 #006633, 0 0 10px rgba(0, 255, 136, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 0 #006633, 0 0 10px rgba(0, 255, 136, 0.5)';
              }}
            >
              📲 LILICO/FLOW
            </button>
            
            <button
              onClick={() => handleWalletDownload('dapper')}
              style={{
                background: 'linear-gradient(180deg, #ff00ff 0%, #aa00aa 100%)',
                color: '#fff',
                border: '2px solid #fff',
                padding: '10px 12px',
                borderRadius: '4px',
                fontSize: '10px',
                fontFamily: "'Press Start 2P', monospace",
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 4px 0 #660066, 0 0 10px rgba(255, 0, 255, 0.5)',
                textShadow: '1px 1px 0px rgba(0, 0, 0, 0.8)',
                transition: 'all 0.1s',
                position: 'relative'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(2px)';
                e.currentTarget.style.boxShadow = '0 2px 0 #660066, 0 0 10px rgba(255, 0, 255, 0.5)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 0 #660066, 0 0 10px rgba(255, 0, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 0 #660066, 0 0 10px rgba(255, 0, 255, 0.5)';
              }}
            >
              🌐 DAPPER WALLET
            </button>
          </div>
        </div>
      )}

      {showDebugInfo && mobileInfo && (
        <details style={{ 
          marginTop: '10px', 
          fontSize: '8px', 
          opacity: 0.7,
          color: '#00ffff',
          position: 'relative',
          zIndex: 1
        }}>
          <summary style={{ cursor: 'pointer', userSelect: 'none' }}>DEBUG</summary>
          <pre style={{ 
            margin: '5px 0', 
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            fontSize: '8px'
          }}>
            {JSON.stringify(mobileInfo, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

export default MobileWalletHelper;
