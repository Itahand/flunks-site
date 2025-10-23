import { NextApiRequest, NextApiResponse } from 'next';
import * as fcl from '@onflow/fcl';

/**
 * Get Flunk NFT Count API
 * 
 * Queries the Flunks NFT contract to get how many Flunks a user owns
 * Used for Halloween GumDrop calculation (10 GUM per Flunk)
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address } = req.query;

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  try {
    // Query Flunks NFT collection
    // TODO: Replace with actual Flunks NFT contract address
    const flunkCount = await fcl.query({
      cadence: `
        import NonFungibleToken from 0x1d7e57aa55817448
        
        // TODO: Import your actual Flunks NFT contract
        // import Flunks from 0xYOUR_FLUNKS_CONTRACT_ADDRESS
        
        access(all) fun main(address: Address): Int {
          let account = getAccount(address)
          
          // TODO: Replace with actual Flunks collection path
          // let collectionRef = account
          //   .capabilities.get<&Flunks.Collection>(Flunks.CollectionPublicPath)
          //   .borrow()
          
          // if let collection = collectionRef {
          //   return collection.getIDs().length
          // }
          
          // PLACEHOLDER: Return mock count for testing
          // Remove this and use actual Flunks NFT contract query
          return 3 // Mock: User owns 3 Flunks
        }
      `,
      args: (arg: any, t: any) => [arg(address, t.Address)],
    });

    return res.status(200).json({
      success: true,
      flunkCount: flunkCount || 0,
      address,
    });
  } catch (error: any) {
    console.error('Error fetching Flunk count:', error);
    
    // Return 0 if error (user likely doesn't have Flunks collection)
    return res.status(200).json({
      success: true,
      flunkCount: 0,
      address,
      error: error.message,
    });
  }
}
