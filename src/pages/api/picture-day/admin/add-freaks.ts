import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../../lib/supabase';

// Check if we're in build mode
const isBuildMode = process.env.NEXT_PUBLIC_BUILD_MODE === 'build';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow access in build mode
  if (!isBuildMode) {
    return res.status(403).json({ error: 'Picture Day admin functions are only available in build mode' });
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  if (req.method === 'POST') {
    try {
      // Add freak candidates
      const freakCandidates = [
        { clique: 'freaks', name: 'Rebel Skull', photo_url: '/images/picture-day/freaks/freak-1.png' },
        { clique: 'freaks', name: 'Pink Punk', photo_url: '/images/picture-day/freaks/freak-2.png' },
        { clique: 'freaks', name: 'Cool Geek', photo_url: '/images/picture-day/freaks/freak-3.png' }
      ];

      const { data, error } = await supabase
        .from('picture_day_candidates')
        .insert(freakCandidates)
        .select();

      if (error) {
        console.error('Error adding candidates:', error);
        return res.status(500).json({ error: 'Failed to add candidates' });
      }

      res.status(200).json({ message: 'Freak candidates added successfully!', data });
    } catch (error) {
      console.error('Error adding candidates:', error);
      res.status(500).json({ error: 'Failed to add candidates' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}