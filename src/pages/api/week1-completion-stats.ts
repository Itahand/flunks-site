import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📊 Checking Week 1 completion stats...');
    
    // Get all users who completed The Slacker objective (cafeteria button clicks)
    const { data: slackerUsers, error: slackerError } = await supabase
      .from('cafeteria_button_clicks')
      .select('wallet_address')
      .order('created_at', { ascending: false });

    if (slackerError) {
      console.error('❌ Error fetching slacker users:', slackerError);
      throw slackerError;
    }

    // Get all users who completed The Overachiever objective (access code 8004)
    const { data: overachieverUsers, error: overachieverError } = await supabase
      .from('digital_lock_attempts')
      .select('wallet_address')
      .eq('code_entered', '8004')
      .eq('success', true)
      .order('created_at', { ascending: false });

    if (overachieverError) {
      console.error('❌ Error fetching overachiever users:', overachieverError);
      throw overachieverError;
    }

    // Get unique wallet addresses for each objective
    const uniqueSlackerWallets = [...new Set(slackerUsers?.map(u => u.wallet_address) || [])];
    const uniqueOverachieverWallets = [...new Set(overachieverUsers?.map(u => u.wallet_address) || [])];

    // Find users who completed BOTH objectives
    const completedBothObjectives = uniqueSlackerWallets.filter(wallet => 
      uniqueOverachieverWallets.includes(wallet)
    );

    const stats = {
      week: 1,
      objectives: {
        slacker: {
          name: 'The Slacker',
          description: 'Find and click the cafeteria button',
          completedBy: uniqueSlackerWallets.length,
          wallets: uniqueSlackerWallets
        },
        overachiever: {
          name: 'The Overachiever', 
          description: 'Crack the access code 8004',
          completedBy: uniqueOverachieverWallets.length,
          wallets: uniqueOverachieverWallets
        }
      },
      summary: {
        totalUniqueParticipants: [...new Set([...uniqueSlackerWallets, ...uniqueOverachieverWallets])].length,
        completedBothObjectives: completedBothObjectives.length,
        completedBothWallets: completedBothObjectives,
        week1CompletionRate: completedBothObjectives.length > 0 ? 100 : 0
      }
    };

    console.log('✅ Week 1 Stats:', stats);

    return res.status(200).json({
      success: true,
      stats,
      message: `Week 1: ${completedBothObjectives.length} users completed both objectives (100%)`
    });

  } catch (error) {
    console.error('❌ Error checking Week 1 completion:', error);
    return res.status(500).json({ 
      error: 'Failed to check completion stats',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
