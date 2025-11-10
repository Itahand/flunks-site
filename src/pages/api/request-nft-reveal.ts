import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * API endpoint for users to request NFT reveal
 * Stores the request in database for admin to process
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({
      success: false,
      message: 'Missing required field: walletAddress'
    });
  }

  try {
    // Check if user already has a pending reveal request
    const { data: existing, error: checkError } = await supabase
      .from('nft_reveal_requests')
      .select('*')
      .eq('wallet_address', walletAddress)
      .eq('status', 'pending')
      .single();

    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'You already have a pending reveal request!',
        existingRequest: true
      });
    }

    // Create new reveal request
    const { data, error } = await supabase
      .from('nft_reveal_requests')
      .insert({
        wallet_address: walletAddress,
        status: 'pending',
        requested_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('✅ Reveal request created:', data);

    return res.status(200).json({
      success: true,
      message: 'Reveal request submitted! Your NFT will be revealed shortly.',
      requestId: data.id
    });

  } catch (error: any) {
    console.error('❌ Error creating reveal request:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create reveal request'
    });
  }
}
