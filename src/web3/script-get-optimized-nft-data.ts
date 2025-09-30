/**
 * HYBRID TRAIT CHECKING SOLUTION
 * 
 * This provides the performance benefits of lightweight trait checking 
 * while maintaining the data structure needed for authentication.
 */

import { getOwnerTokenIdsWhale } from './script-get-owner-token-ids-whale';
import { getLightweightCliqueInfo } from './script-get-clique-info';

export interface MinimalNFTData {
  owner: string;
  tokenID: string;
  MetadataViewsDisplay: {
    name: string;
    description: string;
    thumbnail: { url: string };
  };
  traits: {
    traits: Array<{
      name: string;
      value: string;
      displayType: null;
      rarity: null;
    }>;
  };
  serialNumber: string;
  stakingInfo: null;
  collection: string;
  rewards: number;
}

/**
 * Lightweight NFT data fetcher that maintains compatibility with heavy data structure
 * This gives you the performance benefit while preserving authentication
 */
export const getOptimizedNFTData = async (walletAddress: string): Promise<{
  flunks: MinimalNFTData[][];
  backpack: MinimalNFTData[][];
}> => {
  try {
    console.log('🚀 Using optimized NFT data fetching for wallet:', walletAddress);
    
    // Step 1: Get basic token counts (lightweight)
    const tokenData = await getOwnerTokenIdsWhale(walletAddress);
    
    if (!tokenData) {
      return { flunks: [], backpack: [] };
    }
    
    const flunksTokens = Array.isArray(tokenData.flunks) ? tokenData.flunks : [];
    const backpackTokens = Array.isArray(tokenData.backpack) ? tokenData.backpack : [];
    
    // Step 2: Get clique info (lightweight but structured)
    let cliqueInfo: any[] = [];
    try {
      cliqueInfo = await getLightweightCliqueInfo(walletAddress) || [];
    } catch (error) {
      console.warn('⚠️ Could not fetch clique info, using minimal data');
    }
    
    // Step 3: Create minimal but compatible data structure
    const createMinimalNFT = (tokenId: number, collection: 'Flunks' | 'Backpack', index: number): MinimalNFTData => {
      const cliqueData = cliqueInfo.find(c => c.tokenID === tokenId && c.collection === collection);
      
      const traits = [
        { name: 'Collection', value: collection, displayType: null, rarity: null }
      ];
      
      // Add clique trait if available (maintains functionality)
      if (cliqueData?.clique) {
        traits.push({ 
          name: 'Clique', 
          value: cliqueData.clique, 
          displayType: null, 
          rarity: null 
        });
      }
      
      return {
        owner: walletAddress,
        tokenID: tokenId.toString(),
        MetadataViewsDisplay: {
          name: `${collection} #${tokenId}`,
          description: '',
          thumbnail: { url: '' }
        },
        traits: { traits },
        serialNumber: index.toString(),
        stakingInfo: null,
        collection,
        rewards: 0
      };
    };
    
    // Step 4: Paginate the data (maintains existing pagination logic)
    const PAGE_SIZE = 40;
    
    const flunksData = flunksTokens.map((tokenId, index) => 
      createMinimalNFT(tokenId, 'Flunks', index)
    );
    
    const backpackData = backpackTokens.map((tokenId, index) => 
      createMinimalNFT(tokenId, 'Backpack', index)
    );
    
    // Paginate
    const flunksPages = [];
    for (let i = 0; i < flunksData.length; i += PAGE_SIZE) {
      flunksPages.push(flunksData.slice(i, i + PAGE_SIZE));
    }
    
    const backpackPages = [];
    for (let i = 0; i < backpackData.length; i += PAGE_SIZE) {
      backpackPages.push(backpackData.slice(i, i + PAGE_SIZE));
    }
    
    console.log('✅ Optimized data created:', {
      flunksPages: flunksPages.length,
      backpackPages: backpackPages.length,
      totalFlunks: flunksData.length,
      totalBackpacks: backpackData.length
    });
    
    return {
      flunks: flunksPages,
      backpack: backpackPages
    };
    
  } catch (error) {
    console.error('❌ Error in optimized NFT data fetching:', error);
    throw error;
  }
};

/**
 * Check if we should use optimized fetching based on NFT count
 */
export const shouldUseOptimizedFetching = (flunksCount: number, backpackCount: number): boolean => {
  const totalNFTs = flunksCount + backpackCount;
  const threshold = 20; // Use optimization for wallets with 20+ NFTs
  
  const shouldOptimize = totalNFTs >= threshold;
  
  console.log(`🤔 Should use optimization? ${shouldOptimize} (${totalNFTs} NFTs, threshold: ${threshold})`);
  
  return shouldOptimize;
};