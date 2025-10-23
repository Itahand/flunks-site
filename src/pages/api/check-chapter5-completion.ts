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

    // Check 2: Overachiever - All objectives complete
    // TODO: Add your actual weekly objectives completion check
    // For now, checking if user has completed at least 5 objectives
    const { data: objectives, error: objectivesError } = await supabase
      .from('weekly_objectives')
      .select('*')
      .eq('wallet_address', address)
      .eq('completed', true);

    if (objectivesError) {
      throw objectivesError;
    }

    // Overachiever requires ALL objectives complete
    // Adjust this logic based on your actual requirements
    const overachieverComplete = objectives && objectives.length >= 5;

    return res.status(200).json({
      success: true,
      slackerComplete,
      overachieverComplete,
      isFullyComplete: slackerComplete && overachieverComplete,
      details: {
        room7Visits: room7Visits?.length || 0,
        objectivesCompleted: objectives?.length || 0,
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
