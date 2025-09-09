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

  const { candidateId } = req.query;

  if (req.method === 'GET') {
    // Get candidate info
    try {
      const { data: candidate, error } = await supabase
        .from('picture_day_candidates')
        .select('*')
        .eq('id', candidateId)
        .single();

      if (error || !candidate) {
        return res.status(404).json({ error: 'Candidate not found' });
      }

      res.status(200).json(candidate);
    } catch (error) {
      console.error('Error fetching candidate:', error);
      res.status(500).json({ error: 'Failed to fetch candidate' });
    }
  } else if (req.method === 'PUT') {
    // Update candidate photo URL
    const { photoUrl, name } = req.body;

    try {
      const updateData: any = {};
      if (photoUrl) updateData.photo_url = photoUrl;
      if (name) updateData.name = name;
      updateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('picture_day_candidates')
        .update(updateData)
        .eq('id', candidateId);

      if (error) {
        console.error('Error updating candidate:', error);
        return res.status(500).json({ error: 'Failed to update candidate' });
      }

      res.status(200).json({ success: true, message: 'Candidate updated successfully' });
    } catch (error) {
      console.error('Error updating candidate:', error);
      res.status(500).json({ error: 'Failed to update candidate' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
