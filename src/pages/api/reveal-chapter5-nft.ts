import type { NextApiRequest, NextApiResponse } from 'next';
import * as fcl from '@onflow/fcl';

// Configure FCL for server-side
fcl.config()
  .put('accessNode.api', 'https://rest-mainnet.onflow.org')
  .put('flow.network', 'mainnet');

const ADMIN_ADDRESS = process.env.FLOW_ADMIN_ADDRESS || '0x807c3d470888cc48';
const ADMIN_PRIVATE_KEY = process.env.FLOW_ADMIN_PRIVATE_KEY;

/**
 * API endpoint to reveal a Chapter 5 NFT
 * Admin-only: Updates NFT metadata to "reveal" the image
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { userAddress, metadata } = req.body;

  if (!userAddress || !metadata) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: userAddress, metadata'
    });
  }

  if (!ADMIN_PRIVATE_KEY) {
    console.error('❌ FLOW_ADMIN_PRIVATE_KEY not set in environment');
    return res.status(500).json({
      success: false,
      message: 'Server configuration error'
    });
  }

  try {
    console.log('🎭 Revealing NFT for:', userAddress);
    console.log('📝 New metadata:', metadata);

    // Build metadata dictionary string for Cadence
    const metadataEntries = Object.entries(metadata)
      .map(([key, value]) => `"${key}": "${value}"`)
      .join(', ');

    const transaction = `
      import SemesterZero from 0x807c3d470888cc48
      
      transaction(userAddress: Address) {
        let adminRef: auth(SemesterZero.AdminCapability) &SemesterZero.Admin
        
        prepare(signer: auth(BorrowValue) &Account) {
          // Borrow admin resource
          self.adminRef = signer.storage.borrow<auth(SemesterZero.AdminCapability) &SemesterZero.Admin>(
            from: SemesterZero.AdminStoragePath
          ) ?? panic("Could not borrow admin reference")
        }
        
        execute {
          // Update the NFT metadata
          let newMetadata: {String: String} = {${metadataEntries}}
          
          self.adminRef.revealChapter5NFT(
            userAddress: userAddress,
            newMetadata: newMetadata
          )
          
          log("✨ NFT revealed successfully!")
        }
      }
    `;

    // For server-side, use Flow CLI or execute via admin wallet
    // This is a placeholder - you'll need to implement proper server-side signing
    // Option 1: Use Flow CLI via child_process
    // Option 2: Use a service account with @onflow/fcl server-side auth
    // Option 3: Have admin sign via UI (not automated)
    
    console.log('📋 Transaction ready to execute');
    console.log('🔑 Admin address:', ADMIN_ADDRESS);
    console.log('📝 Transaction code prepared');

    // For now, return the transaction for manual execution
    // You can implement automated signing later
    return res.status(200).json({
      success: true,
      message: 'Reveal transaction prepared. Execute manually for now.',
      transaction,
      userAddress,
      metadata,
      note: 'Server-side signing not yet implemented. Use Flow CLI or admin UI.'
    });

  } catch (error: any) {
    console.error('❌ Error revealing NFT:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to reveal NFT'
    });
  }
}
