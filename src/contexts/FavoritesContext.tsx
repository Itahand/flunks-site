import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Load favorite from database and localStorage as fallback
  const loadFavoriteFlunk = async (walletAddress: string) => {
    console.log('🔄 [FavoritesContext] Loading favorite for wallet:', walletAddress);
    setIsLoading(true);
    try {
      // First try to load from database
      const response = await fetch(`/api/favorite-flunk?wallet_address=${walletAddress}`);
      if (response.ok) {
        const data = await response.json();
        if (data.favoriteFlunk) {
          console.log('✅ [FavoritesContext] Loaded favorite flunk from database:', data.favoriteFlunk);
          setFavoriteFlunkState(data.favoriteFlunk);
          // Also save to localStorage as cache
          localStorage.setItem('flunks_favorite', JSON.stringify(data.favoriteFlunk));
          setIsLoading(false);
          return;
        }
      } else {
        console.warn('⚠️ [FavoritesContext] Database request failed, using localStorage fallback');
      }
      
      // Fallback to localStorage if database fails or no data
      const stored = localStorage.getItem('flunks_favorite');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Verify this localStorage data is for the current wallet
        if (parsed.walletAddress === walletAddress) {
          console.log('📱 [FavoritesContext] Loaded favorite flunk from localStorage:', parsed);
          setFavoriteFlunkState(parsed);
          // Try to save to database for future syncing
          saveFavoriteToDatabase(parsed);
        } else {
          // Clear localStorage if it's for a different wallet
          console.log('🗑️ [FavoritesContext] Clearing localStorage - different wallet');
          localStorage.removeItem('flunks_favorite');
          setFavoriteFlunkState(null);
        }
      } else {
        console.log('📭 [FavoritesContext] No favorite found');
        setFavoriteFlunkState(null);
      }
    } catch (error) {
      console.warn('⚠️ [FavoritesContext] Failed to load favorite flunk, falling back to localStorage:', error);
      // Final fallback to localStorage
      try {
        const stored = localStorage.getItem('flunks_favorite');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.walletAddress === walletAddress) {
            setFavoriteFlunkState(parsed);
          }
        }
      } catch (localError) {
        console.warn('Failed to load from localStorage:', localError);
      }
    }
    setIsLoading(false);
  };

  // Save favorite to database
  const saveFavoriteToDatabase = async (flunk: FavoriteFlunk | null) => {
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
  };

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
  const setFavoriteFlunk = async (flunk: FavoriteFlunk | null) => {
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
  };

  const isFavorite = (tokenId: string, walletAddress: string) => {
    return favoriteFlunk?.tokenId === tokenId && favoriteFlunk?.walletAddress === walletAddress;
  };

  const clearFavorite = async () => {
    await setFavoriteFlunk(null);
  };

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
