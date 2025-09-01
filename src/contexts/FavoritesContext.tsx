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
  setFavoriteFlunk: (flunk: FavoriteFlunk | null) => void;
  isFavorite: (tokenId: string, walletAddress: string) => boolean;
  clearFavorite: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteFlunk, setFavoriteFlunkState] = useState<FavoriteFlunk | null>(null);

  // Load favorite from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('flunks_favorite');
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavoriteFlunkState(parsed);
      }
    } catch (error) {
      console.warn('Failed to load favorite Flunk from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever favorite changes
  const setFavoriteFlunk = (flunk: FavoriteFlunk | null) => {
    setFavoriteFlunkState(flunk);
    try {
      if (flunk) {
        localStorage.setItem('flunks_favorite', JSON.stringify(flunk));
      } else {
        localStorage.removeItem('flunks_favorite');
      }
    } catch (error) {
      console.warn('Failed to save favorite Flunk to localStorage:', error);
    }
  };

  const isFavorite = (tokenId: string, walletAddress: string) => {
    return favoriteFlunk?.tokenId === tokenId && favoriteFlunk?.walletAddress === walletAddress;
  };

  const clearFavorite = () => {
    setFavoriteFlunk(null);
  };

  return (
    <FavoritesContext.Provider 
      value={{ 
        favoriteFlunk, 
        setFavoriteFlunk, 
        isFavorite, 
        clearFavorite 
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
