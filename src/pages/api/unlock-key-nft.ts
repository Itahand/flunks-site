import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * API endpoint to unlock a Paradise Motel Key NFT
 * Transforms the key into its revealed form (Room 7 Access Pass, special item, etc.)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { walletAddress, nftId } = req.body;

  if (!walletAddress || !nftId) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: walletAddress, nftId'
    });
  }

  try {
    console.log('🔑 Unlocking key NFT for:', walletAddress, 'NFT ID:', nftId);

    // Define the revealed metadata
    // You can customize this based on what the key unlocks!
    const revealedMetadata = {
      name: 'Paradise Motel - Room 7 Access Pass',
      description: 'Exclusive access granted to the mysterious Room 7. This pass unlocks secrets hidden within the Paradise Motel.',
      image: 'https://storage.googleapis.com/flunks_public/revealed/room7-pass.png', // Update with your image
      revealed: 'true',
      type: 'access_pass',
      location: 'paradise_motel_room7',
      rarity: 'legendary',
      original_item: 'paradise_motel_key',
      unlock_type: 'interactive',
      unlocked_at: new Date().toISOString(),
      special_ability: 'room7_access',
      glow: 'golden'
    };

    // Store unlock request in database for admin to process
    const { data, error } = await supabase
      .from('nft_reveal_requests')
      .insert({
        wallet_address: walletAddress,
        nft_id: nftId,
        reveal_type: 'key_unlock',
        new_metadata: revealedMetadata,
        status: 'pending',
        requested_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('✅ Unlock request created:', data);

    // In a production system, you might:
    // 1. Auto-process this via a worker
    // 2. Call the reveal transaction directly (with proper signing)
    // 3. Queue it for batch processing

    return res.status(200).json({
      success: true,
      message: 'Key unlocked! Your NFT is being transformed...',
      requestId: data.id,
      revealedMetadata
    });

  } catch (error: any) {
    console.error('❌ Error unlocking key:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to unlock key'
    });
  }
}
