import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

/**
 * Check Chapter 5 Completion API
 * 
 * Checks Supabase for:
 * 1. Slacker: Paradise Motel Room 7 night visit
 * 2. Overachiever: All weekly objectives complete
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address } = req.query;

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  try {
    // Check 1: Slacker - Room 7 night visit
    const { data: room7Visits, error: room7Error } = await supabase
      .from('paradise_motel_room7_visits')
      .select('*')
      .eq('wallet_address', address)
      .eq('visit_type', 'night')
      .order('visited_at', { ascending: false })
      .limit(1);

    if (room7Error) {
      throw room7Error;
    }

    const slackerComplete = room7Visits && room7Visits.length > 0;

    // Check 2: Overachiever - Hidden Riff completion (which unlocks Picture Day voting)
    // The Overachiever objective requires completing the Hidden Riff guitar game
    // This is tracked in gum_transactions with source='hidden_riff'
    const { data: hiddenRiffData, error: hiddenRiffError } = await supabase
      .from('gum_transactions')
      .select('*')
      .eq('wallet_address', address)
      .eq('source', 'hidden_riff')
      .limit(1);

    if (hiddenRiffError) {
      console.error('Error checking Hidden Riff:', hiddenRiffError);
      // Don't throw - just mark as incomplete
    }

    const overachieverComplete = hiddenRiffData && hiddenRiffData.length > 0;

    return res.status(200).json({
      success: true,
      slackerComplete,
      overachieverComplete,
      isFullyComplete: slackerComplete && overachieverComplete,
      details: {
        room7Visits: room7Visits?.length || 0,
        hiddenRiffCompleted: hiddenRiffData?.length || 0,
      },
    });
  } catch (error: any) {
    console.error('Error checking Chapter 5 completion:', error);
    return res.status(500).json({
      error: 'Failed to check completion status',
      details: error.message,
    });
  }
}
