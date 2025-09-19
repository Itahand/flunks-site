import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Get all scores first
  const { data: allScores, error } = await supabase
    .from('flunky_uppy_scores')
    .select('wallet, score, timestamp, metadata')
    .order('score', { ascending: false })
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('🔥 Supabase SELECT error:', error);
    return res.status(500).json({ error: error.message });
  }

  // Group by wallet and keep only the highest score for each wallet
  const walletBestScores = new Map();
  
  allScores?.forEach((scoreEntry: any) => {
    const wallet = scoreEntry.wallet;
    const existingBest = walletBestScores.get(wallet);
    
    if (!existingBest || scoreEntry.score > existingBest.score) {
      walletBestScores.set(wallet, scoreEntry);
    }
  });

  // Convert map back to array and sort by score (highest first)
  const uniqueTopScores = Array.from(walletBestScores.values())
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score; // Higher score first
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(); // More recent first for ties
    })
    .slice(0, 50); // Limit to top 50 unique players

  // Get unique wallet addresses for profile lookup
  const walletAddresses = uniqueTopScores.map(row => row.wallet);
  
  // Fetch user profiles for those wallets
  const { data: profiles, error: profileError } = await supabase
    .from('user_profiles')
    .select('wallet_address, username, profile_icon')
    .in('wallet_address', walletAddresses);

  if (profileError) {
    console.error('⚠️ Profile fetch error (non-critical):', profileError);
  }

  // Create a map for quick profile lookup
  const profileMap = new Map();
  profiles?.forEach((profile: any) => {
    profileMap.set(profile.wallet_address, profile);
  });

  // Combine scores with profile data
  const leaderboard = uniqueTopScores.map((scoreEntry: any, index: number) => {
    const profile = profileMap.get(scoreEntry.wallet);
    
    return {
      rank: index + 1,
      wallet: scoreEntry.wallet,
      score: scoreEntry.score,
      timestamp: scoreEntry.timestamp,
      username: profile?.username || scoreEntry.metadata?.username || null,
      profile_icon: profile?.profile_icon || '🦘',
      formatted_date: new Date(scoreEntry.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    };
  });

  console.log(`🦘 Flunky Uppy leaderboard fetched: ${leaderboard.length} unique players`);
  
  return res.status(200).json({ 
    success: true, 
    leaderboard,
    total_unique_players: leaderboard.length,
    total_scores: allScores?.length || 0
  });
}