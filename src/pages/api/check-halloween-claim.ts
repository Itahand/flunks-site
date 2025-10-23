import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

/**
 * Check if user has claimed Halloween GumDrop
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address } = req.query;

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  try {
    // Check if user has a Halloween GumDrop claim transaction
    const { data: transactions, error } = await supabase
      .from('user_gum_transactions')
      .select('*')
      .eq('wallet_address', address)
      .eq('transaction_type', 'HALLOWEEN_GUMDROP')
      .limit(1);

    if (error) {
      throw error;
    }

    const claimed = transactions && transactions.length > 0;

    return res.status(200).json({
      success: true,
      claimed,
      claimDate: claimed ? transactions[0].timestamp : null,
    });
  } catch (error: any) {
    console.error('Error checking Halloween claim:', error);
    return res.status(500).json({
      error: 'Failed to check claim status',
      details: error.message,
    });
  }
}
