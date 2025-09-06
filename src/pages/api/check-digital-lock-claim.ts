import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  try {
    console.log('🔐 Checking digital lock claim status for wallet:', walletAddress.slice(0, 10) + '...');
    
    // Check if this wallet has already successfully unlocked the digital lock
    const { data: existingClaim, error: checkError } = await supabase
      .from('digital_lock_claims')
      .select('*')
      .eq('wallet_address', walletAddress)
      .eq('successfully_unlocked', true)
      .limit(1);

    if (checkError) {
      console.error('❌ Error checking digital lock claim status:', checkError);
      return res.status(500).json({ error: 'Database error checking claim status' });
    }

    const hasAlreadyClaimed = existingClaim && existingClaim.length > 0;

    console.log('🔍 Digital lock claim check result:', hasAlreadyClaimed ? 'Already claimed' : 'Available to claim');

    return res.status(200).json({ 
      success: true,
      hasAlreadyClaimed,
      message: hasAlreadyClaimed ? 'You have already unlocked this digital lock' : 'Digital lock available to unlock'
    });

  } catch (error) {
    console.error('❌ Error in digital lock claim check:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to check digital lock claim status'
    });
  }
}
