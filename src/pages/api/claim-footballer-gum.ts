import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';
import { awardGum } from '../../utils/gumAPI';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  try {
    console.log('🏈 Processing footballer GUM claim for wallet:', walletAddress.slice(0, 10) + '...');
    
    // First check if already claimed
    const { data: existingClaim, error: checkError } = await supabase
      .from('footballer_gum_claims')
      .select('*')
      .eq('wallet_address', walletAddress)
      .limit(1);

    if (checkError) {
      console.error('❌ Error checking existing claim:', checkError);
      return res.status(500).json({ error: 'Database error' });
    }

    if (existingClaim && existingClaim.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'You have already claimed this reward!' 
      });
    }

    // Award the GUM (100 GUM for footballer flunks)
    const gumAmount = 100;
    const gumResult = await awardGum(
      walletAddress,
      "footballer_flunk_bonus",
      { 
        reason: "One-time bonus for owning Footballer Flunk NFT",
        amount: gumAmount 
      }
    );

    // Record the claim in our tracking table
    const { data: claimData, error: claimError } = await supabase
      .from('footballer_gum_claims')
      .insert([{
        wallet_address: walletAddress,
        gum_awarded: gumAmount,
        claimed_at: new Date().toISOString(),
        gum_transaction_successful: gumResult.success
      }])
      .select();

    if (claimError) {
      console.error('❌ Error recording footballer claim:', claimError);
      // Still return success if GUM was awarded even if tracking failed
      return res.status(200).json({ 
        success: gumResult.success,
        gumAwarded: gumResult.success ? gumAmount : 0,
        message: gumResult.success 
          ? `Successfully awarded ${gumAmount} GUM! (Note: Claim tracking may have failed)`
          : 'Failed to award GUM'
      });
    }

    console.log('✅ Footballer claim processed successfully:', claimData);

    return res.status(200).json({ 
      success: gumResult.success,
      gumAwarded: gumResult.success ? gumAmount : 0,
      message: gumResult.success 
        ? `Successfully awarded ${gumAmount} GUM for your Footballer Flunk!`
        : 'Failed to award GUM',
      claimId: claimData?.[0]?.id
    });
    
  } catch (error) {
    console.error('❌ Failed to process footballer claim:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
}
