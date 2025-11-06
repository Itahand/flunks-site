import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import * as fcl from '@onflow/fcl';

interface UnifiedWalletContextType {
  // Connection state
  isConnected: boolean;
  address: string | null;
  
  // Wallet type
  walletType: 'dynamic' | 'fcl' | null;
  
  // Connection methods
  connectFCL: () => Promise<void>;
  disconnect: () => Promise<void>;
  
  // FCL user object (for Flow-specific operations)
  fclUser: any;
}

const UnifiedWalletContext = createContext<UnifiedWalletContextType | undefined>(undefined);

export const UnifiedWalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { primaryWallet, handleLogOut } = useDynamicContext();
  const [fclUser, setFclUser] = useState<any>(null);
  const [fclAddress, setFclAddress] = useState<string | null>(null);

  // Subscribe to FCL auth changes (config is already set in src/config/fcl.ts)
  useEffect(() => {
    console.log('🌊 UnifiedWalletContext: Subscribing to FCL auth (mainnet config from fcl.ts)');
    
    // Subscribe to FCL auth changes ONLY (won't trigger automatically)
    const unsubscribe = fcl.currentUser.subscribe((user: any) => {
      console.log('FCL user state changed:', user);
      
      if (user?.loggedIn && user?.addr) {
        setFclUser(user);
        setFclAddress(user.addr);
      } else {
        setFclUser(null);
        setFclAddress(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Connect to Flow wallet via FCL (explicit user action only)
  const connectFCL = useCallback(async () => {
    try {
      console.log('Explicitly connecting to Flow wallet...');
      try {
        const network = await fcl.config().get('flow.network');
        const accessNode = await fcl.config().get('accessNode.api');
        const discovery = await fcl.config().get('discovery.wallet');
        console.log('🔧 FCL config before authenticate:', {
          network,
          accessNode,
          discovery
        });
      } catch (configError) {
        console.warn('⚠️ Unable to read FCL config before authenticate:', configError);
      }
      await fcl.authenticate();
    } catch (error) {
      console.error('Error connecting to Flow wallet:', error);
      throw error;
    }
  }, []);

  // Unified disconnect
  const disconnect = useCallback(async () => {
    try {
      // Disconnect from Dynamic if connected
      if (primaryWallet) {
        await handleLogOut();
      }
      
      // Disconnect from FCL if connected
      if (fclUser?.loggedIn) {
        await fcl.unauthenticate();
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
      throw error;
    }
  }, [primaryWallet, fclUser, handleLogOut]);

  // Determine which wallet is connected and the unified address
  const walletType = primaryWallet ? 'dynamic' : (fclAddress ? 'fcl' : null);
  const address = primaryWallet?.address || fclAddress;
  const isConnected = !!(primaryWallet || fclAddress);

  const value: UnifiedWalletContextType = {
    isConnected,
    address,
    walletType,
    connectFCL,
    disconnect,
    fclUser,
  };

  return (
    <UnifiedWalletContext.Provider value={value}>
      {children}
    </UnifiedWalletContext.Provider>
  );
};

export const useUnifiedWallet = () => {
  const context = useContext(UnifiedWalletContext);
  if (context === undefined) {
    throw new Error('useUnifiedWallet must be used within a UnifiedWalletProvider');
  }
  return context;
};
