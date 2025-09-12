import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../../lib/supabase';
import { getUserVoteStatus, getFlunksCount } from '../../../../utils/votingPower';

// Check if we're in build mode
const isBuildMode = process.env.NEXT_PUBLIC_BUILD_MODE === 'build';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Picture Day API is now available in both build and public modes
  // Removed build mode restriction

  const { clique } = req.query;
  const userWallet = req.headers['x-wallet-address'] as string;

  if (!clique || typeof clique !== 'string') {
    return res.status(400).json({ error: 'Clique parameter is required' });
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const validCliques = ['preps', 'jocks', 'geeks', 'freaks'];
  if (!validCliques.includes(clique)) {
    return res.status(400).json({ error: 'Invalid clique' });
  }

  try {
    // Get all candidates for this clique
    const { data: candidates, error: candidatesError } = await supabase
      .from('picture_day_candidates')
      .select('*')
      .eq('clique', clique)
      .order('name');

    if (candidatesError) {
      console.error('Error fetching candidates:', candidatesError);
      return res.status(500).json({ error: 'Failed to fetch candidates' });
    }

    // Get vote counts for each candidate
    const candidatesWithVotes = await Promise.all(
      (candidates || []).map(async (candidate) => {
        const { data: votes, error: votesError } = await supabase
          .from('picture_day_votes')
          .select('*')
          .eq('candidate_id', candidate.id);

        if (votesError) {
          console.error('Error fetching votes for candidate:', votesError);
          return {
            id: candidate.id,
            name: candidate.name,
            photoUrl: candidate.image_url,
            votes: 0,
            userVotedFor: false
          };
        }

        // Check if current user voted for this candidate
        const userVotedFor = userWallet ? 
          votes?.some(vote => vote.user_wallet === userWallet) || false : 
          false;

        return {
          id: candidate.id,
          name: candidate.name,
          photoUrl: candidate.image_url,
          votes: votes?.length || 0,
          userVotedFor
        };
      })
    );

    // Get total votes for this clique
    const { data: allVotes, error: allVotesError } = await supabase
      .from('picture_day_votes')
      .select('*')
      .eq('clique', clique);

    const totalVotes = allVotes?.length || 0;

    // Get user's voting status if wallet is provided
    let userVoteStatus = null;
    if (userWallet) {
      try {
        const flunksCount = await getFlunksCount(userWallet);
        userVoteStatus = await getUserVoteStatus(userWallet, clique, flunksCount);
      } catch (error) {
        console.error('Error fetching user vote status:', error);
        // Continue without user status if there's an error
      }
    }

    res.status(200).json({
      candidates: candidatesWithVotes,
      totalVotes,
      userVoteStatus,
      requiresAuth: !userWallet
    });
  } catch (error) {
    console.error('Error fetching clique data:', error);
    res.status(500).json({ error: 'Failed to fetch clique data' });
  }
}
