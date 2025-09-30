import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { usePaginatedItems } from './UserPaginatedItems';

interface AuthContextType {
  // Authentication state
  isAuthenticated: boolean;
  isWalletConnected: boolean;
  isUserConnected: boolean;
  walletAddress: string | null;
  
  // NFT data
  flunksCount: number;
  backpacksCount: number;
  hasFlunks: boolean;
  
  // Loading states
  isLoading: boolean;
  isDynamicLoading: boolean;
  
  // User data
  user: any;
  primaryWallet: any;
  
  // Helper functions
  requiresAuth: () => boolean;
  requiresFlunks: () => boolean;
  getAuthStatus: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, primaryWallet } = useDynamicContext();
  const [isLoading, setIsLoading] = useState(true);
  
  // CRITICAL FIX: Never wrap hooks in try/catch - causes React error #310
  // Always call hooks unconditionally to maintain stable hook order
  const paginatedData = usePaginatedItems();
  
  // Safe NFT data access after hook call with better fallbacks for data loading issues
  const flunksCount = paginatedData?.flunksCount ?? 0;
  const backpacksCount = paginatedData?.backpacksCount ?? 0;
  const nftLoading = paginatedData?.isLoading ?? false;
  const hasNftError = !!paginatedData?.error;
  
  // Determine authentication state
  const isWalletConnected = !!primaryWallet?.address;
  const isUserConnected = !!user;
  const isAuthenticated = isWalletConnected || isUserConnected;
  const walletAddress = primaryWallet?.address || null;
  
  // NFT data
  const hasFlunks = flunksCount > 0;
  
  // Loading states
  const isDynamicLoading = user === undefined && primaryWallet === undefined;
  const combinedLoading = isLoading || nftLoading || isDynamicLoading;
  
  // Handle initial loading
  useEffect(() => {
    // Set loading to false after Dynamic context has had time to initialize
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Log authentication state changes for debugging
  useEffect(() => {
    console.log('🔐 Auth Context State Update:', {
      isAuthenticated,
      isWalletConnected,
      isUserConnected,
      walletAddress,
      flunksCount,
      hasFlunks,
      hasNftError,
      nftLoading,
      isLoading: combinedLoading,
      paginatedDataError: paginatedData?.error,
      timestamp: new Date().toISOString()
    });
  }, [isAuthenticated, isWalletConnected, isUserConnected, walletAddress, flunksCount, hasFlunks, combinedLoading, hasNftError, nftLoading]);
  
  // Helper functions
  const requiresAuth = () => !isAuthenticated;
  const requiresFlunks = () => isAuthenticated && !hasFlunks;
  
  const getAuthStatus = (): string => {
    if (!isAuthenticated) return 'not_authenticated';
    if (!hasFlunks) return 'authenticated_no_nfts';
    return 'authenticated_with_nfts';
  };
  
  const contextValue: AuthContextType = {
    // Authentication state
    isAuthenticated,
    isWalletConnected,
    isUserConnected,
    walletAddress,
    
    // NFT data
    flunksCount,
    backpacksCount,
    hasFlunks,
    
    // Loading states
    isLoading: combinedLoading,
    isDynamicLoading,
    
    // User data
    user,
    primaryWallet,
    
    // Helper functions
    requiresAuth,
    requiresFlunks,
    getAuthStatus
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
