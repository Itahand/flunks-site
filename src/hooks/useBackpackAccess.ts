import { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { getWalletStakeInfo } from 'web3/script-get-wallet-stake-info';
import { ObjectDetails } from 'contexts/StakingContext';

export type BackpackBaseType = 'Teddy' | 'Skull' | 'Cat' | 'Robot' | 'Alien';
export type BackpackColorType = 'Orange' | 'Blue' | 'Red' | 'Green' | 'Purple' | 'Yellow' | 'Pink' | 'Black';

interface BackpackTraits {
  base: BackpackBaseType | null;
  primary: BackpackColorType | null;
  secondary: BackpackColorType | null;
  tertiary: BackpackColorType | null;
  slots: number | null;
}

interface BackpackAccess {
  hasBackpack: boolean;
  traits: BackpackTraits[];
  totalSlots: number;
}

interface UseBackpackAccessReturn {
  backpackAccess: BackpackAccess;
  loading: boolean;
  error: string | null;
  hasBackpackWithTrait: (traitName: keyof BackpackTraits, traitValue: string | number) => boolean;
  hasBackpackBase: (base: BackpackBaseType) => boolean;
  hasBackpackColor: (color: BackpackColorType) => boolean;
  hasMinimumSlots: (minSlots: number) => boolean;
  refreshAccess: () => Promise<void>;
  getTotalSlots: () => number;
}

/**
 * Hook to check user's backpack access based on NFT ownership and traits
 * Checks if the user owns backpack NFTs with specific traits
 */
export const useBackpackAccess = (): UseBackpackAccessReturn => {
  const { primaryWallet } = useDynamicContext();
  const [backpackAccess, setBackpackAccess] = useState<BackpackAccess>({
    hasBackpack: false,
    traits: [],
    totalSlots: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const walletAddress = primaryWallet?.address;

  const checkBackpackAccess = async () => {
    if (!walletAddress) {
      setBackpackAccess({
        hasBackpack: false,
        traits: [],
        totalSlots: 0
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get all user's NFTs with traits
      const stakeInfo = await getWalletStakeInfo(walletAddress);
      
      if (!stakeInfo || !Array.isArray(stakeInfo)) {
        console.warn('No stake info found for wallet:', walletAddress);
        setBackpackAccess({
          hasBackpack: false,
          traits: [],
          totalSlots: 0
        });
        return;
      }

      const backpackTraits: BackpackTraits[] = [];
      let totalSlots = 0;

      // Filter for backpack NFTs and extract traits
      stakeInfo.forEach((item: ObjectDetails) => {
        // Check if this is a backpack NFT
        const isBackpack = item.MetadataViewsDisplay?.name?.toLowerCase().includes('backpack') || 
                          item.collection?.toLowerCase().includes('backpack') ||
                          item.traits?.traits?.some((trait: any) => 
                            trait.name?.toLowerCase().includes('base') && 
                            ['teddy', 'skull', 'cat', 'robot', 'alien'].includes(trait.value?.toLowerCase())
                          );

        if (isBackpack && item.traits?.traits) {
          const traits: BackpackTraits = {
            base: null,
            primary: null,
            secondary: null,
            tertiary: null,
            slots: null
          };

          // Extract backpack traits
          item.traits.traits.forEach((trait: any) => {
            const traitName = trait.name?.toLowerCase();
            const traitValue = trait.value?.toString();

            switch (traitName) {
              case 'base':
                if (['Teddy', 'Skull', 'Cat', 'Robot', 'Alien'].includes(traitValue)) {
                  traits.base = traitValue as BackpackBaseType;
                }
                break;
              case 'primary':
                if (['Orange', 'Blue', 'Red', 'Green', 'Purple', 'Yellow', 'Pink', 'Black'].includes(traitValue)) {
                  traits.primary = traitValue as BackpackColorType;
                }
                break;
              case 'secondary':
                if (['Orange', 'Blue', 'Red', 'Green', 'Purple', 'Yellow', 'Pink', 'Black'].includes(traitValue)) {
                  traits.secondary = traitValue as BackpackColorType;
                }
                break;
              case 'tertiary':
                if (['Orange', 'Blue', 'Red', 'Green', 'Purple', 'Yellow', 'Pink', 'Black'].includes(traitValue)) {
                  traits.tertiary = traitValue as BackpackColorType;
                }
                break;
              case 'slots':
                const slotsNum = parseInt(traitValue);
                if (!isNaN(slotsNum)) {
                  traits.slots = slotsNum;
                  totalSlots += slotsNum;
                }
                break;
            }
          });

          backpackTraits.push(traits);
        }
      });

      setBackpackAccess({
        hasBackpack: backpackTraits.length > 0,
        traits: backpackTraits,
        totalSlots
      });

      console.log('Backpack access updated:', {
        hasBackpack: backpackTraits.length > 0,
        traits: backpackTraits,
        totalSlots
      });

    } catch (err) {
      console.error('Error checking backpack access:', err);
      setError(err instanceof Error ? err.message : 'Failed to check backpack access');
      setBackpackAccess({
        hasBackpack: false,
        traits: [],
        totalSlots: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const hasBackpackWithTrait = (traitName: keyof BackpackTraits, traitValue: string | number): boolean => {
    return backpackAccess.traits.some(traits => 
      traits[traitName] === traitValue
    );
  };

  const hasBackpackBase = (base: BackpackBaseType): boolean => {
    return backpackAccess.traits.some(traits => traits.base === base);
  };

  const hasBackpackColor = (color: BackpackColorType): boolean => {
    return backpackAccess.traits.some(traits => 
      traits.primary === color || 
      traits.secondary === color || 
      traits.tertiary === color
    );
  };

  const hasMinimumSlots = (minSlots: number): boolean => {
    return backpackAccess.totalSlots >= minSlots;
  };

  const getTotalSlots = (): number => {
    return backpackAccess.totalSlots;
  };

  const refreshAccess = async () => {
    await checkBackpackAccess();
  };

  // Auto-refresh when wallet changes
  useEffect(() => {
    checkBackpackAccess();
  }, [walletAddress]);

  return {
    backpackAccess,
    loading,
    error,
    hasBackpackWithTrait,
    hasBackpackBase,
    hasBackpackColor,
    hasMinimumSlots,
    refreshAccess,
    getTotalSlots
  };
};
