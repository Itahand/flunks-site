import { NextApiRequest, NextApiResponse } from 'next';
import { getOwnerTokenIdsWhale } from '../../web3/script-get-owner-token-ids-whale';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { wallet } = req.query;

  if (!wallet || typeof wallet !== 'string') {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  try {
    console.log('🔍 API: Getting Flunks count for wallet:', wallet);
    
    const result = await getOwnerTokenIdsWhale(wallet);
    
    if (!result || typeof result !== 'object') {
      console.warn('⚠️ API: Invalid data received:', result);
      return res.status(200).json({ flunksCount: 0 });
    }
    
    const flunks = Array.isArray(result.flunks) ? result.flunks : [];
    const backpack = Array.isArray(result.backpack) ? result.backpack : [];
    
    const flunksCount = flunks.length;
    const backpacksCount = backpack.length;
    
    console.log('✅ API: Flunks count retrieved:', flunksCount);
    
    // Set cache headers for 30 seconds
    res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
    
    res.status(200).json({ 
      flunksCount,
      backpacksCount,
      totalNFTs: flunksCount + backpacksCount,
      wallet 
    });
    
  } catch (error) {
    console.error('❌ API: Error fetching Flunks count:', error);
    res.status(500).json({ error: 'Failed to fetch NFT data' });
  }
}
