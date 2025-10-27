import { NextApiRequest, NextApiResponse } from 'next';
import { awardGum } from '../../utils/gumAPI';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Halloween GumDrop Claim API
 * 
 * Flow:
 * 1. Award 100 GUM using the gumAPI utility
 * 2. Update user profile with timezone (for day/night functionality)
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { walletAddress, gumAmount, transactionId, username, timezoneOffset } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address required' });
  }

  if (!gumAmount || gumAmount !== 100) {
    return res.status(400).json({ error: 'Invalid GUM amount' });
  }

  try {
    // Update user profile with timezone if provided
    if (timezoneOffset !== undefined && timezoneOffset !== null) {
      console.log(`📍 Updating timezone for ${walletAddress}: ${timezoneOffset}`);
      
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ timezone_offset: timezoneOffset })
        .eq('wallet_address', walletAddress);
      
      if (updateError) {
        console.warn('⚠️ Failed to update timezone:', updateError);
        // Don't fail the whole request if timezone update fails
      } else {
        console.log(`✅ Timezone updated: ${timezoneOffset} hours from UTC`);
      }
    }
    
    // Award Halloween GumDrop bonus
    const result = await awardGum(walletAddress, 'HALLOWEEN_GUMDROP', {
      source: 'halloween_pumpkin_button',
      timestamp: new Date().toISOString(),
      transactionId: transactionId || 'no-blockchain-tx',
      username: username || 'Unknown'
    });

    if (result.success && result.earned > 0) {
      console.log(`✅ Halloween GumDrop: ${walletAddress} claimed ${result.earned} GUM (TZ: ${timezoneOffset})`);
      
      return res.status(200).json({
        success: true,
        gumAwarded: result.earned,
        message: `Successfully claimed ${result.earned} GUM!`,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: result.error || 'Unable to claim GumDrop'
      });
    }
  } catch (error: any) {
    console.error('Error processing Halloween GumDrop claim:', error);
    return res.status(500).json({
      error: 'Failed to process claim',
      details: error.message,
    });
  }
}
