import React, { useEffect, useState } from 'react';
import { Frame } from 'react95';
import { useFavorites } from 'contexts/FavoritesContext';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

const FavoritesDiagnostic: React.FC = () => {
  const { favoriteFlunk, isLoading, loadFavoriteFlunk } = useFavorites();
  const { primaryWallet } = useDynamicContext();
  const [localStorageData, setLocalStorageData] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    // Check localStorage
    try {
      const stored = localStorage.getItem('flunks_favorite');
      if (stored) {
        setLocalStorageData(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error reading localStorage:', error);
    }

    // Update debug info
    const info = [
      `Wallet: ${primaryWallet?.address || 'Not connected'}`,
      `IsLoading: ${isLoading}`,
      `FavoriteFlunk: ${favoriteFlunk ? favoriteFlunk.name : 'null'}`,
      `LocalStorage: ${localStorageData ? localStorageData.name : 'null'}`,
    ].join(' | ');
    setDebugInfo(info);
  }, [favoriteFlunk, isLoading, primaryWallet?.address, localStorageData]);

  const handleManualTest = () => {
    const testFavorite = {
      tokenId: "999",
      serialNumber: "888",
      name: "Manual Test Flunk",
      imageUrl: "/images/icons/user.png",
      clique: "GEEK",
      walletAddress: primaryWallet?.address || 'test'
    };
    
    localStorage.setItem('flunks_favorite', JSON.stringify(testFavorite));
    console.log('🧪 Set manual test favorite');
    
    // Refresh the data
    if (primaryWallet?.address) {
      loadFavoriteFlunk(primaryWallet.address);
    }
  };

  return (
    <Frame variant="well" style={{ margin: '10px', padding: '10px', fontSize: '12px' }}>
      <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>🔍 Favorites Debug</div>
      <div style={{ marginBottom: '5px', wordBreak: 'break-all' }}>{debugInfo}</div>
      
      {favoriteFlunk ? (
        <div style={{ background: '#90EE90', padding: '5px', marginBottom: '5px' }}>
          ✅ Found: {favoriteFlunk.name} ({favoriteFlunk.clique})
        </div>
      ) : (
        <div style={{ background: '#FFB6C1', padding: '5px', marginBottom: '5px' }}>
          ❌ No favorite found
        </div>
      )}
      
      <button 
        onClick={handleManualTest}
        style={{ 
          padding: '5px 10px', 
          fontSize: '11px',
          background: '#4ECDC4',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer'
        }}
      >
        🧪 Set Test Favorite
      </button>
    </Frame>
  );
};

export default FavoritesDiagnostic;
