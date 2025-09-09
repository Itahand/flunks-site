import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../../lib/supabase';

// Check if we're in build mode
const isBuildMode = process.env.NEXT_PUBLIC_BUILD_MODE === 'build';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Only allow access in build mode
  if (!isBuildMode) {
    return res.status(403).json({ error: 'Picture Day admin functions are only available in build mode' });
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    // Get all candidates
    const { data: candidates, error } = await supabase
      .from('picture_day_candidates')
      .select('*')
      .order('clique', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching candidates:', error);
      return res.status(500).json({ error: 'Failed to fetch candidates' });
    }

    res.status(200).json(candidates || []);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
}
