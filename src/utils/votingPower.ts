// Utility functions for Picture Day voting system
import { supabase } from '../lib/supabase';

export interface VotingPower {
  maxVotes: number;
  flunksCount: number;
  tier: string;
}

export interface UserVoteStatus {
  votingPower: VotingPower;
  votesUsed: number;
  remainingVotes: number;
  canVote: boolean;
}

/**
 * Calculate voting power based on Flunks count
 * 1-10 Flunks = 1 vote per clique
 * 11-20 Flunks = 2 votes per clique  
 * 21-30 Flunks = 3 votes per clique
 * 31+ Flunks = 3 votes per clique (capped)
 */
export function calculateVotingPower(flunksCount: number): VotingPower {
  let maxVotes: number;
  let tier: string;

  if (flunksCount >= 31) {
    maxVotes = 3;
    tier = 'Elite (31+ Flunks)';
  } else if (flunksCount >= 21) {
    maxVotes = 3;
    tier = 'Power Voter (21-30 Flunks)';
  } else if (flunksCount >= 11) {
    maxVotes = 2;
    tier = 'Regular Voter (11-20 Flunks)';
  } else if (flunksCount >= 1) {
    maxVotes = 1;
    tier = 'New Voter (1-10 Flunks)';
  } else {
    maxVotes = 0;
    tier = 'No Flunks';
  }

  return {
    maxVotes,
    flunksCount,
    tier
  };
}

/**
 * Get user's vote status for a specific clique
 */
export async function getUserVoteStatus(
  userWallet: string, 
  clique: string, 
  flunksCount: number
): Promise<UserVoteStatus> {
  if (!supabase) {
    throw new Error('Database not configured');
  }

  const votingPower = calculateVotingPower(flunksCount);

  // Get current vote count for this user/clique
  const { data: votes, error } = await supabase
    .from('picture_day_votes')
    .select('*')
    .eq('user_wallet', userWallet)
    .eq('clique', clique);

  if (error) {
    throw new Error('Failed to fetch vote status');
  }

  const votesUsed = votes?.length || 0;
  const remainingVotes = Math.max(0, votingPower.maxVotes - votesUsed);

  return {
    votingPower,
    votesUsed,
    remainingVotes,
    canVote: remainingVotes > 0 && votingPower.maxVotes > 0
  };
}

/**
 * Check if user can vote for a specific candidate
 */
export async function canUserVoteForCandidate(
  userWallet: string,
  clique: string,
  candidateId: string,
  flunksCount: number
): Promise<{canVote: boolean, reason?: string}> {
  const voteStatus = await getUserVoteStatus(userWallet, clique, flunksCount);
  
  if (!voteStatus.canVote) {
    if (voteStatus.votingPower.maxVotes === 0) {
      return { canVote: false, reason: 'You need at least 1 Flunk to vote' };
    }
    return { canVote: false, reason: `You've used all ${voteStatus.votingPower.maxVotes} votes for this clique` };
  }

  // Allow multiple votes for the same candidate as long as user has remaining votes
  return { canVote: true };
}

/**
 * Get Flunks count from wallet using API endpoint with caching
 */
export async function getFlunksCount(walletAddress: string): Promise<number> {
  try {
    console.log('🔍 VotingPower: Getting Flunks count for wallet:', walletAddress);
    
    // First try the API endpoint approach (better for caching)
    try {
      const response = await fetch(`/api/user-flunks-count?wallet=${walletAddress}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ VotingPower: Flunks count from API:', data.flunksCount);
        return data.flunksCount || 0;
      }
    } catch (apiError) {
      console.warn('⚠️ VotingPower: API endpoint failed, trying direct call');
    }
    
    // Fallback to direct function call
    const { getOwnerTokenIdsWhale } = await import('../web3/script-get-owner-token-ids-whale');
    
    const result = await getOwnerTokenIdsWhale(walletAddress);
    
    if (!result || typeof result !== 'object') {
      console.warn('⚠️ VotingPower: Invalid data received:', result);
      return 0;
    }
    
    const flunks = Array.isArray(result.flunks) ? result.flunks : [];
    const flunksCount = flunks.length;
    
    console.log('✅ VotingPower: Flunks count retrieved:', flunksCount);
    return flunksCount;
    
  } catch (error) {
    console.error('❌ VotingPower: Error fetching Flunks count:', error);
    return 0;
  }
}

/**
 * Voting tier descriptions for UI
 */
export const VOTING_TIERS = {
  0: { name: 'No Access', description: 'You need at least 1 Flunk to vote', color: '#999', votes: 0 },
  1: { name: 'New Voter', description: '1-10 Flunks', color: '#4ECDC4', votes: 1 },
  2: { name: 'Regular Voter', description: '11-20 Flunks', color: '#45B7D1', votes: 2 },
  3: { name: 'Power Voter', description: '21-30 Flunks', color: '#96CEB4', votes: 3 },
  4: { name: 'Elite Voter', description: '31+ Flunks', color: '#FFD700', votes: 3 }
} as const;
