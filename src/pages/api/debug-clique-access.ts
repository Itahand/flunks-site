import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { wallet } = req.query;

  if (!wallet || typeof wallet !== 'string') {
    return res.status(400).json({ 
      error: 'Wallet address required as query parameter' 
    });
  }

  try {
    console.log('🔍 Debug clique access for wallet:', wallet);

    // Import the lightweight clique checker
    const { getLightweightCliqueInfo } = await import('../../web3/script-get-clique-info');
    
    const cliqueInfo = await getLightweightCliqueInfo(wallet);
    
    console.log('📋 Raw clique info:', cliqueInfo);
    
    // Process cliques
    const cliques = new Set();
    const processedItems = [];
    
    if (cliqueInfo && Array.isArray(cliqueInfo)) {
      cliqueInfo.forEach((item: any) => {
        processedItems.push({
          tokenID: item.tokenID,
          collection: item.collection,
          clique: item.clique
        });
        
        if (item.clique) {
          cliques.add(item.clique.toUpperCase());
        }
      });
    }
    
    const access = {
      GEEK: cliques.has('GEEK') || cliques.has('GEEKS') || cliques.has('NERD') || cliques.has('NERDS'),
      JOCK: cliques.has('JOCK') || cliques.has('JOCKS') || cliques.has('ATHLETE') || cliques.has('ATHLETES'),
      PREP: cliques.has('PREP') || cliques.has('PREPS') || cliques.has('PREPPY'),
      FREAK: cliques.has('FREAK') || cliques.has('FREAKS') || cliques.has('OUTCAST') || cliques.has('OUTCASTS'),
      FLUNKO: true // Always granted
    };

    return res.status(200).json({
      success: true,
      wallet,
      totalItems: processedItems.length,
      uniqueCliques: Array.from(cliques),
      access,
      items: processedItems.slice(0, 10), // Show first 10 for debugging
      debug: {
        timestamp: new Date().toISOString(),
        itemsWithCliques: processedItems.filter((item: any) => item.clique).length,
        itemsWithoutCliques: processedItems.filter((item: any) => !item.clique).length
      }
    });

  } catch (error) {
    console.error('Error debugging clique access:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}