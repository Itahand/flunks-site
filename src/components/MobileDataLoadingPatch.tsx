import React, { useEffect, useState } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { usePaginatedItems } from 'contexts/UserPaginatedItems';
import { useAuth } from 'contexts/AuthContext';

// Mobile data loading patch component
// This component detects when mobile NFT data loading fails and applies fixes
export const MobileDataLoadingPatch: React.FC = () => {
  const { primaryWallet } = useDynamicContext();
  const { flunksCount, refresh } = usePaginatedItems();
  const { hasFlunks, isAuthenticated } = useAuth();
  const [patchApplied, setPatchApplied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const mobile = typeof window !== 'undefined' && 
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(navigator.userAgent);
    setIsMobile(mobile);
  }, []);

  // Monitor for mobile data loading issues
  useEffect(() => {
    if (!isMobile || !primaryWallet?.address || patchApplied) return;

    // Check if we have a wallet but no NFT data after reasonable time
    const checkDataTimeout = setTimeout(() => {
      if (isAuthenticated && flunksCount === 0 && !hasFlunks) {
        console.log('🚨 Mobile data loading issue detected - applying patch');
        applyMobilePatch();
      }
    }, 5000); // Wait 5 seconds for data to load

    return () => clearTimeout(checkDataTimeout);
  }, [isMobile, primaryWallet?.address, flunksCount, hasFlunks, isAuthenticated, patchApplied]);

  const applyMobilePatch = async () => {
    try {
      console.log('🔧 Applying mobile data loading patch...');
      
      // Try to manually fetch NFT data
      const fcl = require('@onflow/fcl');
      const walletAddress = primaryWallet?.address;
      
      if (!walletAddress) {
        console.log('❌ No wallet address available for patch');
        return;
      }

      const nftScript = `
        import HybridCustodyHelper from 0x807c3d470888cc48

        access(all) fun main(address: Address): {String: [UInt64]} {
          let flunksTokenIds = HybridCustodyHelper.getFlunksTokenIDsFromAllLinkedAccounts(ownerAddress: address)
          let backpackTokenIds = HybridCustodyHelper.getBackpackTokenIDsFromAllLinkedAccounts(ownerAddress: address)

          return {
            "flunks": flunksTokenIds,
            "backpack": backpackTokenIds
          }
        }
      `;
      
      const result = await fcl.send([
        fcl.script(nftScript),
        fcl.args([fcl.arg(walletAddress, fcl.t.Address)])
      ]).then(fcl.decode);

      const actualFlunksCount = result?.flunks?.length || 0;
      const actualBackpacksCount = result?.backpack?.length || 0;

      console.log(`📊 Manual NFT fetch result: ${actualFlunksCount} Flunks, ${actualBackpacksCount} Backpacks`);

      // If we found NFTs but context doesn't have them, force refresh
      if (actualFlunksCount > 0 && flunksCount === 0) {
        console.log('🔄 Found NFTs via direct query - forcing context refresh');
        
        // Set manual override flags
        (window as any).MANUAL_NFT_COUNT = actualFlunksCount;
        (window as any).MANUAL_HAS_FLUNKS = true;
        
        // Force refresh the context
        refresh();
        
        // Dispatch events for other components
        window.dispatchEvent(new CustomEvent('mobileNFTDataFixed', {
          detail: {
            flunksCount: actualFlunksCount,
            backpacksCount: actualBackpacksCount,
            walletAddress
          }
        }));

        setPatchApplied(true);
        console.log('✅ Mobile data loading patch applied successfully');
      } else {
        console.log('ℹ️ Manual fetch confirms: wallet has no Flunks');
        setPatchApplied(true);
      }

    } catch (error) {
      console.error('❌ Mobile data loading patch failed:', error);
    }
  };

  // This component doesn't render anything
  return null;
};

export default MobileDataLoadingPatch;
