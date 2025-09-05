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

    console.log('📊 Week 2 completion stats request received');

    // Get all users who completed The Overachiever objective (code 0730)
    const { data: overachieverUsers, error: overachieverError } = await supabase
      .from('digital_lock_attempts')
      .select('wallet_address, attempt_timestamp')
      .eq('code_entered', '0730')
      .eq('success', true)
      .order('attempt_timestamp', { ascending: false });

    if (overachieverError) {
      console.error('❌ Error fetching Week 2 overachiever users:', overachieverError);
      throw overachieverError;
    }

    console.log('✅ Week 2 overachiever users:', overachieverUsers?.length || 0);

    // Get unique wallets for each objective
    const uniqueOverachieverWallets = [...new Set(overachieverUsers?.map(u => u.wallet_address) || [])];

    console.log('📊 Week 2 Stats calculated:', {
      uniqueOverachieverWallets: uniqueOverachieverWallets.length
    });

    return res.status(200).json({
      success: true,
      week: 2,
      data: {
        objectives: {
          overachiever: {
            name: 'The Overachiever (Week 2)', 
            description: 'Crack the digital lock code (0730)',
            completedBy: uniqueOverachieverWallets.length,
            wallets: uniqueOverachieverWallets
          }
        },
        summary: {
          totalUniqueParticipants: uniqueOverachieverWallets.length,
          overallCompletionRate: uniqueOverachieverWallets.length > 0 ? 100 : 0 // Only one objective in Week 2
        }
      }
    });

  } catch (error) {
    console.error('❌ Week 2 completion stats error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch Week 2 completion stats',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
