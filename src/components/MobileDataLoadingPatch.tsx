import React, { useEffect, useState, useCallback } from 'react';import React, { useEffect, useState } from 'react';

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

import { useFlunksCount } from '../hooks/useFlunksCount';import { usePaginatedItems } from 'contexts/UserPaginatedItems';

import * as fcl from '@onflow/fcl';import { useAuth } from 'contexts/AuthContext';



// Mobile data loading patch component// Mobile data loading patch component

// This component detects when mobile NFT data loading fails and applies comprehensive fixes including trait data// This component detects when mobile NFT data loading fails and applies fixes

export const MobileDataLoadingPatch: React.FC = () => {export const MobileDataLoadingPatch: React.FC = () => {

  const { primaryWallet, isAuthenticated } = useDynamicContext();  const { primaryWallet } = useDynamicContext();

  const { flunksCount, hasFlunks, refresh } = useFlunksCount();  const { flunksCount, refresh } = usePaginatedItems();

    const { hasFlunks, isAuthenticated } = useAuth();

  const [isMobile, setIsMobile] = useState(false);  const [patchApplied, setPatchApplied] = useState(false);

  const [patchApplied, setPatchApplied] = useState(false);  const [isMobile, setIsMobile] = useState(false);

  const [retryCount, setRetryCount] = useState(0);  const [retryCount, setRetryCount] = useState(0);



  // Detect mobile  // Detect mobile

  useEffect(() => {  useEffect(() => {

    const mobile = typeof window !== 'undefined' &&     const mobile = typeof window !== 'undefined' && 

      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(navigator.userAgent);      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(navigator.userAgent);

    setIsMobile(mobile);    setIsMobile(mobile);

  }, []);  }, []);



  // Monitor for mobile data loading issues - more aggressive detection  // Monitor for mobile data loading issues - more aggressive detection

  useEffect(() => {  useEffect(() => {

    if (!isMobile || !primaryWallet?.address || patchApplied) return;    if (!isMobile || !primaryWallet?.address || patchApplied) return;



    const timeouts: NodeJS.Timeout[] = [];    // Multiple check intervals for different scenarios

    const timeouts: NodeJS.Timeout[] = [];

    // Quick check - 3 seconds

    timeouts.push(setTimeout(() => {    // Quick check after 3 seconds

      if (!hasFlunks && isAuthenticated && primaryWallet?.address && retryCount < 4) {    timeouts.push(setTimeout(() => {

        console.log('🚨 Quick mobile data check - applying patch (attempt ' + (retryCount + 1) + ')');      if (isAuthenticated && flunksCount === 0 && !hasFlunks && retryCount < 2) {

        applyMobilePatch();        console.log('🚨 Quick mobile data check - applying patch (attempt ' + (retryCount + 1) + ')');

      }        applyMobilePatch();

    }, 3000));      }

    }, 3000));

    // Standard check - 5 seconds

    timeouts.push(setTimeout(() => {    // Standard check after 5 seconds

      if (flunksCount === 0 && isAuthenticated && primaryWallet?.address && retryCount < 4) {    timeouts.push(setTimeout(() => {

        console.log('🚨 Standard mobile data check - applying patch (attempt ' + (retryCount + 1) + ')');      if (isAuthenticated && flunksCount === 0 && !hasFlunks && retryCount < 3) {

        applyMobilePatch();        console.log('🚨 Standard mobile data check - applying patch (attempt ' + (retryCount + 1) + ')');

      }        applyMobilePatch();

    }, 5000));      }

    }, 5000));

    // Extended check - 10 seconds (force mode)

    timeouts.push(setTimeout(() => {    // Extended check after 10 seconds for stubborn cases

      if (retryCount < 4) {    timeouts.push(setTimeout(() => {

        console.log('🚨 Extended mobile data check - final patch attempt (attempt ' + (retryCount + 1) + ')');      if (flunksCount === 0 && !hasFlunks && retryCount < 4) {

        applyMobilePatch(true); // Force mode        console.log('🚨 Extended mobile data check - final patch attempt (attempt ' + (retryCount + 1) + ')');

      }        applyMobilePatch(true); // Force mode

    }, 10000));      }

    }, 10000));

    return () => timeouts.forEach(clearTimeout);

  }, [isMobile, primaryWallet?.address, flunksCount, hasFlunks, isAuthenticated, patchApplied, retryCount]);    return () => timeouts.forEach(clearTimeout);

  }, [isMobile, primaryWallet?.address, flunksCount, hasFlunks, isAuthenticated, patchApplied, retryCount]);

  const applyMobilePatch = useCallback(async (forceMode = false) => {

    if (retryCount >= 4 && !forceMode) {  const applyMobilePatch = async (forceMode = false) => {

      console.log('📵 Max retry attempts reached');    if (retryCount >= 4 && !forceMode) {

      return;      console.log('� Max retry attempts reached');

    }      return;

    }

    setRetryCount(prev => prev + 1);

    setRetryCount(prev => prev + 1);

    try {

      console.log('🔧 Applying comprehensive mobile patch... (attempt ' + retryCount + ')');    try {

            console.log('�🔧 Applying mobile data loading patch... (attempt ' + (retryCount + 1) + ')');

      const walletAddress = primaryWallet?.address;      

            // Try to manually fetch NFT data

      if (!walletAddress) {      const fcl = require('@onflow/fcl');

        console.log('❌ No wallet address available for patch');      const walletAddress = primaryWallet?.address;

        return;      

      }      if (!walletAddress) {

        console.log('❌ No wallet address available for patch');

      console.log('🔍 Querying blockchain for wallet:', walletAddress);        return;

      }

      // Step 1: Get NFT counts using HybridCustodyHelper

      const nftScript = `      console.log('🔍 Querying blockchain for wallet:', walletAddress);

        import HybridCustodyHelper from 0x807c3d470888cc48

      const nftScript = `

        access(all) fun main(address: Address): {String: [UInt64]} {        import HybridCustodyHelper from 0x807c3d470888cc48

          let flunksTokenIds = HybridCustodyHelper.getFlunksTokenIDsFromAllLinkedAccounts(ownerAddress: address)

          let backpackTokenIds = HybridCustodyHelper.getBackpackTokenIDsFromAllLinkedAccounts(ownerAddress: address)        access(all) fun main(address: Address): {String: [UInt64]} {

          let flunksTokenIds = HybridCustodyHelper.getFlunksTokenIDsFromAllLinkedAccounts(ownerAddress: address)

          return {          let backpackTokenIds = HybridCustodyHelper.getBackpackTokenIDsFromAllLinkedAccounts(ownerAddress: address)

            "flunks": flunksTokenIds,

            "backpack": backpackTokenIds          return {

          }            "flunks": flunksTokenIds,

        }            "backpack": backpackTokenIds

      `;          }

              }

      const result = await fcl.send([      `;

        fcl.script(nftScript),      

        fcl.args([fcl.arg(walletAddress, fcl.t.Address)])      const result = await fcl.send([

      ]).then(fcl.decode);        fcl.script(nftScript),

        fcl.args([fcl.arg(walletAddress, fcl.t.Address)])

      const actualFlunksCount = result?.flunks?.length || 0;      ]).then(fcl.decode);

      const actualBackpacksCount = result?.backpack?.length || 0;

      const actualFlunksCount = result?.flunks?.length || 0;

      console.log(`📊 Blockchain query result: ${actualFlunksCount} Flunks, ${actualBackpacksCount} Backpacks`);      const actualBackpacksCount = result?.backpack?.length || 0;



      // Step 2: Load comprehensive trait data for clique access      console.log(`📊 Blockchain query result: ${actualFlunksCount} Flunks, ${actualBackpacksCount} Backpacks`);

      console.log('🎭 Loading trait data for clique access...');

      const { getWalletStakeInfo } = await import('../web3/script-get-wallet-stake-info');      // Load comprehensive trait data for clique access

      const stakeInfo = await getWalletStakeInfo(walletAddress);      console.log('🎭 Loading trait data for clique access...');

            const { getWalletStakeInfo } = await import('../web3/script-get-wallet-stake-info');

      // Step 3: Process traits for clique access      const stakeInfo = await getWalletStakeInfo(walletAddress);

      const cliqueTraits: any[] = [];      

      const hasCliqueAccess = {      // Process traits for clique access

        GEEK: false,      const cliqueTraits: any[] = [];

        JOCK: false,      const hasCliqueAccess = {

        PREP: false,        GEEK: false,

        FREAK: false        JOCK: false,

      };        PREP: false,

        FREAK: false

      if (stakeInfo && Array.isArray(stakeInfo)) {      };

        console.log(`🔍 Analyzing traits from ${stakeInfo.length} NFTs...`);

        stakeInfo.forEach((item: any) => {      if (stakeInfo && Array.isArray(stakeInfo)) {

          if (item.traits?.traits) {        console.log(`🔍 Analyzing traits from ${stakeInfo.length} NFTs...`);

            item.traits.traits.forEach((trait: any) => {        stakeInfo.forEach((item: any) => {

              if (trait.name?.toLowerCase() === 'clique' || trait.name?.toLowerCase() === 'class') {          if (item.traits?.traits) {

                const cliqueValue = trait.value?.toString().toUpperCase();            item.traits.traits.forEach((trait: any) => {

                cliqueTraits.push({ tokenId: item.tokenID, clique: cliqueValue });              if (trait.name?.toLowerCase() === 'clique' || trait.name?.toLowerCase() === 'class') {

                                const cliqueValue = trait.value?.toString().toUpperCase();

                // Map clique access                cliqueTraits.push({ tokenId: item.tokenID, clique: cliqueValue });

                switch (cliqueValue) {                

                  case 'GEEK':                // Map clique access

                  case 'GEEKS':                switch (cliqueValue) {

                  case 'NERD':                  case 'GEEK':

                  case 'NERDS':                  case 'GEEKS':

                    hasCliqueAccess.GEEK = true;                  case 'NERD':

                    break;                  case 'NERDS':

                  case 'JOCK':                    hasCliqueAccess.GEEK = true;

                  case 'JOCKS':                    break;

                  case 'ATHLETE':                  case 'JOCK':

                  case 'ATHLETES':                  case 'JOCKS':

                    hasCliqueAccess.JOCK = true;                  case 'ATHLETE':

                    break;                  case 'ATHLETES':

                  case 'PREP':                    hasCliqueAccess.JOCK = true;

                  case 'PREPS':                    break;

                  case 'PREPPY':                  case 'PREP':

                    hasCliqueAccess.PREP = true;                  case 'PREPS':

                    break;                  case 'PREPPY':

                  case 'FREAK':                    hasCliqueAccess.PREP = true;

                  case 'FREAKS':                    break;

                  case 'OUTCAST':                  case 'FREAK':

                  case 'OUTCASTS':                  case 'FREAKS':

                    hasCliqueAccess.FREAK = true;                  case 'OUTCAST':

                    break;                  case 'OUTCASTS':

                }                    hasCliqueAccess.FREAK = true;

              }                    break;

            });                }

          }              }

        });            });

      }          }

        });

      console.log('🏠 Clique access detected:', {      }

        traits: cliqueTraits,

        access: hasCliqueAccess,      console.log('🏠 Clique access detected:', {

        totalNFTs: stakeInfo?.length || 0        traits: cliqueTraits,

      });        access: hasCliqueAccess,

        totalNFTs: stakeInfo?.length || 0

      // Step 4: Apply fix if we found NFTs but context doesn't have them      });

      if (actualFlunksCount > 0 && (flunksCount === 0 || forceMode)) {

        console.log('🔄 NFT mismatch detected - applying comprehensive mobile fix');      // If we found NFTs but context doesn't have them, apply aggressive fix

              if (actualFlunksCount > 0 && (flunksCount === 0 || forceMode)) {

        // Set comprehensive global override flags        console.log('🔄 NFT mismatch detected - applying aggressive mobile fix');

        (window as any).MOBILE_NFT_OVERRIDE = {        

          flunksCount: actualFlunksCount,        // Set global override flags that various components can check

          backpacksCount: actualBackpacksCount,        (window as any).MOBILE_NFT_OVERRIDE = {

          hasFlunks: true,          flunksCount: actualFlunksCount,

          walletAddress: walletAddress,          backpacksCount: actualBackpacksCount,

          timestamp: Date.now(),          hasFlunks: true,

          source: 'MobileDataLoadingPatch',          walletAddress: walletAddress,

          cliqueTraits,          timestamp: Date.now(),

          cliqueAccess: hasCliqueAccess,          source: 'MobileDataLoadingPatch',

          stakeInfo          cliqueTraits,

        };          cliqueAccess: hasCliqueAccess,

                  stakeInfo

        // Set individual flags for backward compatibility        };

        (window as any).MANUAL_NFT_COUNT = actualFlunksCount;        

        (window as any).MANUAL_HAS_FLUNKS = true;        // Set individual flags for backward compatibility

        (window as any).USER_FLUNKS_COUNT = actualFlunksCount;        (window as any).MANUAL_NFT_COUNT = actualFlunksCount;

        (window as any).USER_BACKPACK_COUNT = actualBackpacksCount;        (window as any).MANUAL_HAS_FLUNKS = true;

        (window as any).HAS_FLUNKS = true;        (window as any).USER_FLUNKS_COUNT = actualFlunksCount;

        (window as any).IS_AUTHENTICATED = true;        (window as any).USER_BACKPACK_COUNT = actualBackpacksCount;

        // Add trait-specific overrides        (window as any).HAS_FLUNKS = true;

        (window as any).USER_CLIQUE_ACCESS = hasCliqueAccess;        (window as any).IS_AUTHENTICATED = true;

        (window as any).USER_STAKE_INFO = stakeInfo;        // Add trait-specific overrides

        (window as any).FORCE_CLIQUE_ACCESS = true;        (window as any).USER_CLIQUE_ACCESS = hasCliqueAccess;

        (window as any).MOBILE_TRAITS_LOADED = true;        (window as any).USER_STAKE_INFO = stakeInfo;

        (window as any).FORCE_CLIQUE_ACCESS = true;

        // Store in localStorage for persistence        (window as any).MOBILE_TRAITS_LOADED = true;

        try {

          localStorage.setItem('mobile_nft_data', JSON.stringify({        // Store in localStorage for persistence

            flunksCount: actualFlunksCount,        try {

            backpacksCount: actualBackpacksCount,          localStorage.setItem('mobile_nft_data', JSON.stringify({

            walletAddress: walletAddress,            flunksCount: actualFlunksCount,

            timestamp: Date.now(),            backpacksCount: actualBackpacksCount,

            cliqueAccess: hasCliqueAccess,            walletAddress: walletAddress,

            cliqueTraits            timestamp: Date.now(),

          }));            cliqueAccess: hasCliqueAccess,

        } catch (e) {            cliqueTraits

          console.warn('Could not store mobile NFT data in localStorage:', e);          }));

        }        } catch (e) {

                  console.warn('Could not store mobile NFT data in localStorage:', e);

        // Force refresh the context multiple times        }

        refresh();        

        setTimeout(() => refresh(), 1000);        // Force refresh the context multiple times

        setTimeout(() => refresh(), 2000);        refresh();

                setTimeout(() => refresh(), 1000);

        // Dispatch multiple events for different components        setTimeout(() => refresh(), 2000);

        const eventDetail = {        

          flunksCount: actualFlunksCount,        // Dispatch multiple events for different components

          backpacksCount: actualBackpacksCount,        const eventDetail = {

          walletAddress,          flunksCount: actualFlunksCount,

          hasFlunks: true,          backpacksCount: actualBackpacksCount,

          cliqueAccess: hasCliqueAccess,          walletAddress,

          stakeInfo          hasFlunks: true,

        };          cliqueAccess: hasCliqueAccess,

          stakeInfo

        ['mobileNFTDataFixed', 'nftDataLoaded', 'authStateChanged', 'flunksCountUpdated', 'cliqueAccessRefresh'].forEach(eventName => {        };

          window.dispatchEvent(new CustomEvent(eventName, { detail: eventDetail }));

        });        ['mobileNFTDataFixed', 'nftDataLoaded', 'authStateChanged', 'flunksCountUpdated', 'cliqueAccessRefresh'].forEach(eventName => {

          window.dispatchEvent(new CustomEvent(eventName, { detail: eventDetail }));

        // Mark specific visual elements if they exist        });

        setTimeout(() => {

          const nftElements = document.querySelectorAll('[class*="nft"], [class*="flunk"], [data-testid*="nft"]');        // Mark specific visual elements if they exist

          nftElements.forEach(el => {        setTimeout(() => {

            if (el.textContent?.includes('0') || el.textContent?.includes('No')) {          const nftElements = document.querySelectorAll('[class*="nft"], [class*="flunk"], [data-testid*="nft"]');

              (el as HTMLElement).style.border = '2px solid #00ff00';          nftElements.forEach(el => {

              (el as HTMLElement).title = `Fixed: Should show ${actualFlunksCount} Flunks with ${Object.keys(hasCliqueAccess).filter(k => hasCliqueAccess[k]).join(', ')} access`;            if (el.textContent?.includes('0') || el.textContent?.includes('No')) {

            }              (el as HTMLElement).style.border = '2px solid #00ff00';

          });              (el as HTMLElement).title = `Fixed: Should show ${actualFlunksCount} Flunks`;

        }, 500);            }

          });

        // Mark body with comprehensive debug attributes        }, 1000);

        document.body.classList.add('mobile-nft-patch-applied');

        document.body.classList.add('mobile-traits-loaded');        setPatchApplied(true);

        document.body.setAttribute('data-mobile-flunks', actualFlunksCount.toString());        console.log('✅ Aggressive mobile data loading patch applied successfully');

        document.body.setAttribute('data-mobile-backpacks', actualBackpacksCount.toString());        console.log(`🎯 Set global flags: ${actualFlunksCount} Flunks, ${actualBackpacksCount} Backpacks`);

        document.body.setAttribute('data-mobile-cliques', JSON.stringify(Object.keys(hasCliqueAccess).filter(k => hasCliqueAccess[k])));      } else if (actualFlunksCount === 0) {

        document.body.setAttribute('data-mobile-traits-count', cliqueTraits.length.toString());        console.log('ℹ️ Manual fetch confirms: wallet genuinely has no Flunks');

        setPatchApplied(true);

        console.log('✅ Comprehensive mobile patch applied successfully:', {      } else {

          wallet: walletAddress,        console.log('ℹ️ NFT data appears correct, no patch needed');

          flunks: actualFlunksCount,        setPatchApplied(true);

          backpacks: actualBackpacksCount,      }

          cliqueAccess: hasCliqueAccess,

          traitsFound: cliqueTraits.length,    } catch (error) {

          patchNumber: retryCount      console.error('❌ Mobile data loading patch failed:', error);

        });      if (retryCount < 3) {

        console.log('🔄 Will retry mobile patch...');

        setPatchApplied(true);        setTimeout(() => applyMobilePatch(), 2000);

      }

      } else {    }

        console.log('👍 NFT counts match or no fix needed');  };

        setPatchApplied(true);            walletAddress

      }          }

        }));

    } catch (error) {

      console.error('❌ Mobile patch error:', error);        setPatchApplied(true);

    }        console.log('✅ Mobile data loading patch applied successfully');

  }, [primaryWallet?.address, flunksCount, hasFlunks, patchApplied, retryCount, refresh]);      } else {

        console.log('ℹ️ Manual fetch confirms: wallet has no Flunks');

  // Return null since this is just a background patch        setPatchApplied(true);

  return null;      }

};

    } catch (error) {

export default MobileDataLoadingPatch;      console.error('❌ Mobile data loading patch failed:', error);
    }
  };

  // This component doesn't render anything
  return null;
};

export default MobileDataLoadingPatch;
