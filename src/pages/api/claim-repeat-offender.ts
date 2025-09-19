import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';
import { awardGum } from '../../utils/gumAPI';
import { trackRepeatOffenderClaim, checkRepeatOffenderEligibility } from '../../utils/repeatOffenderTracking';
import { checkFridayNightLightsClicked } from '../../utils/fridayNightLightsTracking';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  try {
    console.log('🏈 Processing Repeat Offender claim for wallet:', walletAddress.slice(0, 10) + '...');
    
    // First check if they've claimed Friday Night Lights (requirement)
    const hasClaimedFridayNights = await checkFridayNightLightsClicked(walletAddress);
    
    if (!hasClaimedFridayNights) {
      console.log('❌ User has not claimed Friday Night Lights yet');
      return res.status(400).json({ 
        success: false, 
        error: 'You must claim Friday Night Lights first before becoming a Repeat Offender!' 
      });
    }

    // Check eligibility (24-hour cooldown)
    const eligibility = await checkRepeatOffenderEligibility(walletAddress);
    
    if (!eligibility.canClaim) {
      console.log('❌ User not eligible for Repeat Offender claim yet');
      return res.status(400).json({ 
        success: false, 
        error: 'You must wait 24 hours between Repeat Offender claims!',
        timeRemaining: eligibility.timeRemaining,
        lastClaimTime: eligibility.lastClaimTime
      });
    }

    // Track the claim in database
    const tracked = await trackRepeatOffenderClaim(walletAddress);
    
    if (!tracked) {
      console.error('❌ Failed to track Repeat Offender claim');
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to track claim. Please try again.' 
      });
    }

    // Award 50 GUM
    const gumResult = await awardGum(walletAddress, "repeat_offender", { 
      amount: 50, 
      description: "Repeat Offender daily claim" 
    });

    if (!gumResult.success) {
      console.error('❌ Failed to award GUM for Repeat Offender claim');
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to award GUM. Please try again.' 
      });
    }

    console.log('✅ Repeat Offender claim processed successfully');
    return res.status(200).json({ 
      success: true, 
      gumAwarded: 50,
      message: 'You\'ve claimed your daily Repeat Offender reward!'
    });

  } catch (error) {
    console.error('❌ Error processing Repeat Offender claim:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}