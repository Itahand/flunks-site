import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    // Get recent successful attempts
    const { data: recentSuccesses, error: recentError } = await supabase
      .from('digital_lock_attempts')
      .select('wallet_address, attempt_timestamp')
      .eq('success', true)
      .order('attempt_timestamp', { ascending: false })
      .limit(10);

    if (recentError) {
      throw recentError;
    }

    // Get total stats
    const { data: allAttempts, error: allError } = await supabase
      .from('digital_lock_attempts')
      .select('success, wallet_address');

    if (allError) {
      throw allError;
    }

    const totalAttempts = allAttempts?.length || 0;
    const successfulAttempts = allAttempts?.filter(a => a.success).length || 0;
    const failedAttempts = totalAttempts - successfulAttempts;
    const successRate = totalAttempts > 0 ? (successfulAttempts / totalAttempts * 100).toFixed(1) : '0';
    const uniqueUsers = new Set(allAttempts?.map(a => a.wallet_address)).size;
    const uniqueSuccessfulUsers = new Set(allAttempts?.filter(a => a.success).map(a => a.wallet_address)).size;

    return res.status(200).json({
      success: true,
      stats: {
        totalAttempts,
        successfulAttempts,
        failedAttempts,
        successRate: parseFloat(successRate),
        uniqueUsers,
        uniqueSuccessfulUsers,
        recentSuccesses: recentSuccesses?.map(s => ({
          wallet: s.wallet_address.slice(0, 8) + '...' + s.wallet_address.slice(-4),
          timestamp: s.attempt_timestamp
        })) || []
      }
    });

  } catch (error) {
    console.error('Error fetching digital lock stats:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch stats',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
