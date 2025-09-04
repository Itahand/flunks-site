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
      // Check if previous claim actually succeeded
      if (existingClaim[0].gum_transaction_successful === true) {
        console.log('⚠️ Wallet has already successfully claimed footballer reward');
        return res.status(400).json({ 
          success: false,
          message: 'You have already claimed this reward!' 
        });
      } else {
        // Previous claim failed - delete the failed record and allow retry
        console.log('🔄 Previous claim failed, allowing retry after cleanup...');
        await supabase
          .from('footballer_gum_claims')
          .delete()
          .eq('wallet_address', walletAddress)
          .eq('gum_transaction_successful', false);
        console.log('🗑️ Cleaned up failed claim record');
      }
    }

    // Award the GUM first (100 GUM for footballer flunks)
    const gumAmount = 100;
    console.log('💰 Attempting to award', gumAmount, 'GUM...');
    
    const gumResult = await awardGum(
      walletAddress,
      "footballer_flunk_bonus",
      { 
        reason: "One-time bonus for owning Footballer Flunk NFT",
        amount: gumAmount 
      }
    );

    console.log('💰 GUM award result:', gumResult);

    // Only record the claim if GUM was successfully awarded
    if (gumResult.success) {
      const { data: claimData, error: claimError } = await supabase
        .from('footballer_gum_claims')
        .insert([{
          wallet_address: walletAddress,
          gum_awarded: gumAmount,
          claimed_at: new Date().toISOString(),
          gum_transaction_successful: true
        }])
        .select();

      if (claimError) {
        console.error('❌ Error recording footballer claim (but GUM was awarded):', claimError);
        return res.status(200).json({ 
          success: true,
          gumAwarded: gumAmount,
          message: `Successfully awarded ${gumAmount} GUM! (Note: Claim tracking may have failed - you can still only claim once)`
        });
      }

      console.log('✅ Footballer claim processed successfully:', claimData);
      
      return res.status(200).json({ 
        success: true,
        gumAwarded: gumAmount,
        message: `Successfully awarded ${gumAmount} GUM for your Footballer Flunk!`,
        claimId: claimData?.[0]?.id
      });
    } else {
      // GUM award failed - don't record claim so they can try again
      console.error('❌ Failed to award GUM:', gumResult.error);
      return res.status(400).json({ 
        success: false,
        gumAwarded: 0,
        message: gumResult.error || 'Failed to award GUM. Please try again.'
      });
    }
    
  } catch (error) {
    console.error('❌ Failed to process footballer claim:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
}
