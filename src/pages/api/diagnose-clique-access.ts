import { NextApiRequest, NextApiResponse } from 'next';
import { getWalletStakeInfo } from '../../web3/script-get-wallet-stake-info';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ message: 'Wallet address is required' });
  }

  try {
    console.log('🔍 Diagnosing clique access for wallet:', walletAddress);
    
    // Get NFT data
    const startTime = Date.now();
    const stakeInfo = await getWalletStakeInfo(walletAddress);
    const fetchTime = Date.now() - startTime;
    
    console.log('📊 NFT fetch results:', {
      walletAddress,
      fetchTime: `${fetchTime}ms`,
      nftCount: stakeInfo?.length || 0,
      dataStructure: stakeInfo ? 'Valid' : 'Invalid'
    });

    // Analyze clique traits
    const cliqueAnalysis = {
      totalNFTs: stakeInfo?.length || 0,
      nftsWithTraits: 0,
      nftsWithCliqueTraits: 0,
      foundCliques: [],
      traitStructures: [],
      rawData: []
    };

    if (stakeInfo && Array.isArray(stakeInfo)) {
      stakeInfo.forEach((item: any, index: number) => {
        // Store first 3 items for debugging
        if (index < 3) {
          cliqueAnalysis.rawData.push({
            tokenId: item.tokenID,
            hasTraits: !!item.traits,
            traitsStructure: item.traits ? Object.keys(item.traits) : null,
            traitsArray: item.traits?.traits ? item.traits.traits.length : 0
          });
        }

        if (item.traits?.traits) {
          cliqueAnalysis.nftsWithTraits++;
          
          item.traits.traits.forEach((trait: any) => {
            cliqueAnalysis.traitStructures.push({
              name: trait.name,
              value: trait.value,
              type: typeof trait.value
            });

            if (trait.name?.toLowerCase() === 'clique' || trait.name?.toLowerCase() === 'class') {
              cliqueAnalysis.nftsWithCliqueTraits++;
              const cliqueValue = trait.value?.toString().toUpperCase();
              
              if (['GEEK', 'JOCK', 'PREP', 'FREAK'].includes(cliqueValue)) {
                if (!cliqueAnalysis.foundCliques.includes(cliqueValue)) {
                  cliqueAnalysis.foundCliques.push(cliqueValue);
                }
              }
            }
          });
        }
      });
    }

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      walletAddress,
      fetchTime: `${fetchTime}ms`,
      analysis: cliqueAnalysis,
      expectedAccess: {
        GEEK: cliqueAnalysis.foundCliques.includes('GEEK'),
        JOCK: cliqueAnalysis.foundCliques.includes('JOCK'), 
        PREP: cliqueAnalysis.foundCliques.includes('PREP'),
        FREAK: cliqueAnalysis.foundCliques.includes('FREAK')
      }
    });

  } catch (error) {
    console.error('❌ Clique access diagnostic error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      walletAddress
    });
  }
}