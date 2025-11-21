import type { NextApiRequest, NextApiResponse } from 'next';
import { awardGum } from '../../utils/gumAPI';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type ResponseData = {
  success: boolean;
  message?: string;
  gumEarned?: number;
  alreadyClaimed?: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { sequence } = req.body;
    const wallet = req.headers['x-wallet-address'] as string;

    // Verify the sequence is correct (C, G, Am, F - Let It Be)
    const correctSequence = ['C', 'G', 'Am', 'F'];
    const isCorrect = sequence.length === 4 && 
      sequence.every((chord, i) => chord === correctSequence[i]);

    if (!isCorrect) {
      return res.status(400).json({ success: false, message: 'Incorrect sequence' });
    }

    // If no wallet (test mode), just confirm the sequence is correct
    if (!wallet) {
      return res.status(200).json({ 
        success: true, 
        message: 'Correct sequence! (Test mode - no GUM awarded)',
        gumEarned: 0
      });
    }

    // Award GUM using the 'hidden_riff' source
    const result = await awardGum(wallet, 'hidden_riff', {
      source: 'hidden_riff_guitar',
      sequence: sequence.join('-'),
      timestamp: new Date().toISOString(),
    });

    if (result.success && result.earned > 0) {
      // Chapter 5 Overachiever tracked via gum_transactions with source='hidden_riff'
      // The gum transaction above is all we need
      return res.status(200).json({
        success: true,
        gumEarned: result.earned,
        message: 'Overachiever achievement unlocked!',
      });
    } else if (result.cooldown_remaining_minutes !== undefined && result.cooldown_remaining_minutes > 0) {
      return res.status(200).json({
        success: false,
        message: 'Already claimed!',
        alreadyClaimed: true,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: result.error || 'Already claimed or unable to award GUM',
        alreadyClaimed: true,
      });
    }
  } catch (error) {
    console.error('Error in claim-hidden-riff:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
