import { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { getWalletStakeInfo } from 'web3/script-get-wallet-stake-info';
import { getLightweightCliqueInfo } from 'web3/script-get-clique-info';
import { ObjectDetails } from 'contexts/StakingContext';
import { isFeatureEnabled } from '../utils/buildMode';
import { usePaginatedItems } from '../contexts/UserPaginatedItems';

export type CliqueType = 'GEEK' | 'JOCK' | 'PREP' | 'FREAK' | 'FLUNKO';

interface CliqueAccess {
  [key: string]: boolean;
}

interface UseCliqueAccessReturn {
  cliqueAccess: CliqueAccess;
  loading: boolean;
  error: string | null;
  hasAccess: (clique: CliqueType) => boolean;
  refreshAccess: () => Promise<void>;
  getUserCliques: () => CliqueType[];
}

/**
 * Hook to check user's clique access based on NFT ownership
 * Checks if the user owns NFTs with specific clique traits
 */
export const useCliqueAccess = (): UseCliqueAccessReturn => {
  const { primaryWallet } = useDynamicContext();
  const [cliqueAccess, setCliqueAccess] = useState<CliqueAccess>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use existing NFT data from context to avoid API calls
  const { allItems, isLoading: nftLoading } = usePaginatedItems();

  const walletAddress = primaryWallet?.address;

  const checkCliqueAccess = async () => {
    // Development bypass: Grant access to all cliques in build mode
    const walletBypassEnabled = isFeatureEnabled('enableWalletBypass');
    
    if (walletBypassEnabled) {
      console.log('🔧 DEV BYPASS: Granting access to all cliques for MyPlace testing');
      setCliqueAccess({
        GEEK: true,
        JOCK: true,
        PREP: true,
        FREAK: true,
      });
      setLoading(false);
      return;
    }

    if (!walletAddress) {
      setCliqueAccess({});
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🏠 Checking clique access for wallet:', walletAddress.slice(0, 8) + '...');
      
      // Initialize access object
      const access: CliqueAccess = {
        GEEK: false,
        JOCK: false,
        PREP: false,
        FREAK: false,
        FLUNKO: true, // Always grant access to Flunko
      };

      // Method 1: Try using existing NFT data from context (fastest)
      if (allItems && allItems.length > 0) {
        console.log('✅ Using cached NFT data for clique check:', allItems.length, 'items');
        
        allItems.forEach((item: any) => {
          if (item.traits?.traits) {
            item.traits.traits.forEach((trait: any) => {
              if (trait.name?.toLowerCase() === 'clique' || trait.name?.toLowerCase() === 'class') {
                const cliqueValue = trait.value?.toString().toUpperCase();
                
                // Map variations of clique names
                switch (cliqueValue) {
                  case 'GEEK':
                  case 'GEEKS':
                  case 'NERD':
                  case 'NERDS':
                    access.GEEK = true;
                    break;
                  case 'JOCK':
                case 'JOCKS':
                case 'ATHLETE':
                case 'ATHLETES':
                  access.JOCK = true;
                  break;
                case 'PREP':
                case 'PREPS':
                case 'PREPPY':
                  access.PREP = true;
                  break;
                case 'FREAK':
                case 'FREAKS':
                case 'OUTCAST':
                case 'OUTCASTS':
                  access.FREAK = true;
                  break;
                  case 'FLUNKO':
                    access.FLUNKO = true;
                    break;
                }
              }
            });
          }
        });

        console.log('✅ Clique access from cached data:', access);
        setCliqueAccess(access);
        
      } else {
        // Method 2: Fallback to lightweight API call if no cached data
        console.log('⚡ No cached data, trying lightweight clique check...');
        const cliqueInfo = await getLightweightCliqueInfo(walletAddress);
        
        if (cliqueInfo && Array.isArray(cliqueInfo)) {
          cliqueInfo.forEach((item: any) => {
            if (item.clique) {
              const cliqueValue = item.clique.toString().toUpperCase();
              
              switch (cliqueValue) {
                case 'GEEK':
                case 'GEEKS':
                case 'NERD':
                case 'NERDS':
                  access.GEEK = true;
                  break;
                case 'JOCK':
                case 'JOCKS':
                case 'ATHLETE':
                case 'ATHLETES':
                  access.JOCK = true;
                  break;
                case 'PREP':
                case 'PREPS':
                case 'PREPPY':
                  access.PREP = true;
                  break;
                case 'FREAK':
                case 'FREAKS':
                case 'OUTCAST':
                case 'OUTCASTS':
                  access.FREAK = true;
                  break;
                case 'FLUNKO':
                  access.FLUNKO = true;
                  break;
              }
            }
          });
        }
        
        console.log('✅ Clique access from lightweight API:', access);
        setCliqueAccess(access);
      }

    } catch (err) {
      console.error('❌ Error checking clique access:', err);
      setError(err instanceof Error ? err.message : 'Failed to check clique access');
      
      // Method 3: Emergency API fallback for known NFT holders
      try {
        console.log('🚨 Trying emergency clique access API...');
        const response = await fetch('/api/emergency-clique-access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ wallet: walletAddress })
        });
        
        if (response.ok) {
          const emergencyResult = await response.json();
          if (emergencyResult.success && emergencyResult.access) {
            console.log('✅ Emergency access granted:', emergencyResult.access);
            setCliqueAccess(emergencyResult.access);
            return;
          }
        }
      } catch (emergencyErr) {
        console.error('❌ Emergency API also failed:', emergencyErr);
      }
      
      // Final fallback: If we have NFT data but all APIs fail, grant access based on ownership
      if (allItems && allItems.length > 0) {
        console.log('🚨 All APIs failed but we have NFTs - granting emergency access');
        setCliqueAccess({
          GEEK: true,
          JOCK: true,
          PREP: true,
          FREAK: true,
          FLUNKO: true,
        });
      } else {
        setCliqueAccess({});
      }
    } finally {
      setLoading(false);
    }
  };

  // Refresh access when wallet changes or NFT data loads
  useEffect(() => {
    if (walletAddress) {
      checkCliqueAccess();
    }
  }, [walletAddress, allItems]);

  const hasAccess = (clique: CliqueType): boolean => {
    return !!cliqueAccess[clique];
  };

  const getUserCliques = (): CliqueType[] => {
    return Object.keys(cliqueAccess).filter(clique => 
      cliqueAccess[clique]
    ) as CliqueType[];
  };

  const refreshAccess = async () => {
    await checkCliqueAccess();
  };

  return {
    cliqueAccess,
    loading,
    error,
    hasAccess,
    refreshAccess,
    getUserCliques,
  };
};

export default useCliqueAccess;
