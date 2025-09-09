import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';
import { canUserVoteForCandidate, getFlunksCount } from '../../../utils/votingPower';

// Check if we're in build mode
const isBuildMode = process.env.NEXT_PUBLIC_BUILD_MODE === 'build';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Only allow access in build mode
  if (!isBuildMode) {
    return res.status(403).json({ error: 'Picture Day voting is only available in build mode' });
  }

  const { clique, candidateId, userWallet } = req.body;

  if (!clique || !candidateId || !userWallet) {
    return res.status(400).json({ error: 'Clique, candidateId, and userWallet are required' });
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const validCliques = ['preps', 'jocks', 'geeks', 'freaks'];
  if (!validCliques.includes(clique)) {
    return res.status(400).json({ error: 'Invalid clique' });
  }

  try {
    // Get user's Flunks count
    const flunksCount = await getFlunksCount(userWallet);

    // Check if user can vote for this candidate
    const voteCheck = await canUserVoteForCandidate(userWallet, clique, candidateId, flunksCount);
    
    if (!voteCheck.canVote) {
      return res.status(400).json({ error: voteCheck.reason });
    }

    // Verify candidate exists and belongs to the correct clique
    const { data: candidate, error: candidateError } = await supabase
      .from('picture_day_candidates')
      .select('*')
      .eq('id', candidateId)
      .eq('clique', clique)
      .single();

    if (candidateError || !candidate) {
      return res.status(400).json({ error: 'Invalid candidate' });
    }

    // Cast the vote
    const { data: voteData, error: voteError } = await supabase
      .from('picture_day_votes')
      .insert([
        {
          user_wallet: userWallet,
          clique,
          candidate_id: candidateId
        }
      ]);

    if (voteError) {
      console.error('Error casting vote:', voteError);
      return res.status(500).json({ error: 'Failed to cast vote' });
    }

    res.status(200).json({ 
      success: true, 
      message: `Vote cast successfully for ${candidate.name}!`,
      candidateName: candidate.name
    });
  } catch (error) {
    console.error('Error processing vote:', error);
    res.status(500).json({ error: 'Failed to process vote' });
  }
}
