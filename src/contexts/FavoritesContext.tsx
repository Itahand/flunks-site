import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface FavoriteFlunk {
  tokenId: string;
  serialNumber: string;
  name: string;
  imageUrl: string;
  pixelUrl?: string;
  clique?: string;
  walletAddress: string;
}

interface FavoritesContextType {
  favoriteFlunk: FavoriteFlunk | null;
  setFavoriteFlunk: (flunk: FavoriteFlunk | null) => Promise<void>;
  isFavorite: (tokenId: string, walletAddress: string) => boolean;
  clearFavorite: () => Promise<void>;
  loadFavoriteFlunk: (walletAddress: string) => Promise<void>;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteFlunk, setFavoriteFlunkState] = useState<FavoriteFlunk | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentWalletAddress, setCurrentWalletAddress] = useState<string>('');

  // Save favorite to database
  const saveFavoriteToDatabase = useCallback(async (flunk: FavoriteFlunk | null) => {
    if (!flunk?.walletAddress) return;
    
    try {
      const response = await fetch('/api/favorite-flunk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_address: flunk.walletAddress,
          favorite_flunk_data: flunk
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          console.log('✅ Saved favorite flunk to database');
        } else {
          console.warn('⚠️ Database save failed, using localStorage fallback:', result.message);
        }
      } else {
        console.warn('⚠️ Failed to save favorite flunk to database, HTTP error:', response.status);
      }
    } catch (error) {
      console.warn('⚠️ Error saving favorite flunk to database, using localStorage fallback:', error);
    }
  }, []);

  // Load favorite from database and localStorage as fallback
  const loadFavoriteFlunk = useCallback(async (walletAddress: string) => {
    // Prevent concurrent loads
    if (isLoading) {
      console.log('🚫 [FavoritesContext] Already loading, skipping request for:', walletAddress);
      return;
    }

    console.log('🔄 [FavoritesContext] Loading favorite for wallet:', walletAddress);
    setIsLoading(true);
    
    // Update the current wallet address
    setCurrentWalletAddress(walletAddress);
    
    try {
      // First try to load from database
      console.log('🌐 [FavoritesContext] Attempting to load from database...');
      const response = await fetch(`/api/favorite-flunk?wallet_address=${walletAddress}`);
      console.log('📡 [FavoritesContext] Database response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 [FavoritesContext] Database response data:', data);
        
        if (data.favoriteFlunk) {
          console.log('✅ [FavoritesContext] Loaded favorite flunk from database:', data.favoriteFlunk);
          setFavoriteFlunkState(data.favoriteFlunk);
          // Also save to localStorage as cache
          localStorage.setItem('flunks_favorite', JSON.stringify(data.favoriteFlunk));
          setIsLoading(false);
          return;
        } else {
          console.log('📭 [FavoritesContext] No favorite found in database, checking localStorage...');
        }
      } else {
        console.warn('⚠️ [FavoritesContext] Database request failed:', response.status, response.statusText);
      }
    } catch (dbError) {
      console.warn('❌ [FavoritesContext] Database request error:', dbError);
    }
    
    // Fallback to localStorage
    try {
      console.log('📱 [FavoritesContext] Checking localStorage fallback...');
      const stored = localStorage.getItem('flunks_favorite');
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('📱 [FavoritesContext] Found in localStorage:', parsed);
        
        // Verify this localStorage data is for the current wallet
        if (parsed.walletAddress === walletAddress) {
          console.log('✅ [FavoritesContext] Using localStorage favorite (wallet match)');
          setFavoriteFlunkState(parsed);
          // Try to save to database for future syncing
          saveFavoriteToDatabase(parsed);
        } else {
          console.log('� [FavoritesContext] Wallet mismatch, but attempting to use stored favorite anyway');
          console.log('Current wallet:', walletAddress, 'Stored wallet:', parsed.walletAddress);
          
          // Update the wallet address to current wallet and use the favorite
          const updatedFavorite = { ...parsed, walletAddress: walletAddress };
          console.log('✅ [FavoritesContext] Using localStorage favorite with updated wallet');
          setFavoriteFlunkState(updatedFavorite);
          
          // Save the updated favorite to localStorage and database
          localStorage.setItem('flunks_favorite', JSON.stringify(updatedFavorite));
          saveFavoriteToDatabase(updatedFavorite);
        }
      } else {
        console.log('📭 [FavoritesContext] No favorite found in localStorage either');
        setFavoriteFlunkState(null);
      }
    } catch (localError) {
      console.error('❌ [FavoritesContext] localStorage fallback error:', localError);
      setFavoriteFlunkState(null);
    } finally {
      // Always set loading to false, regardless of outcome
      console.log('🏁 [FavoritesContext] Setting isLoading to false');
      setIsLoading(false);
    }
  }, [isLoading, saveFavoriteToDatabase]); // Include isLoading in dependencies

  // Load favorite from database and localStorage as fallback

  // Load favorite from localStorage on mount (will be replaced by wallet-based loading)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('flunks_favorite');
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavoriteFlunkState(parsed);
        console.log('📱 Loaded initial favorite from localStorage:', parsed);
      }
    } catch (error) {
      console.warn('Failed to load favorite Flunk from localStorage:', error);
    }
  }, []);

  // Enhanced setFavoriteFlunk that saves to both localStorage and database
  const setFavoriteFlunk = useCallback(async (flunk: FavoriteFlunk | null) => {
    console.log('💾 [FavoritesContext] Setting favorite flunk:', flunk);
    setFavoriteFlunkState(flunk);
    
    // Save to localStorage for immediate access (wallet-specific)
    try {
      if (flunk) {
        // Save to both wallet-specific key and generic key for backward compatibility
        localStorage.setItem(`flunks_favorite_${flunk.walletAddress}`, JSON.stringify(flunk));
        localStorage.setItem('flunks_favorite', JSON.stringify(flunk));
        console.log('✅ [FavoritesContext] Saved to localStorage:', flunk.name);
      } else {
        // Clear both keys when removing favorite
        if (currentWalletAddress) {
          localStorage.removeItem(`flunks_favorite_${currentWalletAddress}`);
        }
        localStorage.removeItem('flunks_favorite');
        console.log('🗑️ [FavoritesContext] Cleared localStorage');
      }
    } catch (error) {
      console.warn('Failed to save favorite Flunk to localStorage:', error);
    }

    // Save to database for cross-device sync
    await saveFavoriteToDatabase(flunk);
  }, [currentWalletAddress, saveFavoriteToDatabase]);

  const isFavorite = useCallback((tokenId: string, walletAddress: string) => {
    return favoriteFlunk?.tokenId === tokenId && favoriteFlunk?.walletAddress === walletAddress;
  }, [favoriteFlunk]);

  const clearFavorite = useCallback(async () => {
    await setFavoriteFlunk(null);
  }, [setFavoriteFlunk]);

  return (
    <FavoritesContext.Provider 
      value={{ 
        favoriteFlunk, 
        setFavoriteFlunk, 
        isFavorite, 
        clearFavorite,
        loadFavoriteFlunk,
        isLoading
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
