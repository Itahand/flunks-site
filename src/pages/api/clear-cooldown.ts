import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ message: 'Supabase not configured' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { walletAddress, source } = req.body;

  if (!walletAddress || !source) {
    return res.status(400).json({ message: 'Wallet address and source are required' });
  }

  try {
    // Clear the cooldown record
    const { data, error } = await supabase
      .from('user_gum_cooldowns')
      .delete()
      .eq('wallet_address', walletAddress)
      .eq('source_name', source);

    if (error) {
      console.error('Error clearing cooldown:', error);
      return res.status(500).json({ message: 'Failed to clear cooldown', error: error.message });
    }

    console.log(`✅ Cleared cooldown for wallet ${walletAddress}, source: ${source}`);
    return res.status(200).json({ 
      success: true,
      message: `Cooldown cleared for ${source}`,
      deleted: data
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}