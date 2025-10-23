import { NextApiRequest, NextApiResponse } from 'next';
import { awardGum } from '../../utils/gumAPI';

/**
 * Halloween GumDrop Claim API
 * 
 * Flow:
 * 1. Blockchain transaction already verified eligibility
 * 2. Award 100 GUM using the gumAPI utility
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { walletAddress, gumAmount, transactionId } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address required' });
  }

  if (!gumAmount || gumAmount !== 100) {
    return res.status(400).json({ error: 'Invalid GUM amount' });
  }

  try {
    // Award Halloween GumDrop bonus
    const result = await awardGum(walletAddress, 'HALLOWEEN_GUMDROP', {
      source: 'halloween_pumpkin_button',
      timestamp: new Date().toISOString(),
      transactionId: transactionId || 'unknown'
    });

    if (result.success && result.earned > 0) {
      console.log(`✅ Halloween GumDrop: ${walletAddress} claimed ${result.earned} GUM (TX: ${transactionId})`);
      
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
