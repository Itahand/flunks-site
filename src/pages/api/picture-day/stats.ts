import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

// Check if we're in build mode
const isBuildMode = process.env.NEXT_PUBLIC_BUILD_MODE === 'build';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Picture Day stats are now available in both build and public modes
  // Removed build mode restriction

  if (!supabase) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    // Get all cliques and their vote counts
    const cliques = ['preps', 'jocks', 'geeks', 'freaks'];
    const stats: any = {};

    for (const clique of cliques) {
      // Get total votes for this clique
      const { data: votes, error } = await supabase
        .from('picture_day_votes')
        .select('*')
        .eq('clique', clique);

      if (error) {
        console.error(`Error fetching votes for ${clique}:`, error);
        stats[clique] = { totalVotes: 0 };
      } else {
        stats[clique] = { totalVotes: votes?.length || 0 };
      }
    }

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching picture day stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
}
