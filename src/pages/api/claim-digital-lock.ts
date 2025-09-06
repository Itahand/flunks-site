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
    console.log('🔐 Processing digital lock claim for wallet:', walletAddress.slice(0, 10) + '...');
    
    // First check if already claimed
    const { data: existingClaim, error: checkError } = await supabase
      .from('digital_lock_claims')
      .select('*')
      .eq('wallet_address', walletAddress)
      .eq('successfully_unlocked', true)
      .limit(1);

    if (checkError) {
      console.error('❌ Error checking existing digital lock claim:', checkError);
      return res.status(500).json({ error: 'Database error' });
    }

    if (existingClaim && existingClaim.length > 0) {
      console.log('⚠️ Wallet has already successfully unlocked the digital lock');
      return res.status(400).json({ 
        success: false,
        message: 'You have already unlocked this digital lock!' 
      });
    }

    // Record the successful unlock
    const { data: claimData, error: claimError } = await supabase
      .from('digital_lock_claims')
      .insert([{
        wallet_address: walletAddress,
        successfully_unlocked: true,
        unlocked_at: new Date().toISOString()
      }])
      .select();

    if (claimError) {
      console.error('❌ Error recording digital lock claim:', claimError);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to record digital lock unlock'
      });
    }

    console.log('✅ Digital lock claim recorded successfully:', claimData);
    
    return res.status(200).json({ 
      success: true,
      message: 'Digital lock successfully unlocked! The trunk reveals its secrets...',
      claimId: claimData?.[0]?.id
    });

  } catch (error) {
    console.error('❌ Error in digital lock claim process:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to process digital lock unlock'
    });
  }
}
