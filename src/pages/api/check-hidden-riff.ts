import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { walletAddress } = req.query;

  if (!walletAddress || typeof walletAddress !== 'string') {
    return res.status(400).json({ 
      success: false, 
      error: 'Wallet address is required' 
    });
  }

  try {
    // Check if user has completed the hidden_riff (check gum_transactions)
    const { data: transactions, error } = await supabase
      .from('gum_transactions')
      .select('*')
      .eq('wallet_address', walletAddress)
      .eq('source_name', 'hidden_riff')
      .limit(1);

    if (error) {
      throw error;
    }

    const hasCompleted = transactions && transactions.length > 0;

    return res.status(200).json({
      success: true,
      hasCompleted,
      transactionCount: transactions?.length || 0
    });

  } catch (error: any) {
    console.error('Error checking hidden riff completion:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to check completion status',
      details: error.message
    });
  }
}
